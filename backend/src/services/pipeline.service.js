import { generateJSON } from "./llm/geminiProvider.js";
import {
  buildProblemPrompt,
  buildTestInputsPrompt,
  buildBruteForcePrompt,
} from "./llm/prompts.js";
import {
  problemSchema,
  testInputsSchema,
  bruteForceSchema,
} from "../schemas/problem.schema.js";
import { runCode } from "./judge0.service.js";
import { cleanTestInputs } from "./validator.service.js";
import { outputsMatch } from "../utils/normalizeOutput.js";

const MAX_AI_ATTEMPTS = 2;
const MAX_PROBLEM_ATTEMPTS = 3;
const SANDBOX_CONCURRENCY = 3;

// ---------- helpers ----------

// Calls Gemini and checks the answer against a zod schema, retrying once.
async function generateValidated(prompt, schema, label) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_AI_ATTEMPTS; attempt++) {
    try {
      const raw = await generateJSON(prompt);
      return schema.parse(raw);
    } catch (err) {
      lastError = err;
      console.warn(`${label} attempt ${attempt} failed: ${err.message.slice(0, 120)}`);
    }
  }
  throw lastError;
}

// Runs async work on a list with at most `limit` running at once.
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// Never throws: a sandbox failure becomes a visible result, not a crash.
async function safeRun(params) {
  try {
    return await runCode(params);
  } catch (err) {
    return {
      ok: false,
      status: "Sandbox error",
      stdout: "",
      stderr: err.message,
      compileOutput: "",
    };
  }
}

// ---------- stage 1: the problem ----------

async function generateProblem(config) {
  try {
    return await generateValidated(buildProblemPrompt(config), problemSchema, "Problem");
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 502;
    error.publicMessage = "The AI returned an invalid response. Please try again.";
    throw error;
  }
}

async function verifySample(problem, language) {
  const result = await safeRun({
    language,
    sourceCode: problem.referenceSolution,
    stdin: problem.sampleInput,
  });

  if (result.status === "Sandbox error") {
    return { status: "unavailable", message: result.stderr };
  }
  if (!result.ok) {
    return {
      status: "error",
      message: result.status,
      details: result.stderr || result.compileOutput || "",
    };
  }
  return {
    status: outputsMatch(result.stdout, problem.sampleOutput) ? "verified" : "mismatch",
    expectedOutput: problem.sampleOutput,
    actualOutput: result.stdout.trim(),
    timeSeconds: result.timeSeconds,
  };
}

// ---------- stage 2: tests and differential validation ----------

function classify(refRun, bruteRun) {
  if (!refRun.ok) {
    return {
      status: "error",
      note: `Reference solution failed: ${refRun.status}`,
      details: refRun.stderr || refRun.compileOutput || "",
    };
  }
  const refOut = refRun.stdout.trim();

    if (!bruteRun.ok) {
    const reason = (bruteRun.stderr || bruteRun.compileOutput || "").slice(-200);
    return {
      status: "unverified",
      expectedOutput: refOut,
      note: `Brute-force solution failed (${bruteRun.status}), so this output has no second opinion. ${reason}`.trim(),
    };
  }

  const bruteOut = bruteRun.stdout.trim();

  if (outputsMatch(refOut, bruteOut)) {
    return {
      status: "verified",
      expectedOutput: refOut,
      note: "Reference and independent brute-force solutions agree.",
    };
  }
  return {
    status: "disputed",
    expectedOutput: null,
    referenceOutput: refOut,
    bruteForceOutput: bruteOut,
    note: "The two solutions disagree, so one of them is wrong.",
  };
}

// Writes a brute-force solution and checks it on the sample.
// If it crashes or gives the wrong answer, it is regenerated (up to 3 tries).
async function getWorkingBruteForce(problem) {
  const MAX_TRIES = 3;
  let last = null;

  for (let i = 1; i <= MAX_TRIES; i++) {
    const brute = await generateValidated(
      buildBruteForcePrompt(problem),
      bruteForceSchema,
      "Brute force"
    );
    const run = await safeRun({
      language: "Python",
      sourceCode: brute.code,
      stdin: problem.sampleInput,
    });
    const sampleStatus = !run.ok
      ? "error"
      : outputsMatch(run.stdout, problem.sampleOutput)
      ? "verified"
      : "mismatch";

    last = { approach: brute.approach, code: brute.code, sampleStatus, attempts: i };
    if (sampleStatus === "verified") return last;
    console.warn(`Brute force try ${i}: sample ${sampleStatus}, regenerating...`);
  }
  return last;
}

async function buildTestSuite(problem, language) {
  // The two AI calls are independent, so they run at the same time.
  const [inputs, bruteForce] = await Promise.all([
    generateValidated(buildTestInputsPrompt(problem), testInputsSchema, "Test inputs"),
    getWorkingBruteForce(problem),
  ]);

  const { accepted, rejected } = cleanTestInputs(inputs.testCases, problem.sampleInput);

  const testCases = await mapLimit(accepted, SANDBOX_CONCURRENCY, async (tc) => {
    const refRun = await safeRun({
      language,
      sourceCode: problem.referenceSolution,
      stdin: tc.input,
    });
    const bruteRun = await safeRun({
      language: "Python",
      sourceCode: bruteForce.code,
      stdin: tc.input,
    });
    return {
      category: tc.category,
      input: tc.input,
      explanation: tc.explanation,
      ...classify(refRun, bruteRun),
    };
  });

  const count = (s) => testCases.filter((t) => t.status === s).length;
  const summary = {
    total: testCases.length,
    verified: count("verified"),
    disputed: count("disputed"),
    unverified: count("unverified"),
    error: count("error"),
    rejectedInputs: rejected.length,
  };

  return { testCases, bruteForce, summary };
}



// ---------- the full pipeline ----------

// A problem whose own sample check failed can never have "verified" tests.
function downgradeTests(testCases, sampleStatus) {
  const downgraded = testCases.map((tc) =>
    tc.status === "verified"
      ? {
          ...tc,
          status: "unverified",
          note: `Both solutions agree, but the problem's own sample check failed (${sampleStatus}), so this problem is unreliable.`,
        }
      : tc
  );
  const count = (s) => downgraded.filter((t) => t.status === s).length;
  return {
    testCases: downgraded,
    summary: {
      total: downgraded.length,
      verified: count("verified"),
      disputed: count("disputed"),
      unverified: count("unverified"),
      error: count("error"),
    },
  };
}

// Phrases that show the model "thinking aloud" inside the problem text,
// plus LaTeX leftovers that the UI cannot render.
const LEAK_PATTERNS = [
  /(^|[.!?:]\s+)Wait\b/m,
  /(^|[.!?]\s+)Actually,/m,
  /let'?s (re-?define|refine|re-?think|re-?calculate|recompute|re-?evaluate)/i,
  /\blet me (re|think|correct)/i,
  /\bhold on\b/i,
  /\bon second thought\b/i,
  /\bhmm+\b/i,
  /\boops\b/i,
  /\\(neq|leq|geq|le|ge|cdot|times|sum|text|frac)\b/,
];

export function findLeaks(problem) {
  const text = [
    problem.statement,
    problem.description,
    problem.sampleExplanation,
    problem.inputFormat,
    problem.outputFormat,
    ...problem.constraints,
  ].join("\n");
  return LEAK_PATTERNS.filter((p) => p.test(text)).map((p) => p.source);
}

export async function runPipeline(config) {
  let problem;
  let sample;
  let leaks = [];
  let attempts = 0;

  for (let attempt = 1; attempt <= MAX_PROBLEM_ATTEMPTS; attempt++) {
    attempts = attempt;
    problem = await generateProblem(config);

    // Cheap text check first: skip the sandbox for a problem we will discard anyway.
    leaks = findLeaks(problem);
    if (leaks.length > 0 && attempt < MAX_PROBLEM_ATTEMPTS) {
      console.warn(`Attempt ${attempt}: drafting text found in problem, regenerating...`);
      continue;
    }

    sample = await verifySample(problem, config.language);

    if (sample.status === "verified" && leaks.length === 0) break;
    if (sample.status === "unavailable") break; // regenerating will not fix a down sandbox

    console.warn(`Attempt ${attempt}: sample check ${sample.status}, regenerating...`);
  }

  const validation = { sample, attempts, leakedText: leaks.length > 0 };

  // No point testing if the sandbox is down.
  if (sample.status === "unavailable") {
    return { problem, testCases: [], validation };
  }

  try {
    const suite = await buildTestSuite(problem, config.language);
    let { testCases, summary } = suite;

    if (sample.status !== "verified") {
      const result = downgradeTests(testCases, sample.status);
      testCases = result.testCases;
      summary = { ...summary, ...result.summary };
    }

    return {
      problem,
      testCases,
      validation: { ...validation, bruteForce: suite.bruteForce, summary },
    };
  } catch (err) {
    console.warn("Test suite failed:", err.message.slice(0, 150));
    return {
      problem,
      testCases: [],
      validation: { ...validation, testSuiteError: "Test generation failed. Please try again." },
    };
  }
}
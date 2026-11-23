import { generateJSON } from "./src/services/llm/geminiProvider.js";
import { buildBruteForcePrompt } from "./src/services/llm/prompts.js";
import { bruteForceSchema } from "./src/schemas/problem.schema.js";
import { runCode } from "./src/services/judge0.service.js";
import { outputsMatch } from "./src/utils/normalizeOutput.js";

const problem = {
  description:
    "Given a sentence of words separated by single spaces, form its acronym by taking the first letter of each word and converting it to uppercase.",
  inputFormat: "A single line containing a string of space-separated words.",
  outputFormat: "A single line containing the uppercase acronym.",
  constraints: [
    "The string length is between 1 and 1000 characters.",
    "The string contains only English letters and single spaces.",
  ],
  sampleInput: "coding competitive programming is fun",
  sampleOutput: "CCPIF",
};

try {
  const raw = await generateJSON(buildBruteForcePrompt(problem));
  const brute = bruteForceSchema.parse(raw);
  console.log("APPROACH:", brute.approach);
  console.log("\nCODE:\n" + brute.code);

  const result = await runCode({
    language: "Python",
    sourceCode: brute.code,
    stdin: problem.sampleInput,
  });
  console.log("\nSANDBOX STATUS:", result.status);
  console.log("OUTPUT:", JSON.stringify(result.stdout));
  console.log("MATCHES SAMPLE:", outputsMatch(result.stdout, problem.sampleOutput));
} catch (err) {
  console.log("FAILED:", err.message);
}
import { ShieldCheck } from "lucide-react";
import CodeBlock from "../common/CodeBlock";

const SAMPLE_TEXT = {
  verified: {
    text: "Sample output confirmed by running the reference solution in the sandbox.",
    color: "text-green-300",
  },
  mismatch: {
    text: "Sample output does NOT match what the reference solution prints. Treat this problem as unreliable.",
    color: "text-amber-300",
  },
  error: {
    text: "The reference solution crashed or failed to compile in the sandbox.",
    color: "text-red-300",
  },
  unavailable: {
    text: "The sandbox was unreachable, so nothing could be verified.",
    color: "text-red-300",
  },
};

function Stat({ label, value, color }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function Verdict({ validation }) {
  const { sample, summary } = validation;
  const green = "border-green-500/30 bg-green-500/10 text-green-200";
  const amber = "border-amber-500/30 bg-amber-500/10 text-amber-200";
  const red = "border-red-500/30 bg-red-500/10 text-red-200";

  let tone = green;
  let title = "All tests verified";
  let text = "The sample check passed and both solutions agree on every test.";

  if (!summary) {
    tone = red;
    title = "Not validated";
    text = "Test generation did not complete, so nothing beyond the sample could be checked.";
  } else if (sample.status !== "verified") {
    tone = red;
    title = "Unreliable problem";
    text = "The problem's own sample check failed, so no test can be trusted.";
  } else if (summary.disputed > 0) {
    tone = amber;
    title = "Needs review";
    text = `${summary.disputed} of ${summary.total} tests are disputed: the two solutions disagree. Either solution, or the problem statement itself, may be wrong.`;
  } else if (summary.verified < summary.total) {
    tone = amber;
    title = "Partially verified";
    text = `${summary.verified} of ${summary.total} tests verified. The rest have no independent second opinion.`;
  }

  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-90">{text}</p>
    </div>
  );
}

export default function ValidationReport({ validation }) {
  const sample = validation.sample;
  const summary = validation.summary;
  const sampleInfo = SAMPLE_TEXT[sample.status] || SAMPLE_TEXT.error;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck size={18} className="text-indigo-300" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
          Validation Report
        </h3>
      </div>

            <div className="space-y-4">
        <Verdict validation={validation} />
        <div>
          <p className={`text-sm font-medium ${sampleInfo.color}`}>
            Sample check: {sample.status}
          </p>
          <p className="text-sm text-gray-400">{sampleInfo.text}</p>
          {sample.status === "mismatch" && (
            <p className="mt-1 text-sm text-gray-400">
              Expected {JSON.stringify(sample.expectedOutput)}, solution printed{" "}
              {JSON.stringify(sample.actualOutput)}.
            </p>
          )}
                    {validation.leakedText && (
            <p className="mt-1 text-xs text-amber-300">
              Warning: the problem text may contain leftover drafting notes from the AI.
            </p>
          )}
          {validation.attempts > 1 && (
            <p className="mt-1 text-xs text-gray-500">
              Took {validation.attempts} generation attempts. Earlier attempts failed the sample
              check and were discarded.
            </p>
          )}
        </div>

        {validation.testSuiteError && (
          <p className="text-sm text-red-300">{validation.testSuiteError}</p>
        )}

        {summary && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total tests" value={summary.total} color="text-white" />
            <Stat label="Verified" value={summary.verified} color="text-green-300" />
            <Stat label="Disputed" value={summary.disputed} color="text-amber-300" />
            <Stat
              label="Unverified / Error"
              value={summary.unverified + summary.error}
              color="text-red-300"
            />
          </div>
        )}

        {validation.bruteForce && (
          <div>
            <p className="mb-1 text-sm text-gray-300">
              Independent brute-force solution:{" "}
              <span className="text-gray-400">{validation.bruteForce.approach}</span>
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer text-indigo-300 hover:text-indigo-200">
                Show brute-force code
              </summary>
              <div className="mt-2">
                <CodeBlock code={validation.bruteForce.code} language="Python" label="Python" />
              </div>
            </details>
          </div>
        )}

        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs leading-relaxed text-gray-400">
          <p className="mb-1 font-medium text-gray-300">What "Verified" means</p>
          Expected outputs are not written by the AI. They come from running two independently
          generated solutions in a sandbox, and a test is marked Verified only when both agree.
          This lowers the risk of wrong outputs, but it is not a proof of correctness: both
          solutions could share the same misreading of the problem.
        </div>
      </div>
    </section>
  );
}
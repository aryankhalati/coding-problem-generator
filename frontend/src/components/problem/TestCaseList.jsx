import { CheckCircle2, AlertTriangle, HelpCircle, XCircle } from "lucide-react";
import CodeBlock from "../common/CodeBlock";

const STATUS_STYLES = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    classes: "bg-green-500/15 text-green-300 border-green-500/30",
  },
  disputed: {
    label: "Disputed",
    icon: AlertTriangle,
    classes: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  unverified: {
    label: "Unverified",
    icon: HelpCircle,
    classes: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  },
  error: {
    label: "Error",
    icon: XCircle,
    classes: "bg-red-500/15 text-red-300 border-red-500/30",
  },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.error;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.classes}`}
    >
      <Icon size={12} />
      {style.label}
    </span>
  );
}

function TestCaseCard({ tc, index }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-white">Test {index + 1}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs capitalize text-gray-300">
          {tc.category}
        </span>
        <StatusBadge status={tc.status} />
      </div>

      <p className="mb-3 text-sm text-gray-400">{tc.explanation}</p>

      <div className="grid gap-3 md:grid-cols-2">
        <CodeBlock code={tc.input} language="text" label="Input" />

        {tc.status === "disputed" ? (
          <div className="space-y-2">
            <CodeBlock
              code={tc.referenceOutput || "(empty)"}
              language="text"
              label="Reference solution output"
            />
            <CodeBlock
              code={tc.bruteForceOutput || "(empty)"}
              language="text"
              label="Brute-force output"
            />
          </div>
        ) : tc.status === "error" ? (
          <CodeBlock
            code={tc.details || tc.note || "Unknown error"}
            language="text"
            label="Error"
          />
        ) : (
          <CodeBlock
            code={tc.expectedOutput || "(empty)"}
            language="text"
            label="Expected output"
          />
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500">{tc.note}</p>
    </div>
  );
}

export default function TestCaseList({ testCases }) {
  if (!testCases || testCases.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-300">
          Test Cases
        </h3>
        <p className="text-sm text-gray-400">No test cases were generated for this problem.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-300">
        Test Cases ({testCases.length})
      </h3>
      <div className="space-y-4">
        {testCases.map((tc, i) => (
          <TestCaseCard key={i} tc={tc} index={i} />
        ))}
      </div>
    </section>
  );
}
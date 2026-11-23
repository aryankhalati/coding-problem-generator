import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

const STAGES = [
  { at: 0, label: "Generating the problem and reference solution" },
  { at: 12, label: "Verifying the sample output in the sandbox" },
  { at: 25, label: "Writing test inputs and an independent brute-force solution" },
  { at: 40, label: "Running both solutions on every test case" },
];

export default function LoadingState() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const current = STAGES.reduce((acc, stage, i) => (seconds >= stage.at ? i : acc), 0);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-indigo-200">Building your problem</h3>
        <span className="text-xs text-gray-400">{seconds}s elapsed</span>
      </div>

      <ul className="space-y-3">
        {STAGES.map((stage, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={stage.label} className="flex items-center gap-3 text-sm">
              {done ? (
                <CheckCircle2 size={18} className="text-green-400" />
              ) : active ? (
                <Loader2 size={18} className="animate-spin text-indigo-300" />
              ) : (
                <Circle size={18} className="text-gray-600" />
              )}
              <span
                className={
                  done ? "text-gray-400" : active ? "text-white" : "text-gray-600"
                }
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-gray-500">
        This usually takes 30 to 90 seconds. Problems that fail the sandbox check are discarded
        and regenerated automatically.
      </p>
    </div>
  );
}
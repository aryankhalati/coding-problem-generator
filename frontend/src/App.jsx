import { Download } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import ConfigForm from "./components/generator/ConfigForm";
import DemoPicker from "./components/generator/DemoPicker";
import LoadingState from "./components/generator/LoadingState";
import ProblemView from "./components/problem/ProblemView";
import ValidationReport from "./components/problem/ValidationReport";
import TestCaseList from "./components/problem/TestCaseList";
import { useGenerateProblem } from "./hooks/useGenerateProblem";

function downloadResult(result) {
  const name = result.problem.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `demo-${name}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const { result, loading, error, generate, loadSaved } = useGenerateProblem();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <ConfigForm onGenerate={generate} loading={loading} />
        <DemoPicker onLoad={loadSaved} disabled={loading} />

        {loading && <LoadingState />}

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="flex items-center justify-between gap-4">
              {result.isSaved ? (
                <p className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-200">
                  Saved result, generated earlier by this app
                  {result.generatedAt
                    ? ` on ${new Date(result.generatedAt).toLocaleString()}`
                    : ""}
                  . Not a live generation.
                </p>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => downloadResult(result)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:border-white/30 hover:text-white"
              >
                <Download size={14} />
                Save result as JSON
              </button>
            </div>
            <ProblemView problem={result.problem} config={result.config} />
            <ValidationReport validation={result.validation} />
            <TestCaseList testCases={result.testCases} />
          </>
        )}
      </main>
    </div>
  );
}
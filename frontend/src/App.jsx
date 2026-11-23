import Navbar from "./components/layout/Navbar";
import ConfigForm from "./components/generator/ConfigForm";
import LoadingState from "./components/generator/LoadingState";
import ProblemView from "./components/problem/ProblemView";
import ValidationReport from "./components/problem/ValidationReport";
import TestCaseList from "./components/problem/TestCaseList";
import { useGenerateProblem } from "./hooks/useGenerateProblem";

export default function App() {
  const { result, loading, error, generate } = useGenerateProblem();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <ConfigForm onGenerate={generate} loading={loading} />

        {loading && <LoadingState />}

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {result && (
          <>
            <ProblemView problem={result.problem} config={result.config} />
            <ValidationReport validation={result.validation} />
            <TestCaseList testCases={result.testCases} />
          </>
        )}
      </main>
    </div>
  );
}
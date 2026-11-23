import CodeBlock from "../common/CodeBlock";

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-300">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function ProblemView({ problem, config }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-indigo-200">
            {config.topic}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-gray-300">
            {config.difficulty}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-gray-300">
            {config.language}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
        <p className="mt-2 text-gray-400">{problem.statement}</p>
      </div>

      <Section title="Problem Description">
        <p className="whitespace-pre-line leading-relaxed text-gray-300">
          {problem.description}
        </p>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Input Format">
          <p className="whitespace-pre-line text-gray-300">{problem.inputFormat}</p>
        </Section>
        <Section title="Output Format">
          <p className="whitespace-pre-line text-gray-300">{problem.outputFormat}</p>
        </Section>
      </div>

      <Section title="Constraints">
        <ul className="list-inside list-disc space-y-1 text-gray-300">
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section title="Example">
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock code={problem.sampleInput} language="text" label="Sample input" />
          <CodeBlock code={problem.sampleOutput} language="text" label="Sample output" />
        </div>
        <p className="mt-4 whitespace-pre-line text-sm text-gray-400">
          {problem.sampleExplanation}
        </p>
      </Section>

      <Section title="Reference Solution">
        <CodeBlock
          code={problem.referenceSolution}
          language={config.language}
          label={`${config.language} solution`}
        />
        <div className="mt-3 flex gap-4 text-sm text-gray-400">
          <span>Time: {problem.timeComplexity}</span>
          <span>Space: {problem.spaceComplexity}</span>
        </div>
      </Section>
    </div>
  );
}
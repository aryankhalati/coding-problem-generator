import { generateJSON } from "./src/services/llm/geminiProvider.js";
import { buildProblemPrompt } from "./src/services/llm/prompts.js";
import { problemSchema } from "./src/schemas/problem.schema.js";

const prompt = buildProblemPrompt({
  topic: "Arrays",
  difficulty: "Easy",
  language: "Python",
  notes: "",
});

try {
  const raw = await generateJSON(prompt);
  const problem = problemSchema.parse(raw);
  console.log("VALID PROBLEM:\n");
  console.log("Title:", problem.title);
  console.log("\nStatement:", problem.statement);
  console.log("\nSample input:\n" + problem.sampleInput);
  console.log("\nSample output:\n" + problem.sampleOutput);
  console.log("\nSolution:\n" + problem.referenceSolution);
} catch (err) {
  console.log("FAILED:", err.message);
}
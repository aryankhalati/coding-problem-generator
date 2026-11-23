import { generateJSON } from "./src/services/llm/geminiProvider.js";
import { buildTestInputsPrompt } from "./src/services/llm/prompts.js";
import { testInputsSchema } from "./src/schemas/problem.schema.js";
import { cleanTestInputs } from "./src/services/validator.service.js";

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
};

try {
  const raw = await generateJSON(buildTestInputsPrompt(problem));
  const parsed = testInputsSchema.parse(raw);
  const { accepted, rejected } = cleanTestInputs(parsed.testCases, problem.sampleInput);

  console.log(`ACCEPTED: ${accepted.length}  REJECTED: ${rejected.length}\n`);
  for (const tc of accepted) {
    console.log(`[${tc.category}] ${JSON.stringify(tc.input)}  -> ${tc.explanation}`);
  }
  if (rejected.length) console.log("\nREJECTED:", rejected);
} catch (err) {
  console.log("FAILED:", err.message);
}
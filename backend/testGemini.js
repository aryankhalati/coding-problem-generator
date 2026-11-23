import { generateJSON } from "./src/services/llm/geminiProvider.js";

try {
  const result = await generateJSON(
    'Return a JSON object with two keys: "status" set to "ok" and "numbers" set to an array of the first 3 prime numbers.'
  );
  console.log("SUCCESS:", result);
} catch (err) {
  console.log("FAILED:", err.message);
}
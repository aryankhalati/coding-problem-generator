import { runCode } from "./src/services/judge0.service.js";

const pythonSolution = `
import sys
data = sys.stdin.read().split()
print(sum(int(x) for x in data))
`;

try {
  const result = await runCode({
    language: "Python",
    sourceCode: pythonSolution,
    stdin: "1 2 3 4",
  });
  console.log("RESULT:", result);
} catch (err) {
  console.log("FAILED:", err.message);
}
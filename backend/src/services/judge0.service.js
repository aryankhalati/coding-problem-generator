import { env } from "../config/env.js";
import { getLanguageId } from "../config/languages.js";

// Runs ONE program in Judge0's sandbox and returns a clean result.
export async function runCode({ language, sourceCode, stdin }) {
  const response = await fetch(
    `${env.judge0Url}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: getLanguageId(language),
        source_code: sourceCode,
        stdin: stdin,
        cpu_time_limit: 5,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Judge0 error ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = await response.json();

  return {
    status: data.status?.description || "Unknown", // e.g. "Accepted", "Time Limit Exceeded"
    ok: data.status?.id === 3,
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    compileOutput: data.compile_output ?? "",
    timeSeconds: data.time ? Number(data.time) : null,
    memoryKb: data.memory ?? null,
  };
}
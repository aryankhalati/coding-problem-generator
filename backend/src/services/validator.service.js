const MAX_INPUT_LENGTH = 3000;

// Deterministic checks on AI-written test inputs. No AI involved here.
export function cleanTestInputs(testCases, sampleInput) {
  const seen = new Set([sampleInput.trim()]);
  const accepted = [];
  const rejected = [];

  for (const tc of testCases) {
    const input = tc.input.replace(/\r\n/g, "\n").trim() + "\n";

    if (input.trim().length === 0) {
      rejected.push({ ...tc, reason: "empty input" });
    } else if (input.length > MAX_INPUT_LENGTH) {
      rejected.push({ ...tc, reason: "input too long" });
    } else if (seen.has(input.trim())) {
      rejected.push({ ...tc, reason: "duplicate input" });
    } else {
      seen.add(input.trim());
      accepted.push({ ...tc, input });
    }
  }

  return { accepted, rejected };
}
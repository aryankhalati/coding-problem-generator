// Makes output comparison fair: ignores Windows line endings,
// trailing spaces on each line, and extra blank lines at the end.
export function normalizeOutput(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function outputsMatch(actual, expected) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
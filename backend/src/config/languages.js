// Judge0 language IDs, taken from https://ce.judge0.com/languages
export const JUDGE0_LANGUAGE_IDS = {
  Python: 109, // Python 3.13.2
  "C++": 105, // C++ GCC 14.1.0
  Java: 91, // Java JDK 17.0.6
  JavaScript: 102, // Node.js 22
};

export function getLanguageId(language) {
  const id = JUDGE0_LANGUAGE_IDS[language];
  if (!id) throw new Error(`Unsupported language: ${language}`);
  return id;
}
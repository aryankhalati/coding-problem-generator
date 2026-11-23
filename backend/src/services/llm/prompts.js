const THEMES = [
  "a space station",
  "a medieval castle",
  "a video game tournament",
  "a pirate ship",
  "a bakery",
  "a train network",
  "a library",
  "a music festival",
  "a robot factory",
  "a zoo",
  "a cricket league",
  "a haunted house",
  "a farm",
  "a hospital",
  "a deep-sea expedition",
  "a school sports day",
  "a movie studio",
  "a mountain trek",
  "a food delivery app",
  "a weather station",
];

function randomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

function languageRule(language) {
  const rules = {
    Java: "9. The Java program MUST declare exactly one top-level class named Main (public class Main) containing public static void main. Read input with java.util.Scanner or BufferedReader.",
    "C++": "9. The C++ program must be standard C++17, include every header it needs, and read input from cin.",
    JavaScript: "9. The JavaScript program runs on Node.js and must read all of stdin with require('fs').readFileSync(0, 'utf8').",
    Python: "9. The Python program must read stdin using sys.stdin or input().",
  };
  return rules[language] || "";
}

export function buildProblemPrompt({ topic, difficulty, language, notes }) {
  return `You are an expert competitive programming problem setter.

Create ONE original coding problem with these settings:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Reference solution language: ${language}
- Story setting: ${randomTheme()} (use this setting for the story, unless the extra instructions below say otherwise)
${notes ? `- Extra instructions from the user: ${notes}` : ""}

STRICT RULES:
1. The problem must have exactly ONE correct output for every valid input. Never ask for "any valid answer" or anything where multiple outputs are acceptable.
2. The program reads from standard input (stdin) and prints to standard output (stdout). Describe the input and output formats precisely, line by line.
3. Constraints must be small enough that a simple brute-force solution could also solve the problem (for example, n up to 1000 or less), unless the difficulty makes that impossible.
4. Difficulty guide: Easy = single concept, one loop or simple logic. Medium = needs a known technique or a combination of ideas. Hard = needs an optimized algorithm or a tricky insight.
5. Avoid the most generic textbook problems (for example "reverse an array" or "two sum"). Give the problem a short, concrete real-world story.
6. "referenceSolution" must be a COMPLETE, runnable ${language} program, with all imports and a main entry point, that reads stdin and prints stdout. It must contain no markdown fences and no explanations.
7. "sampleInput" must be exactly what is fed to stdin, and "sampleOutput" must be exactly what the program prints. Work the sample out carefully by hand.
8. Do not include test cases here.
${languageRule(language)}
10. Write in plain text only. Do NOT use LaTeX or dollar signs for math. Write constraints and formulas with plain characters, for example: 1 <= N <= 1000, a[i], sum of a[i].
11. The description must be final and polished. Never include self-corrections, drafts, or thinking aloud, and never use phrases like "Wait" or "let's refine". Decide every detail (ties, unreachable cases, special behavior) BEFORE writing, then state each rule exactly once.
12. Every tie or special case must have exactly one defined output. If several answers could tie, specify the tie-break rule (for example, the smallest index).

Return ONLY a JSON object with exactly these keys:
{
  "title": "short problem title",
  "statement": "one or two sentence summary of the task",
  "description": "full problem description with the story and objective",
  "inputFormat": "exact input format, line by line",
  "outputFormat": "exact output format",
  "constraints": ["constraint 1", "constraint 2"],
  "sampleInput": "raw stdin text",
  "sampleOutput": "raw stdout text",
  "sampleExplanation": "step by step explanation of why the sample output is correct",
  "referenceSolution": "complete ${language} program as a plain string",
  "timeComplexity": "for example O(n log n)",
  "spaceComplexity": "for example O(n)"
}`;
}
export function buildTestInputsPrompt(problem) {
  return `You are a QA engineer writing test inputs for a programming problem.

PROBLEM:
${problem.description}

INPUT FORMAT:
${problem.inputFormat}

OUTPUT FORMAT:
${problem.outputFormat}

CONSTRAINTS:
${problem.constraints.join("\n")}

Write exactly 8 test INPUTS. Do NOT write expected outputs, because they will be computed separately by running code.

Required mix:
- 2 "basic": tiny, obvious inputs
- 2 "normal": typical inputs
- 2 "boundary": values at the exact minimum or maximum allowed by the constraints (but keep any list or string short enough to type out, at most about 30 elements or 100 characters)
- 1 "edge": a tricky case such as duplicates, all equal values, negatives (only if allowed), a single element, or a repeated pattern
- 1 "challenging": the largest input you can write out in full (about 30 to 50 elements), designed to break naive or wrong solutions

STRICT RULES:
1. Every input must follow the INPUT FORMAT exactly: same number of lines, same separators, and the first line counts must match the data that follows.
2. Every input must satisfy ALL constraints. Never write an invalid input.
3. All inputs must be different from each other and from the sample input: ${problem.sampleInput.replace(/\n/g, " | ")}
4. "input" is the raw text fed to stdin. Use real newlines inside the JSON string.
5. "explanation" is one short sentence saying what this test checks.

Return ONLY a JSON object:
{
  "testCases": [
    { "category": "basic", "input": "raw stdin text", "explanation": "what it checks" }
  ]
}`;
}
export function buildBruteForcePrompt(problem) {
  return `You are a careful programmer. Solve the following problem in Python 3.

PROBLEM:
${problem.description}

INPUT FORMAT:
${problem.inputFormat}

OUTPUT FORMAT:
${problem.outputFormat}

CONSTRAINTS:
${problem.constraints.join("\n")}

EXAMPLE:
Input:
${problem.sampleInput}
Output:
${problem.sampleOutput}

STRICT RULES:
1. Write the simplest, most obviously correct solution you can. Use brute force: plain loops, direct simulation, trying every possibility. Correctness and clarity matter far more than speed.
2. Do NOT use clever tricks, math shortcuts, or optimized algorithms.
3. The program reads stdin and prints stdout, following the formats exactly.
4. Return a COMPLETE runnable Python 3 program, with imports and no markdown fences.
5. Use ONLY the Python standard library. Packages such as numpy, scipy, pandas, and networkx are NOT installed and will crash the program.
6. Do not use linear programming, solvers, or advanced algorithms. Enumerate all possibilities directly (all subsets, all permutations, all paths, or full simulation). The test inputs are small, so slow is fine.

Return ONLY a JSON object:
{
  "code": "complete Python 3 program as a plain string",
  "approach": "one sentence describing the brute-force approach"
}`;
}
import { z } from "zod";

export const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks and Queues",
  "Recursion",
  "Sorting and Searching",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Hashing",
];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const LANGUAGES = ["C++", "Python", "Java", "JavaScript"];

// What the frontend sends to POST /api/generate
export const generateRequestSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required").max(100),
  difficulty: z.enum(DIFFICULTIES),
  language: z.enum(LANGUAGES),
  notes: z.string().trim().max(500).optional().default(""),
});

// What Gemini must return for the problem itself
export const problemSchema = z.object({
  title: z.string().min(1),
  statement: z.string().min(1),
  description: z.string().min(1),
  inputFormat: z.string().min(1),
  outputFormat: z.string().min(1),
  constraints: z.array(z.string()).min(1),
  sampleInput: z.string().min(1),
  sampleOutput: z.string().min(1),
  sampleExplanation: z.string().min(1),
  referenceSolution: z.string().min(1),
  timeComplexity: z.string().min(1),
  spaceComplexity: z.string().min(1),
});
export const TEST_CATEGORIES = ["basic", "normal", "boundary", "edge", "challenging"];

// What Gemini must return when asked for test INPUTS (no expected outputs)
export const testInputsSchema = z.object({
  testCases: z
    .array(
      z.object({
        category: z.enum(TEST_CATEGORIES),
        input: z.string().min(1),
        explanation: z.string().min(1),
      })
    )
    .min(4),
});
// What Gemini must return for the independent brute-force solution
export const bruteForceSchema = z.object({
  code: z.string().min(1),
  approach: z.string().min(1),
});
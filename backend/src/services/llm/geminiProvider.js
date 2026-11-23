import { env } from "../../config/env.js";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const RETRYABLE_STATUS = [429, 500, 503];
const RETRIES_PER_MODEL = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callModel(model, prompt, { json }) {
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (json) {
    body.generationConfig = { responseMimeType: "application/json" };
  }

  const response = await fetch(`${BASE_URL}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.geminiApiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Gemini ${model} error ${response.status}: ${errorText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`Gemini ${model} returned an empty response`);
  return text;
}

async function generate(prompt, options) {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend/.env");
  }

  const models = [env.geminiModel, ...env.geminiFallbackModels];
  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt <= RETRIES_PER_MODEL; attempt++) {
      try {
        return await callModel(model, prompt, options);
      } catch (err) {
        lastError = err;
        if (!RETRYABLE_STATUS.includes(err.status)) break; // permanent error, try next model
        await sleep(1500 * (attempt + 1));
      }
    }
    console.warn(`Model ${model} failed, trying next fallback...`);
  }

  throw lastError;
}

export async function generateText(prompt) {
  return generate(prompt, { json: false });
}

export async function generateJSON(prompt) {
  const raw = await generate(prompt, { json: true });
  const cleaned = raw.replace(/^```json\s*|^```\s*|```$/gm, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned invalid JSON: " + cleaned.slice(0, 200));
  }
}
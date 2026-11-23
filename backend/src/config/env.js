import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  llmProvider: process.env.LLM_PROVIDER || "gemini",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  geminiFallbackModels: (
    process.env.GEMINI_FALLBACK_MODELS || "gemini-3.5-flash,gemini-3.8-flash"
  )
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean),
  judge0Url: process.env.JUDGE0_URL || "https://ce.judge0.com",
};
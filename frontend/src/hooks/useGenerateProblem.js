import { useState } from "react";
import { generateProblem } from "../api/client";

export function useGenerateProblem() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(config) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await generateProblem(config);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, generate };
}
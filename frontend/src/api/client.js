const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function checkHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  if (!res.ok) throw new Error("Backend responded with an error");
  return res.json();
}

export async function generateProblem(config) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to generate the problem");
  }
  return data;
}
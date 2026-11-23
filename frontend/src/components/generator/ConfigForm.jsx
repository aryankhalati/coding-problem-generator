import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { TOPICS, DIFFICULTIES, LANGUAGES } from "../../constants/options";

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              value === opt
                ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ConfigForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [language, setLanguage] = useState("Python");
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate({
      topic: customTopic.trim() || topic,
      difficulty,
      language,
      notes: notes.trim(),
    });
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <OptionGroup label="Topic" options={TOPICS} value={topic} onChange={setTopic} />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Custom topic <span className="text-gray-500">(optional, overrides the topic above)</span>
        </label>
        <input
          className={inputClass}
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="e.g. Sliding window, Union-Find, Bit manipulation"
          maxLength={100}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <OptionGroup
          label="Difficulty"
          options={DIFFICULTIES}
          value={difficulty}
          onChange={setDifficulty}
        />
        <OptionGroup
          label="Language"
          options={LANGUAGES}
          value={language}
          onChange={setLanguage}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Extra instructions <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          className={inputClass}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Use a sports theme, or avoid sorting-based solutions"
          maxLength={500}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        {loading ? "Generating..." : "Generate Problem"}
      </button>
    </form>
  );
}
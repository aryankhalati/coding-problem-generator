import { PlayCircle } from "lucide-react";
import { DEMOS } from "../../demo";

export default function DemoPicker({ onLoad, disabled }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="mb-3 text-sm font-medium text-gray-300">
        Offline demos{" "}
        <span className="text-gray-500">(saved earlier results, no internet needed)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {DEMOS.map((demo) => (
          <button
            key={demo.label}
            type="button"
            disabled={disabled}
            onClick={() => onLoad(demo.data)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:border-indigo-500/60 hover:text-white disabled:opacity-50"
          >
            <PlayCircle size={14} />
            {demo.label}
          </button>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANGUAGE_MAP = {
  "C++": "cpp",
  Python: "python",
  Java: "java",
  JavaScript: "javascript",
  text: "text",
};

export default function CodeBlock({ code, language = "text", label }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-1.5">
        <span className="text-xs text-gray-400">{label || language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-white"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={LANGUAGE_MAP[language] || "text"}
          style={vscDarkPlus}
          customStyle={{ margin: 0, background: "transparent", fontSize: "0.85rem" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
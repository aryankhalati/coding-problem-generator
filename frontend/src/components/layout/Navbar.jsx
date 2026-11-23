import { Code2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
        <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-300">
          <Code2 size={20} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">CodeForge AI</h1>
          <p className="text-xs text-gray-400">
            AI-powered coding problems with sandbox-checked test cases
          </p>
        </div>
      </div>
    </header>
  );
}
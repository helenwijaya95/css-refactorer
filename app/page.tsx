'use client'
import { useState } from "react"
import { refactorCSS } from "./actions"
export const runtime = 'edge';
export const preferredRegion = 'sin1';

import { RefactorResult } from "@/src/types";
import { ResultDisplay } from "./components/ResultDisplay";

export default function RefactorPage() {
  const [inputCss, setInputCss] = useState("");
  const [output, setOutput] = useState<RefactorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefactor = async () => {
    if (!inputCss.trim()) {
      setError("Please enter some CSS first!");
      return;
    }
    if (isCooldown) return;
    setLoading(true);
    setError(null);

    try {
      const result = await refactorCSS(inputCss);
      if (result.success) {
        setOutput(result.data || null);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
        setOutput(null);
      }
    } catch (error) {
       setError("Network error — please check your connection and try again.");
      setOutput(null);
    } finally {
      setLoading(false);
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false),5000);
    }


    setLoading(false);
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);
  };

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-50 flex flex-col p-8 max-w-6xl mx-auto min-w-4xl selection:bg-emerald-500/30">

      {/* Badge */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Next.js 15 + Gemini 1.5 Flash
        </div>
      </div>

      {/* Header */}
      <header className="py-4 px-6 shrink-0 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          CSS to <span className="text-emerald-400">Tailwind</span> Converter
        </h1>
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An AI orchestration tool to refactor legacy styles into modern
          <span className="text-slate-200 font-semibold"> Tailwind v4</span> utility classes in seconds.
        </p>
      </header>

      {/* Split panel — this is the key fix */}
      <div className="grid grid-cols-2 gap-0 flex-1 min-h-0 border border-slate-800 rounded-xl overflow-hidden">

        {/* LEFT — input */}
        <div className="flex flex-col border-r border-slate-800">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900">
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
              CSS input
            </span>
            <span className="text-xs text-slate-600">Paste your legacy CSS here</span>
          </div>
          <textarea
            className="flex-1 p-4 bg-slate-900 font-mono text-sm text-slate-200 resize-none outline-none placeholder:text-slate-600"
            placeholder={`.card {\n  display: flex;\n  padding: 16px;\n  background: #fff;\n}`}
            value={inputCss}
            onChange={(e) => setInputCss(e.target.value)}
          />
        </div>

        {/* RIGHT — output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-2">
              {output && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
              <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Tailwind output
              </span>
            </div>
            {output && (
              <CopyButton output={output} />
            )}
          </div>
          <div className="flex-1 bg-slate-900 p-4 overflow-auto">
            {error ? (
              <div className="flex items-start gap-3 test-sm texxtred400 bg-red-500/10 broder border-red-500/20 reounded-lg p-4">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <p className="font-medium mb-1">Conversion failed</p>
                  <p className="textred400/80">{error}</p>
                </div>
              </div>
            ) : (
            <ResultDisplay output={output} loading={loading} />
            )}
          </div>
        </div>

      </div>

      {/* Convert button */}
      <div className="flex justify-center shrink-0 pt-4">
        <button
          onClick={handleRefactor}
          disabled={!inputCss.trim() || loading || isCooldown}
          className={`px-8 py-3 rounded-lg font-bold transition-all ${
            !inputCss.trim() || loading || isCooldown
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer'
          }`}
        >
          {loading ? "Refactoring..." : isCooldown ? "Please wait..." : "Convert to Tailwind"}
        </button>
      </div>

    </main>
  );
}

// Copy button as a small self-contained component
function CopyButton({ output }: { output: RefactorResult }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-3 py-1 rounded-md border transition-all ${
        copied
          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
          : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
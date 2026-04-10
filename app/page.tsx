'use client'
import { useState } from "react"
import { refactorCSS } from "./actions"
export const runtime = 'edge'; // Optional: Runs on global edge nodes
export const preferredRegion = 'sin1'; // Forces the server to run in Singapore

import { RefactorResult } from "@/src/types"; 

export default function RefactorPage() {
  const [inputCss, setInputCss] = useState("");
  const [output, setOutput] = useState<RefactorResult | null>(null);
  const [loading, setLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const handleRefactor = async () => {
    if(!inputCss.trim()){
      setError("Please enter some CSS first!");
      return;
    }
    
    if(isCooldown) return;

    setLoading(true)
    setError(null);
    const result = await refactorCSS(inputCss)
    if(result.success) setOutput(result.data || null)
      setLoading(false)
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false)
    }, 5000); // 5 second pause
  }

  const copyToClipboard = () => {
    if(output?.tailwindClasses) {
      navigator.clipboard.writeText(output.tailwindClasses);
      alert("Copied to clipboard!");
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-50 flex flex-col p-8 max-w-6xl mx-auto min-w-4xl selection:bg-emerald-500/30">
    {/* 1. The Tech Badge */}

    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Next.js 15 + Gemini 1.5 Flash
      </div>
    </div>

    {/* 2. The Main Title */}
    <header className="py-6 px-6 shrink-0">
      <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
        CSS to <span className="text-emerald-400">Tailwind</span> Converter
      </h1>
      </div>
        <div className="text-center">
          {/* 3. The Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An AI orchestration tool to refactor legacy styles into modern 
            <span className="text-slate-200 font-semibold"> Tailwind v4</span> utility classes in seconds.
          </p>
        </div>
    </header>

    <div className="flex-1 flex flex-col gap-4 px-6 pb-6 overflow-hidden max-w-6xl mx-auto w-full">
      
      {/* 4. The Textbox */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <textarea 
          className="p-4 border rounded-lg bg-gray-50 font-mono text-sm text-black resize-none"
          placeholder="Paste messy CSS here..."
          value={inputCss}
          onChange={(e) => setInputCss(e.target.value)}
        />

        <div className="p-4 bg-slate-900 rounded-md min-h-[100px]">

          {loading ? (
            <span className="text-gray-500 animate-pulse">AI is refactoring...</span>
          ) : output ? (
            <div className="relative p-4 bg-slate-900 rounded-lg border border-slate-700 group">
              <h3 className="text-xs uppercase text-slate-500 font-bold mb-2">Tailwind Classes</h3>
              <div>
                <code className="text-emerald-400 break-all block">
                    {/* Instead of {output}, use the specific key: */}
                  {output?.tailwindClasses}
                </code>

                <button onClick={copyToClipboard} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-600 uppercase font-bold">Copy Classes</button>
              </div>
            

              
              {output.explanation && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h3 className="text-xs uppercase text-gray-500 font-bold mb-2">Explanation</h3>
                  <p className="text-gray-300 text-sm">{output.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Result will appear here...</span>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
          <span className="text-lg">⚠️</span> {error}
        </p>
      )}

      {/* 5. The Button */}
      <div className="flex justify-center shrink-0 pt-2">
        <button 
          onClick={handleRefactor}
          disabled={!inputCss.trim()||loading}
          className={`px-8 py-3 rounded-lg font-bold transition-all ${
            !inputCss.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer'
          }`}
        >
          {loading ? "Refactoring..." : "Convert to Tailwind"}
        </button>
      </div>
    </div>


    

    </main>
  )
}
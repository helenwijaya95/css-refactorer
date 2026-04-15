import { RefactorResult } from "@/src/types";
import { CodeOutput } from "./CodeOutput";
import { useState } from "react";

interface ResultDisplayProps {
  output: RefactorResult | RefactorResult[] | null;
  loading: boolean
}

export function ResultDisplay({ output, loading }: ResultDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Normalize to handle both single objects and arrays
  const results = Array.isArray(output) 
    ? output 
    : output 
      ? [output] 
      : [];

  const copyToClipboard = (text: string, index: number) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  return (
    <>
      {loading ? (
        <span className="text-gray-500 animate-pulse">AI is refactoring...</span>
      ) : results.length > 0 ? (
        <div className="flex-1 overflow-auto p-4 font-mono text-sm relative space-y-8">
          {results.map((item, index) => (
            <div key={index} className={index !== 0 ? "pt-6 border-t border-slate-800" : ""}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs uppercase text-slate-500 font-bold">
                  {results.length > 1 ? `Result ${index + 1}` : 'Tailwind Classes'}
                </h3>
                <button
                  onClick={() => copyToClipboard(item.tailwindClasses, index)}
                  className={`text-xs px-3 py-1 rounded border transition-all ${
                    copiedIndex === index
                      ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <CodeOutput code={item.tailwindClasses} />
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-500">Result will appear here...</span>
      )}
    </>
  )
}
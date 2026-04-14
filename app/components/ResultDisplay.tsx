import { RefactorResult } from "@/src/types";

interface ResultDisplayProps {
  output: RefactorResult | null;
  loading: boolean
}

export function ResultDisplay({ output, loading }: ResultDisplayProps) {
  const copyToClipboard = () => {
    if(output?.tailwindClasses) {
      navigator.clipboard.writeText(output.tailwindClasses);
      alert("Copied to clipboard!");
    }
  }
  
  return (
    <>
        {output?.tailwindClasses && (
            <button onClick={copyToClipboard} role="button" className="absolute -top-1 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-600 uppercase font-bold z-10">Copy Classes</button>
          )}
          {loading ? (
            <span className="text-gray-500 animate-pulse">AI is refactoring...</span>
          ) : output ? (
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
              <h3 className="text-xs uppercase text-slate-500 font-bold mb-2">Tailwind Classes</h3>
              <div>
                <code className="text-emerald-400 break-all block">
                    {/* Instead of {output}, use the specific key: */}
                  {output?.tailwindClasses}
                </code>
               
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
    </>
  )
         
}
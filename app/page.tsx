'use client'
import { useState } from "react"
import { refactorCSS } from "./actions"

export default function RefactorPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const handleRefactor = async () => {
    if(isCooldown) return;
    setLoading(true)
    const result = await refactorCSS(input)
    if(result.success) setOutput(result.data || '')
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
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CSS → Tailwind Neural Refactorer</h1>
      <div className="grid grid-cols-2 gap-6 h-[500px]">
        <textarea 
        className="p-4 border rounded-lg bg-gray-50 font-mono text-sm text-black"
        placeholder="Paste messy CSS here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
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
      <button onClick={handleRefactor} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">
        {loading ? "Refactoring..." : "Start Refactor"}
      </button>

    </main>
  )
}
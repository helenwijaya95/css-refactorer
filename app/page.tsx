'use client';
import { useState } from 'react';
import { refactorCSS } from './actions';
export const runtime = 'edge';
export const preferredRegion = 'sin1';

import { RefactorResult } from '@/src/types';
import { ResultDisplay } from './components/ResultDisplay';
import { CodeEditor } from './components/CodeEditor';
import { MOCK_REFACTOR_RESULT } from '@/src/mockData';

export default function RefactorPage() {
  const [inputCss, setInputCss] = useState(`
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin: 8px auto;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-width: 400px;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}`);

  // Use a Union Type: RefactorResult | RefactorResult[]
  const [output, setOutput] = useState<
    RefactorResult | RefactorResult[] | null
  >(process.env.NODE_ENV === 'development' ? MOCK_REFACTOR_RESULT : null);
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefactor = async () => {
    if (!inputCss.trim()) {
      setError('Please enter some CSS first!');
      return;
    }
    if (isCooldown) return;
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await refactorCSS(inputCss);
      if (result.success) {
        const rawData = result.data;
        const normalizedData = Array.isArray(rawData)
          ? rawData
          : rawData
            ? [rawData]
            : [];
        setOutput(normalizedData);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
        setOutput(null);
      }
    } catch (error) {
      setError('Network error — please check your connection and try again.');
      setOutput(null);
    } finally {
      setLoading(false);
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
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
          <span className="text-slate-200 font-semibold">
            {' '}
            Tailwind v4
          </span>{' '}
          utility classes in seconds.
        </p>
      </header>

      {/* Split panel — this is the key fix */}
      <div className="grid grid-cols-2 gap-0 flex-1 min-h-0 border border-slate-800 rounded-xl overflow-hidden">
        {/* LEFT — input */}
        <div className="flex flex-col min-h-0 border-r border-slate-800">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900 shrink-0">
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
              CSS input
            </span>
            <span className="text-xs text-slate-600">
              Paste your legacy CSS here
            </span>
          </div>
          <CodeEditor
            placeholder="Paste your legacy CSS here..."
            value={inputCss}
            onChange={setInputCss}
          />
        </div>

        {/* RIGHT — output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-2">
              {output && (
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              )}
              <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Tailwind output
              </span>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 p-4 overflow-auto">
            {error ? (
              <div className="flex items-start gap-3 test-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <p className="font-medium mb-1">Conversion failed</p>
                  <p className="text-red-400/80">{error}</p>
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
          {loading
            ? 'Refactoring...'
            : isCooldown
              ? 'Please wait...'
              : 'Convert to Tailwind'}
        </button>
      </div>
    </main>
  );
}

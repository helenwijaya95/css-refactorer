import { RefactorResult } from '@/src/types';
import { CodeOutput } from './CodeOutput';
// Import your new component
import { CopyButton } from './CopyButton';

interface ResultDisplayProps {
  output: RefactorResult | RefactorResult[] | null;
  loading: boolean;
}

export function ResultDisplay({ output, loading }: ResultDisplayProps) {
  const results = Array.isArray(output) ? output : output ? [output] : [];

  return (
    <>
      {loading ? (
        <span className="text-gray-500 animate-pulse">
          AI is refactoring...
        </span>
      ) : results.length > 0 ? (
        <div className="flex-1 overflow-auto p-4 font-mono text-sm relative space-y-8">
          {results.map((item, index) => (
            <div
              key={index}
              className={index !== 0 ? 'pt-6 border-t border-slate-800' : ''}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-emerald-500 font-bold font-mono">
                  {item.originalClassName || `Result ${index + 1}`}
                </h3>

                <CopyButton text={item.tailwindClasses} />
              </div>

              <CodeOutput code={item.tailwindClasses} />
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-500">Result will appear here...</span>
      )}
    </>
  );
}

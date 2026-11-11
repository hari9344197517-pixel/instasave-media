import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Radio, Sparkles } from 'lucide-react';

interface LoadingProgressProps {
  category: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ category }) => {
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Stage 1: Validation
    const t1 = setTimeout(() => {
      setStage(2);
      setProgress(55);
    }, 600);

    // Stage 2: Extraction
    const t2 = setTimeout(() => {
      setStage(3);
      setProgress(90);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-white dark:bg-slate-800/90 shadow-xl border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Loader2 className="w-6 h-6 text-pink-600 dark:text-pink-400 animate-spin" />
            <div className="absolute inset-0 rounded-full blur-xs bg-pink-500/20" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Processing Instagram {category.toUpperCase()}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stage === 1 && 'Verifying URL syntax & checking SSRF security...'}
              {stage === 2 && 'Connecting to public media CDN & extracting streams...'}
              {stage === 3 && 'Generating high-definition download packages...'}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400 tabular-nums">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stages Steps */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
        <div className={`flex items-center gap-1.5 ${stage >= 1 ? 'text-violet-600 dark:text-violet-400 font-semibold' : 'text-slate-400'}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>1. Validating</span>
        </div>
        <div className={`flex items-center gap-1.5 ${stage >= 2 ? 'text-pink-600 dark:text-pink-400 font-semibold' : 'text-slate-400'}`}>
          <Radio className="w-3.5 h-3.5" />
          <span>2. Fetching</span>
        </div>
        <div className={`flex items-center gap-1.5 ${stage >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-400'}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>3. Ready</span>
        </div>
      </div>
    </div>
  );
};

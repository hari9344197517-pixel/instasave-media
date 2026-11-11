import React, { useState, useEffect, useRef } from 'react';
import {
  Link as LinkIcon,
  Clipboard,
  X,
  ArrowRight,
  AlertCircle,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ExtractionResult } from '../types';
import { LoadingProgress } from './LoadingProgress';
import { MediaPreview } from './MediaPreview';

interface DownloadFormProps {
  onOpenQr: (url: string, title: string) => void;
}

export const DownloadForm: React.FC<DownloadFormProps> = ({ onOpenQr }) => {
  const { activeTab, t, showToast } = useApp();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currentCategory = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  // When activeTab changes, update placeholder and reset result
  useEffect(() => {
    setError(null);
  }, [activeTab]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError(null);
        showToast('Pasted link from clipboard!');
      } else {
        showToast('Clipboard is empty.');
      }
    } catch {
      showToast('Please press Ctrl+V / Cmd+V to paste your link.');
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    inputRef.current?.focus();
  };

  const handleUseSample = () => {
    setUrl(currentCategory.sampleUrl);
    setError(null);
    showToast(`Loaded sample Instagram ${currentCategory.defaultName} link!`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter or paste an Instagram URL before downloading.');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: trimmed,
          category: activeTab,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || data.error || 'Failed to extract media. Please verify the URL.');
        setLoading(false);
        return;
      }

      setResult(data);
      setLoading(false);

      // Smooth scroll down to the Search Result section
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      setError(err.message || 'Network connection failed. Please check your internet connection.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Hero Headings */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight mb-3">
          <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 dark:from-violet-400 dark:via-pink-400 dark:to-indigo-300 bg-clip-text text-transparent">
            {currentCategory.heroHeading}
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {currentCategory.heroSubtitle}
        </p>
      </div>

      {/* Main URL Input Box Container */}
      <div className="relative group p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-violet-600/30 via-pink-600/30 to-indigo-600/30 p-[2px] shadow-2xl shadow-pink-500/15">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-2.5 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-inner"
        >
          {/* Input field */}
          <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5">
            <LinkIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder={currentCategory.inputPlaceholder}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden"
            />
            {url && (
              <button
                type="button"
                onClick={handleClear}
                title="Clear input"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-2 px-1 sm:px-0">
            <button
              type="button"
              onClick={handlePaste}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Clipboard className="w-4 h-4 text-violet-500" />
              <span>{t.pasteButton}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:from-violet-700 hover:via-pink-700 hover:to-indigo-700 text-white text-sm sm:text-base font-bold shadow-lg shadow-pink-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <span>{loading ? 'Processing...' : t.downloadButton}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Quick Sample Link Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={handleUseSample}
          className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Need a test link? Load verified {currentCategory.defaultName} sample</span>
        </button>

        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Supports public posts, reels, stories & profiles
        </span>
      </div>

      {/* Error Message Alert with Retry */}
      {error && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-start gap-3.5 text-rose-800 dark:text-rose-200 text-sm animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <div className="flex items-start gap-3 w-full sm:w-auto flex-1">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold text-sm mb-1">Download Error</h5>
              <p className="text-xs sm:text-sm leading-relaxed text-rose-900/90 dark:text-rose-200/90">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-200/60 dark:border-rose-900/50">
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => setError(null)}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Progress Component */}
      {loading && <LoadingProgress category={activeTab} />}

      {/* Media Preview & Download Results */}
      {result && !loading && (
        <div ref={resultRef} className="scroll-mt-6">
          <MediaPreview
            data={result}
            onReset={() => {
              setResult(null);
              setUrl('');
              setError(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQr={onOpenQr}
          />
        </div>
      )}
    </div>
  );
};

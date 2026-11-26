import React, { useState } from 'react';
import { X, Check, Copy, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalModals: React.FC = () => {
  const { openModal, setOpenModal, showToast } = useApp();
  const [shareCopied, setShareCopied] = useState(false);

  if (openModal !== 'share') return null;

  const shareOrigin =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'instasavemedia.com' ||
      window.location.hostname === 'www.instasavemedia.com')
      ? `https://${window.location.hostname}`
      : 'https://instasavemedia.com';

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareOrigin).then(() => {
      setShareCopied(true);
      showToast('Website link copied to clipboard!');
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-pink-500" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Share InstaSave Media
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setOpenModal(null)}
            aria-label="Close share modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share InstaSave Media with friends, family, and colleagues!
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate">
              {shareOrigin}
            </span>
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-bold shrink-0 hover:bg-pink-700 transition-colors cursor-pointer"
            >
              {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{shareCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                'Check out InstaSave Media: ' + shareOrigin
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                'InstaSave Media - Instagram Media Utility: ' + shareOrigin
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold text-center transition-colors"
            >
              Twitter / X
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                shareOrigin
              )}&text=${encodeURIComponent('InstaSave Media')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold text-center transition-colors"
            >
              Telegram
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareOrigin
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold text-center transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

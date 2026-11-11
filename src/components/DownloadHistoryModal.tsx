import React from 'react';
import { X, Trash2, Download, History, Shield, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DownloadHistoryModal: React.FC = () => {
  const {
    openModal,
    setOpenModal,
    history,
    clearHistory,
    historyConsent,
    setHistoryConsent,
    t,
    showToast,
  } = useApp();

  if (openModal !== 'history') return null;

  const handleReDownload = (item: any) => {
    const proxyUrl = `/api/download/proxy?url=${encodeURIComponent(item.downloadUrl)}&filename=${encodeURIComponent(
      item.filename
    )}`;
    const link = document.createElement('a');
    link.href = proxyUrl;
    link.setAttribute('download', item.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Re-downloading ${item.filename}...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[85vh] rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t.historyTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stored privately in your browser's localStorage
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent toggle banner */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-violet-500" />
            <span>Save downloads history on this device</span>
          </span>
          <button
            onClick={() => setHistoryConsent(!historyConsent)}
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              historyConsent ? 'bg-pink-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>{t.noHistory}</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover bg-slate-200 dark:bg-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {item.title}
                    </h5>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>@{item.author}</span>
                      <span>• {item.quality}</span>
                      <span>• {new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleReDownload(item)}
                  title="Re-download file"
                  className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 shrink-0 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

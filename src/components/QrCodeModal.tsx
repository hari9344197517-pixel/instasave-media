import React, { useState } from 'react';
import { X, Smartphone, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface QrCodeModalProps {
  url: string | null;
  title: string | null;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ url, title, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!url) return null;

  // We can generate a clean QR Code via standard Google Chart API or standard SVG QR generator URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    url
  )}&bgcolor=ffffff&color=1e1b4b&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast('Download link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
            <Smartphone className="w-4 h-4 text-pink-500" />
            <span>Scan to Download</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
          {title || 'Instagram Media Direct Link'}
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-100 inline-block mb-4">
          <img
            src={qrImageUrl}
            alt="Scan QR code"
            className="w-48 h-48 rounded-lg mx-auto"
            loading="lazy"
          />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
          Open your iPhone Camera or Android QR Scanner to open and download directly onto your phone.
        </p>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
        </button>
      </div>
    </div>
  );
};

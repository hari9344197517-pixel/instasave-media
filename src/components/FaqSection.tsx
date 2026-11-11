import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const { t } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How do I download Instagram videos or Reels to my phone (iPhone or Android)?',
      answer:
        'To download on mobile: 1) Open Instagram and tap the Share / Airplane icon on any public video or reel. 2) Tap "Copy Link". 3) Open Safari or Chrome and visit InstaSave Media. 4) Paste the link in the download box and tap Download. 5) Select 1080p Full HD to save the video directly to your Photos or Files app.',
    },
    {
      question: 'Is InstaSave Media completely free to use? Are there download limits?',
      answer:
        'Yes! InstaSave Media is 100% free and unlimited. You do not need to purchase any subscription, enter credit card details, or install third-party software. You can download as many videos, photos, and reels as you need.',
    },
    {
      question: 'Can InstaSave Media download media from Private Instagram accounts or stories?',
      answer:
        'No. In strict compliance with Instagram terms of service, platform security, and user privacy laws, InstaSave Media does not scrape private accounts, bypass authentication, or access password-protected media. We only process publicly accessible posts, reels, and stories.',
    },
    {
      question: 'Do downloaded videos or reels include a watermark?',
      answer:
        'No, InstaSave Media extracts the original raw video stream directly from the content delivery network. Your downloaded videos will not have any watermark, logo, or compression artifacts added by InstaSave Media.',
    },
    {
      question: 'How does the Instagram Audio / Music Downloader work?',
      answer:
        'When you provide an Instagram Reel link or video URL, InstaSave Media extracts the audio stream and prepares a high-bitrate 320 kbps MP3 file. Please ensure you have permission or rights from the creator before saving audio.',
    },
    {
      question: 'How can I view or download someone\'s full-size profile picture (DP)?',
      answer:
        'Simply paste the user\'s profile link (e.g., https://instagram.com/username) into the "DP" tab. SnapSave accesses the public uncropped source avatar in full 1080x1080 HD resolution.',
    },
    {
      question: 'Where are my downloaded files saved on my device?',
      answer:
        'On PC and Mac, files are saved in your default "Downloads" folder. On Android, files appear in your "Downloads" album in Google Files or Gallery. On iPhone/iPad, Safari prompts to save to "Files" or directly into the Photos camera roll.',
    },
    {
      question: 'Is downloading Instagram content legal?',
      answer:
        'Downloading public media for personal, offline viewing or archiving is generally permissible under fair use. However, you must not re-upload, monetize, or redistribute copyrighted content without explicit permission from the original creator.',
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-20 px-4 max-w-4xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {t.faqTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {t.faqSubtitle}
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-pink-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

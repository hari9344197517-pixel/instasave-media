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
      question: 'How do I use the Instagram Reels Downloader or Video Downloader on mobile?',
      answer:
        'To save an authorized public video or Reel on iPhone or Android: 1) Open Instagram and tap the Share icon on your video or Reel. 2) Tap "Copy Link". 3) Visit InstaSave Media in Safari or Chrome, choose Reels or Video, and paste the link. 4) Click Download, preview the stream, and save the MP4 file to your Files or Photos app.',
    },
    {
      question: 'Does InstaSave Media support Instagram Post Downloader and Photo carousel downloads?',
      answer:
        'Yes. Whether you need the Instagram Post Downloader for single feed uploads or the Instagram Photo Downloader for multi-image carousels, paste any owner-authorized public post URL into the Photo or Video tab to preview individual slides and save JPEG photos or MP4 clips.',
    },
    {
      question: 'Is InstaSave Media free to use without creating an account?',
      answer:
        'Yes. InstaSave Media is a free browser-based utility that does not require registration, software installation, or Instagram login credentials. Standard rate limits apply to keep the service reliable and protected against automated abuse.',
    },
    {
      question: 'Can InstaSave Media download media from Private Instagram accounts?',
      answer:
        'No. In strict compliance with platform security and user privacy, InstaSave Media does not scrape private profiles, bypass login walls, or access restricted media. Only publicly accessible posts, reels, and stories are processed.',
    },
    {
      question: 'Do downloaded Reels or videos include any added watermark?',
      answer:
        'No. InstaSave Media relays the original media stream made available by the public content delivery network without adding watermarks, logos, or overlays.',
    },
    {
      question: 'How does the Instagram Audio Downloader work?',
      answer:
        'When you enter an authorized public Instagram Reel or video URL under the Audio tab, InstaSave Media prepares the accompanying audio stream for browser preview and download. Only extract audio that you created or hold permission to use.',
    },
    {
      question: 'Where are downloaded files saved on my device?',
      answer:
        'On Windows and Mac browsers, files go to your default Downloads folder. On Android, media appears in your Downloads directory or Gallery. On iPhone and iPad, Safari saves files to your Files app (where photos and videos can also be moved to Photos).',
    },
    {
      question: 'Is downloading Instagram content legal?',
      answer:
        'Publicly visible Instagram posts, Reels, videos, photos, and audio remain protected by copyright. You should only download content that you originally created, own the rights to, or have explicit permission from the copyright holder to archive.',
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
          const panelId = `faq-panel-${index}`;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden transition-colors"
            >
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
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
              </h3>

              {isOpen && (
                <div
                  id={panelId}
                  className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3.5"
                >
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

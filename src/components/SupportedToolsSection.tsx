import React from 'react';
import {
  Film,
  LayoutGrid,
  Video,
  Image as ImageIcon,
  Music,
  ArrowUpRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DownloadCategory, PageRoute } from '../types';

interface ToolGuideItem {
  category: DownloadCategory;
  targetRoute?: Exclude<PageRoute, 'not-found'>;
  href: string;
  linkLabel: string;
  title: string;
  description: string;
  howTo: string;
  formats: string[];
  icon: React.FC<{ className?: string }>;
  accentClass: string;
}

const TOOL_GUIDES: ToolGuideItem[] = [
  {
    category: 'reels',
    targetRoute: 'reels-downloader',
    href: '/instagram-reels-downloader',
    linkLabel: 'Open Reels Downloader',
    title: 'Instagram Reels Downloader',
    description:
      'Preview and save your own or authorized public Instagram Reels in clean MP4 format directly in mobile or desktop browsers without added watermarks.',
    howTo: 'Copy the public Reel URL via Share → Copy Link, paste above, preview, and download the MP4 file.',
    formats: ['MP4 Video', 'Original Audio'],
    icon: Film,
    accentClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    category: 'photo',
    targetRoute: 'photo-downloader',
    href: '/instagram-photo-downloader',
    linkLabel: 'Open Post Downloader',
    title: 'Instagram Post Downloader',
    description:
      'Archive single-frame public Instagram feed posts or multi-slide carousel posts cleanly when you own the content or hold permission from the creator.',
    howTo: 'Copy the public post link from the three-dot menu, paste it into InstaSaveMedia, and save each permitted slide.',
    formats: ['Feed Posts', 'Multi-Slide Carousels'],
    icon: LayoutGrid,
    accentClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    category: 'video',
    targetRoute: 'video-downloader',
    href: '/instagram-video-downloader',
    linkLabel: 'Open Video Downloader',
    title: 'Instagram Video Downloader',
    description:
      'Download owner-authorized public Instagram videos as standard MP4 files compatible with iPhone, Android, Windows, and macOS media players.',
    howTo: 'Paste the public Instagram video link above, preview playback inside the browser player, and save as MP4.',
    formats: ['HD MP4', 'Browser Preview'],
    icon: Video,
    accentClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  {
    category: 'photo',
    targetRoute: 'photo-downloader',
    href: '/instagram-photo-downloader',
    linkLabel: 'Open Photo Downloader',
    title: 'Instagram Photo Downloader',
    description:
      'Save permitted public Instagram photography and album images in their original JPEG resolution without extra recompression or screenshots.',
    howTo: 'Select the Photo tab, paste the public image post URL, switch carousel slides if needed, and download JPEG.',
    formats: ['Original JPEG', 'Full Carousel Slides'],
    icon: ImageIcon,
    accentClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    category: 'audio',
    href: '/?tab=audio',
    linkLabel: 'Open Audio Tool',
    title: 'Instagram Audio Downloader',
    description:
      'Extract and preview original soundtracks or spoken audio from public Reels and videos strictly where you own or hold rights to the audio track.',
    howTo: 'Switch to the Audio tab, paste a public Reel link you hold audio rights for, and save the MP3 track.',
    formats: ['MP3 Audio', 'AAC Stream'],
    icon: Music,
    accentClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

export const SupportedToolsSection: React.FC = () => {
  const { setActiveTab, navigateTo } = useApp();

  const handleOpenTool = (e: React.MouseEvent, tool: ToolGuideItem) => {
    e.preventDefault();
    if (tool.targetRoute) {
      navigateTo(tool.targetRoute);
    } else {
      setActiveTab(tool.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-labelledby="supported-tools-heading"
      className="py-14 sm:py-20 px-4 max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60"
    >
      <div className="text-center mb-12 sm:mb-14">
        <h2
          id="supported-tools-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3"
        >
          How to Download Public Instagram Reels, Videos &amp; Photos
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Dedicated browser utilities on InstaSaveMedia for lawful, owner-authorized, or otherwise permitted public Instagram media backups across desktop and mobile devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {TOOL_GUIDES.map((tool) => {
          const Icon = tool.icon;
          return (
            <article
              key={tool.title}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tool.accentClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {tool.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/80">
                  <strong className="text-slate-700 dark:text-slate-300">Quick steps:</strong> {tool.howTo}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {tool.formats.join(' • ')}
                </span>
                <a
                  href={tool.href}
                  onClick={(e) => handleOpenTool(e, tool)}
                  className="inline-flex items-center gap-1 font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors shrink-0"
                >
                  <span>{tool.linkLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Privacy, Safety & Copyright Reminders */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Privacy &amp; Safety Information
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            InstaSaveMedia never asks for your Instagram password or account login, operates strictly on publicly accessible URLs, and never hosts or archives downloaded media on its servers. Learn more in our{' '}
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('privacy');
              }}
              className="text-pink-600 dark:text-pink-400 underline font-semibold"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('about');
              }}
              className="text-pink-600 dark:text-pink-400 underline font-semibold"
            >
              About page
            </a>
            .
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Scale className="w-5 h-5 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Copyright &amp; Permission Reminders
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Publicly visible Instagram Reels, videos, posts, photos, and audio remain protected by copyright. Only save media you created yourself, own, or have permission from the rights holder to download. Review our{' '}
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('terms');
              }}
              className="text-pink-600 dark:text-pink-400 underline font-semibold"
            >
              Terms &amp; Conditions
            </a>{' '}
            or submit a request via our{' '}
            <a
              href="/dmca"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('dmca');
              }}
              className="text-pink-600 dark:text-pink-400 underline font-semibold"
            >
              DMCA Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

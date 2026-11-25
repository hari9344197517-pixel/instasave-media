import React from 'react';
import { Film, LayoutGrid, Video, Image as ImageIcon, Music, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DownloadCategory } from '../types';

interface ToolGuideItem {
  category: DownloadCategory;
  title: string;
  description: string;
  formats: string[];
  icon: React.FC<{ className?: string }>;
  accentClass: string;
}

const TOOL_GUIDES: ToolGuideItem[] = [
  {
    category: 'reels',
    title: 'Instagram Reels Downloader',
    description:
      'Preview and save your own or authorized public Instagram Reels in clean MP4 format directly in mobile or desktop browsers without added watermarks.',
    formats: ['MP4 Video', 'Original Audio'],
    icon: Film,
    accentClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    category: 'photo',
    title: 'Instagram Post Downloader',
    description:
      'Archive single-frame public Instagram feed posts or multi-slide carousel posts cleanly when you own the content or hold permission from the creator.',
    formats: ['Feed Posts', 'Multi-Slide Carousels'],
    icon: LayoutGrid,
    accentClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    category: 'video',
    title: 'Instagram Video Downloader',
    description:
      'Download owner-authorized public Instagram videos as standard MP4 files compatible with iPhone, Android, Windows, and macOS media players.',
    formats: ['HD MP4', 'Browser Preview'],
    icon: Video,
    accentClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  {
    category: 'photo',
    title: 'Instagram Photo Downloader',
    description:
      'Save permitted public Instagram photography and album images in their original JPEG resolution without extra recompression.',
    formats: ['Original JPEG', 'Full Carousel Slides'],
    icon: ImageIcon,
    accentClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    category: 'audio',
    title: 'Instagram Audio Downloader',
    description:
      'Extract and preview original soundtracks or spoken audio from public Reels and videos strictly where you own or hold rights to the audio track.',
    formats: ['MP3 Audio', 'AAC Stream'],
    icon: Music,
    accentClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

export const SupportedToolsSection: React.FC = () => {
  const { setActiveTab } = useApp();

  const handleOpenTool = (e: React.MouseEvent, category: DownloadCategory) => {
    e.preventDefault();
    setActiveTab(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          Supported Instagram Downloader Tools
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Dedicated browser utilities for lawful, owner-authorized, or otherwise permitted public Instagram media backups across desktop and mobile devices.
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
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {tool.formats.join(' • ')}
                </span>
                <a
                  href={`/?tab=${tool.category}`}
                  onClick={(e) => handleOpenTool(e, tool.category)}
                  className="inline-flex items-center gap-1 font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors shrink-0"
                >
                  <span>Open Tool</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

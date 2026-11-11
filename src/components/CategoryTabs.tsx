import React from 'react';
import {
  Video,
  Film,
  Clock,
  Bookmark,
  Image as ImageIcon,
  Music,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { DownloadCategory } from '../types';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Video,
  Film,
  Clock,
  Bookmark,
  Image: ImageIcon,
  Music,
  User,
};

export const CategoryTabs: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const getTranslatedName = (id: DownloadCategory): string => {
    switch (id) {
      case 'video':
        return t.tab_video;
      case 'reels':
        return t.tab_reels;
      case 'story':
        return t.tab_story;
      case 'photo':
        return t.tab_photo;
      case 'audio':
        return t.tab_audio;
      default:
        return id;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-2">
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/90 dark:bg-slate-850/90 shadow-lg shadow-violet-900/5 dark:shadow-none border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Video;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 select-none ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{getTranslatedName(cat.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

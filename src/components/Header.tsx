import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  History,
  Menu,
  X,
  Share2,
  Video,
  Film,
  Clock,
  Bookmark,
  Image as ImageIcon,
  Music,
  User,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DownloadCategory, SupportedLanguage } from '../types';

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export const Header: React.FC = () => {
  const { language, setLanguage, t, theme, toggleTheme, setActiveTab, history, setOpenModal } = useApp();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (cat: DownloadCategory) => {
    setActiveTab(cat);
    setToolsOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'InstaSave Media - Instagram Downloader',
          text: 'Download Instagram Reels, Videos, Stories & Photos in 1080p Full HD for free with InstaSave Media!',
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed, open modal
        setOpenModal('share');
      }
    } else {
      setOpenModal('share');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: SnapSave Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleSelectCategory('video');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-indigo-600 flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 dark:from-violet-400 dark:via-pink-400 dark:to-indigo-300 bg-clip-text text-transparent">
                INSTASAVE MEDIA
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 -mt-1">
                Instagram Downloader
              </span>
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <button
            onClick={() => handleSelectCategory('video')}
            className="px-3.5 py-2 rounded-lg hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navVideo}
          </button>
          <button
            onClick={() => handleSelectCategory('story')}
            className="px-3.5 py-2 rounded-lg hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.navStory}
          </button>

          {/* Other Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>{t.navOtherTools}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => handleSelectCategory('reels')}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                >
                  <Film className="w-4 h-4 text-pink-500" />
                  <span>{t.navReels}</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('photo')}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-violet-500" />
                  <span>{t.navPhoto}</span>
                </button>
                <button
                  onClick={() => handleSelectCategory('audio')}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                >
                  <Music className="w-4 h-4 text-emerald-500" />
                  <span>{t.navAudio}</span>
                </button>
              </div>
            )}
          </div>

          <a
            href="#how-it-works"
            className="px-3.5 py-2 rounded-lg hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            {t.navHowItWorks}
          </a>
          <a
            href="#faq"
            className="px-3.5 py-2 rounded-lg hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            {t.navFaq}
          </a>
        </nav>

        {/* Right: Actions, Language, Theme, Share */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* History Button */}
          <button
            onClick={() => setOpenModal('history')}
            title={t.historyTitle}
            className="relative p-2 sm:px-3 sm:py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-sm font-medium"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{t.navHistory}</span>
            {history.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            title={t.shareWebsite}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium cursor-pointer transition-colors"
            >
              <Globe className="w-4 h-4 text-violet-500" />
              <span className="hidden sm:inline uppercase">{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                      language === item.code
                        ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-medium'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    {language === item.code && <Check className="w-4 h-4 text-pink-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Download Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectCategory('video')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-pink-50 dark:hover:bg-pink-950/30"
            >
              <Video className="w-4 h-4 text-pink-500" />
              <span>{t.tab_video}</span>
            </button>
            <button
              onClick={() => handleSelectCategory('reels')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-pink-50 dark:hover:bg-pink-950/30"
            >
              <Film className="w-4 h-4 text-violet-500" />
              <span>{t.tab_reels}</span>
            </button>
            <button
              onClick={() => handleSelectCategory('story')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-pink-50 dark:hover:bg-pink-950/30"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{t.tab_story}</span>
            </button>
            <button
              onClick={() => handleSelectCategory('photo')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-pink-50 dark:hover:bg-pink-950/30"
            >
              <ImageIcon className="w-4 h-4 text-blue-500" />
              <span>{t.tab_photo}</span>
            </button>
            <button
              onClick={() => handleSelectCategory('audio')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-pink-50 dark:hover:bg-pink-950/30"
            >
              <Music className="w-4 h-4 text-emerald-500" />
              <span>{t.tab_audio}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-around text-xs font-medium text-slate-600 dark:text-slate-400">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-pink-500 py-1"
            >
              {t.navHowItWorks}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-pink-500 py-1"
            >
              {t.navFaq}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setOpenModal('history');
              }}
              className="hover:text-pink-500 py-1"
            >
              {t.navHistory} ({history.length})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

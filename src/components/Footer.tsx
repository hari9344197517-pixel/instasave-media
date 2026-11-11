import React from 'react';
import { Download, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DownloadCategory } from '../types';

export const Footer: React.FC = () => {
  const { setActiveTab, setOpenModal, t } = useApp();

  const handleToolClick = (cat: DownloadCategory) => {
    setActiveTab(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md pt-12 pb-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-indigo-600 flex items-center justify-center shadow-md shadow-pink-500/20">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 dark:from-violet-400 dark:via-pink-400 dark:to-indigo-300 bg-clip-text text-transparent">
                INSTASAVE MEDIA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The world's leading web platform to save and preview Instagram videos, reels, stories, highlights, photos, audio tracks, and profile pictures in full high definition.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SSL Encrypted • 100% Free • No Scraped Private Data</span>
            </div>
          </div>

          {/* Column 1: Download Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Media Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => handleToolClick('video')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.tab_video} Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleToolClick('reels')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.tab_reels} Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleToolClick('story')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.tab_story} Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleToolClick('photo')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.tab_photo} Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleToolClick('audio')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.tab_audio} Downloader
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#how-it-works" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  {t.howItWorksTitle}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  {t.faqTitle}
                </a>
              </li>
              <li>
                <button
                  onClick={() => setOpenModal('history')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.historyTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenModal('share')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.shareWebsite}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setOpenModal('privacy')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenModal('terms')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.termsConditions}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenModal('dmca')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.dmcaPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenModal('about')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenModal('contact')}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Contact Support on WhatsApp (+91 7092145312)"
                >
                  <span>{t.contactUs}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    WhatsApp
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Platform Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed text-center sm:text-left mb-6">
          <p>
            <strong>Disclaimer:</strong> {t.disclaimerDesc} InstaSave Media does not host, clone, or store copyrighted video or audio content on its servers. All media streams are delivered directly from Meta / Instagram public CDNs. Users are solely responsible for ensuring they possess rights to download or archive any content.
          </p>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/40">
          <div>
            © {new Date().getFullYear()} InstaSave Media. {t.allRightsReserved}
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for seamless commuter & creator workflows</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 inline fill-pink-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

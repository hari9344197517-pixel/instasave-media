import React from 'react';
import { Copy, ClipboardCheck, Download, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorks: React.FC = () => {
  const { t } = useApp();

  return (
    <section id="how-it-works" className="py-14 sm:py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {t.howItWorksTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {t.howItWorksSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Step 1 */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Copy className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase mb-1">
            Step 01
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {t.step1Title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.step1Desc}
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-wider uppercase mb-1">
            Step 02
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {t.step2Title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.step2Desc}
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Download className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-1">
            Step 03
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {t.step3Title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.step3Desc}
          </p>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Layers,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeaturesGrid: React.FC = () => {
  const { t } = useApp();

  const features = [
    {
      icon: Sparkles,
      color: 'from-violet-500 to-indigo-500',
      title: t.feat1Title,
      description: t.feat1Desc,
    },
    {
      icon: InfinityIcon,
      color: 'from-pink-500 to-rose-500',
      title: t.feat2Title,
      description: t.feat2Desc,
    },
    {
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      title: t.feat3Title,
      description: t.feat3Desc,
    },
    {
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
      title: t.feat4Title,
      description: t.feat4Desc,
    },
    {
      icon: Layers,
      color: 'from-amber-500 to-orange-500',
      title: 'Full Carousel Support',
      description: 'Easily download multi-image posts and photo albums in full individual slides or together in pristine resolution.',
    },
    {
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      title: 'Instant Fast Processing',
      description: 'High-speed cloud processing extracts media streams within seconds directly from Instagram content delivery networks.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {t.featuresTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {t.featuresSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center mb-4 shadow-md shadow-violet-500/10`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

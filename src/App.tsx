import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { DownloadForm } from './components/DownloadForm';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesGrid } from './components/FeaturesGrid';
import { FaqSection } from './components/FaqSection';
import { AdSenseSlot } from './components/AdSenseSlot';
import { DownloadHistoryModal } from './components/DownloadHistoryModal';
import { QrCodeModal } from './components/QrCodeModal';
import { LegalModals } from './components/LegalModals';
import { Footer } from './components/Footer';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { toast } = useApp();
  const [qrModalData, setQrModalData] = useState<{ url: string; title: string } | null>(null);

  const handleOpenQr = (url: string, title: string) => {
    setQrModalData({ url, title });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Decorative ambient background gradient mesh (purple, blue & pink) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-140px] left-[-80px] w-[500px] h-[500px] rounded-full bg-violet-600/15 dark:bg-violet-600/20 blur-[130px]" />
        <div className="absolute top-[-80px] right-[-60px] w-[520px] h-[520px] rounded-full bg-pink-500/15 dark:bg-pink-500/20 blur-[140px]" />
        <div className="absolute top-[160px] left-1/3 w-[450px] h-[450px] rounded-full bg-blue-600/10 dark:bg-blue-600/15 blur-[120px]" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 pt-6 sm:pt-10 pb-16">
        {/* Category Tabs: Video, Reels, Story, Highlights, Photo, Audio, DP */}
        <CategoryTabs />

        {/* Hero Section & Download Interface */}
        <DownloadForm onOpenQr={handleOpenQr} />

        {/* AdSense Slot 1: Below download interface */}
        <AdSenseSlot slotId="ad-slot-post-download" className="my-8" />

        {/* How It Works Section */}
        <HowItWorks />

        {/* AdSense Slot 2: Between how-it-works and features */}
        <AdSenseSlot slotId="ad-slot-mid-content" className="my-6" />

        {/* Features Highlights Grid */}
        <FeaturesGrid />

        {/* FAQ Accordion Section */}
        <FaqSection />

        {/* AdSense Slot 3: Above footer */}
        <AdSenseSlot slotId="ad-slot-footer-lead" className="mt-8 mb-4" />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DownloadHistoryModal />
      <QrCodeModal
        url={qrModalData?.url || null}
        title={qrModalData?.title || null}
        onClose={() => setQrModalData(null)}
      />
      <LegalModals />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-200 text-xs sm:text-sm font-medium backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

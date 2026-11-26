import React, { useState } from 'react';
import {
  ChevronDown,
  ShieldCheck,
  Scale,
  ArrowRight,
  Film,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';

interface LandingPageFaq {
  question: string;
  answer: string;
}

interface LandingPageConfig {
  badge: string;
  sectionTitle: string;
  intro: string;
  stepsTitle: string;
  steps: { title: string; description: string }[];
  highlightsTitle: string;
  highlights: { title: string; detail: string }[];
  faqsTitle: string;
  faqs: LandingPageFaq[];
  relatedPages: {
    route: Exclude<PageRoute, 'not-found'>;
    href: string;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }[];
}

const LANDING_CONFIGS: Record<
  'reels-downloader' | 'video-downloader' | 'photo-downloader',
  LandingPageConfig
> = {
  'reels-downloader': {
    badge: 'Reels MP4 Guide',
    sectionTitle: 'How to Download Public Instagram Reels with InstaSaveMedia',
    intro:
      'Use this dedicated Instagram Reels Downloader to preview and archive publicly accessible Reels that you created, own, or hold permission from the creator to save. Everything runs in your browser in clean MP4 format without requiring Instagram login credentials.',
    stepsTitle: '3 Simple Steps to Save Authorized Public Reels',
    steps: [
      {
        title: 'Copy the Public Reel Link',
        description:
          'Open Instagram on mobile or desktop, navigate to the public Reel you are authorized to save, tap Share or the three-dot menu, and select "Copy Link".',
      },
      {
        title: 'Paste the URL into InstaSaveMedia',
        description:
          'Paste the copied Reel link into the input bar at the top of this page and click Download to fetch the publicly available stream.',
      },
      {
        title: 'Preview and Save as MP4',
        description:
          'Review the video preview directly in your browser, then download the MP4 video or separate MP3 audio track straight to your device.',
      },
    ],
    highlightsTitle: 'Why Creators Use the InstaSaveMedia Reels Tool',
    highlights: [
      {
        title: 'Clean MP4 Output Without Added Overlays',
        detail:
          'Delivers the publicly available vertical MP4 stream directly to your phone or computer without adding third-party watermarks or banners.',
      },
      {
        title: 'Browser-First Mobile Compatibility',
        detail:
          'Works cleanly in Safari on iOS, Chrome on Android, and desktop browsers with no APK installs or browser extensions required.',
      },
      {
        title: 'Optional Original Audio Extraction',
        detail:
          'Need your own Reel narration or soundtrack separately? Choose the MP3 audio button right below the video preview when authorized.',
      },
    ],
    faqsTitle: 'Instagram Reels Downloader FAQs',
    faqs: [
      {
        question: 'Can I download Instagram Reels on iPhone and Android?',
        answer:
          'Yes. Copy the public Reel URL from the Instagram app, open https://instasavemedia.com/instagram-reels-downloader in Safari or Chrome, paste the link, and save the MP4 file to your Files, Gallery, or Downloads folder.',
      },
      {
        question: 'Does InstaSaveMedia support private Instagram Reels?',
        answer:
          'No. InstaSaveMedia strictly respects privacy settings and only processes publicly accessible Reels. Private accounts and restricted links are never bypassed.',
      },
      {
        question: 'Does downloading a Reel keep its original audio?',
        answer:
          'Yes. Standard Reel MP4 downloads preserve the video and accompanying audio stream, and you can also save the MP3 audio separately when you hold rights to the sound.',
      },
      {
        question: 'Am I allowed to download someone else’s Instagram Reel?',
        answer:
          'Public visibility does not remove copyright protection. Only download Reels you created yourself, own the rights to, or have explicit permission from the copyright owner to save.',
      },
    ],
    relatedPages: [
      {
        route: 'video-downloader',
        href: '/instagram-video-downloader',
        title: 'Instagram Video Downloader',
        description: 'Save authorized public Instagram feed videos in standard MP4 format.',
        icon: Video,
      },
      {
        route: 'photo-downloader',
        href: '/instagram-photo-downloader',
        title: 'Instagram Photo Downloader',
        description: 'Archive permitted single Instagram photos and multi-slide carousel posts.',
        icon: ImageIcon,
      },
    ],
  },
  'video-downloader': {
    badge: 'HD Video MP4 Guide',
    sectionTitle: 'How to Download Public Instagram Videos Online',
    intro:
      'InstaSaveMedia lets you inspect and save publicly accessible Instagram feed videos and clips that you own or are authorized to back up. No software downloads, account logins, or tracking extensions are needed.',
    stepsTitle: 'Step-by-Step Instagram Video Download Instructions',
    steps: [
      {
        title: 'Find Your Authorized Public Video',
        description:
          'Locate the public Instagram video post you own or have permission to back up, open the share or options menu, and choose "Copy Link".',
      },
      {
        title: 'Paste and Process the Video Link',
        description:
          'Paste the post URL into the InstaSaveMedia downloader box above and click Download to inspect the publicly available MP4 stream.',
      },
      {
        title: 'Download MP4 or Mobile QR Transfer',
        description:
          'Click Download Video to save the MP4 file locally, or generate a Mobile QR code to send the direct media preview to your smartphone.',
      },
    ],
    highlightsTitle: 'Key Capabilities for Instagram Videos',
    highlights: [
      {
        title: 'Original MP4 Quality Preservation',
        detail:
          'Streams the highest MP4 resolution made publicly available by Instagram content delivery servers without re-encoding artifacts.',
      },
      {
        title: 'Zero Server-Side Media Storage',
        detail:
          'Submitted links are handled transiently in memory during your request. InstaSaveMedia never archives or hosts downloaded videos.',
      },
      {
        title: 'Works Across Desktop and Mobile',
        detail:
          'Preview video duration, play/pause inline, toggle mute, and download cleanly on Windows, macOS, Android, and iOS.',
      },
    ],
    faqsTitle: 'Instagram Video Downloader FAQs',
    faqs: [
      {
        question: 'What video formats does InstaSaveMedia provide?',
        answer:
          'Public Instagram videos are prepared as standard MP4 files compatible with built-in media players across Windows, macOS, Android, and iPhone.',
      },
      {
        question: 'Do I need to sign in to my Instagram account?',
        answer:
          'No. You never enter your Instagram username or password on InstaSaveMedia. The tool only reads publicly reachable post links.',
      },
      {
        question: 'Can I download multiple videos inside a carousel post?',
        answer:
          'Yes. When a public carousel contains multiple slides, InstaSaveMedia surfaces the individual items so you can preview and save each permitted clip.',
      },
      {
        question: 'Where do saved Instagram videos appear on my device?',
        answer:
          'Desktop browsers save videos to your default Downloads folder, Android saves to Downloads or Gallery, and iOS Safari places downloaded MP4 files in the Files app.',
      },
    ],
    relatedPages: [
      {
        route: 'reels-downloader',
        href: '/instagram-reels-downloader',
        title: 'Instagram Reels Downloader',
        description: 'Save permitted public short-form vertical Reels in clean MP4 format.',
        icon: Film,
      },
      {
        route: 'photo-downloader',
        href: '/instagram-photo-downloader',
        title: 'Instagram Photo Downloader',
        description: 'Download single feed images and carousel photo albums in JPEG quality.',
        icon: ImageIcon,
      },
    ],
  },
  'photo-downloader': {
    badge: 'Photo & Carousel Guide',
    sectionTitle: 'How to Download Public Instagram Photos & Carousels',
    intro:
      'Back up publicly accessible Instagram single-image posts and multi-slide carousels you created or hold authorization to save. Preview every slide directly in the browser and download crisp JPEG images without taking blurry screenshots.',
    stepsTitle: 'How to Save Permitted Instagram Photos cleanly',
    steps: [
      {
        title: 'Copy the Public Post URL',
        description:
          'Open the public Instagram photo or carousel post you own or have permission to save, click the three-dot menu, and tap "Copy Link".',
      },
      {
        title: 'Load the Post in InstaSaveMedia',
        description:
          'Paste the post URL into the form at the top of this page and press Download to load all available slides in full preview.',
      },
      {
        title: 'Select Slides and Save JPEG',
        description:
          'Use the carousel arrows or thumbnail strip to inspect each slide, zoom if needed, and download individual JPEG images directly.',
      },
    ],
    highlightsTitle: 'Built for Single Photos and Multi-Slide Carousels',
    highlights: [
      {
        title: 'Full Multi-Slide Carousel Browser',
        detail:
          'Step through multi-photo Instagram posts slide by slide with crisp full-resolution preview and one-click per-slide JPEG download.',
      },
      {
        title: 'Better Than Cropped Screenshots',
        detail:
          'Retrieves the actual publicly served JPEG file instead of forcing you to screenshot and crop your phone display.',
      },
      {
        title: 'Respects Account Privacy & Ownership',
        detail:
          'Never accesses private profiles or locked media. Designed strictly for creator backups and authorized public downloads.',
      },
    ],
    faqsTitle: 'Instagram Photo Downloader FAQs',
    faqs: [
      {
        question: 'Can I download all slides from an Instagram carousel post?',
        answer:
          'Yes. After pasting a public multi-image carousel link, InstaSaveMedia displays all slides with arrows and thumbnails so you can preview and save each permitted image.',
      },
      {
        question: 'What image format and quality are saved?',
        answer:
          'Photos are downloaded in the original publicly available JPEG resolution provided by Instagram without adding borders or watermarks.',
      },
      {
        question: 'Can I save photos from a private Instagram profile?',
        answer:
          'No. Private Instagram accounts cannot be accessed or downloaded via InstaSaveMedia. Only publicly accessible posts are supported.',
      },
      {
        question: 'Who holds copyright on public Instagram photography?',
        answer:
          'Photographers and creators retain copyright over their public Instagram images. Always verify you own the photo or hold permission from the rights holder before downloading.',
      },
    ],
    relatedPages: [
      {
        route: 'reels-downloader',
        href: '/instagram-reels-downloader',
        title: 'Instagram Reels Downloader',
        description: 'Preview and save authorized public Instagram Reels in clean MP4.',
        icon: Film,
      },
      {
        route: 'video-downloader',
        href: '/instagram-video-downloader',
        title: 'Instagram Video Downloader',
        description: 'Save public Instagram feed videos in standard HD MP4 format.',
        icon: Video,
      },
    ],
  },
};

export const LandingPageContent: React.FC = () => {
  const { currentPage, navigateTo } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (
    currentPage !== 'reels-downloader' &&
    currentPage !== 'video-downloader' &&
    currentPage !== 'photo-downloader'
  ) {
    return null;
  }

  const config = LANDING_CONFIGS[currentPage];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-6 space-y-14">
      {/* Guide Intro + 3 Steps */}
      <section aria-labelledby="landing-steps-heading" className="border-t border-slate-200/60 dark:border-slate-800/60 pt-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>{config.badge}</span>
          </div>
          <h2
            id="landing-steps-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3"
          >
            {config.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {config.intro}
          </p>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
          {config.stepsTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.steps.map((step, idx) => (
            <div
              key={step.title}
              className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <div className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-2">
                Step 0{idx + 1}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section aria-labelledby="landing-highlights-heading" className="border-t border-slate-200/60 dark:border-slate-800/60 pt-12">
        <h2
          id="landing-highlights-heading"
          className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-8"
        >
          {config.highlightsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.highlights.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Landing Page FAQs */}
      <section aria-labelledby="landing-faq-heading" className="max-w-4xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60 pt-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Guidance</span>
          </div>
          <h2
            id="landing-faq-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            {config.faqsTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            const panelId = `landing-faq-panel-${index}`;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
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

      {/* Privacy, Safety & Copyright Compliance */}
      <section aria-label="Privacy and copyright guidance" className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200/60 dark:border-slate-800/60 pt-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Privacy &amp; Safe Processing
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            InstaSaveMedia does not require account passwords, never accesses private Instagram profiles, and does not archive downloaded media on its servers. Review our{' '}
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
            or{' '}
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
            <Scale className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Copyright &amp; Permission Notice
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Only download publicly accessible Instagram content you originally created, own, or have permission from the rights holder to save. See our{' '}
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('terms');
              }}
              className="text-pink-600 dark:text-pink-400 underline font-semibold"
            >
              Terms
            </a>{' '}
            and{' '}
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
      </section>

      {/* Related Downloader Tools (Internal Linking) */}
      <section aria-labelledby="related-tools-heading" className="border-t border-slate-200/60 dark:border-slate-800/60 pt-10">
        <h2
          id="related-tools-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-5 text-center"
        >
          Explore Other InstaSaveMedia Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-pink-400/60 transition-colors flex flex-col justify-between gap-3"
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                All-in-One Instagram Downloader
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Return to the main InstaSaveMedia homepage covering Videos, Reels, Stories, Photos, and Audio.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400">
              <span>Visit Homepage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </a>

          {config.relatedPages.map((rel) => {
            const Icon = rel.icon;
            return (
              <a
                key={rel.href}
                href={rel.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(rel.route);
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-pink-400/60 transition-colors flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-violet-500" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {rel.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rel.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400">
                  <span>Open Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
};

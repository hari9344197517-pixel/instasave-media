import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DownloadCategory,
  SupportedLanguage,
  HistoryEntry,
  PageRoute,
  CookieConsentState,
} from '../types';
import { TRANSLATIONS, Translations } from '../data/translations';

const COOKIE_STORAGE_KEY = 'instasavemedia_cookie_consent_v1';
const SITE_ORIGIN = 'https://instasavemedia.com';

const ROUTE_PATHS: Record<Exclude<PageRoute, 'not-found'>, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy-policy',
  terms: '/terms',
  dmca: '/dmca',
};

const PAGE_META: Record<PageRoute, { title: string; description: string; robots?: string }> = {
  home: {
    title: 'InstaSave Media – Instagram Reels, Post & Video Downloader',
    description:
      'Download owner-authorized public Instagram Reels, Posts, Videos, Photos, and Audio with InstaSave Media. Fast browser preview and MP4, JPEG, and MP3 export.',
  },
  about: {
    title: 'About InstaSave Media | Safety, Privacy & Purpose',
    description:
      'Learn how InstaSave Media supports lawful, owner-authorized public Instagram Reels, Post, Video, Photo, and Audio downloads with strong security controls.',
  },
  contact: {
    title: 'Contact Support | InstaSave Media',
    description:
      'Reach the InstaSave Media support team via email or official WhatsApp support for technical help, policy questions, or copyright inquiries.',
  },
  privacy: {
    title: 'Privacy Policy | InstaSave Media',
    description:
      'Read the InstaSave Media Privacy Policy covering transient URL processing, browser localStorage, cookies, server logs, user rights, and ad disclosures.',
  },
  terms: {
    title: 'Terms & Conditions | InstaSave Media',
    description:
      'Review InstaSave Media Terms and Conditions, acceptable lawful use rules, intellectual property responsibilities, and Meta non-affiliation disclosure.',
  },
  dmca: {
    title: 'DMCA & Copyright Policy | InstaSave Media',
    description:
      'Submit a copyright takedown notice, report unauthorized content, and review InstaSave Media DMCA compliance procedures.',
  },
  'not-found': {
    title: '404 Page Not Found | InstaSave Media',
    description: 'The requested page could not be found on InstaSave Media.',
    robots: 'noindex, nofollow',
  },
};

function resolvePageFromPathname(pathname: string): PageRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return 'home';
  if (clean === '/about') return 'about';
  if (clean === '/contact') return 'contact';
  if (clean === '/privacy-policy' || clean === '/privacy') return 'privacy';
  if (clean === '/terms' || clean === '/terms-and-conditions') return 'terms';
  if (clean === '/dmca' || clean === '/copyright') return 'dmca';
  return 'not-found';
}

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: DownloadCategory;
  setActiveTab: (tab: DownloadCategory) => void;
  currentPage: PageRoute;
  navigateTo: (page: Exclude<PageRoute, 'not-found'>, hash?: string) => void;
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  historyConsent: boolean;
  setHistoryConsent: (consent: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  openModal: 'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null;
  setOpenModal: (modal: 'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null) => void;
  cookieConsent: CookieConsentState;
  cookieSettingsOpen: boolean;
  setCookieSettingsOpen: (open: boolean) => void;
  acceptAllCookies: () => void;
  rejectNonEssentialCookies: () => void;
  saveCookiePreferences: (prefs: { analytics: boolean; advertising: boolean }) => void;
}

const DEFAULT_COOKIE_CONSENT: CookieConsentState = {
  decided: false,
  necessary: true,
  analytics: false,
  advertising: false,
  updatedAt: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('snapsave_lang') as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) return saved;
      const browserLang = navigator.language?.slice(0, 2) as SupportedLanguage;
      if (browserLang && TRANSLATIONS[browserLang]) return browserLang;
    } catch {}
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('snapsave_lang', lang);
    } catch {}
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('snapsave_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {}
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('snapsave_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Page Route State
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    try {
      return resolvePageFromPathname(window.location.pathname);
    } catch {
      return 'home';
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(resolvePageFromPathname(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update SEO metadata (title, description, canonical, og/twitter tags, robots) per page
  useEffect(() => {
    const meta = PAGE_META[currentPage] || PAGE_META.home;
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);

    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', meta.title);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', meta.description);

    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleEl) twitterTitleEl.setAttribute('content', meta.title);

    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescEl) twitterDescEl.setAttribute('content', meta.description);

    const robotsEl = document.querySelector('meta[name="robots"]');
    if (robotsEl) robotsEl.setAttribute('content', meta.robots || 'index, follow');

    if (currentPage === 'not-found') {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) existingCanonical.remove();
      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) ogUrlEl.removeAttribute('content');
    } else {
      const canonicalPath = ROUTE_PATHS[currentPage];
      const canonicalUrl = `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`;

      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', canonicalUrl);

      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) ogUrlEl.setAttribute('content', canonicalUrl);
    }
  }, [currentPage]);

  const navigateTo = (page: Exclude<PageRoute, 'not-found'>, hash?: string) => {
    const targetPath = ROUTE_PATHS[page];
    try {
      const nextUrl = hash ? `${targetPath}${hash}` : targetPath;
      if (window.location.pathname !== targetPath || hash) {
        window.history.pushState({}, '', nextUrl);
      }
    } catch {}
    setCurrentPage(page);
    setOpenModalState(null);

    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Active Category Tab
  const [activeTab, setActiveTabState] = useState<DownloadCategory>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as DownloadCategory;
      const validTabs: DownloadCategory[] = ['video', 'reels', 'story', 'photo', 'audio'];
      if (tabParam && validTabs.includes(tabParam)) return tabParam;
    } catch {}
    return 'video';
  });

  const setActiveTab = (tab: DownloadCategory) => {
    setActiveTabState(tab);
    setCurrentPage('home');
    try {
      const url = new URL(window.location.origin + '/');
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.pathname + url.search);
    } catch {}
  };

  // Download History
  const [historyConsent, setHistoryConsentState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('snapsave_history_consent');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const setHistoryConsent = (consent: boolean) => {
    setHistoryConsentState(consent);
    try {
      localStorage.setItem('snapsave_history_consent', String(consent));
      if (!consent) {
        localStorage.removeItem('snapsave_history');
        setHistory([]);
      }
    } catch {}
  };

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('snapsave_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    if (!historyConsent) return;
    const newEntry: HistoryEntry = {
      ...entry,
      id: 'h_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.title !== entry.title || item.downloadUrl !== entry.downloadUrl);
      const updated = [newEntry, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('snapsave_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('snapsave_history');
    } catch {}
  };

  // Cookie Consent State
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(() => {
    try {
      const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.decided === 'boolean') {
          return {
            decided: parsed.decided,
            necessary: true,
            analytics: Boolean(parsed.analytics),
            advertising: Boolean(parsed.advertising),
            updatedAt: parsed.updatedAt || '',
          };
        }
      }
    } catch {}
    return DEFAULT_COOKIE_CONSENT;
  });

  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);

  const persistCookieConsent = (next: CookieConsentState, message: string) => {
    setCookieConsent(next);
    setCookieSettingsOpen(false);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    showToast(message);
  };

  const acceptAllCookies = () => {
    persistCookieConsent(
      {
        decided: true,
        necessary: true,
        analytics: true,
        advertising: true,
        updatedAt: new Date().toISOString(),
      },
      'Cookie preferences saved (All categories enabled).'
    );
  };

  const rejectNonEssentialCookies = () => {
    persistCookieConsent(
      {
        decided: true,
        necessary: true,
        analytics: false,
        advertising: false,
        updatedAt: new Date().toISOString(),
      },
      'Cookie preferences saved (Only strictly necessary storage active).'
    );
  };

  const saveCookiePreferences = (prefs: { analytics: boolean; advertising: boolean }) => {
    persistCookieConsent(
      {
        decided: true,
        necessary: true,
        analytics: prefs.analytics,
        advertising: prefs.advertising,
        updatedAt: new Date().toISOString(),
      },
      'Your custom cookie preferences have been saved.'
    );
  };

  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Modals (maps legal modals directly to dedicated routes while keeping share/history modals)
  const [openModal, setOpenModalState] = useState<
    'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null
  >(null);

  const setOpenModal = (
    modal: 'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null
  ) => {
    if (
      modal === 'privacy' ||
      modal === 'terms' ||
      modal === 'dmca' ||
      modal === 'about' ||
      modal === 'contact'
    ) {
      navigateTo(modal);
      return;
    }
    setOpenModalState(modal);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        currentPage,
        navigateTo,
        history,
        addToHistory,
        clearHistory,
        historyConsent,
        setHistoryConsent,
        toast,
        showToast,
        openModal,
        setOpenModal,
        cookieConsent,
        cookieSettingsOpen,
        setCookieSettingsOpen,
        acceptAllCookies,
        rejectNonEssentialCookies,
        saveCookiePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

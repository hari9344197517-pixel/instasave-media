import React, { createContext, useContext, useState, useEffect } from 'react';
import { DownloadCategory, SupportedLanguage, HistoryEntry } from '../types';
import { TRANSLATIONS, Translations } from '../data/translations';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: DownloadCategory;
  setActiveTab: (tab: DownloadCategory) => void;
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  historyConsent: boolean;
  setHistoryConsent: (consent: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  openModal: 'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null;
  setOpenModal: (modal: 'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null) => void;
}

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
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
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
      // Avoid duplicate by downloadUrl or title
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

  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Modals
  const [openModal, setOpenModal] = useState<'privacy' | 'terms' | 'dmca' | 'about' | 'contact' | 'history' | 'share' | null>(null);

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
        history,
        addToHistory,
        clearHistory,
        historyConsent,
        setHistoryConsent,
        toast,
        showToast,
        openModal,
        setOpenModal,
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

import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings2, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CookieConsent: React.FC = () => {
  const {
    cookieConsent,
    cookieSettingsOpen,
    setCookieSettingsOpen,
    acceptAllCookies,
    rejectNonEssentialCookies,
    saveCookiePreferences,
    navigateTo,
  } = useApp();

  const [analyticsEnabled, setAnalyticsEnabled] = useState(cookieConsent.analytics);
  const [advertisingEnabled, setAdvertisingEnabled] = useState(cookieConsent.advertising);

  useEffect(() => {
    if (cookieSettingsOpen) {
      setAnalyticsEnabled(cookieConsent.analytics);
      setAdvertisingEnabled(cookieConsent.advertising);
    }
  }, [cookieSettingsOpen, cookieConsent.analytics, cookieConsent.advertising]);

  // Show compact floating banner until the user makes a choice
  const showBanner = !cookieConsent.decided && !cookieSettingsOpen;

  return (
    <>
      {/* Bottom Consent Banner */}
      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie Consent Preferences"
          className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-5 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-5 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                    Your Privacy & Cookie Preferences
                  </p>
                  <p>
                    InstaSave Media uses strictly necessary browser storage for theme, language, and optional local history. Optional analytics or advertising technologies remain disabled unless you grant consent. Read our{' '}
                    <a
                      href="/privacy-policy"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('privacy');
                      }}
                      className="text-pink-600 dark:text-pink-400 underline font-medium hover:text-pink-700"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCookieSettingsOpen(true)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Customize Settings
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssentialCookies}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={acceptAllCookies}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:from-violet-700 hover:via-pink-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize Cookie Settings Modal */}
      {cookieSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Customize Cookie Settings"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-5 h-5 text-violet-500" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Cookie & Privacy Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCookieSettingsOpen(false)}
                aria-label="Close cookie settings"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p className="leading-relaxed">
                Manage your cookie and browser storage preferences for <strong>instasavemedia.com</strong>. Non-essential scripts are never loaded prior to your consent, and you may withdraw or update your choices at any time from the Footer.
              </p>

              {/* Category 1: Necessary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Necessary Cookies & Local Storage</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Essential for core website functionality, security controls, dark/light theme preference, language selection, and remembering your consent choice.
                </p>
              </div>

              {/* Category 2: Analytics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Analytics Cookies
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={analyticsEnabled}
                    aria-label="Toggle Analytics Cookies"
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      analyticsEnabled
                        ? 'bg-pink-600 justify-end'
                        : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Helps measure aggregated performance and reliability if analytics are enabled. Currently, InstaSave Media does not load third-party behavioral analytics scripts.
                </p>
              </div>

              {/* Category 3: Advertising */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Advertising Cookies
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={advertisingEnabled}
                    aria-label="Toggle Advertising Cookies"
                    onClick={() => setAdvertisingEnabled(!advertisingEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      advertisingEnabled
                        ? 'bg-pink-600 justify-end'
                        : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Used only if Google AdSense or authorized advertising partners are activated to serve relevant ads and limit ad frequency. No Google AdSense scripts are loaded unless enabled and consented.
                </p>
              </div>

              {/* Honest CMP Note */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Compliance Disclosure:</strong> This preference manager records local consent in your browser and is not a Google-certified IAB TCF CMP. Prior to serving Google AdSense ads to visitors in the EEA, UK, or Switzerland, a Google-certified CMP will be deployed as required by Google policy.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={rejectNonEssentialCookies}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() =>
                    saveCookiePreferences({
                      analytics: analyticsEnabled,
                      advertising: advertisingEnabled,
                    })
                  }
                  className="px-4 py-2 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </button>
                <button
                  type="button"
                  onClick={acceptAllCookies}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 hover:from-violet-700 hover:via-pink-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

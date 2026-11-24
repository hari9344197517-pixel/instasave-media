import React from 'react';
import { useApp } from '../context/AppContext';

interface AdSenseSlotProps {
  slotId: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

/**
 * AdSense Container
 * Remains hidden until a genuine Publisher Client ID is configured via environment variables
 * AND the user has granted Advertising cookie consent.
 * Prevents displaying dummy placeholder ad boxes prior to Google AdSense review/approval.
 */
export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slotId,
  format = 'responsive',
  className = '',
}) => {
  const { cookieConsent } = useApp();
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

  if (!clientId || !cookieConsent.advertising) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full max-w-4xl mx-auto my-8 px-4 ${className}`}
    >
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Advertisement
        </span>
        <div
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          className="w-full min-h-[90px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-center p-4"
        />
      </div>
    </aside>
  );
};

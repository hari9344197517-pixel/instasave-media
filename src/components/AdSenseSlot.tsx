import React from 'react';

interface AdSenseSlotProps {
  slotId: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slotId,
  format = 'responsive',
  className = '',
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto my-6 px-4 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Discrete ad disclosure label */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
          Advertisement
        </span>

        {/* Ad container box with publisher attributes */}
        <div
          data-ad-client="ca-pub-1234567890123456"
          data-ad-slot={slotId}
          data-ad-format={format}
          className="w-full min-h-[90px] sm:min-h-[100px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center select-none"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>Google AdSense Display Space</span>
            <span className="text-[11px] font-mono text-slate-400">({slotId})</span>
          </div>
          <p className="text-[11px] text-slate-400/80 dark:text-slate-600 mt-1">
            Responsive leaderboard & banner ad compliant with Google Publisher Policies
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ActivePrayerStatus } from '../../hooks/useLiveCountdown.ts';

export function HeroCountdown({ status }: { status: ActivePrayerStatus }): React.JSX.Element {
  return (
    <div className="glass-card p-6 md:p-8 text-center mb-6 border-b-4 border-b-[#209CAF] relative overflow-hidden">
      <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-[#209CAF] mb-2">
        Menuju {status.label} ({status.time})
      </p>
      <div className="font-mono text-5xl md:text-7xl font-extrabold tracking-tight text-ink dark:text-white tabular-nums my-1">
        {status.countdownStr}
      </div>
      <p className="text-xs text-ink-muted dark:text-slate-400 mt-2">
        Sistem komputasi presisi Jean Meeus &middot; Tanpa dependensi server
      </p>
    </div>
  );
}

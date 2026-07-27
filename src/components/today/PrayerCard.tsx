import React from 'react';

export function PrayerCard({ name, time, isActive, isTerbit = false }: { name: string; time: string; isActive: boolean; isTerbit?: boolean }): React.JSX.Element {
  return (
    <section
      className={`glass-card p-5 transition flex flex-col justify-between ${
        isActive ? 'signal-flow-active scale-[1.02]' : 'hover:border-[#209CAF]/40'
      } ${isTerbit ? 'opacity-75 border-dashed' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-ink dark:text-white uppercase tracking-wider">{name}</h3>
        {isActive && (
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB7841] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EB7841]"></span>
          </span>
        )}
        {isTerbit && <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded">Matahari</span>}
      </div>
      <h1 className="font-mono text-3xl md:text-4xl font-extrabold text-ink dark:text-white tabular-nums">
        {time}
      </h1>
    </section>
  );
}

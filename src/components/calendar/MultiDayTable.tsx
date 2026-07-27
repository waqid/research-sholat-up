import React from 'react';
import { CachedDaySchedule } from '../../lib/db.ts';

const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function MultiDayTable({ days, activeDateStr }: { days: CachedDaySchedule[]; activeDateStr: string }): React.JSX.Element {
  return (
    <div className="glass-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#282828] text-white text-xs md:text-sm font-bold tracking-wider uppercase">
              <th className="py-3 px-2 border-r border-white/10">Hari</th>
              <th className="py-3 px-2 border-r border-white/10">Tanggal</th>
              <th className="py-3 px-2 border-r border-white/10">Subuh</th>
              <th className="py-3 px-2 border-r border-white/10">Terbit</th>
              <th className="py-3 px-2 border-r border-white/10">Dhuhur</th>
              <th className="py-3 px-2 border-r border-white/10">Ashar</th>
              <th className="py-3 px-2 border-r border-white/10">Maghrib</th>
              <th className="py-3 px-2">Isya'</th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm divide-y divide-slate-200 dark:divide-slate-800">
            {days.map((day) => {
              const isToday = day.dateStr === activeDateStr;
              const [y, m, d] = day.dateStr.split('-').map(Number);
              const formattedDate = `${d} ${INDONESIAN_MONTHS[m - 1]} ${y}`;

              return (
                <tr
                  key={day.cacheKey}
                  className={`transition ${
                    isToday ? 'bg-[#209CAF]/15 font-bold text-ink dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-2.5 px-2 font-medium">{day.dayName}</td>
                  <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">{formattedDate}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-ink dark:text-white">{day.subuh}</td>
                  <td className="py-2.5 px-2 font-mono text-slate-400">{day.terbit}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-ink dark:text-white">{day.dhuhur}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-ink dark:text-white">{day.ashar}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-ink dark:text-white">{day.maghrib}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-ink dark:text-white">{day.isya}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

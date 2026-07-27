import React from 'react';
import { Printer, Download } from 'lucide-react';

const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export interface CalendarControlsProps {
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onPrint: () => void;
  onExportCsv: () => void;
}

export function CalendarControls({ month, year, onMonthChange, onYearChange, onPrint, onExportCsv }: CalendarControlsProps): React.JSX.Element {
  return (
    <div className="glass-card p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-[var(--radius-btn)] text-sm font-semibold text-ink dark:text-white"
        >
          {INDONESIAN_MONTHS.map((m, idx) => (
            <option key={idx + 1} value={idx + 1}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-[var(--radius-btn)] text-sm font-semibold text-ink dark:text-white"
        >
          {[2025, 2026, 2027, 2028].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 bg-[#282828] hover:bg-[#383838] text-white px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-bold transition shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" /> Cetak
        </button>
        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 bg-[#209CAF] hover:bg-[#177C8C] text-white px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-bold transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" /> Unduh CSV
        </button>
      </div>
    </div>
  );
}

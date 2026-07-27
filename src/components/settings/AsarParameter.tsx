import React from 'react';

export function AsarParameter({ tba, onSelectTba }: { tba: number; onSelectTba: (val: number) => void }): React.JSX.Element {
  return (
    <fieldset className="mb-6">
      <legend className="text-sm font-bold text-ink dark:text-white uppercase tracking-wider mb-3 border-b border-slate-200 dark:border-slate-800 pb-1.5 w-full">
        Pilih Parameter Asyar
      </legend>
      <div className="grid grid-cols-2 gap-3">
        <label className={`flex items-center gap-2 p-3 rounded-[var(--radius-btn)] border cursor-pointer transition ${
          tba === 1 ? 'bg-[#209CAF]/15 border-[#209CAF] font-bold text-ink dark:text-white' : 'border-slate-300 dark:border-slate-700 hover:border-[#209CAF]'
        }`}>
          <input
            type="radio"
            name="tba"
            checked={tba === 1}
            onChange={() => onSelectTba(1)}
            className="text-[#209CAF] focus:ring-[#209CAF]"
          />
          <span>Imam Syafi'i (Default)</span>
        </label>

        <label className={`flex items-center gap-2 p-3 rounded-[var(--radius-btn)] border cursor-pointer transition ${
          tba === 2 ? 'bg-[#209CAF]/15 border-[#209CAF] font-bold text-ink dark:text-white' : 'border-slate-300 dark:border-slate-700 hover:border-[#209CAF]'
        }`}>
          <input
            type="radio"
            name="tba"
            checked={tba === 2}
            onChange={() => onSelectTba(2)}
            className="text-[#209CAF] focus:ring-[#209CAF]"
          />
          <span>Imam Hanafi</span>
        </label>
      </div>
    </fieldset>
  );
}

import React from 'react';
import { CityLocation } from '../../lib/astronomy/meeus.ts';
import { LocationSelector } from './LocationSelector.tsx';
import { AsarParameter } from './AsarParameter.tsx';
import { X } from 'lucide-react';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLocation: CityLocation;
  tba: number;
  onSelectCity: (cityId: string) => void;
  onSelectGps: () => void;
  onSelectTba: (tba: number) => void;
}

export function SettingsModal({ isOpen, onClose, activeLocation, tba, onSelectCity, onSelectGps, onSelectTba }: SettingsModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card bg-white dark:bg-slate-900 max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <h2 className="text-lg font-bold text-ink dark:text-white">Pengaturan Sholat UP</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <AsarParameter tba={tba} onSelectTba={(val) => { onSelectTba(val); onClose(); }} />
        <LocationSelector activeLocation={activeLocation} onSelectCity={(id) => { onSelectCity(id); onClose(); }} onSelectGps={() => { onSelectGps(); onClose(); }} />

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-[#209CAF] hover:bg-[#177C8C] text-white font-bold px-5 py-2 rounded-[var(--radius-btn)] text-sm transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { PRESET_CITIES } from '../../lib/astronomy/cities.ts';
import { CityLocation } from '../../lib/astronomy/meeus.ts';
import { MapPin } from 'lucide-react';

export function LocationSelector({ activeLocation, onSelectCity, onSelectGps }: { activeLocation: CityLocation; onSelectCity: (id: string) => void; onSelectGps: () => void }): React.JSX.Element {
  return (
    <fieldset className="mb-6">
      <legend className="text-sm font-bold text-ink dark:text-white uppercase tracking-wider mb-3 border-b border-slate-200 dark:border-slate-800 pb-1.5 w-full">
        Pilih Wilayah / Kota
      </legend>

      <button
        onClick={onSelectGps}
        className={`w-full p-3 rounded-[var(--radius-btn)] border font-bold flex items-center justify-center gap-2 mb-3 transition ${
          activeLocation.name.includes('GPS') ? 'bg-[#EB7841] text-white border-[#EB7841] shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-ink dark:text-white border-slate-300 dark:border-slate-700 hover:border-[#EB7841]'
        }`}
      >
        <MapPin className="w-4 h-4" /> Deteksi GPS Otomatis
      </button>

      <div className="grid grid-cols-2 gap-3">
        {PRESET_CITIES.map((city) => (
          <label
            key={city.id}
            className={`flex items-center gap-2 p-3 rounded-[var(--radius-btn)] border cursor-pointer transition ${
              activeLocation.name === city.name ? 'bg-[#209CAF]/15 border-[#209CAF] font-bold text-ink dark:text-white' : 'border-slate-300 dark:border-slate-700 hover:border-[#209CAF]'
            }`}
          >
            <input
              type="radio"
              name="city"
              checked={activeLocation.name === city.name}
              onChange={() => onSelectCity(city.id)}
              className="text-[#209CAF] focus:ring-[#209CAF]"
            />
            <span>{city.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

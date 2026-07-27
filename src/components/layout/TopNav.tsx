import React from 'react';
import { CityLocation } from '../../lib/astronomy/meeus.ts';
import { MapPin, Settings, Calendar, Clock } from 'lucide-react';

export interface TopNavProps {
  activeTab: 'today' | 'calendar';
  onTabChange: (tab: 'today' | 'calendar') => void;
  activeLocation: CityLocation;
  tba: number;
  onOpenSettings: () => void;
}

export function TopNav({ activeTab, onTabChange, activeLocation, tba, onOpenSettings }: TopNavProps): React.JSX.Element {
  return (
    <header className="bg-[#282828] text-white sticky top-0 z-50 border-b border-[#209CAF]/30 shadow-md">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        {/* Brand & Active Badges */}
        <div className="flex items-center space-x-3">
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EB7841] inline-block animate-pulse"></span>
            Sholat UP
          </span>
          <button
            onClick={onOpenSettings}
            className="hidden sm:flex items-center gap-1.5 bg-[#383838] hover:bg-[#484848] text-xs px-2.5 py-1.5 rounded-[var(--radius-btn)] border border-white/10 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#209CAF]" />
            <span className="font-medium truncate max-w-[120px]">{activeLocation.name}</span>
            <span className="text-white/40">|</span>
            <span className="text-[#209CAF]">Asar: {tba === 1 ? "Syafi'i" : 'Hanafi'}</span>
          </button>
        </div>

        {/* Navigation Tabs & Settings Trigger */}
        <div className="flex items-center space-x-2">
          <nav className="flex bg-[#18181B] p-1 rounded-[var(--radius-btn)] border border-white/10">
            <button
              onClick={() => onTabChange('today')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[6px] transition ${
                activeTab === 'today' ? 'bg-[#209CAF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Hari Ini
            </button>
            <button
              onClick={() => onTabChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[6px] transition ${
                activeTab === 'calendar' ? 'bg-[#209CAF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Kalender
            </button>
          </nav>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-white hover:bg-[#383838] rounded-[var(--radius-btn)] transition"
            aria-label="Pengaturan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

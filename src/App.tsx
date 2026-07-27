import React, { useState, useEffect } from 'react';
import { useGeolocation } from './hooks/useGeolocation.ts';
import { usePrayerTimes } from './hooks/usePrayerTimes.ts';
import { useLiveCountdown } from './hooks/useLiveCountdown.ts';
import { getCityById } from './lib/astronomy/cities.ts';
import { generateYearScheduleBatch, CachedDaySchedule } from './lib/db.ts';

import { TopNav } from './components/layout/TopNav.tsx';
import { StatusRamp } from './components/layout/StatusRamp.tsx';
import { PWAInstallPrompt } from './components/layout/PWAInstallPrompt.tsx';
import { HeroCountdown } from './components/today/HeroCountdown.tsx';
import { PrayerGrid } from './components/today/PrayerGrid.tsx';
import { AccuracyNote } from './components/today/AccuracyNote.tsx';
import { CalendarControls } from './components/calendar/CalendarControls.tsx';
import { MultiDayTable } from './components/calendar/MultiDayTable.tsx';
import { SettingsModal } from './components/settings/SettingsModal.tsx';

export function App(): React.JSX.Element {
  const { location, setLocation, status: gpsStatus, errorMsg, requestGps } = useGeolocation();
  const [activeTab, setActiveTab] = useState<'today' | 'calendar'>('today');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [tba, setTba] = useState<number>(() => {
    const saved = localStorage.getItem('sholat_tba');
    return saved ? Number(saved) : 1;
  });

  const { times } = usePrayerTimes(location, tba);
  const countdownStatus = useLiveCountdown(times);

  // Calendar State
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [calendarDays, setCalendarDays] = useState<CachedDaySchedule[]>([]);

  useEffect(() => {
    localStorage.setItem('sholat_tba', tba.toString());
  }, [tba]);

  // Precompute calendar batch whenever location, year, or tba shifts
  useEffect(() => {
    let active = true;
    generateYearScheduleBatch(year, location, tba).then((batch) => {
      if (active) setCalendarDays(batch);
    });
    return () => { active = false; };
  }, [year, location.lat, location.long, tba]);

  // Filter calendar days for the selected month
  const filteredDays = calendarDays.filter(d => {
    const [y, m] = d.dateStr.split('-').map(Number);
    return y === year && m === month;
  });

  const activeDateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (filteredDays.length === 0) return;
    const headers = ["Hari", "Tanggal", "Subuh", "Terbit", "Dhuhur", "Ashar", "Maghrib", "Isya"];
    const rows = filteredDays.map(d => [d.dayName, d.dateStr, d.subuh, d.terbit, d.dhuhur, d.ashar, d.maghrib, d.isya]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jadwal_sholat_${location.name.replace(/\s+/g, '_')}_${year}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <TopNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeLocation={location}
          tba={tba}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <StatusRamp gpsStatus={gpsStatus} errorMsg={errorMsg} onRetryGps={requestGps} />
          <PWAInstallPrompt />

          {activeTab === 'today' ? (
            <div>
              <HeroCountdown status={countdownStatus} />
              <PrayerGrid times={times} activeKey={countdownStatus.key} />
              <AccuracyNote text="Ralat waktu sholat ± 2 menit" />
            </div>
          ) : (
            <div>
              <CalendarControls
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
                onPrint={handlePrint}
                onExportCsv={handleExportCsv}
              />
              <MultiDayTable days={filteredDays} activeDateStr={activeDateStr} />
            </div>
          )}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeLocation={location}
        tba={tba}
        onSelectCity={(id) => setLocation(getCityById(id))}
        onSelectGps={requestGps}
        onSelectTba={setTba}
      />
    </div>
  );
}

export default App;

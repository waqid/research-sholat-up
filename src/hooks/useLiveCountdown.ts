import { useState, useEffect } from 'react';
import { FormattedPrayerTimes } from '../lib/astronomy/meeus.ts';

export interface ActivePrayerStatus {
  key: 'subuh' | 'terbit' | 'dhuhur' | 'ashar' | 'maghrib' | 'isya';
  label: string;
  time: string;
  countdownStr: string;
}

const PRAYER_ORDER: Array<{ key: 'subuh' | 'terbit' | 'dhuhur' | 'ashar' | 'maghrib' | 'isya'; label: string }> = [
  { key: 'subuh', label: 'Subuh' },
  { key: 'terbit', label: 'Terbit' },
  { key: 'dhuhur', label: 'Dhuhur' },
  { key: 'ashar', label: 'Ashar' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isya', label: "Isya'" }
];

function parseTimeToDate(timeStr: string, baseDate: Date): Date {
  const [hours, mins] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, mins, 0, 0);
  return d;
}

export function useLiveCountdown(times: FormattedPrayerTimes, customNow?: Date): ActivePrayerStatus {
  const getStatus = (currentNow: Date): ActivePrayerStatus => {
    for (const p of PRAYER_ORDER) {
      const target = parseTimeToDate(times[p.key], currentNow);
      if (target.getTime() > currentNow.getTime()) {
        const diffMs = target.getTime() - currentNow.getTime();
        const totalSec = Math.floor(diffMs / 1000);
        const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSec % 60).toString().padStart(2, '0');
        return { key: p.key, label: p.label, time: times[p.key], countdownStr: `${h}:${m}:${s}` };
      }
    }
    // If all passed today, next target is Subuh tomorrow
    const tomorrowSubuh = parseTimeToDate(times.subuh, currentNow);
    tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
    const diffMs = tomorrowSubuh.getTime() - currentNow.getTime();
    const totalSec = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return { key: 'subuh', label: 'Subuh (Besok)', time: times.subuh, countdownStr: `${h}:${m}:${s}` };
  };

  const [status, setStatus] = useState<ActivePrayerStatus>(() => getStatus(customNow || new Date()));

  useEffect(() => {
    if (customNow) return; // Static test mode
    const interval = setInterval(() => {
      setStatus(getStatus(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, [times]);

  return status;
}

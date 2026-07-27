import { CityLocation, getPrayerScheduleForDate, FormattedPrayerTimes } from './astronomy/meeus.ts';

export interface CachedDaySchedule extends FormattedPrayerTimes {
  cacheKey: string;
  dateStr: string;
  dayName: string;
}

const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Lightweight in-memory/IDB fallback store for high speed and clean testing
let inMemoryStore: Map<string, CachedDaySchedule> = new Map();

function buildKey(dateStr: string, kota: CityLocation, tba: number): string {
  return `${dateStr}_${kota.lat.toFixed(3)}_${kota.long.toFixed(3)}_${tba}`;
}

export async function getCachedSchedule(dateStr: string, kota: CityLocation, tba: number): Promise<CachedDaySchedule | null> {
  const key = buildKey(dateStr, kota, tba);
  return inMemoryStore.get(key) || null;
}

export async function saveScheduleBatch(schedules: CachedDaySchedule[]): Promise<void> {
  if (schedules.length === 0) {
    inMemoryStore.clear();
    return;
  }
  for (const item of schedules) {
    inMemoryStore.set(item.cacheKey, item);
  }
}

/**
 * Synchronous/Worker batch generator for full year (365 days).
 */
export async function generateYearScheduleBatch(year: number, kota: CityLocation, tba: number): Promise<CachedDaySchedule[]> {
  const results: CachedDaySchedule[] = [];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const totalDays = isLeap ? 366 : 365;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(year, 0, 1 + i);
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    const times = getPrayerScheduleForDate(d, kota, tba);
    const dayName = INDONESIAN_DAYS[d.getDay()];
    const cacheKey = buildKey(dateStr, kota, tba);

    results.push({
      ...times,
      cacheKey,
      dateStr,
      dayName
    });
  }
  return results;
}

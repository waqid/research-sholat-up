import { generateYearScheduleBatch } from '../lib/db.ts';
import { CityLocation } from '../lib/astronomy/meeus.ts';

self.onmessage = async (e: MessageEvent<{ year: number; kota: CityLocation; tba: number }>) => {
  const { year, kota, tba } = e.data;
  const batch = await generateYearScheduleBatch(year, kota, tba);
  self.postMessage({ success: true, count: batch.length, batch });
};

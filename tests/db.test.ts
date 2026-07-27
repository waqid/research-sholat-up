import { describe, it, expect, beforeEach } from 'vitest';
import { getCachedSchedule, saveScheduleBatch, generateYearScheduleBatch } from '../src/lib/db.ts';
import { getCityById } from '../src/lib/astronomy/cities.ts';

describe('IndexedDB Caching & Batch Generation', () => {
  const malang = getCityById('malang');

  beforeEach(async () => {
    // Clear in-memory mock IDB
    await saveScheduleBatch([]);
  });

  it('generates a full year schedule batch with exact Indonesian day names', async () => {
    const batch = await generateYearScheduleBatch(2026, malang, 1);
    expect(batch.length).toBe(365);
    expect(batch[0].dateStr).toBe('2026-01-01');
    expect(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']).toContain(batch[0].dayName);
  });

  it('saves and retrieves cached schedules accurately', async () => {
    const batch = await generateYearScheduleBatch(2026, malang, 1);
    await saveScheduleBatch([batch[0]]);

    const cached = await getCachedSchedule('2026-01-01', malang, 1);
    expect(cached).not.toBeNull();
    expect(cached?.subuh).toBe(batch[0].subuh);
    expect(cached?.dhuhur).toBe(batch[0].dhuhur);
  });
});

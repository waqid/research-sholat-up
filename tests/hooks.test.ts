import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePrayerTimes } from '../src/hooks/usePrayerTimes.ts';
import { useLiveCountdown } from '../src/hooks/useLiveCountdown.ts';
import { getCityById } from '../src/lib/astronomy/cities.ts';

describe('Custom Hooks: usePrayerTimes & useLiveCountdown', () => {
  const malang = getCityById('malang');

  it('computes synchronous prayer times instantly', () => {
    const testDate = new Date(2026, 6, 27, 10, 0, 0); // 10:00 AM July 27 2026
    const { result } = renderHook(() => usePrayerTimes(malang, 1, testDate));
    expect(result.current.times.dhuhur).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('identifies next upcoming prayer correctly from current time (`useLiveCountdown`)', () => {
    const mockTimes = {
      subuh: "04:13",
      terbit: "05:31",
      dhuhur: "11:26",
      ashar: "14:46",
      maghrib: "17:21",
      isya: "18:33",
      jd: 2454995
    };

    // At 10:00:00 AM, next prayer is Dhuhur (11:26) -> 1h 26m remaining (01:26:00)
    const now = new Date(2026, 6, 27, 10, 0, 0);
    const { result } = renderHook(() => useLiveCountdown(mockTimes, now));

    expect(result.current.key).toBe('dhuhur');
    expect(result.current.label).toBe('Dhuhur');
    expect(result.current.countdownStr).toBe('01:26:00');
  });
});

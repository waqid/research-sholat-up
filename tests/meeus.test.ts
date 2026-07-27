import { describe, it, expect } from 'vitest';
import { gregorianToJD, calculateRawTimes, fmtTime, getPrayerScheduleForDate } from '../src/lib/astronomy/meeus.ts';

describe('Jean Meeus & Pak Abdurrouf Calculation Parity', () => {
  const malang = {
    name: "Kota Malang",
    tinggi: 550,
    long: 112.065,
    lat: -7.54,
    zone: 7
  };

  it('calculates exact Julian Day for Gregorian test date (2009-06-12)', () => {
    // PHP test point: JD 2454995 corresponds to June 12, 2009
    const jd = gregorianToJD(6, 12, 2009);
    expect(jd).toBe(2454995);
  });

  it('formats time with ceiling correctly (`fmtTime`)', () => {
    // 4.1916 hours -> 4:12 (ceil) vs 4:11 (floor)
    expect(fmtTime(4.1916, true)).toBe("04:12");
    expect(fmtTime(5.6608, false)).toBe("05:39");
  });

  it('calculates exact prayer times for Kota Malang test point (JD 2454995, Imam Syafii tba=1)', () => {
    const raw = calculateRawTimes(2454995, malang, 1);

    // Check against legacy functions.php exact formatted strings
    expect(fmtTime(raw.subuh, true)).toBe("04:18");
    expect(fmtTime(raw.terbit, false)).toBe("05:37");
    expect(fmtTime(raw.dhuhur, true)).toBe("11:34");
    expect(fmtTime(raw.ashar, true)).toBe("14:53");
    expect(fmtTime(raw.maghrib, true)).toBe("17:26");
    expect(fmtTime(raw.isya, true)).toBe("18:38");
  });
});

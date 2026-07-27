export interface CityLocation {
  name: string;
  tinggi: number;
  long: number;
  lat: number;
  zone: number;
}

export interface RawCalculationPoints {
  subuh: number;
  terbit: number;
  dhuhur: number;
  ashar: number;
  maghrib: number;
  isya: number;
}

export interface FormattedPrayerTimes {
  subuh: string;
  terbit: string;
  dhuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  jd: number;
}

/**
 * Converts Gregorian Date parameters to Julian Day number.
 * Mirrors PHP GregorianToJD(month, day, year).
 */
export function gregorianToJD(month: number, day: number, year: number): number {
  let m = month;
  let y = year;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + 0.5;
}

/**
 * Formats decimal hours into HH:MM.
 * @param time Decimal hours (e.g. 11.433)
 * @param useCeil True to round up (default for prayers), false for Terbit
 */
export function fmtTime(time: number, useCeil = true): string {
  let jj = Math.floor(time);
  const mmRaw = (time - jj) * 60;
  let mm = useCeil ? Math.ceil(mmRaw) : Math.floor(mmRaw);
  if (mm >= 60) {
    jj += Math.floor(mm / 60);
    mm = mm % 60;
  }
  jj = (jj % 24 + 24) % 24;
  const jjStr = jj.toString().padStart(2, '0');
  const mmStr = mm.toString().padStart(2, '0');
  return `${jjStr}:${mmStr}`;
}

/**
 * Core Jean Meeus calculation formula ported from functions.php.
 * Preserves Pak Abdurrouf trigonometric derivations for Ashar.
 */
export function calculateRawTimes(jd: number, kota: CityLocation, tba: number): RawCalculationPoints {
  const c_dhuhur = 0.033; // ~2 minutes safety margin

  // Date angle in radians
  const T = 2 * Math.PI * (jd - 2451545) / 365.25;

  // Solar declination (delta) in degrees
  let delta = 0.37877 + 23.264 * Math.sin(T - 1.388356) + 0.3812 * Math.sin(2 * T - 1.44307) + 0.17132 * Math.sin(3 * T - 1.042345);
  const deltaRad = delta / 57.297;

  // Solar mean longitude & Equation of Time (EoT) in minutes
  const U = (jd - 2451545) / 36525;
  const L0 = ( (280.46607 + 36000.7698 * U) % 360.0 ) * (Math.PI / 180.0);

  let EoT = - (1789 + 237 * U) * Math.sin(L0) - (7146 - 62 * U) * Math.cos(L0) + (9934 - 14 * U) * Math.sin(2 * L0);
  EoT = EoT - (29 + 5 * U) * Math.cos(2 * L0) + (74 + 10 * U) * Math.sin(3 * L0) + (320 - 4 * U) * Math.cos(3 * L0);
  EoT = (EoT - 212 * Math.sin(4 * L0)) / 1000;

  // Solar transit time (Dhuhur base)
  const transit = 12 + kota.zone - (kota.long / 15) - (EoT / 60);
  const dhuhur = transit + c_dhuhur;

  // Ashar hour angle via Pak Abdurrouf identity: c = tba + tan(|delta - lat|)
  const latRad = kota.lat / 57.297;
  const c = tba + Math.tan(Math.abs(deltaRad - latRad));
  const asharAlt = (1.570796 - Math.atan(c));
  const haAshar = Math.acos( (Math.sin(asharAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)) );
  const ashar = transit + haAshar * (12 / Math.PI);

  // Maghrib altitude with elevation correction
  const maghribAlt = (-0.833 - 0.0347 * Math.sqrt(kota.tinggi)) / 57.297;
  const haMaghrib = Math.acos( (Math.sin(maghribAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)) );
  const maghrib = transit + haMaghrib * (12 / Math.PI);
  const terbit = transit - haMaghrib * (12 / Math.PI);

  // Subuh altitude (-20 degrees)
  const subuhAlt = -20 / 57.297;
  const haSubuh = Math.acos( (Math.sin(subuhAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)) );
  const subuh = transit - haSubuh * (12 / Math.PI);

  // Isya altitude (-18 degrees)
  const isyaAlt = -18 / 57.297;
  const haIsya = Math.acos( (Math.sin(isyaAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)) );
  const isya = transit + haIsya * (12 / Math.PI);

  return { subuh, terbit, dhuhur, ashar, maghrib, isya };
}

/**
 * High-level helper returning formatted HH:MM strings for a given Date.
 */
export function getPrayerScheduleForDate(date: Date, kota: CityLocation, tba: number): FormattedPrayerTimes {
  const jd = gregorianToJD(date.getMonth() + 1, date.getDate(), date.getFullYear());
  const raw = calculateRawTimes(jd, kota, tba);
  return {
    subuh: fmtTime(raw.subuh, true),
    terbit: fmtTime(raw.terbit, false),
    dhuhur: fmtTime(raw.dhuhur, true),
    ashar: fmtTime(raw.ashar, true),
    maghrib: fmtTime(raw.maghrib, true),
    isya: fmtTime(raw.isya, true),
    jd
  };
}

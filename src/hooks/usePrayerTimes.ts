import { useState, useEffect } from 'react';
import { CityLocation, getPrayerScheduleForDate, FormattedPrayerTimes } from '../lib/astronomy/meeus.ts';

export function usePrayerTimes(kota: CityLocation, tba: number, customDate?: Date): { times: FormattedPrayerTimes; isLoading: boolean } {
  const date = customDate || new Date();
  const [times, setTimes] = useState<FormattedPrayerTimes>(() => getPrayerScheduleForDate(date, kota, tba));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const syncTimes = getPrayerScheduleForDate(customDate || new Date(), kota, tba);
    setTimes(syncTimes);
    setIsLoading(false);
  }, [kota.lat, kota.long, tba, customDate]);

  return { times, isLoading };
}

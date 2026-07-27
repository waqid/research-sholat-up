import { useState } from 'react';
import { CityLocation } from '../lib/astronomy/meeus.ts';
import { getCityById } from '../lib/astronomy/cities.ts';

export function useGeolocation(): { location: CityLocation; setLocation: (loc: CityLocation) => void; status: 'idle' | 'detecting' | 'success' | 'error'; errorMsg: string | null; requestGps: () => void } {
  const [location, setLocation] = useState<CityLocation>(() => getCityById('malang'));
  const [status, setStatus] = useState<'idle' | 'detecting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestGps = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation tidak didukung di browser ini.');
      return;
    }
    setStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          name: 'Lokasi GPS (Otomatis)',
          tinggi: pos.coords.altitude || 50,
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
          zone: Math.round(new Date().getTimezoneOffset() / -60)
        });
        setStatus('success');
      },
      () => {
        setStatus('error');
        setErrorMsg('Gagal mendeteksi GPS. Menggunakan lokasi default.');
      },
      { timeout: 8000 }
    );
  };

  return { location, setLocation, status, errorMsg, requestGps };
}

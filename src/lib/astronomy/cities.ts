import { CityLocation } from './meeus.ts';

export interface PresetCity extends CityLocation {
  id: string;
  isGps?: boolean;
}

/**
 * Preset database of Indonesian cities with altitude (meters), coordinates, and UTC zone.
 * Mirrors exact values from functions.php ($malang, $surabaya, $denpasar, $jakarta).
 */
export const PRESET_CITIES: PresetCity[] = [
  { id: 'malang', name: 'Kota Malang', tinggi: 550, long: 112.065, lat: -7.54, zone: 7 },
  { id: 'surabaya', name: 'Kota Surabaya', tinggi: 37.5, long: 112.667, lat: -7.20, zone: 7 },
  { id: 'denpasar', name: 'Kota Denpasar', tinggi: 35, long: 115.15, lat: -8.60, zone: 8 },
  { id: 'jakarta', name: 'Kota Jakarta', tinggi: 50, long: 106.85, lat: -6.16666, zone: 7 }
];

export function getCityById(id: string): PresetCity {
  const match = PRESET_CITIES.find(c => c.id === id);
  return match || PRESET_CITIES[0]; // Default to Kota Malang
}

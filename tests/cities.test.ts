import { describe, it, expect } from 'vitest';
import { PRESET_CITIES, getCityById } from '../src/lib/astronomy/cities.ts';

describe('Preset Indonesian Cities Database', () => {
  it('includes exact 4 legacy preset cities with correct coordinates and altitudes', () => {
    expect(PRESET_CITIES.length).toBe(4);

    const malang = getCityById('malang');
    expect(malang.name).toBe('Kota Malang');
    expect(malang.tinggi).toBe(550);
    expect(malang.zone).toBe(7);

    const denpasar = getCityById('denpasar');
    expect(denpasar.name).toBe('Kota Denpasar');
    expect(denpasar.zone).toBe(8); // WITA
  });

  it('falls back to Kota Malang when unknown ID provided', () => {
    const unknown = getCityById('nonexistent');
    expect(unknown.id).toBe('malang');
  });
});

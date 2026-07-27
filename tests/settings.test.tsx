import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsModal } from '../src/components/settings/SettingsModal.tsx';
import { getCityById } from '../src/lib/astronomy/cities.ts';

describe('Settings Modal & Parameters', () => {
  const malang = getCityById('malang');

  it('renders modal options and triggers callbacks when parameters are selected', () => {
    const handleSelectCity = vi.fn();
    const handleSelectTba = vi.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        activeLocation={malang}
        tba={1}
        onSelectCity={handleSelectCity}
        onSelectGps={vi.fn()}
        onSelectTba={handleSelectTba}
      />
    );

    expect(screen.getByText(/Pilih Parameter Asyar/i)).toBeInTheDocument();

    // Select Surabaya
    fireEvent.click(screen.getByLabelText(/Kota Surabaya/i));
    expect(handleSelectCity).toHaveBeenCalledWith('surabaya');

    // Select Imam Hanafi
    fireEvent.click(screen.getByLabelText(/Imam Hanafi/i));
    expect(handleSelectTba).toHaveBeenCalledWith(2);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopNav } from '../src/components/layout/TopNav.tsx';
import { StatusRamp } from '../src/components/layout/StatusRamp.tsx';
import { getCityById } from '../src/lib/astronomy/cities.ts';

describe('Layout Components: TopNav & StatusRamp', () => {
  const malang = getCityById('malang');

  it('renders TopNav with exact active city and Asar parameter badge', () => {
    const handleTab = vi.fn();
    const handleSettings = vi.fn();

    render(
      <TopNav activeTab="today" onTabChange={handleTab} activeLocation={malang} tba={1} onOpenSettings={handleSettings} />
    );

    expect(screen.getByText('Sholat UP')).toBeInTheDocument();
    expect(screen.getByText('Kota Malang')).toBeInTheDocument();
    expect(screen.getByText("Asar: Syafi'i")).toBeInTheDocument();

    fireEvent.click(screen.getByText('Kalender'));
    expect(handleTab).toHaveBeenCalledWith('calendar');
  });

  it('renders StatusRamp amber warning when GPS error occurs', () => {
    const handleRetry = vi.fn();
    render(<StatusRamp gpsStatus="error" errorMsg="GPS Ditolak" onRetryGps={handleRetry} />);
    expect(screen.getByText(/GPS Ditolak/i)).toBeInTheDocument();
  });
});

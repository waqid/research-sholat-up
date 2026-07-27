import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroCountdown } from '../src/components/today/HeroCountdown.tsx';
import { PrayerGrid } from '../src/components/today/PrayerGrid.tsx';

describe('Today View Components & Signal-Flow Motif', () => {
  const mockTimes = {
    subuh: "04:13",
    terbit: "05:31",
    dhuhur: "11:26",
    ashar: "14:46",
    maghrib: "17:21",
    isya: "18:33",
    jd: 2454995
  };

  const mockStatus = {
    key: 'dhuhur' as const,
    label: 'Dhuhur',
    time: "11:26",
    countdownStr: "01:26:00"
  };

  it('renders HeroCountdown with prominent tabular countdown string', () => {
    render(<HeroCountdown status={mockStatus} />);
    expect(screen.getByText('01:26:00')).toBeInTheDocument();
    expect(screen.getByText(/Menuju Dhuhur/i)).toBeInTheDocument();
  });

  it('applies `signal-flow-active` exactly to the upcoming prayer card in PrayerGrid', () => {
    render(<PrayerGrid times={mockTimes} activeKey="dhuhur" />);

    // Dhuhur card should have signal-flow-active class
    const dhuhurHeading = screen.getByText('Dhuhur');
    const dhuhurCard = dhuhurHeading.closest('.glass-card');
    expect(dhuhurCard).toHaveClass('signal-flow-active');

    // Subuh should not
    const subuhHeading = screen.getByText('Subuh');
    const subuhCard = subuhHeading.closest('.glass-card');
    expect(subuhCard).not.toHaveClass('signal-flow-active');
  });
});

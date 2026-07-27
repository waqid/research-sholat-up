import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarControls } from '../src/components/calendar/CalendarControls.tsx';
import { MultiDayTable } from '../src/components/calendar/MultiDayTable.tsx';

describe('Calendar View & MultiDayTable', () => {
  const mockDays = [
    {
      cacheKey: "2026-07-27_-7.540_112.065_1",
      dateStr: "2026-07-27",
      dayName: "Senin",
      subuh: "04:13",
      terbit: "05:31",
      dhuhur: "11:26",
      ashar: "14:46",
      maghrib: "17:21",
      isya: "18:33",
      jd: 2454995
    }
  ];

  it('renders exact columns and highlights active today row', () => {
    render(<MultiDayTable days={mockDays} activeDateStr="2026-07-27" />);
    expect(screen.getByText('Senin')).toBeInTheDocument();
    expect(screen.getByText('27 Juli 2026')).toBeInTheDocument();
    expect(screen.getByText('11:26')).toBeInTheDocument();

    const row = screen.getByText('Senin').closest('tr');
    expect(row).toHaveClass('bg-[#209CAF]/15');
  });

  it('triggers Print and CSV export actions', () => {
    const handlePrint = vi.fn();
    const handleCsv = vi.fn();
    render(
      <CalendarControls month={7} year={2026} onMonthChange={vi.fn()} onYearChange={vi.fn()} onPrint={handlePrint} onExportCsv={handleCsv} />
    );

    fireEvent.click(screen.getByText(/Cetak/i));
    expect(handlePrint).toHaveBeenCalled();
  });
});

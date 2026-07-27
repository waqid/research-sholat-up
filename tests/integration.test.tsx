import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App.tsx';

describe('Root App Integration & View Switching', () => {
  it('renders Today view by default and switches to Calendar view seamlessly', () => {
    render(<App />);

    // Default Today View
    expect(screen.getByText(/Menuju/i)).toBeInTheDocument();
    expect(screen.getByText(/Ralat waktu sholat ± 2 menit/i)).toBeInTheDocument();

    // Switch to Calendar View
    fireEvent.click(screen.getByText('Kalender'));
    expect(screen.getByText(/Unduh CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Cetak/i)).toBeInTheDocument();
  });
});

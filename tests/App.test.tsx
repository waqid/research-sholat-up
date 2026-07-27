import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App.tsx';

describe('App Smoke Test', () => {
  it('renders Sholat UP header inside glass-card', () => {
    render(<App />);
    expect(screen.getByText('Sholat UP')).toBeInTheDocument();
    expect(screen.getByText('Jadwal Sholat Presisi')).toBeInTheDocument();
  });
});

# Sholat UP: React + Vite + Tailwind v4 PWA Design Specification

**Date:** 2026-07-27  
**Topic:** Front-End Rewrite & Modernization (`react` + `vite` + `tailwindcss v4` + `vite-plugin-pwa`)  
**Design System:** `dama-design` (Monochrome base, Teal `#209CAF` structural + Flame `#EB7841` energy duotone, glass surfaces, `signal-flow` motif)  
**Creative North Star:** "The Precision Tool" — utility-first, high contrast, fast load, offline-capable.

---

## 1. Executive Summary & Architecture

Sholat UP is migrating from a server-side PHP (`functions.php` / `schedule.php`) application to a 100% client-side Progressive Web App (PWA) powered by React 19, Vite, and Tailwind CSS v4.

Instead of relying on server round-trips for multi-day schedule generation, the exact Jean Meeus astronomical formulas (alongside Pak Abdurrouf's trigonometric derivations for Ashar) are ported into pure TypeScript (`src/lib/astronomy/`). This enables zero-latency local computation, instant multi-day schedule rendering, browser GPS coordinate auto-detection, and full offline functionality via Web Workers and IndexedDB.

### Core Stack
- **Build & Framework:** Vite + React 19 + TypeScript (`strict: true`)
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss";` with CSS-first `@theme` configuration)
- **Design System:** `dama-design` tokens (`tokens/tokens.css` bridge to `@theme`)
- **PWA & Offline Storage:** `vite-plugin-pwa` (Service Worker) + Web Workers + IndexedDB (`Dexie` / custom wrapper)
- **Icons & Utilities:** `lucide-react` (sparingly), `date-fns` (or native `Intl` formatter)

---

## 2. Directory Structure

```
research-sholat-up/
├── docs/superpowers/specs/
│   └── 2026-07-27-react-vite-tailwind-v4-pwa-design.md
├── src/
│   ├── lib/
│   │   ├── astronomy/
│   │   │   ├── meeus.ts        # Jean Meeus astronomical math + solar declination + EoT
│   │   │   ├── prayer-times.ts # Subuh, Terbit, Dhuhur, Ashar, Maghrib, Isya derivations
│   │   │   └── cities.ts       # Preset Indonesian city DB + altitude correction factor
│   │   └── db.ts               # IndexedDB wrapper for caching precomputed 365-day tables
│   ├── hooks/
│   │   ├── usePrayerTimes.ts   # Live calculation hook based on active location & date
│   │   ├── useGeolocation.ts   # GPS coordinate picker with permission fallback
│   │   └── useLiveCountdown.ts # Second-by-second countdown ticker to next upcoming prayer
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx          # Fixed dark nav (#282828), city badge, settings trigger
│   │   │   ├── StatusRamp.tsx      # GPS/Offline/PWA status indicators (--color-status-*)
│   │   │   └── PWAInstallPrompt.tsx# Non-intrusive install banner
│   │   ├── today/
│   │   │   ├── HeroCountdown.tsx   # Display hero ticker ("02:14:35 menuju Dhuhur")
│   │   │   ├── PrayerGrid.tsx      # 6-card grid (Subuh to Isya)
│   │   │   ├── PrayerCard.tsx      # Individual glass card with signal-flow motif support
│   │   │   └── AccuracyNote.tsx    # "Ralat waktu sholat ± 2 menit" footer note
│   │   ├── calendar/
│   │   │   ├── CalendarControls.tsx# Month/Year selector & Print/Export CSV buttons
│   │   │   └── MultiDayTable.tsx   # Responsive table view for 30/90/365 day schedules
│   │   └── settings/
│   │       ├── SettingsModal.tsx   # Modal for location & Asar parameter configuration
│   │       ├── LocationSelector.tsx# GPS auto-detect vs preset city selector
│   │       └── AsarParameter.tsx   # Radio toggle: Imam Syafi'i (tba=1) vs Hanafi (tba=2)
│   ├── workers/
│   │   └── astronomy.worker.ts # Background Web Worker precomputing 365-day schedules
│   ├── sw/
│   │   └── notification-worker.ts # Service worker for background prayer notifications
│   ├── App.tsx                 # Root layout and tab switching ("Hari Ini" vs "Kalender")
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Tailwind v4 CSS entry point + dama-design @theme & @utility
├── index.html                  # Responsive meta tags & PWA manifest link
├── package.json
├── tsconfig.json
└── vite.config.ts              # Vite configuration with PWA plugin
```

---

## 3. Calculation Engine (`src/lib/astronomy/`)

The calculation engine directly ports the mathematical logic from `functions.php` into strictly typed TypeScript while preserving exact attribution and formulas.

### Astronomical Formulas (`meeus.ts` & `prayer-times.ts`)
1. **Julian Day (`JD`):** Standard Gregorian conversion formula ($JD = 2451545 + ...$).
2. **Date Angle ($T$) & Solar Declination ($\delta$):**
   $$\text{T} = \frac{2\pi(\text{JD} - 2451545)}{365.25}$$
   $$\delta = \frac{0.37877 + 23.264\sin(T - 1.388356) + 0.3812\sin(2T - 1.44307) + 0.17132\sin(3T - 1.042345)}{57.297}$$
3. **Equation of Time ($EoT$):**
   Calculated via solar mean longitude $L_0$ in minutes (`(EoT - 212 * sin(4 * L0)) / 1000`).
4. **Solar Transit (Dhuhur):**
   $$\text{transit} = 12 + \text{zone} - \frac{\text{long}}{15} - \frac{EoT}{60} + c\_dhuhur$$
   Where $c\_dhuhur = 0.033$ hours (~2 minutes safety margin).
5. **Ashar Hour Angle & Altitude (Pak Abdurrouf Identity):**
   $$c = tba + \tan(|\delta - \text{lat\_rad}|)$$
   $$\text{ashar\_alt} = \frac{\pi}{2} - \arctan(c)$$
   Where $tba = 1$ for Imam Syafi'i and $tba = 2$ for Imam Hanafi. Hour angle derived via $\arccos$.
6. **Subuh, Maghrib, Isya Altitudes:**
   - Maghrib altitude with elevation correction: $-0.833^\circ - 0.0347 \times \sqrt{\text{tinggi (meters)}}$.
   - Subuh altitude: $-20^\circ$ (Indonesian standard).
   - Isya altitude: $-18^\circ$ (Indonesian standard).

---

## 4. Design System Integration (`Tailwind v4` + `dama-design`)

### CSS-First Configuration (`src/index.css`)
No `tailwind.config.js` is created. All tokens and custom utilities reside in `@theme` and `@utility` blocks inside `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Brand Duotone: Teal (Structural) + Flame (Energy/Motif Spark) */
  --color-teal: #209CAF;
  --color-teal-dark: #177C8C;
  --color-flame: #EB7841;
  --color-flame-hover: #F28C59;

  /* Monochrome Base & Navigation */
  --color-ink: #18181B;
  --color-ink-muted: #52525B;
  --color-surface: #FFFFFF;
  --color-surface-muted: #FAFAFA;
  --color-surface-dark: #0F172A;
  --color-nav: #282828;

  /* Status Ramp for PWA & GPS Monitoring */
  --color-status-success: #10B981;
  --color-status-warning: #F59E0B;
  --color-status-error: #EF4444;

  /* Typography (Self-hosted RG / clean functional sans) */
  --font-display: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-sans: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif;

  /* Radius & Spacing */
  --radius-card: 14px;
  --radius-btn: 8px;
}

/* Glassmorphism Surface Utility */
@utility glass-card {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(32, 156, 175, 0.2);
  border-radius: var(--radius-card);
}

@media (prefers-color-scheme: dark) {
  @utility glass-card {
    background-color: rgba(15, 23, 42, 0.85);
    border-color: rgba(32, 156, 175, 0.3);
  }
}

/* Signal-Flow Motif for Next Upcoming Prayer Card */
@utility signal-flow-active {
  border: 2px solid var(--color-flame) !important;
  box-shadow: 0 0 20px rgba(235, 120, 65, 0.25);
  position: relative;
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### UI Component Guidelines
- **Teal (#209CAF):** Used for structural boundaries, active tab borders, secondary focus rings, and primary action buttons.
- **Flame (#EB7841):** Used strictly for energy highlights—specifically the **active countdown pulse dot**, the `signal-flow-active` border on the upcoming prayer card, and primary CTAs. Never used as large background fills.
- **Typography & Contrast:** All body text (`--color-ink-muted` `#52525B`) meets WCAG AA (`4.5:1` minimum). Hero countdown (`text-5xl md:text-7xl`) uses `--font-display` with clean tabular numbers (`font-mono` or `font-variant-numeric: tabular-nums`).

---

## 5. Component Tree & User Flow

### Root Component (`<App />`)
- Manages active tab state (`today` vs `calendar`), settings modal visibility, and checks service worker status.
- Renders `<TopNav />` with active city indicator (`GPS` icon or preset name) and Asar parameter badge (`Imam Syafi'i` or `Hanafi`).

### Today View (`<TodayView />`)
- **`<HeroCountdown />`:** Displays large live countdown ticker (`"02:14:35"`) and active target (`"menuju Dhuhur"`).
- **`<PrayerGrid />`:** Renders 6 `<PrayerCard />` instances (`Subuh, Terbit, Dhuhur, Ashar, Maghrib, Isya`).
- Exactly one `<PrayerCard />` matching `nextPrayer.key` receives the `@utility signal-flow-active` class and glowing pulse dot.
- **`<AccuracyNote />`:** Displays `"Ralat waktu sholat ± 2 menit"` at bottom.

### Calendar View (`<CalendarView />`)
- **`<CalendarControls />`:** Month (`Januari - Desember`) and Year (`2026`) dropdown pickers, plus `Cetak Jadwal` (Print) and `Unduh CSV` (Export) actions.
- **`<MultiDayTable />`:** High-density, responsive table displaying 30/90/365 days. Alternating row colors (`--color-surface-muted`), with today's row highlighted in `--color-teal/10`.

### Settings Modal (`<SettingsModal />`)
- **Location Selector:** Radio options for `Kota Malang`, `Kota Surabaya`, `Kota Denpasar`, `Kota Jakarta`, or `Deteksi GPS Otomatis`.
- **Asar Parameter:** Radio toggle between `Imam Syafi'i (tba = 1)` and `Imam Hanafi (tba = 2)`.
- Changes take effect immediately without full page reload.

---

## 6. State Management, Web Workers & Offline PWA Strategy

### Background Calculation Workflow
1. When the user changes location or Asar parameter in `<SettingsModal />`, the main thread synchronously calculates **today's schedule** (<5ms execution time) to update the UI immediately.
2. The main thread spawns `src/workers/astronomy.worker.ts` with `{ year, lat, long, altitude, tba, zone }`.
3. The Web Worker precomputes all 365 days in background (leaving main thread at 60fps) and writes results into IndexedDB (`src/lib/db.ts`).
4. Subsequent `<CalendarView />` queries fetch precomputed tables from IndexedDB in <2ms.

### Offline & Geolocation Resilience
- **PWA Service Worker (`vite-plugin-pwa`):** Caches HTML, CSS, JS bundles, and self-hosted fonts (`Cache-First` strategy). Sholat UP functions 100% offline or in airplane mode.
- **GPS Permission Fallback:** If `navigator.geolocation.getCurrentPosition` times out or is denied, `<StatusRamp />` displays an amber pill (`--color-status-warning`): *"GPS tidak aktif. Menggunakan lokasi default: Kota Malang"*. User can click to open `<SettingsModal />`.

---

## 7. Verification & Parity Strategy

1. **Mathematical Parity Verification (`tests/meeus.test.ts`):**
   Automated unit tests assert that pure TypeScript outputs for `JD 2454995`, `Kota Malang`, and `Imam Syafi'i` exactly match the legacy PHP `functions.php` generated values ($\pm 0$ minutes variance).
2. **WCAG AA Contrast Audit:**
   Run `node scripts/check-contrast.mjs` (or inspect computed colors) ensuring text contrast ratios against glass cards meet or exceed `4.5:1`.
3. **PWA Production Verification:**
   Execute `npm run build && npm run preview` to verify service worker registration, offline asset caching, and IndexedDB schedule caching.

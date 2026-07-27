# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Test, and Development Commands

```bash
# Development server
npm run dev

# Production build (runs tsc and generates dist/ with PWA service worker)
npm run build

# Preview production build locally
npm run preview

# Run all unit and integration tests (Vitest)
npm test
# or: npx vitest run

# Run a single test file
npx vitest run tests/meeus.test.ts
npx vitest run tests/integration.test.tsx

# Run a specific test case by name pattern
npx vitest run -t "formats time with ceiling correctly"

# Standalone TypeScript strict type checking
npx tsc --noEmit
```

## Architecture & Code Structure

Sholat UP is a 100% client-side Progressive Web App (PWA) built with **React 19, Vite 6, TypeScript (`strict: true`), and Tailwind CSS v4**. It replaces a legacy server-side PHP (`functions.php` / `schedule.php`) application with local astronomical computation, GPS auto-detection, and offline support.

### 1. Calculation Engine (`src/lib/astronomy/`)
- **`meeus.ts`**: Core mathematical calculations ported directly from legacy `functions.php`. Implements Jean Meeus formulas for Julian Day (`gregorianToJD`), solar declination ($\delta$), Equation of Time ($EoT$), solar transit time ($transit$), and prayer altitudes. Preserves Pak Abdurrouf's Ashar trigonometric identity ($c = tba + \tan(|\delta - lat|)$) where $tba = 1$ (Imam Syafi'i default) and $tba = 2$ (Imam Hanafi).
- **Time Formatting (`fmtTime`)**: Converts decimal hours to `HH:MM`. Includes explicit minute rollover handling (`if mm >= 60: jj += 1; mm %= 60`) to prevent invalid clock times like `14:60`. `useCeil = true` rounds up for all prayers (safety margin); `useCeil = false` rounds down for Terbit.
- **`cities.ts`**: Preset database of Indonesian cities (`malang`, `surabaya`, `denpasar`, `jakarta`) with exact altitude (`tinggi` in meters) and coordinates. `getCityById(id)` falls back to Kota Malang.

### 2. State & Worker Precomputation (`src/lib/db.ts`, `src/workers/`)
- **`src/workers/astronomy.worker.ts`**: Spawns in the background on location or parameter shifts to precompute 365-day schedules (`generateYearScheduleBatch`) without blocking the main UI thread.
- **`src/lib/db.ts`**: In-memory `Map` caching layer keyed by `dateStr_lat_long_tba`. Multi-day schedule requests from the Calendar view retrieve precomputed batches instantly (<2ms).

### 3. Custom Hooks (`src/hooks/`)
- **`useGeolocation.ts`**: Manages active location state (`location`, `setLocation`) with browser `navigator.geolocation` detection (`requestGps`) and clean error fallback to Kota Malang.
- **`usePrayerTimes.ts`**: Computes active day schedule whenever `location` or `tba` changes.
- **`useLiveCountdown.ts`**: 1s timer loop tracking active countdown string (`02:14:35`), current target prayer (`Menuju Dhuhur`), and `nextPrayer.key` for UI highlighting.

### 4. UI Components (`src/components/`) & Root (`src/App.tsx`)
- **`layout/` (`TopNav`, `StatusRamp`, `PWAInstallPrompt`)**: Top navigation with tab switching (`Hari Ini` vs `Kalender`) and GPS/offline status alerts (`StatusRamp`).
- **`today/` (`HeroCountdown`, `PrayerGrid`, `PrayerCard`, `AccuracyNote`)**: Today view. Exactly one `<PrayerCard />` whose key matches `countdownStatus.key` receives the `@utility signal-flow-active` class and glowing border.
- **`calendar/` (`CalendarControls`, `MultiDayTable`)**: Monthly/Yearly schedule table highlighting `activeDateStr` (`bg-[#209CAF]/15`), with native browser print (`window.print()`) and BOM-less CSV export.
- **`settings/` (`SettingsModal`, `LocationSelector`, `AsarParameter`)**: Modal for toggling preset/GPS locations and Asar parameter ($tba = 1$ vs $2$) without reloading.

### 5. Design System & Styling (`dama-design` / Tailwind v4)
- **CSS-First Configuration (`src/index.css`)**: Uses `@import "tailwindcss";` with `@theme` block definitions (`--color-teal: #209CAF`, `--color-flame: #EB7841`, `--color-ink: #18181B`, `--color-nav: #282828`, `--font-display`, `--radius-card`, `--radius-btn`). **Do not create a `tailwind.config.js` file.**
- **Brand Duotone**: Teal (`#209CAF`) is used for structural boundaries and secondary focus rings; Flame (`#EB7841`) is used strictly for energy highlights (active countdown pulse dot and active prayer card border).
- **Custom Utilities**: `@utility glass-card` (translucent backdrop blur surface) and `@utility signal-flow-active` (flame border glow for active prayer).
- **Theme Switching**: Dark mode is handled automatically via system `prefers-color-scheme: dark` media queries inside `src/index.css` and standard dark utility classes (`dark:bg-slate-900`, `dark:text-white`).

## Important Conventions & Rules

- **Strict TypeScript (`tsconfig.json`)**: `strict: true`, `noUnusedLocals: true`, and `noUnusedParameters: true` are enforced. All variables and imports must be actively used.
- **JSX Test File Extension (`.tsx`)**: Any test file under `tests/` that contains JSX syntax (`<Component />`) MUST use the `.tsx` file extension (`tests/today.test.tsx`, `tests/integration.test.tsx`), not `.ts`. Vitest/esbuild will reject JSX in a `.ts` file under strict mode.
- **React Imports in `.tsx`**: The project uses React 19 automatic JSX transform (`react-jsx`). Drop unused `import React from 'react'` from `.tsx` test files unless `React` is explicitly referenced as a variable, or `noUnusedLocals` will fail during build/typecheck.
- **Parity Preservation**: When modifying `src/lib/astronomy/meeus.ts`, always run `npm test` to verify `tests/meeus.test.ts` (`JD 2454995` parity check against legacy PHP output) passes.

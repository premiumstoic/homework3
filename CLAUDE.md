# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MAT306 Homework 3: an interactive web report and nanoparticle discovery dashboard for analyzing QDNP015 (a CdTe quantum dot) using normal mode analysis (GNM and ANM). The web app lives in `qdot-discover/`.

## Commands

All commands run from `qdot-discover/`:

```bash
npm run dev    # Dev server at http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint
npm start      # Serve production build
```

## Architecture

**Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts, 3dmol.js.

**Three pages:**
- `/` — Narrative report for QDNP015 with embedded figures (from `public/report/`) and eigenvalue charts. Eigenvalue data is synthetic (generated inline in `src/app/page.tsx`).
- `/discover` — Faceted search dashboard over 90+ nanoparticles. Server component (`discover/page.tsx`) parses URL search params before hydration, then passes to client-side `DiscoverDashboard`.
- `/qdot/[id]` — Detail page for a single nanoparticle with 3D viewer and dynamics charts.

**Data layer (`src/lib/qdot-data.ts`):**
- Imports `src/data/nanoparticles_comprehensive.json` (ViNAS toolbox data, ~90 entries).
- `normalizeQDot()` adds computed fields (size labels, element ordering, zeta potential normalization).
- `filterQDots()` handles text search + element, atom count, and zeta potential filters.
- `parseDiscoverFilters()` / `serializeDiscoverFilters()` convert between URL params and filter state.
- Element ordering preference: Cd, Zn, Se, Te, S, Si prioritized; organic elements (C/H/N/O) filtered out.

**3D visualization** uses `next/dynamic` with `ssr: false` (3dmol requires browser APIs). Currently renders mock spheres; real PDB files are in `pdb_files/` at the repo root but are not yet wired into the viewer.

**UI components** in `src/components/ui/` are minimal shadcn-style implementations (Button, Card, Badge, Slider, Checkbox) — not from an external library.

# Stochast Design Report

## 1. Executive Summary
Stochast is designed as a focused technical instrument rather than a conventional web app. The product language is intentionally analytical, calm, and data-first. Instead of prioritizing decorative UI, it treats formulas, trajectories, histograms, and metrics as the primary interface.

This direction is consistently applied through:
- a tokenized theme system with restrained surfaces and saturated data accents
- monospace-first typography for operational UI
- panel-based layout grammar that mirrors analytical workflows
- keyboard-first interactions and low-ornament motion
- canvas-rendered visualizations for performance and visual control

## 2. Design Language

### 2.1 Core Principles
The design language combines “Minimalist Functionalism” with a restrained brutalist flavor:
- content-as-UI: the simulation output is the visual center
- low chrome: minimal borders, low shadow usage, modest radii
- high signal density: dense information, but tightly structured
- non-marketing tone: no hero gradients, no decorative illustration layer

### 2.2 Typography Strategy
Typography is role-based and intentionally narrow:
- `IBM Plex Mono` for controls, formulas, labels, metrics, and chart-adjacent text
- `IBM Plex Sans` only for longer explanatory prose in textbook content

This separation keeps interaction surfaces precise while preserving readability in narrative content.

### 2.3 Color + Theme Strategy
The project uses CSS custom-property tokens mapped into Tailwind utilities. Themes share the same semantic token contract (`background`, `surface`, `border`, `text`, `accent`, chart tokens), allowing consistent component behavior across appearances.

Shipped theme families include dark and light variants, with chart marks receiving the strongest chroma. This preserves analytical clarity while still enabling distinct visual identities.

## 3. How The Design Is Implemented

### 3.1 Token Architecture
Theme tokens are defined globally as CSS variables and consumed by utility classes and inline canvas token reads.

Implementation anchors:
- `/Users/mchalil/Documents/Stochast/app/globals.css`
- `/Users/mchalil/Documents/Stochast/tailwind.config.ts`
- `/Users/mchalil/Documents/Stochast/lib/themes.ts`

### 3.2 Layout Grammar
The layout is split by product mode:
- textbook route: narrow reading column + progress/navigation framing
- sandbox route: instrument-style panel layout (formula/controls, main trajectory, histogram+metrics rail)
- mobile: fixed stack order prioritizing formula and chart access

Implementation anchors:
- `/Users/mchalil/Documents/Stochast/app/page.tsx`
- `/Users/mchalil/Documents/Stochast/app/[chapter]/page.tsx`
- `/Users/mchalil/Documents/Stochast/components/sandbox/SandboxController.tsx`

### 3.3 Interaction Model
Interactions are optimized for speed and repeatability:
- command palette (`Cmd/Ctrl+K`)
- playback shortcuts (`Space`, `R`)
- inline formula validation before execution
- run-state gating (disable unsafe edits while simulating)

Implementation anchors:
- `/Users/mchalil/Documents/Stochast/components/sandbox/FormulaBar.tsx`
- `/Users/mchalil/Documents/Stochast/components/sandbox/CommandPalette.tsx`
- `/Users/mchalil/Documents/Stochast/components/sandbox/PlaybackControls.tsx`
- `/Users/mchalil/Documents/Stochast/components/sandbox/ProgressBar.tsx`

### 3.4 Visualization Layer
Charts are rendered using Canvas 2D, not DOM nodes, to support high-frequency updates and large path sets with controlled styling.

Implementation anchors:
- `/Users/mchalil/Documents/Stochast/components/sandbox/PathCanvas.tsx`
- `/Users/mchalil/Documents/Stochast/components/sandbox/HistogramCanvas.tsx`
- `/Users/mchalil/Documents/Stochast/lib/canvas-draw.ts`

### 3.5 Engine/UI Separation
Simulation execution runs in a Web Worker with a typed message contract. The main thread orchestrates lifecycle and presentation only.

Implementation anchors:
- `/Users/mchalil/Documents/Stochast/lib/simulation-controller.ts`
- `/Users/mchalil/Documents/Stochast/workers/simulation.worker.ts`
- `/Users/mchalil/Documents/Stochast/lib/simulation-core.ts`
- `/Users/mchalil/Documents/Stochast/store/simulation.ts`

### 3.6 Export Consistency
Export images are rendered from a dedicated canvas composition using live theme tokens, preserving parity with in-app appearance.

Implementation anchors:
- `/Users/mchalil/Documents/Stochast/lib/export.ts`
- `/Users/mchalil/Documents/Stochast/components/sandbox/ExportButton.tsx`

## 4. Why These Choices Work
- **Clarity under density:** monospace hierarchy + border-based zoning keeps complex data readable.
- **Performance alignment:** Canvas + Worker architecture supports responsive simulation UX.
- **Scalable consistency:** semantic tokens let new themes and components ship without visual drift.
- **Operational ergonomics:** keyboard shortcuts and command palette reduce interaction friction.

## 5. Adaptation Guide For Other Projects

### 5.1 Portable Patterns
You can reuse this approach in other tools by preserving the pattern, not the exact visuals:
- semantic token system first
- strict typography roles
- panelized task-oriented layouts
- keyboard-first command surface
- canvas/webgl for high-frequency charting

### 5.2 Good Fit Project Types
This language adapts well to:
- scientific/quantitative dashboards
- developer tooling UIs
- observability and incident-analysis consoles
- simulation and modeling products
- educational products with executable widgets

### 5.3 Adaptation Steps
1. Define product tone in 3-5 adjectives and list anti-patterns.
2. Build a semantic token map before component work.
3. Assign typography by function (operational vs narrative).
4. Lock layout zones around user workflows, not card templates.
5. Decide rendering boundaries early (DOM vs canvas vs worker).
6. Create a lightweight keyboard command model.
7. Implement export/report artifacts from the same token source.

### 5.4 What To Avoid During Adaptation
- adding marketing-style gradients and heavy card shadows
- letting controls visually dominate the primary data surface
- mixing too many typefaces or role rules
- creating theme variants that break metric/chart contrast

## 6. Notable Evolution
The phase docs originally locked five launch themes; implementation currently includes an additional `Ember` theme in code. This is a reasonable extension, but it should be reflected in the phase docs to keep specification and implementation synchronized.

## 7. Conclusion
Stochast demonstrates a coherent, implementation-backed design system where visual language, interaction model, and technical architecture reinforce each other. The strongest transferable insight is that design consistency comes from shared contracts (tokens, typed state, layout grammar, interaction rules), not from static mockups.

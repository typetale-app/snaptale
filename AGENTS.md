# Snaptale Developer Guidelines & Project Overview

This document provides a comprehensive overview of the Snaptale Image Editor project, its architecture, and development guidelines for future AI agents and developers.

---

## 1. Project Overview

**Snaptale** is a modern, high-performance, web-based interactive image editor. It is designed to run standalone or be embedded inside widgets/UMD scripts (e.g. Pintura replacement).

### Technology Stack
- **Runtime:** [Bun](https://bun.sh/)
- **Core Library:** React 19 (supports React 18+ paradigms)
- **Canvas Rendering:** [Konva](https://konva.js.org/) & [react-konva](https://konva.js.org/docs/react/index.html)
- **Styling:** Tailwind CSS & Radix UI primitives
- **Icons:** Lucide React

---

## 2. Directory Structure

The project directory is structured by domain feature rather than raw technology type where appropriate:

```text
├── src/
│   ├── components/                # Shared global UI components
│   │   ├── ui/                    # Shadcn/Radix primitive components (Button, Input, Slider, etc.)
│   │   └── AngleSlider.tsx        # Custom drag-based canvas angle controller
│   ├── editor/                    # Main Editor feature directory
│   │   ├── components/            # UI components and toolbars
│   │   │   ├── EditorToolbar.tsx  # Top bar with tool selectors and Export/Reset actions
│   │   │   ├── BottomToolbar.tsx  # Unified sliding container supporting sub-pages & navigation context
│   │   │   ├── CropToolbar.tsx    # Bottom controls for rotation, flips, straighten, and zoom
│   │   │   ├── FilterToolbar.tsx  # Bottom controls for preset filters and adjustments
│   │   │   ├── TextToolbar.tsx    # Font selection, size, formatting, color, letter-spacing, and shadow
│   │   │   ├── SymbolsToolbar.tsx # Emoji stickers & shapes (rectangle, circle, triangle, star, arrow, line)
│   │   │   └── EditorSlider.tsx   # Custom reusable slider conforming to the DRY principle
│   │   ├── context/               # Global Editor State Management
│   │   │   ├── EditorContext.tsx  # Main context provider and hooks (`useEditor`)
│   │   │   └── hooks/             # Nested hooks supplying context slices (e.g., useTextState, useSymbolState)
│   │   ├── hooks/                 # General hooks (useExport, useReset)
│   │   ├── tools/                 # Konva-specific interactive overlay shapes & handlers
│   │   │   ├── CropTool.tsx       # Bounding box crop overlays and drag controls
│   │   │   ├── TextTool.tsx       # Text rendering nodes and transformer handlers
│   │   │   └── SymbolsTool.tsx    # Sticker/shape rendering nodes and transformer handlers
│   │   ├── EditorCanvas.tsx       # Main Konva <Stage> and event coordinator
│   │   ├── ImageEditor.tsx        # Layout wrapper putting Canvas and Toolbars together
│   │   └── page.tsx               # Editor entry view
│   ├── index.html                 # Demo playground HTML
│   ├── index.ts                   # Bun server configuration
│   └── snaptale.tsx               # UMD/Widget mounting entry point (`window.pintura.init()`)
├── tailwind.config.js             # Tailwind CSS build config
├── tsconfig.json                  # TypeScript compiler settings
└── build.ts                       # Bun compiler bundle builder script
```

---

## 3. Architecture & State Management

### The Editor Context
State is centralized inside `EditorContext.tsx` using `useEditor()`. This context exposes:
- **Canvas Boundaries:** `stageSize` and `imageSize`.
- **Viewport Config:** Zoom level (`zoom`) and panning coordinates (`stagePos`).
- **Active tool state:** `activeTool` ("crop" | "filter" | "text" | "symbols" | "rotate" | "adjust" | null).
- **Transformation config:** `imageRotation`, `imageScaleX`, `imageScaleY`, and `filters` (brightness, contrast, saturation, blur, presets).
- **Layer arrays:** `texts` and `symbols` along with custom CRUD functions.

### Decoupling Logic (SOLID Principles)
- **React UI vs Konva Logic:** UI toolbars should not contain canvas export or Konva-specific caching logic.
- **Custom Hooks:** 
  - Canvas export logic is delegated to the `useExport` hook (`src/editor/hooks/useExport.ts`).
  - Editor reset logic is delegated to the `useReset` hook (`src/editor/hooks/useReset.ts`).

---

## 4. Coding & Refactoring Guidelines

When adding features or refactoring, AI agents and developers **MUST** adhere to the following rules:

### A. Don't Repeat Yourself (DRY)
- Do not repeat pseudo-element styling classnames for slider components. Always use the shared `<EditorSlider />` component located in `src/editor/components/EditorSlider.tsx`.
- Keep the `BottomToolbar` component unified. If adding sub-page layers inside toolbars, utilize the `ToolbarNavContext` via `useToolbarNav()` rather than creating custom stack-state routers inside child toolbars.

### B. Single Responsibility Principle (SRP)
- React components should deal solely with UI layout, interaction, and styling.
- Extrapolate mathematical coordinate logic, file exporting, and deep state mutation helpers into hooks or dedicated utility modules.

### C. Performance & Re-renders
- Minimize parent component re-renders. Avoid injecting heavy calculations inside render loops.
- Konva canvas updates should utilize `batchDraw()` where appropriate to optimize WebGL/2D canvas rendering frames.

### D. File Cleanliness
- Periodically check for dead code or unused files. If a toolbar, icon, or handler file is orphaned, delete it to keep the search indexing minimal.

---

## 5. Development & Build Commands

- **Start Local Server:**
  ```bash
  bun run dev
  ```
- **Build UMD Bundle (Widget):**
  ```bash
  bun run build:umd
  ```
- **Check TypeScript types:**
  ```bash
  bun x tsc --noEmit
  ```

---

## 6. Design Context & Impeccable Setup

This project uses the `impeccable` design harness to maintain visual consistency and alignment.

- **Strategic Guidelines**: Refer to [PRODUCT.md](file:///home/tsl4/snaptale/PRODUCT.md) for target users, brand personality, and design principles.
- **Visual Design System**: Refer to [DESIGN.md](file:///home/tsl4/snaptale/DESIGN.md) for typography, colors, and layout instructions.
- **Active Register**: `product`
- **Creative North Star**: "The Precise Minimalist Studio" (sleek dark workspace containers paired with highly responsive, tactile, and playful canvas interactive controls).
- **Core Principles**:
  - *Instant Response*: Real-time canvas editing without frame delay or input lag.
  - *Clean Discretion*: Hide non-contextual options to keep focus on the image.
  - *Controlled Vibrancy*: Sleek neutral toolbar frames contrast with playful, colorful annotations on the canvas.

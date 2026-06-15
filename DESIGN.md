---
name: Snaptale Design System
description: High-performance interactive image editor with a precise minimalist container and playful, interactive details.
colors:
  primary: "#ececec"
  neutral-bg: "#18181a"
  border: "#ffffff1a"
  destructive: "#b33939"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: Snaptale

## 1. Overview

**Creative North Star: "The Precise Minimalist Studio"**

Snaptale is designed around the concept of a high-performance, distraction-free container that surrounds a highly creative and playful canvas space. The interface remains neutral, sleek, and dark, ensuring the image and editing assets (stickers, shapes, colors) take full focus. Interactivity is defined by bouncy hover states, smooth transitions, and highly tactile sliding sheets that make the utility feel fluid and satisfying rather than sterile.

### Key Characteristics:
- **Dark Studio Workspace**: Keeps the surrounding interface uniform, preventing ambient light/color bleeding from affecting the editing process.
- **Vibrant Canvas Controls**: Editing overlays, stickers, and interactive nodes are vibrant and tactile.
- **Glassmorphic Sheets**: Toolbars float above the canvas with backdrop-blur, preserving spatial hierarchy.

## 2. Colors

The color palette is strictly dark and neutral to prioritize canvas colors, utilizing high-contrast white text for legibility.

### Primary
- **Active Accent** (#ececec / oklch(0.922 0 0)): Used for primary action buttons, active states, and highlighted options.

### Neutral
- **Studio Background** (#18181a / oklch(0.145 0 0)): The base container and workspace color, providing deep dark contrast.
- **Border / Divider** (#ffffff1a / oklch(1 0 0 / 10%)): Subtle separators for grouping toolbar controls.

### Destructive
- **Warning Accent** (#b33939 / oklch(0.577 0.245 27.325)): Reserved exclusively for destructive actions like reset or discard.

### Named Rules
**The Studio Isolation Rule.** The workspace background and toolbars must never use saturated or warm hues. Saturated colors are reserved exclusively for the image content or active canvas annotations (stickers/text overlays).

## 3. Typography

**Display Font:** Inter, sans-serif
**Body Font:** Inter, sans-serif

### Hierarchy
- **Display** (Semi-Bold (600), 1.5rem (24px), 1.25): Used for title headers or main tool headings.
- **Body** (Regular (400), 0.875rem (14px), 1.5): Used for descriptions, tool tips, and standard options.
- **Label** (Medium (500), 0.75rem (12px), normal): Used for buttons, slider labels, and input labels.

## 4. Elevation

Depth in Snaptale is achieved via spatial overlay sheets with glassmorphism rather than heavy drop shadows.

### Shadow Vocabulary
- **Sheet Elevation** (`0 8px 32px rgba(0,0,0,0.5)`): Applied to floating toolbars and modal sheets to separate them from the canvas below.

### Named Rules
**The Glass Blur Rule.** Floating sheets and overlays must combine a background fill with `backdrop-blur-xl` and a 1px border. Never use solid, opaque container panels for overlays.

## 5. Components

### Buttons
- **Shape:** Rounded Medium (12px / `var(--radius-md)`)
- **Primary / Active:** High-contrast solid background (`#ececec`) with dark text, incorporating an inner highlight shadow.
- **Ghost:** Transparent background with high-opacity text, transitioning to `bg-white/5` on hover.

### Sheets / Toolbars
- **Layout:** Rounded Large (16px / `var(--radius-lg)`), inset floating panels.
- **Padding:** Compact spacing (`padding: 8px 12px`) to optimize canvas screen space.
- **Transition:** Slide-in and fade animations using standard cubic-bezier easing.

### Inputs / Sliders
- **Controls:** Custom round slider thumbs and compact numeric inputs with unified border hover behaviors.

## 6. Do's and Don'ts

### Do:
- **Do** keep toolbars compact and floating with glassmorphism to preserve canvas focus.
- **Do** utilize standard 12px corner radii for interactive buttons and toolbar controls.
- **Do** restrict high-contrast borders and active fills to the currently selected tool.

### Don't:
- **Don't** use saturated background cards (like blue/purple/cream panels) for editor sheets.
- **Don't** use overly large corner radii (24px+) for cards or panels, which breaks the precise, geometric feel.
- **Don't** allow desktop-style deep nested menus; all tool controls must exist on a flat, direct scrollable tray.

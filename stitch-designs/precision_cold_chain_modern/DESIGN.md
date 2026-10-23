---
name: Precision Cold-Chain Modern
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  telemetry-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.03em
  telemetry-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  telemetry-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.5rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies high-stakes logistical precision, operational vigilance, and frictionless control. Engineered for telemetry monitoring, fleet dispatchers, and cold-chain compliance operators, the interface provides immediate clarity under time-sensitive, high-pressure workflows. 

The aesthetic blends **Modern Corporate SaaS** with **Mission-Control Utility**. It avoids decorative fluff, opting for high-information density, structural clarity, crisp surface containment, and instant status recognition. The visual language evokes reliability, clinical accuracy, and technological sophistication—empowering dispatchers to oversee sensitive cargo (such as biologics, vaccines, and perishable pharmaceuticals) without eye fatigue over 12-hour shifts.

## Colors

The palette balances deep nautical authority with high-visibility tactical feedback:

- **Primary (`#4F46E5` - Electric Indigo):** Reserved for primary actions, selected states, interactive focus targets, and confirmed route dispatches.
- **Secondary (`#0F172A` - Deep Slate/Navy):** Anchor hue applied to primary global headers, mastheads, command bars, and critical metric labels.
- **Tertiary / Success (`#10B981` - Emerald Green):** Strictly designated for safe-zone thermal telemetry (2°C to 8°C biological standard), compliant route milestones, and operational health indicators.
- **Error / Excursion Alert (`#EF4444` - Crimson):** Reserved for thermal breach alerts, reefer failure warnings, compromised seals, and critical delays.
- **Warning / Approaching Threshold (`#F59E0B` - Amber):** Warning states for temperature spikes trending near boundary thresholds (e.g., 7.5°C) or preventative vehicle checks.
- **Surface & Canvas (`#F8FAFC` to `#FFFFFF`):** High-efficiency neutral background canvas paired with pure white container surfaces.
- **Structural Borders (`#E2E8F0`):** Precise 1px borders delineating dense data cards, grid columns, and metric groupings without heavy visual weight.

## Typography

Typography balances systematic legibility with raw technical clarity:

- **Primary Typeface (`IBM Plex Sans`):** Selected for its industrial, structured geometry and neutral tone. It anchors the interface across high-level dispatch dashboards, modal dialogs, and tabular record headings.
- **Data & Telemetry Typeface (`JetBrains Mono`):** Applied to temperatures, GPS coordinates, timestamps, VIN identifiers, and reefer IDs. Tabular spacing prevents layout jitter during real-time telemetry streaming and simplifies rapid column scanning.
- **Vertical Rhythm:** Tight, controlled line-heights prevent unwanted vertical bloat, maximizing the viewport capacity for vehicle tracking queues and multi-sensor graphs.

## Layout & Spacing

The layout philosophy follows a high-density, fluid-responsive multi-pane dashboard architecture:

- **Grid Architecture:** A dynamic 12-column layout with a fixed-width left navigation rail (`64px` collapsed or `240px` expanded) and a dark persistent command top-bar (`56px` height). Content regions support 2, 3, or 4 equal-width telemetry tiles alongside a responsive fluid map view.
- **Density & Padding:** Baseline component spacing relies on a strict 4px/8px modular rhythm. Internal card paddings use `space-md` (`12px`) or `space-lg` (`16px`) to ensure maximum payload data is visible above the fold on standard 1080p workstation monitors.
- **Breakpoints:**
  - **Desktop (1440px+):** Multi-split panes with simultaneous interactive mapping, reefer fleet queues, and deep-dive sensor readouts.
  - **Laptop / Small Desktop (1024px - 1439px):** Auto-collapses secondary fleet analytics into tabbed trays or sliding side sheets.
  - **Tablet & Dispatch Handhelds (<1024px):** Single-column stacked telemetry widgets with bottom sheet overlays for alerts.

## Elevation & Depth

This system avoids heavy, atmospheric shadows to maintain clean data rendering across bright and ambient-lit operations floors:

- **Flat Stratification:** Depth is achieved primarily through surface containment and crisp 1px borders using `#E2E8F0` on white containers over the `#F8FAFC` canvas.
- **Surface Elevation Tiers:**
  - **Base Canvas (`#F8FAFC`):** Application floor.
  - **Default Containers (`#FFFFFF`):** Workstation cards, telemetry widgets, data tables.
  - **Top Navigation Masthead (`#0F172A`):** Deep Slate contrast layer acting as a commanding visual anchor.
- **Functional Shadows:** Restricted to floating overlays:
  - **Dropdowns / Flyouts:** `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`
  - **Critical Excursion Modals / Drawers:** `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`

## Shapes

The design system standardizes on a refined, compact **8px radius (`roundedness: 2`)** for standard interactive elements, cards, and input fields.

- **Standard Elements (8px / `0.5rem`):** Applied to telemetry cards, data table wrappers, buttons, input fields, and metric modules. This provides a balance between software precision and human factors.
- **Micro Elements (4px / `0.25rem`):** Applied to status badges, micro metric pills, tabular tooltips, and reefer status pills.
- **Structural Framing:** Modals and bottom sheets scale to `12px` or `16px` for soft visual boundaries against the canvas.

## Components

### Buttons
- **Primary:** Electric Indigo (`#4F46E5`) fill, white text, 8px border-radius, font size 14px, medium weight. Height: 36px (compact) or 32px (table-row action).
- **Secondary:** White background, 1px border (`#CBD5E1`), text `#0F172A`. Hover: background `#F1F5F9`.
- **Destructive / Override:** Crimson (`#EF4444`) solid for emergency reefer dispatches; soft Crimson tint (`#FEF2F2`) with red text for dismissible threshold warnings.

### Telemetry Badges & Chips
- **Thermal Range Safe (2°C to 8°C):** Background `#ECFDF5`, border `#A7F3D0`, text `#065F46`. Always paired with `JetBrains Mono` numerical readouts.
- **Excursion Alert (>8°C or <2°C):** Background `#FEF2F2`, border `#FECACA`, text `#991B1B`, pulsed indicator icon.
- **Warning State:** Background `#FFFBEB`, border `#FDE68A`, text `#92400E`.

### Data Tables (Fleet Dispatch Queue)
- Dense layout with row height locked to 44px.
- Subtle zebra striping or explicit 1px horizontal borders (`#F1F5F9`).
- Numeric and status columns strictly right-aligned with tabular numerals (`JetBrains Mono`). Sticky table header row set against `#F8FAFC`.

### Form Fields & Search Bars
- Background white, border 1px `#CBD5E1`, border-radius 8px, font size 14px. Focus state: 1px border `#4F46E5` with an indigo focus ring (`rgba(79, 70, 229, 0.15)`). Height 36px.

### Checkboxes & Selection Controls
- Checkbox dimensions 16x16px with 4px border-radius. Active state filled with `#4F46E5`, clear white checkmark.

### Telemetry & Cold-Chain Cards
- White surface, 1px border `#E2E8F0`, 8px corner radius.
- Header contains asset ID and sensor status indicator; body houses primary real-time temperature reading in `telemetry-lg` font, mini sparkline showing 6-hour thermal profile, and humidity/battery metrics.
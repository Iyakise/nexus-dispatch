/**
 * Metadata for the /design-system verification page.
 * Class names are written out in full so Tailwind can see them.
 * `hex` is what the compiled CSS is expected to produce; the page checks it in the browser.
 */
export interface Swatch {
  name: string;
  /** Tailwind background utility that should resolve to `hex`. */
  className: string;
  hex: string;
  note?: string;
}

export const SWATCH_GROUPS: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Brand (from the product brief)",
    swatches: [
      { name: "brand-indigo", className: "bg-brand-indigo", hex: "#4F46E5", note: "Electric Indigo · primary actions" },
      { name: "brand-slate", className: "bg-brand-slate", hex: "#0F172A", note: "Deep Slate · mastheads, critical labels" },
      { name: "brand-emerald", className: "bg-brand-emerald", hex: "#10B981", note: "Emerald · safe-zone telemetry" },
      { name: "brand-crimson", className: "bg-brand-crimson", hex: "#EF4444", note: "Crimson · excursions, emergency" },
      { name: "brand-amber", className: "bg-brand-amber", hex: "#F59E0B", note: "Amber · approaching threshold" },
    ],
  },
  {
    title: "Primary",
    swatches: [
      { name: "primary", className: "bg-primary", hex: "#3525cd" },
      { name: "on-primary", className: "bg-on-primary", hex: "#ffffff" },
      { name: "primary-container", className: "bg-primary-container", hex: "#4f46e5", note: "= Electric Indigo" },
      { name: "on-primary-container", className: "bg-on-primary-container", hex: "#dad7ff" },
      { name: "inverse-primary", className: "bg-inverse-primary", hex: "#c3c0ff" },
      { name: "primary-fixed", className: "bg-primary-fixed", hex: "#e2dfff" },
      { name: "primary-fixed-dim", className: "bg-primary-fixed-dim", hex: "#c3c0ff" },
      { name: "on-primary-fixed", className: "bg-on-primary-fixed", hex: "#0f0069" },
      { name: "on-primary-fixed-variant", className: "bg-on-primary-fixed-variant", hex: "#3323cc" },
    ],
  },
  {
    title: "Secondary",
    swatches: [
      { name: "secondary", className: "bg-secondary", hex: "#565e74" },
      { name: "on-secondary", className: "bg-on-secondary", hex: "#ffffff" },
      { name: "secondary-container", className: "bg-secondary-container", hex: "#dae2fd" },
      { name: "on-secondary-container", className: "bg-on-secondary-container", hex: "#5c647a" },
      { name: "secondary-fixed", className: "bg-secondary-fixed", hex: "#dae2fd" },
      { name: "secondary-fixed-dim", className: "bg-secondary-fixed-dim", hex: "#bec6e0" },
      { name: "on-secondary-fixed", className: "bg-on-secondary-fixed", hex: "#131b2e" },
      { name: "on-secondary-fixed-variant", className: "bg-on-secondary-fixed-variant", hex: "#3f465c" },
    ],
  },
  {
    title: "Tertiary",
    swatches: [
      { name: "tertiary", className: "bg-tertiary", hex: "#005338" },
      { name: "on-tertiary", className: "bg-on-tertiary", hex: "#ffffff" },
      { name: "tertiary-container", className: "bg-tertiary-container", hex: "#006e4b" },
      { name: "on-tertiary-container", className: "bg-on-tertiary-container", hex: "#67f4b7" },
      { name: "tertiary-fixed", className: "bg-tertiary-fixed", hex: "#6ffbbe" },
      { name: "tertiary-fixed-dim", className: "bg-tertiary-fixed-dim", hex: "#4edea3" },
      { name: "on-tertiary-fixed", className: "bg-on-tertiary-fixed", hex: "#002113" },
      { name: "on-tertiary-fixed-variant", className: "bg-on-tertiary-fixed-variant", hex: "#005236" },
    ],
  },
  {
    title: "Error",
    swatches: [
      { name: "error", className: "bg-error", hex: "#ba1a1a" },
      { name: "on-error", className: "bg-on-error", hex: "#ffffff" },
      { name: "error-container", className: "bg-error-container", hex: "#ffdad6" },
      { name: "on-error-container", className: "bg-on-error-container", hex: "#93000a" },
    ],
  },
  {
    title: "Surface & outline",
    swatches: [
      { name: "background", className: "bg-background", hex: "#f8f9ff" },
      { name: "surface", className: "bg-surface", hex: "#f8f9ff" },
      { name: "surface-bright", className: "bg-surface-bright", hex: "#f8f9ff" },
      { name: "surface-dim", className: "bg-surface-dim", hex: "#cbdbf5" },
      { name: "surface-tint", className: "bg-surface-tint", hex: "#4d44e3" },
      { name: "surface-variant", className: "bg-surface-variant", hex: "#d3e4fe" },
      { name: "surface-container-lowest", className: "bg-surface-container-lowest", hex: "#ffffff" },
      { name: "surface-container-low", className: "bg-surface-container-low", hex: "#eff4ff" },
      { name: "surface-container", className: "bg-surface-container", hex: "#e5eeff" },
      { name: "surface-container-high", className: "bg-surface-container-high", hex: "#dce9ff" },
      { name: "surface-container-highest", className: "bg-surface-container-highest", hex: "#d3e4fe" },
      { name: "inverse-surface", className: "bg-inverse-surface", hex: "#213145", note: "top bar + rail in the screens" },
      { name: "inverse-on-surface", className: "bg-inverse-on-surface", hex: "#eaf1ff" },
      { name: "on-surface", className: "bg-on-surface", hex: "#0b1c30" },
      { name: "on-surface-variant", className: "bg-on-surface-variant", hex: "#464555" },
      { name: "outline", className: "bg-outline", hex: "#777587" },
      { name: "outline-variant", className: "bg-outline-variant", hex: "#c7c4d8" },
    ],
  },
  {
    title: "Thermal telemetry",
    swatches: [
      { name: "thermal-safe", className: "bg-thermal-safe", hex: "#10B981", note: "dot / stroke" },
      { name: "thermal-safe-bg", className: "bg-thermal-safe-bg", hex: "#ECFDF5", note: "badge fill" },
      { name: "thermal-safe-border", className: "bg-thermal-safe-border", hex: "#A7F3D0" },
      { name: "thermal-safe-text", className: "bg-thermal-safe-text", hex: "#065F46" },
      { name: "thermal-warning", className: "bg-thermal-warning", hex: "#F59E0B", note: "dot / stroke" },
      { name: "thermal-warning-bg", className: "bg-thermal-warning-bg", hex: "#FFFBEB", note: "badge fill" },
      { name: "thermal-warning-border", className: "bg-thermal-warning-border", hex: "#FDE68A" },
      { name: "thermal-warning-text", className: "bg-thermal-warning-text", hex: "#92400E" },
      { name: "thermal-excursion", className: "bg-thermal-excursion", hex: "#EF4444", note: "dot / stroke" },
      { name: "thermal-excursion-bg", className: "bg-thermal-excursion-bg", hex: "#FEF2F2", note: "badge fill" },
      { name: "thermal-excursion-border", className: "bg-thermal-excursion-border", hex: "#FECACA" },
      { name: "thermal-excursion-text", className: "bg-thermal-excursion-text", hex: "#991B1B" },
    ],
  },
  {
    title: "UI semantics",
    swatches: [
      { name: "border", className: "bg-border", hex: "#E2E8F0", note: "1px structural borders" },
      { name: "input", className: "bg-input", hex: "#CBD5E1", note: "form-field borders" },
      { name: "ring", className: "bg-ring", hex: "#4F46E5", note: "focus ring" },
      { name: "action", className: "bg-action", hex: "#4F46E5", note: "default button fill" },
      { name: "action-hover", className: "bg-action-hover", hex: "#3525cd", note: "default button hover" },
      { name: "destructive", className: "bg-destructive", hex: "#EF4444", note: "destructive button fill" },
      { name: "muted", className: "bg-muted", hex: "#eff4ff" },
      { name: "accent", className: "bg-accent", hex: "#e5eeff" },
    ],
  },
];

export interface TypeToken {
  name: string;
  className: string;
  spec: string;
  sample: string;
  family: "IBM Plex Sans" | "JetBrains Mono";
}

export const TYPE_TOKENS: TypeToken[] = [
  { name: "display-lg", className: "text-display-lg font-display-lg", spec: "36 / 44 · 600 · -0.02em", sample: "Cold-chain command", family: "IBM Plex Sans" },
  { name: "headline-lg", className: "text-headline-lg font-headline-lg", spec: "28 / 36 · 600 · -0.015em", sample: "Operational overview", family: "IBM Plex Sans" },
  { name: "headline-lg-mobile", className: "text-headline-lg-mobile font-headline-lg-mobile", spec: "22 / 28 · 600 · -0.01em", sample: "Operational overview", family: "IBM Plex Sans" },
  { name: "headline-md", className: "text-headline-md font-headline-md", spec: "20 / 28 · 600 · -0.01em", sample: "Active shipments", family: "IBM Plex Sans" },
  { name: "headline-sm", className: "text-headline-sm font-headline-sm", spec: "16 / 24 · 600", sample: "Reefer fleet queue", family: "IBM Plex Sans" },
  { name: "title-md", className: "text-title-md font-title-md", spec: "14 / 20 · 600", sample: "Batch NX-8921 · Lagos to Abuja", family: "IBM Plex Sans" },
  { name: "body-lg", className: "text-body-lg font-body-lg", spec: "16 / 24 · 400", sample: "Route milestones are confirmed by the driver.", family: "IBM Plex Sans" },
  { name: "body-md", className: "text-body-md font-body-md", spec: "14 / 20 · 400", sample: "Route milestones are confirmed by the driver.", family: "IBM Plex Sans" },
  { name: "body-sm", className: "text-body-sm font-body-sm", spec: "12 / 16 · 400", sample: "Updated 12 seconds ago", family: "IBM Plex Sans" },
  { name: "label-md", className: "text-label-md font-label-md", spec: "12 / 16 · 500 · 0.02em", sample: "Thermal profile", family: "IBM Plex Sans" },
  { name: "label-sm", className: "text-label-sm font-label-sm", spec: "11 / 14 · 500 · 0.04em", sample: "Battery", family: "IBM Plex Sans" },
  { name: "telemetry-lg", className: "text-telemetry-lg font-telemetry-lg", spec: "24 / 32 · 500 · -0.03em", sample: "4.2°C", family: "JetBrains Mono" },
  { name: "telemetry-md", className: "text-telemetry-md font-telemetry-md", spec: "14 / 20 · 500", sample: "NX-8921  6.5°C  9.0765, 7.3986", family: "JetBrains Mono" },
  { name: "telemetry-sm", className: "text-telemetry-sm font-telemetry-sm", spec: "12 / 16 · 400", sample: "2026-09-21 14:05:32Z", family: "JetBrains Mono" },
];

/** Radius scale as the Stitch screens use it (not DESIGN.md's 0.5rem default). */
export const RADIUS_TOKENS = [
  { name: "DEFAULT", className: "rounded", value: "4px", use: "badges, pills, tooltips" },
  { name: "lg", className: "rounded-lg", value: "8px", use: "buttons, inputs, cards, tables" },
  { name: "xl", className: "rounded-xl", value: "12px", use: "modals, bottom sheets" },
  { name: "full", className: "rounded-full", value: "9999px", use: "avatars, status dots" },
] as const;

export const SPACING_TOKENS = [
  { name: "space-xs", className: "w-space-xs", value: "4px" },
  { name: "space-sm", className: "w-space-sm", value: "8px" },
  { name: "space-md", className: "w-space-md", value: "12px" },
  { name: "space-lg", className: "w-space-lg", value: "16px" },
  { name: "space-xl", className: "w-space-xl", value: "24px" },
  { name: "margin-lg", className: "w-margin-lg", value: "32px" },
] as const;

export const SHADOW_TOKENS = [
  { name: "flyout", className: "shadow-flyout", use: "dropdowns, flyouts" },
  { name: "overlay", className: "shadow-overlay", use: "critical modals, drawers" },
] as const;

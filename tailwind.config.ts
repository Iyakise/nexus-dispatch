import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Nexus Dispatch design tokens.
 *
 * Source of truth: `stitch-designs/precision_cold_chain_modern/DESIGN.md`
 * plus the `tailwind.config` block embedded in every Stitch `code.html`.
 *
 * Where DESIGN.md and the Stitch HTML disagree, the HTML wins (it is what the
 * screenshots show). Known differences are marked `STITCH-HTML` below.
 */

const sans = ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"];
const mono = [
  '"JetBrains Mono"',
  "ui-monospace",
  "SFMono-Regular",
  "Menlo",
  "monospace",
];

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* ---- Stitch (Material-style) tokens, verbatim ---- */
        background: "#f8f9ff",
        "on-background": "#0b1c30",
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-tint": "#4d44e3",
        "surface-variant": "#d3e4fe",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#464555",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        outline: "#777587",
        "outline-variant": "#c7c4d8",

        primary: "#3525cd",
        "on-primary": "#ffffff",
        // NOTE: Electric Indigo #4F46E5 is `primary-container` in Stitch.
        "primary-container": "#4f46e5",
        "on-primary-container": "#dad7ff",
        "inverse-primary": "#c3c0ff",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "on-primary-fixed": "#0f0069",
        "on-primary-fixed-variant": "#3323cc",

        secondary: "#565e74",
        "on-secondary": "#ffffff",
        "secondary-container": "#dae2fd",
        "on-secondary-container": "#5c647a",
        "secondary-fixed": "#dae2fd",
        "secondary-fixed-dim": "#bec6e0",
        "on-secondary-fixed": "#131b2e",
        "on-secondary-fixed-variant": "#3f465c",

        tertiary: "#005338",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#006e4b",
        "on-tertiary-container": "#67f4b7",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        /* ---- Brand aliases (literal hexes from the product brief) ---- */
        brand: {
          indigo: "#4F46E5", // Electric Indigo  (== primary-container)
          slate: "#0F172A", // Deep Slate       (== slate-900)
          emerald: "#10B981", // Emerald Green  (== emerald-500)
          crimson: "#EF4444", // Crimson        (== red-500)
          amber: "#F59E0B", // Warning          (== amber-500)
        },

        /* ---- Thermal telemetry badge palette (DESIGN.md > Components) ---- */
        thermal: {
          safe: { DEFAULT: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", text: "#065F46" },
          warning: { DEFAULT: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E" },
          excursion: { DEFAULT: "#EF4444", bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
        },

        /* ---- shadcn/ui semantic colors, mapped onto the tokens above ---- */
        border: "#E2E8F0", // structural borders
        input: "#CBD5E1", // form-field borders
        ring: "#4F46E5",
        foreground: "#0b1c30",
        card: { DEFAULT: "#ffffff", foreground: "#0b1c30" },
        popover: { DEFAULT: "#ffffff", foreground: "#0b1c30" },
        muted: { DEFAULT: "#eff4ff", foreground: "#464555" },
        accent: { DEFAULT: "#e5eeff", foreground: "#0b1c30" },
        destructive: { DEFAULT: "#EF4444", foreground: "#ffffff" },
        // shadcn's `primary` is the Electric Indigo action colour. It is
        // exposed as `action` to avoid clobbering Stitch's own `primary`
        // (#3525cd) which the screens use for hover states.
        action: { DEFAULT: "#4F46E5", hover: "#3525cd", foreground: "#ffffff" },
      },

      /* STITCH-HTML: DESIGN.md says DEFAULT 0.5rem; the screens use these. */
      borderRadius: {
        DEFAULT: "0.25rem", // micro elements: badges, pills, tooltips
        lg: "0.5rem", // standard: buttons, inputs, cards, table wrappers
        xl: "0.75rem", // modals, bottom sheets
        full: "9999px",
      },

      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1rem",
        "space-xl": "1.5rem",
        "gutter-sm": "0.5rem",
        gutter: "1rem",
        "gutter-lg": "1.5rem",
        "margin-sm": "1rem",
        margin: "1.5rem",
        "margin-lg": "2rem",
      },

      fontFamily: {
        sans,
        mono,
        // Stitch also declares a family per type token; kept so that markup
        // exported from Stitch (`font-body-md text-body-md`) converts 1:1.
        "display-lg": sans,
        "headline-lg": sans,
        "headline-lg-mobile": sans,
        "headline-md": sans,
        "headline-sm": sans,
        "title-md": sans,
        "body-lg": sans,
        "body-md": sans,
        "body-sm": sans,
        "label-md": sans,
        "label-sm": sans,
        "telemetry-lg": mono,
        "telemetry-md": mono,
        "telemetry-sm": mono,
      },

      fontSize: {
        "display-lg": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg": ["28px", { lineHeight: "36px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-lg-mobile": ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "title-md": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "500" }],
        "telemetry-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.03em", fontWeight: "500" }],
        "telemetry-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "telemetry-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },

      /* Functional shadows only — depth otherwise comes from 1px borders. */
      boxShadow: {
        flyout: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        overlay: "0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
        "focus-ring": "0 0 0 3px rgba(79, 70, 229, 0.15)",
      },

      /* Layout constants. STITCH-HTML: expanded rail is w-64 (256px), not 240. */
      width: {
        rail: "4rem", // collapsed navigation rail (64px)
        "rail-expanded": "16rem", // expanded navigation rail (256px)
      },
      height: {
        topbar: "3.5rem", // command top bar (56px)
        row: "2.75rem", // data-table row (44px)
        control: "2.25rem", // buttons + inputs (36px)
        "control-sm": "2rem", // table-row actions (32px)
      },
      minHeight: {
        row: "2.75rem",
      },
      padding: {
        rail: "4rem",
        "rail-expanded": "16rem",
        topbar: "3.5rem",
      },
      margin: {
        rail: "4rem",
        "rail-expanded": "16rem",
        topbar: "3.5rem",
      },

      keyframes: {
        "excursion-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.15)" },
        },
      },
      animation: {
        "excursion-pulse": "excursion-pulse 1.4s ease-in-out infinite",
      },
    },

    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px", // laptop / small desktop
      xl: "1280px",
      desktop: "1440px", // multi-split panes (DESIGN.md)
      "2xl": "1536px",
    },
  },
  plugins: [animate],
};

export default config;

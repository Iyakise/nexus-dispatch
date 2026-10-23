"use client";

import { useEffect, useRef } from "react";

function rgbToHex(rgb: string): string | null {
  const m = rgb.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return null;
  return "#" + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
}

const FONT_CHECKS: { label: string; load: string; check: string; sample?: string }[] = [
  { label: "IBM Plex Sans", load: '400 14px "IBM Plex Sans"', check: '400 14px "IBM Plex Sans"' },
  { label: "IBM Plex Sans 600", load: '600 14px "IBM Plex Sans"', check: '600 14px "IBM Plex Sans"' },
  { label: "JetBrains Mono", load: '500 14px "JetBrains Mono"', check: '500 14px "JetBrains Mono"' },
  { label: "Material Symbols", load: '24px "Material Symbols Outlined"', check: '24px "Material Symbols Outlined"', sample: "check" },
];

/**
 * Runs in the browser and compares what the compiled CSS actually produces
 * against the expected token values, and confirms the three self-hosted
 * fonts loaded. Writes results straight to the DOM (no state) and flags each
 * failing swatch with data-status="fail".
 */
export function TokenVerifier() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const root = ref.current;
    if (!root) return;

    const nodes = document.querySelectorAll<HTMLElement>("[data-expected-bg]");
    let passed = 0;
    const failed: string[] = [];
    nodes.forEach((node) => {
      const actual = rgbToHex(getComputedStyle(node).backgroundColor);
      const expected = (node.dataset.expectedBg ?? "").toLowerCase();
      const ok = actual === expected;
      node.dataset.status = ok ? "pass" : "fail";
      if (ok) passed += 1;
      else failed.push(`${node.dataset.tokenName ?? "?"} (expected ${expected}, got ${actual ?? "none"})`);
    });

    const render = (fontsOk: number, fontMisses: string[]) => {
      if (cancelled) return;
      const allOk = failed.length === 0 && fontMisses.length === 0;
      root.dataset.state = allOk ? "pass" : "fail";
      root.dataset.tokensPassed = String(passed);
      root.dataset.tokensTotal = String(nodes.length);
      root.dataset.fontsPassed = String(fontsOk);
      const summary = root.querySelector("[data-role=summary]");
      if (summary) {
        summary.textContent = `Tokens ${passed}/${nodes.length} · Fonts ${fontsOk}/${FONT_CHECKS.length}`;
      }
      const detail = root.querySelector("[data-role=detail]");
      if (detail) {
        detail.textContent = [...failed, ...fontMisses.map((f) => `font not loaded: ${f}`)].join("; ");
      }
    };

    render(0, FONT_CHECKS.map((f) => f.label));

    Promise.all(FONT_CHECKS.map((f) => document.fonts.load(f.load, f.sample).catch(() => []))).then(() => {
      const misses = FONT_CHECKS.filter((f) => !document.fonts.check(f.check, f.sample)).map((f) => f.label);
      render(FONT_CHECKS.length - misses.length, misses);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      id="token-verifier"
      ref={ref}
      data-state="pending"
      className="flex flex-wrap items-center gap-x-space-lg gap-y-space-xs rounded-lg border px-space-md py-space-sm font-mono text-telemetry-sm transition-colors data-[state=fail]:border-thermal-excursion-border data-[state=pass]:border-thermal-safe-border data-[state=fail]:bg-thermal-excursion-bg data-[state=pass]:bg-thermal-safe-bg data-[state=pending]:bg-slate-50 data-[state=fail]:text-thermal-excursion-text data-[state=pass]:text-thermal-safe-text"
      role="status"
    >
      <span className="font-sans text-label-md">Live verification</span>
      <span data-role="summary">Checking…</span>
      <span data-role="detail" className="text-thermal-excursion-text" />
    </div>
  );
}

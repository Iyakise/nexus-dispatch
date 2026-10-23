import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must be told about the custom Stitch tokens, otherwise it
 * mistakes `text-body-md` (font size) for a text colour and drops one of two
 * classes that should coexist, e.g. `text-body-md text-on-surface`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "space-xs",
        "space-sm",
        "space-md",
        "space-lg",
        "space-xl",
        "gutter-sm",
        "gutter",
        "gutter-lg",
        "margin-sm",
        "margin",
        "margin-lg",
        "rail",
        "rail-expanded",
        "topbar",
        "row",
        "control",
        "control-sm",
      ],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "headline-lg",
            "headline-lg-mobile",
            "headline-md",
            "headline-sm",
            "title-md",
            "body-lg",
            "body-md",
            "body-sm",
            "label-md",
            "label-sm",
            "telemetry-lg",
            "telemetry-md",
            "telemetry-sm",
          ],
        },
      ],
      shadow: [{ shadow: ["flyout", "overlay", "focus-ring"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

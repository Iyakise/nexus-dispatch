import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** 4px-radius micro element (status badges, pills). */
const badgeVariants = cva(
  "inline-flex items-center gap-space-xs rounded border px-space-sm py-0.5 text-label-md whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-primary-fixed-dim bg-primary-fixed text-on-primary-fixed-variant",
        neutral: "border-border bg-slate-100 text-slate-700",
        outline: "border-input bg-white text-on-surface-variant",
        /** 2–8 °C compliant. */
        safe: "border-thermal-safe-border bg-thermal-safe-bg text-thermal-safe-text",
        /** Trending toward a threshold (e.g. 7.5 °C). */
        warning: "border-thermal-warning-border bg-thermal-warning-bg text-thermal-warning-text",
        /** Outside the band, reefer failure, compromised seal. */
        excursion:
          "border-thermal-excursion-border bg-thermal-excursion-bg text-thermal-excursion-text",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

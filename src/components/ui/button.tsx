import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-space-sm whitespace-nowrap rounded-lg border border-transparent text-title-md transition-colors focus-visible:border-action focus-visible:shadow-focus-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Electric Indigo fill — primary actions, confirmed dispatches. */
        default: "bg-action text-action-foreground hover:bg-action-hover",
        /** White with a 1px border. */
        secondary:
          "border-slate-300 bg-white text-brand-slate hover:bg-slate-100",
        /** Solid Crimson — emergency / override actions only. */
        destructive: "bg-brand-crimson text-white hover:bg-red-600",
        /** Soft Crimson tint — dismissible threshold warnings. */
        "destructive-soft":
          "border-thermal-excursion-border bg-thermal-excursion-bg text-thermal-excursion-text hover:bg-red-100",
        ghost: "text-on-surface-variant hover:bg-surface-container-low",
        link: "h-auto px-0 text-action underline-offset-4 hover:underline",
      },
      size: {
        /** 36px (compact). */
        default: "h-control px-space-lg",
        /** 32px (table-row action). */
        sm: "h-control-sm px-space-md text-body-sm font-semibold",
        icon: "h-control w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        // Avoid accidental form submits; opt in with type="submit".
        type={asChild ? undefined : (type ?? "button")}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

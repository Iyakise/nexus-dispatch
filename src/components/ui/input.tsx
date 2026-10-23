import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-control w-full rounded-lg border border-input bg-white px-space-md text-body-md text-on-surface transition-colors",
        "placeholder:text-outline",
        "focus-visible:border-action focus-visible:shadow-focus-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
        "aria-[invalid=true]:border-brand-crimson aria-[invalid=true]:focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
        "file:border-0 file:bg-transparent file:text-body-sm file:font-medium",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };

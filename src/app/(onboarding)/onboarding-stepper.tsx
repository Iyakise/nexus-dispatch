import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const STEPS = ["Company", "Subscription", "Payment", "Welcome"] as const;

export function OnboardingStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="flex items-center gap-space-sm">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3 | 4;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex items-center gap-space-sm">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-label-md font-semibold",
                done && "bg-thermal-safe text-white",
                active && "bg-action text-white",
                !done && !active && "border border-slate-700 text-slate-400",
              )}
            >
              {done ? <Icon name="check" size={16} weight={700} /> : step}
            </span>
            <span className={cn("hidden text-body-sm sm:inline", active ? "text-white" : "text-slate-400")}>{label}</span>
            {step < 4 ? <span className="h-px w-6 bg-slate-700 sm:w-10" aria-hidden /> : null}
          </li>
        );
      })}
    </ol>
  );
}

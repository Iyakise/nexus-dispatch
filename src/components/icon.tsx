import type { HTMLAttributes } from "react";
import type { MaterialSymbol } from "material-symbols";
import { cn } from "@/lib/utils";

/**
 * Names the Stitch screens use that Google has since renamed. The bundled
 * font still contains them as ligature aliases (verified against every icon in
 * the Stitch export), but the package's type list only has the new names.
 */
export type LegacyMaterialSymbol =
  | "access_time"
  | "business"
  | "done"
  | "expand_more"
  | "file_download"
  | "gpp_good"
  | "help_outline"
  | "security_update_good";

export type IconName = MaterialSymbol | LegacyMaterialSymbol;

export interface IconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: IconName;
  /** Pixel size. Also drives the font's optical-size axis. Default 20. */
  size?: number;
  /** Solid glyph (FILL axis = 1). */
  filled?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Accessible name. Omit for purely decorative icons. */
  label?: string;
}

export function Icon({
  name,
  size = 20,
  filled = false,
  weight = 400,
  label,
  className,
  style,
  ...props
}: IconProps) {
  const opticalSize = Math.min(48, Math.max(20, Math.round(size)));
  return (
    <span
      // Prevents browser auto-translate from rewriting the ligature text.
      translate="no"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${opticalSize}`,
        ...style,
      }}
      {...props}
    >
      {name}
    </span>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Dense dispatch-queue table: 44px rows, sticky slate header, numeric and
 * status columns right-aligned in the mono face.
 */
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg border bg-card">
      <table ref={ref} className={cn("w-full caption-bottom text-body-md", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("sticky top-0 z-10 bg-slate-50 [&_tr]:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "h-row border-b border-slate-100 transition-colors hover:bg-surface-container-low/60 data-[state=selected]:bg-surface-container-low",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

interface CellProps {
  /** Right-align and use the telemetry (mono) face. */
  numeric?: boolean;
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & CellProps
>(({ className, numeric, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-space-md text-label-md font-semibold uppercase tracking-wider text-secondary",
      numeric ? "text-right" : "text-left",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & CellProps
>(({ className, numeric, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-space-md align-middle",
      numeric && "text-right font-mono text-telemetry-md",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };

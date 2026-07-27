"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function GridTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-md border", className)}>
      <table className="w-full min-w-[720px] border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

export function GridHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
      <tr>{children}</tr>
    </thead>
  );
}

export function GridBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="[&>tr:nth-child(even)]:bg-muted/30 [&>tr:hover]:bg-accent/60">
      {children}
    </tbody>
  );
}

export function GridRow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b transition-colors",
        onClick && "cursor-pointer"
      )}
    >
      {children}
    </tr>
  );
}

export function GridCell({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-r px-2.5 py-1.5 last:border-r-0",
        align === "right" && "text-right tabular-nums",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </td>
  );
}

type SortDirection = "asc" | "desc" | null;

export function GridHeaderCell({
  children,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
  align = "left",
}: {
  children: React.ReactNode;
  sortKey?: string;
  activeSortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  align?: "left" | "right" | "center";
}) {
  const isActive = sortKey && activeSortKey === sortKey;
  const Icon = isActive
    ? sortDirection === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  if (!sortKey || !onSort) {
    return (
      <th
        className={cn(
          "border-r px-2.5 py-2 text-xs font-semibold text-muted-foreground last:border-r-0",
          align === "right" && "text-right",
          align === "center" && "text-center"
        )}
      >
        {children}
      </th>
    );
  }

  return (
    <th className="border-r px-0 py-0 text-xs font-semibold text-muted-foreground last:border-r-0">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "flex w-full items-center gap-1 px-2.5 py-2 hover:bg-accent",
          align === "right" && "flex-row-reverse",
          align === "center" && "justify-center"
        )}
      >
        <span>{children}</span>
        <Icon
          className={cn(
            "h-3 w-3 shrink-0",
            isActive ? "text-foreground" : "text-muted-foreground/50"
          )}
        />
      </button>
    </th>
  );
}

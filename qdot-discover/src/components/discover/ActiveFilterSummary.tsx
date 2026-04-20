"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  type DiscoverBounds,
  type DiscoverFilters,
  isZetaFilterNarrowed,
} from "@/lib/qdot-data";

interface ActiveFilterSummaryProps {
  bounds: DiscoverBounds;
  filters: DiscoverFilters;
  totalResults: number;
  totalRecords: number;
  onClearAll: () => void;
  onClearQuery: () => void;
  onRemoveElement: (element: string) => void;
  onResetAtoms: () => void;
  onResetZeta: () => void;
}

function FilterChip({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove?: () => void;
}) {
  if (!onRemove) {
    return (
      <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-foreground/78 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
        {children}
      </span>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-3 py-1 text-xs font-medium text-foreground/85 transition-colors hover:border-primary/40 hover:text-foreground",
      )}
      onClick={onRemove}
      type="button"
    >
      <span>{children}</span>
      <X className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

export function ActiveFilterSummary({
  bounds,
  filters,
  totalResults,
  totalRecords,
  onClearAll,
  onClearQuery,
  onRemoveElement,
  onResetAtoms,
  onResetZeta,
}: ActiveFilterSummaryProps) {
  const atomsChanged = filters.atomsMin !== bounds.atomsMin || filters.atomsMax !== bounds.atomsMax;
  const zetaChanged = isZetaFilterNarrowed(filters);
  const hasFilters = Boolean(filters.q) || filters.elements.length > 0 || atomsChanged || zetaChanged;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/75 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Showing {totalResults} of {totalRecords} nanoparticles
          </p>
          <p className="text-sm text-muted-foreground">
            Filters are encoded in the URL, so this view can be shared or bookmarked.
          </p>
        </div>
        {hasFilters ? (
          <Button className="self-start" onClick={onClearAll} size="sm" type="button" variant="ghost">
            Clear all filters
          </Button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!hasFilters ? <FilterChip>Showing full library</FilterChip> : null}
        {filters.q ? <FilterChip onRemove={onClearQuery}>Query: {filters.q}</FilterChip> : null}
        {filters.elements.map((element) => (
          <FilterChip key={element} onRemove={() => onRemoveElement(element)}>
            Contains {element}
          </FilterChip>
        ))}
        {atomsChanged ? (
          <FilterChip onRemove={onResetAtoms}>
            Atoms {filters.atomsMin.toLocaleString()} to {filters.atomsMax.toLocaleString()}
          </FilterChip>
        ) : null}
        {zetaChanged ? (
          <FilterChip onRemove={onResetZeta}>
            Zeta {filters.zetaMin.toFixed(1)} to {filters.zetaMax.toFixed(1)} mV
          </FilterChip>
        ) : null}
      </div>
    </section>
  );
}

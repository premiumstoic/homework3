"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { Atom, Filter, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PeriodicTableSelector } from "@/components/discover/PeriodicTableSelector";
import { Slider } from "@/components/ui/Slider";
import { type DiscoverBounds, type DiscoverFilters } from "@/lib/qdot-data";

interface FilterSidebarProps {
  availableElements: string[];
  bounds: DiscoverBounds;
  filters: DiscoverFilters;
  onClearAll: () => void;
  onToggleElement: (element: string) => void;
  onUpdateAtoms: (updates: { min?: number; max?: number }) => void;
  onUpdateZeta: (updates: { min?: number; max?: number }) => void;
}

function NumberField({
  label,
  max,
  min,
  step,
  value,
  onCommit,
}: {
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
  onCommit: (value: number) => void;
}) {
  const id = useId();
  const commit = (rawValue: string) => {
    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue)) {
      return;
    }

    onCommit(parsedValue);
  };

  return (
    <label className="space-y-2" htmlFor={id}>
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <input
        className="w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2.5 text-sm text-foreground shadow-inner shadow-black/5 outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        id={id}
        inputMode="decimal"
        max={max}
        min={min}
        onBlur={(event) => commit(event.target.value)}
        onChange={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(event.currentTarget.value);
            event.currentTarget.blur();
          }
        }}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}

function RangeSection({
  bounds,
  label,
  step,
  valueFormatter,
  values,
  onUpdate,
}: {
  bounds: { min: number; max: number };
  label: string;
  step: number;
  valueFormatter: (value: number) => string;
  values: { min: number; max: number };
  onUpdate: (updates: { min?: number; max?: number }) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="text-xs text-muted-foreground">
            {valueFormatter(values.min)} to {valueFormatter(values.max)}
          </p>
        </div>
        <Badge variant="outline">
          {valueFormatter(values.min)} - {valueFormatter(values.max)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Min"
          max={bounds.max}
          min={bounds.min}
          onCommit={(value) => onUpdate({ min: value })}
          step={step}
          value={values.min}
        />
        <NumberField
          label="Max"
          max={bounds.max}
          min={bounds.min}
          onCommit={(value) => onUpdate({ max: value })}
          step={step}
          value={values.max}
        />
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span>Min</span>
            <span>{valueFormatter(values.min)}</span>
          </div>
          <Slider
            aria-label={`${label} minimum`}
            max={bounds.max}
            min={bounds.min}
            onValueChange={([value]) => onUpdate({ min: Math.min(value, values.max) })}
            step={step}
            value={[values.min]}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span>Max</span>
            <span>{valueFormatter(values.max)}</span>
          </div>
          <Slider
            aria-label={`${label} maximum`}
            max={bounds.max}
            min={bounds.min}
            onValueChange={([value]) => onUpdate({ max: Math.max(value, values.min) })}
            step={step}
            value={[values.max]}
          />
        </div>
      </div>
    </section>
  );
}

export function FilterSidebar({
  availableElements,
  bounds,
  filters,
  onClearAll,
  onToggleElement,
  onUpdateAtoms,
  onUpdateZeta,
}: FilterSidebarProps) {
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState(false);

  return (
    <div className="relative z-20 flex max-h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="h-4 w-4 text-primary" />
            Research Filters
          </div>
          <p className="text-sm text-muted-foreground">
            Narrow the library by composition, atom count, and measured zeta potential.
          </p>
        </div>
        <Button onClick={onClearAll} size="sm" type="button" variant="ghost">
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="-mr-2 mt-5 flex-1 space-y-8 overflow-y-auto pr-2 no-scrollbar">
        <section className="relative space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Composition</h3>
            <p className="text-xs text-muted-foreground">
              Open a periodic-table selector and choose the elements that must appear in each nanoparticle.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsPeriodicTableOpen((current) => !current)}
              type="button"
              variant="outline"
            >
              <Atom className="mr-2 h-4 w-4" />
              {isPeriodicTableOpen ? "Hide periodic table" : "Open periodic table"}
            </Button>
            {filters.elements.length > 0 ? (
              <Badge variant="outline">{filters.elements.length} elements selected</Badge>
            ) : (
              <Badge variant="outline">Match all elements selected</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.elements.length > 0 ? (
              filters.elements.map((element) => (
                <button
                  key={element}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/35"
                  onClick={() => onToggleElement(element)}
                  type="button"
                >
                  {element}
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No elemental constraints applied yet. Pick one or more symbols from the periodic table.
              </p>
            )}
          </div>

          {typeof document !== "undefined" && createPortal(
            <PeriodicTableSelector
              availableElements={availableElements}
              isOpen={isPeriodicTableOpen}
              onClose={() => setIsPeriodicTableOpen(false)}
              onToggleElement={onToggleElement}
              selectedElements={filters.elements}
            />,
            document.body
          )}
        </section>

        <RangeSection
          bounds={{ min: bounds.atomsMin, max: bounds.atomsMax }}
          label="Total Atoms"
          onUpdate={onUpdateAtoms}
          step={1}
          valueFormatter={(value) => value.toLocaleString()}
          values={{ min: filters.atomsMin, max: filters.atomsMax }}
        />

        <RangeSection
          bounds={{ min: bounds.zetaMin, max: bounds.zetaMax }}
          label="Zeta Potential"
          onUpdate={onUpdateZeta}
          step={0.1}
          valueFormatter={(value) => `${value.toFixed(1)} mV`}
          values={{ min: filters.zetaMin, max: filters.zetaMax }}
        />
      </div>
    </div>
  );
}

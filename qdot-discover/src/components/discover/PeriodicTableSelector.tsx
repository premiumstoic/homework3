"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PERIODIC_ELEMENTS = [
  { symbol: "H", period: 1, group: 1 },
  { symbol: "He", period: 1, group: 18 },
  { symbol: "Li", period: 2, group: 1 },
  { symbol: "Be", period: 2, group: 2 },
  { symbol: "B", period: 2, group: 13 },
  { symbol: "C", period: 2, group: 14 },
  { symbol: "N", period: 2, group: 15 },
  { symbol: "O", period: 2, group: 16 },
  { symbol: "F", period: 2, group: 17 },
  { symbol: "Ne", period: 2, group: 18 },
  { symbol: "Na", period: 3, group: 1 },
  { symbol: "Mg", period: 3, group: 2 },
  { symbol: "Al", period: 3, group: 13 },
  { symbol: "Si", period: 3, group: 14 },
  { symbol: "P", period: 3, group: 15 },
  { symbol: "S", period: 3, group: 16 },
  { symbol: "Cl", period: 3, group: 17 },
  { symbol: "Ar", period: 3, group: 18 },
  { symbol: "K", period: 4, group: 1 },
  { symbol: "Ca", period: 4, group: 2 },
  { symbol: "Sc", period: 4, group: 3 },
  { symbol: "Ti", period: 4, group: 4 },
  { symbol: "V", period: 4, group: 5 },
  { symbol: "Cr", period: 4, group: 6 },
  { symbol: "Mn", period: 4, group: 7 },
  { symbol: "Fe", period: 4, group: 8 },
  { symbol: "Co", period: 4, group: 9 },
  { symbol: "Ni", period: 4, group: 10 },
  { symbol: "Cu", period: 4, group: 11 },
  { symbol: "Zn", period: 4, group: 12 },
  { symbol: "Ga", period: 4, group: 13 },
  { symbol: "Ge", period: 4, group: 14 },
  { symbol: "As", period: 4, group: 15 },
  { symbol: "Se", period: 4, group: 16 },
  { symbol: "Br", period: 4, group: 17 },
  { symbol: "Kr", period: 4, group: 18 },
  { symbol: "Rb", period: 5, group: 1 },
  { symbol: "Sr", period: 5, group: 2 },
  { symbol: "Y", period: 5, group: 3 },
  { symbol: "Zr", period: 5, group: 4 },
  { symbol: "Nb", period: 5, group: 5 },
  { symbol: "Mo", period: 5, group: 6 },
  { symbol: "Tc", period: 5, group: 7 },
  { symbol: "Ru", period: 5, group: 8 },
  { symbol: "Rh", period: 5, group: 9 },
  { symbol: "Pd", period: 5, group: 10 },
  { symbol: "Ag", period: 5, group: 11 },
  { symbol: "Cd", period: 5, group: 12 },
  { symbol: "In", period: 5, group: 13 },
  { symbol: "Sn", period: 5, group: 14 },
  { symbol: "Sb", period: 5, group: 15 },
  { symbol: "Te", period: 5, group: 16 },
  { symbol: "I", period: 5, group: 17 },
  { symbol: "Xe", period: 5, group: 18 },
];

interface PeriodicTableSelectorProps {
  availableElements: string[];
  isOpen: boolean;
  onClose: () => void;
  onToggleElement: (element: string) => void;
  selectedElements: string[];
}

export function PeriodicTableSelector({
  availableElements,
  isOpen,
  onClose,
  onToggleElement,
  selectedElements,
}: PeriodicTableSelectorProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const availableSet = new Set(availableElements);
  const selectedSet = new Set(selectedElements);
  const cells = Array.from({ length: 5 * 18 }, (_, index) => {
    const period = Math.floor(index / 18) + 1;
    const group = (index % 18) + 1;

    return PERIODIC_ELEMENTS.find((element) => element.period === period && element.group === group) ?? null;
  });

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(2,8,23,0.72)] p-3 backdrop-blur-sm md:p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[1.9rem] border border-border/80 bg-popover/98 shadow-[0_32px_120px_rgba(2,8,23,0.4)] md:h-[calc(100vh-2rem)] md:w-[calc(100vw-2rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-5 md:px-8">
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground md:text-2xl">Periodic table selector</p>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              Pick elements directly from their periodic positions to filter the nanoparticle library.
              This opens as a viewport-scale card so the full periodic layout is visible and easy to
              click without horizontal scrolling.
            </p>
          </div>
          <Button onClick={onClose} size="icon" type="button" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar md:px-8">
          <div className="flex flex-wrap gap-2">
            {selectedElements.length > 0 ? (
              selectedElements.map((element) => <Badge key={element}>{element}</Badge>)
            ) : (
              <Badge variant="outline">No elements selected</Badge>
            )}
          </div>

          <div className="mt-6">
            <div
              className="grid gap-2 md:gap-3"
              style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
            >
              {cells.map((cell, index) => {
                if (!cell) {
                  return <div key={`empty-${index}`} className="aspect-[1/1.08] rounded-xl border border-transparent" />;
                }

                const isAvailable = availableSet.has(cell.symbol);
                const isSelected = selectedSet.has(cell.symbol);

                return (
                  <button
                    key={cell.symbol}
                    className={cn(
                      "aspect-[1/1.08] rounded-xl border px-1 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isAvailable
                        ? "border-border/80 bg-background/75 text-foreground hover:border-primary/35 hover:bg-card"
                        : "border-border/30 bg-background/30 text-muted-foreground/45",
                      isSelected && "border-primary bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(37,99,235,0.22)]",
                    )}
                    disabled={!isAvailable}
                    onClick={() => onToggleElement(cell.symbol)}
                    type="button"
                  >
                    <span className="block text-sm font-semibold md:text-base">{cell.symbol}</span>
                    <span className="mt-0.5 block text-[0.52rem] uppercase tracking-[0.16em] opacity-70 md:text-[0.58rem]">
                      P{cell.period}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground md:text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-border/80 bg-background/80" />
              Available in this dataset
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              Selected for filtering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

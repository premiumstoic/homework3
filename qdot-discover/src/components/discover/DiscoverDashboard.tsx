"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { ActiveFilterSummary } from "@/components/discover/ActiveFilterSummary";
import { FilterSidebar } from "@/components/discover/FilterSidebar";
import { QDotCard } from "@/components/discover/QDotCard";
import { Button } from "@/components/ui/Button";
import {
  filterQDots,
  getDefaultDiscoverFilters,
  parseDiscoverFilters,
  serializeDiscoverFilters,
  type DiscoverBounds,
  type DiscoverFilters,
  type QDotRecord,
} from "@/lib/qdot-data";

interface DiscoverDashboardProps {
  availableElements: string[];
  bounds: DiscoverBounds;
  initialFilters: DiscoverFilters;
  qdots: QDotRecord[];
}

function getLiveFilters(searchParams: ReturnType<typeof useSearchParams>, initialFilters: DiscoverFilters) {
  const hasParams = searchParams.toString().length > 0;

  if (!hasParams) {
    return initialFilters;
  }

  return parseDiscoverFilters({
    q: searchParams.get("q") ?? undefined,
    elements: searchParams.get("elements") ?? undefined,
    atomsMin: searchParams.get("atomsMin") ?? undefined,
    atomsMax: searchParams.get("atomsMax") ?? undefined,
    zetaMin: searchParams.get("zetaMin") ?? undefined,
    zetaMax: searchParams.get("zetaMax") ?? undefined,
  });
}

function getActiveFilterCount(filters: DiscoverFilters, bounds: DiscoverBounds) {
  let count = 0;

  if (filters.q) count += 1;
  count += filters.elements.length;
  if (filters.atomsMin !== bounds.atomsMin || filters.atomsMax !== bounds.atomsMax) count += 1;
  if (filters.zetaMin !== bounds.zetaMin || filters.zetaMax !== bounds.zetaMax) count += 1;

  return count;
}

export function DiscoverDashboard({
  availableElements,
  bounds,
  initialFilters,
  qdots,
}: DiscoverDashboardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startNavigation] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const defaultFilters = getDefaultDiscoverFilters();

  const filters = getLiveFilters(searchParams, initialFilters);
  const filteredQDots = filterQDots(qdots, filters);
  const activeFilterCount = getActiveFilterCount(filters, bounds);

  const commitFilters = (nextFilters: DiscoverFilters) => {
    const normalizedFilters = parseDiscoverFilters({
      q: nextFilters.q,
      elements: nextFilters.elements.join(","),
      atomsMin: String(nextFilters.atomsMin),
      atomsMax: String(nextFilters.atomsMax),
      zetaMin: String(nextFilters.zetaMin),
      zetaMax: String(nextFilters.zetaMax),
    });
    const params = serializeDiscoverFilters(normalizedFilters);
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startNavigation(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  const updateFilters = (updater: Partial<DiscoverFilters> | ((current: DiscoverFilters) => DiscoverFilters)) => {
    const nextFilters =
      typeof updater === "function" ? updater(filters) : { ...filters, ...updater };

    commitFilters(nextFilters);
  };

  const resetFilters = () => {
    setMobileFiltersOpen(false);
    commitFilters(defaultFilters);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section
        className="relative overflow-hidden rounded-[2rem] border border-border/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 18%, var(--discover-hero-glow-a), transparent 34%), radial-gradient(circle at 82% 24%, var(--discover-hero-glow-b), transparent 26%), linear-gradient(135deg, var(--discover-hero-top), var(--discover-hero-bottom) 55%, var(--discover-hero-accent))",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),transparent_50%)] opacity-60" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              QDot Discover
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Discover quantum dots by composition, scale, and measured surface behavior.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-foreground/78 sm:text-lg">
                Explore the ViNAS-derived library with a shareable element picker, structure-aware cards,
                and direct links into each nanoparticle analysis page.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-background/70 px-4 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Library Size</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{qdots.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-background/70 px-4 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Elements</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{availableElements.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-background/70 px-4 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">Assay Window</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {bounds.zetaMin.toFixed(0)} to {bounds.zetaMax.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-6 lg:hidden">
        <Button
          className="w-full justify-between"
          onClick={() => setMobileFiltersOpen((current) => !current)}
          type="button"
          variant="outline"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {activeFilterCount} active
          </span>
        </Button>

        {mobileFiltersOpen ? (
          <FilterSidebar
            availableElements={availableElements}
            bounds={bounds}
            filters={filters}
            onClearAll={resetFilters}
            onToggleElement={(element) =>
              updateFilters((current) => ({
                ...current,
                elements: current.elements.includes(element)
                  ? current.elements.filter((item) => item !== element)
                  : [...current.elements, element].sort(),
              }))
            }
            onUpdateAtoms={({ max, min }) =>
              updateFilters((current) => ({
                ...current,
                atomsMin: min ?? current.atomsMin,
                atomsMax: max ?? current.atomsMax,
              }))
            }
            onUpdateZeta={({ max, min }) =>
              updateFilters((current) => ({
                ...current,
                zetaMin: min ?? current.zetaMin,
                zetaMax: max ?? current.zetaMax,
              }))
            }
          />
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="relative z-30 hidden lg:block">
          <div className="sticky top-24 z-30">
            <FilterSidebar
              availableElements={availableElements}
              bounds={bounds}
              filters={filters}
              onClearAll={resetFilters}
              onToggleElement={(element) =>
                updateFilters((current) => ({
                  ...current,
                  elements: current.elements.includes(element)
                    ? current.elements.filter((item) => item !== element)
                    : [...current.elements, element].sort(),
                }))
              }
              onUpdateAtoms={({ max, min }) =>
                updateFilters((current) => ({
                  ...current,
                  atomsMin: min ?? current.atomsMin,
                  atomsMax: max ?? current.atomsMax,
                }))
              }
              onUpdateZeta={({ max, min }) =>
                updateFilters((current) => ({
                  ...current,
                  zetaMin: min ?? current.zetaMin,
                  zetaMax: max ?? current.zetaMax,
                }))
              }
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-border/70 bg-card/78 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Search the library</p>
                <p className="text-sm text-muted-foreground">
                  Match nanoparticle IDs and element symbols. Results update without a page reload.
                </p>
              </div>

              <label className="relative block w-full max-w-xl lg:min-w-[22rem]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-2xl border border-border/70 bg-background/80 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  onChange={(event) => updateFilters({ q: event.target.value })}
                  placeholder="Search by QDNP ID or element symbol"
                  type="search"
                  value={filters.q}
                />
              </label>
            </div>
          </section>

          <ActiveFilterSummary
            bounds={bounds}
            filters={filters}
            onClearAll={resetFilters}
            onClearQuery={() => updateFilters({ q: "" })}
            onRemoveElement={(element) =>
              updateFilters((current) => ({
                ...current,
                elements: current.elements.filter((item) => item !== element),
              }))
            }
            onResetAtoms={() => updateFilters({ atomsMin: bounds.atomsMin, atomsMax: bounds.atomsMax })}
            onResetZeta={() => updateFilters({ zetaMin: bounds.zetaMin, zetaMax: bounds.zetaMax })}
            totalRecords={qdots.length}
            totalResults={filteredQDots.length}
          />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">Discovery Results</h2>
              <p className="text-sm text-muted-foreground">
                Sorted by nanoparticle identifier for predictable browsing.
              </p>
            </div>
            {isPending ? (
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Updating filters
              </span>
            ) : null}
          </div>

          {filteredQDots.length === 0 ? (
            <section className="rounded-[1.75rem] border border-dashed border-border bg-card/70 px-6 py-14 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <p className="text-lg font-semibold text-foreground">No quantum dots match the current constraints.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening the atom or zeta range, or clear composition filters to restore the full library.
              </p>
              <div className="mt-6">
                <Button onClick={resetFilters} type="button">
                  Reset filters
                </Button>
              </div>
            </section>
          ) : (
            <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {filteredQDots.map((qdot) => (
                <QDotCard key={qdot.id} qdot={qdot} />
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

import { DiscoverDashboard } from "@/components/discover/DiscoverDashboard";
import {
  availableElements,
  discoverBounds,
  parseDiscoverFilters,
  qdots,
  type DiscoverSearchParams,
} from "@/lib/qdot-data";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = parseDiscoverFilters(resolvedSearchParams);

  return (
    <DiscoverDashboard
      availableElements={availableElements}
      bounds={discoverBounds}
      initialFilters={initialFilters}
      qdots={qdots}
    />
  );
}

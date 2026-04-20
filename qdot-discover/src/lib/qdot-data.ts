import rawData from "@/data/nanoparticles_comprehensive.json";
import dynamicsRaw from "@/data/dynamics.json";

type SearchParamValue = string | string[] | undefined;

const NON_CORE_ELEMENTS = new Set(["C", "H", "N", "O"]);
const PREFERRED_ELEMENT_ORDER = ["Cd", "Zn", "Se", "Te", "S", "Si"];

export interface Structure {
  total_atoms: number;
  elements: Record<string, number>;
  dimensions_angstroms: {
    x: number;
    y: number;
    z: number;
  };
  approximate_shape: string;
}

export interface AssayData {
  assay_name: string;
  result: number;
  sd: number | null;
}

export type Assay = AssayData | "no_data";

interface RawQDot {
  id: string;
  structure: Structure;
  assay: Assay;
}

export interface QDotRecord {
  id: string;
  structure: Structure;
  assay: Assay;
  elementList: string[];
  coreLabel: string;
  sizeLabel: string;
  hasAssay: boolean;
  zetaValue: number | null;
  zetaLabel: string;
}

export interface DynamicsData {
  node_element: string;
  n_nodes: number;
  gnm_cutoff: number;
  anm_cutoff: number;
  gnm_eigenvalues: number[];
  anm_eigenvalues: number[];
}

const dynamicsMap = dynamicsRaw as Record<string, DynamicsData>;

export function getDynamics(id: string): DynamicsData | null {
  return dynamicsMap[id] ?? null;
}

export interface DiscoverBounds {
  atomsMin: number;
  atomsMax: number;
  zetaMin: number;
  zetaMax: number;
}

export interface DiscoverFilters {
  q: string;
  elements: string[];
  atomsMin: number;
  atomsMax: number;
  zetaMin: number;
  zetaMax: number;
}

export interface DiscoverSearchParams {
  q?: SearchParamValue;
  elements?: SearchParamValue;
  atomsMin?: SearchParamValue;
  atomsMax?: SearchParamValue;
  zetaMin?: SearchParamValue;
  zetaMax?: SearchParamValue;
}

function compareElements(left: string, right: string) {
  const leftOrder = PREFERRED_ELEMENT_ORDER.indexOf(left);
  const rightOrder = PREFERRED_ELEMENT_ORDER.indexOf(right);

  if (leftOrder !== rightOrder) {
    if (leftOrder === -1) return 1;
    if (rightOrder === -1) return -1;
    return leftOrder - rightOrder;
  }

  return left.localeCompare(right);
}

function sortElementList(elements: Record<string, number>) {
  return Object.keys(elements).sort(compareElements);
}

function getCoreLabel(elementList: string[]) {
  const coreElements = elementList.filter((element) => !NON_CORE_ELEMENTS.has(element));
  const summaryElements = (coreElements.length > 0 ? coreElements : elementList).slice(0, 3);
  return summaryElements.join(" · ");
}

function getSizeLabel({
  x,
  y,
  z,
}: Structure["dimensions_angstroms"]) {
  return `${x.toFixed(1)} × ${y.toFixed(1)} × ${z.toFixed(1)} Å`;
}

function normalizeQDot(rawQDot: RawQDot): QDotRecord {
  const elementList = sortElementList(rawQDot.structure.elements);
  const assayData = rawQDot.assay === "no_data" ? null : rawQDot.assay;
  const hasAssay = assayData !== null;
  const zetaValue = assayData?.result ?? null;

  return {
    ...rawQDot,
    elementList,
    coreLabel: getCoreLabel(elementList),
    sizeLabel: getSizeLabel(rawQDot.structure.dimensions_angstroms),
    hasAssay,
    zetaValue,
    zetaLabel: assayData ? `${assayData.result.toFixed(1)} mV` : "No assay data",
  };
}

export const qdots = (rawData as unknown as RawQDot[])
  .map(normalizeQDot)
  .sort((left, right) => left.id.localeCompare(right.id));

export const availableElements = Array.from(
  new Set(qdots.flatMap((qdot) => qdot.elementList)),
).sort(compareElements);

export const discoverBounds: DiscoverBounds = {
  atomsMin: Math.min(...qdots.map((qdot) => qdot.structure.total_atoms)),
  atomsMax: Math.max(...qdots.map((qdot) => qdot.structure.total_atoms)),
  zetaMin: Math.min(...qdots.filter((qdot) => qdot.zetaValue !== null).map((qdot) => qdot.zetaValue ?? 0)),
  zetaMax: Math.max(...qdots.filter((qdot) => qdot.zetaValue !== null).map((qdot) => qdot.zetaValue ?? 0)),
};

export function getDefaultDiscoverFilters(): DiscoverFilters {
  return {
    q: "",
    elements: [],
    atomsMin: discoverBounds.atomsMin,
    atomsMax: discoverBounds.atomsMax,
    zetaMin: discoverBounds.zetaMin,
    zetaMax: discoverBounds.zetaMax,
  };
}

function getFirstValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseNumberParam(value: SearchParamValue) {
  const parsedValue = Number(getFirstValue(value));
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseDiscoverFilters(searchParams: DiscoverSearchParams): DiscoverFilters {
  const defaults = getDefaultDiscoverFilters();

  const q = (getFirstValue(searchParams.q) ?? "").trim();
  const rawElements = (getFirstValue(searchParams.elements) ?? "")
    .split(",")
    .map((element) => element.trim())
    .filter(Boolean);

  const elements = Array.from(new Set(rawElements)).filter((element) => availableElements.includes(element));

  const rawAtomsMin = parseNumberParam(searchParams.atomsMin) ?? defaults.atomsMin;
  const rawAtomsMax = parseNumberParam(searchParams.atomsMax) ?? defaults.atomsMax;
  const rawZetaMin = parseNumberParam(searchParams.zetaMin) ?? defaults.zetaMin;
  const rawZetaMax = parseNumberParam(searchParams.zetaMax) ?? defaults.zetaMax;

  const atomsMin = clamp(Math.min(rawAtomsMin, rawAtomsMax), discoverBounds.atomsMin, discoverBounds.atomsMax);
  const atomsMax = clamp(Math.max(rawAtomsMin, rawAtomsMax), discoverBounds.atomsMin, discoverBounds.atomsMax);
  const zetaMin = clamp(Math.min(rawZetaMin, rawZetaMax), discoverBounds.zetaMin, discoverBounds.zetaMax);
  const zetaMax = clamp(Math.max(rawZetaMin, rawZetaMax), discoverBounds.zetaMin, discoverBounds.zetaMax);

  return {
    q,
    elements,
    atomsMin,
    atomsMax,
    zetaMin,
    zetaMax,
  };
}

export function serializeDiscoverFilters(filters: DiscoverFilters) {
  const defaults = getDefaultDiscoverFilters();
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.elements.length > 0) {
    params.set("elements", filters.elements.join(","));
  }

  if (filters.atomsMin !== defaults.atomsMin) {
    params.set("atomsMin", String(filters.atomsMin));
  }

  if (filters.atomsMax !== defaults.atomsMax) {
    params.set("atomsMax", String(filters.atomsMax));
  }

  if (filters.zetaMin !== defaults.zetaMin) {
    params.set("zetaMin", String(filters.zetaMin));
  }

  if (filters.zetaMax !== defaults.zetaMax) {
    params.set("zetaMax", String(filters.zetaMax));
  }

  return params;
}

export function isZetaFilterNarrowed(filters: DiscoverFilters) {
  return filters.zetaMin !== discoverBounds.zetaMin || filters.zetaMax !== discoverBounds.zetaMax;
}

export function filterQDots(records: QDotRecord[], filters: DiscoverFilters) {
  const query = filters.q.toLowerCase();
  const hideMissingAssays = isZetaFilterNarrowed(filters);

  return records.filter((record) => {
    if (query) {
      const matchesId = record.id.toLowerCase().includes(query);
      const matchesElements = record.elementList.some((element) => element.toLowerCase().includes(query));

      if (!matchesId && !matchesElements) {
        return false;
      }
    }

    if (filters.elements.length > 0 && !filters.elements.every((element) => record.elementList.includes(element))) {
      return false;
    }

    const totalAtoms = record.structure.total_atoms;
    if (totalAtoms < filters.atomsMin || totalAtoms > filters.atomsMax) {
      return false;
    }

    if (hideMissingAssays && record.zetaValue === null) {
      return false;
    }

    if (record.zetaValue !== null && (record.zetaValue < filters.zetaMin || record.zetaValue > filters.zetaMax)) {
      return false;
    }

    return true;
  });
}

export function getAllElements() {
  return availableElements;
}

export function getMinMaxAtoms(): [number, number] {
  return [discoverBounds.atomsMin, discoverBounds.atomsMax];
}

export function getMinMaxZeta(): [number, number] {
  return [discoverBounds.zetaMin, discoverBounds.zetaMax];
}

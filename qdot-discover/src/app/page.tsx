"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Layers3,
  Microscope,
  Network,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CoarseGrainScene } from "@/components/home/CoarseGrainScene";

const EigenvalueModeChart = dynamic(
  () => import("@/components/home/EigenvalueModeChart").then((module) => module.EigenvalueModeChart),
  {
    loading: () => <div className="h-full rounded-2xl bg-secondary/45" />,
    ssr: false,
  },
);

const eigenDataGNM = Array.from({ length: 50 }, (_, index) => ({
  mode: index + 1,
  value: Math.pow((index + 1) / 11, 2) * 0.68 + (Math.sin(index * 0.58) + 1.3) * 0.08,
}));

const eigenDataANM = Array.from({ length: 50 }, (_, index) => ({
  mode: index + 1,
  value: Math.pow((index + 1) / 10.5, 2.35) * 0.24 + (Math.cos(index * 0.42) + 1.25) * 0.14,
}));

const applicationAreas = ["QLED displays", "Biological imaging", "Solar energy"];
const coarseGrainFacts = [
  { label: "Original system", value: "2,805 atoms" },
  { label: "Chosen node type", value: "Cadmium (Cd)" },
  { label: "Cadmium nodes", value: "902" },
  { label: "Closest Cd pair", value: "4.68 Å" },
];

const modeExpectations = [
  {
    label: "GNM expectation",
    value: "901 non-zero modes",
    detail: "One translational zero mode for a 902-node scalar network.",
  },
  {
    label: "ANM expectation",
    value: "2,700 non-zero modes",
    detail: "Three degrees of freedom per node minus six rigid-body modes.",
  },
];

const cutoffTakeaways = [
  "At 6.0 Å, the CdTe network already stays connected instead of fragmenting into free-floating pieces.",
  "Moving to 10.0 Å increases spring density and stiffness without changing the qualitative mode structure.",
  "That behavior supports the report’s conclusion that this nanoparticle acts more like a bulk crystal than a floppy biomolecule.",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"GNM" | "ANM">("GNM");

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(90,180,255,0.18),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(29,78,216,0.14),transparent_22%),linear-gradient(180deg,transparent,rgba(255,255,255,0.04))]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-center">
          <div className="space-y-8">
            <Badge className="border-primary/20 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-primary">
              MAT306 • Interactive Visual Report
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Unveiling Quantum Dot Dynamics through QDNP015.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-foreground/76 sm:text-xl">
                This report-driven page turns your normal mode analysis into a public-facing narrative:
                why CdTe quantum dots matter, how coarse-graining compresses the system, and what the
                GNM and ANM results say about stiffness, connectivity, and collective motion.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard label="Nanoparticle" value="QDNP015" />
              <MetricCard label="Core system" value="CdTe quantum dot" />
              <MetricCard label="Cutoff story" value="6 Å → 10 Å" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="#report">
                <Button size="lg">
                  Read the Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button className="bg-transparent" size="lg" variant="outline">
                  Explore the Library
                </Button>
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden border-border/75 bg-card/86">
            <CardHeader className="border-b border-border/70 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Microscope className="h-5 w-5 text-primary" />
                Report Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Real-world motivation
                </p>
                <p className="text-sm leading-7 text-foreground/78">
                  QDNP015 was chosen because quantum dots sit at the intersection of display
                  engineering, imaging, and energy conversion. It is large enough to show rich
                  cooperative motion while remaining tractable for normal mode analysis.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {applicationAreas.map((area) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Key report facts</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <MetricRow label="Total atoms" value="2,805" />
                  <MetricRow label="Cadmium nodes" value="902" />
                  <MetricRow label="Nearest Cd spacing" value="4.68 Å" />
                  <MetricRow label="Final ANM cutoff" value="10.0 Å" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="report" className="mx-auto flex w-full max-w-7xl flex-col gap-28 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div className="space-y-6">
            <SectionLabel icon={<Sparkles className="h-5 w-5" />} text="Why QDNP015" />
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Start from the actual nanoparticle, not from an abstract toy system.
              </h2>
              <p className="text-lg leading-8 text-foreground/76">
                In the written report, QDNP015 is introduced as a Cadmium-Telluride quantum dot from
                the ViNAS toolbox. The structure combines a dense inorganic core with a surface shell
                and ligands, making it a good example for explaining why nanoparticles need careful
                simplification before dynamics can be computed.
              </p>
              <p className="text-lg leading-8 text-foreground/76">
                This is the right public-facing starting point: show the real structure, explain its
                scientific motivation, and then guide the reader into the modeling decisions that make
                the later eigenvalues and matrices interpretable.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="relative aspect-[1.06] w-full">
              <Image
                alt="VMD visualization of QDNP015 from the MAT306 report"
                className="object-cover"
                fill
                src="/report/Figure0-1.png"
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <div className="space-y-6">
            <SectionLabel icon={<Network className="h-5 w-5" />} text="Coarse-Graining" />
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Reduce the system, but keep the physics that matters.
              </h2>
              <p className="text-lg leading-8 text-foreground/76">
                The report explicitly justifies coarse-graining by selecting cadmium atoms as the
                repeating scaffold. That choice cuts the system down from 2,805 atoms to 902 nodes
                while still respecting the lattice geometry used to transfer forces across the
                nanoparticle.
              </p>
              <p className="text-lg leading-8 text-foreground/76">
                The key measurement is the nearest cadmium separation: 4.68 Å. That stays above the
                assignment threshold of 4.0 Å and validates the Cd-only node selection for both the
                Gaussian and anisotropic network models.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {coarseGrainFacts.map((fact) => (
                <Card key={fact.label} className="bg-card/70">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{fact.label}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{fact.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <CoarseGrainScene />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] lg:items-start">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/70 pb-4">
              <CardTitle className="text-xl">Eigenvalue vs. Mode Index</CardTitle>
              <div className="flex rounded-full bg-secondary p-1">
                {(["GNM", "ANM"] as const).map((model) => (
                  <button
                    key={model}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === model ? "bg-primary text-primary-foreground" : "text-foreground/65"
                    }`}
                    onClick={() => setActiveTab(model)}
                    type="button"
                  >
                    {model}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[310px] w-full">
                <EigenvalueModeChart data={activeTab === "GNM" ? eigenDataGNM : eigenDataANM} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <SectionLabel icon={<Activity className="h-5 w-5" />} text="Mode Interpretation" />
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                GNM and ANM answer different versions of the same question.
              </h2>
              <p className="text-lg leading-8 text-foreground/76">
                The GNM treats the structure as an isotropic network and produces the scalar
                Kirchhoff matrix. The ANM keeps full 3D directional freedom, which is why it needs a
                Hessian-based description and more non-zero modes.
              </p>
              <p className="text-lg leading-8 text-foreground/76">
                Your report makes the interpretation clear: low eigenvalues correspond to soft,
                collective motions like breathing, bending, or twisting; high eigenvalues represent
                short-range, stiff, localized fluctuations inside the dense quantum-dot core.
              </p>
            </div>

            <div className="grid gap-3">
              {modeExpectations.map((expectation) => (
                <Card key={expectation.label} className="bg-card/72">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {expectation.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{expectation.value}</p>
                    <p className="mt-2 text-sm leading-6 text-foreground/72">{expectation.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
          <div className="space-y-6">
            <SectionLabel icon={<Layers3 className="h-5 w-5" />} text="Matrices" />
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                The matrices explain connectivity first, then correlation.
              </h2>
              <p className="text-lg leading-8 text-foreground/76">
                The report’s side-by-side matrix interpretation is valuable for a public audience.
                The Kirchhoff matrix records which nodes are directly linked by the cutoff network,
                while its inverse reveals how motion is correlated across the whole nanoparticle.
              </p>
              <p className="text-lg leading-8 text-foreground/76">
                Those repeating off-diagonal patterns are not noise. They indicate that nodes far
                apart in index space can still move together because they sit near each other on the
                actual spherical surface of the particle.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="relative aspect-[1.95] w-full">
              <Image
                alt="Kirchhoff and covariance matrix figure from the MAT306 report"
                className="object-cover"
                fill
                src="/report/Figure5-1.png"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="max-w-4xl space-y-4">
            <SectionLabel icon={<ScanSearch className="h-5 w-5" />} text="Cutoff Interpretation" />
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              The cutoff comparison reveals stiffness scaling rather than catastrophic fragmentation.
            </h2>
            <p className="text-lg leading-8 text-foreground/76">
              One of the most interesting results in the report is that QDNP015 behaves differently
              from many protein systems. Lowering the ANM cutoff back to 6.0 Å does not introduce
              extra trivial modes or break the structure apart. Instead, it mainly softens the system
              by reducing the number of effective springs.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/70 pb-4">
                <CardTitle className="text-lg">Inverse Hessian at 10.0 Å</CardTitle>
              </CardHeader>
              <div className="relative aspect-[1.18] w-full">
                <Image
                  alt="Inverse Hessian matrix for ANM at 10.0 angstrom cutoff"
                  className="object-cover"
                  fill
                  src="/report/Figure8-1.png"
                />
              </div>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/70 pb-4">
                <CardTitle className="text-lg">Inverse Hessian at 6.0 Å</CardTitle>
              </CardHeader>
              <div className="relative aspect-[1.18] w-full">
                <Image
                  alt="Inverse Hessian matrix for ANM at 6.0 angstrom cutoff"
                  className="object-cover"
                  fill
                  src="/report/Figure8-2.png"
                />
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {cutoffTakeaways.map((takeaway) => (
              <Card key={takeaway} className="bg-card/72">
                <CardContent className="p-5">
                  <p className="text-sm leading-7 text-foreground/76">{takeaway}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/16 bg-primary/8 px-4 py-2 text-primary">
      {icon}
      <span className="font-mono text-xs uppercase tracking-[0.24em]">{text}</span>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/72 px-4 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { qdots, getDynamics } from "@/lib/qdot-data";
import { ArrowLeft, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const Viewer3D = dynamic(() => import("@/components/Viewer3D"), { ssr: false });
const DynamicsCharts = dynamic(() => import("./DynamicsCharts"), { ssr: false });

export default function QDotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qd = qdots.find((q) => q.id === id);

  if (!qd) {
    notFound();
  }

  const dynamics = getDynamics(qd.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/discover">
          <Button variant="ghost" className="text-foreground/60 hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-border/70 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary font-mono">{qd.id}</h1>
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
              {qd.structure.approximate_shape}
            </Badge>
          </div>
          <p className="text-foreground/60 text-lg">
            Complex Nanoparticle containing {qd.structure.total_atoms.toLocaleString()} atoms.
          </p>
        </div>

        <div className="flex gap-2">
          {Object.entries(qd.structure.elements).map(([el, count]) => (
            <Badge key={el} variant="secondary" className="px-3 py-1 text-sm bg-secondary">
              {el} <span className="opacity-50 ml-1">{count}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">

        {/* Left: 3D Viewer + Dimensions */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-border/70">
            <div className="h-[500px]">
              <Viewer3D pdbId={qd.id} />
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 bg-secondary/30">
                <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Dimension X</div>
                <div className="text-xl font-medium">{qd.structure.dimensions_angstroms.x.toFixed(2)} Å</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 bg-secondary/30">
                <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Dimension Y</div>
                <div className="text-xl font-medium">{qd.structure.dimensions_angstroms.y.toFixed(2)} Å</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 bg-secondary/30">
                <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Dimension Z</div>
                <div className="text-xl font-medium">{qd.structure.dimensions_angstroms.z.toFixed(2)} Å</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Assay + Dynamics */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-card">
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
                <Activity className="w-5 h-5" /> Experimental Assay Result
              </h3>
              {qd.assay === "no_data" ? (
                <div className="text-foreground/50 italic py-4">No experimental data available for this structure.</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-foreground/50">Assay Type</div>
                    <div className="font-medium text-lg">{qd.assay.assay_name}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="text-sm text-foreground/50">Result</div>
                      <div className="font-bold text-2xl text-accent">{qd.assay.result} mV</div>
                    </div>
                    <div>
                      <div className="text-sm text-foreground/50">Std. Dev</div>
                      <div className="font-bold text-xl">±{qd.assay.sd ?? "N/A"}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Normal Mode Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicsCharts
                gnmEigenvalues={dynamics?.gnm_eigenvalues ?? null}
                anmEigenvalues={dynamics?.anm_eigenvalues ?? null}
                nodeElement={dynamics?.node_element ?? null}
                gnmCutoff={dynamics?.gnm_cutoff ?? null}
                anmCutoff={dynamics?.anm_cutoff ?? null}
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

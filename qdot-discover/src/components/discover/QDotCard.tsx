import Link from "next/link";
import { Activity, ArrowRight, Atom, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type QDotRecord } from "@/lib/qdot-data";

export function QDotCard({ qdot }: { qdot: QDotRecord }) {
  return (
    <Card className="group flex h-full flex-col border-border/70 bg-card/78 shadow-[0_18px_50px_rgba(15,23,42,0.14)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_56px_rgba(37,99,235,0.16)]">
      <CardHeader className="gap-4 border-b border-border/70 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {qdot.coreLabel} core
            </p>
            <CardTitle className="font-mono text-2xl text-foreground">{qdot.id}</CardTitle>
          </div>
          <Badge className="shrink-0" variant="outline">
            {qdot.structure.approximate_shape}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {qdot.elementList.map((element) => (
            <Badge key={element} variant="secondary">
              {element}
              <span className="ml-1.5 font-mono text-[0.72rem] text-muted-foreground">
                {qdot.structure.elements[element]}
              </span>
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5 pt-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Atom className="h-3.5 w-3.5" />
              Atoms
            </div>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {qdot.structure.total_atoms.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/70 p-3 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Ruler className="h-3.5 w-3.5" />
              Size
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{qdot.sizeLabel}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            Assay
          </div>
          {qdot.hasAssay && qdot.assay !== "no_data" ? (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-foreground">{qdot.assay.assay_name}</p>
              <p className="text-base font-semibold text-primary">
                {qdot.assay.result.toFixed(1)} mV
                {qdot.assay.sd !== null ? (
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    ±{qdot.assay.sd.toFixed(1)}
                  </span>
                ) : null}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm font-medium text-muted-foreground">No assay data</p>
          )}
        </div>

        <div className="mt-auto pt-2">
          <Link href={`/qdot/${qdot.id}`}>
            <Button className="w-full justify-between">
              Analyze Dynamics
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

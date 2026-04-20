"use client";

import { useEffect, useRef, useState } from "react";
import * as $3Dmol from "3dmol";

interface Viewer3DProps {
  pdbId: string;
}

export default function Viewer3D({ pdbId }: Viewer3DProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: "rgba(0,0,0,0)",
    });

    let cancelled = false;

    fetch(`/pdb/${pdbId}.pdb`)
      .then((res) => res.text())
      .then((pdbText) => {
        if (cancelled) return;
        viewer.addModel(pdbText, "pdb");
        viewer.setStyle({}, { sphere: { radius: 0.4 } });
        viewer.zoomTo();
        viewer.render();
        viewer.spin("y", 0.4);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback: simple sphere cluster if PDB fetch fails
        const radius = 15;
        for (let i = 0; i < 80; i++) {
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = Math.cbrt(Math.random()) * radius;
          viewer.addSphere({
            center: { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi) },
            radius: 1.5,
            color: Math.random() > 0.5 ? "cyan" : "orange",
          });
        }
        viewer.zoomTo();
        viewer.render();
        viewer.spin("y", 0.4);
        setLoaded(true);
      });

    return () => {
      cancelled = true;
      viewer.clear();
    };
  }, [pdbId]);

  return (
    <div
      ref={viewerRef}
      className="relative flex h-full min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card/40"
    >
      <div className="absolute top-4 left-4 z-10 rounded-full bg-background/85 px-3 py-1 text-xs text-muted-foreground">
        Interactive 3D Viewer
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/60 animate-pulse">Loading structure…</span>
        </div>
      )}
    </div>
  );
}

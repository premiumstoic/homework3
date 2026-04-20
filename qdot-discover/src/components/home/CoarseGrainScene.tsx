"use client";

const atomCloud = Array.from({ length: 34 }, (_, index) => {
  const angle = index * 0.72;
  const radius = 42 + (index % 6) * 8;
  const x = 138 + Math.cos(angle) * radius;
  const y = 198 + Math.sin(angle * 1.08) * (52 + (index % 5) * 7);
  const size = index % 4 === 0 ? 13 : index % 3 === 0 ? 10 : 8;
  const color = index % 5 === 0 ? "#7dd3fc" : index % 3 === 0 ? "#60a5fa" : "#1d4ed8";

  return { color, size, x, y };
});

const nodeGrid = Array.from({ length: 16 }, (_, index) => {
  const column = index % 4;
  const row = Math.floor(index / 4);

  return {
    x: 378 + column * 58,
    y: 110 + row * 62,
  };
});

const nodeEdges = nodeGrid.flatMap((node, index) => {
  const column = index % 4;
  const row = Math.floor(index / 4);
  const edges: Array<{ from: typeof node; to: typeof node }> = [];

  if (column < 3) {
    edges.push({ from: node, to: nodeGrid[index + 1] });
  }

  if (row < 3) {
    edges.push({ from: node, to: nodeGrid[index + 4] });
  }

  return edges;
});

export function CoarseGrainScene() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(90,180,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(29,78,216,0.18),transparent_30%)]" />
      <div className="relative flex flex-wrap gap-2 pb-4">
        <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
          2,805 total atoms
        </span>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-primary">
          902 cadmium nodes
        </span>
      </div>

      <svg
        className="relative h-auto w-full"
        viewBox="0 0 620 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="atomGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.12" />
          </radialGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.18" />
          </radialGradient>
        </defs>

        <rect
          fill="rgba(255,255,255,0.08)"
          height="294"
          rx="34"
          stroke="rgba(255,255,255,0.18)"
          width="244"
          x="24"
          y="32"
        />
        <rect
          fill="rgba(255,255,255,0.08)"
          height="294"
          rx="34"
          stroke="rgba(255,255,255,0.18)"
          width="244"
          x="352"
          y="32"
        />

        <text
          fill="currentColor"
          fontFamily="var(--font-sans)"
          fontSize="15"
          letterSpacing="2.6"
          opacity="0.7"
          x="44"
          y="62"
        >
          FULL NANOPARTICLE
        </text>
        <text
          fill="currentColor"
          fontFamily="var(--font-sans)"
          fontSize="15"
          letterSpacing="2.6"
          opacity="0.7"
          x="374"
          y="62"
        >
          COARSE-GRAINED NETWORK
        </text>

        {atomCloud.map((atom, index) => (
          <g key={index}>
            <circle cx={atom.x} cy={atom.y} fill={atom.color} opacity="0.18" r={atom.size * 2.5} />
            <circle cx={atom.x} cy={atom.y} fill="url(#atomGlow)" r={atom.size} />
          </g>
        ))}

        {nodeEdges.map((edge, index) => (
          <line
            key={index}
            opacity="0.42"
            stroke="#60a5fa"
            strokeWidth="3"
            x1={edge.from.x}
            x2={edge.to.x}
            y1={edge.from.y}
            y2={edge.to.y}
          />
        ))}

        {nodeGrid.map((node, index) => (
          <g key={index}>
            <circle cx={node.x} cy={node.y} fill="#60a5fa" opacity="0.14" r="28" />
            <circle cx={node.x} cy={node.y} fill="url(#nodeGlow)" r="15" />
            <circle cx={node.x} cy={node.y} fill="#14315f" r="3.6" />
          </g>
        ))}

        <g opacity="0.85">
          <path
            d="M290 175 C315 175, 315 175, 340 175"
            fill="none"
            stroke="#2563eb"
            strokeDasharray="8 10"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M334 164 L352 175 L334 186"
            fill="none"
            stroke="#2563eb"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>

      <div className="relative mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/65 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Before</p>
          <p className="mt-2 text-sm text-foreground/78">
            Every atom and ligand contributes to the geometry, which is too costly for direct normal mode analysis.
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/65 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">After</p>
          <p className="mt-2 text-sm text-foreground/78">
            Only the repeating cadmium lattice is retained as nodes, preserving the collective mechanics at a tractable scale.
          </p>
        </div>
      </div>
    </div>
  );
}

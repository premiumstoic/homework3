"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface DynamicsChartsProps {
  gnmEigenvalues: number[] | null;
  anmEigenvalues: number[] | null;
  nodeElement: string | null;
  gnmCutoff: number | null;
  anmCutoff: number | null;
}

function EigenChart({
  data,
  label,
  color,
  gradientId,
}: {
  data: { mode: number; value: number }[];
  label: string;
  color: string;
  gradientId: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mode" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d1326",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "0.72rem",
              }}
              formatter={(v: number) => [v.toFixed(4), "λ"]}
              labelFormatter={(l) => `Mode ${l}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DynamicsCharts({
  gnmEigenvalues,
  anmEigenvalues,
  nodeElement,
  gnmCutoff,
  anmCutoff,
}: DynamicsChartsProps) {
  const gnmData = gnmEigenvalues?.map((v, i) => ({ mode: i + 1, value: v })) ?? [];
  const anmData = anmEigenvalues?.map((v, i) => ({ mode: i + 1, value: v })) ?? [];

  if (gnmData.length === 0 && anmData.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-sm text-muted-foreground">
        Analysis data not available
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {nodeElement && (
        <p className="text-xs text-muted-foreground">
          Nodes: <span className="font-semibold text-foreground">{nodeElement}</span> atoms
          {gnmCutoff && <> · GNM cutoff {gnmCutoff} Å</>}
          {anmCutoff && <> · ANM cutoff {anmCutoff} Å</>}
        </p>
      )}
      {gnmData.length > 0 && (
        <EigenChart data={gnmData} label="GNM Eigenvalues" color="#00d2ff" gradientId="gnmGradient" />
      )}
      {anmData.length > 0 && (
        <EigenChart data={anmData} label="ANM Eigenvalues" color="#a78bfa" gradientId="anmGradient" />
      )}
    </div>
  );
}

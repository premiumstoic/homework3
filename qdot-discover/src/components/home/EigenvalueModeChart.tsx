"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface EigenvalueModePoint {
  mode: number;
  value: number;
}

export function EigenvalueModeChart({ data }: { data: EigenvalueModePoint[] }) {
  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.22)" strokeDasharray="3 3" />
        <XAxis dataKey="mode" stroke="rgba(100,116,139,0.8)" tick={{ fill: "rgba(100,116,139,0.8)" }} />
        <YAxis stroke="rgba(100,116,139,0.8)" tick={{ fill: "rgba(100,116,139,0.8)" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0d1326",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
          itemStyle={{ color: "#00d2ff" }}
        />
        <Line
          activeDot={{ r: 8 }}
          dataKey="value"
          dot={false}
          stroke="#00d2ff"
          strokeWidth={3}
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

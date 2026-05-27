"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  fecha: string;
  ventas: number;
  pedidos: number;
}

interface MonthlySalesBarChartProps {
  data: DataPoint[];
}

export function MonthlySalesBarChart({ data }: MonthlySalesBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="fecha" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value) => [`€${Number(value).toLocaleString()}`, "Ventas"]}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieDataPoint {
  name: string;
  value: number;
}

interface SalesPieChartProps {
  data: PieDataPoint[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 200 70% 50%))",
  "hsl(var(--chart-3, 30 80% 55%))",
];

export function SalesPieChart({ data }: SalesPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [Number(value).toLocaleString(), "Ventas"]}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

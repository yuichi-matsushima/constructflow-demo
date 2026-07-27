"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyRevenue } from "@/lib/mock-data";

function formatYen(value: number) {
  return `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;
}

export function RevenueChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyRevenue} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            tickFormatter={formatYen}
            tickLine={false}
            axisLine={false}
            width={70}
            className="text-xs fill-muted-foreground"
          />
          <Tooltip
            formatter={(value) => [formatYen(Number(value)), "売上"]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
            }}
          />
          <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

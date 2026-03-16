"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Acme Corp", value: 850000 },
  { name: "TechSys", value: 620000 },
  { name: "GlobalServ", value: 540000 },
  { name: "Others", value: 1190000 },
]

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899"]

export function PieChartWidget() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`$${(value / 1000).toFixed(0)}k`, "Spend"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

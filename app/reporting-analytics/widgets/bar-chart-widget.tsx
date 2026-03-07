"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "IT", value: 1200000 },
  { name: "Office", value: 890000 },
  { name: "Marketing", value: 750000 },
  { name: "Services", value: 620000 },
  { name: "Travel", value: 450000 },
]

export function BarChartWidget() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`$${(value / 1000).toFixed(0)}k`, "Spend"]}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

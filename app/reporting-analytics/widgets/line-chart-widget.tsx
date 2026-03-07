"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", spend: 980000 },
  { month: "Feb", spend: 1050000 },
  { month: "Mar", spend: 920000 },
  { month: "Apr", spend: 1120000 },
  { month: "May", spend: 1340000 },
  { month: "Jun", spend: 1220000 },
]

export function LineChartWidget() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`$${(value / 1000).toFixed(0)}k`, "Spend"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Line type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

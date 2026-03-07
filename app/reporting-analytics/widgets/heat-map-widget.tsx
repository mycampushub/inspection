"use client"

import { ResponsiveContainer, Tooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Cell } from "recharts"

// Sample data
const spendHeatMap = [
  { x: "Jan", y: "IT", z: 200000 },
  { x: "Jan", y: "Office", z: 50000 },
  { x: "Jan", y: "Services", z: 100000 },
  { x: "Feb", y: "IT", z: 150000 },
  { x: "Feb", y: "Office", z: 60000 },
  { x: "Feb", y: "Services", z: 120000 },
  { x: "Mar", y: "IT", z: 180000 },
  { x: "Mar", y: "Office", z: 40000 },
  { x: "Mar", y: "Services", z: 90000 },
  { x: "Apr", y: "IT", z: 220000 },
  { x: "Apr", y: "Office", z: 70000 },
  { x: "Apr", y: "Services", z: 130000 },
]

interface HeatMapWidgetProps {
  config: {
    title: string
    data: string
  }
}

export function HeatMapWidget({ config }: HeatMapWidgetProps) {
  // In a real app, you would fetch data based on config.data
  // For this demo, we'll use the sample data
  const data = spendHeatMap

  // Function to determine color based on value
  const getColor = (value: number) => {
    const maxValue = Math.max(...data.map((item) => item.z))
    const minValue = Math.min(...data.map((item) => item.z))
    const normalizedValue = (value - minValue) / (maxValue - minValue)

    // Color gradient from blue to red
    const r = Math.floor(normalizedValue * 255)
    const b = Math.floor((1 - normalizedValue) * 255)
    return `rgb(${r}, 0, ${b})`
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <XAxis dataKey="x" name="Month" />
          <YAxis dataKey="y" name="Category" />
          <ZAxis dataKey="z" range={[100, 1000]} name="Spend" unit="$" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(value as number)
            }
          />
          <Scatter name="Spend Heat Map" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

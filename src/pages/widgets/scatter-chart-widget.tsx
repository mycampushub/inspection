"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data
const priceQuality = [
  { name: "Supplier A", price: 120000, quality: 85 },
  { name: "Supplier B", price: 100000, quality: 75 },
  { name: "Supplier C", price: 140000, quality: 90 },
  { name: "Supplier D", price: 80000, quality: 65 },
  { name: "Supplier E", price: 160000, quality: 95 },
  { name: "Supplier F", price: 90000, quality: 70 },
  { name: "Supplier G", price: 130000, quality: 80 },
  { name: "Supplier H", price: 110000, quality: 78 },
  { name: "Supplier I", price: 150000, quality: 88 },
  { name: "Supplier J", price: 170000, quality: 92 },
]

interface ScatterChartWidgetProps {
  config: {
    title: string
    data: string
  }
}

export function ScatterChartWidget({ config }: ScatterChartWidgetProps) {
  // In a real app, you would fetch data based on config.data
  // For this demo, we'll use the sample data
  const data = priceQuality

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
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="price"
            name="Price"
            unit="$"
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <YAxis type="number" dataKey="quality" name="Quality" unit="%" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => {
              if (name === "price") {
                return [
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(value as number),
                  "Price",
                ]
              }
              return [`${value}%`, "Quality"]
            }}
          />
          <Legend />
          <Scatter name="Suppliers" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

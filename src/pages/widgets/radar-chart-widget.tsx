"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"

// Sample data
const supplierPerformance = [
  { name: "Quality", target: 90, actual: 85 },
  { name: "Delivery", target: 95, actual: 92 },
  { name: "Cost", target: 80, actual: 78 },
  { name: "Service", target: 85, actual: 88 },
  { name: "Innovation", target: 70, actual: 65 },
]

interface RadarChartWidgetProps {
  config: {
    title: string
    data: string
  }
}

export function RadarChartWidget({ config }: RadarChartWidgetProps) {
  // In a real app, you would fetch data based on config.data
  // For this demo, we'll use the sample data
  const data = supplierPerformance

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Target" dataKey="target" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
          <Radar name="Actual" dataKey="actual" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

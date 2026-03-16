"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

// Sample data
const supplierLocations = [
  { name: "Tech Solutions Inc.", coordinates: [-74.006, 40.7128], category: "IT Services", count: 12 },
  { name: "Global Manufacturing", coordinates: [-87.6298, 41.8781], category: "Manufacturing", count: 8 },
  { name: "European Supplies", coordinates: [2.3522, 48.8566], category: "Office Supplies", count: 15 },
  { name: "Asian Electronics", coordinates: [121.4737, 31.2304], category: "Electronics", count: 20 },
  { name: "Middle East Trading", coordinates: [55.2708, 25.2048], category: "Trading", count: 10 },
]

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

interface MapWidgetProps {
  config: {
    title: string
    data: string
  }
}

export function MapWidget({ config }: MapWidgetProps) {
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)

  // In a real app, you would fetch data based on config.data
  // For this demo, we'll use the sample data
  const data = supplierLocations

  return (
    <div className="h-full w-full relative">
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />)
          }
        </Geographies>
        {data.map((location, index) => (
          <Marker
            key={index}
            coordinates={location.coordinates as [number, number]}
            onMouseEnter={(e) => {
              setTooltipContent(`${location.name} (${location.category}): ${location.count} suppliers`)
              setTooltipPosition({ x: e.clientX, y: e.clientY })
              setShowTooltip(true)
            }}
            onMouseLeave={() => {
              setShowTooltip(false)
            }}
          >
            <circle r={Math.sqrt(location.count) * 2} fill="#F53" fillOpacity={0.8} />
          </Marker>
        ))}
      </ComposableMap>
      {showTooltip && (
        <div
          className="absolute bg-white p-2 rounded shadow-md text-xs z-10"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  )
}

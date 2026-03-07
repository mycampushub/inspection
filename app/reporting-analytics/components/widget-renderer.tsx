"use client"

import { useState } from "react"
import { MoreHorizontal, X, Settings } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { LayoutItem } from "../data/widget-data"
import { KpiWidget } from "../widgets/kpi-widget"
import { BarChartWidget } from "../widgets/bar-chart-widget"
import { LineChartWidget } from "../widgets/line-chart-widget"
import { PieChartWidget } from "../widgets/pie-chart-widget"
import { TableWidget } from "../widgets/table-widget"
import { MapWidget } from "../widgets/map-widget"
import { HeatMapWidget } from "../widgets/heat-map-widget"
import { ScatterChartWidget } from "../widgets/scatter-chart-widget"
import { RadarChartWidget } from "../widgets/radar-chart-widget"

interface WidgetRendererProps {
  item: LayoutItem
  onRemoveWidget: (widgetId: string) => void
}

export function WidgetRenderer({ item, onRemoveWidget }: WidgetRendererProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const renderWidgetContent = () => {
    switch (item.type) {
      case "kpi":
        return <KpiWidget config={item.config} />
      case "bar-chart":
        return <BarChartWidget config={item.config} />
      case "line-chart":
        return <LineChartWidget config={item.config} />
      case "pie-chart":
        return <PieChartWidget config={item.config} />
      case "table":
        return <TableWidget config={item.config} />
      case "map":
        return <MapWidget config={item.config} />
      case "heat-map":
        return <HeatMapWidget config={item.config} />
      case "scatter-chart":
        return <ScatterChartWidget config={item.config} />
      case "radar-chart":
        return <RadarChartWidget config={item.config} />
      default:
        return <div>Unknown widget type</div>
    }
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Widget menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsConfigOpen(!isConfigOpen)}>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRemoveWidget(item.i)}>
                <X className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 h-[calc(100%-40px)] overflow-auto">{renderWidgetContent()}</CardContent>
    </Card>
  )
}

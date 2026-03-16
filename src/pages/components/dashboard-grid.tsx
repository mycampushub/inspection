"use client"

import { useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import { WidgetRenderer } from "./widget-renderer"
import type { LayoutItem } from "../data/widget-data"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DashboardGridProps {
  layouts: LayoutItem[]
  onLayoutChange: (layout: any[]) => void
  onRemoveWidget: (widgetId: string) => void
}

export function DashboardGrid({ layouts, onLayoutChange, onRemoveWidget }: DashboardGridProps) {
  const [breakpoint, setBreakpoint] = useState("lg")

  // Convert our layout format to react-grid-layout format
  const formattedLayouts = {
    lg: layouts,
    md: layouts.map((item) => ({ ...item, w: Math.min(item.w, 6) })),
    sm: layouts.map((item) => ({ ...item, w: Math.min(item.w, 4), x: 0 })),
    xs: layouts.map((item) => ({ ...item, w: 2, x: 0 })),
  }

  return (
    <div className="dashboard-grid">
      {layouts.length === 0 ? (
        <div className="flex h-64 items-center justify-center border-2 border-dashed rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground">Your dashboard is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Widget" to add widgets to your dashboard</p>
          </div>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={formattedLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
          rowHeight={60}
          onLayoutChange={(layout) => onLayoutChange(layout)}
          onBreakpointChange={(breakpoint) => setBreakpoint(breakpoint)}
          isDraggable
          isResizable
          margin={[16, 16]}
        >
          {layouts.map((item) => (
            <div key={item.i} className="widget-container">
              <WidgetRenderer item={item} onRemoveWidget={onRemoveWidget} />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}

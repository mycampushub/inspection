"use client"

import { Plus } from "lucide-react"
import { useDrag } from "react-dnd"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { WidgetType } from "../data/widget-data"

interface WidgetPreviewProps {
  widget: WidgetType
  onAddWidget: (widget: WidgetType) => void
}

export function WidgetPreview({ widget, onAddWidget }: WidgetPreviewProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET",
    item: { widget },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <Card ref={drag} className={`cursor-grab ${isDragging ? "opacity-50" : ""}`}>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">{widget.description}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onAddWidget(widget)}>
          <Plus className="mr-1 h-3 w-3" />
          Add to Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}

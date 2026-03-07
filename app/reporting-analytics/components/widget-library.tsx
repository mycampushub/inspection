"use client"

import { Search } from "lucide-react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type WidgetType, widgetTypes } from "../data/widget-data"
import { WidgetPreview } from "./widget-preview"

interface WidgetLibraryProps {
  onAddWidget: (widget: WidgetType) => void
}

export function WidgetLibrary({ onAddWidget }: WidgetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All" },
    { id: "kpi", name: "KPIs" },
    { id: "chart", name: "Charts" },
    { id: "table", name: "Tables" },
    { id: "map", name: "Maps" },
  ]

  const filteredWidgets = widgetTypes.filter((widget) => {
    const matchesSearch =
      widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || widget.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Widget Library</CardTitle>
        <CardDescription>Drag and drop widgets to your dashboard</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search widgets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-none border-b-2 border-b-transparent px-4 py-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid gap-2 p-4">
              {filteredWidgets.length > 0 ? (
                filteredWidgets.map((widget) => (
                  <WidgetPreview key={widget.type} widget={widget} onAddWidget={onAddWidget} />
                ))
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-sm text-muted-foreground">No widgets found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}

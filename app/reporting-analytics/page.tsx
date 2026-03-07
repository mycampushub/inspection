"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Filter,
  GripVertical,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  X,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Import the styles directly
import "./styles.css"

// Sample data for widgets
const spendByCategory = [
  { name: "IT Equipment", value: 4000000, percentage: 31 },
  { name: "Office Supplies", value: 1500000, percentage: 12 },
  { name: "Professional Services", value: 3000000, percentage: 23 },
  { name: "Marketing", value: 2000000, percentage: 15 },
  { name: "Facilities", value: 2500000, percentage: 19 },
]

const spendTrend = [
  { month: "Jan", spend: 1200000 },
  { month: "Feb", spend: 1900000 },
  { month: "Mar", spend: 1800000 },
  { month: "Apr", spend: 2400000 },
  { month: "May", spend: 1700000 },
  { month: "Jun", spend: 2100000 },
  { month: "Jul", spend: 2300000 },
  { month: "Aug", spend: 2800000 },
  { month: "Sep", spend: 2600000 },
  { month: "Oct", spend: 2900000 },
  { month: "Nov", spend: 3100000 },
  { month: "Dec", spend: 3400000 },
]

const supplierPerformance = [
  { name: "Quality", target: 90, actual: 85 },
  { name: "Delivery", target: 95, actual: 92 },
  { name: "Cost", target: 80, actual: 78 },
  { name: "Service", target: 85, actual: 88 },
  { name: "Innovation", target: 70, actual: 65 },
]

const topSuppliers = [
  { name: "Tech Solutions Inc.", spend: 2500000, change: 12 },
  { name: "Office Depot", spend: 1800000, change: -5 },
  { name: "Global Logistics", spend: 1500000, change: 8 },
  { name: "Marketing Experts", spend: 1200000, change: 15 },
  { name: "Facility Management Co.", spend: 950000, change: 3 },
]

const contractsByStatus = [
  { name: "Active", value: 165 },
  { name: "Pending", value: 45 },
  { name: "Expiring Soon", value: 28 },
  { name: "Expired", value: 12 },
  { name: "Terminated", value: 8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Widget definitions
const widgetLibrary = [
  {
    id: "kpi-active-contracts",
    name: "Active Contracts",
    category: "KPI",
    description: "Shows the number of active contracts",
    size: "small",
    component: () => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">165</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">+10</span> from last month
          </p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "kpi-total-spend",
    name: "Total Spend",
    category: "KPI",
    description: "Shows the total procurement spend",
    size: "small",
    component: () => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spend (USD)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$21,260,445</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">+12%</span> from previous period
          </p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "kpi-active-suppliers",
    name: "Active Suppliers",
    category: "KPI",
    description: "Shows the number of active suppliers",
    size: "small",
    component: () => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,009</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">+289</span> from last year
          </p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "kpi-savings",
    name: "Cost Savings",
    category: "KPI",
    description: "Shows the total cost savings",
    size: "small",
    component: () => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost Savings (USD)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$3,450,000</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">+18%</span> from target
          </p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "chart-spend-trend",
    name: "Spend Trend",
    category: "Chart",
    description: "Shows the spend trend over time",
    size: "large",
    component: () => (
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Spend Trend</CardTitle>
            <CardDescription>Monthly procurement spend over time</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Download CSV</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Set Alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              spend: {
                label: "Spend",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={spendTrend}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 1,
                    }).format(value)
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(value as number)
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="var(--color-spend)"
                  fill="var(--color-spend)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "chart-spend-by-category",
    name: "Spend by Category",
    category: "Chart",
    description: "Shows the spend distribution by category",
    size: "medium",
    component: () => (
      <Card>
        <CardHeader>
          <CardTitle>Spend by Category</CardTitle>
          <CardDescription>Distribution of spend across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {spendByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(value as number)
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "chart-supplier-performance",
    name: "Supplier Performance",
    category: "Chart",
    description: "Shows the supplier performance metrics",
    size: "medium",
    component: () => (
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance</CardTitle>
          <CardDescription>Key performance indicators vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={supplierPerformance}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="target" fill="#8884d8" name="Target" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "table-top-suppliers",
    name: "Top Suppliers",
    category: "Table",
    description: "Shows the top suppliers by spend",
    size: "medium",
    component: () => (
      <Card>
        <CardHeader>
          <CardTitle>Top Suppliers by Spend</CardTitle>
          <CardDescription>Suppliers with the highest procurement spend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSuppliers.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{supplier.name}</p>
                  <p className="text-xs text-muted-foreground">Rank #{index + 1}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(supplier.spend)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={supplier.change > 0 ? "text-green-500" : "text-red-500"}
                      >{`${supplier.change > 0 ? "+" : ""}${supplier.change}%`}</span>{" "}
                      YoY
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "chart-contracts-by-status",
    name: "Contracts by Status",
    category: "Chart",
    description: "Shows the distribution of contracts by status",
    size: "medium",
    component: () => (
      <Card>
        <CardHeader>
          <CardTitle>Contracts by Status</CardTitle>
          <CardDescription>Distribution of contracts by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contractsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {contractsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    ),
  },
]

// Default dashboard configuration
const defaultDashboard = [
  "kpi-active-contracts",
  "kpi-total-spend",
  "kpi-active-suppliers",
  "kpi-savings",
  "chart-spend-trend",
  "chart-spend-by-category",
  "chart-supplier-performance",
  "table-top-suppliers",
]

export default function ReportingAnalytics() {
  // Force a re-render on initial load to fix styling issues
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [dashboardName, setDashboardName] = useState("My Dashboard")
  const [dashboardWidgets, setDashboardWidgets] = useState<string[]>(defaultDashboard)

  // Drag and drop state
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragImageRef = useRef<HTMLDivElement>(null)

  // Filter widgets based on search and category
  const filteredWidgets = widgetLibrary.filter((widget) => {
    const matchesSearch =
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeTab === "all" || widget.category.toLowerCase() === activeTab.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Handle adding a widget to the dashboard
  const addWidget = (widgetId: string) => {
    if (!dashboardWidgets.includes(widgetId)) {
      setDashboardWidgets([...dashboardWidgets, widgetId])
    }
  }

  // Handle removing a widget from the dashboard
  const removeWidget = (widgetId: string) => {
    setDashboardWidgets(dashboardWidgets.filter((id) => id !== widgetId))
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, widgetId: string, index: number) => {
    setDraggedWidget(widgetId)
    e.dataTransfer.setData("text/plain", widgetId)

    // Set the drag image to the widget element
    if (dragImageRef.current) {
      const rect = dragImageRef.current.getBoundingClientRect()
      e.dataTransfer.setDragImage(dragImageRef.current, rect.width / 2, rect.height / 2)
    }

    // Add dragging class to the element
    e.currentTarget.classList.add("widget-dragging")
  }

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("widget-dragging")
    setDraggedWidget(null)
    setDragOverIndex(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedWidget && dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()

    if (draggedWidget) {
      const dragIndex = dashboardWidgets.indexOf(draggedWidget)
      if (dragIndex !== -1 && dragIndex !== dropIndex) {
        // Create a new array without the dragged widget
        const newWidgets = [...dashboardWidgets]
        newWidgets.splice(dragIndex, 1)

        // Insert the dragged widget at the drop index
        newWidgets.splice(dropIndex, 0, draggedWidget)

        setDashboardWidgets(newWidgets)
      }
    }

    setDraggedWidget(null)
    setDragOverIndex(null)
  }

  // If not mounted yet, return a loading state that matches the final layout
  if (!mounted) {
    return (
      <>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex items-center text-lg font-semibold">Reports & Analytics</div>
        </div>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Loading dashboard...</h1>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Reports & Analytics</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Widget to Dashboard</DialogTitle>
                <DialogDescription>Browse and select widgets to add to your dashboard.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 py-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search widgets..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="KPI">KPIs</TabsTrigger>
                    <TabsTrigger value="Chart">Charts</TabsTrigger>
                    <TabsTrigger value="Table">Tables</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  {filteredWidgets.map((widget) => (
                    <Card key={widget.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">{widget.name}</CardTitle>
                        <CardDescription className="text-xs">{widget.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Badge variant="outline">{widget.category}</Badge>
                        <Button
                          size="sm"
                          onClick={() => {
                            addWidget(widget.id)
                          }}
                          disabled={dashboardWidgets.includes(widget.id)}
                        >
                          {dashboardWidgets.includes(widget.id) ? "Added" : "Add"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <ScrollBar />
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="button">Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{dashboardName}</h1>
            <p className="text-muted-foreground">
              Customize your analytics dashboard by adding, removing, and rearranging widgets.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Rename Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Change Layout</DropdownMenuItem>
                <DropdownMenuItem>Auto-refresh Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Reset to Default</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {dashboardWidgets.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No widgets added</h3>
              <p className="text-sm text-muted-foreground max-w-[300px]">
                Your dashboard is empty. Add widgets to start building your custom analytics view.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Widget
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add Widget to Dashboard</DialogTitle>
                    <DialogDescription>Browse and select widgets to add to your dashboard.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Search widgets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="grid grid-cols-2 gap-4">
                        {filteredWidgets.map((widget) => (
                          <Card
                            key={widget.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => addWidget(widget.id)}
                          >
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm">{widget.name}</CardTitle>
                              <CardDescription className="text-xs">{widget.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center">
                                {widget.icon}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardWidgets.map((widgetId, index) => {
              const widget = widgetLibrary.find((w) => w.id === widgetId)
              if (!widget) return null

              // Determine column span based on widget size
              const colSpan = widget.size === "large" ? "md:col-span-2" : ""

              return (
                <div
                  key={widgetId}
                  className={`group relative widget-card ${colSpan} ${
                    dragOverIndex === index ? "widget-drop-target" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, widgetId, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  ref={draggedWidget === widgetId ? dragImageRef : null}
                >
                  <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                      onClick={() => removeWidget(widgetId)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <div className="absolute left-2 top-2 z-10 cursor-grab widget-drag-handle">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {widget.component()}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

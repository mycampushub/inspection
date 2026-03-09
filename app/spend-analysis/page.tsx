"use client"

import { useState, useEffect } from "react"
import { spendAnalysisData } from "@/lib/local-data"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Filter,
  LineChart,
  MoreHorizontal,
  RefreshCw,
  Save,
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
  Line,
  LineChart as LineChartComponent,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { addDays, format, subDays, subMonths, subYears } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { memoryStorage } from "@/lib/memory-storage"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#FFC658", "#8DD1E1"]

interface SpendData {
  totalSpend: number
  categories: number
  activeSuppliers: number
  avgCostPerOrder: number
  spendByCategory: Array<{ name: string; value: number }>
  spendBySupplier: Array<{ name: string; value: number }>
  spendByDepartment: Array<{ name: string; value: number }>
  spendTrend: Array<{ month: string; value: number }>
  categoryTrend: Array<{ name: string; [key: string]: string | number }>
}

interface FilterState {
  category: string
  supplier: string
  department: string
}

interface SavedView {
  name: string
  timeframe: string
  filters: FilterState
}

export default function SpendAnalysis() {
  const [timeframe, setTimeframe] = useState("year")
  const [view, setView] = useState("overview")
  const [spendData, setSpendData] = useState<SpendData>({
    totalSpend: spendAnalysisData.totalSpend,
    categories: spendAnalysisData.categories,
    activeSuppliers: spendAnalysisData.activeSuppliers,
    avgCostPerOrder: spendAnalysisData.avgCostPerOrder,
    spendByCategory: spendAnalysisData.spendByCategory,
    spendBySupplier: spendAnalysisData.spendBySupplier,
    spendByDepartment: spendAnalysisData.spendByDepartment,
    spendTrend: spendAnalysisData.spendTrend,
    categoryTrend: spendAnalysisData.categoryTrend,
  })
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Custom date range state
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false)
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined)
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  
  // Saved views
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false)
  const [savedViews, setSavedViews] = useState<SavedView[]>([])
  const [viewName, setViewName] = useState("")

  // No need to fetch - using local data
  const fetchSpendData = () => {
    // Data is already loaded from local-data
  }

  // Generate mock data based on timeframe
  const generateMockData = (tf: string): SpendData => {
    const multiplier = tf === 'month' ? 0.1 : tf === 'quarter' ? 0.3 : tf === 'ytd' ? 0.8 : 1
    
    return {
      totalSpend: Math.round(24500000 * multiplier),
      categories: 15,
      activeSuppliers: 248,
      avgCostPerOrder: 12500,
      spendByCategory: [
        { name: "IT Equipment", value: Math.round(4000000 * multiplier) },
        { name: "Office Supplies", value: Math.round(1500000 * multiplier) },
        { name: "Professional Services", value: Math.round(3000000 * multiplier) },
        { name: "Marketing", value: Math.round(2000000 * multiplier) },
        { name: "Facilities", value: Math.round(2500000 * multiplier) },
      ],
      spendBySupplier: [
        { name: "Tech Solutions Inc.", value: Math.round(2500000 * multiplier) },
        { name: "Office Depot", value: Math.round(1200000 * multiplier) },
        { name: "Consulting Partners", value: Math.round(1800000 * multiplier) },
        { name: "Marketing Agency", value: Math.round(1500000 * multiplier) },
        { name: "Facilities Management", value: Math.round(1200000 * multiplier) },
        { name: "Other Suppliers", value: Math.round(2800000 * multiplier) },
      ],
      spendByDepartment: [
        { name: "IT", value: Math.round(5000000 * multiplier) },
        { name: "Marketing", value: Math.round(3000000 * multiplier) },
        { name: "Operations", value: Math.round(4000000 * multiplier) },
        { name: "HR", value: Math.round(1500000 * multiplier) },
        { name: "Finance", value: Math.round(2000000 * multiplier) },
      ],
      spendTrend: [
        { month: "Jan", value: Math.round(1200000 * multiplier) },
        { month: "Feb", value: Math.round(1900000 * multiplier) },
        { month: "Mar", value: Math.round(1800000 * multiplier) },
        { month: "Apr", value: Math.round(2400000 * multiplier) },
        { month: "May", value: Math.round(1700000 * multiplier) },
        { month: "Jun", value: Math.round(2100000 * multiplier) },
        { month: "Jul", value: Math.round(2300000 * multiplier) },
        { month: "Aug", value: Math.round(2800000 * multiplier) },
        { month: "Sep", value: Math.round(2600000 * multiplier) },
        { month: "Oct", value: Math.round(2900000 * multiplier) },
        { month: "Nov", value: Math.round(3100000 * multiplier) },
        { month: "Dec", value: Math.round(3400000 * multiplier) },
      ],
      categoryTrend: [
        { name: "Jan", IT: Math.round(500000 * multiplier), Marketing: Math.round(300000 * multiplier), Operations: Math.round(400000 * multiplier), HR: Math.round(100000 * multiplier), Finance: Math.round(150000 * multiplier) },
        { name: "Feb", IT: Math.round(550000 * multiplier), Marketing: Math.round(320000 * multiplier), Operations: Math.round(420000 * multiplier), HR: Math.round(110000 * multiplier), Finance: Math.round(160000 * multiplier) },
        { name: "Mar", IT: Math.round(580000 * multiplier), Marketing: Math.round(350000 * multiplier), Operations: Math.round(450000 * multiplier), HR: Math.round(120000 * multiplier), Finance: Math.round(170000 * multiplier) },
        { name: "Apr", IT: Math.round(620000 * multiplier), Marketing: Math.round(380000 * multiplier), Operations: Math.round(480000 * multiplier), HR: Math.round(130000 * multiplier), Finance: Math.round(180000 * multiplier) },
        { name: "May", IT: Math.round(650000 * multiplier), Marketing: Math.round(400000 * multiplier), Operations: Math.round(500000 * multiplier), HR: Math.round(140000 * multiplier), Finance: Math.round(190000 * multiplier) },
        { name: "Jun", IT: Math.round(680000 * multiplier), Marketing: Math.round(420000 * multiplier), Operations: Math.round(520000 * multiplier), HR: Math.round(150000 * multiplier), Finance: Math.round(200000 * multiplier) },
      ],
    }
  }

  // Load saved views from memory storage
  useEffect(() => {
    const saved = memoryStorage.getItem('spendAnalysisViews')
    if (saved) {
      setSavedViews(JSON.parse(saved))
    }
  }, [])

  // No need to fetch on mount - using local data
  // Data is already loaded from local-data
  
  // For timeframe changes, we could adjust the local data if needed
  // For now, keeping it simple with the default local data

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    // Could adjust data based on timeframe here
    // For now, just updating the state
  }

  // Handle refresh
  const handleRefresh = () => {
    // Data is local, no need to refresh
    console.log('Data refreshed (local)')
  }

  // Handle custom date range apply
  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setTimeframe('custom')
      setIsCustomRangeOpen(false)
      fetchSpendData('custom')
    }
  }

  // Handle save view
  const handleSaveView = () => {
    if (viewName.trim()) {
      const newView: SavedView = {
        name: viewName,
        timeframe,
        filters: {
          category: selectedCategory,
          supplier: selectedSupplier,
          department: selectedDepartment,
        },
      }
      const updatedViews = [...savedViews, newView]
      setSavedViews(updatedViews)
      memoryStorage.setItem('spendAnalysisViews', JSON.stringify(updatedViews))
      setIsSaveViewOpen(false)
      setViewName('')
    }
  }

  // Handle share
  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('timeframe', timeframe)
    url.searchParams.set('category', selectedCategory)
    url.searchParams.set('supplier', selectedSupplier)
    url.searchParams.set('department', selectedDepartment)
    
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert('Link copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy link')
    })
  }

  // Handle export
  const handleExport = () => {
    if (!spendData) return
    
    const exportData = {
      timeframe,
      filters: {
        category: selectedCategory,
        supplier: selectedSupplier,
        department: selectedDepartment,
      },
      data: spendData,
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spend-analysis-${timeframe}-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download chart data
  const handleDownloadCSV = () => {
    if (!spendData) return
    
    const csvContent = "Category,Spend\n" + 
      spendData.spendByCategory.map(item => `${item.name},${item.value}`).join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spend-by-category-${timeframe}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format compact currency
  const formatCompactCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 1,
    }).format(value)
  }

  if (loading || !spendData) {
    return (
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex items-center text-lg font-semibold">Spend Analysis</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading spend data...</div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Spend Analysis</div>
        <div className="ml-auto flex items-center gap-4">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCustomRangeOpen} onOpenChange={setIsCustomRangeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Custom Range
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Date Range</DialogTitle>
                <DialogDescription>
                  Choose a custom date range for your spend analysis
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCustomRangeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyCustomRange} disabled={!customStartDate || !customEndDate}>
                  Apply Range
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Category:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {spendData.spendByCategory.map(cat => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Supplier:</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {spendData.spendBySupplier.map(sup => (
                    <SelectItem key={sup.name} value={sup.name}>{sup.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Department:</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {spendData.spendByDepartment.map(dept => (
                    <SelectItem key={dept.name} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="overview" value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="supplier">By Supplier</TabsTrigger>
              <TabsTrigger value="department">By Department</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCompactCurrency(spendData.totalSpend)}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500 inline-flex items-center">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          12%
                        </span>{" "}
                        from previous period
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Categories</CardTitle>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{spendData.categories}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500 inline-flex items-center">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          2
                        </span>{" "}
                        new categories added
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{spendData.activeSuppliers}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-500 inline-flex items-center">
                          <ArrowDown className="mr-1 h-3 w-3" />
                          5
                        </span>{" "}
                        from previous period
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Cost Per Order</CardTitle>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(spendData.avgCostPerOrder)}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500 inline-flex items-center">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          18%
                        </span>{" "}
                        from previous period
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
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
                          <DropdownMenuItem onClick={handleDownloadCSV}>Download CSV</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('View details clicked')}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('Set alerts clicked')}>Set Alerts</DropdownMenuItem>
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
                            data={spendData.spendTrend}
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
                              tickFormatter={(value) => formatCompactCurrency(value)}
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  formatter={(value) => formatCurrency(value as number)}
                                />
                              }
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="var(--color-spend)"
                              fill="var(--color-spend)"
                              fillOpacity={0.2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Spend by Category</CardTitle>
                      <CardDescription>Distribution of spend across categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={spendData.spendByCategory}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {spendData.spendByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Spend by Supplier</CardTitle>
                      <CardDescription>Top suppliers by total spend</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={spendData.spendBySupplier}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {spendData.spendBySupplier.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Spend by Department</CardTitle>
                      <CardDescription>Distribution of spend across departments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={spendData.spendByDepartment}
                            layout="vertical"
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              type="number"
                              tickFormatter={(value) => formatCompactCurrency(value)}
                            />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Bar dataKey="value" fill="#8884d8">
                              {spendData.spendByDepartment.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="category" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Breakdown</CardTitle>
                      <CardDescription>Detailed spend analysis by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={spendData.spendByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Bar dataKey="value">
                              {spendData.spendByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Details</CardTitle>
                      <CardDescription>Category spend summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {spendData.spendByCategory.map((cat, idx) => (
                          <div key={cat.name} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                              <span className="font-medium">{cat.name}</span>
                            </div>
                            <span className="font-bold">{formatCurrency(cat.value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="supplier" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Spend Distribution</CardTitle>
                      <CardDescription>Spend across top suppliers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={spendData.spendBySupplier} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Bar dataKey="value">
                              {spendData.spendBySupplier.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Ranking</CardTitle>
                      <CardDescription>Top suppliers by spend</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {spendData.spendBySupplier.map((sup, idx) => (
                          <div key={sup.name} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                              <span className="font-medium">{sup.name}</span>
                            </div>
                            <span className="font-bold">{formatCurrency(sup.value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="department" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Spend Analysis</CardTitle>
                      <CardDescription>Spend distribution by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={spendData.spendByDepartment} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Bar dataKey="value">
                              {spendData.spendByDepartment.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Summary</CardTitle>
                      <CardDescription>Key metrics by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {spendData.spendByDepartment.map((dept, idx) => {
                          const percentage = ((dept.value / spendData.totalSpend) * 100).toFixed(1)
                          return (
                            <div key={dept.name} className="space-y-2 border-b pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                  />
                                  <span className="font-medium">{dept.name}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold">{formatCurrency(dept.value)}</div>
                                  <div className="text-xs text-muted-foreground">{percentage}% of total</div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Trends Over Time</CardTitle>
                    <CardDescription>Monthly spend trends by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChartComponent data={spendData.categoryTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatCompactCurrency(value as number)} />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                          <Line type="monotone" dataKey="IT" stroke={COLORS[0]} strokeWidth={2} />
                          <Line type="monotone" dataKey="Marketing" stroke={COLORS[1]} strokeWidth={2} />
                          <Line type="monotone" dataKey="Operations" stroke={COLORS[2]} strokeWidth={2} />
                          <Line type="monotone" dataKey="HR" stroke={COLORS[3]} strokeWidth={2} />
                          <Line type="monotone" dataKey="Finance" stroke={COLORS[4]} strokeWidth={2} />
                        </LineChartComponent>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fastest Growing Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">IT Equipment</div>
                      <p className="text-sm text-muted-foreground">+24% from last period</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Highest Spending Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">IT</div>
                      <p className="text-sm text-muted-foreground">{formatCompactCurrency(spendData.spendByDepartment[0]?.value || 0)} total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Supplier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold">Tech Solutions Inc.</div>
                      <p className="text-sm text-muted-foreground">{formatCompactCurrency(spendData.spendBySupplier[0]?.value || 0)} total spend</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Dialog open={isSaveViewOpen} onOpenChange={setIsSaveViewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save View
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Current View</DialogTitle>
                  <DialogDescription>
                    Save your current filter settings as a named view for quick access
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="view-name">View Name</Label>
                    <input
                      id="view-name"
                      type="text"
                      value={viewName}
                      onChange={(e) => setViewName(e.target.value)}
                      placeholder="My Custom View"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  {savedViews.length > 0 && (
                    <div className="space-y-2">
                      <Label>Saved Views</Label>
                      <div className="space-y-1 max-h-[150px] overflow-y-auto">
                        {savedViews.map((sv, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm p-2 border rounded">
                            <span>{sv.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setTimeframe(sv.timeframe)
                                setSelectedCategory(sv.filters.category)
                                setSelectedSupplier(sv.filters.supplier)
                                setSelectedDepartment(sv.filters.department)
                              }}
                            >
                              Load
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSaveViewOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveView} disabled={!viewName.trim()}>
                    Save View
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

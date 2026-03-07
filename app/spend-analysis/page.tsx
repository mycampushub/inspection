"use client"

import { useState } from "react"
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
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for spend analysis
const spendByCategory = [
  { name: "IT Equipment", value: 4000000 },
  { name: "Office Supplies", value: 1500000 },
  { name: "Professional Services", value: 3000000 },
  { name: "Marketing", value: 2000000 },
  { name: "Facilities", value: 2500000 },
]

const spendBySupplier = [
  { name: "Tech Solutions Inc.", value: 2500000 },
  { name: "Office Depot", value: 1200000 },
  { name: "Consulting Partners", value: 1800000 },
  { name: "Marketing Agency", value: 1500000 },
  { name: "Facilities Management", value: 1200000 },
  { name: "Other Suppliers", value: 2800000 },
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

const spendByDepartment = [
  { name: "IT", value: 5000000 },
  { name: "Marketing", value: 3000000 },
  { name: "Operations", value: 4000000 },
  { name: "HR", value: 1500000 },
  { name: "Finance", value: 2000000 },
]

const categoryTrend = [
  { name: "Jan", IT: 500000, Marketing: 300000, Operations: 400000, HR: 100000, Finance: 150000 },
  { name: "Feb", IT: 550000, Marketing: 320000, Operations: 420000, HR: 110000, Finance: 160000 },
  { name: "Mar", IT: 580000, Marketing: 350000, Operations: 450000, HR: 120000, Finance: 170000 },
  { name: "Apr", IT: 620000, Marketing: 380000, Operations: 480000, HR: 130000, Finance: 180000 },
  { name: "May", IT: 650000, Marketing: 400000, Operations: 500000, HR: 140000, Finance: 190000 },
  { name: "Jun", IT: 680000, Marketing: 420000, Operations: 520000, HR: 150000, Finance: 200000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function SpendAnalysis() {
  const [timeframe, setTimeframe] = useState("year")
  const [view, setView] = useState("overview")

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Spend Analysis</div>
        <div className="ml-auto flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
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
          <Button size="sm" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
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
                      <div className="text-2xl font-bold">$24.5M</div>
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
                      <div className="text-2xl font-bold">15</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500 inline-flex items-center">
                          <ArrowUp className="mr-1 h-3 w-3" />2
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
                      <div className="text-2xl font-bold">248</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-500 inline-flex items-center">
                          <ArrowDown className="mr-1 h-3 w-3" />5
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
                      <div className="text-2xl font-bold">$12,500</div>
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
                              data={spendBySupplier}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {spendBySupplier.map((entry, index) => (
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
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Spend by Department</CardTitle>
                      <CardDescription>Distribution of spend across departments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={spendByDepartment}
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
                            <YAxis type="category" dataKey="name" />
                            <Tooltip
                              formatter={(value) =>
                                new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  maximumFractionDigits: 0,
                                }).format(value as number)
                              }
                            />
                            <Bar dataKey="value" fill="#8884d8">
                              {spendByDepartment.map((entry, index) => (
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
                {/* Category-specific analysis content would go here */}
                <div className="p-8 text-center text-muted-foreground">
                  Category-specific analysis content will be displayed here.
                </div>
              </TabsContent>

              <TabsContent value="supplier" className="space-y-4">
                {/* Supplier-specific analysis content would go here */}
                <div className="p-8 text-center text-muted-foreground">
                  Supplier-specific analysis content will be displayed here.
                </div>
              </TabsContent>

              <TabsContent value="department" className="space-y-4">
                {/* Department-specific analysis content would go here */}
                <div className="p-8 text-center text-muted-foreground">
                  Department-specific analysis content will be displayed here.
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                {/* Trend analysis content would go here */}
                <div className="p-8 text-center text-muted-foreground">
                  Trend analysis content will be displayed here.
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save View
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

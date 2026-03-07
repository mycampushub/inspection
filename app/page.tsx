"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUp,
  Calendar,
  DollarSign,
  FileWarning,
  Filter,
  MoreHorizontal,
  Percent,
  RefreshCw,
  Users,
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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for charts
const spendByCategory = [
  { name: "IT Equipment", value: 4000000 },
  { name: "Office Supplies", value: 1500000 },
  { name: "Professional Services", value: 3000000 },
  { name: "Marketing", value: 2000000 },
  { name: "Facilities", value: 2500000 },
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

const upcomingContracts = [
  {
    id: "CON-2023-001",
    supplier: "Tech Solutions Inc.",
    category: "IT Services",
    value: 250000,
    expiryDate: "2023-12-15",
    daysLeft: 14,
  },
  {
    id: "CON-2023-008",
    supplier: "Office Depot",
    category: "Office Supplies",
    value: 75000,
    expiryDate: "2023-12-22",
    daysLeft: 21,
  },
  {
    id: "CON-2023-015",
    supplier: "Global Logistics",
    category: "Shipping",
    value: 180000,
    expiryDate: "2024-01-05",
    daysLeft: 35,
  },
  {
    id: "CON-2023-023",
    supplier: "Marketing Experts",
    category: "Marketing",
    value: 120000,
    expiryDate: "2024-01-15",
    daysLeft: 45,
  },
]

const budgetUtilization = [
  { department: "IT", allocated: 5000000, utilized: 3750000 },
  { department: "Marketing", allocated: 3000000, utilized: 2400000 },
  { department: "Operations", allocated: 4000000, utilized: 3200000 },
  { department: "HR", allocated: 1500000, utilized: 900000 },
  { department: "Finance", allocated: 2000000, utilized: 1600000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("year")

  return (
    <>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Dashboard</div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">165</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  10
                </span>{" "}
                YTD
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2009</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  289
                </span>{" "}
                YTD
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ICV Certified Suppliers</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2400</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  140
                </span>{" "}
                YTD
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ISO Certified Suppliers</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1242</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  68
                </span>{" "}
                YTD
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers from UAE</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1874</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  209
                </span>{" "}
                YTD
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Procurement Spend (USD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$21,260,445</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  12%
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
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Upcoming Contract Expirations</CardTitle>
              <CardDescription>Contracts expiring in the next 60 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingContracts.map((contract) => (
                  <Link 
                    key={contract.id} 
                    href={`/sourcing-contracts/contracts/${contract.id}`}
                    className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{contract.supplier}</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.category} - {contract.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(contract.value)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contract.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={contract.daysLeft <= 30 ? "destructive" : "outline"}>
                        {contract.daysLeft} days
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/sourcing-contracts/contracts">
                  <FileWarning className="mr-2 h-4 w-4" />
                  View All Expiring Contracts
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization</CardTitle>
              <CardDescription>Department budget allocation and utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetUtilization}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
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
                    <Bar dataKey="allocated" fill="#8884d8" name="Allocated Budget" />
                    <Bar dataKey="utilized" fill="#82ca9d" name="Utilized Budget" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contract Type Distribution</CardTitle>
                <CardDescription>Distribution of contracts by type</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Statement of Work", value: 60 },
                      { name: "Services Agreement", value: 28 },
                      { name: "Master Service", value: 22 },
                      { name: "Licenses/Subscriptions", value: 18 },
                      { name: "Lease Agreement", value: 10 },
                      { name: "Purchase/Blanket", value: 9 },
                      { name: "Warranty", value: 8 },
                      { name: "Engagement Letter", value: 7 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {[
                        { color: "#74c0fc" },
                        { color: "#63e6be" },
                        { color: "#ffd43b" },
                        { color: "#ff8787" },
                        { color: "#b197fc" },
                        { color: "#ffa94d" },
                        { color: "#38d9a9" },
                        { color: "#da77f2" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Deal Value by Category (USD)</CardTitle>
                <CardDescription>Distribution of deal value across categories</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Professional services", value: 160000000 },
                      { name: "IT", value: 135000000 },
                      { name: "Consultancy services", value: 100000000 },
                      { name: "Professional services", value: 95000000 },
                      { name: "Licenses", value: 85000000 },
                      { name: "Leasing & rentals", value: 58000000 },
                      { name: "Building facilities", value: 55000000 },
                      { name: "General office", value: 25000000 },
                      { name: "Food & beverage", value: 15000000 },
                      { name: "Maintenance", value: 10000000 },
                      { name: "Household", value: 5000000 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 1,
                        }).format(value)
                      }
                    />
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
                      {[
                        { color: "#74c0fc" },
                        { color: "#63e6be" },
                        { color: "#ffd43b" },
                        { color: "#ff8787" },
                        { color: "#b197fc" },
                        { color: "#ffa94d" },
                        { color: "#38d9a9" },
                        { color: "#da77f2" },
                        { color: "#ffe066" },
                        { color: "#ff6b6b" },
                        { color: "#5c7cfa" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Jurisdiction Distribution</CardTitle>
                <CardDescription>Distribution of contracts by jurisdiction</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Abu Dhabi Global Markets, United Arab Emirates", value: 35 },
                        { name: "United Arab Emirates", value: 25 },
                        { name: "Abu Dhabi, United Arab Emirates", value: 20 },
                        { name: "Abu Dhabi", value: 15 },
                        { name: "United Kingdom", value: 10 },
                        { name: "United States", value: 5 },
                        { name: "Dubai, United Arab Emirates", value: 4 },
                        { name: "Ireland", value: 3 },
                        { name: "Federal Laws of the UAE", value: 2 },
                        { name: "Spain", value: 1 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => (percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : "")}
                    >
                      {[
                        { color: "#74c0fc" },
                        { color: "#63e6be" },
                        { color: "#ffd43b" },
                        { color: "#ff8787" },
                        { color: "#b197fc" },
                        { color: "#ffa94d" },
                        { color: "#38d9a9" },
                        { color: "#da77f2" },
                        { color: "#ffe066" },
                        { color: "#ff6b6b" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contracts Fulfilling Requirements</CardTitle>
                <CardDescription>Number of contracts meeting specific requirements</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={[
                      { subject: "Has Local Supplier", A: 360 },
                      { subject: "Has Indemnity", A: 300 },
                      { subject: "Renewal Clause", A: 280 },
                      { subject: "Termination Clause", A: 340 },
                      { subject: "Signed By CEO", A: 220 },
                    ]}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 360]} />
                    <Radar name="Requirements" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

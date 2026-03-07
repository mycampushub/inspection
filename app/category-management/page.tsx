"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for categories
const categoryData = [
  {
    id: 1,
    name: "IT Equipment",
    description: "Computer hardware, software, and peripherals",
    spend: 4250000,
    suppliers: 42,
    contracts: 18,
    subcategories: [
      {
        id: 11,
        name: "Hardware",
        description: "Physical computing devices",
        spend: 2800000,
        suppliers: 24,
        contracts: 10,
      },
      {
        id: 12,
        name: "Software",
        description: "Applications and operating systems",
        spend: 950000,
        suppliers: 15,
        contracts: 6,
      },
      {
        id: 13,
        name: "Peripherals",
        description: "External devices and accessories",
        spend: 500000,
        suppliers: 8,
        contracts: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Office Supplies",
    description: "Stationery, paper products, and office consumables",
    spend: 1250000,
    suppliers: 28,
    contracts: 12,
    subcategories: [
      {
        id: 21,
        name: "Stationery",
        description: "Pens, pencils, and writing materials",
        spend: 450000,
        suppliers: 12,
        contracts: 5,
      },
      {
        id: 22,
        name: "Paper Products",
        description: "Printing paper, notebooks, and notepads",
        spend: 550000,
        suppliers: 8,
        contracts: 4,
      },
      {
        id: 23,
        name: "Office Consumables",
        description: "Toner, ink, and other consumable items",
        spend: 250000,
        suppliers: 10,
        contracts: 3,
      },
    ],
  },
  {
    id: 3,
    name: "Professional Services",
    description: "Consulting, legal, and other professional services",
    spend: 3850000,
    suppliers: 35,
    contracts: 22,
    subcategories: [
      {
        id: 31,
        name: "Consulting",
        description: "Business and management consulting",
        spend: 2200000,
        suppliers: 18,
        contracts: 12,
      },
      {
        id: 32,
        name: "Legal Services",
        description: "Legal advice and representation",
        spend: 950000,
        suppliers: 8,
        contracts: 6,
      },
      {
        id: 33,
        name: "Financial Services",
        description: "Accounting, auditing, and financial advisory",
        spend: 700000,
        suppliers: 9,
        contracts: 4,
      },
    ],
  },
  {
    id: 4,
    name: "Facilities",
    description: "Building maintenance, utilities, and facility services",
    spend: 2950000,
    suppliers: 32,
    contracts: 15,
    subcategories: [
      {
        id: 41,
        name: "Maintenance",
        description: "Building repairs and maintenance",
        spend: 1200000,
        suppliers: 14,
        contracts: 6,
      },
      {
        id: 42,
        name: "Utilities",
        description: "Electricity, water, and other utilities",
        spend: 1050000,
        suppliers: 8,
        contracts: 5,
      },
      {
        id: 43,
        name: "Security",
        description: "Security services and equipment",
        spend: 700000,
        suppliers: 10,
        contracts: 4,
      },
    ],
  },
  {
    id: 5,
    name: "Marketing",
    description: "Advertising, promotions, and marketing services",
    spend: 1850000,
    suppliers: 25,
    contracts: 14,
    subcategories: [
      {
        id: 51,
        name: "Advertising",
        description: "Print, digital, and media advertising",
        spend: 850000,
        suppliers: 12,
        contracts: 6,
      },
      {
        id: 52,
        name: "Digital Marketing",
        description: "SEO, social media, and online marketing",
        spend: 650000,
        suppliers: 8,
        contracts: 5,
      },
      {
        id: 53,
        name: "Events",
        description: "Trade shows, conferences, and corporate events",
        spend: 350000,
        suppliers: 5,
        contracts: 3,
      },
    ],
  },
]

// Sample data for charts
const categorySpendData = [
  { name: "IT Equipment", value: 4250000 },
  { name: "Office Supplies", value: 1250000 },
  { name: "Professional Services", value: 3850000 },
  { name: "Facilities", value: 2950000 },
  { name: "Marketing", value: 1850000 },
]

const categorySupplierData = [
  { name: "IT Equipment", suppliers: 42 },
  { name: "Office Supplies", suppliers: 28 },
  { name: "Professional Services", suppliers: 35 },
  { name: "Facilities", suppliers: 32 },
  { name: "Marketing", suppliers: 25 },
]

const categoryTrendData = [
  {
    month: "Jan",
    "IT Equipment": 320000,
    "Office Supplies": 95000,
    "Professional Services": 280000,
    Facilities: 230000,
    Marketing: 140000,
  },
  {
    month: "Feb",
    "IT Equipment": 340000,
    "Office Supplies": 100000,
    "Professional Services": 310000,
    Facilities: 240000,
    Marketing: 150000,
  },
  {
    month: "Mar",
    "IT Equipment": 360000,
    "Office Supplies": 110000,
    "Professional Services": 330000,
    Facilities: 250000,
    Marketing: 160000,
  },
  {
    month: "Apr",
    "IT Equipment": 380000,
    "Office Supplies": 105000,
    "Professional Services": 320000,
    Facilities: 260000,
    Marketing: 155000,
  },
  {
    month: "May",
    "IT Equipment": 400000,
    "Office Supplies": 115000,
    "Professional Services": 340000,
    Facilities: 270000,
    Marketing: 165000,
  },
  {
    month: "Jun",
    "IT Equipment": 420000,
    "Office Supplies": 120000,
    "Professional Services": 350000,
    Facilities: 280000,
    Marketing: 170000,
  },
]

const supplierDistributionData = [
  { name: "Strategic", value: 25 },
  { name: "Preferred", value: 42 },
  { name: "Tactical", value: 95 },
]

const riskDistributionData = [
  { name: "High", value: 18 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 109 },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]
const RISK_COLORS = ["#ef4444", "#f59e0b", "#10b981"]

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format number with commas
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value)
}

export default function CategoryManagement() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)

  // Total spend across all categories
  const totalSpend = categoryData.reduce((sum, category) => sum + category.spend, 0)

  // Total suppliers across all categories (note: this might count duplicates)
  const totalSuppliers = categoryData.reduce((sum, category) => sum + category.suppliers, 0)

  // Total contracts across all categories
  const totalContracts = categoryData.reduce((sum, category) => sum + category.contracts, 0)

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  // Filter categories based on search term
  const filteredCategories = categoryData.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle category selection for details view
  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category)
    setActiveTab("details")
  }

  // Custom tooltip formatter for charts
  const currencyTooltipFormatter = (value: number) => formatCurrency(value)
  const supplierTooltipFormatter = (value: number) => `${value} suppliers`

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {categoryData.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)} subcategories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpend)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {totalContracts} contracts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalSuppliers)}</div>
            <p className="text-xs text-muted-foreground mt-1">May include duplicates across categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hierarchy">Category Hierarchy</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedCategory}>
            Category Details
          </TabsTrigger>
          <TabsTrigger value="analysis">Spend Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Spend Distribution</CardTitle>
                <CardDescription>Total spend by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpendData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categorySpendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={currencyTooltipFormatter} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Supplier Distribution</CardTitle>
                <CardDescription>Number of suppliers by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categorySupplierData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={supplierTooltipFormatter} />
                      <Bar dataKey="suppliers" fill="#8884d8">
                        {categorySupplierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Category Spend Trends</CardTitle>
              <CardDescription>Monthly spend by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    "IT Equipment": {
                      label: "IT Equipment",
                      color: "hsl(var(--chart-1))",
                    },
                    "Office Supplies": {
                      label: "Office Supplies",
                      color: "hsl(var(--chart-2))",
                    },
                    "Professional Services": {
                      label: "Professional Services",
                      color: "hsl(var(--chart-3))",
                    },
                    Facilities: {
                      label: "Facilities",
                      color: "hsl(var(--chart-4))",
                    },
                    Marketing: {
                      label: "Marketing",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={categoryTrendData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="IT Equipment" stroke="var(--color-IT Equipment)" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="Office Supplies"
                        stroke="var(--color-Office Supplies)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Professional Services"
                        stroke="var(--color-Professional Services)"
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="Facilities" stroke="var(--color-Facilities)" strokeWidth={2} />
                      <Line type="monotone" dataKey="Marketing" stroke="var(--color-Marketing)" strokeWidth={2} />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Tier Distribution</CardTitle>
                <CardDescription>Suppliers by strategic importance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={supplierDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {supplierDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={supplierTooltipFormatter} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Suppliers by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={supplierTooltipFormatter} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Category Hierarchy Tab */}
        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Category Hierarchy</CardTitle>
                <CardDescription>View and manage category structure</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Spend</TableHead>
                      <TableHead className="text-right">Suppliers</TableHead>
                      <TableHead className="text-right">Contracts</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No categories found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((category) => (
                        <>
                          <TableRow key={category.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium" onClick={() => toggleCategory(category.id)}>
                              <div className="flex items-center">
                                {expandedCategories.includes(category.id) ? (
                                  <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                                )}
                                {category.name}
                              </div>
                            </TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(category.spend)}</TableCell>
                            <TableCell className="text-right">{category.suppliers}</TableCell>
                            <TableCell className="text-right">{category.contracts}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleCategorySelect(category)}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedCategory(category)
                                      setIsEditCategoryOpen(true)
                                    }}
                                  >
                                    Edit Category
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedCategory(category)
                                      setIsAddSubcategoryOpen(true)
                                    }}
                                  >
                                    Add Subcategory
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Delete Category</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                          {expandedCategories.includes(category.id) &&
                            category.subcategories?.map((subcategory) => (
                              <TableRow key={subcategory.id} className="bg-muted/30">
                                <TableCell className="font-medium">
                                  <div className="flex items-center pl-6">{subcategory.name}</div>
                                </TableCell>
                                <TableCell>{subcategory.description}</TableCell>
                                <TableCell className="text-right">{formatCurrency(subcategory.spend)}</TableCell>
                                <TableCell className="text-right">{subcategory.suppliers}</TableCell>
                                <TableCell className="text-right">{subcategory.contracts}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>View Details</DropdownMenuItem>
                                      <DropdownMenuItem>Edit Subcategory</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive">
                                        Delete Subcategory
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                        </>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Details Tab */}
        <TabsContent value="details" className="space-y-4">
          {selectedCategory && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditCategoryOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Category
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsAddSubcategoryOpen(true)}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Add Subcategory
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Category Spend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(selectedCategory.spend)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((selectedCategory.spend / totalSpend) * 100).toFixed(1)}% of total spend
                    </p>
                    <Progress value={(selectedCategory.spend / totalSpend) * 100} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Suppliers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCategory.suppliers}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        View Suppliers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Contracts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCategory.contracts}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <FilePlus className="h-3 w-3 mr-1" />
                        View Contracts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                        <p>{selectedCategory.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Category Manager</h4>
                        <p>John Smith</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                        <p>April 15, 2023</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline">Strategic</Badge>
                          <Badge variant="outline">High Value</Badge>
                          <Badge variant="outline">Core Business</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Subcategories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCategory.subcategories?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCategory.subcategories.map((subcategory: any) => (
                          <div key={subcategory.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{subcategory.name}</h4>
                                <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Subcategory</DropdownMenuItem>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Delete Subcategory</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div>
                                <p className="text-xs text-muted-foreground">Spend</p>
                                <p className="font-medium">{formatCurrency(subcategory.spend)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Suppliers</p>
                                <p className="font-medium">{subcategory.suppliers}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Contracts</p>
                                <p className="font-medium">{subcategory.contracts}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No subcategories found.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setIsAddSubcategoryOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Subcategory
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Spend Trend</CardTitle>
                  <CardDescription>Monthly spend for {selectedCategory.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        [selectedCategory.name]: {
                          label: selectedCategory.name,
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={categoryTrendData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey={selectedCategory.name}
                            stroke={`var(--color-${selectedCategory.name})`}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Spend Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Spend by Category</CardTitle>
                <CardDescription>Total spend distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpendData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categorySpendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={currencyTooltipFormatter} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>Spend vs. Suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Spend</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                      <TableHead className="text-right">Suppliers</TableHead>
                      <TableHead className="text-right">Avg. Spend/Supplier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(category.spend)}</TableCell>
                        <TableCell className="text-right">
                          {((category.spend / totalSpend) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right">{category.suppliers}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.spend / category.suppliers)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spend Trends</CardTitle>
              <CardDescription>Compare spend across categories over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    "IT Equipment": {
                      label: "IT Equipment",
                      color: "hsl(var(--chart-1))",
                    },
                    "Office Supplies": {
                      label: "Office Supplies",
                      color: "hsl(var(--chart-2))",
                    },
                    "Professional Services": {
                      label: "Professional Services",
                      color: "hsl(var(--chart-3))",
                    },
                    Facilities: {
                      label: "Facilities",
                      color: "hsl(var(--chart-4))",
                    },
                    Marketing: {
                      label: "Marketing",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={categoryTrendData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="IT Equipment" stroke="var(--color-IT Equipment)" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="Office Supplies"
                        stroke="var(--color-Office Supplies)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Professional Services"
                        stroke="var(--color-Professional Services)"
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="Facilities" stroke="var(--color-Facilities)" strokeWidth={2} />
                      <Line type="monotone" dataKey="Marketing" stroke="var(--color-Marketing)" strokeWidth={2} />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new procurement category to organize your spend.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="Enter category name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter category description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">Category Manager</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="michael-brown">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="Enter tags separated by commas" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddCategoryOpen(false)}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the details for {selectedCategory?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input id="edit-name" defaultValue={selectedCategory?.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" defaultValue={selectedCategory?.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-manager">Category Manager</Label>
              <Select defaultValue="john-smith">
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="michael-brown">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input id="edit-tags" defaultValue="Strategic, High Value, Core Business" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditCategoryOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>Create a new subcategory under {selectedCategory?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sub-name">Subcategory Name</Label>
              <Input id="sub-name" placeholder="Enter subcategory name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sub-description">Description</Label>
              <Textarea id="sub-description" placeholder="Enter subcategory description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sub-manager">Subcategory Manager</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="michael-brown">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddSubcategoryOpen(false)}>Create Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

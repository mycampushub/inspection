"use client"

import { useState, useEffect, useCallback, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { localCategories } from "../lib/local-data"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Progress } from "../components/ui/progress"
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

// Types
interface Category {
  id: number
  name: string
  description: string
  spend: number
  suppliers: number
  contracts: number
  categoryManager?: string
  lastUpdated?: string
  tags?: string[]
  subcategories: Subcategory[]
}

interface Subcategory {
  id: number
  name: string
  description: string
  spend: number
  suppliers: number
  contracts: number
}

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
  const router = useNavigate()
  
  // State
  const [categories, setCategories] = useState<Category[]>(localCategories())
  const [isLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  
  // Dialog states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false)
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false)
  const [isDeleteSubcategoryOpen, setIsDeleteSubcategoryOpen] = useState(false)
  const [isViewSubcategoryDetailsOpen, setIsViewSubcategoryDetailsOpen] = useState(false)
  
  // Selected items
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  
  // Form states
  const [addCategoryForm, setAddCategoryForm] = useState({
    name: "",
    description: "",
    categoryManager: "",
    tags: "",
  })
  const [editCategoryForm, setEditCategoryForm] = useState({
    name: "",
    description: "",
    categoryManager: "",
    tags: "",
  })
  const [addSubcategoryForm, setAddSubcategoryForm] = useState({
    name: "",
    description: "",
    spend: "",
    suppliers: "",
    contracts: "",
  })
  const [editSubcategoryForm, setEditSubcategoryForm] = useState({
    name: "",
    description: "",
    spend: "",
    suppliers: "",
    contracts: "",
  })

  // No need to fetch - using local data
  const fetchCategories = useCallback(() => {
    // Filter local data based on search term
    if (searchTerm) {
      const filtered = localCategories().filter((cat: Category) => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setCategories(filtered)
    } else {
      setCategories(localCategories())
    }
  }, [searchTerm])

  // Fetch category by ID
  const fetchCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`)
      const data = await response.json()
      if (data.success) {
        return data.data
      }
    } catch (error) {
      console.error("Failed to fetch category:", error)
    }
    return null
  }

  // Create category
  const createCategory = async () => {
    try {
      const tags = addCategoryForm.tags ? addCategoryForm.tags.split(",").map((t) => t.trim()) : []
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addCategoryForm.name,
          description: addCategoryForm.description,
          categoryManager: addCategoryForm.categoryManager || undefined,
          tags,
          spend: 0,
          suppliers: 0,
          contracts: 0,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAddCategoryOpen(false)
        setAddCategoryForm({ name: "", description: "", categoryManager: "", tags: "" })
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  // Update category
  const updateCategory = async () => {
    if (!selectedCategory) return
    try {
      const tags = editCategoryForm.tags ? editCategoryForm.tags.split(",").map((t) => t.trim()) : []
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCategoryForm.name,
          description: editCategoryForm.description,
          categoryManager: editCategoryForm.categoryManager || undefined,
          tags,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setIsEditCategoryOpen(false)
        fetchCategories()
        const updatedCategory = await fetchCategory(selectedCategory.id)
        if (updatedCategory) {
          setSelectedCategory(updatedCategory)
        }
      }
    } catch (error) {
      console.error("Failed to update category:", error)
    }
  }

  // Delete category
  const deleteCategory = async () => {
    if (!selectedCategory) return
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        setIsDeleteCategoryOpen(false)
        setSelectedCategory(null)
        setActiveTab("overview")
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  // Create subcategory
  const createSubcategory = async () => {
    if (!selectedCategory) return
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}/subcategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addSubcategoryForm.name,
          description: addSubcategoryForm.description,
          spend: parseFloat(addSubcategoryForm.spend) || 0,
          suppliers: parseInt(addSubcategoryForm.suppliers) || 0,
          contracts: parseInt(addSubcategoryForm.contracts) || 0,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAddSubcategoryOpen(false)
        setAddSubcategoryForm({ name: "", description: "", spend: "", suppliers: "", contracts: "" })
        fetchCategories()
        const updatedCategory = await fetchCategory(selectedCategory.id)
        if (updatedCategory) {
          setSelectedCategory(updatedCategory)
        }
      }
    } catch (error) {
      console.error("Failed to create subcategory:", error)
    }
  }

  // Update subcategory
  const updateSubcategory = async () => {
    if (!selectedCategory || !selectedSubcategory) return
    try {
      const response = await fetch(
        `/api/categories/${selectedCategory.id}/subcategories/${selectedSubcategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editSubcategoryForm.name,
            description: editSubcategoryForm.description,
            spend: parseFloat(editSubcategoryForm.spend) || 0,
            suppliers: parseInt(editSubcategoryForm.suppliers) || 0,
            contracts: parseInt(editSubcategoryForm.contracts) || 0,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsEditSubcategoryOpen(false)
        fetchCategories()
        const updatedCategory = await fetchCategory(selectedCategory.id)
        if (updatedCategory) {
          setSelectedCategory(updatedCategory)
        }
      }
    } catch (error) {
      console.error("Failed to update subcategory:", error)
    }
  }

  // Delete subcategory
  const deleteSubcategory = async () => {
    if (!selectedCategory || !selectedSubcategory) return
    try {
      const response = await fetch(
        `/api/categories/${selectedCategory.id}/subcategories/${selectedSubcategory.id}`,
        {
          method: "DELETE",
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsDeleteSubcategoryOpen(false)
        setSelectedSubcategory(null)
        fetchCategories()
        const updatedCategory = await fetchCategory(selectedCategory.id)
        if (updatedCategory) {
          setSelectedCategory(updatedCategory)
        }
      }
    } catch (error) {
      console.error("Failed to delete subcategory:", error)
    }
  }

  // Effects - update categories when search term changes
  // eslint-disable-next-line react-hooks/purity
  useEffect(() => {
    fetchCategories()
  }, [searchTerm, fetchCategories])

  // Calculate totals
  const totalSpend = categories.reduce((sum, category) => sum + category.spend, 0)
  const totalSuppliers = categories.reduce((sum, category) => sum + category.suppliers, 0)
  const totalContracts = categories.reduce((sum, category) => sum + category.contracts, 0)

  // Chart data
  const categorySpendData = categories.map((cat) => ({ name: cat.name, value: cat.spend }))
  const categorySupplierData = categories.map((cat) => ({ name: cat.name, suppliers: cat.suppliers }))
  
  const categoryTrendData = [
    { month: "Jan", ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.spend / 12 }), {}) },
    { month: "Feb", ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.spend / 12 }), {}) },
    { month: "Mar", ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.spend / 12 }), {}) },
    { month: "Apr", ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.spend / 12 }), {}) },
    { month: "May", ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.spend / 12 }), {}) },
    { month: "Jun", ...categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.spend / 12 }), {}) },
  ]

  const supplierDistributionData = [
    { name: "Strategic", value: categories.filter((c) => c.categoryManager).length },
    { name: "Preferred", value: Math.floor(categories.length * 0.6) },
    { name: "Tactical", value: Math.floor(categories.length * 0.3) },
  ]

  const riskDistributionData = [
    { name: "High", value: 1 },
    { name: "Medium", value: 2 },
    { name: "Low", value: categories.length - 3 },
  ]

  // Handlers
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setActiveTab("details")
  }

  const handleAddCategoryClick = () => {
    setAddCategoryForm({ name: "", description: "", categoryManager: "", tags: "" })
    setIsAddCategoryOpen(true)
  }

  const handleEditCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setEditCategoryForm({
      name: category.name,
      description: category.description,
      categoryManager: category.categoryManager || "",
      tags: category.tags?.join(", ") || "",
    })
    setIsEditCategoryOpen(true)
  }

  const handleAddSubcategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setAddSubcategoryForm({ name: "", description: "", spend: "", suppliers: "", contracts: "" })
    setIsAddSubcategoryOpen(true)
  }

  const handleDeleteCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteCategoryOpen(true)
  }

  const handleEditSubcategoryClick = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    setEditSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description,
      spend: subcategory.spend.toString(),
      suppliers: subcategory.suppliers.toString(),
      contracts: subcategory.contracts.toString(),
    })
    setIsEditSubcategoryOpen(true)
  }

  const handleViewSubcategoryDetailsClick = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    setIsViewSubcategoryDetailsOpen(true)
  }

  const handleDeleteSubcategoryClick = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    setIsDeleteSubcategoryOpen(true)
  }

  const handleViewSuppliers = (category: Category) => {
    router.push(`/supplier-management/directory?category=${encodeURIComponent(category.name)}`)
  }

  const handleViewContracts = (category: Category) => {
    router.push(`/sourcing-contracts/contracts?category=${encodeURIComponent(category.name)}`)
  }

  const currencyTooltipFormatter = (value: unknown) => formatCurrency((value as number) || 0)
  const supplierTooltipFormatter = (value: unknown) => `${(value as number) || 0} suppliers`

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-muted-foreground">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddCategoryClick}>
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
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)} subcategories
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
                        label={({ name, percent }: { name: string; percent: number }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
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
                  config={categories.reduce((config, cat, idx) => ({
                    ...config,
                    [cat.name]: {
                      label: cat.name,
                      color: `hsl(var(--chart-${(idx % 5) + 1}))`,
                    },
                  }), {} as Record<string, { label: string; color: string }>)}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={categoryTrendData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {categories.map((cat, idx) => (
                        <Line
                          key={cat.id}
                          type="monotone"
                          dataKey={cat.name}
                          stroke={`hsl(var(--chart-${(idx % 5) + 1}))`}
                          strokeWidth={2}
                        />
                      ))}
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
                        label={({ name, percent }: { name: string; percent: number }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
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
                        label={({ name, percent }: { name: string; percent: number }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
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
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <Fragment key={category.id}>
                          <TableRow className="cursor-pointer hover:bg-muted/50">
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
                                  <DropdownMenuItem onClick={() => handleEditCategoryClick(category)}>
                                    Edit Category
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAddSubcategoryClick(category)}>
                                    Add Subcategory
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteCategoryClick(category)}
                                    className="text-destructive"
                                  >
                                    Delete Category
                                  </DropdownMenuItem>
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
                                      <DropdownMenuItem
                                        onClick={() => handleViewSubcategoryDetailsClick(category, subcategory)}
                                      >
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleEditSubcategoryClick(category, subcategory)}
                                      >
                                        Edit Subcategory
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteSubcategoryClick(category, subcategory)}
                                        className="text-destructive"
                                      >
                                        Delete Subcategory
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                        </Fragment>
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
                  <Button variant="outline" size="sm" onClick={() => handleEditCategoryClick(selectedCategory)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Category
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSubcategoryClick(selectedCategory)}
                  >
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleViewSuppliers(selectedCategory)}
                      >
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleViewContracts(selectedCategory)}
                      >
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
                        <p>{selectedCategory.categoryManager || "Not assigned"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                        <p>{selectedCategory.lastUpdated || "Unknown"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedCategory.tags && selectedCategory.tags.length > 0 ? (
                            selectedCategory.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No tags</span>
                          )}
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
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {selectedCategory.subcategories.map((subcategory) => (
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
                                  <DropdownMenuItem
                                    onClick={() => handleViewSubcategoryDetailsClick(selectedCategory, subcategory)}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditSubcategoryClick(selectedCategory, subcategory)}
                                  >
                                    Edit Subcategory
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteSubcategoryClick(selectedCategory, subcategory)}
                                    className="text-destructive"
                                  >
                                    Delete Subcategory
                                  </DropdownMenuItem>
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
                          onClick={() => handleAddSubcategoryClick(selectedCategory)}
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
                        label={({ name, percent }: { name: string; percent: number }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
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
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(category.spend)}</TableCell>
                        <TableCell className="text-right">
                          {((category.spend / totalSpend) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right">{category.suppliers}</TableCell>
                        <TableCell className="text-right">
                          {category.suppliers > 0 ? formatCurrency(category.spend / category.suppliers) : "$0"}
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
                  config={categories.reduce((config, cat, idx) => ({
                    ...config,
                    [cat.name]: {
                      label: cat.name,
                      color: `hsl(var(--chart-${(idx % 5) + 1}))`,
                    },
                  }), {} as Record<string, { label: string; color: string }>)}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={categoryTrendData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {categories.map((cat, idx) => (
                        <Line
                          key={cat.id}
                          type="monotone"
                          dataKey={cat.name}
                          stroke={`hsl(var(--chart-${(idx % 5) + 1}))`}
                          strokeWidth={2}
                        />
                      ))}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new procurement category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name *</Label>
              <Input
                id="add-name"
                value={addCategoryForm.name}
                onChange={(e) => setAddCategoryForm({ ...addCategoryForm, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description *</Label>
              <Textarea
                id="add-description"
                value={addCategoryForm.description}
                onChange={(e) => setAddCategoryForm({ ...addCategoryForm, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-manager">Category Manager</Label>
              <Input
                id="add-manager"
                value={addCategoryForm.categoryManager}
                onChange={(e) => setAddCategoryForm({ ...addCategoryForm, categoryManager: e.target.value })}
                placeholder="Manager name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-tags">Tags (comma-separated)</Label>
              <Input
                id="add-tags"
                value={addCategoryForm.tags}
                onChange={(e) => setAddCategoryForm({ ...addCategoryForm, tags: e.target.value })}
                placeholder="e.g., Strategic, High Value, Core Business"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createCategory} disabled={!addCategoryForm.name || !addCategoryForm.description}>
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editCategoryForm.name}
                onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={editCategoryForm.description}
                onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-manager">Category Manager</Label>
              <Input
                id="edit-manager"
                value={editCategoryForm.categoryManager}
                onChange={(e) => setEditCategoryForm({ ...editCategoryForm, categoryManager: e.target.value })}
                placeholder="Manager name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editCategoryForm.tags}
                onChange={(e) => setEditCategoryForm({ ...editCategoryForm, tags: e.target.value })}
                placeholder="e.g., Strategic, High Value, Core Business"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateCategory} disabled={!editCategoryForm.name || !editCategoryForm.description}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              All subcategories will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Add a new subcategory to "{selectedCategory?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-sub-name">Name *</Label>
              <Input
                id="add-sub-name"
                value={addSubcategoryForm.name}
                onChange={(e) => setAddSubcategoryForm({ ...addSubcategoryForm, name: e.target.value })}
                placeholder="Subcategory name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-sub-description">Description</Label>
              <Textarea
                id="add-sub-description"
                value={addSubcategoryForm.description}
                onChange={(e) => setAddSubcategoryForm({ ...addSubcategoryForm, description: e.target.value })}
                placeholder="Subcategory description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-sub-spend">Spend</Label>
                <Input
                  id="add-sub-spend"
                  type="number"
                  value={addSubcategoryForm.spend}
                  onChange={(e) => setAddSubcategoryForm({ ...addSubcategoryForm, spend: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-sub-suppliers">Suppliers</Label>
                <Input
                  id="add-sub-suppliers"
                  type="number"
                  value={addSubcategoryForm.suppliers}
                  onChange={(e) => setAddSubcategoryForm({ ...addSubcategoryForm, suppliers: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-sub-contracts">Contracts</Label>
                <Input
                  id="add-sub-contracts"
                  type="number"
                  value={addSubcategoryForm.contracts}
                  onChange={(e) => setAddSubcategoryForm({ ...addSubcategoryForm, contracts: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createSubcategory} disabled={!addSubcategoryForm.name}>
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>Update subcategory information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sub-name">Name *</Label>
              <Input
                id="edit-sub-name"
                value={editSubcategoryForm.name}
                onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, name: e.target.value })}
                placeholder="Subcategory name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sub-description">Description</Label>
              <Textarea
                id="edit-sub-description"
                value={editSubcategoryForm.description}
                onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, description: e.target.value })}
                placeholder="Subcategory description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sub-spend">Spend</Label>
                <Input
                  id="edit-sub-spend"
                  type="number"
                  value={editSubcategoryForm.spend}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, spend: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sub-suppliers">Suppliers</Label>
                <Input
                  id="edit-sub-suppliers"
                  type="number"
                  value={editSubcategoryForm.suppliers}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, suppliers: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sub-contracts">Contracts</Label>
                <Input
                  id="edit-sub-contracts"
                  type="number"
                  value={editSubcategoryForm.contracts}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, contracts: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateSubcategory} disabled={!editSubcategoryForm.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subcategory Confirmation Dialog */}
      <Dialog open={isDeleteSubcategoryOpen} onOpenChange={setIsDeleteSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSubcategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSubcategory}>
              Delete Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Subcategory Details Dialog */}
      <Dialog open={isViewSubcategoryDetailsOpen} onOpenChange={setIsViewSubcategoryDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSubcategory?.name}</DialogTitle>
            <DialogDescription>Subcategory details</DialogDescription>
          </DialogHeader>
          {selectedSubcategory && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedSubcategory.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Spend</Label>
                  <p className="mt-1 font-medium">{formatCurrency(selectedSubcategory.spend)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Suppliers</Label>
                  <p className="mt-1 font-medium">{selectedSubcategory.suppliers}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contracts</Label>
                  <p className="mt-1 font-medium">{selectedSubcategory.contracts}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewSubcategoryDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

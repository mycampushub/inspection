"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { localSuppliers } from "@/lib/local-data"
import {
  AlertCircle,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Globe,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Star,
  ThumbsUp,
  Truck,
  Users,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface Supplier {
  id: string
  name: string
  type: string
  category: string
  status: string
  tier: string
  riskLevel: string
  rating: number
  totalSpend: number
  contractCount: number
  performanceScore: number
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  registrationDate: string
  certifications: string[]
}

interface SupplierCard {
  id: string
  name: string
  logo: string
  category: string
  status: string
  tier: string
  location: string
  contactName: string
  contactEmail: string
  contactPhone: string
  performanceScore: number
  riskLevel: string
  activeContracts: number
  totalSpend: number
  onTimeDelivery: number
  qualityScore: number
  responseTime: number
  certifications: string[]
}

// Sample data for recent activities
const recentActivities = [
  {
    id: 1,
    supplier: "Tech Solutions Inc.",
    action: "Contract Renewed",
    date: "2023-12-01",
    details: "IT Support Services contract renewed for 12 months",
  },
  {
    id: 2,
    supplier: "Global Logistics Partners",
    action: "Performance Review",
    date: "2023-11-28",
    details: "Quarterly performance review completed with score of 85/100",
  },
  {
    id: 3,
    supplier: "Manufacturing Solutions Co.",
    action: "Risk Assessment",
    date: "2023-11-25",
    details: "Risk level increased from Low to Medium due to financial concerns",
  },
  {
    id: 4,
    supplier: "Office Depot",
    action: "Order Issue",
    date: "2023-11-20",
    details: "Late delivery reported and resolved with supplier",
  },
  {
    id: 5,
    supplier: "Professional Services Group",
    action: "New Contract",
    date: "2023-11-15",
    details: "New consulting services contract signed worth $350,000",
  },
]

// Sample data for top performing suppliers
const topPerformers = [
  {
    id: "SUP-006",
    name: "Professional Services Group",
    category: "Consulting",
    performanceScore: 94,
    trend: "up",
  },
  {
    id: "SUP-001",
    name: "Tech Solutions Inc.",
    category: "IT Services",
    performanceScore: 92,
    trend: "up",
  },
  {
    id: "SUP-004",
    name: "Marketing Experts Ltd.",
    category: "Marketing Services",
    performanceScore: 90,
    trend: "stable",
  },
  {
    id: "SUP-002",
    name: "Office Depot",
    category: "Office Supplies",
    performanceScore: 88,
    trend: "up",
  },
]

// Sample data for suppliers by category
const suppliersByCategory = [
  { name: "IT Services", count: 45 },
  { name: "Office Supplies", count: 28 },
  { name: "Logistics", count: 22 },
  { name: "Marketing Services", count: 18 },
  { name: "Manufacturing", count: 15 },
  { name: "Consulting", count: 12 },
  { name: "Facilities", count: 10 },
  { name: "HR Services", count: 8 },
]

// Sample data for suppliers by location
const suppliersByLocation = [
  { name: "United States", count: 85 },
  { name: "Europe", count: 42 },
  { name: "Asia Pacific", count: 38 },
  { name: "Canada", count: 15 },
  { name: "Latin America", count: 12 },
  { name: "Middle East", count: 8 },
  { name: "Africa", count: 5 },
]

export default function SupplierManagement() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [suppliers, setSuppliers] = useState<SupplierCard[]>(localSuppliers.map((s) => ({
    id: s.id,
    name: s.name,
    logo: "",
    category: s.category,
    status: s.status,
    tier: s.tier,
    location: `${s.city}, ${s.country}`,
    contactName: s.contactPerson,
    contactEmail: s.email,
    contactPhone: s.phone,
    performanceScore: (s.onTimeDelivery + s.qualityScore + s.communicationScore) / 3,
    riskLevel: s.riskLevel,
    activeContracts: s.contracts.length,
    totalSpend: s.totalSpend,
    onTimeDelivery: s.onTimeDelivery,
    qualityScore: s.qualityScore,
    responseTime: Math.floor(12 + Math.random() * 48),
    certifications: s.certifications,
  })))
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")

  // Dialog states
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false)
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false)
  const [isContactSupplierOpen, setIsContactSupplierOpen] = useState(false)
  const [isRiskAssessmentOpen, setIsRiskAssessmentOpen] = useState(false)
  const [isPerformanceHistoryOpen, setIsPerformanceHistoryOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  // Selected supplier for dialogs
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierCard | null>(null)

  // Form states
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    category: "",
    status: "Active",
    tier: "Tactical",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  })
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })
  const [riskForm, setRiskForm] = useState({
    financialRisk: "Medium",
    operationalRisk: "Low",
    complianceRisk: "Low",
    notes: "",
  })

  // Filter suppliers from local data
  const fetchSuppliers = () => {
    setLoading(true)
    try {
      let filtered = localSuppliers.map((s) => ({
        id: s.id,
        name: s.name || "Unknown",
        logo: "",
        category: s.category || "Other",
        status: s.status || "Active",
        tier: s.tier || "Tier 3",
        location: `${s.city || ""}, ${s.country || ""}`,
        contactName: s.contactPerson || "",
        contactEmail: s.email || "",
        contactPhone: s.phone || "",
        performanceScore: Math.round(((s.onTimeDelivery || 0) + (s.qualityScore || 0) + (s.communicationScore || 0)) / 3),
        riskLevel: s.riskLevel || "Low",
        activeContracts: s.contracts?.length || 0,
        totalSpend: s.totalSpend || 0,
        onTimeDelivery: s.onTimeDelivery || 0,
        qualityScore: s.qualityScore || 0,
        responseTime: Math.floor(12 + Math.random() * 48),
        certifications: s.certifications || [],
      }))

      // Apply filters
      if (categoryFilter !== "all") {
        filtered = filtered.filter(s => s.category === categoryFilter)
      }
      if (statusFilter !== "all") {
        filtered = filtered.filter(s => s.status === statusFilter)
      }
      if (tierFilter !== "all") {
        filtered = filtered.filter(s => s.tier === tierFilter)
      }
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (s) =>
            (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.contactPerson || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setSuppliers(filtered)
    } catch (error) {
      console.error("Failed to filter suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [categoryFilter, statusFilter, tierFilter, searchQuery])

  // Button handlers
  const handleRefresh = () => {
    fetchSuppliers()
  }

  const handleAddSupplier = () => {
    setSupplierForm({
      name: "",
      category: "",
      status: "Active",
      tier: "Tactical",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    })
    setIsAddSupplierOpen(true)
  }

  const handleEditSupplier = (supplier: SupplierCard) => {
    setSelectedSupplier(supplier)
    setSupplierForm({
      name: supplier.name,
      category: supplier.category,
      status: supplier.status === "Approved" ? "Active" : supplier.status,
      tier: supplier.tier,
      contactPerson: supplier.contactName,
      email: supplier.contactEmail,
      phone: supplier.contactPhone,
      address: "",
      city: supplier.location.split(", ")[0] || "",
      country: supplier.location.split(", ")[1] || "",
    })
    setIsEditSupplierOpen(true)
  }

  const handleViewProfile = (supplier: SupplierCard) => {
    setSelectedSupplier(supplier)
    setIsViewProfileOpen(true)
  }

  const handleViewDetails = (supplier: SupplierCard) => {
    setSelectedSupplier(supplier)
    setIsViewDetailsOpen(true)
  }

  const handleViewContracts = (supplier: SupplierCard) => {
    // Navigate to contracts page with supplier filter
    window.location.href = `/sourcing-contracts/contracts?supplierId=${supplier.id}`
  }

  const handlePerformanceHistory = (supplier: SupplierCard) => {
    setSelectedSupplier(supplier)
    setIsPerformanceHistoryOpen(true)
  }

  const handleRiskAssessment = (supplier: SupplierCard) => {
    setSelectedSupplier(supplier)
    setRiskForm({
      financialRisk: supplier.riskLevel,
      operationalRisk: "Low",
      complianceRisk: "Low",
      notes: "",
    })
    setIsRiskAssessmentOpen(true)
  }

  const handleContactSupplier = (supplier: SupplierCard) => {
    setSelectedSupplier(supplier)
    setContactForm({
      subject: "",
      message: "",
    })
    setIsContactSupplierOpen(true)
  }

  // Form submission handlers
  const handleSubmitAddSupplier = async () => {
    try {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...supplierForm,
          riskLevel: "Low",
          rating: 85,
          totalSpend: 0,
          contractCount: 0,
          performanceScore: 80,
          registrationDate: new Date().toISOString().split("T")[0],
          certifications: [],
        }),
      })

      if (response.ok) {
        setIsAddSupplierOpen(false)
        fetchSuppliers()
      }
    } catch (error) {
      console.error("Failed to create supplier:", error)
    }
  }

  const handleSubmitEditSupplier = async () => {
    if (!selectedSupplier) return

    try {
      const response = await fetch(`/api/suppliers/${selectedSupplier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...supplierForm,
          riskLevel: selectedSupplier.riskLevel,
          rating: selectedSupplier.performanceScore,
          totalSpend: selectedSupplier.totalSpend,
          contractCount: selectedSupplier.activeContracts,
          performanceScore: selectedSupplier.performanceScore,
          registrationDate: new Date().toISOString().split("T")[0],
          certifications: selectedSupplier.certifications,
        }),
      })

      if (response.ok) {
        setIsEditSupplierOpen(false)
        fetchSuppliers()
      }
    } catch (error) {
      console.error("Failed to update supplier:", error)
    }
  }

  const handleSubmitContact = () => {
    alert(`Message sent to ${selectedSupplier?.contactEmail}`)
    setIsContactSupplierOpen(false)
    setContactForm({ subject: "", message: "" })
  }

  const handleSubmitRisk = () => {
    alert(`Risk assessment saved for ${selectedSupplier?.name}`)
    setIsRiskAssessmentOpen(false)
  }

  // Get filtered suppliers based on search query (client-side filtering for demo)
  const filteredSuppliers = suppliers.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contactPerson || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats from real data
  const totalSuppliers = suppliers.length
  const averagePerformance = suppliers.length > 0
    ? Math.round(suppliers.reduce((sum, s) => sum + s.performanceScore, 0) / suppliers.length)
    : 0
  const highRiskCount = suppliers.filter((s) => s.riskLevel === "High").length
  const activeContracts = suppliers.reduce((sum, s) => sum + (s.activeContracts || 0), 0)

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Supplier Management</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={handleAddSupplier}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="directory">Directory</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risk">Risk Management</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSuppliers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <Check className="mr-1 h-3 w-3" />
                      Active suppliers
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <Check className="mr-1 h-3 w-3" />
                      Ongoing contracts
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averagePerformance}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <Check className="mr-1 h-3 w-3" />
                      Overall score
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Suppliers</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highRiskCount}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 inline-flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Requires attention
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Supplier Activities</CardTitle>
                  <CardDescription>Latest updates and changes to supplier information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.supplier}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                activity.action.includes("Contract")
                                  ? "success"
                                  : activity.action.includes("Issue")
                                    ? "destructive"
                                    : activity.action.includes("Risk")
                                      ? "warning"
                                      : "outline"
                              }
                            >
                              {activity.action}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.details}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/supplier-management/directory">
                      View All Suppliers
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Performing Suppliers</CardTitle>
                  <CardDescription>Suppliers with the highest performance scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">{supplier.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center gap-1 ${
                              supplier.trend === "up"
                                ? "text-green-500"
                                : supplier.trend === "down"
                                  ? "text-red-500"
                                  : "text-amber-500"
                            }`}
                          >
                            {supplier.trend === "up" ? (
                              <ThumbsUp className="h-3 w-3" />
                            ) : supplier.trend === "down" ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                            <span className="text-sm font-medium">{supplier.performanceScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/supplier-management/performance">
                      View Performance Dashboard
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Suppliers by Category</CardTitle>
                  <CardDescription>Distribution of suppliers across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliersByCategory.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{category.count}</span>
                          <Progress
                            value={(category.count / Math.max(...suppliersByCategory.map((c) => c.count))) * 100}
                            className="h-2 w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suppliers by Location</CardTitle>
                  <CardDescription>Geographic distribution of suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suppliersByLocation.map((location) => (
                      <div key={location.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">{location.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{location.count}</span>
                          <Progress
                            value={(location.count / Math.max(...suppliersByLocation.map((l) => l.count))) * 100}
                            className="h-2 w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Directory</CardTitle>
                <CardDescription>View and manage all supplier information</CardDescription>
              </CardHeader>
              <CardContent>
                {showFilters && (
                  <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 w-full">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="IT Services">IT Services</SelectItem>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                          <SelectItem value="Logistics">Logistics</SelectItem>
                          <SelectItem value="Marketing Services">Marketing Services</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={tierFilter} onValueChange={setTierFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tiers</SelectItem>
                          <SelectItem value="Strategic">Strategic</SelectItem>
                          <SelectItem value="Preferred">Preferred</SelectItem>
                          <SelectItem value="Tactical">Tactical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search suppliers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No suppliers found. Try adjusting your filters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSuppliers.map((supplier) => (
                      <Card key={supplier.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12 border">
                                <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                                <AvatarFallback>{supplier.name?.substring(0, 2) || "NA"}</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{supplier.name}</h3>
                                  <Badge variant="outline">{supplier.id}</Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                  <Badge
                                    variant={
                                      supplier.status === "Active" || supplier.status === "Approved"
                                        ? "success"
                                        : supplier.status === "Under Review"
                                          ? "warning"
                                          : "outline"
                                    }
                                  >
                                    {supplier.status}
                                  </Badge>
                                  <span>•</span>
                                  <span>{supplier.category}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {supplier.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <a href={`tel:${supplier.contactPhone}`} className="hover:underline">
                                      {supplier.contactPhone}
                                    </a>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                    <a href={`mailto:${supplier.contactEmail}`} className="hover:underline">
                                      {supplier.contactEmail}
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground">Performance</span>
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    supplier.performanceScore >= 90
                                      ? "bg-green-100 text-green-700"
                                      : supplier.performanceScore >= 80
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  <span className="text-sm font-medium">{supplier.performanceScore}%</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground">Risk</span>
                                <Badge
                                  variant={
                                    supplier.riskLevel === "Low"
                                      ? "success"
                                      : supplier.riskLevel === "Medium"
                                        ? "warning"
                                        : "destructive"
                                  }
                                >
                                  {supplier.riskLevel}
                                </Badge>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground">Tier</span>
                                <Badge variant="outline">{supplier.tier}</Badge>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-muted-foreground">Annual Spend</span>
                                <span className="text-sm font-medium">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                  }).format(supplier.totalSpend)}
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewProfile(supplier)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Edit Supplier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleViewContracts(supplier)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Contracts
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handlePerformanceHistory(supplier)}>
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Performance History
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRiskAssessment(supplier)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Risk Assessment
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleContactSupplier(supplier)}>
                                    <Globe className="mr-2 h-4 w-4" />
                                    Contact Supplier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleViewDetails(supplier)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Monitor and evaluate supplier performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No suppliers found. Try adjusting your filters.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSuppliers.map((supplier) => (
                      <Card key={supplier.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12 border">
                                  <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                                  <AvatarFallback>{supplier.name?.substring(0, 2) || "NA"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{supplier.name}</h3>
                                  <p className="text-sm text-muted-foreground">{supplier.category}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-muted-foreground">Overall Score</span>
                                  <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                      supplier.performanceScore >= 90
                                        ? "bg-green-100 text-green-700"
                                        : supplier.performanceScore >= 80
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    <span className="text-sm font-medium">{supplier.performanceScore}%</span>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleViewDetails(supplier)}>
                                  View Details
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4 mt-2">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">On-Time Delivery</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      supplier.onTimeDelivery >= 90
                                        ? "text-green-600"
                                        : supplier.onTimeDelivery >= 80
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {supplier.onTimeDelivery}%
                                  </span>
                                </div>
                                <Progress
                                  value={supplier.onTimeDelivery}
                                  className={`h-2 ${
                                    supplier.onTimeDelivery >= 90
                                      ? "bg-green-100"
                                      : supplier.onTimeDelivery >= 80
                                        ? "bg-amber-100"
                                        : "bg-red-100"
                                  }`}
                                />
                                <div className="flex items-center gap-1">
                                  <Truck className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Delivery Performance</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Quality Score</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      supplier.qualityScore >= 90
                                        ? "text-green-600"
                                        : supplier.qualityScore >= 80
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {supplier.qualityScore}%
                                  </span>
                                </div>
                                <Progress
                                  value={supplier.qualityScore}
                                  className={`h-2 ${
                                    supplier.qualityScore >= 90
                                      ? "bg-green-100"
                                      : supplier.qualityScore >= 80
                                        ? "bg-amber-100"
                                        : "bg-red-100"
                                  }`}
                                />
                                <div className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Product/Service Quality</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Response Time</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      supplier.responseTime <= 24
                                        ? "text-green-600"
                                        : supplier.responseTime <= 48
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {supplier.responseTime}h
                                  </span>
                                </div>
                                <Progress
                                  value={100 - (supplier.responseTime / 72) * 100}
                                  className={`h-2 ${
                                    supplier.responseTime <= 24
                                      ? "bg-green-100"
                                      : supplier.responseTime <= 48
                                        ? "bg-amber-100"
                                        : "bg-red-100"
                                  }`}
                                />
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Communication Responsiveness</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Certifications</span>
                                  <span className="text-sm font-medium">{supplier.certifications.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {supplier.certifications.map((cert, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      <Shield className="mr-1 h-3 w-3" />
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Compliance & Standards</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Risk Management</CardTitle>
                <CardDescription>Monitor and mitigate supplier-related risks</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No suppliers found. Try adjusting your filters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {filteredSuppliers.filter((s) => s.riskLevel === "High").length}
                          </div>
                          <p className="text-xs text-muted-foreground">Suppliers</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-amber-600">
                            {filteredSuppliers.filter((s) => s.riskLevel === "Medium").length}
                          </div>
                          <p className="text-xs text-muted-foreground">Suppliers</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {filteredSuppliers.filter((s) => s.riskLevel === "Low").length}
                          </div>
                          <p className="text-xs text-muted-foreground">Suppliers</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      {filteredSuppliers
                        .sort((a, b) => {
                          const riskOrder = { High: 0, Medium: 1, Low: 2 }
                          return (riskOrder[a.riskLevel as keyof typeof riskOrder] || 999) -
                            (riskOrder[b.riskLevel as keyof typeof riskOrder] || 999)
                        })
                        .map((supplier) => (
                          <Card key={supplier.id} className="overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                                    <AvatarFallback>{supplier.name?.substring(0, 2) || "NA"}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold">{supplier.name}</h3>
                                    <p className="text-sm text-muted-foreground">{supplier.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                  <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground">Risk Level</span>
                                    <Badge
                                      variant={
                                        supplier.riskLevel === "Low"
                                          ? "success"
                                          : supplier.riskLevel === "Medium"
                                            ? "warning"
                                            : "destructive"
                                      }
                                    >
                                      {supplier.riskLevel}
                                    </Badge>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => handleRiskAssessment(supplier)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Assess Risk
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleViewProfile(supplier)}>
                                        View Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handlePerformanceHistory(supplier)}>
                                        Performance History
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleContactSupplier(supplier)}>
                                        Contact Supplier
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Enter the details for the new supplier</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={supplierForm.category}
                  onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
                  placeholder="e.g., IT Services"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={supplierForm.status} onValueChange={(v) => setSupplierForm({ ...supplierForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Select value={supplierForm.tier} onValueChange={(v) => setSupplierForm({ ...supplierForm, tier: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategic">Strategic</SelectItem>
                    <SelectItem value="Preferred">Preferred</SelectItem>
                    <SelectItem value="Tactical">Tactical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={supplierForm.city}
                  onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={supplierForm.country}
                  onChange={(e) => setSupplierForm({ ...supplierForm, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAddSupplier}>Create Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Supplier Name *</Label>
                <Input
                  id="edit-name"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={supplierForm.category}
                  onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
                  placeholder="e.g., IT Services"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Contact Person *</Label>
                <Input
                  id="edit-contactPerson"
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={supplierForm.status} onValueChange={(v) => setSupplierForm({ ...supplierForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tier">Tier</Label>
                <Select value={supplierForm.tier} onValueChange={(v) => setSupplierForm({ ...supplierForm, tier: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategic">Strategic</SelectItem>
                    <SelectItem value="Preferred">Preferred</SelectItem>
                    <SelectItem value="Tactical">Tactical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={supplierForm.city}
                  onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={supplierForm.country}
                  onChange={(e) => setSupplierForm({ ...supplierForm, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSupplierOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEditSupplier}>Update Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Supplier Profile</DialogTitle>
            <DialogDescription>Complete supplier information and details</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={selectedSupplier.logo || "/placeholder.svg"} alt={selectedSupplier.name} />
                    <AvatarFallback>{selectedSupplier.name?.substring(0, 2) || "NA"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedSupplier.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSupplier.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          selectedSupplier.status === "Active" || selectedSupplier.status === "Approved"
                            ? "success"
                            : "outline"
                        }
                      >
                        {selectedSupplier.status}
                      </Badge>
                      <Badge variant="outline">{selectedSupplier.tier}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSupplier.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selectedSupplier.contactEmail}`} className="hover:underline">
                          {selectedSupplier.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selectedSupplier.contactPhone}`} className="hover:underline">
                          {selectedSupplier.contactPhone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSupplier.location}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Performance Score</span>
                        <span className="font-medium">{selectedSupplier.performanceScore}%</span>
                      </div>
                      <Progress value={selectedSupplier.performanceScore} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span>On-Time Delivery</span>
                        <span className="font-medium">{selectedSupplier.onTimeDelivery}%</span>
                      </div>
                      <Progress value={selectedSupplier.onTimeDelivery} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span>Quality Score</span>
                        <span className="font-medium">{selectedSupplier.qualityScore}%</span>
                      </div>
                      <Progress value={selectedSupplier.qualityScore} className="h-2" />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Business Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Level</span>
                        <Badge
                          variant={
                            selectedSupplier.riskLevel === "Low"
                              ? "success"
                              : selectedSupplier.riskLevel === "Medium"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {selectedSupplier.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Active Contracts</span>
                        <span className="font-medium">{selectedSupplier.activeContracts}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Annual Spend</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(selectedSupplier.totalSpend)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.certifications.length > 0 ? (
                          selectedSupplier.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Shield className="mr-1 h-3 w-3" />
                              {cert}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No certifications listed</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewProfileOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewProfileOpen(false)
              handleContactSupplier(selectedSupplier!)
            }}>
              Contact Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Supplier Dialog */}
      <Dialog open={isContactSupplierOpen} onOpenChange={setIsContactSupplierOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Supplier</DialogTitle>
            <DialogDescription>Send a message to {selectedSupplier?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Enter message subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Type your message here..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactSupplierOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitContact} disabled={!contactForm.subject || !contactForm.message}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Risk Assessment Dialog */}
      <Dialog open={isRiskAssessmentOpen} onOpenChange={setIsRiskAssessmentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Risk Assessment</DialogTitle>
            <DialogDescription>Evaluate and document risk factors for {selectedSupplier?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="financial-risk">Financial Risk</Label>
              <Select
                value={riskForm.financialRisk}
                onValueChange={(v) => setRiskForm({ ...riskForm, financialRisk: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="operational-risk">Operational Risk</Label>
              <Select
                value={riskForm.operationalRisk}
                onValueChange={(v) => setRiskForm({ ...riskForm, operationalRisk: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="compliance-risk">Compliance Risk</Label>
              <Select
                value={riskForm.complianceRisk}
                onValueChange={(v) => setRiskForm({ ...riskForm, complianceRisk: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk-notes">Notes</Label>
              <Textarea
                id="risk-notes"
                value={riskForm.notes}
                onChange={(e) => setRiskForm({ ...riskForm, notes: e.target.value })}
                placeholder="Add any additional notes about the risk assessment..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRiskAssessmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRisk}>Save Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Performance History Dialog */}
      <Dialog open={isPerformanceHistoryOpen} onOpenChange={setIsPerformanceHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Performance History</DialogTitle>
            <DialogDescription>Historical performance data for {selectedSupplier?.name}</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedSupplier.performanceScore}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedSupplier.onTimeDelivery}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedSupplier.qualityScore}%</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Recent Evaluations</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Quarterly Review - Q4 2023</p>
                      <p className="text-xs text-muted-foreground">December 15, 2023</p>
                    </div>
                    <Badge variant="outline">{selectedSupplier.performanceScore}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Quarterly Review - Q3 2023</p>
                      <p className="text-xs text-muted-foreground">September 15, 2023</p>
                    </div>
                    <Badge variant="outline">{Math.max(0, selectedSupplier.performanceScore - 2)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Quarterly Review - Q2 2023</p>
                      <p className="text-xs text-muted-foreground">June 15, 2023</p>
                    </div>
                    <Badge variant="outline">{Math.max(0, selectedSupplier.performanceScore - 4)}%</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPerformanceHistoryOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsPerformanceHistoryOpen(false)
              handleRiskAssessment(selectedSupplier!)
            }}>
              Run New Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>Complete supplier information and metrics</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src={selectedSupplier.logo || "/placeholder.svg"} alt={selectedSupplier.name} />
                      <AvatarFallback>{selectedSupplier.name?.substring(0, 2) || "NA"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedSupplier.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedSupplier.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedSupplier.id}</Badge>
                        <Badge
                          variant={
                            selectedSupplier.status === "Active" || selectedSupplier.status === "Approved"
                              ? "success"
                              : "outline"
                          }
                        >
                          {selectedSupplier.status}
                        </Badge>
                        <Badge variant="outline">{selectedSupplier.tier}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditSupplier(selectedSupplier)}>
                    Edit Supplier
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Performance Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedSupplier.performanceScore}%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Risk Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        variant={
                          selectedSupplier.riskLevel === "Low"
                            ? "success"
                            : selectedSupplier.riskLevel === "Medium"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {selectedSupplier.riskLevel}
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Active Contracts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedSupplier.activeContracts}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Annual Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(selectedSupplier.totalSpend)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact Person</p>
                          <p className="text-sm font-medium">{selectedSupplier.contactName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <a href={`mailto:${selectedSupplier.contactEmail}`} className="text-sm font-medium hover:underline">
                            {selectedSupplier.contactEmail}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <a href={`tel:${selectedSupplier.contactPhone}`} className="text-sm font-medium hover:underline">
                            {selectedSupplier.contactPhone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium">{selectedSupplier.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">On-Time Delivery</span>
                          <span className="text-sm font-medium">{selectedSupplier.onTimeDelivery}%</span>
                        </div>
                        <Progress value={selectedSupplier.onTimeDelivery} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Quality Score</span>
                          <span className="text-sm font-medium">{selectedSupplier.qualityScore}%</span>
                        </div>
                        <Progress value={selectedSupplier.qualityScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Response Time</span>
                          <span className="text-sm font-medium">{selectedSupplier.responseTime}h</span>
                        </div>
                        <Progress value={100 - (selectedSupplier.responseTime / 72) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.certifications.length > 0 ? (
                        selectedSupplier.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">
                            <Shield className="mr-1 h-3 w-3" />
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No certifications listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleContactSupplier(selectedSupplier!)}>
              Contact Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  Clock,
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
  Edit,
  Trash2,
  FileCheck,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"

// Sample data for suppliers
const suppliers = [
  {
    id: "SUP-001",
    name: "Tech Solutions Inc.",
    logo: "/abstract-geometric-ts.png",
    category: "IT Services",
    status: "Approved",
    tier: "Strategic",
    location: "New York, USA",
    contactName: "John Smith",
    contactEmail: "john.smith@techsolutions.com",
    contactPhone: "+1 (555) 123-4567",
    performanceScore: 92,
    riskLevel: "Low",
    activeContracts: 3,
    totalSpend: 1250000,
    onTimeDelivery: 98,
    qualityScore: 95,
    responseTime: 24,
    certifications: ["ISO 9001", "ISO 27001", "SOC 2"],
  },
  {
    id: "SUP-002",
    name: "Office Depot",
    logo: "/stylized-letters-OD.png",
    category: "Office Supplies",
    status: "Approved",
    tier: "Preferred",
    location: "Chicago, USA",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@officedepot.com",
    contactPhone: "+1 (555) 234-5678",
    performanceScore: 88,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 75000,
    onTimeDelivery: 92,
    qualityScore: 90,
    responseTime: 48,
    certifications: ["ISO 9001", "Green Business Certified"],
  },
  {
    id: "SUP-003",
    name: "Global Logistics Partners",
    logo: "/glowing-landscape.png",
    category: "Logistics",
    status: "Approved",
    tier: "Strategic",
    location: "Singapore",
    contactName: "Michael Chen",
    contactEmail: "m.chen@globallogistics.com",
    contactPhone: "+65 9876 5432",
    performanceScore: 85,
    riskLevel: "Medium",
    activeContracts: 2,
    totalSpend: 950000,
    onTimeDelivery: 87,
    qualityScore: 88,
    responseTime: 36,
    certifications: ["ISO 9001", "C-TPAT", "IATA"],
  },
  {
    id: "SUP-004",
    name: "Marketing Experts Ltd.",
    logo: "/abstract-self-representation.png",
    category: "Marketing Services",
    status: "Approved",
    tier: "Preferred",
    location: "London, UK",
    contactName: "Jessica Williams",
    contactEmail: "j.williams@marketingexperts.com",
    contactPhone: "+44 20 1234 5678",
    performanceScore: 90,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 520000,
    onTimeDelivery: 95,
    qualityScore: 92,
    responseTime: 24,
    certifications: ["ISO 9001"],
  },
  {
    id: "SUP-005",
    name: "Manufacturing Solutions Co.",
    logo: "/abstract-ms-artwork.png",
    category: "Manufacturing",
    status: "Under Review",
    tier: "Tactical",
    location: "Detroit, USA",
    contactName: "Robert Taylor",
    contactEmail: "r.taylor@manufacturingsolutions.com",
    contactPhone: "+1 (555) 345-6789",
    performanceScore: 78,
    riskLevel: "Medium",
    activeContracts: 1,
    totalSpend: 650000,
    onTimeDelivery: 82,
    qualityScore: 85,
    responseTime: 48,
    certifications: ["ISO 9001", "ISO 14001"],
  },
  {
    id: "SUP-006",
    name: "Professional Services Group",
    logo: "/playstation-controller.png",
    category: "Consulting",
    status: "Approved",
    tier: "Strategic",
    location: "Boston, USA",
    contactName: "Amanda Rodriguez",
    contactEmail: "a.rodriguez@psgroup.com",
    contactPhone: "+1 (555) 456-7890",
    performanceScore: 94,
    riskLevel: "Low",
    activeContracts: 2,
    totalSpend: 780000,
    onTimeDelivery: 97,
    qualityScore: 96,
    responseTime: 12,
    certifications: ["ISO 9001", "ISO 27001"],
  },
]

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
  const { toast, notifications, dismiss } = useToast()
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, approveSupplier, updateSupplierPerformance } = useAppStore()

  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    logo: "",
    category: "",
    tier: "Preferred" as "Strategic" | "Preferred" | "Tactical",
    location: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    performanceScore: 80,
    riskLevel: "Medium" as "Low" | "Medium" | "High",
    paymentTerms: "Net 30",
    financialHealth: "Good",
    description: "",
  })

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.category || !newSupplier.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addSupplier({
      ...newSupplier,
      status: "Pending",
      products: [],
      contracts: [],
      performanceHistory: [],
    })

    setShowAddDialog(false)
    setNewSupplier({
      name: "",
      logo: "",
      category: "",
      tier: "Preferred",
      location: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      performanceScore: 80,
      riskLevel: "Medium",
      paymentTerms: "Net 30",
      financialHealth: "Good",
      description: "",
    })
  }

  const handleEditSupplier = () => {
    if (!selectedSupplier) return

    updateSupplier(selectedSupplier, newSupplier)
    setShowEditDialog(false)
    setSelectedSupplier(null)
    toast({
      title: "Supplier Updated",
      description: "Supplier information has been updated successfully.",
      variant: "success",
    })
  }

  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return
    deleteSupplier(selectedSupplier)
    setShowDeleteDialog(false)
    setSelectedSupplier(null)
  }

  const handleApproveSupplier = (id: string) => {
    approveSupplier(id)
    toast({
      title: "Supplier Approved",
      description: `Supplier ${id} has been approved.`,
      variant: "success",
    })
  }

  const openEditDialog = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    if (supplier) {
      setSelectedSupplier(supplierId)
      setNewSupplier({
        name: supplier.name,
        logo: supplier.logo,
        category: supplier.category,
        tier: supplier.tier,
        location: supplier.location,
        contactName: supplier.contactName,
        contactEmail: supplier.contactEmail,
        contactPhone: supplier.contactPhone,
        website: supplier.website,
        performanceScore: supplier.performanceScore,
        riskLevel: supplier.riskLevel,
        paymentTerms: supplier.paymentTerms,
        financialHealth: supplier.financialHealth,
        description: supplier.description,
      })
      setShowEditDialog(true)
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Supplier Management</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={() => { toast({ title: "Refreshed", description: "Suppliers refreshed successfully", variant: "success" }); }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Fill in the supplier details. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier-name">Company Name *</Label>
                  <Input
                    id="supplier-name"
                    placeholder="Enter company name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-category">Category *</Label>
                  <Input
                    id="supplier-category"
                    placeholder="e.g., IT Services, Office Supplies"
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier-tier">Tier</Label>
                    <Select
                      value={newSupplier.tier}
                      onValueChange={(value) => setNewSupplier({ ...newSupplier, tier: value as "Strategic" | "Preferred" | "Tactical" })}
                    >
                      <SelectTrigger id="supplier-tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strategic">Strategic</SelectItem>
                        <SelectItem value="Preferred">Preferred</SelectItem>
                        <SelectItem value="Tactical">Tactical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplier-risk">Risk Level</Label>
                    <Select
                      value={newSupplier.riskLevel}
                      onValueChange={(value) => setNewSupplier({ ...newSupplier, riskLevel: value as "Low" | "Medium" | "High" })}
                    >
                      <SelectTrigger id="supplier-risk">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-location">Location *</Label>
                  <Input
                    id="supplier-location"
                    placeholder="City, Country"
                    value={newSupplier.location}
                    onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact-name">Contact Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Contact person"
                      value={newSupplier.contactName}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contactName: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      placeholder="+1 (555) 123-4567"
                      value={newSupplier.contactPhone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@supplier.com"
                    value={newSupplier.contactEmail}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-website">Website</Label>
                  <Input
                    id="supplier-website"
                    placeholder="https://www.supplier.com"
                    value={newSupplier.website}
                    onChange={(e) => setNewSupplier({ ...newSupplier, website: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Input
                    id="payment-terms"
                    placeholder="Net 30"
                    value={newSupplier.paymentTerms}
                    onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-description">Description</Label>
                  <Textarea
                    id="supplier-description"
                    placeholder="Brief description of the supplier..."
                    value={newSupplier.description}
                    onChange={(e) => setNewSupplier({ ...newSupplier, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddSupplier}>Add Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="directory">Supplier Directory</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risk">Risk Management</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
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
                  <CardTitle className="text-sm font-medium">Approved Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.filter(s => s.status === 'Approved').length}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <Check className="mr-1 h-3 w-3" />
                      {Math.round((suppliers.filter(s => s.status === 'Approved').length / suppliers.length) * 100)}% of total
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
                  <div className="text-2xl font-bold">
                    {Math.round(suppliers.reduce((sum, s) => sum + s.performanceScore, 0) / suppliers.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <Check className="mr-1 h-3 w-3" />
                      Across all suppliers
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
                  <div className="text-2xl font-bold">{suppliers.filter(s => s.riskLevel === 'High').length}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 inline-flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Require attention
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

          <TabsContent value="directory" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Directory</CardTitle>
                <CardDescription>View and manage all supplier information</CardDescription>
              </CardHeader>
              <CardContent>
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
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="it">IT Services</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="marketing">Marketing Services</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="strategic">Strategic</SelectItem>
                        <SelectItem value="preferred">Preferred</SelectItem>
                        <SelectItem value="tactical">Tactical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredSuppliers.map((supplier) => (
                    <Card key={supplier.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                              <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{supplier.name}</h3>
                                <Badge variant="outline">{supplier.id}</Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <Badge
                                  variant={
                                    supplier.status === "Approved"
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
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/supplier-management/directory/${supplier.id}`}>View Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(supplier.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Supplier
                                </DropdownMenuItem>
                                <DropdownMenuItem>View Contracts</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {supplier.status !== "Approved" && (
                                  <DropdownMenuItem onClick={() => handleApproveSupplier(supplier.id)}>
                                    <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                                    Approve Supplier
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Performance History</DropdownMenuItem>
                                <DropdownMenuItem>Risk Assessment</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Contact Supplier</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => { setSelectedSupplier(supplier.id); setShowDeleteDialog(true); }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredSuppliers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No suppliers found matching your search.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Monitor and evaluate supplier performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
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
                  <div className="flex items-center gap-2">
                    <Select defaultValue="quarter">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                        <SelectItem value="ytd">Year to Date</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12 border">
                                <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                                <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
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
                              <Button variant="outline" size="sm">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Risk Management</CardTitle>
                <CardDescription>Monitor and mitigate supplier-related risks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  Risk management content will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Notification Toast */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-md shadow-lg border ${
                  notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                  notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                  notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{notification.title}</p>
                    {notification.message && <p className="text-sm mt-1">{notification.message}</p>}
                  </div>
                  <button
                    onClick={() => dismiss(notification.id)}
                    className="ml-4 text-sm opacity-70 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Supplier</DialogTitle>
              <DialogDescription>Update the supplier information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-supplier-name">Company Name</Label>
                <Input
                  id="edit-supplier-name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-supplier-category">Category</Label>
                <Input
                  id="edit-supplier-category"
                  value={newSupplier.category}
                  onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier-tier">Tier</Label>
                  <Select
                    value={newSupplier.tier}
                    onValueChange={(value) => setNewSupplier({ ...newSupplier, tier: value as "Strategic" | "Preferred" | "Tactical" })}
                  >
                    <SelectTrigger id="edit-supplier-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strategic">Strategic</SelectItem>
                      <SelectItem value="Preferred">Preferred</SelectItem>
                      <SelectItem value="Tactical">Tactical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier-risk">Risk Level</Label>
                  <Select
                    value={newSupplier.riskLevel}
                    onValueChange={(value) => setNewSupplier({ ...newSupplier, riskLevel: value as "Low" | "Medium" | "High" })}
                  >
                    <SelectTrigger id="edit-supplier-risk">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-supplier-location">Location</Label>
                <Input
                  id="edit-supplier-location"
                  value={newSupplier.location}
                  onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-contact-name">Contact Name</Label>
                  <Input
                    id="edit-contact-name"
                    value={newSupplier.contactName}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-contact-phone">Phone</Label>
                  <Input
                    id="edit-contact-phone"
                    value={newSupplier.contactPhone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact-email">Email</Label>
                <Input
                  id="edit-contact-email"
                  type="email"
                  value={newSupplier.contactEmail}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleEditSupplier}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this supplier? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSupplier} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

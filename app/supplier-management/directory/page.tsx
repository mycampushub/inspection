"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ThumbsUp,
  Eye,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

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
    website: "www.techsolutions.com",
    performanceScore: 92,
    riskLevel: "Low",
    activeContracts: 3,
    totalSpend: 1250000,
    onTimeDelivery: 98,
    qualityScore: 95,
    responseTime: 24,
    certifications: ["ISO 9001", "ISO 27001", "SOC 2"],
    financialHealth: "Strong",
    paymentTerms: "Net 30",
    establishedDate: "2005-03-15",
    description:
      "Tech Solutions Inc. is a leading provider of IT services and solutions, specializing in cloud infrastructure, cybersecurity, and managed services for enterprise clients.",
    products: ["Cloud Infrastructure", "Managed IT Services", "Cybersecurity Solutions", "IT Consulting"],
    contracts: [
      {
        id: "CON-2023-001",
        title: "IT Support Services",
        startDate: "2023-01-15",
        endDate: "2024-01-14",
        value: 250000,
        status: "Active",
      },
      {
        id: "CON-2022-045",
        title: "Cloud Migration Project",
        startDate: "2022-06-01",
        endDate: "2023-05-31",
        value: 450000,
        status: "Active",
      },
      {
        id: "CON-2022-078",
        title: "Cybersecurity Assessment",
        startDate: "2022-09-15",
        endDate: "2023-09-14",
        value: 180000,
        status: "Active",
      },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 91 },
      { period: "Q2 2023", score: 89 },
      { period: "Q3 2023", score: 90 },
      { period: "Q4 2023", score: 92 },
    ],
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
    website: "www.officedepot.com",
    performanceScore: 88,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 75000,
    onTimeDelivery: 92,
    qualityScore: 90,
    responseTime: 48,
    certifications: ["ISO 9001", "Green Business Certified"],
    financialHealth: "Strong",
    paymentTerms: "Net 45",
    establishedDate: "1986-10-25",
    description:
      "Office Depot is a global provider of office supplies, furniture, technology, and services for businesses of all sizes.",
    products: ["Office Supplies", "Furniture", "Technology", "Printing Services"],
    contracts: [
      {
        id: "CON-2023-008",
        title: "Office Supplies",
        startDate: "2023-03-01",
        endDate: "2024-02-28",
        value: 75000,
        status: "Active",
      },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 87 },
      { period: "Q2 2023", score: 86 },
      { period: "Q3 2023", score: 89 },
      { period: "Q4 2023", score: 88 },
    ],
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
    website: "www.globallogistics.com",
    performanceScore: 85,
    riskLevel: "Medium",
    activeContracts: 2,
    totalSpend: 950000,
    onTimeDelivery: 87,
    qualityScore: 88,
    responseTime: 36,
    certifications: ["ISO 9001", "C-TPAT", "IATA"],
    financialHealth: "Good",
    paymentTerms: "Net 30",
    establishedDate: "2001-07-12",
    description:
      "Global Logistics Partners provides comprehensive logistics solutions including freight forwarding, warehousing, and supply chain management services worldwide.",
    products: ["Freight Forwarding", "Warehousing", "Supply Chain Management", "Customs Brokerage"],
    contracts: [
      {
        id: "CON-2023-015",
        title: "Logistics Services",
        startDate: "2023-06-01",
        endDate: "2025-05-31",
        value: 650000,
        status: "Active",
      },
      {
        id: "CON-2022-098",
        title: "Warehousing Services",
        startDate: "2022-11-01",
        endDate: "2023-10-31",
        value: 300000,
        status: "Active",
      },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 83 },
      { period: "Q2 2023", score: 84 },
      { period: "Q3 2023", score: 86 },
      { period: "Q4 2023", score: 85 },
    ],
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
    website: "www.marketingexperts.com",
    performanceScore: 90,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 520000,
    onTimeDelivery: 95,
    qualityScore: 92,
    responseTime: 24,
    certifications: ["ISO 9001"],
    financialHealth: "Good",
    paymentTerms: "Net 15",
    establishedDate: "2010-04-18",
    description:
      "Marketing Experts Ltd. provides comprehensive marketing services including digital marketing, content creation, and brand strategy development.",
    products: ["Digital Marketing", "Content Creation", "Brand Strategy", "Social Media Management"],
    contracts: [
      {
        id: "CON-2023-023",
        title: "Digital Marketing",
        startDate: "2023-12-01",
        endDate: "2024-11-30",
        value: 520000,
        status: "Active",
      },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 88 },
      { period: "Q2 2023", score: 89 },
      { period: "Q3 2023", score: 91 },
      { period: "Q4 2023", score: 90 },
    ],
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
    website: "www.manufacturingsolutions.com",
    performanceScore: 78,
    riskLevel: "Medium",
    activeContracts: 1,
    totalSpend: 650000,
    onTimeDelivery: 82,
    qualityScore: 85,
    responseTime: 48,
    certifications: ["ISO 9001", "ISO 14001"],
    financialHealth: "Moderate",
    paymentTerms: "Net 45",
    establishedDate: "1998-09-30",
    description:
      "Manufacturing Solutions Co. specializes in custom manufacturing services, component production, and assembly for various industries.",
    products: ["Custom Manufacturing", "Component Production", "Assembly Services", "Product Design"],
    contracts: [
      {
        id: "CON-2023-031",
        title: "Component Manufacturing",
        startDate: "2023-08-15",
        endDate: "2024-08-14",
        value: 650000,
        status: "Active",
      },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 75 },
      { period: "Q2 2023", score: 76 },
      { period: "Q3 2023", score: 79 },
      { period: "Q4 2023", score: 78 },
    ],
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
    website: "www.psgroup.com",
    performanceScore: 94,
    riskLevel: "Low",
    activeContracts: 2,
    totalSpend: 780000,
    onTimeDelivery: 97,
    qualityScore: 96,
    responseTime: 12,
    certifications: ["ISO 9001", "ISO 27001"],
    financialHealth: "Strong",
    paymentTerms: "Net 30",
    establishedDate: "2008-02-14",
    description:
      "Professional Services Group provides high-quality consulting services in strategy, operations, and technology for enterprise clients.",
    products: ["Strategy Consulting", "Operations Consulting", "Technology Consulting", "Change Management"],
    contracts: [
      {
        id: "CON-2023-042",
        title: "Strategic Consulting",
        startDate: "2023-05-01",
        endDate: "2024-04-30",
        value: 430000,
        status: "Active",
      },
      {
        id: "CON-2023-067",
        title: "Technology Transformation",
        startDate: "2023-09-15",
        endDate: "2024-09-14",
        value: 350000,
        status: "Active",
      },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 93 },
      { period: "Q2 2023", score: 94 },
      { period: "Q3 2023", score: 94 },
      { period: "Q4 2023", score: 94 },
    ],
  },
]

export default function SupplierDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTier, setSelectedTier] = useState("all")
  const [showNewSupplierDialog, setShowNewSupplierDialog] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    category: "",
    tier: "",
    location: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    description: "",
  })

  const toggleSupplierExpansion = (id: string) => {
    setExpandedSupplier(expandedSupplier === id ? null : id)
  }

  const handleCreateSupplier = () => {
    // In a real app, this would make an API call
    setShowNewSupplierDialog(false)
    setNewSupplier({
      name: "",
      category: "",
      tier: "",
      location: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      description: "",
    })
  }

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || supplier.category.toLowerCase() === selectedCategory
    const matchesStatus = selectedStatus === "all" || supplier.status.toLowerCase() === selectedStatus.toLowerCase()
    const matchesTier = selectedTier === "all" || supplier.tier.toLowerCase() === selectedTier.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus && matchesTier
  })

  return (
    </>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/supplier-management">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center text-lg font-semibold">Supplier Directory</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Dialog open={showNewSupplierDialog} onOpenChange={setShowNewSupplierDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Add a new supplier to your directory. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-name">Supplier Name *</Label>
                    <Input
                      id="supplier-name"
                      placeholder="Enter supplier name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier-category">Category *</Label>
                    <Select
                      value={newSupplier.category}
                      onValueChange={(value) => setNewSupplier({ ...newSupplier, category: value })}
                    >
                      <SelectTrigger id="supplier-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT Services">IT Services</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="Marketing Services">Marketing Services</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-tier">Tier *</Label>
                    <Select
                      value={newSupplier.tier}
                      onValueChange={(value) => setNewSupplier({ ...newSupplier, tier: value })}
                    >
                      <SelectTrigger id="supplier-tier">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Strategic">Strategic</SelectItem>
                        <SelectItem value="Preferred">Preferred</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Potential">Potential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier-location">Location *</Label>
                    <Input
                      id="supplier-location"
                      placeholder="City, Country"
                      value={newSupplier.location}
                      onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-contact-name">Contact Name *</Label>
                    <Input
                      id="supplier-contact-name"
                      placeholder="Primary contact name"
                      value={newSupplier.contactName}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier-contact-email">Contact Email *</Label>
                    <Input
                      id="supplier-contact-email"
                      type="email"
                      placeholder="email@supplier.com"
                      value={newSupplier.contactEmail}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-contact-phone">Contact Phone</Label>
                    <Input
                      id="supplier-contact-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={newSupplier.contactPhone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contactPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier-website">Website</Label>
                    <Input
                      id="supplier-website"
                      placeholder="www.supplier.com"
                      value={newSupplier.website}
                      onChange={(e) => setNewSupplier({ ...newSupplier, website: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
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
                <Button variant="outline" onClick={() => setShowNewSupplierDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSupplier}>Add Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="it services">IT Services</SelectItem>
                <SelectItem value="office supplies">Office Supplies</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="marketing services">Marketing Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
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
            <Collapsible
              key={supplier.id}
              open={expandedSupplier === supplier.id}
              onOpenChange={() => toggleSupplierExpansion(supplier.id)}
            >
              <Card>
                <CardHeader className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                        <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Toggle</span>
                            </Button>
                          </CollapsibleTrigger>
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
                            <Mail className="h-3 w-3 text-muted-foreground" />
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
                          <DropdownMenuItem asChild>
                            <Link href={`/supplier-management/directory/${supplier.id}`}>View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                          <DropdownMenuItem>View Contracts</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Performance History</DropdownMenuItem>
                          <DropdownMenuItem>Risk Assessment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Contact Supplier</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="px-4 pb-4 pt-0 border-t">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Company Information</h4>
                          <p className="text-sm text-muted-foreground">{supplier.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Contact Details</h4>
                          <dl className="grid grid-cols-2 gap-1 text-sm">
                            <dt className="text-muted-foreground">Contact Name:</dt>
                            <dd>{supplier.contactName}</dd>
                            <dt className="text-muted-foreground">Email:</dt>
                            <dd>
                              <a href={`mailto:${supplier.contactEmail}`} className="text-primary hover:underline">
                                {supplier.contactEmail}
                              </a>
                            </dd>
                            <dt className="text-muted-foreground">Phone:</dt>
                            <dd>
                              <a href={`tel:${supplier.contactPhone}`} className="text-primary hover:underline">
                                {supplier.contactPhone}
                              </a>
                            </dd>
                            <dt className="text-muted-foreground">Website:</dt>
                            <dd>
                              <a
                                href={`https://${supplier.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {supplier.website}
                              </a>
                            </dd>
                            <dt className="text-muted-foreground">Location:</dt>
                            <dd>{supplier.location}</dd>
                            <dt className="text-muted-foreground">Established:</dt>
                            <dd>{new Date(supplier.establishedDate).toLocaleDateString()}</dd>
                          </dl>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Products & Services</h4>
                          <ul className="space-y-1">
                            {supplier.products.map((product, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <Check className="h-3 w-3 text-green-500" />
                                {product}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            {supplier.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Business Details</h4>
                          <dl className="grid grid-cols-2 gap-1 text-sm">
                            <dt className="text-muted-foreground">Financial Health:</dt>
                            <dd>{supplier.financialHealth}</dd>
                            <dt className="text-muted-foreground">Payment Terms:</dt>
                            <dd>{supplier.paymentTerms}</dd>
                            <dt className="text-muted-foreground">Active Contracts:</dt>
                            <dd>{supplier.activeContracts}</dd>
                            <dt className="text-muted-foreground">Annual Spend:</dt>
                            <dd>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              }).format(supplier.totalSpend)}
                            </dd>
                          </dl>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                          <div className="space-y-3">
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
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Performance History</h4>
                          <div className="space-y-2">
                            {supplier.performanceHistory.map((period) => (
                              <div key={period.period} className="flex items-center justify-between">
                                <span className="text-sm">{period.period}</span>
                                <div
                                  className={`flex items-center gap-1 ${
                                    period.score >= 90
                                      ? "text-green-600"
                                      : period.score >= 80
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  <span className="text-sm font-medium">{period.score}%</span>
                                  {period.score > supplier.performanceHistory[0].score ? (
                                    <ThumbsUp className="h-3 w-3" />
                                  ) : period.score < supplier.performanceHistory[0].score ? (
                                    <Clock className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-4">Active Contracts</h4>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                          <div className="col-span-4">Contract</div>
                          <div className="col-span-3">Period</div>
                          <div className="col-span-2">Value</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-1 text-right">Actions</div>
                        </div>
                        {supplier.contracts.map((contract) => (
                          <div key={contract.id} className="grid grid-cols-12 gap-4 p-3 border-t text-sm">
                            <div className="col-span-4">
                              <div className="font-medium">{contract.title}</div>
                              <div className="text-xs text-muted-foreground">{contract.id}</div>
                            </div>
                            <div className="col-span-3">
                              {new Date(contract.startDate).toLocaleDateString()} -{" "}
                              {new Date(contract.endDate).toLocaleDateString()}
                            </div>
                            <div className="col-span-2">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              }).format(contract.value)}
                            </div>
                            <div className="col-span-2">
                              <Badge variant={contract.status === "Active" ? "success" : "outline"}>
                                {contract.status}
                              </Badge>
                            </div>
                            <div className="col-span-1 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Profile
                      </Button>
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Meeting
                      </Button>
                      <Button asChild>
                        <Link href={`/supplier-management/directory/${supplier.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
          {filteredSuppliers.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No suppliers found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button className="mt-4">Add New Supplier</Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

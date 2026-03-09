"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  AlertCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { localSuppliers } from "@/lib/local-data"
import type { Supplier } from "@/lib/local-data"

export default function SupplierDirectory() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(localSuppliers)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTier, setSelectedTier] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // Form states
  const [formData, setFormData] = useState<Partial<Supplier>>({})
  const [contactForm, setContactForm] = useState({ subject: "", message: "" })
  const [meetingForm, setMeetingForm] = useState({ date: "", time: "", agenda: "" })

  // Filter suppliers locally
  const fetchSuppliers = () => {
    setLoading(true)
    // Data is already loaded locally, just simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }

  // Create supplier
  const handleCreateSupplier = () => {
    const newSupplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(4, '0')}`,
      ...formData,
      rating: 0,
      totalSpend: 0,
      contractCount: 0,
      performanceScore: 80,
      contactPerson: formData.contactPerson || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
      city: formData.city || "",
      country: formData.country || "",
      registrationDate: new Date().toISOString(),
      certifications: formData.certifications || [],
      type: formData.type || "Preferred",
      status: formData.status || "Active",
      tier: formData.tier || "Tier 2",
      riskLevel: formData.riskLevel || "Medium",
    }
    setSuppliers([...suppliers, newSupplier])
    setIsCreateDialogOpen(false)
    setFormData({})
  }

  // Update supplier
  const handleUpdateSupplier = () => {
    if (!selectedSupplier) return
    setSuppliers(suppliers.map((s) => s.id === selectedSupplier.id ? { ...s, ...formData } : s))
    setIsEditDialogOpen(false)
    setFormData({})
    setSelectedSupplier(null)
  }

  // Delete supplier
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return
    setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id))
    setIsDeleteDialogOpen(false)
    setSelectedSupplier(null)
  }

  // Contact supplier
  const handleContactSupplier = async () => {
    // In a real app, this would send an email
    alert(`Message sent to ${selectedSupplier?.contactPerson} (${selectedSupplier?.email})`)
    setIsContactDialogOpen(false)
    setContactForm({ subject: "", message: "" })
  }

  // Schedule meeting
  const handleScheduleMeeting = () => {
    alert(`Meeting scheduled with ${selectedSupplier?.name} on ${meetingForm.date} at ${meetingForm.time}`)
    setIsMeetingDialogOpen(false)
    setMeetingForm({ date: "", time: "", agenda: "" })
  }

  // Export supplier profile
  const handleExportProfile = (supplier: Supplier) => {
    const data = JSON.stringify(supplier, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `supplier-${supplier.id}-${supplier.name.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // View document
  const handleViewDocument = (document: any) => {
    alert(`Viewing document: ${document.name}\nType: ${document.type}\nSize: ${document.size} bytes\nUploaded by: ${document.uploadedBy}`)
  }

  const toggleSupplierExpansion = (id: string) => {
    setExpandedSupplier(expandedSupplier === id ? null : id)
  }

  const openEditDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setFormData({ ...supplier })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsViewDialogOpen(true)
  }

  const openContactDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsContactDialogOpen(true)
  }

  const openMeetingDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsMeetingDialogOpen(true)
  }

  const openDeleteDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsDeleteDialogOpen(true)
  }

  // Filter suppliers locally based on search and filters
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      searchQuery === "" ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || supplier.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesStatus = selectedStatus === "all" || supplier.status.toLowerCase() === selectedStatus.toLowerCase()
    const matchesTier = selectedTier === "all" || supplier.tier.toLowerCase() === selectedTier.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus && matchesTier
  })

  // Get unique categories, statuses, and tiers
  const categories = Array.from(new Set(suppliers.map((s) => s.category)))
  const statuses = Array.from(new Set(suppliers.map((s) => s.status)))
  const tiers = Array.from(new Set(suppliers.map((s) => s.tier)))

  return (
    <SidebarInset>
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
          <Button size="sm" variant="outline" onClick={fetchSuppliers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
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
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  {tiers.map((tier) => (
                    <SelectItem key={tier} value={tier.toLowerCase()}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
                          <AvatarFallback>{supplier.name?.substring(0, 2) || "NA"}</AvatarFallback>
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
                                supplier.status === "Active"
                                  ? "success"
                                  : supplier.status === "On Hold"
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
                              {supplier.city}, {supplier.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <a href={`tel:${supplier.phone}`} className="hover:underline">
                                {supplier.phone}
                              </a>
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a href={`mailto:${supplier.email}`} className="hover:underline">
                                {supplier.email}
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
                          <span className="text-xs text-muted-foreground">Type</span>
                          <Badge variant="outline">{supplier.type}</Badge>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-muted-foreground">Tier</span>
                          <Badge variant="outline">{supplier.tier}</Badge>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">Total Spend</span>
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
                            <DropdownMenuItem onClick={() => openViewDialog(supplier)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(supplier)}>
                              <Check className="mr-2 h-4 w-4" />
                              Edit Supplier
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/sourcing-contracts/contracts?supplierId=${supplier.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Contracts
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openContactDialog(supplier)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact Supplier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(supplier)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Supplier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="px-4 pb-4 pt-0 border-t">
                      <Tabs defaultValue="overview" className="mt-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="performance">Performance</TabsTrigger>
                          <TabsTrigger value="documents">Documents</TabsTrigger>
                          <TabsTrigger value="contracts">Contracts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4 mt-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Company Information</h4>
                                <p className="text-sm text-muted-foreground">
                                  {supplier.name} is a {supplier.type.toLowerCase()} supplier in the {supplier.category} category.
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Contact Details</h4>
                                <dl className="grid grid-cols-2 gap-1 text-sm">
                                  <dt className="text-muted-foreground">Contact Name:</dt>
                                  <dd>{supplier.contactPerson}</dd>
                                  <dt className="text-muted-foreground">Email:</dt>
                                  <dd>
                                    <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                                      {supplier.email}
                                    </a>
                                  </dd>
                                  <dt className="text-muted-foreground">Phone:</dt>
                                  <dd>
                                    <a href={`tel:${supplier.phone}`} className="text-primary hover:underline">
                                      {supplier.phone}
                                    </a>
                                  </dd>
                                  <dt className="text-muted-foreground">Address:</dt>
                                  <dd>
                                    {supplier.address}, {supplier.city}, {supplier.country}
                                  </dd>
                                  <dt className="text-muted-foreground">Registration Date:</dt>
                                  <dd>{new Date(supplier.registrationDate).toLocaleDateString()}</dd>
                                </dl>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Business Details</h4>
                                <dl className="grid grid-cols-2 gap-1 text-sm">
                                  <dt className="text-muted-foreground">Rating:</dt>
                                  <dd>{supplier.rating} / 5</dd>
                                  <dt className="text-muted-foreground">Risk Level:</dt>
                                  <dd>{supplier.riskLevel}</dd>
                                  <dt className="text-muted-foreground">Contracts:</dt>
                                  <dd>{supplier.contractCount}</dd>
                                  <dt className="text-muted-foreground">Total Spend:</dt>
                                  <dd>
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                      maximumFractionDigits: 0,
                                    }).format(supplier.totalSpend)}
                                  </dd>
                                </dl>
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
                                  {supplier.certifications.length === 0 && (
                                    <span className="text-sm text-muted-foreground">No certifications listed</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => handleExportProfile(supplier)}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Profile
                            </Button>
                            <Button variant="outline" onClick={() => openMeetingDialog(supplier)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Meeting
                            </Button>
                            <Button onClick={() => openViewDialog(supplier)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Full Profile
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="performance" className="space-y-4 mt-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-medium mb-4">Key Metrics</h4>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Overall Performance Score</span>
                                    <span
                                      className={`text-sm font-medium ${
                                        supplier.performanceScore >= 90
                                          ? "text-green-600"
                                          : supplier.performanceScore >= 80
                                            ? "text-amber-600"
                                            : "text-red-600"
                                      }`}
                                    >
                                      {supplier.performanceScore}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={supplier.performanceScore}
                                    className={`h-2 ${
                                      supplier.performanceScore >= 90
                                        ? "bg-green-100"
                                        : supplier.performanceScore >= 80
                                          ? "bg-amber-100"
                                          : "bg-red-100"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-4">Risk Assessment</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                  <span className="text-sm font-medium">Risk Level</span>
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
                                <p className="text-sm text-muted-foreground">
                                  {supplier.riskLevel === "Low" && "Low risk supplier with stable operations"}
                                  {supplier.riskLevel === "Medium" && "Medium risk supplier - monitor performance"}
                                  {supplier.riskLevel === "High" && "High risk supplier - requires close supervision"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4 mt-4">
                          {supplier.documents && supplier.documents.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                              <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                                <div className="col-span-5">Document Name</div>
                                <div className="col-span-3">Type</div>
                                <div className="col-span-2">Uploaded By</div>
                                <div className="col-span-2 text-right">Actions</div>
                              </div>
                              {supplier.documents.map((doc) => (
                                <div key={doc.id} className="grid grid-cols-12 gap-4 p-3 border-t text-sm items-center">
                                  <div className="col-span-5">
                                    <div className="font-medium">{doc.name}</div>
                                    <div className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(2)} KB</div>
                                  </div>
                                  <div className="col-span-3">
                                    <Badge variant="outline">{doc.type}</Badge>
                                  </div>
                                  <div className="col-span-2">{doc.uploadedBy}</div>
                                  <div className="col-span-2 text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewDocument(doc)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                              <div className="rounded-full bg-muted p-3">
                                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <h3 className="mt-4 text-sm font-semibold">No documents found</h3>
                              <p className="mt-2 text-sm text-muted-foreground">
                                This supplier has no uploaded documents yet.
                              </p>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="contracts" className="space-y-4 mt-4">
                          <div className="border rounded-md overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                              <div className="col-span-4">Contract ID</div>
                              <div className="col-span-2">Category</div>
                              <div className="col-span-2">Value</div>
                              <div className="col-span-2">Status</div>
                              <div className="col-span-2 text-right">Actions</div>
                            </div>
                            {supplier.contracts && supplier.contracts.length > 0 ? (
                              supplier.contracts.map((contractId) => (
                                <div key={contractId} className="grid grid-cols-12 gap-4 p-3 border-t text-sm items-center">
                                  <div className="col-span-4 font-medium">{contractId}</div>
                                  <div className="col-span-2">{supplier.category}</div>
                                  <div className="col-span-2">
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                      maximumFractionDigits: 0,
                                    }).format(supplier.totalSpend / (supplier.contracts?.length || 1))}
                                  </div>
                                  <div className="col-span-2">
                                    <Badge variant="success">Active</Badge>
                                  </div>
                                  <div className="col-span-2 text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/sourcing-contracts/contracts/${contractId}`}>
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">View</span>
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-12 p-8 text-center text-sm text-muted-foreground">
                                No contracts found for this supplier.
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
            {filteredSuppliers.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <div className="rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No suppliers found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  Add New Supplier
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Supplier Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Fill in the details to add a new supplier to the directory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || "Preferred"}
                  onValueChange={(value: string) => setFormData({ ...formData, type: value as any })}
                >
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
              <div className="grid gap-2">
                <Label htmlFor="tier">Tier</Label>
                <Select
                  value={formData.tier || "Tier 2"}
                  onValueChange={(value: string) => setFormData({ ...formData, tier: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier 1">Tier 1</SelectItem>
                    <SelectItem value="Tier 2">Tier 2</SelectItem>
                    <SelectItem value="Tier 3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter supplier category"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "Active"}
                  onValueChange={(value: string) => setFormData({ ...formData, status: value as any })}
                >
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
              <div className="grid gap-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel || "Medium"}
                  onValueChange={(value: string) => setFormData({ ...formData, riskLevel: value as any })}
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country || ""}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Input
                id="certifications"
                value={formData.certifications?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certifications: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                  })
                }
                placeholder="Enter certifications separated by commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSupplier}>Create Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={formData.type || "Preferred"}
                  onValueChange={(value: string) => setFormData({ ...formData, type: value as any })}
                >
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
              <div className="grid gap-2">
                <Label htmlFor="edit-tier">Tier</Label>
                <Select
                  value={formData.tier || "Tier 2"}
                  onValueChange={(value: string) => setFormData({ ...formData, tier: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier 1">Tier 1</SelectItem>
                    <SelectItem value="Tier 2">Tier 2</SelectItem>
                    <SelectItem value="Tier 3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter supplier category"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status || "Active"}
                  onValueChange={(value: string) => setFormData({ ...formData, status: value as any })}
                >
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
              <div className="grid gap-2">
                <Label htmlFor="edit-riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel || "Medium"}
                  onValueChange={(value: string) => setFormData({ ...formData, riskLevel: value as any })}
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contactPerson">Contact Person</Label>
              <Input
                id="edit-contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={formData.country || ""}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-certifications">Certifications</Label>
              <Input
                id="edit-certifications"
                value={formData.certifications?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certifications: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                  })
                }
                placeholder="Enter certifications separated by commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSupplier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSupplier?.name}</DialogTitle>
            <DialogDescription>Supplier ID: {selectedSupplier?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardDescription>Performance</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{selectedSupplier?.performanceScore}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardDescription>Risk Level</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge
                    variant={
                      selectedSupplier?.riskLevel === "Low"
                        ? "success"
                        : selectedSupplier?.riskLevel === "Medium"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {selectedSupplier?.riskLevel}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardDescription>Contracts</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{selectedSupplier?.contractCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardDescription>Total Spend</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-lg font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(selectedSupplier?.totalSpend || 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contact Person:</span>
                    <span className="font-medium">{selectedSupplier?.contactPerson}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <a href={`mailto:${selectedSupplier?.email}`} className="text-primary hover:underline">
                      {selectedSupplier?.email}
                    </a>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <a href={`tel:${selectedSupplier?.phone}`} className="text-primary hover:underline">
                      {selectedSupplier?.phone}
                    </a>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{selectedSupplier?.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">City:</span>
                    <span className="font-medium">{selectedSupplier?.city}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">{selectedSupplier?.country}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{selectedSupplier?.type}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{selectedSupplier?.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        selectedSupplier?.status === "Active"
                          ? "success"
                          : selectedSupplier?.status === "On Hold"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {selectedSupplier?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tier:</span>
                    <Badge variant="outline">{selectedSupplier?.tier}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium">{selectedSupplier?.rating} / 5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Registration Date:</span>
                    <span className="font-medium">
                      {selectedSupplier?.registrationDate && new Date(selectedSupplier.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSupplier?.certifications && selectedSupplier.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No certifications listed</p>
                )}
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Supplier Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Supplier</DialogTitle>
            <DialogDescription>Send a message to {selectedSupplier?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Enter subject"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleContactSupplier}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>Schedule a meeting with {selectedSupplier?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingForm.time}
                  onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agenda">Meeting Agenda</Label>
              <Textarea
                id="agenda"
                value={meetingForm.agenda}
                onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                placeholder="Enter meeting agenda"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMeetingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedSupplier?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>
              Delete Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

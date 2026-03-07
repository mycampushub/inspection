"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Edit,
  FileText,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Shield,
  Star,
  ThumbsUp,
  User,
  AlertTriangle,
  RefreshCw,
  Ban,
  Trash2,
  FileCheck,
  XCircle,
  AlertCircle,
  Users,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { getSupplierById, getContractsBySupplierId } from "@/lib/data"

export default function SupplierDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast, notifications, dismiss, suppliers, updateSupplier, approveSupplier, deleteSupplier, updateSupplierPerformance } = useAppStore()

  const supplier = getSupplierById(params.id || "")
  const supplierContracts = supplier ? getContractsBySupplierId(supplier.id) : []

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [performanceScore, setPerformanceScore] = useState(supplier?.performanceScore || 80)

  const handleApprove = () => {
    if (!supplier) return
    approveSupplier(supplier.id)
    setShowApproveDialog(false)
  }

  const handleDelete = () => {
    if (!supplier) return
    deleteSupplier(supplier.id)
    setShowDeleteDialog(false)
    router.push("/supplier-management/directory")
  }

  const handleUpdatePerformance = () => {
    if (!supplier) return
    updateSupplierPerformance(supplier.id, performanceScore, "Q4 2023")
    setShowPerformanceDialog(false)
    toast({
      title: "Performance Updated",
      description: `Performance score updated to ${performanceScore}%`,
      variant: "success",
    })
  }

  const handleStatusChange = (status: string) => {
    if (!supplier) return
    if (status === "Approved") {
      handleApprove()
    } else if (status === "Deleted") {
      handleDelete()
    }
  }

  if (!supplier) {
    return (
      </>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" onClick={() => router.push("/supplier-management/directory")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-lg font-semibold">Supplier Not Found</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Supplier not found.</p>
        </div>
      </>
    )
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-amber-600"
    return "text-red-600"
  }

  const getPerformanceBg = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-amber-100"
    return "bg-red-100"
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "success"
      case "Medium":
        return "warning"
      case "High":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Strategic":
        return "default"
      case "Preferred":
        return "secondary"
      case "Tactical":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success"
      case "Pending":
        return "warning"
      case "Under Review":
        return "warning"
      case "Inactive":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    </>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" onClick={() => router.push("/supplier-management/directory")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center text-lg font-semibold">Supplier Details</div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => { toast({ title: "Refreshed", description: "Supplier data refreshed", variant: "success" }) }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More Actions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Supplier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {supplier.status !== "Approved" && (
                <DropdownMenuItem onClick={() => setShowApproveDialog(true)}>
                  <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                  Approve Supplier
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowPerformanceDialog(true)}>
                <Star className="mr-2 h-4 w-4" />
                Update Performance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/supplier-management/performance`)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Performance History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Supplier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex md:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2">
                <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                <AvatarFallback className="text-xl">{supplier.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{supplier.name}</h1>
                  <Badge variant="outline">{supplier.id}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant={getStatusColor(supplier.status)}>{supplier.status}</Badge>
                  <span>•</span>
                  <Badge variant={getTierColor(supplier.tier)}>{supplier.tier} Tier</Badge>
                  <span>•</span>
                  <span>{supplier.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {supplier.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPerformanceDialog(true)}>
                <Star className="mr-2 h-4 w-4" />
                Update Performance
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/supplier-management/performance`}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Performance History
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Performance Score Card */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
                <CardDescription>Overall supplier performance rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className={`relative w-32 h-32 rounded-full ${getPerformanceBg(supplier.performanceScore)}`}>
                    <svg
                      className="absolute inset-0 transform -rotate-90"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={getPerformanceColor(supplier.performanceScore)}
                        strokeDasharray={`${2 * Math.PI * 14 / 100} 100`}
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getPerformanceColor(supplier.performanceScore)}`}>
                      {supplier.performanceScore}%
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className={`text-xs font-medium ${getPerformanceColor(supplier.performanceScore)}`}>
                      {supplier.performanceScore >= 90 ? "Excellent" : supplier.performanceScore >= 80 ? "Good" : "Needs Improvement"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                      <span className={`text-sm font-medium ${getPerformanceColor(supplier.onTimeDelivery)}`}>
                        {supplier.onTimeDelivery}%
                      </span>
                    </div>
                    <Progress
                      value={supplier.onTimeDelivery}
                      className={`h-2 ${getPerformanceBg(supplier.onTimeDelivery)} ${getPerformanceColor(supplier.onTimeDelivery)}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Quality Score</span>
                      <span className={`text-sm font-medium ${getPerformanceColor(supplier.qualityScore)}`}>
                        {supplier.qualityScore}%
                      </span>
                    </div>
                    <Progress
                      value={supplier.qualityScore}
                      className={`h-2 ${getPerformanceBg(supplier.qualityScore)} ${getPerformanceColor(supplier.qualityScore)}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className={`text-sm font-medium ${supplier.responseTime <= 24 ? "text-green-600" : supplier.responseTime <= 48 ? "text-amber-600" : "text-red-600"}`}>
                        {supplier.responseTime} hours
                      </span>
                    </div>
                    <Progress
                      value={100 - (supplier.responseTime / 72) * 100}
                      className={`h-2 ${getPerformanceBg(100 - (supplier.responseTime / 72) * 100)}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <Badge variant={getRiskColor(supplier.riskLevel)}>
                        {supplier.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How to Reach Us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>Contact Person</Label>
                    <p className="font-medium">{supplier.contactName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <a href={`mailto:${supplier.contactEmail}`} className="text-primary hover:underline text-sm">
                      {supplier.contactEmail}
                    </a>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <a href={`tel:${supplier.contactPhone}`} className="text-primary hover:underline text-sm">
                      {supplier.contactPhone}
                    </a>
                  </div>
                  {supplier.website && (
                    <div>
                      <Label>Website</Label>
                      <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        {supplier.website}
                      </a>
                    </div>
                  )}
                  <div>
                    <Label>Address</Label>
                    <p className="text-sm text-muted-foreground">
                      {supplier.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Company Description</Label>
                  <p className="text-sm text-muted-foreground">{supplier.description}</p>
                </div>
                <div>
                  <Label>Products & Services</Label>
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.map((product, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Established</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(supplier.establishedDate).getFullYear()} ({new Date(supplier.establishedDate).toLocaleDateString()})
                  </p>
                </div>
                <div>
                  <Label>Financial Health</Label>
                  <Badge variant={supplier.financialHealth === "Strong" ? "success" : supplier.financialHealth === "Good" ? "warning" : "destructive"}>
                    {supplier.financialHealth}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Payment Terms</Label>
                  <p className="text-sm text-muted-foreground">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-1">
                    {supplier.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Contracts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Contracts</CardTitle>
              <CardDescription>Current agreements with this supplier</CardDescription>
            </CardHeader>
            <CardContent>
                {supplierContracts.length > 0 ? (
                  <div className="space-y-3">
                    {supplierContracts.map((contract) => (
                      <Link
                        key={contract.id}
                        href={`/sourcing-contracts/contracts/${contract.id}`}
                        className="block"
                      >
                        <Card className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{contract.title}</h4>
                                <p className="text-xs text-muted-foreground">{contract.id}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                  }).format(contract.value)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-500 text-center py-4">
                    No active contracts found
                  </p>
                )}
              </CardContent>
              {supplierContracts.length > 0 && (
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/sourcing-contracts/contracts">
                      View All Contracts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>

          {/* Performance History */}
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
              <CardDescription>Quarterly performance scores</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  {supplier.performanceHistory.map((history) => (
                    <div key={history.period} className="flex items-center justify-between">
                      <span className="text-sm">{history.period}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={history.score} className={`h-2 ${getPerformanceBg(history.score)}`} />
                        </div>
                        <span className={`text-sm font-medium ${getPerformanceColor(history.score)}`}>
                          {history.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Compliance</CardTitle>
              <CardDescription>Industry certifications held by supplier</CardDescription>
            </CardHeader>
          <CardContent>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    <Shield className="mr-1 h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Performance Dialog */}
      <Dialog open={showPerformanceDialog} onOpenChange={setShowPerformanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Performance Score</DialogTitle>
            <DialogDescription>
              Update the overall performance rating for this supplier.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="performance-score">Performance Score (0-100)</Label>
              <Input
                id="performance-score"
                type="number"
                min="0"
                max="100"
                value={performanceScore}
                onChange={(e) => setPerformanceScore(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2 rounded-full ${getPerformanceBg(performanceScore)}`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getPerformanceColor(performanceScore)}`}
                  style={{ width: `${performanceScore}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${getPerformanceColor(performanceScore)}`}>
                {performanceScore}%
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPerformanceDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdatePerformance}>Update Score</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Supplier</DialogTitle>
            <DialogDescription>
              Approve this supplier? This will allow them to participate in procurement activities.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplier? This action cannot be undone and will affect related contracts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

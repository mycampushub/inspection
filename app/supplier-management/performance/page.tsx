"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Star,
  ThumbsUp,
  Truck,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  FileText,
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
import { localEvaluations, localSuppliers } from "@/lib/local-data"
import type { Evaluation, Supplier } from "@/lib/local-data"

interface PerformanceEvaluation {
  id: string
  supplierId: string
  supplierName: string
  category: string
  evaluationDate: string
  evaluatedBy: string
  overallScore: number
  qualityScore: number
  deliveryScore: number
  costScore: number
  serviceScore: number
  complianceScore: number
  innovationScore: number
  status: "Draft" | "Submitted" | "Approved"
  comments?: string
  issues?: PerformanceIssue[]
  recommendations?: string[]
}

interface PerformanceIssue {
  id: string
  type: string
  description: string
  severity: "Low" | "Medium" | "High"
  date: string
  resolved: boolean
}

export default function SupplierPerformance() {
  // Convert local Evaluation to PerformanceEvaluation format
  const initialEvaluations: PerformanceEvaluation[] = localEvaluations.map((eval) => ({
    id: eval.id,
    supplierId: eval.supplierId,
    supplierName: eval.supplierName,
    category: eval.category,
    evaluationDate: eval.evaluatedAt.split("T")[0],
    evaluatedBy: eval.evaluatedBy,
    overallScore: eval.overallScore,
    qualityScore: eval.qualityOfGoods,
    deliveryScore: eval.onTimeDelivery,
    costScore: eval.pricing,
    serviceScore: eval.customerService,
    complianceScore: eval.compliance,
    innovationScore: 80, // Default value
    status: eval.status === "Completed" ? "Approved" : eval.status === "In Progress" ? "Submitted" : "Draft",
    comments: eval.comments[0]?.text || "",
    issues: eval.issues.map((issue) => ({
      id: `ISS-${issue.id}`,
      type: issue.title,
      description: issue.description,
      severity: issue.severity === "Critical" || issue.severity === "High" ? "High" : issue.severity,
      date: issue.reportedDate,
      resolved: issue.status === "Resolved",
    })),
  }))

  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>(initialEvaluations)
  const [suppliers, setSuppliers] = useState<Supplier[]>(localSuppliers)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedEvaluation, setExpandedEvaluation] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("quarter")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPerformance, setSelectedPerformance] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("performance")

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<PerformanceEvaluation | null>(null)

  // Form states
  const [formData, setFormData] = useState<Partial<PerformanceEvaluation>>({
    overallScore: 80,
    qualityScore: 80,
    deliveryScore: 80,
    costScore: 80,
    serviceScore: 80,
    complianceScore: 80,
    innovationScore: 80,
    status: "Draft",
  })
  const [issueForm, setIssueForm] = useState<Partial<PerformanceIssue>>({
    type: "Quality Issue",
    severity: "Medium",
    resolved: false,
  })
  const [contactForm, setContactForm] = useState({ subject: "", message: "" })

  // Fetch evaluations locally (no-op, data is already loaded)
  const fetchEvaluations = () => {
    setLoading(true)
    // Data is already loaded locally, just simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }

  // Fetch suppliers locally (no-op, data is already loaded)
  const fetchSuppliers = () => {
    // Data is already loaded locally
  }

  // Create evaluation
  const handleCreateEvaluation = () => {
    if (!formData.supplierId || !formData.evaluatedBy) {
      alert("Please select a supplier and provide the evaluator name.")
      return
    }
    const supplier = suppliers.find((s) => s.id === formData.supplierId)
    const newEvaluation: PerformanceEvaluation = {
      id: `EVAL-${String(evaluations.length + 1).padStart(5, '0')}`,
      supplierId: formData.supplierId!,
      supplierName: supplier?.name || "",
      category: supplier?.category || "",
      evaluationDate: new Date().toISOString().split("T")[0],
      evaluatedBy: formData.evaluatedBy!,
      overallScore: formData.overallScore || 80,
      qualityScore: formData.qualityScore || 80,
      deliveryScore: formData.deliveryScore || 80,
      costScore: formData.costScore || 80,
      serviceScore: formData.serviceScore || 80,
      complianceScore: formData.complianceScore || 80,
      innovationScore: formData.innovationScore || 80,
      status: formData.status || "Draft",
      comments: formData.comments,
      issues: [],
      recommendations: [],
    }
    setEvaluations([...evaluations, newEvaluation])
    setIsCreateDialogOpen(false)
    setFormData({
      overallScore: 80,
      qualityScore: 80,
      deliveryScore: 80,
      costScore: 80,
      serviceScore: 80,
      complianceScore: 80,
      innovationScore: 80,
      status: "Draft",
    })
  }

  // Update evaluation
  const handleUpdateEvaluation = () => {
    if (!selectedEvaluation) return
    setEvaluations(evaluations.map((e) => e.id === selectedEvaluation.id ? { ...e, ...formData } : e))
    setIsEditDialogOpen(false)
    setFormData({})
    setSelectedEvaluation(null)
  }

  // Delete evaluation
  const handleDeleteEvaluation = () => {
    if (!selectedEvaluation) return
    setEvaluations(evaluations.filter((e) => e.id !== selectedEvaluation.id))
    setIsDeleteDialogOpen(false)
    setSelectedEvaluation(null)
  }

  // Add issue to evaluation
  const handleAddIssue = () => {
    if (!selectedEvaluation || !issueForm.type || !issueForm.description) {
      alert("Please fill in all required fields.")
      return
    }
    const newIssue: PerformanceIssue = {
      id: `ISS-${Date.now()}`,
      type: issueForm.type!,
      description: issueForm.description!,
      severity: issueForm.severity!,
      date: new Date().toISOString().split("T")[0],
      resolved: issueForm.resolved || false,
    }
    const updatedIssues = [...(selectedEvaluation.issues || []), newIssue]
    handleUpdateIssues(updatedIssues)
    setIsIssueDialogOpen(false)
    setIssueForm({ type: "Quality Issue", severity: "Medium", resolved: false })
  }

  // Update issues for evaluation
  const handleUpdateIssues = (issues: PerformanceIssue[]) => {
    if (!selectedEvaluation) return
    setSelectedEvaluation({ ...selectedEvaluation, issues })
    setEvaluations(evaluations.map((e) => e.id === selectedEvaluation.id ? { ...e, issues } : e))
  }

  // Contact supplier
  const handleContactSupplier = () => {
    const supplier = suppliers.find((s) => s.id === selectedEvaluation?.supplierId)
    alert(`Message sent to ${supplier?.contactPerson} (${supplier?.email})\nSubject: ${contactForm.subject}\nMessage: ${contactForm.message}`)
    setIsContactDialogOpen(false)
    setContactForm({ subject: "", message: "" })
  }

  // Export report
  const handleExportReport = (evaluation: PerformanceEvaluation) => {
    const data = JSON.stringify(evaluation, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `evaluation-${evaluation.id}-${evaluation.supplierName.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Schedule review
  const handleScheduleReview = (evaluation: PerformanceEvaluation) => {
    alert(`Review scheduled for ${evaluation.supplierName}\nEvaluation ID: ${evaluation.id}\nNext review date will be set by the system.`)
  }

  const toggleEvaluationExpansion = (id: string) => {
    setExpandedEvaluation(expandedEvaluation === id ? null : id)
  }

  const openEditDialog = (evaluation: PerformanceEvaluation) => {
    setSelectedEvaluation(evaluation)
    setFormData({ ...evaluation })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (evaluation: PerformanceEvaluation) => {
    setSelectedEvaluation(evaluation)
    setIsViewDialogOpen(true)
  }

  const openDeleteDialog = (evaluation: PerformanceEvaluation) => {
    setSelectedEvaluation(evaluation)
    setIsDeleteDialogOpen(true)
  }

  const openIssueDialog = (evaluation: PerformanceEvaluation) => {
    setSelectedEvaluation(evaluation)
    setIsIssueDialogOpen(true)
  }

  const openContactDialog = (evaluation: PerformanceEvaluation) => {
    setSelectedEvaluation(evaluation)
    setIsContactDialogOpen(true)
  }

  // Initial fetch (data is already loaded)
  useEffect(() => {
    // Data is already loaded from local data
  }, [])

  // Filter updates are handled by the filteredEvaluations variable

  // Filter evaluations based on search and filters
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || evaluation.category.toLowerCase() === selectedCategory
    const matchesStatus = selectedStatus === "all" || evaluation.status === selectedStatus
    const matchesPerformance =
      selectedPerformance === "all" ||
      (selectedPerformance === "excellent" && evaluation.overallScore >= 90) ||
      (selectedPerformance === "good" && evaluation.overallScore >= 80 && evaluation.overallScore < 90) ||
      (selectedPerformance === "average" && evaluation.overallScore >= 70 && evaluation.overallScore < 80) ||
      (selectedPerformance === "poor" && evaluation.overallScore < 70)

    return matchesSearch && matchesCategory && matchesStatus && matchesPerformance
  })

  // Get unique categories
  const categories = Array.from(new Set(evaluations.map((e) => e.category)))

  // Calculate aggregate metrics
  const averageScore = filteredEvaluations.length > 0
    ? Math.round(filteredEvaluations.reduce((acc, e) => acc + e.overallScore, 0) / filteredEvaluations.length)
    : 0

  const averageDelivery = filteredEvaluations.length > 0
    ? Math.round(filteredEvaluations.reduce((acc, e) => acc + e.deliveryScore, 0) / filteredEvaluations.length)
    : 0

  const averageQuality = filteredEvaluations.length > 0
    ? Math.round(filteredEvaluations.reduce((acc, e) => acc + e.qualityScore, 0) / filteredEvaluations.length)
    : 0

  const averageService = filteredEvaluations.length > 0
    ? Math.round(filteredEvaluations.reduce((acc, e) => acc + e.serviceScore, 0) / filteredEvaluations.length)
    : 0

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
        <div className="flex items-center text-lg font-semibold">Supplier Performance</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={fetchEvaluations}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search evaluations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Performance level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="excellent">Excellent (90%+)</SelectItem>
                  <SelectItem value="good">Good (80-89%)</SelectItem>
                  <SelectItem value="average">Average (70-79%)</SelectItem>
                  <SelectItem value="poor">Poor (Below 70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  Based on {filteredEvaluations.length} evaluations
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageDelivery}%</div>
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
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageQuality}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  Quality assurance metric
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Score</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageService}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  Customer service rating
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="issues">Performance Issues</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((evaluation) => (
                  <Collapsible
                    key={evaluation.id}
                    open={expandedEvaluation === evaluation.id}
                    onOpenChange={() => toggleEvaluationExpansion(evaluation.id)}
                  >
                    <Card>
                      <CardHeader className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarFallback>{evaluation.supplierName.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                                    <ChevronDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                  </Button>
                                </CollapsibleTrigger>
                                <h3 className="font-semibold">{evaluation.supplierName}</h3>
                                <Badge variant="outline">{evaluation.id}</Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <Badge
                                  variant={
                                    evaluation.status === "Approved"
                                      ? "success"
                                      : evaluation.status === "Submitted"
                                        ? "warning"
                                        : "outline"
                                  }
                                >
                                  {evaluation.status}
                                </Badge>
                                <span>•</span>
                                <span>{evaluation.category}</span>
                                <span>•</span>
                                <span>{new Date(evaluation.evaluationDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Overall Score</span>
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                  evaluation.overallScore >= 90
                                    ? "bg-green-100 text-green-700"
                                    : evaluation.overallScore >= 80
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                <span className="text-sm font-medium">{evaluation.overallScore}%</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Evaluated By</span>
                              <span className="text-sm font-medium">{evaluation.evaluatedBy}</span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openViewDialog(evaluation)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Full Performance
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(evaluation)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Evaluation
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportReport(evaluation)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export Report
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openContactDialog(evaluation)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Contact Supplier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(evaluation)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Evaluation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="px-4 pb-4 pt-0 border-t">
                          <div className="grid gap-6 md:grid-cols-3 mt-4">
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Delivery Performance</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Delivery Score</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      evaluation.deliveryScore >= 90
                                        ? "text-green-600"
                                        : evaluation.deliveryScore >= 80
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {evaluation.deliveryScore}%
                                  </span>
                                </div>
                                <Progress
                                  value={evaluation.deliveryScore}
                                  className={`h-2 ${
                                    evaluation.deliveryScore >= 90
                                      ? "bg-green-100"
                                      : evaluation.deliveryScore >= 80
                                        ? "bg-amber-100"
                                        : "bg-red-100"
                                  }`}
                                />
                                <div className="flex items-center gap-1">
                                  <Truck className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">On-time delivery performance</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Quality Performance</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Quality Score</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      evaluation.qualityScore >= 90
                                        ? "text-green-600"
                                        : evaluation.qualityScore >= 80
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {evaluation.qualityScore}%
                                  </span>
                                </div>
                                <Progress
                                  value={evaluation.qualityScore}
                                  className={`h-2 ${
                                    evaluation.qualityScore >= 90
                                      ? "bg-green-100"
                                      : evaluation.qualityScore >= 80
                                        ? "bg-amber-100"
                                        : "bg-red-100"
                                  }`}
                                />
                                <div className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Product/Service Quality</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Service Performance</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Service Score</span>
                                  <span
                                    className={`text-sm font-medium ${
                                      evaluation.serviceScore >= 90
                                        ? "text-green-600"
                                        : evaluation.serviceScore >= 80
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {evaluation.serviceScore}%
                                  </span>
                                </div>
                                <Progress
                                  value={evaluation.serviceScore}
                                  className={`h-2 ${
                                    evaluation.serviceScore >= 90
                                      ? "bg-green-100"
                                      : evaluation.serviceScore >= 80
                                        ? "bg-amber-100"
                                        : "bg-red-100"
                                  }`}
                                />
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Customer Service Rating</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-6 md:grid-cols-3 mt-6">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Cost Score</h4>
                              <div className="flex items-center gap-2">
                                <Progress value={evaluation.costScore} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{evaluation.costScore}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Compliance Score</h4>
                              <div className="flex items-center gap-2">
                                <Progress value={evaluation.complianceScore} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{evaluation.complianceScore}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Innovation Score</h4>
                              <div className="flex items-center gap-2">
                                <Progress value={evaluation.innovationScore} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{evaluation.innovationScore}%</span>
                              </div>
                            </div>
                          </div>

                          {evaluation.comments && (
                            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                              <h4 className="text-sm font-medium mb-2">Comments</h4>
                              <p className="text-sm text-muted-foreground">{evaluation.comments}</p>
                            </div>
                          )}

                          {evaluation.recommendations && evaluation.recommendations.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                              <ul className="space-y-1">
                                {evaluation.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Check className="h-3 w-3 mt-1 text-green-500" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-6">
                            <Button variant="outline" size="sm" onClick={() => openIssueDialog(evaluation)}>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Add Issue
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleScheduleReview(evaluation)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Review
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleExportReport(evaluation)}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Report
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
                {filteredEvaluations.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No evaluations found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search or filters, or create a new evaluation.
                    </p>
                    <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Evaluation
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Performance Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Supplier</div>
                    <div className="col-span-2">Issue ID</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {evaluations
                    .flatMap((evaluation) =>
                      (evaluation.issues || []).map((issue) => ({
                        ...issue,
                        supplierName: evaluation.supplierName,
                        evaluationId: evaluation.id,
                      })),
                    )
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((issue) => (
                      <div key={issue.id} className="grid grid-cols-12 gap-4 p-3 border-t text-sm items-center">
                        <div className="col-span-2 font-medium">{issue.supplierName}</div>
                        <div className="col-span-2 text-muted-foreground">{issue.id}</div>
                        <div className="col-span-2">{new Date(issue.date).toLocaleDateString()}</div>
                        <div className="col-span-2">{issue.type}</div>
                        <div className="col-span-2">
                          <Badge
                            variant={
                              issue.resolved
                                ? "success"
                                : issue.severity === "High"
                                  ? "destructive"
                                  : issue.severity === "Medium"
                                    ? "warning"
                                    : "outline"
                            }
                          >
                            {issue.resolved ? "Resolved" : `${issue.severity} - Open`}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const evaluation = evaluations.find((e) => e.id === issue.evaluationId)
                              if (evaluation) {
                                setSelectedEvaluation(evaluation)
                                setExpandedEvaluation(evaluation.id)
                                setActiveTab("performance")
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  {evaluations.flatMap((e) => e.issues || []).length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p>No performance issues found.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Performance Score Distribution</h4>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {evaluations.filter((e) => e.overallScore >= 90).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Excellent (90%+)</div>
                        <Progress
                          value={(evaluations.filter((e) => e.overallScore >= 90).length / Math.max(evaluations.length, 1)) * 100}
                          className="h-2 mt-2 bg-green-100"
                        />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">
                          {evaluations.filter((e) => e.overallScore >= 80 && e.overallScore < 90).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Good (80-89%)</div>
                        <Progress
                          value={(evaluations.filter((e) => e.overallScore >= 80 && e.overallScore < 90).length / Math.max(evaluations.length, 1)) * 100}
                          className="h-2 mt-2 bg-amber-100"
                        />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {evaluations.filter((e) => e.overallScore >= 70 && e.overallScore < 80).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Average (70-79%)</div>
                        <Progress
                          value={(evaluations.filter((e) => e.overallScore >= 70 && e.overallScore < 80).length / Math.max(evaluations.length, 1)) * 100}
                          className="h-2 mt-2 bg-orange-100"
                        />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {evaluations.filter((e) => e.overallScore < 70).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Poor (Below 70%)</div>
                        <Progress
                          value={(evaluations.filter((e) => e.overallScore < 70).length / Math.max(evaluations.length, 1)) * 100}
                          className="h-2 mt-2 bg-red-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Category Performance Overview</h4>
                    <div className="space-y-3">
                      {categories.map((category) => {
                        const categoryEvals = evaluations.filter((e) => e.category === category)
                        const avgScore = categoryEvals.length > 0
                          ? Math.round(categoryEvals.reduce((acc, e) => acc + e.overallScore, 0) / categoryEvals.length)
                          : 0
                        return (
                          <div key={category} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="w-32 font-medium text-sm">{category}</div>
                            <div className="flex-1">
                              <Progress value={avgScore} className="h-2" />
                            </div>
                            <div className="w-16 text-right text-sm font-medium">{avgScore}%</div>
                            <div className="w-20 text-right text-xs text-muted-foreground">
                              {categoryEvals.length} evals
                            </div>
                          </div>
                        )
                      })}
                      {categories.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                          No category data available
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Evaluation Status</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {evaluations.filter((e) => e.status === "Draft").length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Draft Evaluations</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">
                          {evaluations.filter((e) => e.status === "Submitted").length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Submitted</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {evaluations.filter((e) => e.status === "Approved").length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Approved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Evaluation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Performance Evaluation</DialogTitle>
            <DialogDescription>Create a new performance evaluation for a supplier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplierId} onValueChange={(value: string) => setFormData({ ...formData, supplierId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="evaluatedBy">Evaluated By *</Label>
              <Input
                id="evaluatedBy"
                value={formData.evaluatedBy || ""}
                onChange={(e) => setFormData({ ...formData, evaluatedBy: e.target.value })}
                placeholder="Enter evaluator name"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="qualityScore">Quality Score *</Label>
                <Input
                  id="qualityScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.qualityScore || 80}
                  onChange={(e) => setFormData({ ...formData, qualityScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deliveryScore">Delivery Score *</Label>
                <Input
                  id="deliveryScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.deliveryScore || 80}
                  onChange={(e) => setFormData({ ...formData, deliveryScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="costScore">Cost Score *</Label>
                <Input
                  id="costScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.costScore || 80}
                  onChange={(e) => setFormData({ ...formData, costScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceScore">Service Score *</Label>
                <Input
                  id="serviceScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.serviceScore || 80}
                  onChange={(e) => setFormData({ ...formData, serviceScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="complianceScore">Compliance Score *</Label>
                <Input
                  id="complianceScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.complianceScore || 80}
                  onChange={(e) => setFormData({ ...formData, complianceScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="innovationScore">Innovation Score *</Label>
                <Input
                  id="innovationScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.innovationScore || 80}
                  onChange={(e) => setFormData({ ...formData, innovationScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="overallScore">Overall Score *</Label>
              <Input
                id="overallScore"
                type="number"
                min="0"
                max="100"
                value={formData.overallScore || 80}
                onChange={(e) => setFormData({ ...formData, overallScore: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments || ""}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Additional comments about the evaluation"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvaluation}>Create Evaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Evaluation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Evaluation</DialogTitle>
            <DialogDescription>Update the performance evaluation details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-evaluatedBy">Evaluated By</Label>
              <Input
                id="edit-evaluatedBy"
                value={formData.evaluatedBy || ""}
                onChange={(e) => setFormData({ ...formData, evaluatedBy: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-qualityScore">Quality Score</Label>
                <Input
                  id="edit-qualityScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.qualityScore || 0}
                  onChange={(e) => setFormData({ ...formData, qualityScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-deliveryScore">Delivery Score</Label>
                <Input
                  id="edit-deliveryScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.deliveryScore || 0}
                  onChange={(e) => setFormData({ ...formData, deliveryScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-costScore">Cost Score</Label>
                <Input
                  id="edit-costScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.costScore || 0}
                  onChange={(e) => setFormData({ ...formData, costScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-serviceScore">Service Score</Label>
                <Input
                  id="edit-serviceScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.serviceScore || 0}
                  onChange={(e) => setFormData({ ...formData, serviceScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-complianceScore">Compliance Score</Label>
                <Input
                  id="edit-complianceScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.complianceScore || 0}
                  onChange={(e) => setFormData({ ...formData, complianceScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-innovationScore">Innovation Score</Label>
                <Input
                  id="edit-innovationScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.innovationScore || 0}
                  onChange={(e) => setFormData({ ...formData, innovationScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-overallScore">Overall Score</Label>
              <Input
                id="edit-overallScore"
                type="number"
                min="0"
                max="100"
                value={formData.overallScore || 0}
                onChange={(e) => setFormData({ ...formData, overallScore: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-comments">Comments</Label>
              <Textarea
                id="edit-comments"
                value={formData.comments || ""}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvaluation}>Update Evaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Evaluation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Evaluation Details</DialogTitle>
            <DialogDescription>Complete evaluation information for {selectedEvaluation?.supplierName}</DialogDescription>
          </DialogHeader>
          {selectedEvaluation && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Evaluation ID</Label>
                  <p className="font-medium">{selectedEvaluation.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Supplier</Label>
                  <p className="font-medium">{selectedEvaluation.supplierName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{selectedEvaluation.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Evaluation Date</Label>
                  <p className="font-medium">{new Date(selectedEvaluation.evaluationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Evaluated By</Label>
                  <p className="font-medium">{selectedEvaluation.evaluatedBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={
                      selectedEvaluation.status === "Approved"
                        ? "success"
                        : selectedEvaluation.status === "Submitted"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {selectedEvaluation.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Performance Scores</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Overall Score</Label>
                      <span className="font-medium">{selectedEvaluation.overallScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.overallScore} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Quality Score</Label>
                      <span className="font-medium">{selectedEvaluation.qualityScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.qualityScore} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Delivery Score</Label>
                      <span className="font-medium">{selectedEvaluation.deliveryScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.deliveryScore} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Cost Score</Label>
                      <span className="font-medium">{selectedEvaluation.costScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.costScore} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Service Score</Label>
                      <span className="font-medium">{selectedEvaluation.serviceScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.serviceScore} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Compliance Score</Label>
                      <span className="font-medium">{selectedEvaluation.complianceScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.complianceScore} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between">
                      <Label>Innovation Score</Label>
                      <span className="font-medium">{selectedEvaluation.innovationScore}%</span>
                    </div>
                    <Progress value={selectedEvaluation.innovationScore} />
                  </div>
                </div>
              </div>

              {selectedEvaluation.comments && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Comments</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvaluation.comments}</p>
                </div>
              )}

              {selectedEvaluation.issues && selectedEvaluation.issues.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Performance Issues</h4>
                  <div className="space-y-2">
                    {selectedEvaluation.issues.map((issue) => (
                      <div key={issue.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{issue.type}</span>
                          <Badge
                            variant={
                              issue.resolved
                                ? "success"
                                : issue.severity === "High"
                                  ? "destructive"
                                  : issue.severity === "Medium"
                                    ? "warning"
                                    : "outline"
                            }
                          >
                            {issue.resolved ? "Resolved" : issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          Date: {new Date(issue.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvaluation.recommendations && selectedEvaluation.recommendations.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedEvaluation.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Evaluation Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evaluation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the evaluation for {selectedEvaluation?.supplierName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvaluation} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Issue Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Performance Issue</DialogTitle>
            <DialogDescription>Document a performance issue for this evaluation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="issueType">Issue Type *</Label>
              <Select value={issueForm.type} onValueChange={(value: string) => setIssueForm({ ...issueForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                  <SelectItem value="Delivery Delay">Delivery Delay</SelectItem>
                  <SelectItem value="Communication Issue">Communication Issue</SelectItem>
                  <SelectItem value="Cost Issue">Cost Issue</SelectItem>
                  <SelectItem value="Compliance Issue">Compliance Issue</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="issueSeverity">Severity</Label>
              <Select value={issueForm.severity} onValueChange={(value: any) => setIssueForm({ ...issueForm, severity: value })}>
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
            <div className="grid gap-2">
              <Label htmlFor="issueDescription">Description *</Label>
              <Textarea
                id="issueDescription"
                value={issueForm.description || ""}
                onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                placeholder="Describe the issue in detail"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIssue}>Add Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Supplier Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Supplier</DialogTitle>
            <DialogDescription>Send a message to {selectedEvaluation?.supplierName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contactSubject">Subject *</Label>
              <Input
                id="contactSubject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Enter message subject"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactMessage">Message *</Label>
              <Textarea
                id="contactMessage"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Enter your message"
                rows={5}
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
    </SidebarInset>
  )
}

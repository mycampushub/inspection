"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  FileQuestion,
  Filter,
  Globe,
  Mail,
  MoreHorizontal,
  Plus,
  PlusCircle,
  RefreshCw,
  Send,
  ThumbsUp,
  Trash2,
  UploadCloud,
  User,
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle,
  FileCheck,
  XCircle,
  XCircle2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { getRFxEventById, getContractByRequestId, getSupplierById, getRFxBySupplierId } from "@/lib/data"

export default function RFxEventDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast, notifications, dismiss, rfxEvents, updateRFxEvent, deleteRFxEvent, updateSupplierRFxResponse, approveContract } = useAppStore()

  const rfxEvent = getRFxEventById(params.id || "")
  const relatedContract = rfxEvent ? getContractByRequestId(rfxEvent.id) : undefined
  const relatedSupplier = relatedContract ? getSupplierById(relatedContract.supplierId) : undefined
  const supplierResponses = rfxEvent.suppliers.filter((s) => s.responseStatus === "Submitted" || s.responseStatus === "Selected")
  const winningSupplier = supplierResponses.length > 0 ? supplierResponses.sort((a, b) => (b.score || 0) - (a.score || 0))[0] : null

  const [newComment, setNewComment] = useState("")
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(winningSupplier?.id || "")
  const [showSelectWinnerDialog, setShowSelectWinnerDialog] = useState(false)

  const handleApprove = (supplierId: string) => {
    if (!rfxEvent) return

    if (relatedContract) {
      // If there's a related contract, approve it first
      approveContract(relatedContract.id)
    }

    updateRFxEvent(rfxEvent.id, {
      status: "Closed",
      progress: 100,
    })

    if (supplierId) {
      // Mark supplier as selected
      setSelectedWinnerId(supplierId)
      setShowSelectWinnerDialog(true)
    } else {
      setShowApproveDialog(true)
    }

    toast({
      title: "RFx Event Closed",
      description: `RFx event ${rfxEvent.id} has been closed and supplier selected.`,
      variant: "success",
    })
    setShowApproveDialog(false)
  }

  const handleDelete = () => {
    if (!rfxEvent) return
    deleteRFxEvent(rfxEvent.id)
    setShowDeleteDialog(false)
    router.push("/sourcing-contracts/rfx")
  }

  const handleAddComment = () => {
    if (!rfxEvent || !newComment.trim()) return

    toast({
      title: "Comment Added",
      description: "Your comment has been added.",
      variant: "success",
    })
    setNewComment("")
  }

  const handleSelectWinner = () => {
    if (!rfxEvent || !selectedWinnerId) return

    updateRFxEvent(rfxEvent.id, {
      status: "Closed",
      progress: 100,
    })

    // If there's a related contract, approve it
    if (relatedContract && relatedContract.status === "Pending Approval") {
      approveContract(relatedContract.id)
    }

    toast({
      title: "Winner Selected",
      description: `Selected ${rfxEvent.suppliers.find(s => s.id === selectedWinnerId)?.name || "Unknown"} as winner`,
      variant: "success",
    })
    setShowSelectWinnerDialog(false)
    setSelectedWinnerId("")
  }

  const handleUpdateProgress = (progress: number) => {
    if (!rfxEvent) return
    updateRFxEvent(rfxEvent.id, { progress })
  }

  if (!rfxEvent) {
    return (
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" asChild onClick={() => router.push("/sourcing-contracts/rfx")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-lg font-semibold">RFx Event Not Found</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>RFx event not found.</p>
        </div>
      </SidebarInset>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Draft":
        return "outline"
      case "Evaluation":
        return "warning"
      case "Closed":
        return "success"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "RFP":
        return "blue"
      case "RFQ":
        return "purple"
      case "RFI":
        return "emerald"
      default:
        return "gray"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RFP":
        return Briefcase
      case "RFQ":
        return FileQuestion
      case "RFI":
        return FileText
      default:
        return FileText
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild onClick={() => router.push("/sourcing-contracts/rfx")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center text-lg font-semibold">RFx Event Details</div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Refreshed", description: "Data refreshed", variant: "success" })}>
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
              <DropdownMenuItem onClick={() => router.push("/sourcing-contracts/rfx")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
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
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
                  {getTypeIcon(rfxEvent.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{rfxEvent.title}</h1>
                    <Badge variant="outline">{rfxEvent.id}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={getStatusColor(rfxEvent.status)}>{rfxEvent.status}</Badge>
                    <span>•</span>
                    <Badge variant={getTypeColor(rfxEvent.type)}>{rfxEvent.type}</Badge>
                    <span>•</span>
                    <span>{rfxEvent.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {rfxEvent.status === "Draft" && (
                  <Button onClick={() => handleUpdateProgress(20)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Activate Event
                  </Button>
                )}
                {rfxEvent.status === "Active" && (
                  <Button onClick={() => handleUpdateProgress(Math.min(rfxEvent.progress + 10, 100))}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Progress
                  </Button>
                )}
              </div>
            </div>
            <Separator />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Information */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>RFx Type</CardTitle>
                    <CardDescription>Type of request for proposals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex items-center gap-2">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary-foreground">
                        {getTypeIcon(rfxEvent.type)}
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{rfxEvent.type}</p>
                        <p className="text-xs text-muted-700">
                          {rfxEvent.type === "RFP" ? "Request for Proposals" :
                            rfxEvent.type === "RFQ" ? "Request for Quotes" : "Request for Information"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department</CardTitle>
                    <CardDescription>Owner Department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{rfxEvent.department}</p>
                        <p className="text-xs text-muted-700">
                          {rfxEvent.createdBy} created this event
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                    <CardDescription>Important Dates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-700">Created Date</span>
                        <span className="text-sm font-medium">{new Date(rfxEvent.createdDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-700">Due Date</span>
                        <span className={`text-sm font-medium ${new Date(rfxEvent.dueDate) < new Date() ? "text-red-600" : ""}`}>
                          {new Date(rfxEvent.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-700">Last Updated</span>
                        <span className="text-sm font-medium">Today</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  <CardDescription>Event Progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-700">Current Progress</span>
                        <span className="text-sm font-medium">{rfxEvent.progress}%</span>
                      </div>
                      <Progress value={rfxEvent.progress} className="h-3" />
                      <div className="flex items-center justify-between text-xs text-muted-700">
                        <span>Started: {new Date(rfxEvent.createdDate).toLocaleDateString()}</span>
                        <span>{new Date(rfxEvent.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>What we need from suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rfxEvent.requirements.length > 0 ? (
                      <ul className="space-y-2">
                        {rfxEvent.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">•</span>
                            </div>
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-500 py-4">No requirements specified for this RFx event.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                  <CardTitle>How suppliers will be evaluated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rfxEvent.evaluationCriteria.map((criterion, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{criterion.name}</span>
                          <Badge variant="outline">{criterion.weight}% weight</Badge>
                        </div>
                        <p className="text-sm text-muted-700">{criterion.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participating Suppliers</CardTitle>
                  <CardDescription>Responded suppliers and their proposals</CardDescription>
                </CardHeader>
                <CardContent>
                    {rfxEvent.suppliers.length > 0 ? (
                      <div className="space-y-4">
                        {rfxEvent.suppliers.map((supplier, index) => (
                          <Card key={supplier.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-10 w-10 border-2">
                                    <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold text-sm">{supplier.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-400">
                                      <Badge
                                        variant={
                                          supplier.status === "Selected"
                                            ? "success"
                                            : supplier.responseStatus === "Submitted"
                                              ? "default"
                                              : "outline"
                                        }
                                      >
                                        {supplier.responseStatus}
                                      </Badge>
                                      {supplier.responseStatus === "Submitted" && supplier.score !== null && (
                                        <div className="text-xs font-medium">
                                          Score: <span className={getPerformanceColor(supplier.score)}>{supplier.score}%</span>
                                        </div>
                                      )}
                                    </div>
                                    {supplier.responseDate && (
                                      <p className="text-xs text-muted-400">
                                        Responded {new Date(supplier.responseDate).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {supplier.proposalAmount && (
                                      <div className="text-right text-sm">
                                        ${new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                          maximumFractionDigits: 0,
                                        }).format(supplier.proposalAmount)}
                                      </div>
                                    )}
                                    {supplier.responseStatus === "Selected" && (
                                      <Badge className="bg-green-500 text-white">Winner</Badge>
                                    )}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {supplier.responseStatus === "Submitted" && (
                                          <DropdownMenuItem onClick={() => handleApprove(supplier.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                            Select as Winner
                                          </DropdownMenuItem>
                                        )}
                                        {supplier.status === "Invited" && (
                                          <>
                                            <DropdownMenuItem onClick={() => {
                                              updateSupplierRFxResponse(rfxEvent.id, supplier.id, 85, "Submitted")
                                            }}>
                                              <PlusCircle className="mr-2 h-4 w-4" />
                                              Add Response
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-500 text-center py-8">
                          No suppliers have responded to this RFx event yet.
                        </p>
                      )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Summary</CardTitle>
                  <CardDescription>How suppliers will be evaluated</CardDescription>
                </CardHeader>
                <CardContent>
                      {rfxEvent.suppliers.filter(s => s.responseStatus === "Submitted").length > 0 ? (
                        <div className="space-y-4">
                          {rfxEvent.suppliers.filter(s => s.responseStatus === "Submitted").map((supplier, index) => {
                            return (
                            <div key={supplier.id} className="p-4 border rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold text-sm">{supplier.name}</h4>
                                    <p className="text-xs text-muted-400">{supplier.category}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-xs">
                                    {supplier.responseStatus}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {rfxEvent.evaluationCriteria.map((criterion) => {
                                  const supplierScore = supplier.score || 0
                                  const weightedScore = Math.round((supplierScore * criterion.weight) / 100)
                                  return (
                                    <div key={criterion.name} className="flex items-center justify-between text-sm">
                                      <span className="flex-1">{criterion.name}</span>
                                    <span className="text-muted-400 w-8 text-right">{criterion.weight}%</span>
                                    <div className="w-20">
                                      <Progress value={weightedScore} className="h-1.5" />
                                    </div>
                                    <span className="text-xs text-muted-400">{weightedScore} pts</span>
                                  </div>
                                )
                                })}
                              </div>
                            </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-500 text-center py-8">
                          No supplier responses to evaluate yet.
                        </p>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" size="sm" onClick={() => toast({ title: "Email Sent", description: "Email notification sent to all suppliers", variant: "success" })}>
                <Mail className="mr-2 h-4 w-4" />
                Remind Suppliers
              </Button>
              <Button className="w-full justify-start" size="sm" onClick={() => toast({ title: "Reminder Sent", description: "Reminders sent to all suppliers", variant: "success" })}>
                <Clock className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
              {rfxEvent.status !== "Draft" && (
                <>
                  <Button className="w-full justify-start" size="sm" onClick={() => toast({ title: "Report Generated", description: "Analysis report generated", variant: "success" })}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  {rfxEvent.status === "Evaluation" && (
                    <Button className="w-full justify-start" size="sm" onClick={() => setShowSelectWinnerDialog(true)}>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Select Winner
                    </Button>
                  )}
                </>
              )}
              <Button className="w-full justify-start text-destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Select Winner Dialog */}
      <Dialog open={showSelectWinnerDialog} onOpenChange={setShowSelectWinnerDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Winning Supplier</DialogTitle>
            <DialogDescription>
              Choose the winning supplier for this RFx event. This will create a contract with the selected supplier.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-700 mb-4">
              Select a winning supplier from the list below. This will generate a contract with the selected supplier.
            </p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {rfxEvent.suppliers.filter(s => s.responseStatus === "Submitted").map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedWinnerId(supplier.id)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedWinnerId === supplier.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{supplier.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{supplier.name}</p>
                        <Badge variant="outline" className="text-xs">{supplier.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {supplier.score !== null && (
                        <Badge variant="outline" className="text-xs">
                          Score: {supplier.score}%
                        </Badge>
                      )}
                      {supplier.proposalAmount && (
                        <Badge variant="outline" className="text-xs">
                          ${new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(supplier.proposalAmount)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSelectWinnerDialog(false)}>Cancel</Button>
            <Button onClick={handleSelectWinner} disabled={!selectedWinnerId}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Select This Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete RFx Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this RFx event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

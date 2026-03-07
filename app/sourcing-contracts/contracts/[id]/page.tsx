"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Ban,
  Trash2,
  FileCheck,
  XCircle,
  AlertTriangle,
  RotateCcw,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  Building2,
  DollarSign,
  FileWarning,
} from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { getContractById, getRequestsByContractId, getSupplierById } from "@/lib/data"

export default function ContractDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast, notifications, dismiss, contracts, updateContract, approveContract, renewContract, terminateContract, deleteContract, addDocumentToContract } = useAppStore()

  const contract = getContractById(params.id || "")
  const relatedRequests = contract ? getRequestsByContractId(contract.id) : []
  const supplier = contract ? getSupplierById(contract.supplierId) : undefined

  const [showRenewDialog, setShowRenewDialog] = useState(false)
  const [newEndDate, setNewEndDate] = useState("")
  const [showTerminateDialog, setShowTerminateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRenew = () => {
    if (!contract) return
    renewContract(contract.id, newEndDate)
    setShowRenewDialog(false)
    setNewEndDate("")
  }

  const handleTerminate = () => {
    if (!contract) return
    terminateContract(contract.id)
    setShowTerminateDialog(false)
  }

  const handleDelete = () => {
    if (!contract) return
    deleteContract(contract.id)
    setShowDeleteDialog(false)
    router.push("/sourcing-contracts/contracts")
  }

  const handleApprove = () => {
    if (!contract) return
    approveContract(contract.id)
    toast({
      title: "Contract Approved",
      description: `Contract ${contract.id} has been approved.`,
      variant: "success",
    })
  }

  const handleStatusChange = (status: string) => {
    if (!contract) return
    if (status === "Approve") {
      handleApprove()
    } else if (status === "Terminate") {
      setShowTerminateDialog(true)
    } else if (status === "Delete") {
      handleDelete()
    }
  }

  if (!contract) {
    return (
      </>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" onClick={() => router.push("/sourcing-contracts/contracts")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-lg font-semibold">Contract Not Found</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Contract not found.</p>
        </div>
      </>
    )
  }

  const getDaysLeftColor = (days: number | null) => {
    if (days === null) return "text-muted-foreground"
    if (days <= 30) return "text-red-600 font-medium"
    if (days <= 90) return "text-amber-600 font-medium"
    return "text-green-600 font-medium"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Pending Approval":
        return "warning"
      case "Expired":
        return "secondary"
      case "Terminated":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      "Service Agreement": "blue",
      "Purchase Agreement": "purple",
      "Master Service Agreement": "indigo",
      "License Agreement": "cyan",
      "Statement of Work": "emerald",
      "Lease Agreement": "orange",
    }
    return typeColors[type] || "gray"
  }

  const getTypeVariant = (type: string): "default" | "secondary" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      "Service Agreement": "default",
      "Purchase Agreement": "secondary",
      "Master Service Agreement": "default",
      "License Agreement": "outline",
      "Statement of Work": "secondary",
      "Lease Agreement": "default",
    }
    return variants[type] || "outline"
  }

  return (
    </>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" onClick={() => router.push("/sourcing-contracts/contracts")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center text-lg font-semibold">Contract Details</div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More Actions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowRenewDialog(true)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Renew Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTerminateDialog(true)} className="text-red-600">
                <Ban className="mr-2 h-4 w-4" />
                Terminate Contract
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Contract
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
          {/* Contract Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold">{contract.title}</h1>
                  <Badge variant="outline">{contract.id}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant={getStatusColor(contract.status)}>{contract.status}</Badge>
                  <span>•</span>
                  <Badge variant={getTypeVariant(contract.type)}>{contract.type}</Badge>
                  <span>•</span>
                  <span>{contract.department}</span>
                  {contract.daysToExpiry !== null && (
                    <Badge variant={contract.daysToExpiry <= 30 ? "destructive" : contract.daysToExpiry <= 90 ? "warning" : "outline"}>
                      {contract.daysToExpiry} days left
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {contract.status === "Pending Approval" && (
                  <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Approve Contract
                  </Button>
                )}
              </div>
            </div>
            <Separator />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Contract Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="related">Related Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(contract.value)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total contract value
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Contract Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-medium">
                      {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-700">
                      {(new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 24 * 60 * 1000) / (1000 * 60 * 24 * 60 * 1000)} months
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Days to Expiry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contract.daysToExpiry !== null ? (
                      </>
                        <div className="text-3xl font-bold">{contract.daysToExpiry} days</div>
                        <p className="text-xs text-muted-700">
                          {contract.daysToExpiry <= 30 ? "Urgent attention required" : contract.daysToExpiry <= 90 ? "Plan for renewal" : "Good standing"}
                        </p>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Department</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-medium">{contract.department}</p>
                    <p className="text-xs text-muted-700">
                      Owning department
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {contract.description}
                  </p>
                </CardContent>
              </Card>

              {/* Contract Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Payment Terms</Label>
                    <p className="text-sm text-muted-foreground">{contract.paymentTerms}</p>
                  </div>
                  <div>
                    <Label>Renewal Terms</Label>
                    <p className="text-sm text-muted-foreground">{contract.renewalTerms}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Supplier Name</Label>
                    <p className="text-sm font-medium">
                      {supplier ? (
                        <Link href={`/supplier-management/directory/${supplier.id}`} className="text-primary hover:underline">
                          {supplier.name}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  {supplier && (
                    </>
                      <div>
                        <Label>Contact Person</Label>
                        <p className="text-sm text-muted-foreground">
                          {supplier.contactName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <a href={`mailto:${supplier.contactEmail}`} className="text-primary hover:underline">
                            <Mail className="h-3 w-3" />
                            {supplier.contactEmail}
                          </a>
                          <a href={`tel:${supplier.contactPhone}`} className="text-primary hover:underline">
                            <Phone className="h-3 w-3" />
                            {supplier.contactPhone}
                          </a>
                        </div>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <p className="text-sm text-muted-400">
                          {supplier.location}
                        </p>
                      </div>
                    </>
                  )}
                  {supplier && (
                    <div>
                      <Label>Supplier Tier</Label>
                      <Badge variant={supplier.tier === "Strategic" ? "default" : supplier.tier === "Preferred" ? "secondary" : "outline"}>
                        {supplier.tier} Tier
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <p className="text-sm font-medium">{contract.contactName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <a href={`mailto:${contract.contactEmail}`} className="text-primary hover:underline text-sm">
                        {contract.contactEmail}
                      </a>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <a href={`tel:${contract.contactPhone}`} className="text-primary hover:underline text-sm">
                        {contract.contactPhone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Contract Type</Label>
                      <Badge variant={getTypeVariant(contract.type)}>{contract.type}</Badge>
                    </div>
                    <div>
                      <Label>Contract ID</Label>
                      <p className="text-sm font-medium">{contract.id}</p>
                    </div>
                    <div>
                      <Label>Created Date</Label>
                      <p className="text-sm font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Created By</Label>
                      <p className="text-sm font-medium">System</p>
                    </div>
                  </div>
                  <div>
                    <Label>Updated Date</Label>
                    <p className="text-sm font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Effective Date</Label>
                    <p className="text-sm font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Expiration Date</Label>
                    <p className="text-sm font-medium">
                      {contract.daysToExpiry !== null ? new Date(contract.endDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Contract Duration</Label>
                    <p className="text-sm text-muted-foreground">
                      {contract.daysToExpiry !== null
                        ? `${contract.daysToExpiry} days remaining`
                        : "Expired"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Documents</CardTitle>
                  <CardDescription>Downloadable documents related to this contract</CardDescription>
                </CardHeader>
                <CardContent>
                  {contract.documents && contract.documents.length > 0 ? (
                    <div className="space-y-2">
                      {contract.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-sm font-medium">{doc.name}</span>
                              <span className="text-xs text-muted-400 ml-2">{doc.size}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-500 text-center py-8">
                      No documents available for this contract.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Contract Package
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      View Full Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="related" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Related Data</CardTitle>
                  <CardDescription>Connected data and related entities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Related Procurement Requests */}
                  <div>
                    <Label className="mb-2">Related Procurement Requests</Label>
                    {relatedRequests.length > 0 ? (
                      <div className="space-y-2">
                        {relatedRequests.map((req) => (
                          <Link
                            key={req.id}
                            href={`/procurement-requests/${req.id}`}
                            className="block p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{req.title}</p>
                                <Badge variant={req.status === "Approved" ? "success" : req.status === "Rejected" ? "destructive" : "outline"}>
                                  {req.status}
                                </Badge>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-400" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-500 py-4">
                        No related procurement requests found.
                      </p>
                    )}
                  </div>

                  {/* Related Supplier */}
                  <div>
                    <Label className="mb-2">Supplier</Label>
                    {supplier ? (
                      <Link
                        href={`/supplier-management/directory/${supplier.id}`}
                        className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                          <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{supplier.name}</p>
                          <p className="text-xs text-muted-400">{supplier.category}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-400" />
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-500 py-4">
                        No supplier information available.
                      </p>
                    )}
                  </div>

                  {/* Related RFx Events */}
                  <div>
                    <Label className="mb-2">Related RFx Events</Label>
                    {contract.relatedRequestId ? (
                      <p className="text-sm text-green-600 py-2">
                        This contract was created from procurement request PR-{contract.relatedRequestId}.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-500 py-2">
                        No related RFx events found.
                      </p>
                    )}
                  </div>
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
              <Button className="w-full justify-start" variant="outline" onClick={() => setShowRenewDialog(true)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Renew Contract
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setShowTerminateDialog(true)}>
                <Ban className="mr-2 h-4 w-4 text-red-500" />
                Terminate Contract
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push(`/sourcing-contracts/contracts`)}>
                <Briefcase className="mr-2 h-4 w-4" />
                View All Contracts
              </Button>
              <Button className="w-full justify-start text-destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Contract
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Renew Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
            <DialogDescription>
              Set the new end date for the contract renewal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="renew-date">New End Date *</Label>
              <Input
                id="renew-date"
                type="date"
                min={new Date(contract.endDate).toISOString().split('T')[0]}
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-700">
              Current end date: {new Date(contract.endDate).toLocaleDateString()}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>Cancel</Button>
            <Button onClick={handleRenew}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Renew Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Dialog */}
      <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to terminate this contract? This will immediately end the contract and affect all related services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminate} className="bg-red-600 hover:bg-red-700">
              <Ban className="mr-2 h-4 w-4" />
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contract? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

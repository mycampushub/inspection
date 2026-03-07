"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpDown, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2, CheckCircle, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"

export default function ProcurementRequests() {
  const router = useRouter()
  const { toast, notifications, dismiss } = useToast()
  const {
    procurementRequests,
    addProcurementRequest,
    updateProcurementRequest,
    deleteProcurementRequest,
    approveProcurementRequest,
    rejectProcurementRequest,
  } = useAppStore()

  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    department: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    amount: "",
    requester: "Current User",
    requesterEmail: "current.user@company.com",
    category: "",
    justification: "",
    deliveryDate: "",
  })

  const [rejectComment, setRejectComment] = useState("")

  const handleCreateRequest = () => {
    if (!newRequest.title || !newRequest.department || !newRequest.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addProcurementRequest({
      title: newRequest.title,
      description: newRequest.description,
      department: newRequest.department,
      priority: newRequest.priority,
      amount: parseFloat(newRequest.amount) || 0,
      requester: newRequest.requester,
      requesterEmail: newRequest.requesterEmail,
      category: newRequest.category,
      justification: newRequest.justification,
      deliveryDate: newRequest.deliveryDate,
      items: [],
    })

    setShowNewRequestDialog(false)
    setNewRequest({
      title: "",
      description: "",
      department: "",
      priority: "Medium",
      amount: "",
      requester: "Current User",
      requesterEmail: "current.user@company.com",
      category: "",
      justification: "",
      deliveryDate: "",
    })
  }

  const handleEditRequest = () => {
    if (!selectedRequest) return

    updateProcurementRequest(selectedRequest, {
      title: newRequest.title,
      description: newRequest.description,
      department: newRequest.department,
      priority: newRequest.priority,
      amount: parseFloat(newRequest.amount) || 0,
      category: newRequest.category,
      justification: newRequest.justification,
    })

    setShowEditDialog(false)
    setSelectedRequest(null)
    toast({
      title: "Request Updated",
      description: "Procurement request has been updated successfully.",
      variant: "success",
    })
  }

  const handleApprove = () => {
    if (!selectedRequest) return
    approveProcurementRequest(selectedRequest, "Approved by user")
    setShowApproveDialog(false)
    setSelectedRequest(null)
  }

  const handleReject = () => {
    if (!selectedRequest) return
    rejectProcurementRequest(selectedRequest, rejectComment || "Rejected by user")
    setShowRejectDialog(false)
    setSelectedRequest(null)
    setRejectComment("")
  }

  const handleDelete = () => {
    if (!selectedRequest) return
    deleteProcurementRequest(selectedRequest)
    setShowDeleteDialog(false)
    setSelectedRequest(null)
  }

  const openEditDialog = (requestId: string) => {
    const request = procurementRequests.find((r) => r.id === requestId)
    if (request) {
      setSelectedRequest(requestId)
      setNewRequest({
        title: request.title,
        description: request.description,
        department: request.department,
        priority: request.priority,
        amount: request.amount.toString(),
        requester: request.requester,
        requesterEmail: request.requesterEmail,
        category: request.category,
        justification: request.justification,
        deliveryDate: request.deliveryDate,
      })
      setShowEditDialog(true)
    }
  }

  // Filter requests based on search, status, and priority
  const filteredRequests = procurementRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Filter requests based on tab
  const tabFilteredRequests =
    selectedTab === "all"
      ? filteredRequests
      : filteredRequests.filter((request) => {
          if (selectedTab === "pending") return request.status === "Pending Approval"
          if (selectedTab === "approved") return request.status === "Approved"
          if (selectedTab === "rejected") return request.status === "Rejected"
          if (selectedTab === "draft") return request.status === "Draft"
          return true
        })

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(new Set(tabFilteredRequests.map((r) => r.id)))
    } else {
      setSelectedRequests(new Set())
    }
  }

  const toggleSelectRequest = (id: string) => {
    const newSet = new Set(selectedRequests)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedRequests(newSet)
  }

  return (
    <>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Procurement Requests</div>
        <div className="ml-auto flex items-center gap-4">
          <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Procurement Request</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new procurement request. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter request title"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need to procure..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea
                    id="justification"
                    placeholder="Explain why this procurement is needed..."
                    value={newRequest.justification}
                    onChange={(e) => setNewRequest({ ...newRequest, justification: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={newRequest.department}
                      onValueChange={(value) => setNewRequest({ ...newRequest, department: value })}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={newRequest.priority}
                      onValueChange={(value) => setNewRequest({ ...newRequest, priority: value as "High" | "Medium" | "Low" })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Estimated Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newRequest.amount}
                      onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={newRequest.deliveryDate}
                      onChange={(e) => setNewRequest({ ...newRequest, deliveryDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., IT Equipment, Office Supplies"
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRequest}>Create Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Requests ({procurementRequests.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({procurementRequests.filter(r => r.status === 'Pending Approval').length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({procurementRequests.filter(r => r.status === 'Approved').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({procurementRequests.filter(r => r.status === 'Rejected').length})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({procurementRequests.filter(r => r.status === 'Draft').length})</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Procurement Requests</CardTitle>
                <CardDescription>View and manage all procurement requests across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedRequests.size === tabFilteredRequests.length && tabFilteredRequests.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabFilteredRequests.map((request) => (
                        <TableRow
                          key={request.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/procurement-requests/${request.id}`)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedRequests.has(request.id)}
                              onCheckedChange={() => toggleSelectRequest(request.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "Approved"
                                  ? "success"
                                  : request.status === "Rejected"
                                    ? "destructive"
                                    : request.status === "Pending Approval"
                                      ? "warning"
                                      : "outline"
                              }
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.priority === "High"
                                  ? "destructive"
                                  : request.priority === "Medium"
                                    ? "warning"
                                    : "outline"
                              }
                            >
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(request.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/procurement-requests/${request.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(request.id)}>Edit Request</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {request.status === "Pending Approval" && (
                                  <>
                                    <DropdownMenuItem onClick={() => { setSelectedRequest(request.id); setShowApproveDialog(true); }}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSelectedRequest(request.id); setShowRejectDialog(true); }}>
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem
                                  onClick={() => { setSelectedRequest(request.id); setShowDeleteDialog(true); }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {tabFilteredRequests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="h-24 text-center">
                            No requests found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Requests awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabFilteredRequests.map((request) => (
                        <TableRow
                          key={request.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/procurement-requests/${request.id}`)}
                        >
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={request.priority === "High" ? "destructive" : request.priority === "Medium" ? "warning" : "outline"}>
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(request.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedRequest(request.id); setShowApproveDialog(true); }}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedRequest(request.id); setShowRejectDialog(true); }}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Approved Requests</CardTitle>
                <CardDescription>Requests that have been approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabFilteredRequests.map((request) => (
                        <TableRow
                          key={request.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/procurement-requests/${request.id}`)}
                        >
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(request.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Rejected Requests</CardTitle>
                <CardDescription>Requests that have been rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabFilteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(request.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="draft" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Draft Requests</CardTitle>
                <CardDescription>Requests that are still in draft status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabFilteredRequests.map((request) => (
                        <TableRow
                          key={request.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/procurement-requests/${request.id}`)}
                        >
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(request.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(request.id)}>Edit Draft</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => { setSelectedRequest(request.id); setShowDeleteDialog(true); }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Procurement Request</DialogTitle>
            <DialogDescription>Update the details of this procurement request.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={newRequest.department}
                  onValueChange={(value) => setNewRequest({ ...newRequest, department: value })}
                >
                  <SelectTrigger id="edit-department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={newRequest.priority}
                  onValueChange={(value) => setNewRequest({ ...newRequest, priority: value as "High" | "Medium" | "Low" })}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Estimated Amount (USD)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={newRequest.amount}
                onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditRequest}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Procurement Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this procurement request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Procurement Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this procurement request? Please provide a reason for rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="reject-reason">Reason for Rejection</Label>
            <Textarea
              id="reject-reason"
              placeholder="Enter the reason for rejection..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Procurement Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this procurement request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

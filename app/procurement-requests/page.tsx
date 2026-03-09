"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, MoreHorizontal, Plus, Search, SlidersHorizontal, X, Trash2, Edit, Eye, CheckCircle, XCircle } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { localProcurementRequests, type ProcurementItem as LocalProcurementItem } from "@/lib/local-data"

export default function ProcurementRequests() {
  const [requests, setRequests] = useState<LocalProcurementItem[]>(localProcurementRequests)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // UI States
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Dialog States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LocalProcurementItem | null>(null)
  
  // Form States
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requester: "",
    department: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    amount: 0,
    status: "Draft" as "Draft" | "Pending Approval",
    items: [] as LocalProcurementItem["items"],
  })
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unitPrice: 0 })
  const [rejectComments, setRejectComments] = useState("")
  const [approveComments, setApproveComments] = useState("")
  
  // Fetch requests from local data (no API call needed)
  const fetchRequests = async () => {
    setLoading(false)
    // Data is already in state, no API call needed
    // Filters are applied via filteredRequests computed below
  }
  
  // No need to fetch on mount since data is already loaded
  // Filters work via client-side filtering in filteredRequests
  
  // Filter requests based on search, status, priority, and tabs (client-side)
  const filteredRequests = requests.filter((request) => {
    // Tab filter
    if (selectedTab === "pending" && request.status !== "Pending Approval") return false
    if (selectedTab === "approved" && request.status !== "Approved") return false
    if (selectedTab === "rejected" && request.status !== "Rejected") return false
    if (selectedTab === "draft" && request.status !== "Draft") return false
    
    // Status filter
    if (selectedStatus !== "all" && request.status !== selectedStatus) return false
    
    // Priority filter
    if (selectedPriority !== "all" && request.priority !== selectedPriority) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        request.title.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query) ||
        request.requester.toLowerCase().includes(query) ||
        request.department.toLowerCase().includes(query)
      )
    }
    
    return true
  })
  
  // Select all handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)))
    } else {
      setSelectedIds(new Set())
    }
  }
  
  // Individual select handler
  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds)
    if (checked) {
      newSelectedIds.add(id)
    } else {
      newSelectedIds.delete(id)
    }
    setSelectedIds(newSelectedIds)
  }
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requester: "",
      department: "",
      priority: "Medium",
      amount: 0,
      status: "Draft",
      items: [],
    })
    setNewItem({ name: "", quantity: 1, unitPrice: 0 })
  }
  
  // Open create dialog
  const handleOpenCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }
  
  // Open edit dialog
  const handleOpenEditDialog = (request: LocalProcurementItem) => {
    setSelectedRequest(request)
    setFormData({
      title: request.title,
      description: request.description || "",
      requester: request.requester,
      department: request.department,
      priority: request.priority,
      amount: request.amount,
      status: request.status,
      items: request.items || [],
    })
    setIsEditDialogOpen(true)
  }
  
  // Open view dialog
  const handleOpenViewDialog = (request: LocalProcurementItem) => {
    setSelectedRequest(request)
    setIsViewDialogOpen(true)
  }
  
  // Open delete dialog
  const handleOpenDeleteDialog = (request: LocalProcurementItem) => {
    setSelectedRequest(request)
    setIsDeleteDialogOpen(true)
  }
  
  // Open approve dialog
  const handleOpenApproveDialog = (request: LocalProcurementItem) => {
    setSelectedRequest(request)
    setApproveComments("")
    setIsApproveDialogOpen(true)
  }
  
  // Open reject dialog
  const handleOpenRejectDialog = (request: LocalProcurementItem) => {
    setSelectedRequest(request)
    setRejectComments("")
    setIsRejectDialogOpen(true)
  }
  
  // Create request
  const handleCreateRequest = async () => {
    try {
      // Calculate total amount from items if not set
      let totalAmount = formData.amount
      if (formData.items.length > 0) {
        totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0)
      }
      
      const newRequest: LocalProcurementItem = {
        id: `PR-2026-${String(requests.length + 1).padStart(3, '0')}`,
        ...formData,
        amount: totalAmount,
        status: "Pending Approval",
        currency: "USD",
        createdAt: new Date().toISOString(),
        approvalHistory: [
          {
            action: "Created",
            by: formData.requester,
            at: new Date().toISOString()
          },
          {
            action: "Submitted",
            by: formData.requester,
            at: new Date().toISOString()
          }
        ]
      }
      
      // Update state directly
      setRequests([...requests, newRequest])
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (err) {
      setError("Failed to create request")
      console.error(err)
    }
  }
  
  // Update request
  const handleUpdateRequest = async () => {
    if (!selectedRequest) return
    
    try {
      let totalAmount = formData.amount
      if (formData.items.length > 0) {
        totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0)
      }
      
      const updatedRequest: LocalProcurementItem = {
        ...selectedRequest,
        ...formData,
        amount: totalAmount,
      }
      
      // Update state directly
      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r))
      setIsEditDialogOpen(false)
      setSelectedRequest(null)
      resetForm()
    } catch (err) {
      setError("Failed to update request")
      console.error(err)
    }
  }
  
  // Delete request
  const handleDeleteRequest = async () => {
    if (!selectedRequest) return
    
    try {
      // Update state directly
      setRequests(requests.filter(r => r.id !== selectedRequest.id))
      setIsDeleteDialogOpen(false)
      setSelectedRequest(null)
    } catch (err) {
      setError("Failed to delete request")
      console.error(err)
    }
  }
  
  // Approve request
  const handleApproveRequest = async () => {
    if (!selectedRequest) return
    
    try {
      const approvalHistoryEntry = {
        action: "Approved",
        by: "Admin",
        at: new Date().toISOString(),
        comments: approveComments || undefined,
      }
      
      const updatedRequest: LocalProcurementItem = {
        ...selectedRequest,
        status: "Approved",
        approvalHistory: [...(selectedRequest.approvalHistory || []), approvalHistoryEntry],
      }
      
      // Update state directly
      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r))
      setIsApproveDialogOpen(false)
      setSelectedRequest(null)
      setApproveComments("")
    } catch (err) {
      setError("Failed to approve request")
      console.error(err)
    }
  }
  
  // Reject request
  const handleRejectRequest = async () => {
    if (!selectedRequest) return
    
    try {
      const approvalHistoryEntry = {
        action: "Rejected",
        by: "Admin",
        at: new Date().toISOString(),
        comments: rejectComments || undefined,
      }
      
      const updatedRequest: LocalProcurementItem = {
        ...selectedRequest,
        status: "Rejected",
        approvalHistory: [...(selectedRequest.approvalHistory || []), approvalHistoryEntry],
      }
      
      // Update state directly
      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r))
      setIsRejectDialogOpen(false)
      setSelectedRequest(null)
      setRejectComments("")
    } catch (err) {
      setError("Failed to reject request")
      console.error(err)
    }
  }
  
  // Add item to form
  const handleAddItem = () => {
    if (!newItem.name) return
    
    const item: LocalProcurementItem["items"][0] = {
      name: newItem.name,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: newItem.quantity * newItem.unitPrice,
    }
    
    setFormData({ ...formData, items: [...formData.items, item] })
    setNewItem({ name: "", quantity: 1, unitPrice: 0 })
  }
  
  // Remove item from form
  const handleRemoveItem = (itemName: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.name !== itemName),
    })
  }
  
  // Render table
  const renderTable = (data: LocalProcurementItem[]) => (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedIds.size === data.length && data.length > 0}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
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
          {data.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(request.id)}
                  onCheckedChange={(checked) => handleSelectOne(request.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-medium">{request.id}</TableCell>
              <TableCell>{request.title}</TableCell>
              <TableCell>{request.requester}</TableCell>
              <TableCell>{request.department}</TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
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
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleOpenViewDialog(request)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenEditDialog(request)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Request
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleOpenApproveDialog(request)}
                      disabled={request.status === "Approved"}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenRejectDialog(request)}
                      disabled={request.status === "Rejected"}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleOpenDeleteDialog(request)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </div>
  )
  
  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Procurement Requests</div>
        <div className="ml-auto flex items-center gap-4">
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </div>
          {["all", "pending", "approved", "rejected", "draft"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Procurement Requests</CardTitle>
                  <CardDescription>
                    {tab === "all"
                      ? "View and manage all procurement requests across the organization"
                      : `View and manage ${tab} procurement requests`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 w-full max-w-sm">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full sm:w-[180px] h-9">
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
                        <SelectTrigger className="w-full sm:w-[180px] h-9">
                          <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Advanced
                      </Button>
                    </div>
                  </div>
                  {showAdvancedFilters && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">Advanced Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Additional filter options can be added here (e.g., date range, department, amount range).
                      </p>
                    </div>
                  )}
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-muted-foreground">Loading...</div>
                    </div>
                  ) : (
                    <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                      {renderTable(filteredRequests)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Procurement Request</DialogTitle>
            <DialogDescription>Fill in the details to create a new procurement request.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Request title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requester">Requester *</Label>
                <Input
                  id="requester"
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                  placeholder="Requester name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "Low" | "Medium" | "High") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
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
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Request description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Items</Label>
              <div className="border rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                  <Button onClick={handleAddItem} disabled={!newItem.name}>
                    Add
                  </Button>
                </div>
                {formData.items.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            Qty: {item.quantity} × ${item.unitPrice} = ${item.totalPrice}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Total amount"
              />
              <p className="text-sm text-muted-foreground">
                Calculated from items: ${formData.items.reduce((sum, item) => sum + item.totalPrice, 0)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest} disabled={!formData.title || !formData.requester || !formData.department}>
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Procurement Request</DialogTitle>
            <DialogDescription>Update the procurement request details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Request title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-requester">Requester *</Label>
                <Input
                  id="edit-requester"
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                  placeholder="Requester name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "Low" | "Medium" | "High") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="edit-priority">
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
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Request description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Items</Label>
              <div className="border rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                  <Button onClick={handleAddItem} disabled={!newItem.name}>
                    Add
                  </Button>
                </div>
                {formData.items.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            Qty: {item.quantity} × ${item.unitPrice} = ${item.totalPrice}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Total Amount *</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Total amount"
              />
              <p className="text-sm text-muted-foreground">
                Calculated from items: ${formData.items.reduce((sum, item) => sum + item.totalPrice, 0)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRequest} disabled={!formData.title || !formData.requester || !formData.department}>
              Update Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>Full details of the procurement request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Request ID</Label>
                  <p className="font-medium">{selectedRequest.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedRequest.title}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Requester</Label>
                  <p className="font-medium">{selectedRequest.requester}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{selectedRequest.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={
                      selectedRequest.status === "Approved"
                        ? "success"
                        : selectedRequest.status === "Rejected"
                          ? "destructive"
                          : selectedRequest.status === "Pending Approval"
                            ? "warning"
                            : "outline"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <Badge
                    variant={
                      selectedRequest.priority === "High"
                        ? "destructive"
                        : selectedRequest.priority === "Medium"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>
              {selectedRequest.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
              )}
              {selectedRequest.items && selectedRequest.items.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Items</Label>
                  <div className="border rounded-lg p-4 space-y-2 mt-2">
                    {selectedRequest.items.map((item) => (
                      <div key={item.id} className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.unitPrice} = ${item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Total Amount</Label>
                <p className="font-medium text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(selectedRequest.amount)}
                </p>
              </div>
              {selectedRequest.approvalHistory && selectedRequest.approvalHistory.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Approval History</Label>
                  <div className="border rounded-lg p-4 space-y-2 mt-2">
                    {selectedRequest.approvalHistory.map((history: any, index: number) => (
                      <div key={index} className="p-2 bg-muted rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">{history.action}</span>
                          <span className="text-sm text-muted-foreground">{new Date(history.at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          By: {history.by}
                        </p>
                        {history.comments && (
                          <p className="text-sm mt-1 italic">"{history.comments}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this procurement request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <p className="font-medium">{selectedRequest.title}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRequest}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Confirmation Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this procurement request?
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <p className="font-medium">{selectedRequest.title}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
              <div className="space-y-2 mt-4">
                <Label htmlFor="approve-comments">Comments (optional)</Label>
                <Textarea
                  id="approve-comments"
                  value={approveComments}
                  onChange={(e) => setApproveComments(e.target.value)}
                  placeholder="Add approval comments..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveRequest}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this procurement request?
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <p className="font-medium">{selectedRequest.title}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
              <div className="space-y-2 mt-4">
                <Label htmlFor="reject-comments">Comments</Label>
                <Textarea
                  id="reject-comments"
                  value={rejectComments}
                  onChange={(e) => setRejectComments(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectRequest}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

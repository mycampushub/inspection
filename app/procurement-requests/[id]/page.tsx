"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  ThumbsUp,
  User,
  FileCheck,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { getProcurementRequestById, getContractByRequestId, getSupplierById } from "@/lib/data"

export default function ProcurementRequestDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast, notifications, dismiss } = useToast()
  const { procurementRequests, updateProcurementRequest, approveProcurementRequest, rejectProcurementRequest, addCommentToRequest, addAttachmentToRequest, deleteProcurementRequest } = useAppStore()

  const request = getProcurementRequestById(params.id || "")
  const relatedContract = request ? getContractByRequestId(request.id) : undefined
  const relatedSupplier = request?.relatedSupplierId ? getSupplierById(request.relatedSupplierId) : undefined
  const [newComment, setNewComment] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectComment, setRejectComment] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleApprove = () => {
    if (!request) return
    approveProcurementRequest(request.id, "Approved by reviewer")
    setShowApproveDialog(false)
  }

  const handleReject = () => {
    if (!request) return
    rejectProcurementRequest(request.id, rejectComment)
    setShowRejectDialog(false)
    setRejectComment("")
  }

  const handleDelete = () => {
    if (!request) return
    deleteProcurementRequest(request.id)
    setShowDeleteDialog(false)
    router.push("/procurement-requests")
  }

  const handleAddComment = () => {
    if (!request || !newComment.trim()) return
    addCommentToRequest(request.id, {
      user: "Current User",
      userAvatar: "CU",
      text: newComment,
    })
    setNewComment("")
    toast({
      title: "Comment Added",
      description: "Your comment has been added.",
      variant: "success",
    })
  }

  const handleStatusChange = (status: string) => {
    if (!request) return
    if (status === "Approved") {
      handleApprove()
    } else if (status === "Rejected") {
      setShowRejectDialog(true)
    }
  }

  if (!request) {
    return (
      <>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" onClick={() => router.push("/procurement-requests")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-lg font-semibold">Request Not Found</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Procurement request not found.</p>
        </div>
      </>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      case "Pending Approval":
        return "bg-yellow-500"
      case "Draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" onClick={() => router.push("/procurement-requests")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center text-lg font-semibold">Procurement Request Details</div>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setShowApproveDialog(true)}>
                <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                Approve
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Request</DialogTitle>
                <DialogDescription>
                  Approve this procurement request? This will notify the requester and start the procurement process.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setShowRejectDialog(true)}>
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Request</DialogTitle>
                <DialogDescription>
                  Reject this procurement request? Please provide a reason for rejection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reject-reason">Rejection Reason *</Label>
                  <Textarea
                    id="reject-reason"
                    placeholder="Enter reason for rejection..."
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                Edit Request
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Request
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
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{request.title}</h1>
                <Badge className="text-sm">{request.id}</Badge>
              </div>
              <p className="text-muted-foreground">{request.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={request.status === "Approved" ? "success" : request.status === "Rejected" ? "destructive" : request.status === "Pending Approval" ? "warning" : "outline"}>
                {request.status}
              </Badge>
              <Badge variant={request.priority === "High" ? "destructive" : request.priority === "Medium" ? "warning" : "outline"}>
                {request.priority} Priority
              </Badge>
              <Badge variant="outline">{request.category}</Badge>
            </div>
          </div>
          <Separator />
        </div>

        <div className="grid gap-6">
          {/* Main Content Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Requester</Label>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{request.requester.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.requester}</p>
                        <p className="text-sm text-muted-foreground">{request.requesterEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <p className="font-medium">{request.department}</p>
                  </div>
                  <div>
                    <Label>Date Submitted</Label>
                    <p className="font-medium">{new Date(request.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Expected Delivery</Label>
                    <p className="font-medium">{new Date(request.deliveryDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label>Justification</Label>
                  <p className="text-sm text-muted-foreground">{request.justification}</p>
                </div>
                {relatedContract && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium mb-1">Related Contract</p>
                    <Link href={`/sourcing-contracts/contracts/${relatedContract.id}`} className="text-primary hover:underline text-sm">
                      {relatedContract.title} ({relatedContract.id})
                    </Link>
                  </div>
                )}
                {relatedSupplier && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium mb-1">Related Supplier</p>
                    <Link href={`/supplier-management/directory/${relatedSupplier.id}`} className="text-primary hover:underline text-sm">
                      {relatedSupplier.name} ({relatedSupplier.id})
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Items */}
            <Card>
              <CardHeader>
                <CardTitle>Requested Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ${item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.totalPrice.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={4} className="text-right">Total:</TableCell>
                      <TableCell className="text-right font-bold text-base">
                        ${request.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Approval History */}
            <Card>
              <CardHeader>
                <CardTitle>Approval History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.approvalHistory.map((history, index) => (
                    <div key={history.id} className="flex gap-3 pb-4 last:pb-0 last:border-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{history.action.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{history.action}</p>
                          <span className="text-xs text-muted-foreground">{new Date(history.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{history.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                {request.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {request.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted p-2 rounded">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-500">{attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-500 text-center py-4">No attachments</p>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.comments.length > 0 ? (
                    request.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 pb-4 last:pb-0 last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{comment.userAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{comment.user}</p>
                            <span className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-500 text-center py-4">No comments yet</p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newComment.trim()) {
                        handleAddComment()
                      }
                    }}
                  />
                  <Button onClick={handleAddComment} size="icon" disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status</span>
                    <Badge className={request.status === "Approved" ? "success" : request.status === "Rejected" ? "destructive" : request.status === "Pending Approval" ? "warning" : "outline"}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <Badge className={request.priority === "High" ? "destructive" : request.priority === "Medium" ? "warning" : "outline"}>
                      {request.priority}
                    </Badge>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Request Progress</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Submitted</span>
                          <span>100%</span>
                        </div>
                        <div className="h-2 bg-primary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>
                      {request.status === "Pending Approval" && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Under Review</span>
                            <span>75%</span>
                          </div>
                          <div className="h-2 bg-yellow-500 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-600 rounded-full" style={{ width: "75%" }} />
                          </div>
                        </div>
                      )}
                      {request.status === "Rejected" && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Rejected</span>
                            <span>100%</span>
                          </div>
                          <div className="h-2 bg-red-500 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: "100%" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Request
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Add Attachment
                </Button>
                {request.status !== "Approved" && (
                  <Button className="w-full justify-start" size="sm" onClick={() => handleApprove()}>
                  <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
                  Approve Request
                </Button>
                )}
                {request.status === "Approved" && (
                  <Button className="w-full justify-start" size="sm" variant="outline" onClick={() => router.push("/sourcing-contracts/contracts")}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Create Contract
                </Button>
                )}
                <Button className="w-full justify-start text-destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete Request
                </Button>
              </CardContent>
            </Card>

            {/* Request Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{request.items.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Attachments</span>
                    <span className="font-medium">{request.attachments.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Comments</span>
                    <span className="font-medium">{request.comments.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Approval Steps</span>
                    <span className="font-medium">{request.approvalHistory.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Procurement Request</DialogTitle>
            <DialogDescription>
              Update the details of this procurement request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Edit functionality would populate this form with current data.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditDialog(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Procurement Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this procurement request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

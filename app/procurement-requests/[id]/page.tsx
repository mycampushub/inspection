"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Download,
  Edit,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Send,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { procurementRequests, type ProcurementRequest } from "@/lib/data"

export default function ProcurementRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")

  const request = procurementRequests.find((pr) => pr.id === id)

  if (!request) {
    return (
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/procurement-requests">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex items-center text-lg font-semibold">Request Not Found</div>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground mb-4">The procurement request you are looking for does not exist.</p>
            <Button asChild>
              <Link href="/procurement-requests">Back to Requests</Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  const handleApprove = () => {
    // In a real app, this would make an API call
    setShowApproveDialog(false)
    setApprovalComment("")
    router.push("/procurement-requests")
  }

  const handleReject = () => {
    // In a real app, this would make an API call
    setShowRejectDialog(false)
    setApprovalComment("")
    router.push("/procurement-requests")
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would make an API call
      setNewComment("")
    }
  }

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/procurement-requests">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{request.id}</span>
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
        </div>
        <div className="ml-auto flex items-center gap-2">
          {request.status === "Pending Approval" && (
            <>
              <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Request</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to approve this procurement request for{" "}
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(request.amount)}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="approval-comment">Comment (optional)</Label>
                      <Textarea
                        id="approval-comment"
                        placeholder="Add a comment for this approval..."
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                      Approve Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Request</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this procurement request.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Enter the reason for rejection..."
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleReject} variant="destructive">
                      Reject Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Duplicate Request
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{request.title}</CardTitle>
                <CardDescription>
                  Submitted on {new Date(request.date).toLocaleDateString()} by {request.requester}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Business Justification</h4>
                  <p className="text-sm text-muted-foreground">{request.justification}</p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Line Items</TabsTrigger>
                <TabsTrigger value="history">Approval History</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Line Items</CardTitle>
                    <CardDescription>{request.items.length} items in this request</CardDescription>
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
                            <TableCell className="text-muted-foreground">{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(item.unitPrice)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(item.totalPrice)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-semibold">
                            Total Amount
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(request.amount)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Approval History</CardTitle>
                    <CardDescription>Timeline of actions taken on this request</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {request.approvalHistory.map((item, index) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                item.action === "Approved"
                                  ? "bg-green-100 text-green-600"
                                  : item.action === "Rejected"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-muted"
                              }`}
                            >
                              {item.action === "Approved" ? (
                                <Check className="h-4 w-4" />
                              ) : item.action === "Rejected" ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            {index < request.approvalHistory.length - 1 && (
                              <div className="w-px h-full bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{item.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.user}</p>
                            {item.comment && (
                              <p className="text-sm mt-1 bg-muted p-2 rounded-md">{item.comment}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Attachments</CardTitle>
                        <CardDescription>{request.attachments.length} files attached</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {request.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Paperclip className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {attachment.size} - Uploaded by {attachment.uploadedBy}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No attachments yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Comments</CardTitle>
                    <CardDescription>Discussion and notes about this request</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {request.comments.length > 0 ? (
                        request.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{comment.userAvatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{comment.user}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No comments yet</p>
                        </div>
                      )}
                      <Separator />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleAddComment()
                            }
                          }}
                        />
                        <Button size="icon" onClick={handleAddComment}>
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
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
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
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
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-sm font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(request.amount)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm">{request.category}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm">{request.department}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Date</span>
                  <span className="text-sm">{new Date(request.deliveryDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requester</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {request.requester
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{request.requester}</p>
                    <p className="text-xs text-muted-foreground">{request.department}</p>
                    <a
                      href={`mailto:${request.requesterEmail}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {request.requesterEmail}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate PO
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Assign to Buyer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

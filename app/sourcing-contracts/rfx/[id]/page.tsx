"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  Edit,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
  Upload,
  Users,
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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Extended RFx data
const rfxEvents = [
  {
    id: "RFP-2023-001",
    title: "IT Infrastructure Upgrade",
    type: "RFP",
    status: "Active",
    dueDate: "2023-12-20",
    department: "IT",
    responses: 8,
    estimatedValue: 450000,
    progress: 65,
    description:
      "Seeking proposals for upgrading our IT infrastructure including servers, networking equipment, and cloud services. This project is critical for our digital transformation initiative and must be completed by Q2 2024.",
    scope: "The scope includes assessment of current infrastructure, design of new architecture, implementation of hardware and software solutions, data migration, and post-implementation support for 6 months.",
    createdBy: "John Smith",
    createdDate: "2023-11-01",
    publishedDate: "2023-11-05",
    questionDeadline: "2023-12-10",
    submissionDeadline: "2023-12-20",
    evaluationStartDate: "2023-12-21",
    awardDate: "2024-01-15",
    suppliers: [
      { id: "SUP-001", name: "Tech Solutions Inc.", category: "IT Services", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-05", score: 85, ranking: 2 },
      { id: "SUP-008", name: "Network Systems Ltd.", category: "IT Infrastructure", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-07", score: 78, ranking: 4 },
      { id: "SUP-015", name: "Cloud Experts Co.", category: "Cloud Services", status: "Invited", responseStatus: "In Progress", responseDate: null, score: null, ranking: null },
      { id: "SUP-023", name: "Data Center Solutions", category: "IT Infrastructure", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-08", score: 92, ranking: 1 },
      { id: "SUP-031", name: "Global IT Services", category: "IT Services", status: "Invited", responseStatus: "Not Started", responseDate: null, score: null, ranking: null },
      { id: "SUP-042", name: "Innovative Tech Partners", category: "IT Services", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-12", score: 81, ranking: 3 },
      { id: "SUP-055", name: "Enterprise Solutions Corp.", category: "IT Infrastructure", status: "Invited", responseStatus: "Declined", responseDate: null, score: null, ranking: null },
      { id: "SUP-067", name: "Digital Dynamics LLC", category: "Cloud Services", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-10", score: 76, ranking: 5 },
    ],
    requirements: [
      { id: "1", title: "Minimum 5 years experience in enterprise IT infrastructure", category: "Experience", mandatory: true },
      { id: "2", title: "ISO 27001 certification required", category: "Certification", mandatory: true },
      { id: "3", title: "24/7 support capability", category: "Support", mandatory: true },
      { id: "4", title: "On-site presence within 4 hours for critical issues", category: "Support", mandatory: true },
      { id: "5", title: "Experience with cloud migration projects", category: "Experience", mandatory: false },
      { id: "6", title: "SOC 2 Type II compliance", category: "Certification", mandatory: false },
    ],
    evaluationCriteria: [
      { name: "Technical Capability", weight: 35, description: "Assessment of technical expertise and proposed solution quality" },
      { name: "Price", weight: 25, description: "Total cost of ownership over contract period" },
      { name: "Experience", weight: 20, description: "Relevant project experience and references" },
      { name: "Support", weight: 20, description: "Service level commitments and support infrastructure" },
    ],
    documents: [
      { id: "1", name: "RFP_Requirements.pdf", type: "pdf", size: "2.4 MB", uploadedDate: "2023-11-01" },
      { id: "2", name: "Technical_Specifications.xlsx", type: "xlsx", size: "1.2 MB", uploadedDate: "2023-11-01" },
      { id: "3", name: "Terms_and_Conditions.docx", type: "docx", size: "890 KB", uploadedDate: "2023-11-01" },
      { id: "4", name: "Pricing_Template.xlsx", type: "xlsx", size: "540 KB", uploadedDate: "2023-11-01" },
    ],
    questions: [
      { id: "1", supplier: "Tech Solutions Inc.", question: "Can you clarify the expected SLA for response times?", date: "2023-11-15", answer: "Response time for critical issues: 15 minutes. High priority: 1 hour. Medium: 4 hours. Low: 24 hours.", answeredDate: "2023-11-17" },
      { id: "2", supplier: "Network Systems Ltd.", question: "Is the existing hardware inventory available for review?", date: "2023-11-18", answer: "Yes, the hardware inventory will be shared with all invited suppliers under NDA.", answeredDate: "2023-11-20" },
      { id: "3", supplier: "Cloud Experts Co.", question: "What is the preferred cloud provider?", date: "2023-11-22", answer: null, answeredDate: null },
    ],
    activityLog: [
      { id: "1", action: "RFP Created", user: "John Smith", date: "2023-11-01", details: "Initial RFP document created" },
      { id: "2", action: "RFP Published", user: "John Smith", date: "2023-11-05", details: "RFP published to selected suppliers" },
      { id: "3", action: "Supplier Invited", user: "John Smith", date: "2023-11-05", details: "8 suppliers invited to participate" },
      { id: "4", action: "Question Received", user: "Tech Solutions Inc.", date: "2023-11-15", details: "Question about SLA requirements" },
      { id: "5", action: "Question Answered", user: "John Smith", date: "2023-11-17", details: "Response to SLA question" },
      { id: "6", action: "Response Submitted", user: "Tech Solutions Inc.", date: "2023-12-05", details: "Proposal submitted" },
    ],
  },
  {
    id: "RFQ-2023-015",
    title: "Office Supplies Procurement",
    type: "RFQ",
    status: "Evaluation",
    dueDate: "2023-12-10",
    department: "Administration",
    responses: 12,
    estimatedValue: 75000,
    progress: 80,
    description: "Requesting quotes for office supplies including paper, toner, and general stationery items for the next fiscal year.",
    scope: "Annual supply agreement for all office locations.",
    createdBy: "Sarah Johnson",
    createdDate: "2023-10-15",
    publishedDate: "2023-10-18",
    questionDeadline: "2023-12-01",
    submissionDeadline: "2023-12-10",
    evaluationStartDate: "2023-12-11",
    awardDate: "2023-12-22",
    suppliers: [],
    requirements: [],
    evaluationCriteria: [],
    documents: [],
    questions: [],
    activityLog: [],
  },
]

export default function RFxDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showAwardDialog, setShowAwardDialog] = useState(false)

  const rfx = rfxEvents.find((r) => r.id === id)

  if (!rfx) {
    return (
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/sourcing-contracts/rfx">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex items-center text-lg font-semibold">RFx Not Found</div>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">RFx Not Found</h2>
            <p className="text-muted-foreground mb-4">The RFx you are looking for does not exist.</p>
            <Button asChild>
              <Link href="/sourcing-contracts/rfx">Back to RFx</Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  const submittedCount = rfx.suppliers.filter((s) => s.responseStatus === "Submitted").length
  const pendingCount = rfx.suppliers.filter((s) => s.responseStatus === "In Progress" || s.responseStatus === "Not Started").length
  const declinedCount = rfx.suppliers.filter((s) => s.responseStatus === "Declined").length

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/sourcing-contracts/rfx">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{rfx.id}</span>
          <Badge variant="outline">{rfx.type}</Badge>
          <Badge
            variant={
              rfx.status === "Active"
                ? "success"
                : rfx.status === "Evaluation"
                  ? "warning"
                  : rfx.status === "Closed"
                    ? "secondary"
                    : "outline"
            }
          >
            {rfx.status}
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {rfx.status === "Active" && (
            <>
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Suppliers
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Suppliers</DialogTitle>
                    <DialogDescription>
                      Search and invite additional suppliers to participate in this RFx.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Search Suppliers</Label>
                      <Input placeholder="Search by name or category..." />
                    </div>
                    <div className="border rounded-lg p-4 text-center text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Search for suppliers to invite</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowInviteDialog(false)}>Send Invitations</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Close RFx
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Close RFx</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to close this RFx? No more submissions will be accepted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{submittedCount}</div>
                          <div className="text-xs text-muted-foreground">Submitted</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{pendingCount}</div>
                          <div className="text-xs text-muted-foreground">Pending</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{declinedCount}</div>
                          <div className="text-xs text-muted-foreground">Declined</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for closing</Label>
                      <Textarea placeholder="Enter reason..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowCloseDialog(false)}>Close RFx</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          {rfx.status === "Evaluation" && (
            <Dialog open={showAwardDialog} onOpenChange={setShowAwardDialog}>
              <DialogTrigger asChild>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Award Contract
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Award Contract</DialogTitle>
                  <DialogDescription>
                    Select the winning supplier for this RFx.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Winning Supplier</Label>
                    <div className="space-y-2">
                      {rfx.suppliers
                        .filter((s) => s.responseStatus === "Submitted")
                        .sort((a, b) => (a.ranking || 99) - (b.ranking || 99))
                        .map((supplier) => (
                          <div
                            key={supplier.id}
                            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${supplier.ranking === 1 ? 'bg-green-100 text-green-600' : 'bg-muted'}`}>
                                #{supplier.ranking}
                              </div>
                              <div>
                                <p className="font-medium">{supplier.name}</p>
                                <p className="text-xs text-muted-foreground">{supplier.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{supplier.score}%</div>
                              <div className="text-xs text-muted-foreground">Score</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAwardDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAwardDialog(false)}>Award Contract</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                Duplicate RFx
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel RFx
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{rfx.title}</h2>
                  <p className="text-muted-foreground mt-1">{rfx.description}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{rfx.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{rfx.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {new Date(rfx.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{rfx.progress}%</span>
                    </div>
                    <Progress value={rfx.progress} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(rfx.estimatedValue)}
                  </div>
                  <div className="text-xs text-muted-foreground">Est. Value</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{rfx.suppliers.length}</div>
                  <div className="text-xs text-muted-foreground">Invited</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{submittedCount}</div>
                  <div className="text-xs text-muted-foreground">Submitted</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers ({rfx.suppliers.length})</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="questions">Q&A ({rfx.questions.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scope & Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Scope</h4>
                    <p className="text-sm text-muted-foreground">{rfx.scope}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Requirements</h4>
                    <div className="space-y-2">
                      {rfx.requirements.slice(0, 4).map((req) => (
                        <div key={req.id} className="flex items-start gap-2 text-sm">
                          <Check className={`h-4 w-4 mt-0.5 ${req.mandatory ? 'text-red-500' : 'text-green-500'}`} />
                          <span>
                            {req.title}
                            {req.mandatory && <Badge variant="destructive" className="ml-2 text-xs">Mandatory</Badge>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Created", date: rfx.createdDate, completed: true },
                      { label: "Published", date: rfx.publishedDate, completed: true },
                      { label: "Question Deadline", date: rfx.questionDeadline, completed: new Date(rfx.questionDeadline) < new Date() },
                      { label: "Submission Deadline", date: rfx.submissionDeadline, completed: new Date(rfx.submissionDeadline) < new Date() },
                      { label: "Evaluation Start", date: rfx.evaluationStartDate, completed: new Date(rfx.evaluationStartDate) < new Date() },
                      { label: "Award Date", date: rfx.awardDate, completed: false },
                    ].map((milestone, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              milestone.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {milestone.completed ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          {index < 5 && <div className="w-px h-full bg-border mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium">{milestone.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(milestone.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evaluation Criteria</CardTitle>
                <CardDescription>How supplier responses will be evaluated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rfx.evaluationCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{criterion.name}</span>
                          <span className="text-sm text-muted-foreground">{criterion.weight}%</span>
                        </div>
                        <Progress value={criterion.weight} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{criterion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Invited Suppliers</CardTitle>
                    <CardDescription>{rfx.suppliers.length} suppliers invited</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setShowInviteDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite More
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfx.suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <Link
                            href={`/supplier-management/directory/${supplier.id}`}
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            {supplier.name}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{supplier.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              supplier.responseStatus === "Submitted"
                                ? "success"
                                : supplier.responseStatus === "In Progress"
                                  ? "warning"
                                  : supplier.responseStatus === "Declined"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {supplier.responseStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {supplier.responseDate
                            ? new Date(supplier.responseDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {supplier.score !== null ? (
                            <span className={`font-medium ${supplier.score >= 80 ? 'text-green-600' : supplier.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {supplier.score}%
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {supplier.ranking !== null ? (
                            <Badge variant={supplier.ranking === 1 ? "success" : "outline"}>
                              #{supplier.ranking}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Response</DropdownMenuItem>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evaluation Summary</CardTitle>
                <CardDescription>Comparison of submitted responses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Supplier</TableHead>
                      {rfx.evaluationCriteria.map((c) => (
                        <TableHead key={c.name} className="text-center">{c.name}</TableHead>
                      ))}
                      <TableHead className="text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfx.suppliers
                      .filter((s) => s.score !== null)
                      .sort((a, b) => (a.ranking || 99) - (b.ranking || 99))
                      .map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>
                            <Badge variant={supplier.ranking === 1 ? "success" : "outline"}>
                              #{supplier.ranking}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          {rfx.evaluationCriteria.map((c, i) => (
                            <TableCell key={c.name} className="text-center">
                              {Math.round((supplier.score || 0) * (1 + (i - 2) * 0.05))}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-bold">{supplier.score}%</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">RFx Documents</CardTitle>
                    <CardDescription>{rfx.documents.length} documents</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rfx.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.size} - {new Date(doc.uploadedDate).toLocaleDateString()}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Questions & Answers</CardTitle>
                <CardDescription>{rfx.questions.filter(q => !q.answer).length} questions pending response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rfx.questions.map((q) => (
                    <div key={q.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{q.supplier}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(q.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{q.question}</p>
                        </div>
                        <Badge variant={q.answer ? "success" : "warning"}>
                          {q.answer ? "Answered" : "Pending"}
                        </Badge>
                      </div>
                      {q.answer ? (
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">Response</span>
                            <span className="text-xs text-muted-foreground">
                              {q.answeredDate && new Date(q.answeredDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{q.answer}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input placeholder="Type your response..." />
                          <Button size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Log</CardTitle>
                <CardDescription>Timeline of all RFx events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rfx.activityLog.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {index < rfx.activityLog.length - 1 && (
                          <div className="w-px h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

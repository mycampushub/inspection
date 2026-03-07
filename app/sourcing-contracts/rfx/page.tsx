"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Upload,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for RFx events
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
      "Seeking proposals for upgrading our IT infrastructure including servers, networking equipment, and cloud services.",
    createdBy: "John Smith",
    createdDate: "2023-11-01",
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
    description:
      "Requesting quotes for office supplies including paper, toner, and general stationery items for the next fiscal year.",
    createdBy: "Sarah Johnson",
    createdDate: "2023-10-15",
  },
  {
    id: "RFI-2023-008",
    title: "Cloud Services Provider",
    type: "RFI",
    status: "Draft",
    dueDate: "2024-01-15",
    department: "IT",
    responses: 0,
    estimatedValue: 200000,
    progress: 30,
    description:
      "Gathering information on cloud service providers with expertise in hybrid cloud solutions and managed services.",
    createdBy: "Michael Chen",
    createdDate: "2023-11-20",
  },
  {
    id: "RFP-2023-012",
    title: "Marketing Campaign Services",
    type: "RFP",
    status: "Closed",
    dueDate: "2023-11-30",
    department: "Marketing",
    responses: 6,
    estimatedValue: 120000,
    progress: 100,
    description:
      "Seeking proposals for comprehensive marketing campaign services including digital, print, and social media components.",
    createdBy: "Jessica Williams",
    createdDate: "2023-10-01",
  },
  {
    id: "RFQ-2023-018",
    title: "Facility Maintenance Services",
    type: "RFQ",
    status: "Active",
    dueDate: "2023-12-25",
    department: "Facilities",
    responses: 5,
    estimatedValue: 180000,
    progress: 50,
    description:
      "Requesting quotes for comprehensive facility maintenance services including cleaning, repairs, and preventative maintenance.",
    createdBy: "Robert Taylor",
    createdDate: "2023-11-10",
  },
  {
    id: "RFI-2023-022",
    title: "HR Management Software",
    type: "RFI",
    status: "Active",
    dueDate: "2024-01-05",
    department: "HR",
    responses: 7,
    estimatedValue: 150000,
    progress: 40,
    description:
      "Gathering information on HR management software solutions with capabilities for employee records, performance management, and payroll integration.",
    createdBy: "Amanda Rodriguez",
    createdDate: "2023-11-15",
  },
]

// Sample data for suppliers
const suppliers = [
  {
    id: "SUP-001",
    name: "Tech Solutions Inc.",
    category: "IT Services",
    status: "Invited",
    responseStatus: "Submitted",
    responseDate: "2023-12-05",
    score: 85,
  },
  {
    id: "SUP-008",
    name: "Network Systems Ltd.",
    category: "IT Infrastructure",
    status: "Invited",
    responseStatus: "Submitted",
    responseDate: "2023-12-07",
    score: 78,
  },
  {
    id: "SUP-015",
    name: "Cloud Experts Co.",
    category: "Cloud Services",
    status: "Invited",
    responseStatus: "In Progress",
    responseDate: null,
    score: null,
  },
  {
    id: "SUP-023",
    name: "Data Center Solutions",
    category: "IT Infrastructure",
    status: "Invited",
    responseStatus: "Submitted",
    responseDate: "2023-12-08",
    score: 92,
  },
  {
    id: "SUP-031",
    name: "Global IT Services",
    category: "IT Services",
    status: "Invited",
    responseStatus: "Not Started",
    responseDate: null,
    score: null,
  },
]

export default function RFxManagement() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [showNewRfxDialog, setShowNewRfxDialog] = useState(false)
  const [newRfx, setNewRfx] = useState({
    title: "",
    type: "RFP",
    department: "",
    dueDate: "",
    estimatedValue: "",
    description: "",
  })

  const toggleEventExpansion = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id)
  }

  const handleCreateRfx = () => {
    // In a real app, this would make an API call
    setShowNewRfxDialog(false)
    setNewRfx({
      title: "",
      type: "RFP",
      department: "",
      dueDate: "",
      estimatedValue: "",
      description: "",
    })
  }

  // Filter RFx events based on search and tab
  const filteredEvents = rfxEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.department.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "active") return event.status === "Active" && matchesSearch
    if (selectedTab === "draft") return event.status === "Draft" && matchesSearch
    if (selectedTab === "evaluation") return event.status === "Evaluation" && matchesSearch
    if (selectedTab === "closed") return event.status === "Closed" && matchesSearch
    return matchesSearch
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/sourcing-contracts">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center text-lg font-semibold">RFx Management</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Dialog open={showNewRfxDialog} onOpenChange={setShowNewRfxDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New RFx
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New RFx Event</DialogTitle>
                <DialogDescription>
                  Create a new Request for Proposal (RFP), Quote (RFQ), or Information (RFI).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rfx-title">Title *</Label>
                    <Input
                      id="rfx-title"
                      placeholder="Enter RFx title"
                      value={newRfx.title}
                      onChange={(e) => setNewRfx({ ...newRfx, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfx-type">RFx Type *</Label>
                    <Select
                      value={newRfx.type}
                      onValueChange={(value) => setNewRfx({ ...newRfx, type: value })}
                    >
                      <SelectTrigger id="rfx-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RFP">Request for Proposal (RFP)</SelectItem>
                        <SelectItem value="RFQ">Request for Quote (RFQ)</SelectItem>
                        <SelectItem value="RFI">Request for Information (RFI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rfx-department">Department *</Label>
                    <Select
                      value={newRfx.department}
                      onValueChange={(value) => setNewRfx({ ...newRfx, department: value })}
                    >
                      <SelectTrigger id="rfx-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfx-due">Response Due Date *</Label>
                    <Input
                      id="rfx-due"
                      type="date"
                      value={newRfx.dueDate}
                      onChange={(e) => setNewRfx({ ...newRfx, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfx-value">Estimated Value (USD)</Label>
                  <Input
                    id="rfx-value"
                    type="number"
                    placeholder="0.00"
                    value={newRfx.estimatedValue}
                    onChange={(e) => setNewRfx({ ...newRfx, estimatedValue: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfx-description">Description *</Label>
                  <Textarea
                    id="rfx-description"
                    placeholder="Describe the requirements and scope..."
                    value={newRfx.description}
                    onChange={(e) => setNewRfx({ ...newRfx, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewRfxDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRfx}>Create RFx</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="RFx Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rfp">RFP</SelectItem>
                  <SelectItem value="rfq">RFQ</SelectItem>
                  <SelectItem value="rfi">RFI</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search RFx..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4 mt-4">
              {filteredEvents.map((event) => (
                <Collapsible
                  key={event.id}
                  open={expandedEvent === event.id}
                  onOpenChange={() => toggleEventExpansion(event.id)}
                >
                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                              </Button>
                            </CollapsibleTrigger>
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant="outline">{event.id}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge
                              variant={
                                event.status === "Active"
                                  ? "success"
                                  : event.status === "Evaluation"
                                    ? "warning"
                                    : event.status === "Closed"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {event.status}
                            </Badge>
                            <span>•</span>
                            <span>Type: {event.type}</span>
                            <span>•</span>
                            <span>Due: {new Date(event.dueDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Department: {event.department}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              }).format(event.estimatedValue)}
                            </span>
                            <span className="text-xs text-muted-foreground">{event.responses} responses</span>
                          </div>
                          <div className="flex flex-col items-end gap-1 min-w-[100px]">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs text-muted-foreground">Progress</span>
                              <span className="text-xs font-medium">{event.progress}%</span>
                            </div>
                            <Progress value={event.progress} className="h-2 w-full" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/sourcing-contracts/rfx/${event.id}`}>View RFx</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit RFx</DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/sourcing-contracts/rfx/${event.id}`}>View Responses</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Invite Suppliers</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Download as PDF</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate RFx</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {event.status === "Draft" ? (
                                <DropdownMenuItem>Publish RFx</DropdownMenuItem>
                              ) : event.status === "Active" ? (
                                <DropdownMenuItem>Close RFx</DropdownMenuItem>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="px-4 pb-4 pt-0 border-t">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Details</h4>
                              <dl className="grid grid-cols-2 gap-1 text-sm">
                                <dt className="text-muted-foreground">Created By:</dt>
                                <dd>{event.createdBy}</dd>
                                <dt className="text-muted-foreground">Created Date:</dt>
                                <dd>{new Date(event.createdDate).toLocaleDateString()}</dd>
                                <dt className="text-muted-foreground">Due Date:</dt>
                                <dd>{new Date(event.dueDate).toLocaleDateString()}</dd>
                                <dt className="text-muted-foreground">Department:</dt>
                                <dd>{event.department}</dd>
                              </dl>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Documents</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center gap-2">
                                  <Download className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">RFx_Requirements.pdf</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center gap-2">
                                  <Download className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Technical_Specifications.xlsx</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center gap-2">
                                  <Download className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Terms_and_Conditions.docx</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" variant="outline" className="w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                Add Document
                              </Button>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Timeline</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                                <div>
                                  <p className="text-sm font-medium">RFx Created</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(event.createdDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                                <div>
                                  <p className="text-sm font-medium">Suppliers Invited</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      new Date(event.createdDate).getTime() + 2 * 24 * 60 * 60 * 1000,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                {event.status === "Active" ||
                                event.status === "Evaluation" ||
                                event.status === "Closed" ? (
                                  <Check className="h-4 w-4 mt-0.5 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
                                )}
                                <div>
                                  <p className="text-sm font-medium">Response Deadline</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(event.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                {event.status === "Evaluation" || event.status === "Closed" ? (
                                  <Check className="h-4 w-4 mt-0.5 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
                                )}
                                <div>
                                  <p className="text-sm font-medium">Evaluation</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      new Date(event.dueDate).getTime() + 7 * 24 * 60 * 60 * 1000,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                {event.status === "Closed" ? (
                                  <Check className="h-4 w-4 mt-0.5 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
                                )}
                                <div>
                                  <p className="text-sm font-medium">Award</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      new Date(event.dueDate).getTime() + 14 * 24 * 60 * 60 * 1000,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(event.status === "Evaluation" || event.status === "Closed") && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium mb-4">Supplier Responses</h4>
                            <div className="border rounded-md overflow-hidden">
                              <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                                <div className="col-span-4">Supplier</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Response Date</div>
                                <div className="col-span-2">Score</div>
                                <div className="col-span-2 text-right">Actions</div>
                              </div>
                              {suppliers.map((supplier) => (
                                <div key={supplier.id} className="grid grid-cols-12 gap-4 p-3 border-t text-sm">
                                  <div className="col-span-4">
                                    <div className="font-medium">{supplier.name}</div>
                                    <div className="text-xs text-muted-foreground">{supplier.category}</div>
                                  </div>
                                  <div className="col-span-2">
                                    <Badge
                                      variant={
                                        supplier.responseStatus === "Submitted"
                                          ? "success"
                                          : supplier.responseStatus === "In Progress"
                                            ? "warning"
                                            : "outline"
                                      }
                                    >
                                      {supplier.responseStatus}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2">
                                    {supplier.responseDate ? new Date(supplier.responseDate).toLocaleDateString() : "—"}
                                  </div>
                                  <div className="col-span-2">
                                    {supplier.score !== null ? (
                                      <span
                                        className={
                                          supplier.score >= 80
                                            ? "text-green-600 font-medium"
                                            : supplier.score >= 60
                                              ? "text-amber-600 font-medium"
                                              : "text-red-600 font-medium"
                                        }
                                      >
                                        {supplier.score}/100
                                      </span>
                                    ) : (
                                      "—"
                                    )}
                                  </div>
                                  <div className="col-span-2 text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Actions</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {supplier.responseStatus === "Submitted" && (
                                          <>
                                            <DropdownMenuItem>View Response</DropdownMenuItem>
                                            <DropdownMenuItem>Evaluate</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                          </>
                                        )}
                                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                                        <DropdownMenuItem>View Supplier Profile</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Extend Deadline
                          </Button>
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Invite More Suppliers
                          </Button>
                          <Button asChild>
                            <Link href={`/sourcing-contracts/rfx/${event.id}`}>
                              <Save className="mr-2 h-4 w-4" />
                              {event.status === "Draft"
                                ? "Edit & Publish"
                                : event.status === "Active"
                                  ? "View Details"
                                  : event.status === "Evaluation"
                                    ? "Complete Evaluation"
                                    : "View Award"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
              {filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No RFx events found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button className="mt-4">Create New RFx</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {/* Same content as "all" tab but filtered for active events */}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {/* Same content as "all" tab but filtered for draft events */}
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-4">
            {/* Same content as "all" tab but filtered for events in evaluation */}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {/* Same content as "all" tab but filtered for closed events */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

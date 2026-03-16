"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Upload,
  User,
  X,
} from "lucide-react"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Progress } from "../components/ui/progress"
import { ScrollArea } from "../components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { SidebarInset, SidebarTrigger } from "../components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Textarea } from "../components/ui/textarea"
import { localRfxEvents, localCategories } from "../lib/local-data"
import type { RfxEvent, EvaluationCriterion, RfxResponse, Document } from "../lib/local-data"

interface RfxFormData {
  title: string
  type: "RFP" | "RFQ" | "RFI" | "RFT"
  description: string
  category: string
  publishedDate?: string
  deadline: string
  budget: number
  evaluationCriteria: { name: string; weight: number; description?: string }[]
}

interface EvaluationFormData {
  responseId: string
  score: number
  comments?: string
}

interface ExtendDeadlineFormData {
  newDeadline: string
  reason?: string
}

interface InviteFormData {
  supplierIds: string[]
  message?: string
}

export default function RFxManagement() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  // Data states - initialized with local data for instant loading
  const [rfxEvents, setRfxEvents] = useState<RfxEvent[]>(localRfxEvents)
  const [loading, setLoading] = useState(false)
  const [selectedRfx, setSelectedRfx] = useState<RfxEvent | null>(null)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [isCompleteEvaluationDialogOpen, setIsCompleteEvaluationDialogOpen] = useState(false)
  const [isExtendDeadlineDialogOpen, setIsExtendDeadlineDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState(false)
  const [isEvaluateDialogOpen, setIsEvaluateDialogOpen] = useState(false)
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false)
  const [isSupplierProfileDialogOpen, setIsSupplierProfileDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)

  // Form states
  const [createFormData, setCreateFormData] = useState<RfxFormData>({
    title: "",
    type: "RFP",
    description: "",
    category: "",
    deadline: "",
    budget: 0,
    evaluationCriteria: [{ name: "", weight: 0 }],
  })
  const [editFormData, setEditFormData] = useState<RfxFormData>({
    title: "",
    type: "RFP",
    description: "",
    category: "",
    deadline: "",
    budget: 0,
    evaluationCriteria: [{ name: "", weight: 0 }],
  })
  const [extendDeadlineData, setExtendDeadlineData] = useState<ExtendDeadlineFormData>({
    newDeadline: "",
    reason: "",
  })
  const [inviteData, setInviteData] = useState<InviteFormData>({ supplierIds: [], message: "" })
  const [evaluationData, setEvaluationData] = useState<EvaluationFormData>({ responseId: "", score: 0 })
  const [sendMessageData, setSendMessageData] = useState({ supplierId: "", message: "" })
  const [addDocumentData, setAddDocumentData] = useState({ name: "", type: "", size: 0 })

  // Available categories from local data
  const categories = localCategories().map(c => c.name)

  // Filter RFx events locally (no API calls needed)
  useEffect(() => {
    // Data is already loaded from local-data
    // Filters are applied client-side in filteredEvents
  }, [typeFilter, statusFilter, searchQuery])

  // Handle create RFx (in-memory)
  const handleCreateRfx = () => {
    const newEvent: RfxEvent = {
      id: `RFX-${String(rfxEvents.length + 1).padStart(5, '0')}`,
      ...createFormData,
      createdBy: "Current User",
      status: "Draft",
      createdDate: new Date().toISOString(),
      evaluationCriteria: createFormData.evaluationCriteria.map((c, i) => ({
        id: `CRIT-${rfxEvents.length + 1}-${i}`,
        name: c.name,
        weight: c.weight,
        description: c.description || ""
      })),
      documents: [],
      responses: []
    }
    setRfxEvents([...rfxEvents, newEvent])
    setIsCreateDialogOpen(false)
    setCreateFormData({
      title: "",
      type: "RFP",
      description: "",
      category: "",
      deadline: "",
      budget: 0,
      evaluationCriteria: [{ name: "", weight: 0 }],
    })
  }

  // Handle edit RFx (in-memory)
  const handleEditRfx = () => {
    if (!selectedRfx) return

    const updatedEvent: RfxEvent = {
      ...selectedRfx,
      ...editFormData,
      evaluationCriteria: editFormData.evaluationCriteria.map((c, i) => ({
        id: `CRIT-${selectedRfx.id}-${i}`,
        name: c.name,
        weight: c.weight,
        description: c.description || ""
      }))
    }
    setRfxEvents(rfxEvents.map(e => e.id === selectedRfx.id ? updatedEvent : e))
    setIsEditDialogOpen(false)
    setSelectedRfx(null)
  }

  // Handle delete RFx (in-memory)
  const handleDeleteRfx = () => {
    if (!selectedRfx) return

    setRfxEvents(rfxEvents.filter(e => e.id !== selectedRfx.id))
    setIsDeleteDialogOpen(false)
    setSelectedRfx(null)
  }

  // Handle close RFx (in-memory)
  const handleCloseRfx = () => {
    if (!selectedRfx) return

    setRfxEvents(rfxEvents.map(e => e.id === selectedRfx.id ? { ...e, status: "Closed" as const } : e))
    setIsCloseDialogOpen(false)
    setSelectedRfx(null)
  }

  // Handle publish RFx (in-memory)
  const handlePublishRfx = () => {
    if (!selectedRfx) return

    setRfxEvents(rfxEvents.map(e => 
      e.id === selectedRfx.id 
        ? { ...e, status: "Active" as const, publishedDate: new Date().toISOString().split("T")[0] }
        : e
    ))
    setIsPublishDialogOpen(false)
    setSelectedRfx(null)
  }

  // Handle complete evaluation (in-memory)
  const handleCompleteEvaluation = () => {
    if (!selectedRfx) return

    setRfxEvents(rfxEvents.map(e => e.id === selectedRfx.id ? { ...e, status: "Closed" as const } : e))
    setIsCompleteEvaluationDialogOpen(false)
    setSelectedRfx(null)
  }

  // Handle duplicate RFx (in-memory)
  const handleDuplicateRfx = () => {
    if (!selectedRfx) return

    const duplicate: RfxEvent = {
      ...selectedRfx,
      id: `RFX-${String(rfxEvents.length + 1).padStart(5, '0')}`,
      title: `${selectedRfx.title} (Copy)`,
      status: "Draft" as const,
      publishedDate: undefined,
      deadline: new Date(new Date(selectedRfx.deadline).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      createdDate: new Date().toISOString(),
      evaluationCriteria: selectedRfx.evaluationCriteria.map((c, i) => ({
        ...c,
        id: `CRIT-${rfxEvents.length + 1}-${i}`
      })),
      documents: [],
      responses: []
    }
    setRfxEvents([...rfxEvents, duplicate])
    setIsDuplicateDialogOpen(false)
    setSelectedRfx(null)
  }

  // Handle extend deadline (in-memory)
  const handleExtendDeadline = () => {
    if (!selectedRfx) return

    setRfxEvents(rfxEvents.map(e => e.id === selectedRfx.id ? { ...e, deadline: extendDeadlineData.newDeadline } : e))
    setIsExtendDeadlineDialogOpen(false)
    setSelectedRfx(null)
    setExtendDeadlineData({ newDeadline: "", reason: "" })
  }

  // Handle add document (in-memory)
  const handleAddDocument = () => {
    if (!selectedRfx) return

    const newDocument: Document = {
      id: `DOC-${Date.now()}`,
      name: addDocumentData.name,
      type: addDocumentData.type,
      size: addDocumentData.size,
      uploadDate: new Date().toISOString(),
      uploadedBy: "Current User",
    }

    const updatedRfx = {
      ...selectedRfx,
      documents: [...(selectedRfx.documents || []), newDocument]
    }

    setRfxEvents(rfxEvents.map(e => e.id === selectedRfx.id ? updatedRfx : e))
    setSelectedRfx(updatedRfx)
    setIsAddDocumentDialogOpen(false)
    setAddDocumentData({ name: "", type: "", size: 0 })
  }

  // Handle evaluate response (in-memory)
  const handleEvaluateResponse = () => {
    if (!selectedRfx) return

    const updatedRfx = {
      ...selectedRfx,
      responses: selectedRfx.responses.map(r => 
        r.id === evaluationData.responseId ? { ...r, score: evaluationData.score } : r
      )
    }

    setRfxEvents(rfxEvents.map(e => e.id === selectedRfx.id ? updatedRfx : e))
    setSelectedRfx(updatedRfx)
    setIsEvaluateDialogOpen(false)
    setEvaluationData({ responseId: "", score: 0 })
  }

  // Handle send message
  const handleSendMessage = () => {
    // In a real app, this would send an email or notification
    setIsSendMessageDialogOpen(false)
    setSendMessageData({ supplierId: "", message: "" })
    alert("Message sent successfully!")
  }

  // Handle download RFx as PDF/Text
  const handleDownloadRfx = (rfx: RfxEvent) => {
    const content = `
RFx Event Details
=================

ID: ${rfx.id}
Title: ${rfx.title}
Type: ${rfx.type}
Status: ${rfx.status}
Category: ${rfx.category}

Description:
${rfx.description || "N/A"}

Budget: $${rfx.budget?.toLocaleString() || 0}
Created By: ${rfx.createdBy}
Created Date: ${rfx.createdDate}
Published Date: ${rfx.publishedDate || "N/A"}
Deadline: ${rfx.deadline}

Evaluation Criteria:
${rfx.evaluationCriteria?.map((c) => `- ${c.name} (${c.weight}%): ${c.description || "N/A"}`).join("\n") || "N/A"}

Documents:
${rfx.documents?.map((d) => `- ${d.name} (${d.type}, ${d.size} bytes)`).join("\n") || "N/A"}

Responses (${rfx.responses?.length || 0}):
${rfx.responses?.map((r) => `- ${r.supplierName}: Score ${r.score || "N/A"}, Amount $${r.totalAmount || 0}`).join("\n") || "N/A"}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${rfx.id}-${rfx.title.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Open edit dialog with RFx data
  const openEditDialog = (rfx: RfxEvent) => {
    setSelectedRfx(rfx)
    setEditFormData({
      title: rfx.title,
      type: rfx.type,
      description: rfx.description,
      category: rfx.category,
      publishedDate: rfx.publishedDate,
      deadline: rfx.deadline,
      budget: rfx.budget,
      evaluationCriteria: rfx.evaluationCriteria?.map((c) => ({ name: c.name, weight: c.weight, description: c.description })) || [{ name: "", weight: 0 }],
    })
    setIsEditDialogOpen(true)
  }

  // Open view dialog
  const openViewDialog = (rfx: RfxEvent) => {
    setSelectedRfx(rfx)
    setIsViewDialogOpen(true)
  }

  // Add evaluation criterion
  const addCriterion = (formData: RfxFormData, setFormData: (data: RfxFormData) => void) => {
    setFormData({
      ...formData,
      evaluationCriteria: [...formData.evaluationCriteria, { name: "", weight: 0 }],
    })
  }

  // Remove evaluation criterion
  const removeCriterion = (index: number, formData: RfxFormData, setFormData: (data: RfxFormData) => void) => {
    setFormData({
      ...formData,
      evaluationCriteria: formData.evaluationCriteria.filter((_, i) => i !== index),
    })
  }

  // Update criterion
  const updateCriterion = (
    index: number,
    field: keyof { name: string; weight: number; description?: string },
    value: string | number,
    formData: RfxFormData,
    setFormData: (data: RfxFormData) => void,
  ) => {
    const updatedCriteria = [...formData.evaluationCriteria]
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value }
    setFormData({ ...formData, evaluationCriteria: updatedCriteria })
  }

  // Filter RFx events based on search and tab
  const filteredEvents = rfxEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "active") return event.status === "Active" && matchesSearch
    if (selectedTab === "draft") return event.status === "Draft" && matchesSearch
    if (selectedTab === "evaluation") return event.status === "Evaluation" && matchesSearch
    if (selectedTab === "closed") return (event.status === "Closed" || event.status === "Awarded") && matchesSearch
    return matchesSearch
  })

  // Calculate progress
  const calculateProgress = (rfx: RfxEvent) => {
    if (rfx.status === "Draft") return 30
    if (rfx.status === "Active") {
      const now = new Date()
      const created = new Date(rfx.createdDate)
      const deadline = new Date(rfx.deadline)
      const totalDuration = deadline.getTime() - created.getTime()
      const elapsed = now.getTime() - created.getTime()
      return Math.min(90, Math.max(0, Math.round((elapsed / totalDuration) * 100)))
    }
    if (rfx.status === "Evaluation") return 80
    if (rfx.status === "Closed" || rfx.status === "Awarded") return 100
    return 0
  }

  // Get response count
  const getResponseCount = (rfx: RfxEvent) => {
    return rfx.responses?.filter((r) => r.submittedDate).length || 0
  }

  // Render RFx events
  const renderRfxEvents = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No RFx events found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
            Create New RFx
          </Button>
        </div>
      )
    }

    return filteredEvents.map((event) => (
      <Collapsible key={event.id} open={expandedEvent === event.id} onOpenChange={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}>
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
                          : event.status === "Closed" || event.status === "Awarded"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {event.status}
                  </Badge>
                  <span>•</span>
                  <span>Type: {event.type}</span>
                  <span>•</span>
                  <span>Due: {new Date(event.deadline).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Category: {event.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(event.budget || 0)}
                  </span>
                  <span className="text-xs text-muted-foreground">{getResponseCount(event)} responses</span>
                </div>
                <div className="flex flex-col items-end gap-1 min-w-[100px]">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium">{calculateProgress(event)}%</span>
                  </div>
                  <Progress value={calculateProgress(event)} className="h-2 w-full" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(event)}>Edit RFx</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openViewDialog(event)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedRfx(event); setIsInviteDialogOpen(true); }}>
                      Invite Suppliers
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDownloadRfx(event)}>Download as PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedRfx(event); setIsDuplicateDialogOpen(true); }}>
                      Duplicate RFx
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {event.status === "Draft" && (
                      <DropdownMenuItem onClick={() => { setSelectedRfx(event); setIsPublishDialogOpen(true); }}>
                        Publish RFx
                      </DropdownMenuItem>
                    )}
                    {event.status === "Active" && (
                      <DropdownMenuItem onClick={() => { setSelectedRfx(event); setIsCloseDialogOpen(true); }}>
                        Close RFx
                      </DropdownMenuItem>
                    )}
                    {event.status === "Evaluation" && (
                      <DropdownMenuItem onClick={() => { setSelectedRfx(event); setIsCompleteEvaluationDialogOpen(true); }}>
                        Complete Evaluation
                      </DropdownMenuItem>
                    )}
                    {(event.status === "Closed" || event.status === "Awarded") && (
                      <DropdownMenuItem onClick={() => openViewDialog(event)}>View Award</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setSelectedRfx(event); setIsDeleteDialogOpen(true); }} className="text-red-600">
                      Delete RFx
                    </DropdownMenuItem>
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
                    <p className="text-sm text-muted-foreground">{event.description || "No description provided"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Details</h4>
                    <dl className="grid grid-cols-2 gap-1 text-sm">
                      <dt className="text-muted-foreground">Created By:</dt>
                      <dd>{event.createdBy}</dd>
                      <dt className="text-muted-foreground">Created Date:</dt>
                      <dd>{new Date(event.createdDate).toLocaleDateString()}</dd>
                      <dt className="text-muted-foreground">Published Date:</dt>
                      <dd>{event.publishedDate ? new Date(event.publishedDate).toLocaleDateString() : "N/A"}</dd>
                      <dt className="text-muted-foreground">Deadline:</dt>
                      <dd>{new Date(event.deadline).toLocaleDateString()}</dd>
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd>{event.category}</dd>
                      <dt className="text-muted-foreground">Budget:</dt>
                      <dd>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(event.budget || 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Documents</h4>
                  <div className="space-y-2">
                    {event.documents && event.documents.length > 0 ? (
                      event.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-sm">{doc.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadRfx(event)}>
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No documents attached</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => { setSelectedRfx(event); setIsAddDocumentDialogOpen(true); }}
                    >
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
                        <p className="text-xs text-muted-foreground">{new Date(event.createdDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {event.publishedDate && (
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">RFx Published</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.publishedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      {event.status === "Active" || event.status === "Evaluation" || event.status === "Closed" || event.status === "Awarded" ? (
                        <Check className="h-4 w-4 mt-0.5 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Response Deadline</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      {event.status === "Evaluation" || event.status === "Closed" || event.status === "Awarded" ? (
                        <Check className="h-4 w-4 mt-0.5 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Evaluation</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(new Date(event.deadline).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      {event.status === "Closed" || event.status === "Awarded" ? (
                        <Check className="h-4 w-4 mt-0.5 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Award</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(new Date(event.deadline).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(event.status === "Evaluation" || event.status === "Closed" || event.status === "Awarded") && event.responses && event.responses.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-4">Supplier Responses</h4>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                      <div className="col-span-4">Supplier</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Response Date</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    {event.responses.map((response) => (
                      <div key={response.id} className="grid grid-cols-12 gap-4 p-3 border-t text-sm">
                        <div className="col-span-4">
                          <div className="font-medium">{response.supplierName}</div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant={response.submittedDate ? "success" : "outline"}>
                            {response.submittedDate ? "Submitted" : "Pending"}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          {response.submittedDate ? new Date(response.submittedDate).toLocaleDateString() : "—"}
                        </div>
                        <div className="col-span-2">
                          {response.totalAmount ? (
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(response.totalAmount)
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
                              {response.submittedDate && (
                                <>
                                  <DropdownMenuItem onClick={() => openViewDialog(event)}>View Response</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelectedRfx(event); setEvaluationData({ responseId: response.id, score: response.score || 0 }); setIsEvaluateDialogOpen(true); }}>
                                    Evaluate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem onClick={() => { setSelectedRfx(event); setSendMessageData({ supplierId: response.supplierId, message: "" }); setIsSendMessageDialogOpen(true); }}>
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedRfx(event); setSendMessageData({ supplierId: response.supplierId, message: "" }); setIsSupplierProfileDialogOpen(true); }}>
                                View Supplier Profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                {event.status === "Active" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => { setSelectedRfx(event); setExtendDeadlineData({ newDeadline: event.deadline, reason: "" }); setIsExtendDeadlineDialogOpen(true); }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Extend Deadline
                    </Button>
                    <Button variant="outline" onClick={() => { setSelectedRfx(event); setIsInviteDialogOpen(true); }}>
                      <Upload className="mr-2 h-4 w-4" />
                      Invite More Suppliers
                    </Button>
                  </>
                )}
                {event.status === "Draft" && (
                  <Button onClick={() => { setSelectedRfx(event); setIsPublishDialogOpen(true); }}>
                    <Save className="mr-2 h-4 w-4" />
                    Publish RFx
                  </Button>
                )}
                {event.status === "Active" && (
                  <Button onClick={() => { setSelectedRfx(event); setIsCloseDialogOpen(true); }}>
                    <Save className="mr-2 h-4 w-4" />
                    Close RFx
                  </Button>
                )}
                {event.status === "Evaluation" && (
                  <Button onClick={() => { setSelectedRfx(event); setIsCompleteEvaluationDialogOpen(true); }}>
                    <Save className="mr-2 h-4 w-4" />
                    Complete Evaluation
                  </Button>
                )}
                {(event.status === "Closed" || event.status === "Awarded") && (
                  <Button onClick={() => openViewDialog(event)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Award
                  </Button>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    ))
  }

  return (
    <SidebarInset>
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
          <Button size="sm" variant="outline" onClick={() => {
            setTypeFilter("all")
            setStatusFilter("all")
            setSearchQuery("")
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New RFx
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>RFx Type</Label>
                <Select value={typeFilter} onValueChange={(value: string) => setTypeFilter(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="RFP">RFP</SelectItem>
                    <SelectItem value="RFQ">RFQ</SelectItem>
                    <SelectItem value="RFI">RFI</SelectItem>
                    <SelectItem value="RFT">RFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Evaluation">Evaluation</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Awarded">Awarded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by title, ID, or description..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

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
            <div className="space-y-4 mt-4">{renderRfxEvents()}</div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="space-y-4 mt-4">{renderRfxEvents()}</div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="space-y-4 mt-4">{renderRfxEvents()}</div>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-4">
            <div className="space-y-4 mt-4">{renderRfxEvents()}</div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <div className="space-y-4 mt-4">{renderRfxEvents()}</div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create RFx Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New RFx Event</DialogTitle>
            <DialogDescription>Create a new Request for Proposal, Quote, Information, or Tender.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-title">Title *</Label>
                <Input
                  id="create-title"
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                  placeholder="Enter RFx title"
                />
              </div>
              <div>
                <Label htmlFor="create-type">Type *</Label>
                <Select
                  value={createFormData.type}
                  onValueChange={(value: "RFP" | "RFQ" | "RFI" | "RFT") =>
                    setCreateFormData({ ...createFormData, type: value })
                  }
                >
                  <SelectTrigger id="create-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RFP">RFP - Request for Proposal</SelectItem>
                    <SelectItem value="RFQ">RFQ - Request for Quote</SelectItem>
                    <SelectItem value="RFI">RFI - Request for Information</SelectItem>
                    <SelectItem value="RFT">RFT - Request for Tender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                placeholder="Enter RFx description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-category">Category *</Label>
                <Select
                  value={createFormData.category}
                  onValueChange={(value) => setCreateFormData({ ...createFormData, category: value })}
                >
                  <SelectTrigger id="create-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-deadline">Deadline *</Label>
                <Input
                  id="create-deadline"
                  type="date"
                  value={createFormData.deadline}
                  onChange={(e) => setCreateFormData({ ...createFormData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="create-budget">Budget (USD) *</Label>
              <Input
                id="create-budget"
                type="number"
                value={createFormData.budget}
                onChange={(e) => setCreateFormData({ ...createFormData, budget: Number(e.target.value) })}
                placeholder="Enter budget amount"
              />
            </div>
            <div>
              <Label>Evaluation Criteria</Label>
              <div className="space-y-2 mt-2">
                {createFormData.evaluationCriteria.map((criterion, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Criterion name"
                        value={criterion.name}
                        onChange={(e) => updateCriterion(index, "name", e.target.value, createFormData, setCreateFormData)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Weight %"
                        value={criterion.weight || ""}
                        onChange={(e) =>
                          updateCriterion(index, "weight", Number(e.target.value), createFormData, setCreateFormData)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Description"
                        value={criterion.description || ""}
                        onChange={(e) =>
                          updateCriterion(index, "description", e.target.value, createFormData, setCreateFormData)
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCriterion(index, createFormData, setCreateFormData)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addCriterion(createFormData, setCreateFormData)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criterion
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRfx}>Create RFx</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit RFx Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit RFx Event</DialogTitle>
            <DialogDescription>Update the RFx event details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  placeholder="Enter RFx title"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type *</Label>
                <Select
                  value={editFormData.type}
                  onValueChange={(value: "RFP" | "RFQ" | "RFI" | "RFT") => setEditFormData({ ...editFormData, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RFP">RFP - Request for Proposal</SelectItem>
                    <SelectItem value="RFQ">RFQ - Request for Quote</SelectItem>
                    <SelectItem value="RFI">RFI - Request for Information</SelectItem>
                    <SelectItem value="RFT">RFT - Request for Tender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Enter RFx description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={editFormData.category}
                  onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-deadline">Deadline *</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editFormData.deadline}
                  onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-budget">Budget (USD) *</Label>
              <Input
                id="edit-budget"
                type="number"
                value={editFormData.budget}
                onChange={(e) => setEditFormData({ ...editFormData, budget: Number(e.target.value) })}
                placeholder="Enter budget amount"
              />
            </div>
            <div>
              <Label>Evaluation Criteria</Label>
              <div className="space-y-2 mt-2">
                {editFormData.evaluationCriteria.map((criterion, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Criterion name"
                        value={criterion.name}
                        onChange={(e) => updateCriterion(index, "name", e.target.value, editFormData, setEditFormData)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Weight %"
                        value={criterion.weight || ""}
                        onChange={(e) =>
                          updateCriterion(index, "weight", Number(e.target.value), editFormData, setEditFormData)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Description"
                        value={criterion.description || ""}
                        onChange={(e) =>
                          updateCriterion(index, "description", e.target.value, editFormData, setEditFormData)
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCriterion(index, editFormData, setEditFormData)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addCriterion(editFormData, setEditFormData)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criterion
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRfx}>Update RFx</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View RFx Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>RFx Event Details</DialogTitle>
            <DialogDescription>Complete information about this RFx event.</DialogDescription>
          </DialogHeader>
          {selectedRfx && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>RFx ID</Label>
                    <p className="text-sm font-medium">{selectedRfx.id}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <p className="text-sm font-medium">{selectedRfx.type}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge
                      variant={
                        selectedRfx.status === "Active"
                          ? "success"
                          : selectedRfx.status === "Evaluation"
                            ? "warning"
                            : selectedRfx.status === "Closed" || selectedRfx.status === "Awarded"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {selectedRfx.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm font-medium">{selectedRfx.category}</p>
                  </div>
                  <div>
                    <Label>Created By</Label>
                    <p className="text-sm font-medium">{selectedRfx.createdBy}</p>
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <p className="text-sm font-medium">{new Date(selectedRfx.createdDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Published Date</Label>
                    <p className="text-sm font-medium">
                      {selectedRfx.publishedDate ? new Date(selectedRfx.publishedDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <p className="text-sm font-medium">{new Date(selectedRfx.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(selectedRfx.budget || 0)}
                    </p>
                  </div>
                  <div>
                    <Label>Responses</Label>
                    <p className="text-sm font-medium">{selectedRfx.responses?.length || 0}</p>
                  </div>
                </div>

                <div>
                  <Label>Title</Label>
                  <p className="text-sm font-medium">{selectedRfx.title}</p>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.description || "No description provided"}</p>
                </div>

                {selectedRfx.evaluationCriteria && selectedRfx.evaluationCriteria.length > 0 && (
                  <div>
                    <Label>Evaluation Criteria</Label>
                    <div className="mt-2 space-y-2">
                      {selectedRfx.evaluationCriteria.map((criterion) => (
                        <div key={criterion.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{criterion.name}</p>
                              {criterion.description && <p className="text-sm text-muted-foreground">{criterion.description}</p>}
                            </div>
                            <Badge variant="outline">{criterion.weight}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRfx.documents && selectedRfx.documents.length > 0 && (
                  <div>
                    <Label>Documents</Label>
                    <div className="mt-2 space-y-2">
                      {selectedRfx.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRfx.responses && selectedRfx.responses.length > 0 && (
                  <div>
                    <Label>Responses</Label>
                    <div className="mt-2 space-y-2">
                      {selectedRfx.responses.map((response) => (
                        <div key={response.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{response.supplierName}</p>
                              <p className="text-xs text-muted-foreground">
                                Submitted: {response.submittedDate ? new Date(response.submittedDate).toLocaleDateString() : "Pending"}
                              </p>
                            </div>
                            <div className="text-right">
                              {response.score !== undefined && <Badge variant="outline">Score: {response.score}</Badge>}
                              {response.totalAmount && (
                                <p className="text-sm font-medium mt-1">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(response.totalAmount)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {selectedRfx && (
              <Button variant="outline" onClick={() => handleDownloadRfx(selectedRfx)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete RFx Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedRfx?.title}"? This action cannot be undone and all associated
              responses and documents will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRfx} className="bg-red-600 hover:bg-red-700">
              Delete RFx
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close RFx Confirmation Dialog */}
      <AlertDialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close RFx Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close "{selectedRfx?.title}"? No further responses will be accepted after closing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseRfx}>Close RFx</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish RFx Confirmation Dialog */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish RFx Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish "{selectedRfx?.title}"? This will make it visible to suppliers and start the
              response period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishRfx}>Publish RFx</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Evaluation Confirmation Dialog */}
      <AlertDialog open={isCompleteEvaluationDialogOpen} onOpenChange={setIsCompleteEvaluationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Evaluation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete the evaluation for "{selectedRfx?.title}"? This will finalize all scores and
              move the RFx to closed status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteEvaluation}>Complete Evaluation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate RFx Confirmation Dialog */}
      <AlertDialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate RFx Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to duplicate "{selectedRfx?.title}"? A new draft RFx will be created with all the same
              details except it will be in draft status with an extended deadline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicateRfx}>Duplicate RFx</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Extend Deadline Dialog */}
      <Dialog open={isExtendDeadlineDialogOpen} onOpenChange={setIsExtendDeadlineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Deadline</DialogTitle>
            <DialogDescription>Extend the response deadline for this RFx event.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="extend-deadline">New Deadline *</Label>
              <Input
                id="extend-deadline"
                type="date"
                value={extendDeadlineData.newDeadline}
                onChange={(e) => setExtendDeadlineData({ ...extendDeadlineData, newDeadline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="extend-reason">Reason</Label>
              <Textarea
                id="extend-reason"
                value={extendDeadlineData.reason}
                onChange={(e) => setExtendDeadlineData({ ...extendDeadlineData, reason: e.target.value })}
                placeholder="Enter reason for extension"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtendDeadlineDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtendDeadline}>Extend Deadline</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Suppliers Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invite Suppliers</DialogTitle>
            <DialogDescription>Invite suppliers to participate in this RFx event.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Message (Optional)</Label>
              <Textarea
                value={inviteData.message}
                onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                placeholder="Enter a message for suppliers..."
                rows={3}
              />
            </div>
            <div>
              <Label>Suppliers will be invited from the supplier directory matching this RFx category.</Label>
              <p className="text-sm text-muted-foreground mt-1">
                In a production environment, you would select specific suppliers to invite from a list.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setIsInviteDialogOpen(false); alert("Invitations sent successfully!"); }}>
              Send Invitations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={isAddDocumentDialogOpen} onOpenChange={setIsAddDocumentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>Upload a document to this RFx event.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="doc-name">Document Name *</Label>
              <Input
                id="doc-name"
                value={addDocumentData.name}
                onChange={(e) => setAddDocumentData({ ...addDocumentData, name: e.target.value })}
                placeholder="Enter document name"
              />
            </div>
            <div>
              <Label htmlFor="doc-type">Document Type *</Label>
              <Input
                id="doc-type"
                value={addDocumentData.type}
                onChange={(e) => setAddDocumentData({ ...addDocumentData, type: e.target.value })}
                placeholder="e.g., PDF, DOCX, XLSX"
              />
            </div>
            <div>
              <Label htmlFor="doc-size">File Size (bytes) *</Label>
              <Input
                id="doc-size"
                type="number"
                value={addDocumentData.size}
                onChange={(e) => setAddDocumentData({ ...addDocumentData, size: Number(e.target.value) })}
                placeholder="Enter file size in bytes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocumentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument}>Add Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluate Response Dialog */}
      <Dialog open={isEvaluateDialogOpen} onOpenChange={setIsEvaluateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evaluate Response</DialogTitle>
            <DialogDescription>Provide a score for this supplier's response.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="eval-score">Score (0-100) *</Label>
              <Input
                id="eval-score"
                type="number"
                min="0"
                max="100"
                value={evaluationData.score}
                onChange={(e) => setEvaluationData({ ...evaluationData, score: Number(e.target.value) })}
                placeholder="Enter score"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEvaluateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEvaluateResponse}>Submit Evaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={isSendMessageDialogOpen} onOpenChange={setIsSendMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Send a message to the supplier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="message-content">Message *</Label>
              <Textarea
                id="message-content"
                value={sendMessageData.message}
                onChange={(e) => setSendMessageData({ ...sendMessageData, message: e.target.value })}
                placeholder="Enter your message..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Profile Dialog */}
      <Dialog open={isSupplierProfileDialogOpen} onOpenChange={setIsSupplierProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supplier Profile</DialogTitle>
            <DialogDescription>View supplier information.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="rounded-full bg-muted p-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Supplier Details</p>
              <p className="text-sm text-muted-foreground">
                In a production environment, this would show the full supplier profile with contact information,
                performance history, and past contracts.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSupplierProfileDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

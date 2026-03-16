"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FileCheck,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { SidebarInset, SidebarTrigger } from "../components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Textarea } from "../components/ui/textarea"
import { localContracts, localSuppliers } from "../lib/local-data"
import type { Contract } from "../lib/local-data"

interface ContractDocument {
  id: number
  name: string
  type: string
  size: number
  uploadedDate: string
  uploadedBy: string
}

const CONTRACT_TYPES = [
  "Statement of Work",
  "Services Agreement",
  "Master Service",
  "Licenses/Subscriptions",
  "Lease Agreement",
  "Purchase/Blanket",
  "Warranty",
  "Engagement Letter",
] as const

const CONTRACT_STATUSES = ["Active", "Pending", "Expired", "Expiring Soon", "Terminated"] as const

const CATEGORIES = ["IT Equipment", "Office Supplies", "Professional Services", "Facilities", "Marketing"]

const CURRENCIES = ["USD", "AED", "EUR", "GBP"]

export default function ContractRepository() {
  const [contracts, setContracts] = useState<Contract[]>(localContracts)
  const [suppliers] = useState(localSuppliers)
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [contractTypeFilter, setContractTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expandedContract, setExpandedContract] = useState<string | null>(null)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false)
  const [isAmendDialogOpen, setIsAmendDialogOpen] = useState(false)
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDocumentViewDialogOpen, setIsDocumentViewDialogOpen] = useState(false)

  // Selected contract for operations
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<ContractDocument | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    supplierId: "",
    type: "",
    category: "",
    value: "",
    currency: "USD",
    startDate: "",
    endDate: "",
    jurisdiction: "",
    hasLocalSupplier: false,
    hasIndemnity: false,
    hasRenewalClause: false,
    hasTerminationClause: false,
    signedByCEO: false,
  })

  // Renewal/amendment/termination form
  const [actionForm, setActionForm] = useState({
    newEndDate: "",
    newValue: "",
    notes: "",
    reason: "",
    renewalOption: true,
  })

  // Data is loaded from local data on mount, no API calls needed

  // Fetch contracts - now uses local data filtering
  const fetchContracts = async () => {
    setLoading(false)
  }

  // Filters are applied in client-side rendering, no refetch needed

  // Toggle contract expansion
  const toggleContractExpansion = (id: string) => {
    setExpandedContract(expandedContract === id ? null : id)
  }

  // Filter contracts based on tab
  const getTabFilteredContracts = () => {
    const today = new Date()
    
    return contracts.filter((contract) => {
      const endDate = new Date(contract.endDate)
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (selectedTab === "all") return true
      if (selectedTab === "active") return contract.status === "Active"
      if (selectedTab === "pending") return contract.status === "Pending"
      if (selectedTab === "expired") return contract.status === "Expired"
      if (selectedTab === "expiring-soon") {
        return contract.status === "Active" && daysUntilExpiry > 0 && daysUntilExpiry <= 90
      }
      return true
    })
  }

  const tabFilteredContracts = getTabFilteredContracts()

  // Handle filter changes
  const handleContractTypeFilterChange = (value: string) => {
    setContractTypeFilter(value)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Get days to expiry
  const getDaysToExpiry = (endDate: string, status: string) => {
    if (status === "Expired" || status === "Terminated") return null
    const today = new Date()
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : null
  }

  // Get expiry status badge
  const getExpiryBadge = (endDate: string, status: string) => {
    const daysToExpiry = getDaysToExpiry(endDate, status)
    
    if (status === "Expired") {
      return <Badge variant="destructive">Expired</Badge>
    }
    if (status === "Terminated") {
      return <Badge variant="secondary">Terminated</Badge>
    }
    if (daysToExpiry === null) return null
    if (daysToExpiry <= 30) {
      return <Badge variant="destructive">{daysToExpiry} days left</Badge>
    }
    if (daysToExpiry <= 90) {
      return <Badge variant="warning">{daysToExpiry} days left</Badge>
    }
    return <Badge variant="outline">{daysToExpiry} days left</Badge>
  }

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      supplierId: "",
      type: "",
      category: "",
      value: "",
      currency: "USD",
      startDate: "",
      endDate: "",
      jurisdiction: "",
      hasLocalSupplier: false,
      hasIndemnity: false,
      hasRenewalClause: false,
      hasTerminationClause: false,
      signedByCEO: false,
    })
  }

  // Reset action form
  const resetActionForm = () => {
    setActionForm({
      newEndDate: "",
      newValue: "",
      notes: "",
      reason: "",
      renewalOption: true,
    })
  }

  // Open create dialog
  const openCreateDialog = () => {
    resetFormData()
    setIsCreateDialogOpen(true)
  }

  // Open edit dialog
  const openEditDialog = (contract: Contract) => {
    setSelectedContract(contract)
    setFormData({
      title: contract.title,
      supplierId: contract.supplierId,
      type: contract.type,
      category: contract.category,
      value: contract.value.toString(),
      currency: contract.currency,
      startDate: contract.startDate,
      endDate: contract.endDate,
      jurisdiction: contract.jurisdiction,
      hasLocalSupplier: contract.hasLocalSupplier,
      hasIndemnity: contract.hasIndemnity,
      hasRenewalClause: contract.hasRenewalClause,
      hasTerminationClause: contract.hasTerminationClause,
      signedByCEO: contract.signedByCEO,
    })
    setIsEditDialogOpen(true)
  }

  // Open view dialog
  const openViewDialog = (contract: Contract) => {
    setSelectedContract(contract)
    setIsViewDialogOpen(true)
  }

  // Open renew dialog
  const openRenewDialog = (contract: Contract) => {
    setSelectedContract(contract)
    resetActionForm()
    setIsRenewDialogOpen(true)
  }

  // Open amend dialog
  const openAmendDialog = (contract: Contract) => {
    setSelectedContract(contract)
    resetActionForm()
    setIsAmendDialogOpen(true)
  }

  // Open terminate dialog
  const openTerminateDialog = (contract: Contract) => {
    setSelectedContract(contract)
    setActionForm({ ...actionForm, reason: "" })
    setIsTerminateDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (contract: Contract) => {
    setSelectedContract(contract)
    setIsDeleteDialogOpen(true)
  }

  // Open document view dialog
  const openDocumentViewDialog = (document: ContractDocument) => {
    setSelectedDocument(document)
    setIsDocumentViewDialogOpen(true)
  }

  // Create contract
  const handleCreateContract = async () => {
    const supplier = suppliers.find(s => s.id === formData.supplierId)
    const newContract: Contract = {
      id: `CONTR-${String(contracts.length + 1).padStart(5, '0')}`,
      title: formData.title,
      type: formData.type,
      supplierId: formData.supplierId,
      supplierName: supplier?.name || "Unknown",
      category: formData.category,
      value: parseFloat(formData.value),
      currency: formData.currency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      jurisdiction: formData.jurisdiction,
      status: "Pending",
      hasLocalSupplier: formData.hasLocalSupplier,
      hasIndemnity: formData.hasIndemnity,
      hasRenewalClause: formData.hasRenewalClause,
      hasTerminationClause: formData.hasTerminationClause,
      signedByCEO: formData.signedByCEO,
      milestones: [],
      documents: [],
    }
    setContracts([...contracts, newContract])
    setIsCreateDialogOpen(false)
    resetFormData()
  }

  // Update contract
  const handleUpdateContract = async () => {
    if (!selectedContract) return

    const supplier = suppliers.find(s => s.id === formData.supplierId)
    const updated = {
      ...selectedContract,
      title: formData.title,
      type: formData.type,
      supplierId: formData.supplierId,
      supplierName: supplier?.name || selectedContract.supplierName,
      category: formData.category,
      value: parseFloat(formData.value),
      currency: formData.currency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      jurisdiction: formData.jurisdiction,
      hasLocalSupplier: formData.hasLocalSupplier,
      hasIndemnity: formData.hasIndemnity,
      hasRenewalClause: formData.hasRenewalClause,
      hasTerminationClause: formData.hasTerminationClause,
      signedByCEO: formData.signedByCEO,
    }
    setContracts(contracts.map(c => c.id === selectedContract.id ? updated : c))
    setIsEditDialogOpen(false)
    resetFormData()
    setSelectedContract(null)
  }

  // Renew contract
  const handleRenewContract = async () => {
    if (!selectedContract) return

    const updated = {
      ...selectedContract,
      endDate: actionForm.newEndDate,
      value: actionForm.newValue ? parseFloat(actionForm.newValue) : selectedContract.value,
      hasRenewalClause: actionForm.renewalOption,
      status: "Active" as const,
    }
    setContracts(contracts.map(c => c.id === selectedContract.id ? updated : c))
    setIsRenewDialogOpen(false)
    resetActionForm()
    setSelectedContract(null)
  }

  // Amend contract
  const handleAmendContract = async () => {
    if (!selectedContract) return

    const updated = {
      ...selectedContract,
      value: actionForm.newValue ? parseFloat(actionForm.newValue) : selectedContract.value,
      endDate: actionForm.newEndDate || selectedContract.endDate,
      hasRenewalClause: actionForm.renewalOption,
    }
    setContracts(contracts.map(c => c.id === selectedContract.id ? updated : c))
    setIsAmendDialogOpen(false)
    resetActionForm()
    setSelectedContract(null)
  }

  // Terminate contract
  const handleTerminateContract = async () => {
    if (!selectedContract) return

    const updated = {
      ...selectedContract,
      status: "Terminated" as const,
    }
    setContracts(contracts.map(c => c.id === selectedContract.id ? updated : c))
    setIsTerminateDialogOpen(false)
    setSelectedContract(null)
  }

  // Delete contract
  const handleDeleteContract = async () => {
    if (!selectedContract) return

    setContracts(contracts.filter(c => c.id !== selectedContract.id))
    setIsDeleteDialogOpen(false)
    setSelectedContract(null)
  }

  // Download contract
  const handleDownloadContract = (contract: Contract) => {
    const contractText = `
CONTRACT DETAILS
===============

Contract ID: ${contract.id}
Title: ${contract.title}
Type: ${contract.type}
Category: ${contract.category}
Status: ${contract.status}

SUPPLIER
--------
Supplier ID: ${contract.supplierId}
Supplier Name: ${contract.supplierName}

VALUE & TERMS
-------------
Value: ${contract.currency} ${contract.value.toLocaleString()}
Currency: ${contract.currency}
Start Date: ${contract.startDate}
End Date: ${contract.endDate}
Renewal Option: ${contract.hasRenewalClause ? "Yes" : "No"}
Jurisdiction: ${contract.jurisdiction}

CONTRACT CLAUSES
----------------
Local Supplier: ${contract.hasLocalSupplier ? "Yes" : "No"}
Indemnity Clause: ${contract.hasIndemnity ? "Yes" : "No"}
Renewal Clause: ${contract.hasRenewalClause ? "Yes" : "No"}
Termination Clause: ${contract.hasTerminationClause ? "Yes" : "No"}
Signed by CEO: ${contract.signedByCEO ? "Yes" : "No"}

MILESTONES
----------
${contract.milestones?.map(m => `- ${m.name}: ${m.dueDate} (${m.status})${m.amount ? ` - ${m.amount}` : ""}`).join("\n") || "No milestones"}

DOCUMENTS
---------
${contract.documents?.map(d => `- ${d.name} (${d.type}, ${d.size} bytes)`).join("\n") || "No documents"}
    `.trim()

    const blob = new Blob([contractText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${contract.id}_${contract.title.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download document
  const handleDownloadDocument = (doc: ContractDocument) => {
    const documentText = `
DOCUMENT DETAILS
================

Document ID: ${doc.id}
Name: ${doc.name}
Type: ${doc.type}
Size: ${doc.size} bytes
Upload Date: ${doc.uploadedDate}
Uploaded By: ${doc.uploadedBy}
    `.trim()

    const blob = new Blob([documentText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Render contract card
  const renderContractCard = (contract: Contract) => {
    const daysToExpiry = getDaysToExpiry(contract.endDate, contract.status)
    const isExpiringSoon = daysToExpiry !== null && daysToExpiry <= 90

    return (
      <Card key={contract.id} className="overflow-hidden">
        <Collapsible
          open={expandedContract === contract.id}
          onOpenChange={(open) => {
            if (open !== (expandedContract === contract.id)) {
              toggleContractExpansion(contract.id)
            }
          }}
        >
          <CardHeader className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6"
                    onClick={() => toggleContractExpansion(contract.id)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedContract === contract.id ? "rotate-180" : ""}`} />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
                <h3 className="font-semibold">{contract.title}</h3>
                <Badge variant="outline">{contract.id}</Badge>
              </div>
              <p className="text-sm">{contract.supplierName}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge
                  variant={
                    contract.status === "Active"
                      ? "success"
                      : contract.status === "Pending"
                        ? "warning"
                        : contract.status === "Terminated"
                          ? "secondary"
                          : "destructive"
                  }
                >
                  {contract.status}
                </Badge>
                <span>•</span>
                <span>Type: {contract.type}</span>
                <span>•</span>
                <span>Category: {contract.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: contract.currency,
                    maximumFractionDigits: 0,
                  }).format(contract.value)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(contract.startDate).toLocaleDateString()} -{" "}
                  {new Date(contract.endDate).toLocaleDateString()}
                </span>
              </div>
              {getExpiryBadge(contract.endDate, contract.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openViewDialog(contract)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openEditDialog(contract)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadContract(contract)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openRenewDialog(contract)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renew Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAmendDialog(contract)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Amend Contract
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openTerminateDialog(contract)} className="text-destructive">
                    <X className="mr-2 h-4 w-4" />
                    Terminate Contract
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openDeleteDialog(contract)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
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
                  <h4 className="text-sm font-medium mb-2">Contract Details</h4>
                  <dl className="grid grid-cols-2 gap-1 text-sm">
                    <dt className="text-muted-foreground">Start Date:</dt>
                    <dd>{new Date(contract.startDate).toLocaleDateString()}</dd>
                    <dt className="text-muted-foreground">End Date:</dt>
                    <dd>{new Date(contract.endDate).toLocaleDateString()}</dd>
                    <dt className="text-muted-foreground">Category:</dt>
                    <dd>{contract.category}</dd>
                    <dt className="text-muted-foreground">Jurisdiction:</dt>
                    <dd>{contract.jurisdiction}</dd>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Contract Clauses</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={contract.hasLocalSupplier} disabled />
                      <span>Local Supplier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={contract.hasIndemnity} disabled />
                      <span>Indemnity Clause</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={contract.hasRenewalClause} disabled />
                      <span>Renewal Clause</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={contract.hasTerminationClause} disabled />
                      <span>Termination Clause</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={contract.signedByCEO} disabled />
                      <span>Signed by CEO</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Milestones</h4>
                  <div className="space-y-2">
                    {contract.milestones && contract.milestones.length > 0 ? (
                      contract.milestones.map((milestone) => (
                        <div key={milestone.id} className="p-2 border rounded-md">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{milestone.name}</span>
                            <Badge
                              variant={
                                milestone.status === "Completed"
                                  ? "success"
                                  : milestone.status === "In Progress"
                                    ? "warning"
                                    : milestone.status === "Overdue"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="text-xs"
                            >
                              {milestone.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            {milestone.amount && ` • ${contract.currency} ${milestone.amount.toLocaleString()}`}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No milestones defined</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Documents</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {contract.documents && contract.documents.length > 0 ? (
                    contract.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-sm">{doc.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {(doc.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openDocumentViewDialog(doc)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents attached</p>
                  )}
                </div>
                {contract.documents && contract.documents.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="w-full" onClick={() => openViewDialog(contract)}>
                      <FileCheck className="mr-2 h-4 w-4" />
                      View All Documents
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {isExpiringSoon && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => openRenewDialog(contract)}
                >
                  <AlertCircle className="h-4 w-4" />
                  {daysToExpiry && daysToExpiry <= 30 ? "Urgent Renewal Required" : "Plan Renewal"}
                </Button>
              )}
              <Button variant="outline" onClick={() => handleDownloadContract(contract)}>
                <Download className="mr-2 h-4 w-4" />
                Download Contract
              </Button>
              <Button onClick={() => openViewDialog(contract)}>
                <Eye className="mr-2 h-4 w-4" />
                View Full Contract
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
        </Collapsible>
      </Card>
    )
  }

  // Render tab content
  const renderTabContent = (contractsToRender: Contract[]) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (contractsToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No contracts found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button className="mt-4" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Contract
          </Button>
        </div>
      )
    }

    return <div className="space-y-4 mt-4">{contractsToRender.map((contract) => renderContractCard(contract))}</div>
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
        <div className="flex items-center text-lg font-semibold">Contract Repository</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={fetchContracts}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="expiring-soon">Expiring Soon</TabsTrigger>
            </TabsList>
            <div className={`flex items-center gap-2 transition-all ${showFilters ? "opacity-100" : "opacity-50"}`}>
              <Select value={contractTypeFilter} onValueChange={handleContractTypeFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Contract Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CONTRACT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {CONTRACT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contracts..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="all">{renderTabContent(tabFilteredContracts)}</TabsContent>
          <TabsContent value="active">
            {renderTabContent(tabFilteredContracts.filter((c) => c.status === "Active"))}
          </TabsContent>
          <TabsContent value="pending">
            {renderTabContent(tabFilteredContracts.filter((c) => c.status === "Pending"))}
          </TabsContent>
          <TabsContent value="expired">
            {renderTabContent(tabFilteredContracts.filter((c) => c.status === "Expired"))}
          </TabsContent>
          <TabsContent value="expiring-soon">
            {renderTabContent(tabFilteredContracts.filter((c) => {
              const daysToExpiry = getDaysToExpiry(c.endDate, c.status)
              return daysToExpiry !== null && daysToExpiry > 0 && daysToExpiry <= 90
            }))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
            <DialogDescription>Fill in the details to create a new contract.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter contract title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplierId} onValueChange={(value: string) => setFormData({ ...formData, supplierId: value })}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter value"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value: string) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Input
                id="jurisdiction"
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                placeholder="Enter jurisdiction"
              />
            </div>
            <div className="grid gap-2">
              <Label>Contract Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="localSupplier"
                    checked={formData.hasLocalSupplier}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasLocalSupplier: checked })}
                  />
                  <Label htmlFor="localSupplier" className="text-sm cursor-pointer">Local Supplier</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="indemnity"
                    checked={formData.hasIndemnity}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasIndemnity: checked })}
                  />
                  <Label htmlFor="indemnity" className="text-sm cursor-pointer">Indemnity Clause</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="renewalClause"
                    checked={formData.hasRenewalClause}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasRenewalClause: checked })}
                  />
                  <Label htmlFor="renewalClause" className="text-sm cursor-pointer">Renewal Clause</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terminationClause"
                    checked={formData.hasTerminationClause}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasTerminationClause: checked })}
                  />
                  <Label htmlFor="terminationClause" className="text-sm cursor-pointer">Termination Clause</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="signedByCEO"
                    checked={formData.signedByCEO}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, signedByCEO: checked })}
                  />
                  <Label htmlFor="signedByCEO" className="text-sm cursor-pointer">Signed by CEO</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateContract}>Create Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contract Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Update the contract details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter contract title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-supplier">Supplier *</Label>
              <Select value={formData.supplierId} onValueChange={(value: string) => setFormData({ ...formData, supplierId: value })}>
                <SelectTrigger id="edit-supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-value">Value *</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter value"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value: string) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger id="edit-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date *</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-jurisdiction">Jurisdiction</Label>
              <Input
                id="edit-jurisdiction"
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                placeholder="Enter jurisdiction"
              />
            </div>
            <div className="grid gap-2">
              <Label>Contract Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-localSupplier"
                    checked={formData.hasLocalSupplier}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasLocalSupplier: checked })}
                  />
                  <Label htmlFor="edit-localSupplier" className="text-sm cursor-pointer">Local Supplier</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-indemnity"
                    checked={formData.hasIndemnity}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasIndemnity: checked })}
                  />
                  <Label htmlFor="edit-indemnity" className="text-sm cursor-pointer">Indemnity Clause</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-renewalClause"
                    checked={formData.hasRenewalClause}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasRenewalClause: checked })}
                  />
                  <Label htmlFor="edit-renewalClause" className="text-sm cursor-pointer">Renewal Clause</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-terminationClause"
                    checked={formData.hasTerminationClause}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, hasTerminationClause: checked })}
                  />
                  <Label htmlFor="edit-terminationClause" className="text-sm cursor-pointer">Termination Clause</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-signedByCEO"
                    checked={formData.signedByCEO}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, signedByCEO: checked })}
                  />
                  <Label htmlFor="edit-signedByCEO" className="text-sm cursor-pointer">Signed by CEO</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateContract}>Update Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contract Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>View all contract information</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Contract ID</Label>
                  <p className="font-medium">{selectedContract.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Status</Label>
                  <Badge
                    variant={
                      selectedContract.status === "Active"
                        ? "success"
                        : selectedContract.status === "Pending"
                          ? "warning"
                          : selectedContract.status === "Terminated"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {selectedContract.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Title</Label>
                  <p className="font-medium">{selectedContract.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Type</Label>
                  <p className="font-medium">{selectedContract.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Category</Label>
                  <p className="font-medium">{selectedContract.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Jurisdiction</Label>
                  <p className="font-medium">{selectedContract.jurisdiction}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Supplier Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Supplier ID</Label>
                    <p className="font-medium">{selectedContract.supplierId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Supplier Name</Label>
                    <p className="font-medium">{selectedContract.supplierName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Value & Terms</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Value</Label>
                    <p className="font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: selectedContract.currency,
                      }).format(selectedContract.value)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Currency</Label>
                    <p className="font-medium">{selectedContract.currency}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Start Date</Label>
                    <p className="font-medium">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">End Date</Label>
                    <p className="font-medium">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Contract Clauses</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedContract.hasLocalSupplier} disabled />
                    <span className="text-sm">Local Supplier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedContract.hasIndemnity} disabled />
                    <span className="text-sm">Indemnity Clause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedContract.hasRenewalClause} disabled />
                    <span className="text-sm">Renewal Clause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedContract.hasTerminationClause} disabled />
                    <span className="text-sm">Termination Clause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedContract.signedByCEO} disabled />
                    <span className="text-sm">Signed by CEO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedContract.hasRenewalClause} disabled />
                    <span className="text-sm">Renewal Option</span>
                  </div>
                </div>
              </div>

              {selectedContract.milestones && selectedContract.milestones.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {selectedContract.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{milestone.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              {milestone.amount && ` • ${selectedContract.currency} ${milestone.amount.toLocaleString()}`}
                            </p>
                          </div>
                          <Badge
                            variant={
                              milestone.status === "Completed"
                                ? "success"
                                : milestone.status === "In Progress"
                                  ? "warning"
                                  : milestone.status === "Overdue"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedContract.documents && selectedContract.documents.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Documents</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedContract.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openDocumentViewDialog(doc)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Contract Dialog */}
      <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
            <DialogDescription>
              {selectedContract && `Renew contract ${selectedContract.id} - ${selectedContract.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="renew-endDate">New End Date *</Label>
              <Input
                id="renew-endDate"
                type="date"
                value={actionForm.newEndDate}
                onChange={(e) => setActionForm({ ...actionForm, newEndDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="renew-value">New Value (optional)</Label>
              <Input
                id="renew-value"
                type="number"
                value={actionForm.newValue}
                onChange={(e) => setActionForm({ ...actionForm, newValue: e.target.value })}
                placeholder="Leave empty to keep current value"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="renew-option"
                checked={actionForm.renewalOption}
                onCheckedChange={(checked: boolean) => setActionForm({ ...actionForm, renewalOption: checked })}
              />
              <Label htmlFor="renew-option" className="cursor-pointer">Include renewal option</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="renew-notes">Notes</Label>
              <Textarea
                id="renew-notes"
                value={actionForm.notes}
                onChange={(e) => setActionForm({ ...actionForm, notes: e.target.value })}
                placeholder="Add any notes about the renewal"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenewContract}>Renew Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Amend Contract Dialog */}
      <Dialog open={isAmendDialogOpen} onOpenChange={setIsAmendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Amend Contract</DialogTitle>
            <DialogDescription>
              {selectedContract && `Amend contract ${selectedContract.id} - ${selectedContract.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amend-endDate">New End Date (optional)</Label>
              <Input
                id="amend-endDate"
                type="date"
                value={actionForm.newEndDate}
                onChange={(e) => setActionForm({ ...actionForm, newEndDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amend-value">New Value (optional)</Label>
              <Input
                id="amend-value"
                type="number"
                value={actionForm.newValue}
                onChange={(e) => setActionForm({ ...actionForm, newValue: e.target.value })}
                placeholder="Leave empty to keep current value"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="amend-option"
                checked={actionForm.renewalOption}
                onCheckedChange={(checked: boolean) => setActionForm({ ...actionForm, renewalOption: checked })}
              />
              <Label htmlFor="amend-option" className="cursor-pointer">Update renewal option</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amend-notes">Amendment Notes</Label>
              <Textarea
                id="amend-notes"
                value={actionForm.notes}
                onChange={(e) => setActionForm({ ...actionForm, notes: e.target.value })}
                placeholder="Describe the amendment details"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAmendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAmendContract}>Amend Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Contract Dialog */}
      <Dialog open={isTerminateDialogOpen} onOpenChange={setIsTerminateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Terminate Contract</DialogTitle>
            <DialogDescription>
              {selectedContract && `Are you sure you want to terminate contract ${selectedContract.id}?`}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="py-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Title:</span> {selectedContract.title}</p>
                    <p><span className="font-medium">Supplier:</span> {selectedContract.supplierName}</p>
                    <p><span className="font-medium">Value:</span> {selectedContract.currency} {selectedContract.value.toLocaleString()}</p>
                    <p><span className="font-medium">End Date:</span> {new Date(selectedContract.endDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-2 mt-4">
                <Label htmlFor="terminate-reason">Reason for Termination *</Label>
                <Textarea
                  id="terminate-reason"
                  value={actionForm.reason}
                  onChange={(e) => setActionForm({ ...actionForm, reason: e.target.value })}
                  placeholder="Provide a reason for termination"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTerminateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleTerminateContract}>
              Terminate Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Contract Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Contract</DialogTitle>
            <DialogDescription>
              {selectedContract && `Are you sure you want to delete contract ${selectedContract.id}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="py-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Title:</span> {selectedContract.title}</p>
                    <p><span className="font-medium">Supplier:</span> {selectedContract.supplierName}</p>
                    <p><span className="font-medium">Value:</span> {selectedContract.currency} {selectedContract.value.toLocaleString()}</p>
                    <p><span className="font-medium">Status:</span> {selectedContract.status}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContract}>
              Delete Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document View Dialog */}
      <Dialog open={isDocumentViewDialogOpen} onOpenChange={setIsDocumentViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="py-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground text-sm">Document Name</Label>
                      <p className="font-medium">{selectedDocument.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-sm">Type</Label>
                        <p className="font-medium">{selectedDocument.type}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Size</Label>
                        <p className="font-medium">{(selectedDocument.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Upload Date</Label>
                        <p className="font-medium">{new Date(selectedDocument.uploadedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm">Uploaded By</Label>
                        <p className="font-medium">{selectedDocument.uploadedBy}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentViewDialogOpen(false)}>
              Close
            </Button>
            {selectedDocument && (
              <Button onClick={() => handleDownloadDocument(selectedDocument)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

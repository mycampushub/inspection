"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
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
  RotateCcw,
  Ban,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/lib/toast"

export default function ContractRepository() {
  const { toast, notifications, dismiss } = useToast()
  const { contracts, addContract, updateContract, deleteContract, approveContract, renewContract, terminateContract } = useAppStore()

  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedContract, setExpandedContract] = useState<string | null>(null)
  const [showNewContractDialog, setShowNewContractDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showRenewDialog, setShowRenewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showTerminateDialog, setShowTerminateDialog] = useState(false)
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  const [newContract, setNewContract] = useState({
    title: "",
    supplier: "",
    type: "",
    department: "",
    startDate: "",
    endDate: "",
    value: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    paymentTerms: "",
    renewalTerms: "",
  })

  const [renewEndDate, setRenewEndDate] = useState("")

  const toggleContractExpansion = (id: string) => {
    setExpandedContract(expandedContract === id ? null : id)
  }

  const handleCreateContract = () => {
    if (!newContract.title || !newContract.supplier || !newContract.type || !newContract.department || !newContract.startDate || !newContract.endDate || !newContract.value) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addContract({
      title: newContract.title,
      supplier: newContract.supplier,
      type: newContract.type,
      status: "Pending Approval",
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      value: parseFloat(newContract.value) || 0,
      department: newContract.department,
      description: newContract.description,
      contactName: newContract.contactName,
      contactEmail: newContract.contactEmail,
      contactPhone: newContract.contactPhone,
      paymentTerms: newContract.paymentTerms,
      renewalTerms: newContract.renewalTerms,
    })

    setShowNewContractDialog(false)
    resetContractForm()
  }

  const handleEditContract = () => {
    if (!selectedContract) return

    updateContract(selectedContract, {
      title: newContract.title,
      supplier: newContract.supplier,
      type: newContract.type,
      department: newContract.department,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      value: parseFloat(newContract.value) || 0,
      description: newContract.description,
      contactName: newContract.contactName,
      contactEmail: newContract.contactEmail,
      contactPhone: newContract.contactPhone,
      paymentTerms: newContract.paymentTerms,
      renewalTerms: newContract.renewalTerms,
    })

    setShowEditDialog(false)
    setSelectedContract(null)
    toast({
      title: "Contract Updated",
      description: "Contract has been updated successfully.",
      variant: "success",
    })
  }

  const handleRenewContract = () => {
    if (!selectedContract || !renewEndDate) return
    renewContract(selectedContract, renewEndDate)
    setShowRenewDialog(false)
    setSelectedContract(null)
    setRenewEndDate("")
  }

  const handleDeleteContract = () => {
    if (!selectedContract) return
    deleteContract(selectedContract)
    setShowDeleteDialog(false)
    setSelectedContract(null)
  }

  const handleTerminateContract = () => {
    if (!selectedContract) return
    terminateContract(selectedContract)
    setShowTerminateDialog(false)
    setSelectedContract(null)
  }

  const handleApproveContract = (id: string) => {
    approveContract(id)
    toast({
      title: "Contract Approved",
      description: `Contract ${id} has been approved.`,
      variant: "success",
    })
  }

  const resetContractForm = () => {
    setNewContract({
      title: "",
      supplier: "",
      type: "",
      department: "",
      startDate: "",
      endDate: "",
      value: "",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      paymentTerms: "",
      renewalTerms: "",
    })
  }

  const openEditDialog = (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId)
    if (contract) {
      setSelectedContract(contractId)
      setNewContract({
        title: contract.title,
        supplier: contract.supplier,
        type: contract.type,
        department: contract.department,
        startDate: contract.startDate,
        endDate: contract.endDate,
        value: contract.value.toString(),
        description: contract.description,
        contactName: contract.contactName,
        contactEmail: contract.contactEmail,
        contactPhone: contract.contactPhone,
        paymentTerms: contract.paymentTerms,
        renewalTerms: contract.renewalTerms,
      })
      setShowEditDialog(true)
    }
  }

  // Filter contracts based on search and tab
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "active") return contract.status === "Active" && matchesSearch
    if (selectedTab === "pending") return contract.status === "Pending Approval" && matchesSearch
    if (selectedTab === "expired") return contract.status === "Expired" && matchesSearch
    if (selectedTab === "expiring-soon")
      return contract.daysToExpiry !== null && contract.daysToExpiry <= 60 && matchesSearch
    return matchesSearch
  })

  return (
    </>
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
          <Button size="sm" variant="outline" onClick={() => { toast({ title: "Refreshed", description: "Contracts refreshed successfully", variant: "success" }); }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Dialog open={showNewContractDialog} onOpenChange={setShowNewContractDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>
                  Fill in the contract details. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-title">Contract Title *</Label>
                    <Input
                      id="contract-title"
                      placeholder="Enter contract title"
                      value={newContract.title}
                      onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-supplier">Supplier *</Label>
                    <Input
                      id="contract-supplier"
                      placeholder="Enter supplier name"
                      value={newContract.supplier}
                      onChange={(e) => setNewContract({ ...newContract, supplier: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-type">Contract Type *</Label>
                    <Select
                      value={newContract.type}
                      onValueChange={(value) => setNewContract({ ...newContract, type: value })}
                    >
                      <SelectTrigger id="contract-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                        <SelectItem value="Purchase Agreement">Purchase Agreement</SelectItem>
                        <SelectItem value="Master Service Agreement">Master Service Agreement</SelectItem>
                        <SelectItem value="License Agreement">License Agreement</SelectItem>
                        <SelectItem value="Statement of Work">Statement of Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-department">Department *</Label>
                    <Select
                      value={newContract.department}
                      onValueChange={(value) => setNewContract({ ...newContract, department: value })}
                    >
                      <SelectTrigger id="contract-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-start">Start Date *</Label>
                    <Input
                      id="contract-start"
                      type="date"
                      value={newContract.startDate}
                      onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-end">End Date *</Label>
                    <Input
                      id="contract-end"
                      type="date"
                      value={newContract.endDate}
                      onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-value">Contract Value (USD) *</Label>
                    <Input
                      id="contract-value"
                      type="number"
                      placeholder="0.00"
                      value={newContract.value}
                      onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract-description">Description</Label>
                  <Textarea
                    id="contract-description"
                    placeholder="Enter contract description..."
                    value={newContract.description}
                    onChange={(e) => setNewContract({ ...newContract, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Contact person name"
                      value={newContract.contactName}
                      onChange={(e) => setNewContract({ ...newContract, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="contact@supplier.com"
                      value={newContract.contactEmail}
                      onChange={(e) => setNewContract({ ...newContract, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input
                      id="contact-phone"
                      placeholder="+1 (555) 123-4567"
                      value={newContract.contactPhone}
                      onChange={(e) => setNewContract({ ...newContract, contactPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Input
                      id="payment-terms"
                      placeholder="Net 30"
                      value={newContract.paymentTerms}
                      onChange={(e) => setNewContract({ ...newContract, paymentTerms: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewal-terms">Renewal Terms</Label>
                  <Textarea
                    id="renewal-terms"
                    placeholder="Renewal conditions..."
                    value={newContract.renewalTerms}
                    onChange={(e) => setNewContract({ ...newContract, renewalTerms: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewContractDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContract}>Create Contract</Button>
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
        <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All ({contracts.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({contracts.filter(c => c.status === 'Active').length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({contracts.filter(c => c.status === 'Pending Approval').length})</TabsTrigger>
              <TabsTrigger value="expiring-soon">Expiring Soon ({contracts.filter(c => c.daysToExpiry !== null && c.daysToExpiry <= 60).length})</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Contract Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="service">Service Agreement</SelectItem>
                  <SelectItem value="purchase">Purchase Agreement</SelectItem>
                  <SelectItem value="master">Master Service Agreement</SelectItem>
                  <SelectItem value="statement">Statement of Work</SelectItem>
                  <SelectItem value="license">License Agreement</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contracts..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <ContractList
              contracts={filteredContracts}
              expandedContract={expandedContract}
              toggleContractExpansion={toggleContractExpansion}
              onEdit={openEditDialog}
              onApprove={handleApproveContract}
              onRenew={(id) => { setSelectedContract(id); setShowRenewDialog(true); }}
              onTerminate={(id) => { setSelectedContract(id); setShowTerminateDialog(true); }}
              onDelete={(id) => { setSelectedContract(id); setShowDeleteDialog(true); }}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <ContractList
              contracts={filteredContracts}
              expandedContract={expandedContract}
              toggleContractExpansion={toggleContractExpansion}
              onEdit={openEditDialog}
              onApprove={handleApproveContract}
              onRenew={(id) => { setSelectedContract(id); setShowRenewDialog(true); }}
              onTerminate={(id) => { setSelectedContract(id); setShowTerminateDialog(true); }}
              onDelete={(id) => { setSelectedContract(id); setShowDeleteDialog(true); }}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <ContractList
              contracts={filteredContracts}
              expandedContract={expandedContract}
              toggleContractExpansion={toggleContractExpansion}
              onEdit={openEditDialog}
              onApprove={handleApproveContract}
              onRenew={(id) => { setSelectedContract(id); setShowRenewDialog(true); }}
              onTerminate={(id) => { setSelectedContract(id); setShowTerminateDialog(true); }}
              onDelete={(id) => { setSelectedContract(id); setShowDeleteDialog(true); }}
            />
          </TabsContent>

          <TabsContent value="expiring-soon" className="space-y-4">
            <ContractList
              contracts={filteredContracts}
              expandedContract={expandedContract}
              toggleContractExpansion={toggleContractExpansion}
              onEdit={openEditDialog}
              onApprove={handleApproveContract}
              onRenew={(id) => { setSelectedContract(id); setShowRenewDialog(true); }}
              onTerminate={(id) => { setSelectedContract(id); setShowTerminateDialog(true); }}
              onDelete={(id) => { setSelectedContract(id); setShowDeleteDialog(true); }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Update the contract details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Contract Title</Label>
                <Input
                  id="edit-title"
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Supplier</Label>
                <Input
                  id="edit-supplier"
                  value={newContract.supplier}
                  onChange={(e) => setNewContract({ ...newContract, supplier: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Contract Type</Label>
                <Select
                  value={newContract.type}
                  onValueChange={(value) => setNewContract({ ...newContract, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                    <SelectItem value="Purchase Agreement">Purchase Agreement</SelectItem>
                    <SelectItem value="Master Service Agreement">Master Service Agreement</SelectItem>
                    <SelectItem value="License Agreement">License Agreement</SelectItem>
                    <SelectItem value="Statement of Work">Statement of Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={newContract.department}
                  onValueChange={(value) => setNewContract({ ...newContract, department: value })}
                >
                  <SelectTrigger id="edit-department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start">Start Date</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={newContract.startDate}
                  onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end">End Date</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={newContract.endDate}
                  onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value (USD)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={newContract.value}
                  onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditContract}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <div className="grid gap-2">
              <Label htmlFor="renew-date">New End Date *</Label>
              <Input
                id="renew-date"
                type="date"
                value={renewEndDate}
                onChange={(e) => setRenewEndDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>Cancel</Button>
            <Button onClick={handleRenewContract}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Renew Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contract? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContract} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminate Dialog */}
      <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to terminate this contract? This will end the contract immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminateContract} className="bg-red-600 hover:bg-red-700">
              <Ban className="mr-2 h-4 w-4" />
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function ContractList({ contracts, expandedContract, toggleContractExpansion, onEdit, onApprove, onRenew, onTerminate, onDelete }: any) {
  return (
    <div className="space-y-4 mt-4">
      {contracts.map((contract: any) => (
        <Collapsible
          key={contract.id}
          open={expandedContract === contract.id}
          onOpenChange={() => toggleContractExpansion(contract.id)}
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
                    <h3 className="font-semibold">{contract.title}</h3>
                    <Badge variant="outline">{contract.id}</Badge>
                  </div>
                  <p className="text-sm">{contract.supplier}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge
                      variant={
                        contract.status === "Active"
                          ? "success"
                          : contract.status === "Pending Approval"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {contract.status}
                    </Badge>
                    <span>•</span>
                    <span>Type: {contract.type}</span>
                    <span>•</span>
                    <span>Department: {contract.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(contract.value)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contract.startDate).toLocaleDateString()} -{" "}
                      {new Date(contract.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {contract.daysToExpiry !== null && (
                    <Badge
                      variant={
                        contract.daysToExpiry <= 30
                          ? "destructive"
                          : contract.daysToExpiry <= 90
                            ? "warning"
                            : "outline"
                      }
                    >
                      {contract.daysToExpiry} days left
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/sourcing-contracts/contracts/${contract.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Contract
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(contract.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Contract
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {contract.status === "Pending Approval" && (
                        <DropdownMenuItem onClick={() => onApprove(contract.id)}>
                          <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                          Approve Contract
                        </DropdownMenuItem>
                      )}
                      {contract.status === "Active" && contract.daysToExpiry !== null && contract.daysToExpiry <= 90 && (
                        <DropdownMenuItem onClick={() => onRenew(contract.id)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Renew Contract
                        </DropdownMenuItem>
                      )}
                      {contract.status === "Active" && (
                        <DropdownMenuItem onClick={() => onTerminate(contract.id)} className="text-red-600">
                          <Ban className="mr-2 h-4 w-4" />
                          Terminate Contract
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(contract.id)} className="text-destructive">
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
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{contract.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Contract Details</h4>
                      <dl className="grid grid-cols-2 gap-1 text-sm">
                        <dt className="text-muted-foreground">Start Date:</dt>
                        <dd>{new Date(contract.startDate).toLocaleDateString()}</dd>
                        <dt className="text-muted-foreground">End Date:</dt>
                        <dd>{new Date(contract.endDate).toLocaleDateString()}</dd>
                        <dt className="text-muted-foreground">Department:</dt>
                        <dd>{contract.department}</dd>
                        <dt className="text-muted-foreground">Payment Terms:</dt>
                        <dd>{contract.paymentTerms || "N/A"}</dd>
                        <dt className="text-muted-foreground">Renewal Terms:</dt>
                        <dd className="text-xs">{contract.renewalTerms || "N/A"}</dd>
                      </dl>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Supplier Contact</h4>
                      <dl className="grid grid-cols-2 gap-1 text-sm">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd>{contract.contactName || "N/A"}</dd>
                        <dt className="text-muted-foreground">Email:</dt>
                        <dd>
                          {contract.contactEmail ? (
                            <a href={`mailto:${contract.contactEmail}`} className="text-primary hover:underline">
                              {contract.contactEmail}
                            </a>
                          ) : "N/A"}
                        </dd>
                        <dt className="text-muted-foreground">Phone:</dt>
                        <dd>
                          {contract.contactPhone ? (
                            <a href={`tel:${contract.contactPhone}`} className="text-primary hover:underline">
                              {contract.contactPhone}
                            </a>
                          ) : "N/A"}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Documents</h4>
                    <div className="space-y-2">
                      {contract.documents && contract.documents.length > 0 ? (
                        contract.documents.map((doc: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="text-sm">{doc.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">{doc.size}</span>
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
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No documents attached</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  {contract.daysToExpiry !== null && contract.daysToExpiry <= 90 && (
                    <Button variant="outline" className="gap-2" onClick={() => onRenew(contract.id)}>
                      <AlertCircle className="h-4 w-4" />
                      {contract.daysToExpiry <= 30 ? "Urgent Renewal Required" : "Plan Renewal"}
                    </Button>
                  )}
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Contract
                  </Button>
                  <Button asChild>
                    <Link href={`/sourcing-contracts/contracts/${contract.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Contract
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
      {contracts.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No contracts found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}

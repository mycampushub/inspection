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
  ExternalLink,
  FileText,
  Mail,
  MoreHorizontal,
  Paperclip,
  Phone,
  RefreshCw,
  Send,
  Trash2,
  Upload,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Extended contract data with more details
const contracts = [
  {
    id: "CON-2023-001",
    title: "IT Support Services",
    supplier: "Tech Solutions Inc.",
    supplierId: "SUP-001",
    type: "Service Agreement",
    status: "Active",
    startDate: "2023-01-15",
    endDate: "2024-01-14",
    value: 250000,
    department: "IT",
    daysToExpiry: 30,
    description: "Comprehensive IT support services including helpdesk, network management, and security monitoring. This agreement covers 24/7 support for all IT infrastructure and end-user devices.",
    contactName: "John Smith",
    contactEmail: "john.smith@techsolutions.com",
    contactPhone: "+1 (555) 123-4567",
    paymentTerms: "Net 30",
    renewalTerms: "Auto-renewal for 1 year unless terminated with 60 days notice",
    documents: [
      { id: "1", name: "Master_Service_Agreement.pdf", type: "pdf", size: "2.4 MB", uploadedDate: "2023-01-10" },
      { id: "2", name: "Service_Level_Agreement.pdf", type: "pdf", size: "1.8 MB", uploadedDate: "2023-01-10" },
      { id: "3", name: "Pricing_Schedule.xlsx", type: "xlsx", size: "540 KB", uploadedDate: "2023-01-10" },
    ],
    amendments: [
      { id: "1", title: "Amendment 1 - Scope Expansion", date: "2023-06-15", description: "Added cybersecurity monitoring services", value: 35000 },
      { id: "2", title: "Amendment 2 - Rate Adjustment", date: "2023-09-01", description: "Annual rate increase per contract terms", value: 12500 },
    ],
    milestones: [
      { id: "1", title: "Contract Execution", date: "2023-01-15", status: "completed" },
      { id: "2", title: "Initial Assessment", date: "2023-02-01", status: "completed" },
      { id: "3", title: "Full Service Deployment", date: "2023-03-01", status: "completed" },
      { id: "4", title: "Q3 Review", date: "2023-10-01", status: "completed" },
      { id: "5", title: "Annual Review", date: "2024-01-01", status: "pending" },
    ],
    invoices: [
      { id: "1", number: "INV-2023-0156", date: "2023-11-01", amount: 20833, status: "Paid" },
      { id: "2", number: "INV-2023-0127", date: "2023-10-01", amount: 20833, status: "Paid" },
      { id: "3", number: "INV-2023-0098", date: "2023-09-01", amount: 18750, status: "Paid" },
    ],
    notes: [
      { id: "1", user: "Jennifer Lee", date: "2023-11-20", text: "Discussed renewal options with supplier. They are willing to offer 5% discount for 2-year renewal." },
      { id: "2", user: "John Doe", date: "2023-10-15", text: "Q3 performance review completed. Supplier exceeded SLA targets." },
    ],
  },
  {
    id: "CON-2023-008",
    title: "Office Supplies",
    supplier: "Office Depot",
    supplierId: "SUP-002",
    type: "Purchase Agreement",
    status: "Active",
    startDate: "2023-03-01",
    endDate: "2024-02-28",
    value: 75000,
    department: "Administration",
    daysToExpiry: 75,
    description: "Annual agreement for office supplies including paper, toner, and general stationery items. Includes volume-based discounts and free next-day delivery for orders over $100.",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@officedepot.com",
    contactPhone: "+1 (555) 234-5678",
    paymentTerms: "Net 45",
    renewalTerms: "Requires renewal negotiation 30 days before expiry",
    documents: [
      { id: "1", name: "Purchase_Agreement.pdf", type: "pdf", size: "1.7 MB", uploadedDate: "2023-02-25" },
      { id: "2", name: "Product_Catalog.pdf", type: "pdf", size: "4.2 MB", uploadedDate: "2023-02-25" },
      { id: "3", name: "Pricing_Sheet.xlsx", type: "xlsx", size: "680 KB", uploadedDate: "2023-02-25" },
    ],
    amendments: [],
    milestones: [
      { id: "1", title: "Contract Execution", date: "2023-03-01", status: "completed" },
      { id: "2", title: "Account Setup", date: "2023-03-05", status: "completed" },
      { id: "3", title: "Mid-year Review", date: "2023-09-01", status: "completed" },
      { id: "4", title: "Annual Review", date: "2024-02-01", status: "pending" },
    ],
    invoices: [
      { id: "1", number: "INV-OD-45789", date: "2023-11-15", amount: 3250, status: "Paid" },
      { id: "2", number: "INV-OD-44523", date: "2023-10-15", amount: 4100, status: "Paid" },
      { id: "3", number: "INV-OD-43267", date: "2023-09-15", amount: 2890, status: "Paid" },
    ],
    notes: [],
  },
]

export default function ContractDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [newNote, setNewNote] = useState("")
  const [showRenewDialog, setShowRenewDialog] = useState(false)
  const [showTerminateDialog, setShowTerminateDialog] = useState(false)

  const contract = contracts.find((c) => c.id === id)

  if (!contract) {
    return (
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/sourcing-contracts/contracts">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex items-center text-lg font-semibold">Contract Not Found</div>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Contract Not Found</h2>
            <p className="text-muted-foreground mb-4">The contract you are looking for does not exist.</p>
            <Button asChild>
              <Link href="/sourcing-contracts/contracts">Back to Contracts</Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real app, this would make an API call
      setNewNote("")
    }
  }

  const contractProgress = contract.daysToExpiry ? Math.max(0, 100 - (contract.daysToExpiry / 365) * 100) : 0

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/sourcing-contracts/contracts">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{contract.id}</span>
          <Badge
            variant={
              contract.status === "Active"
                ? "success"
                : contract.status === "Pending Approval"
                  ? "warning"
                  : contract.status === "Expired"
                    ? "destructive"
                    : "outline"
            }
          >
            {contract.status}
          </Badge>
          {contract.daysToExpiry !== null && contract.daysToExpiry <= 60 && (
            <Badge variant={contract.daysToExpiry <= 30 ? "destructive" : "warning"}>
              {contract.daysToExpiry} days left
            </Badge>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Renew
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Renew Contract</DialogTitle>
                <DialogDescription>
                  Initiate the renewal process for this contract. This will create a new version for negotiation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Contract Value</Label>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(contract.value)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewal-term">Renewal Term</Label>
                  <Input id="renewal-term" defaultValue="12 months" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewal-notes">Notes</Label>
                  <Textarea id="renewal-notes" placeholder="Add any notes for the renewal..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowRenewDialog(false)}>Start Renewal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                Download Contract
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Create Amendment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowTerminateDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Terminate Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate this contract? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="termination-reason">Reason for Termination</Label>
              <Textarea id="termination-reason" placeholder="Enter the reason for termination..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effective-date">Effective Date</Label>
              <Input id="effective-date" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTerminateDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowTerminateDialog(false)}>
              Terminate Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{contract.title}</CardTitle>
                <CardDescription>
                  {contract.type} with {contract.supplier}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{contract.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Contract Progress</span>
                      <span className="text-sm font-medium">{Math.round(contractProgress)}%</span>
                    </div>
                    <Progress value={contractProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="documents">
              <TabsList>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="amendments">Amendments</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Contract Documents</CardTitle>
                        <CardDescription>{contract.documents.length} documents</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {contract.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Paperclip className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.size} - Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}
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

              <TabsContent value="amendments" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Contract Amendments</CardTitle>
                        <CardDescription>{contract.amendments.length} amendments</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        New Amendment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {contract.amendments.length > 0 ? (
                      <div className="space-y-4">
                        {contract.amendments.map((amendment) => (
                          <div key={amendment.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{amendment.title}</h4>
                              <span className="text-sm text-muted-foreground">
                                {new Date(amendment.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{amendment.description}</p>
                            <p className="text-sm font-medium">
                              Value Impact:{" "}
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                                amendment.value
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No amendments yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contract Milestones</CardTitle>
                    <CardDescription>Key dates and deliverables</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contract.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                milestone.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {milestone.status === "completed" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            {index < contract.milestones.length - 1 && (
                              <div className="w-px h-full bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{milestone.title}</p>
                              <Badge variant={milestone.status === "completed" ? "success" : "outline"}>
                                {milestone.status === "completed" ? "Completed" : "Pending"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(milestone.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Invoice History</CardTitle>
                    <CardDescription>Recent invoices for this contract</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {contract.invoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{invoice.number}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(invoice.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                                invoice.amount
                              )}
                            </span>
                            <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes & Comments</CardTitle>
                    <CardDescription>Internal notes about this contract</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contract.notes.length > 0 ? (
                        contract.notes.map((note) => (
                          <div key={note.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {note.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{note.user}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(note.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{note.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No notes yet</p>
                        </div>
                      )}
                      <Separator />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <Button size="icon" onClick={handleAddNote}>
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
                <CardTitle className="text-base">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
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
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contract Value</span>
                  <span className="text-sm font-semibold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(contract.value)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm">{contract.type}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm">{contract.department}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm">{new Date(contract.startDate).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="text-sm">{new Date(contract.endDate).toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Terms</span>
                  <span className="text-sm">{contract.paymentTerms}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supplier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Link
                    href={`/supplier-management/directory/${contract.supplierId}`}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {contract.supplier}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${contract.contactEmail}`} className="hover:underline">
                    {contract.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${contract.contactPhone}`} className="hover:underline">
                    {contract.contactPhone}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Renewal Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{contract.renewalTerms}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Supplier
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

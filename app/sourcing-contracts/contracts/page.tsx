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
  Eye,
  FileCheck,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for contracts
const contracts = [
  {
    id: "CON-2023-001",
    title: "IT Support Services",
    supplier: "Tech Solutions Inc.",
    type: "Service Agreement",
    status: "Active",
    startDate: "2023-01-15",
    endDate: "2024-01-14",
    value: 250000,
    department: "IT",
    daysToExpiry: 30,
    description: "Comprehensive IT support services including helpdesk, network management, and security monitoring.",
    contactName: "John Smith",
    contactEmail: "john.smith@techsolutions.com",
    contactPhone: "+1 (555) 123-4567",
    paymentTerms: "Net 30",
    renewalTerms: "Auto-renewal for 1 year unless terminated with 60 days notice",
    documents: [
      { name: "Master_Service_Agreement.pdf", type: "pdf", size: "2.4 MB" },
      { name: "Service_Level_Agreement.pdf", type: "pdf", size: "1.8 MB" },
      { name: "Pricing_Schedule.xlsx", type: "xlsx", size: "540 KB" },
    ],
  },
  {
    id: "CON-2023-008",
    title: "Office Supplies",
    supplier: "Office Depot",
    type: "Purchase Agreement",
    status: "Active",
    startDate: "2023-03-01",
    endDate: "2024-02-28",
    value: 75000,
    department: "Administration",
    daysToExpiry: 75,
    description: "Annual agreement for office supplies including paper, toner, and general stationery items.",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@officedepot.com",
    contactPhone: "+1 (555) 234-5678",
    paymentTerms: "Net 45",
    renewalTerms: "Requires renewal negotiation 30 days before expiry",
    documents: [
      { name: "Purchase_Agreement.pdf", type: "pdf", size: "1.7 MB" },
      { name: "Product_Catalog.pdf", type: "pdf", size: "4.2 MB" },
      { name: "Pricing_Sheet.xlsx", type: "xlsx", size: "680 KB" },
    ],
  },
  {
    id: "CON-2023-015",
    title: "Logistics Services",
    supplier: "Global Logistics",
    type: "Master Service Agreement",
    status: "Active",
    startDate: "2023-06-01",
    endDate: "2025-05-31",
    value: 180000,
    department: "Operations",
    daysToExpiry: 540,
    description: "Comprehensive logistics services including warehousing, distribution, and transportation management.",
    contactName: "Michael Chen",
    contactEmail: "m.chen@globallogistics.com",
    contactPhone: "+1 (555) 345-6789",
    paymentTerms: "Net 30",
    renewalTerms: "Auto-renewal for 2 years unless terminated with 90 days notice",
    documents: [
      { name: "Master_Service_Agreement.pdf", type: "pdf", size: "3.1 MB" },
      { name: "Service_Schedule.pdf", type: "pdf", size: "1.5 MB" },
      { name: "Rate_Card.xlsx", type: "xlsx", size: "720 KB" },
    ],
  },
  {
    id: "CON-2023-023",
    title: "Digital Marketing",
    supplier: "Marketing Experts",
    type: "Statement of Work",
    status: "Pending Approval",
    startDate: "2023-12-01",
    endDate: "2024-11-30",
    value: 120000,
    department: "Marketing",
    daysToExpiry: null,
    description: "Digital marketing services including SEO, content creation, and social media management.",
    contactName: "Jessica Williams",
    contactEmail: "j.williams@marketingexperts.com",
    contactPhone: "+1 (555) 456-7890",
    paymentTerms: "Net 15",
    renewalTerms: "One-time agreement with option to extend",
    documents: [
      { name: "Statement_of_Work.pdf", type: "pdf", size: "1.9 MB" },
      { name: "Marketing_Plan.pdf", type: "pdf", size: "2.8 MB" },
      { name: "Budget_Breakdown.xlsx", type: "xlsx", size: "520 KB" },
    ],
  },
  {
    id: "CON-2022-045",
    title: "Software Licenses",
    supplier: "Software Solutions Inc.",
    type: "License Agreement",
    status: "Active",
    startDate: "2022-12-31",
    endDate: "2023-12-31",
    value: 85000,
    department: "IT",
    daysToExpiry: 16,
    description: "Enterprise software licenses for productivity and collaboration tools.",
    contactName: "Robert Taylor",
    contactEmail: "r.taylor@softwaresolutions.com",
    contactPhone: "+1 (555) 567-8901",
    paymentTerms: "Annual upfront payment",
    renewalTerms: "Auto-renewal unless terminated with 30 days notice",
    documents: [
      { name: "License_Agreement.pdf", type: "pdf", size: "2.2 MB" },
      { name: "License_Schedule.pdf", type: "pdf", size: "1.1 MB" },
      { name: "Support_Terms.pdf", type: "pdf", size: "980 KB" },
    ],
  },
]

export default function ContractRepository() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedContract, setExpandedContract] = useState<string | null>(null)
  const [showNewContractDialog, setShowNewContractDialog] = useState(false)
  const [newContract, setNewContract] = useState({
    title: "",
    supplier: "",
    type: "",
    department: "",
    startDate: "",
    endDate: "",
    value: "",
    description: "",
  })

  const toggleContractExpansion = (id: string) => {
    setExpandedContract(expandedContract === id ? null : id)
  }

  const handleCreateContract = () => {
    // In a real app, this would make an API call
    setShowNewContractDialog(false)
    setNewContract({
      title: "",
      supplier: "",
      type: "",
      department: "",
      startDate: "",
      endDate: "",
      value: "",
      description: "",
    })
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
          <Button size="sm" variant="outline">
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
            <DialogContent className="sm:max-w-[700px]">
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
                    <Select
                      value={newContract.supplier}
                      onValueChange={(value) => setNewContract({ ...newContract, supplier: value })}
                    >
                      <SelectTrigger id="contract-supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech-solutions">Tech Solutions Inc.</SelectItem>
                        <SelectItem value="office-depot">Office Depot</SelectItem>
                        <SelectItem value="global-logistics">Global Logistics</SelectItem>
                        <SelectItem value="marketing-experts">Marketing Experts</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="service">Service Agreement</SelectItem>
                        <SelectItem value="purchase">Purchase Agreement</SelectItem>
                        <SelectItem value="master">Master Service Agreement</SelectItem>
                        <SelectItem value="license">License Agreement</SelectItem>
                        <SelectItem value="sow">Statement of Work</SelectItem>
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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="active" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="expiring-soon">Expiring Soon</TabsTrigger>
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
            <div className="space-y-4 mt-4">
              {filteredContracts.map((contract) => (
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
                                <Link href={`/sourcing-contracts/contracts/${contract.id}`}>View Contract</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Contract</DropdownMenuItem>
                              <DropdownMenuItem>Download PDF</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Renew Contract</DropdownMenuItem>
                              <DropdownMenuItem>Amend Contract</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Terminate Contract</DropdownMenuItem>
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
                                <dd>{contract.paymentTerms}</dd>
                                <dt className="text-muted-foreground">Renewal Terms:</dt>
                                <dd>{contract.renewalTerms}</dd>
                              </dl>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Supplier Contact</h4>
                              <dl className="grid grid-cols-2 gap-1 text-sm">
                                <dt className="text-muted-foreground">Name:</dt>
                                <dd>{contract.contactName}</dd>
                                <dt className="text-muted-foreground">Email:</dt>
                                <dd>
                                  <a href={`mailto:${contract.contactEmail}`} className="text-primary hover:underline">
                                    {contract.contactEmail}
                                  </a>
                                </dd>
                                <dt className="text-muted-foreground">Phone:</dt>
                                <dd>
                                  <a href={`tel:${contract.contactPhone}`} className="text-primary hover:underline">
                                    {contract.contactPhone}
                                  </a>
                                </dd>
                              </dl>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Key Dates</h4>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Start Date</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(contract.startDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">End Date</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(contract.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">Renewal Notification</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(
                                        new Date(contract.endDate).getTime() - 60 * 24 * 60 * 60 * 1000,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Documents</h4>
                            <div className="space-y-2">
                              {contract.documents.map((doc, index) => (
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
                              ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" variant="outline" className="w-full">
                                <FileCheck className="mr-2 h-4 w-4" />
                                View All Documents
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                          {contract.daysToExpiry !== null && contract.daysToExpiry <= 90 && (
                            <Button variant="outline" className="gap-2">
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
              {filteredContracts.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No contracts found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button className="mt-4">Create New Contract</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {/* Same content as "all" tab but filtered for active contracts */}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {/* Same content as "all" tab but filtered for pending contracts */}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {/* Same content as "all" tab but filtered for expired contracts */}
          </TabsContent>

          <TabsContent value="expiring-soon" className="space-y-4">
            {/* Same content as "all" tab but filtered for contracts expiring soon */}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

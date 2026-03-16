"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Download,
  Eye,
  Bell,
} from "lucide-react"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { Progress } from "../components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { SidebarInset, SidebarTrigger } from "../components/ui/sidebar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { localContracts, localRfxEvents } from "../lib/local-data"

// Types from data-store
interface RfxEvent {
  id: string
  title: string
  type: "RFP" | "RFQ" | "RFI" | "RFT"
  description?: string
  category: string
  status: "Draft" | "Active" | "Evaluation" | "Closed" | "Awarded"
  publishedDate?: string
  deadline: string
  budget: number
  createdBy: string
  createdDate: string
  responses?: unknown[]
}

interface Contract {
  id: string
  supplierId: string
  supplierName: string
  title: string
  type: "Statement of Work" | "Services Agreement" | "Master Service" | "Licenses/Subscriptions" | "Lease Agreement" | "Purchase/Blanket" | "Warranty" | "Engagement Letter"
  category: string
  value: number
  currency: string
  startDate: string
  endDate: string
  status: "Active" | "Pending" | "Expired" | "Expiring Soon" | "Terminated"
  renewalOption?: boolean
  jurisdiction: string
  hasLocalSupplier?: boolean
  hasIndemnity?: boolean
  hasRenewalClause?: boolean
  hasTerminationClause?: boolean
  signedByCEO?: boolean
  milestones?: Array<unknown>
  documents?: Array<unknown>
}

export default function SourcingContracts() {
  const router = useNavigate()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // RFx state
  const [rfxEvents] = useState<RfxEvent[]>(localRfxEvents)
  const [rfxTypeFilter, setRfxTypeFilter] = useState("all")
  const [rfxStatusFilter, setRfxStatusFilter] = useState("all")
  
  // Contracts state
  const [contracts, setContracts] = useState<Contract[]>(localContracts)
  const [contractTypeFilter, setContractTypeFilter] = useState("all")
  const [contractStatusFilter, setContractStatusFilter] = useState("all")
  
  // Dashboard stats state
  const [stats, setStats] = useState({
    activeRfx: 0,
    activeContracts: 0,
    expiringContracts: 0,
    totalContractValue: 0,
  })
  
  // Dialog states
  const [viewRfxDialog, setViewRfxDialog] = useState(false)
  const [viewContractDialog, setViewContractDialog] = useState(false)
  const [renewDialog, setRenewDialog] = useState(false)
  const [replaceDialog, setReplaceDialog] = useState(false)
  const [selectedRfx, setSelectedRfx] = useState<RfxEvent | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  
  // Renewal form state
  const [newEndDate, setNewEndDate] = useState("")
  const [newContractValue, setNewContractValue] = useState("")
  const [renewalNotes, setRenewalNotes] = useState("")

  // Fetch RFx events (using local data)
  const fetchRfxEvents = () => {
    setLoading(true)
    setLoading(false)
  }

  // Fetch contracts (using local data)
  const fetchContracts = () => {
    setLoading(true)
    setLoading(false)
  }

  // Fetch dashboard stats (using local data)
  const fetchStats = () => {
    const activeContractsCount = contracts.filter(c => c.status === "Active").length
    const expiringSoonCount = contracts.filter(c => c.status === "Expiring Soon").length
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0)
    
    setStats({
      activeRfx: rfxEvents.filter(r => r.status === "Active").length,
      activeContracts: activeContractsCount,
      expiringContracts: expiringSoonCount,
      totalContractValue: totalValue,
    })
  }

  // Fetch all data (using local data)
  const fetchAllData = () => {
    setLoading(true)
    fetchStats()
    setLoading(false)
  }

  // Initial data load
  // eslint-disable-next-line react-hooks/purity
  useEffect(() => {
    fetchAllData()
  }, [])

  // Refetch when filters or search change (using local data)
  // eslint-disable-next-line react-hooks/purity
  useEffect(() => {
    fetchRfxEvents()
    fetchContracts()
  }, [rfxTypeFilter, rfxStatusFilter, contractTypeFilter, contractStatusFilter, searchQuery, fetchRfxEvents, fetchContracts])

  // Update stats when data changes
  // eslint-disable-next-line react-hooks/purity
  useEffect(() => {
    const activeContractsCount = contracts.filter(c => c.status === "Active").length
    const expiringSoonCount = contracts.filter(c => c.status === "Expiring Soon").length
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0)
    
    setStats({
      activeRfx: rfxEvents.filter(r => r.status === "Active").length,
      activeContracts: activeContractsCount,
      expiringContracts: expiringSoonCount,
      totalContractValue: totalValue,
    })
  }, [rfxEvents, contracts, setStats])

  // Get contracts expiring soon
  const getExpiringContracts = () => {
    return contracts
      .filter(c => c.status === "Active" || c.status === "Expiring Soon")
      .map(c => ({
        ...c,
        daysLeft: Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .filter(c => c.daysLeft <= 90 && c.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  }

  // Calculate RFx progress
  const calculateRfxProgress = (rfx: RfxEvent) => {
    if (rfx.status === "Draft") return 25
    if (rfx.status === "Active") return 50
    if (rfx.status === "Evaluation") return 75
    if (rfx.status === "Closed" || rfx.status === "Awarded") return 100
    return 0
  }

  // Download CSV
  const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) {
      alert("No data to export")
      return
    }
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => {
        const value = row[header]
        return typeof value === "string" ? `"${value}"` : value
      }).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle RFx actions
  const handleRfxViewDetails = (rfx: RfxEvent) => {
    setSelectedRfx(rfx)
    setViewRfxDialog(true)
  }

  const handleRfxEdit = (rfx: RfxEvent) => {
    router.push(`/sourcing-contracts/rfx?id=${rfx.id}`)
  }

  const handleRfxDownloadCSV = () => {
    downloadCSV(rfxEvents, "rfx-events")
  }

  const handleRfxSetAlert = (rfx: RfxEvent) => {
    alert(`Alert set for RFx ${rfx.id}: ${rfx.title}`)
  }

  // Handle Contract actions
  const handleContractViewDetails = (contract: Contract) => {
    setSelectedContract(contract)
    setViewContractDialog(true)
  }

  const handleContractEdit = (contract: Contract) => {
    router.push(`/sourcing-contracts/contracts?id=${contract.id}`)
  }

  const handleContractDownloadCSV = () => {
    downloadCSV(contracts, "contracts")
  }

  const handleContractSetAlert = (contract: Contract) => {
    alert(`Alert set for Contract ${contract.id}: ${contract.title}`)
  }

  const handleContractRenew = (contract: Contract) => {
    setSelectedContract(contract)
    setNewEndDate("")
    setNewContractValue("")
    setRenewalNotes("")
    setRenewDialog(true)
  }

  const handleReplaceContract = (contract: Contract) => {
    setSelectedContract(contract)
    setReplaceDialog(true)
  }

  // Handle renewal form submit (using local data)
  const handleRenewSubmit = () => {
    if (!selectedContract) return
    
    // Update local contract data
    setContracts(contracts.map(c => 
      c.id === selectedContract.id 
        ? {
            ...c,
            endDate: newEndDate || c.endDate,
            value: newContractValue ? parseFloat(newContractValue) : c.value,
            status: "Active" as const,
          }
        : c
    ))
    setRenewDialog(false)
    fetchAllData()
  }

  // Handle replace contract
  const handleReplaceSubmit = () => {
    if (!selectedContract) return
    router.push(`/sourcing-contracts/contracts?replace=${selectedContract.id}`)
    setReplaceDialog(false)
  }

  // Calculate days to expiry
  const getDaysToExpiry = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Sourcing & Contracts</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={fetchAllData}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sourcing">Sourcing/RFx</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="renewals">Renewals</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/sourcing-contracts/rfx">
                  <Plus className="mr-2 h-4 w-4" />
                  New RFx
                </Link>
              </Button>
              <Button asChild>
                <Link href="/sourcing-contracts/contracts">
                  <Plus className="mr-2 h-4 w-4" />
                  New Contract
                </Link>
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sourcing Events</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeRfx}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-amber-500 inline-flex items-center">
                      <Clock className="mr-1 h-3 w-3" />{rfxEvents.filter(r => {
                        const deadline = new Date(r.deadline)
                        const weekFromNow = new Date()
                        weekFromNow.setDate(weekFromNow.getDate() + 7)
                        return r.status === "Active" && deadline <= weekFromNow
                      }).length} closing this week
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {contracts.filter(c => c.status === "Active").length} active contracts
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contracts Expiring Soon</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.expiringContracts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 inline-flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />{getExpiringContracts().filter(c => c.daysLeft <= 30).length} in next 30 days
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 1,
                      notation: "compact",
                    }).format(stats.totalContractValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {contracts.length} total contracts
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sourcing Events</CardTitle>
                  <CardDescription>Latest RFx activities and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rfxEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{event.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{event.type}</Badge>
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
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(event.deadline).toLocaleDateString()} • {event.responses?.length || 0} responses
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(event.budget)}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{calculateRfxProgress(event)}%</span>
                            <Progress value={calculateRfxProgress(event)} className="h-2 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {rfxEvents.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No sourcing events found</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        Download
                        <Download className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleRfxDownloadCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Download CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Contract Renewals</CardTitle>
                  <CardDescription>Contracts expiring in the next 90 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getExpiringContracts().slice(0, 3).map((contract) => (
                      <div
                        key={contract.id}
                        className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{contract.title}</p>
                          <p className="text-xs text-muted-foreground">{contract.supplierName}</p>
                          <p className="text-xs text-muted-foreground">
                            Expires: {new Date(contract.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(contract.value)}
                          </p>
                          <Badge variant={contract.daysLeft <= 30 ? "destructive" : "outline"}>
                            {contract.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {getExpiringContracts().length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No upcoming renewals</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/sourcing-contracts/contracts">
                      View All Contracts
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Sourcing/RFx Tab */}
          <TabsContent value="sourcing" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Sourcing Events</CardTitle>
                <CardDescription>Manage RFx events and evaluate supplier responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  {showFilters && (
                    <div className="flex items-center gap-2">
                      <Select value={rfxTypeFilter} onValueChange={setRfxTypeFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="RFP">RFP</SelectItem>
                          <SelectItem value="RFQ">RFQ</SelectItem>
                          <SelectItem value="RFI">RFI</SelectItem>
                          <SelectItem value="RFT">RFT</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={rfxStatusFilter} onValueChange={setRfxStatusFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Evaluation">Evaluation</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Awarded">Awarded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {rfxEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
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
                                }).format(event.budget)}
                              </span>
                              <span className="text-xs text-muted-foreground">{event.responses?.length || 0} responses</span>
                            </div>
                            <div className="flex flex-col items-end gap-1 min-w-[100px]">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs font-medium">{calculateRfxProgress(event)}%</span>
                              </div>
                              <Progress value={calculateRfxProgress(event)} className="h-2 w-full" />
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRfxViewDetails(event)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRfxEdit(event)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Edit Event
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/sourcing-contracts/rfx?id=${event.id}`)}>
                                  <FileCheck className="mr-2 h-4 w-4" />
                                  View Responses
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleRfxDownloadCSV}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRfxSetAlert(event)}>
                                  <Bell className="mr-2 h-4 w-4" />
                                  Set Alerts
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {rfxEvents.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No sourcing events found</p>
                        <Button asChild className="mt-4">
                          <Link href="/sourcing-contracts/rfx">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New RFx
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Contract Repository</CardTitle>
                <CardDescription>Manage and track all supplier contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contracts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  {showFilters && (
                    <div className="flex items-center gap-2">
                      <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Statement of Work">Statement of Work</SelectItem>
                          <SelectItem value="Services Agreement">Services Agreement</SelectItem>
                          <SelectItem value="Master Service">Master Service</SelectItem>
                          <SelectItem value="Licenses/Subscriptions">Licenses/Subscriptions</SelectItem>
                          <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                          <SelectItem value="Purchase/Blanket">Purchase/Blanket</SelectItem>
                          <SelectItem value="Warranty">Warranty</SelectItem>
                          <SelectItem value="Engagement Letter">Engagement Letter</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={contractStatusFilter} onValueChange={setContractStatusFilter}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                          <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                          <SelectItem value="Terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {contracts.map((contract) => {
                    const daysToExpiry = getDaysToExpiry(contract.endDate)
                    return (
                      <Card key={contract.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
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
                                        : contract.status === "Expiring Soon"
                                          ? "destructive"
                                          : "outline"
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
                              {(contract.status === "Active" || contract.status === "Expiring Soon") && daysToExpiry > 0 && (
                                <Badge
                                  variant={
                                    daysToExpiry <= 30
                                      ? "destructive"
                                      : daysToExpiry <= 90
                                        ? "warning"
                                        : "outline"
                                  }
                                >
                                  {daysToExpiry} days left
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
                                  <DropdownMenuItem onClick={() => handleContractViewDetails(contract)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleContractEdit(contract)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Edit Contract
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={handleContractDownloadCSV}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download CSV
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleContractRenew(contract)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Renew Contract
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleContractSetAlert(contract)}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    Set Alerts
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {contracts.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No contracts found</p>
                        <Button asChild className="mt-4">
                          <Link href="/sourcing-contracts/contracts">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Contract
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Renewals Tab */}
          <TabsContent value="renewals" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Contract Renewals</CardTitle>
                <CardDescription>Manage upcoming contract renewals and expirations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getExpiringContracts().map((contract) => (
                    <Card key={contract.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{contract.title}</h3>
                              <Badge variant="outline">{contract.id}</Badge>
                            </div>
                            <p className="text-sm">{contract.supplierName}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(contract.endDate).toLocaleDateString()}
                            </p>
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
                            </div>
                            <Badge variant={contract.daysLeft <= 30 ? "destructive" : "outline"}>
                              {contract.daysLeft} days left
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleContractRenew(contract)}>
                                Renew
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReplaceContract(contract)}>
                                Replace
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getExpiringContracts().length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No contracts pending renewal</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View RFx Dialog */}
      <Dialog open={viewRfxDialog} onOpenChange={setViewRfxDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>RFx Event Details</DialogTitle>
            <DialogDescription>
              {selectedRfx?.id} - {selectedRfx?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedRfx && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(selectedRfx.budget)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created Date</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedRfx.createdDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Deadline</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedRfx.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created By</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.createdBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Responses</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.responses?.length || 0}</p>
                </div>
              </div>
              {selectedRfx.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedRfx.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRfxDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedRfx) {
                setViewRfxDialog(false)
                handleRfxEdit(selectedRfx)
              }
            }}>
              Edit RFx
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contract Dialog */}
      <Dialog open={viewContractDialog} onOpenChange={setViewContractDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              {selectedContract?.id} - {selectedContract?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Supplier</Label>
                  <p className="text-sm text-muted-foreground">{selectedContract.supplierName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedContract.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedContract.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground">{selectedContract.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Value</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: selectedContract.currency,
                      maximumFractionDigits: 0,
                    }).format(selectedContract.value)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Jurisdiction</Label>
                  <p className="text-sm text-muted-foreground">{selectedContract.jurisdiction}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Contract Options</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedContract.renewalOption && <Badge>Renewal Option</Badge>}
                  {selectedContract.hasLocalSupplier && <Badge>Local Supplier</Badge>}
                  {selectedContract.hasIndemnity && <Badge>Indemnity</Badge>}
                  {selectedContract.hasRenewalClause && <Badge>Renewal Clause</Badge>}
                  {selectedContract.hasTerminationClause && <Badge>Termination Clause</Badge>}
                  {selectedContract.signedByCEO && <Badge>Signed by CEO</Badge>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewContractDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedContract) {
                setViewContractDialog(false)
                handleContractEdit(selectedContract)
              }
            }}>
              Edit Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Contract Dialog */}
      <Dialog open={renewDialog} onOpenChange={setRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
            <DialogDescription>
              {selectedContract?.id} - {selectedContract?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newEndDate">New End Date *</Label>
              <Input
                id="newEndDate"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="newContractValue">New Contract Value (Optional)</Label>
              <Input
                id="newContractValue"
                type="number"
                placeholder={selectedContract?.value.toString()}
                value={newContractValue}
                onChange={(e) => setNewContractValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="renewalNotes">Renewal Notes</Label>
              <Input
                id="renewalNotes"
                placeholder="Add any notes for this renewal..."
                value={renewalNotes}
                onChange={(e) => setRenewalNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenewSubmit} disabled={!newEndDate}>
              Renew Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace Contract Dialog */}
      <Dialog open={replaceDialog} onOpenChange={setReplaceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Contract</DialogTitle>
            <DialogDescription>
              {selectedContract?.id} - {selectedContract?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will navigate you to the contracts page where you can create a new contract to replace this one.
              The existing contract will be marked for replacement.
            </p>
            <div>
              <Label className="text-sm font-medium">Current Contract Details</Label>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Supplier:</span> {selectedContract?.supplierName}</p>
                <p><span className="font-medium">Value:</span> {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: selectedContract?.currency || "USD",
                  maximumFractionDigits: 0,
                }).format(selectedContract?.value || 0)}</p>
                <p><span className="font-medium">End Date:</span> {selectedContract?.endDate ? new Date(selectedContract.endDate).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplaceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReplaceSubmit}>
              Continue to Create New Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

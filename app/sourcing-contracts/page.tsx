"use client"

import { useState } from "react"
import Link from "next/link"
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
  SlidersHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for sourcing events
const sourcingEvents = [
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
  },
]

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
  },
]

// Sample data for upcoming renewals
const upcomingRenewals = [
  {
    id: "CON-2022-045",
    title: "Software Licenses",
    supplier: "Software Solutions Inc.",
    endDate: "2023-12-31",
    value: 85000,
    daysLeft: 16,
  },
  {
    id: "CON-2022-052",
    title: "Cleaning Services",
    supplier: "CleanPro Services",
    endDate: "2024-01-15",
    value: 48000,
    daysLeft: 31,
  },
  {
    id: "CON-2023-001",
    title: "IT Support Services",
    supplier: "Tech Solutions Inc.",
    endDate: "2024-01-14",
    value: 250000,
    daysLeft: 30,
  },
]

export default function SourcingContracts() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Sourcing & Contracts</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
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
              <TabsTrigger value="sourcing">Sourcing Events</TabsTrigger>
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

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sourcing Events</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-amber-500 inline-flex items-center">
                      <Clock className="mr-1 h-3 w-3" />4 closing this week
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
                  <div className="text-2xl font-bold">165</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      12 new this month
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
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 inline-flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />3 in next 30 days
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
                  <div className="text-2xl font-bold">$24.5M</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      $2.1M new this month
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
                    {sourcingEvents.slice(0, 3).map((event) => (
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
                                    : event.status === "Closed"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(event.dueDate).toLocaleDateString()} • {event.responses} responses
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-sm font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(event.estimatedValue)}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{event.progress}%</span>
                            <Progress value={event.progress} className="h-2 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/sourcing-contracts/rfx">
                      View All Sourcing Events
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Contract Renewals</CardTitle>
                  <CardDescription>Contracts expiring in the next 60 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingRenewals.map((contract) => (
                      <div
                        key={contract.id}
                        className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{contract.title}</p>
                          <p className="text-xs text-muted-foreground">{contract.supplier}</p>
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
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="rfp">RFP</SelectItem>
                        <SelectItem value="rfq">RFQ</SelectItem>
                        <SelectItem value="rfi">RFI</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="evaluation">Evaluation</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Advanced
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {sourcingEvents.map((event) => (
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                <DropdownMenuItem>View Responses</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Close Event</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="service">Service Agreement</SelectItem>
                        <SelectItem value="purchase">Purchase Agreement</SelectItem>
                        <SelectItem value="master">Master Service Agreement</SelectItem>
                        <SelectItem value="statement">Statement of Work</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Advanced
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <Card key={contract.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Contract</DropdownMenuItem>
                                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                <DropdownMenuItem>Renew Contract</DropdownMenuItem>
                                <DropdownMenuItem>Terminate Contract</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="renewals" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Contract Renewals</CardTitle>
                <CardDescription>Manage upcoming contract renewals and expirations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingRenewals.map((contract) => (
                    <Card key={contract.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{contract.title}</h3>
                              <Badge variant="outline">{contract.id}</Badge>
                            </div>
                            <p className="text-sm">{contract.supplier}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(contract.endDate).toLocaleDateString()}
                            </p>
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
                            </div>
                            <Badge variant={contract.daysLeft <= 30 ? "destructive" : "outline"}>
                              {contract.daysLeft} days left
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm">Renew</Button>
                              <Button size="sm" variant="outline">
                                Replace
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

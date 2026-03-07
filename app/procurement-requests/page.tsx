"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for procurement requests
const procurementRequests = [
  {
    id: "PR-2023-001",
    title: "Office Furniture for New Location",
    requester: "Sarah Johnson",
    department: "Facilities",
    date: "2023-11-15",
    status: "Approved",
    priority: "Medium",
    amount: 12500,
  },
  {
    id: "PR-2023-002",
    title: "IT Equipment Refresh",
    requester: "Michael Chen",
    department: "IT",
    date: "2023-11-18",
    status: "Pending Approval",
    priority: "High",
    amount: 45000,
  },
  {
    id: "PR-2023-003",
    title: "Marketing Materials for Q1 Campaign",
    requester: "Jessica Williams",
    department: "Marketing",
    date: "2023-11-20",
    status: "Draft",
    priority: "Low",
    amount: 8750,
  },
  {
    id: "PR-2023-004",
    title: "Consulting Services for ERP Implementation",
    requester: "Robert Taylor",
    department: "Finance",
    date: "2023-11-22",
    status: "Pending Approval",
    priority: "High",
    amount: 75000,
  },
  {
    id: "PR-2023-005",
    title: "Office Supplies Quarterly Order",
    requester: "Amanda Rodriguez",
    department: "Administration",
    date: "2023-11-25",
    status: "Approved",
    priority: "Medium",
    amount: 3200,
  },
  {
    id: "PR-2023-006",
    title: "Training Materials for New Hires",
    requester: "David Wilson",
    department: "HR",
    date: "2023-11-28",
    status: "Rejected",
    priority: "Low",
    amount: 5500,
  },
  {
    id: "PR-2023-007",
    title: "Software Licenses Renewal",
    requester: "Jennifer Lee",
    department: "IT",
    date: "2023-11-30",
    status: "Approved",
    priority: "High",
    amount: 28000,
  },
]

export default function ProcurementRequests() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  // Filter requests based on search, status, and priority
  const filteredRequests = procurementRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Filter requests based on tab
  const tabFilteredRequests =
    selectedTab === "all"
      ? filteredRequests
      : filteredRequests.filter((request) => {
          if (selectedTab === "pending") return request.status === "Pending Approval"
          if (selectedTab === "approved") return request.status === "Approved"
          if (selectedTab === "rejected") return request.status === "Rejected"
          if (selectedTab === "draft") return request.status === "Draft"
          return true
        })

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">Procurement Requests</div>
        <div className="ml-auto flex items-center gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Procurement Requests</CardTitle>
                <CardDescription>View and manage all procurement requests across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Advanced
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabFilteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(request.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Request</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                <DropdownMenuItem>Reject</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {tabFilteredRequests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="h-24 text-center">
                            No requests found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            {/* Same content as "all" tab but filtered for pending requests */}
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            {/* Same content as "all" tab but filtered for approved requests */}
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            {/* Same content as "all" tab but filtered for rejected requests */}
          </TabsContent>
          <TabsContent value="draft" className="space-y-4">
            {/* Same content as "all" tab but filtered for draft requests */}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

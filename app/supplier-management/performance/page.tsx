"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Star,
  ThumbsUp,
  Truck,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for suppliers
const suppliers = [
  {
    id: "SUP-001",
    name: "Tech Solutions Inc.",
    logo: "/abstract-geometric-ts.png",
    category: "IT Services",
    status: "Approved",
    tier: "Strategic",
    location: "New York, USA",
    contactName: "John Smith",
    contactEmail: "john.smith@techsolutions.com",
    contactPhone: "+1 (555) 123-4567",
    performanceScore: 92,
    riskLevel: "Low",
    activeContracts: 3,
    totalSpend: 1250000,
    onTimeDelivery: 98,
    qualityScore: 95,
    responseTime: 24,
    certifications: ["ISO 9001", "ISO 27001", "SOC 2"],
    performanceHistory: [
      { period: "Q1 2023", score: 91, onTimeDelivery: 97, quality: 94, responseTime: 26 },
      { period: "Q2 2023", score: 89, onTimeDelivery: 95, quality: 92, responseTime: 28 },
      { period: "Q3 2023", score: 90, onTimeDelivery: 96, quality: 93, responseTime: 25 },
      { period: "Q4 2023", score: 92, onTimeDelivery: 98, quality: 95, responseTime: 24 },
    ],
    performanceIssues: [
      {
        id: "ISS-001",
        date: "2023-08-15",
        type: "Delivery Delay",
        description: "One-day delay in server equipment delivery",
        status: "Resolved",
        resolution: "Supplier provided expedited shipping for subsequent orders",
      },
    ],
  },
  {
    id: "SUP-002",
    name: "Office Depot",
    logo: "/stylized-letters-OD.png",
    category: "Office Supplies",
    status: "Approved",
    tier: "Preferred",
    location: "Chicago, USA",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@officedepot.com",
    contactPhone: "+1 (555) 234-5678",
    performanceScore: 88,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 75000,
    onTimeDelivery: 92,
    qualityScore: 90,
    responseTime: 48,
    certifications: ["ISO 9001", "Green Business Certified"],
    performanceHistory: [
      { period: "Q1 2023", score: 87, onTimeDelivery: 91, quality: 89, responseTime: 50 },
      { period: "Q2 2023", score: 86, onTimeDelivery: 90, quality: 88, responseTime: 52 },
      { period: "Q3 2023", score: 89, onTimeDelivery: 93, quality: 91, responseTime: 46 },
      { period: "Q4 2023", score: 88, onTimeDelivery: 92, quality: 90, responseTime: 48 },
    ],
    performanceIssues: [
      {
        id: "ISS-002",
        date: "2023-09-10",
        type: "Quality Issue",
        description: "Received damaged office chairs in shipment",
        status: "Resolved",
        resolution: "Supplier replaced damaged items and provided 10% discount",
      },
    ],
  },
  {
    id: "SUP-003",
    name: "Global Logistics Partners",
    logo: "/glowing-landscape.png",
    category: "Logistics",
    status: "Approved",
    tier: "Strategic",
    location: "Singapore",
    contactName: "Michael Chen",
    contactEmail: "m.chen@globallogistics.com",
    contactPhone: "+65 9876 5432",
    performanceScore: 85,
    riskLevel: "Medium",
    activeContracts: 2,
    totalSpend: 950000,
    onTimeDelivery: 87,
    qualityScore: 88,
    responseTime: 36,
    certifications: ["ISO 9001", "C-TPAT", "IATA"],
    performanceHistory: [
      { period: "Q1 2023", score: 83, onTimeDelivery: 85, quality: 86, responseTime: 40 },
      { period: "Q2 2023", score: 84, onTimeDelivery: 86, quality: 87, responseTime: 38 },
      { period: "Q3 2023", score: 86, onTimeDelivery: 88, quality: 89, responseTime: 34 },
      { period: "Q4 2023", score: 85, onTimeDelivery: 87, quality: 88, responseTime: 36 },
    ],
    performanceIssues: [
      {
        id: "ISS-003",
        date: "2023-10-05",
        type: "Communication Issue",
        description: "Delayed response to urgent shipment inquiry",
        status: "Resolved",
        resolution: "Supplier assigned dedicated account manager for urgent matters",
      },
      {
        id: "ISS-004",
        date: "2023-11-20",
        type: "Delivery Delay",
        description: "Three-day delay in international shipment",
        status: "Resolved",
        resolution: "Supplier provided partial refund for shipping costs",
      },
    ],
  },
  {
    id: "SUP-004",
    name: "Marketing Experts Ltd.",
    logo: "/abstract-self-representation.png",
    category: "Marketing Services",
    status: "Approved",
    tier: "Preferred",
    location: "London, UK",
    contactName: "Jessica Williams",
    contactEmail: "j.williams@marketingexperts.com",
    contactPhone: "+44 20 1234 5678",
    performanceScore: 90,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 520000,
    onTimeDelivery: 95,
    qualityScore: 92,
    responseTime: 24,
    certifications: ["ISO 9001"],
    performanceHistory: [
      { period: "Q1 2023", score: 88, onTimeDelivery: 93, quality: 90, responseTime: 28 },
      { period: "Q2 2023", score: 89, onTimeDelivery: 94, quality: 91, responseTime: 26 },
      { period: "Q3 2023", score: 91, onTimeDelivery: 96, quality: 93, responseTime: 22 },
      { period: "Q4 2023", score: 90, onTimeDelivery: 95, quality: 92, responseTime: 24 },
    ],
    performanceIssues: [],
  },
  {
    id: "SUP-005",
    name: "Manufacturing Solutions Co.",
    logo: "/abstract-ms-artwork.png",
    category: "Manufacturing",
    status: "Under Review",
    tier: "Tactical",
    location: "Detroit, USA",
    contactName: "Robert Taylor",
    contactEmail: "r.taylor@manufacturingsolutions.com",
    contactPhone: "+1 (555) 345-6789",
    performanceScore: 78,
    riskLevel: "Medium",
    activeContracts: 1,
    totalSpend: 650000,
    onTimeDelivery: 82,
    qualityScore: 85,
    responseTime: 48,
    certifications: ["ISO 9001", "ISO 14001"],
    performanceHistory: [
      { period: "Q1 2023", score: 75, onTimeDelivery: 79, quality: 82, responseTime: 52 },
      { period: "Q2 2023", score: 76, onTimeDelivery: 80, quality: 83, responseTime: 50 },
      { period: "Q3 2023", score: 79, onTimeDelivery: 83, quality: 86, responseTime: 46 },
      { period: "Q4 2023", score: 78, onTimeDelivery: 82, quality: 85, responseTime: 48 },
    ],
    performanceIssues: [
      {
        id: "ISS-005",
        date: "2023-07-12",
        type: "Quality Issue",
        description: "Components failed quality testing at higher than acceptable rate",
        status: "In Progress",
        resolution: "Supplier implementing improved quality control measures",
      },
      {
        id: "ISS-006",
        date: "2023-09-25",
        type: "Delivery Delay",
        description: "Recurring delays in weekly component deliveries",
        status: "In Progress",
        resolution: "Working with supplier on improved production scheduling",
      },
    ],
  },
  {
    id: "SUP-006",
    name: "Professional Services Group",
    logo: "/playstation-controller.png",
    category: "Consulting",
    status: "Approved",
    tier: "Strategic",
    location: "Boston, USA",
    contactName: "Amanda Rodriguez",
    contactEmail: "a.rodriguez@psgroup.com",
    contactPhone: "+1 (555) 456-7890",
    performanceScore: 94,
    riskLevel: "Low",
    activeContracts: 2,
    totalSpend: 780000,
    onTimeDelivery: 97,
    qualityScore: 96,
    responseTime: 12,
    certifications: ["ISO 9001", "ISO 27001"],
    performanceHistory: [
      { period: "Q1 2023", score: 93, onTimeDelivery: 96, quality: 95, responseTime: 14 },
      { period: "Q2 2023", score: 94, onTimeDelivery: 97, quality: 96, responseTime: 13 },
      { period: "Q3 2023", score: 94, onTimeDelivery: 97, quality: 96, responseTime: 12 },
      { period: "Q4 2023", score: 94, onTimeDelivery: 97, quality: 96, responseTime: 12 },
    ],
    performanceIssues: [],
  },
]

export default function SupplierPerformance() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("quarter")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPerformance, setSelectedPerformance] = useState("all")

  const toggleSupplierExpansion = (id: string) => {
    setExpandedSupplier(expandedSupplier === id ? null : id)
  }

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || supplier.category.toLowerCase() === selectedCategory
    const matchesPerformance =
      selectedPerformance === "all" ||
      (selectedPerformance === "excellent" && supplier.performanceScore >= 90) ||
      (selectedPerformance === "good" && supplier.performanceScore >= 80 && supplier.performanceScore < 90) ||
      (selectedPerformance === "average" && supplier.performanceScore >= 70 && supplier.performanceScore < 80) ||
      (selectedPerformance === "poor" && supplier.performanceScore < 70)

    return matchesSearch && matchesCategory && matchesPerformance
  })

  return (
    <>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/supplier-management">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center text-lg font-semibold">Supplier Performance</div>
        <div className="ml-auto flex items-center gap-4">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        </div>
      </div>
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="it services">IT Services</SelectItem>
                <SelectItem value="office supplies">Office Supplies</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="marketing services">Marketing Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Performance level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="excellent">Excellent (90%+)</SelectItem>
                <SelectItem value="good">Good (80-89%)</SelectItem>
                <SelectItem value="average">Average (70-79%)</SelectItem>
                <SelectItem value="poor">Poor (Below 70%)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredSuppliers.reduce((acc, supplier) => acc + supplier.performanceScore, 0) /
                    filteredSuppliers.length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  +2% from last quarter
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredSuppliers.reduce((acc, supplier) => acc + supplier.onTimeDelivery, 0) /
                    filteredSuppliers.length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  +1% from last quarter
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredSuppliers.reduce((acc, supplier) => acc + supplier.qualityScore, 0) /
                    filteredSuppliers.length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  +3% from last quarter
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredSuppliers.reduce((acc, supplier) => acc + supplier.responseTime, 0) /
                    filteredSuppliers.length,
                )}
                h
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <Check className="mr-1 h-3 w-3" />
                  -2h from last quarter
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="issues">Performance Issues</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <div className="space-y-4">
              {filteredSuppliers.map((supplier) => (
                <Collapsible
                  key={supplier.id}
                  open={expandedSupplier === supplier.id}
                  onOpenChange={() => toggleSupplierExpansion(supplier.id)}
                >
                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={supplier.logo || "/placeholder.svg"} alt={supplier.name} />
                            <AvatarFallback>{supplier.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                                  <ChevronDown className="h-4 w-4" />
                                  <span className="sr-only">Toggle</span>
                                </Button>
                              </CollapsibleTrigger>
                              <h3 className="font-semibold">{supplier.name}</h3>
                              <Badge variant="outline">{supplier.id}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge
                                variant={
                                  supplier.status === "Approved"
                                    ? "success"
                                    : supplier.status === "Under Review"
                                      ? "warning"
                                      : "outline"
                                }
                              >
                                {supplier.status}
                              </Badge>
                              <span>•</span>
                              <span>{supplier.category}</span>
                              <span>•</span>
                              <span>{supplier.tier} Tier</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">Overall Score</span>
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                supplier.performanceScore >= 90
                                  ? "bg-green-100 text-green-700"
                                  : supplier.performanceScore >= 80
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              <span className="text-sm font-medium">{supplier.performanceScore}%</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">Trend</span>
                            <div className="flex items-center gap-1">
                              {supplier.performanceHistory[3].score > supplier.performanceHistory[0].score ? (
                                <ThumbsUp className="h-4 w-4 text-green-500" />
                              ) : supplier.performanceHistory[3].score < supplier.performanceHistory[0].score ? (
                                <ThumbsUp className="h-4 w-4 text-red-500 rotate-180" />
                              ) : (
                                <Clock className="h-4 w-4 text-amber-500" />
                              )}
                              <span
                                className={
                                  supplier.performanceHistory[3].score > supplier.performanceHistory[0].score
                                    ? "text-green-500 text-sm"
                                    : supplier.performanceHistory[3].score < supplier.performanceHistory[0].score
                                      ? "text-red-500 text-sm"
                                      : "text-amber-500 text-sm"
                                }
                              >
                                {supplier.performanceHistory[3].score > supplier.performanceHistory[0].score
                                  ? "Improving"
                                  : supplier.performanceHistory[3].score < supplier.performanceHistory[0].score
                                    ? "Declining"
                                    : "Stable"}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Full Performance</DropdownMenuItem>
                              <DropdownMenuItem>Create Evaluation</DropdownMenuItem>
                              <DropdownMenuItem>Export Report</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Supplier Profile</DropdownMenuItem>
                              <DropdownMenuItem>Contact Supplier</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="px-4 pb-4 pt-0 border-t">
                        <div className="grid gap-6 md:grid-cols-3 mt-4">
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">Delivery Performance</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">On-Time Delivery</span>
                                <span
                                  className={`text-sm font-medium ${
                                    supplier.onTimeDelivery >= 90
                                      ? "text-green-600"
                                      : supplier.onTimeDelivery >= 80
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {supplier.onTimeDelivery}%
                                </span>
                              </div>
                              <Progress
                                value={supplier.onTimeDelivery}
                                className={`h-2 ${
                                  supplier.onTimeDelivery >= 90
                                    ? "bg-green-100"
                                    : supplier.onTimeDelivery >= 80
                                      ? "bg-amber-100"
                                      : "bg-red-100"
                                }`}
                              />
                              <div className="flex items-center gap-1">
                                <Truck className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Delivery Performance</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q1 2023:</span>
                                <span>{supplier.performanceHistory[0].onTimeDelivery}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q2 2023:</span>
                                <span>{supplier.performanceHistory[1].onTimeDelivery}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q3 2023:</span>
                                <span>{supplier.performanceHistory[2].onTimeDelivery}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q4 2023:</span>
                                <span>{supplier.performanceHistory[3].onTimeDelivery}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">Quality Performance</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Quality Score</span>
                                <span
                                  className={`text-sm font-medium ${
                                    supplier.qualityScore >= 90
                                      ? "text-green-600"
                                      : supplier.qualityScore >= 80
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {supplier.qualityScore}%
                                </span>
                              </div>
                              <Progress
                                value={supplier.qualityScore}
                                className={`h-2 ${
                                  supplier.qualityScore >= 90
                                    ? "bg-green-100"
                                    : supplier.qualityScore >= 80
                                      ? "bg-amber-100"
                                      : "bg-red-100"
                                }`}
                              />
                              <div className="flex items-center gap-1">
                                <Check className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Product/Service Quality</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q1 2023:</span>
                                <span>{supplier.performanceHistory[0].quality}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q2 2023:</span>
                                <span>{supplier.performanceHistory[1].quality}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q3 2023:</span>
                                <span>{supplier.performanceHistory[2].quality}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q4 2023:</span>
                                <span>{supplier.performanceHistory[3].quality}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">Responsiveness</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Response Time</span>
                                <span
                                  className={`text-sm font-medium ${
                                    supplier.responseTime <= 24
                                      ? "text-green-600"
                                      : supplier.responseTime <= 48
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {supplier.responseTime}h
                                </span>
                              </div>
                              <Progress
                                value={100 - (supplier.responseTime / 72) * 100}
                                className={`h-2 ${
                                  supplier.responseTime <= 24
                                    ? "bg-green-100"
                                    : supplier.responseTime <= 48
                                      ? "bg-amber-100"
                                      : "bg-red-100"
                                }`}
                              />
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Communication Responsiveness</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q1 2023:</span>
                                <span>{supplier.performanceHistory[0].responseTime}h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q2 2023:</span>
                                <span>{supplier.performanceHistory[1].responseTime}h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q3 2023:</span>
                                <span>{supplier.performanceHistory[2].responseTime}h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Q4 2023:</span>
                                <span>{supplier.performanceHistory[3].responseTime}h</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">Certifications</h4>
                            <div className="flex flex-wrap gap-1">
                              {supplier.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Review
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
              {filteredSuppliers.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No suppliers found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Performance Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">Supplier</div>
                    <div className="col-span-2">Issue ID</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {suppliers
                    .flatMap((supplier) =>
                      supplier.performanceIssues.map((issue) => ({
                        ...issue,
                        supplierName: supplier.name,
                        supplierId: supplier.id,
                      })),
                    )
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((issue) => (
                      <div key={issue.id} className="grid grid-cols-12 gap-4 p-3 border-t text-sm">
                        <div className="col-span-2">{issue.supplierName}</div>
                        <div className="col-span-2">{issue.id}</div>
                        <div className="col-span-2">{new Date(issue.date).toLocaleDateString()}</div>
                        <div className="col-span-2">{issue.type}</div>
                        <div className="col-span-2">
                          <Badge
                            variant={
                              issue.status === "Resolved"
                                ? "success"
                                : issue.status === "In Progress"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {issue.status}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  {suppliers.flatMap((supplier) => supplier.performanceIssues).length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">No performance issues found.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  Performance trend charts and analysis will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

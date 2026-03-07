"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Award,
  Building,
  Calendar,
  Check,
  Clock,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Send,
  Shield,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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

// Extended supplier data
const suppliers = [
  {
    id: "SUP-001",
    name: "Tech Solutions Inc.",
    logo: "/abstract-geometric-ts.png",
    category: "IT Services",
    status: "Approved",
    tier: "Strategic",
    location: "New York, USA",
    address: "123 Tech Avenue, Suite 500, New York, NY 10001",
    contactName: "John Smith",
    contactEmail: "john.smith@techsolutions.com",
    contactPhone: "+1 (555) 123-4567",
    website: "www.techsolutions.com",
    performanceScore: 92,
    riskLevel: "Low",
    activeContracts: 3,
    totalSpend: 1250000,
    onTimeDelivery: 98,
    qualityScore: 95,
    responseTime: 24,
    certifications: ["ISO 9001", "ISO 27001", "SOC 2"],
    financialHealth: "Strong",
    paymentTerms: "Net 30",
    establishedDate: "2005-03-15",
    employeeCount: "500-1000",
    annualRevenue: "$50M - $100M",
    description:
      "Tech Solutions Inc. is a leading provider of IT services and solutions, specializing in cloud infrastructure, cybersecurity, and managed services for enterprise clients. With over 15 years of experience, they serve Fortune 500 companies across multiple industries.",
    products: ["Cloud Infrastructure", "Managed IT Services", "Cybersecurity Solutions", "IT Consulting"],
    contracts: [
      { id: "CON-2023-001", title: "IT Support Services", startDate: "2023-01-15", endDate: "2024-01-14", value: 250000, status: "Active" },
      { id: "CON-2022-045", title: "Cloud Migration Project", startDate: "2022-06-01", endDate: "2023-05-31", value: 450000, status: "Active" },
      { id: "CON-2022-078", title: "Cybersecurity Assessment", startDate: "2022-09-15", endDate: "2023-09-14", value: 180000, status: "Active" },
    ],
    performanceHistory: [
      { period: "Q1 2022", score: 88 },
      { period: "Q2 2022", score: 89 },
      { period: "Q3 2022", score: 90 },
      { period: "Q4 2022", score: 91 },
      { period: "Q1 2023", score: 91 },
      { period: "Q2 2023", score: 89 },
      { period: "Q3 2023", score: 90 },
      { period: "Q4 2023", score: 92 },
    ],
    spendHistory: [
      { month: "Jan", spend: 45000 },
      { month: "Feb", spend: 52000 },
      { month: "Mar", spend: 48000 },
      { month: "Apr", spend: 61000 },
      { month: "May", spend: 55000 },
      { month: "Jun", spend: 72000 },
      { month: "Jul", spend: 68000 },
      { month: "Aug", spend: 74000 },
      { month: "Sep", spend: 82000 },
      { month: "Oct", spend: 78000 },
      { month: "Nov", spend: 85000 },
      { month: "Dec", spend: 91000 },
    ],
    documents: [
      { id: "1", name: "Supplier_Certificate.pdf", type: "pdf", size: "1.2 MB", uploadedDate: "2023-01-15" },
      { id: "2", name: "Insurance_Certificate.pdf", type: "pdf", size: "890 KB", uploadedDate: "2023-01-15" },
      { id: "3", name: "Financial_Statement_2022.pdf", type: "pdf", size: "2.4 MB", uploadedDate: "2023-02-20" },
    ],
    notes: [
      { id: "1", user: "Jennifer Lee", date: "2023-11-20", text: "Discussed renewal options. They are open to a multi-year agreement with better pricing." },
      { id: "2", user: "John Doe", date: "2023-10-15", text: "Q3 performance review completed. Excellent service quality and response times." },
    ],
    keyContacts: [
      { name: "John Smith", title: "Account Manager", email: "john.smith@techsolutions.com", phone: "+1 (555) 123-4567" },
      { name: "Sarah Chen", title: "Technical Lead", email: "sarah.chen@techsolutions.com", phone: "+1 (555) 123-4568" },
      { name: "Mike Johnson", title: "Support Director", email: "mike.johnson@techsolutions.com", phone: "+1 (555) 123-4569" },
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
    address: "456 Office Parkway, Chicago, IL 60601",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@officedepot.com",
    contactPhone: "+1 (555) 234-5678",
    website: "www.officedepot.com",
    performanceScore: 88,
    riskLevel: "Low",
    activeContracts: 1,
    totalSpend: 75000,
    onTimeDelivery: 92,
    qualityScore: 90,
    responseTime: 48,
    certifications: ["ISO 9001", "Green Business Certified"],
    financialHealth: "Strong",
    paymentTerms: "Net 45",
    establishedDate: "1986-10-25",
    employeeCount: "10,000+",
    annualRevenue: "$10B+",
    description:
      "Office Depot is a global provider of office supplies, furniture, technology, and services for businesses of all sizes. As a Fortune 500 company, they offer comprehensive solutions for workplace needs.",
    products: ["Office Supplies", "Furniture", "Technology", "Printing Services"],
    contracts: [
      { id: "CON-2023-008", title: "Office Supplies", startDate: "2023-03-01", endDate: "2024-02-28", value: 75000, status: "Active" },
    ],
    performanceHistory: [
      { period: "Q1 2022", score: 85 },
      { period: "Q2 2022", score: 86 },
      { period: "Q3 2022", score: 86 },
      { period: "Q4 2022", score: 87 },
      { period: "Q1 2023", score: 87 },
      { period: "Q2 2023", score: 86 },
      { period: "Q3 2023", score: 89 },
      { period: "Q4 2023", score: 88 },
    ],
    spendHistory: [
      { month: "Jan", spend: 5200 },
      { month: "Feb", spend: 4800 },
      { month: "Mar", spend: 6100 },
      { month: "Apr", spend: 5500 },
      { month: "May", spend: 5900 },
      { month: "Jun", spend: 6300 },
      { month: "Jul", spend: 5700 },
      { month: "Aug", spend: 7200 },
      { month: "Sep", spend: 6800 },
      { month: "Oct", spend: 7100 },
      { month: "Nov", spend: 6400 },
      { month: "Dec", spend: 8000 },
    ],
    documents: [
      { id: "1", name: "Supplier_Agreement.pdf", type: "pdf", size: "1.5 MB", uploadedDate: "2023-03-01" },
      { id: "2", name: "Product_Catalog_2023.pdf", type: "pdf", size: "8.2 MB", uploadedDate: "2023-03-01" },
    ],
    notes: [],
    keyContacts: [
      { name: "Sarah Johnson", title: "Account Manager", email: "sarah.j@officedepot.com", phone: "+1 (555) 234-5678" },
    ],
  },
]

export default function SupplierDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [newNote, setNewNote] = useState("")
  const [showRateDialog, setShowRateDialog] = useState(false)

  const supplier = suppliers.find((s) => s.id === id)

  if (!supplier) {
    return (
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/supplier-management/directory">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex items-center text-lg font-semibold">Supplier Not Found</div>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Supplier Not Found</h2>
            <p className="text-muted-foreground mb-4">The supplier you are looking for does not exist.</p>
            <Button asChild>
              <Link href="/supplier-management/directory">Back to Directory</Link>
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNewNote("")
    }
  }

  const totalContractValue = supplier.contracts.reduce((sum, c) => sum + c.value, 0)
  const avgPerformance = Math.round(
    supplier.performanceHistory.reduce((sum, p) => sum + p.score, 0) / supplier.performanceHistory.length
  )

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/supplier-management/directory">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{supplier.name}</span>
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
          <Badge variant="outline">{supplier.tier}</Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Rate Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate Supplier Performance</DialogTitle>
                <DialogDescription>
                  Submit your performance rating for {supplier.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quality Score (1-100)</Label>
                  <Input type="number" defaultValue="90" min="1" max="100" />
                </div>
                <div className="space-y-2">
                  <Label>On-Time Delivery (1-100)</Label>
                  <Input type="number" defaultValue="95" min="1" max="100" />
                </div>
                <div className="space-y-2">
                  <Label>Responsiveness (1-100)</Label>
                  <Input type="number" defaultValue="88" min="1" max="100" />
                </div>
                <div className="space-y-2">
                  <Label>Comments</Label>
                  <Textarea placeholder="Add any feedback..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowRateDialog(false)}>Submit Rating</Button>
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
                Export Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Create RFx
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <ThumbsDown className="mr-2 h-4 w-4" />
                Deactivate Supplier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={supplier.logo} alt={supplier.name} />
                <AvatarFallback className="text-2xl">{supplier.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{supplier.name}</h2>
                  <p className="text-muted-foreground">{supplier.category}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {supplier.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Est. {new Date(supplier.establishedDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.employeeCount} employees</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supplier.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary">
                      <Shield className="mr-1 h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className={`text-2xl font-bold ${
                    supplier.performanceScore >= 90 ? "text-green-600" :
                    supplier.performanceScore >= 80 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {supplier.performanceScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{supplier.onTimeDelivery}%</div>
                  <div className="text-xs text-muted-foreground">On-Time</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{supplier.qualityScore}%</div>
                  <div className="text-xs text-muted-foreground">Quality</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{supplier.responseTime}h</div>
                  <div className="text-xs text-muted-foreground">Response</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{supplier.description}</p>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Products & Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {supplier.products.map((product) => (
                          <Badge key={product} variant="outline">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Spend Trend</CardTitle>
                    <CardDescription>Monthly spend over the past 12 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        spend: { label: "Spend", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={supplier.spendHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                formatter={(value) =>
                                  new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(value as number)
                                }
                              />
                            }
                          />
                          <Area type="monotone" dataKey="spend" stroke="var(--color-spend)" fill="var(--color-spend)" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Key Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supplier.keyContacts.map((contact, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {contact.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.title}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`tel:${contact.phone}`}>
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contracts" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Active Contracts</CardTitle>
                        <CardDescription>{supplier.activeContracts} contracts totaling {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalContractValue)}</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        New Contract
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {supplier.contracts.map((contract) => (
                        <Link
                          key={contract.id}
                          href={`/sourcing-contracts/contracts/${contract.id}`}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{contract.title}</p>
                              <Badge variant="outline">{contract.id}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(contract.value)}
                            </span>
                            <Badge variant={contract.status === "Active" ? "success" : "outline"}>
                              {contract.status}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance History</CardTitle>
                    <CardDescription>Quarterly performance scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        score: { label: "Score", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={supplier.performanceHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis domain={[0, 100]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Quality Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold">{supplier.qualityScore}%</div>
                        <div className="flex items-center text-green-600 text-sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +2% vs last quarter
                        </div>
                      </div>
                      <Progress value={supplier.qualityScore} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">On-Time Delivery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold">{supplier.onTimeDelivery}%</div>
                        <div className="flex items-center text-green-600 text-sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +1% vs last quarter
                        </div>
                      </div>
                      <Progress value={supplier.onTimeDelivery} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Documents</CardTitle>
                        <CardDescription>{supplier.documents.length} files</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {supplier.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.size} - {new Date(doc.uploadedDate).toLocaleDateString()}
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

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes & Activity</CardTitle>
                    <CardDescription>Internal notes about this supplier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supplier.notes.length > 0 ? (
                        supplier.notes.map((note) => (
                          <div key={note.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {note.user.split(" ").map((n) => n[0]).join("")}
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
                <CardTitle className="text-base">Supplier Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={supplier.status === "Approved" ? "success" : "warning"}>
                    {supplier.status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tier</span>
                  <Badge variant="outline">{supplier.tier}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <Badge variant={supplier.riskLevel === "Low" ? "success" : supplier.riskLevel === "Medium" ? "warning" : "destructive"}>
                    {supplier.riskLevel}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Spend</span>
                  <span className="text-sm font-semibold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.totalSpend)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Terms</span>
                  <span className="text-sm">{supplier.paymentTerms}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Financial Health</span>
                  <Badge variant={supplier.financialHealth === "Strong" ? "success" : "warning"}>
                    {supplier.financialHealth}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Annual Revenue</span>
                  <span className="text-sm">{supplier.annualRevenue}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {supplier.contactName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{supplier.contactName}</p>
                      <p className="text-xs text-muted-foreground">Account Manager</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${supplier.contactEmail}`} className="hover:underline">
                      {supplier.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${supplier.contactPhone}`} className="hover:underline">
                      {supplier.contactPhone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Contract
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

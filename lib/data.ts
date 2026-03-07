// Shared data types and mock data for the procurement application

export interface ProcurementRequest {
  id: string
  title: string
  requester: string
  requesterEmail: string
  department: string
  date: string
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected"
  priority: "High" | "Medium" | "Low"
  amount: number
  description: string
  justification: string
  deliveryDate: string
  category: string
  items: ProcurementItem[]
  approvalHistory: ApprovalHistoryItem[]
  attachments: Attachment[]
  comments: Comment[]
}

export interface ProcurementItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ApprovalHistoryItem {
  id: string
  action: string
  user: string
  date: string
  comment: string
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedDate: string
}

export interface Comment {
  id: string
  user: string
  userAvatar: string
  date: string
  text: string
}

export interface Supplier {
  id: string
  name: string
  logo: string
  category: string
  status: "Approved" | "Pending" | "Under Review" | "Inactive"
  tier: "Strategic" | "Preferred" | "Tactical"
  location: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  performanceScore: number
  riskLevel: "Low" | "Medium" | "High"
  activeContracts: number
  totalSpend: number
  onTimeDelivery: number
  qualityScore: number
  responseTime: number
  certifications: string[]
  financialHealth: string
  paymentTerms: string
  establishedDate: string
  description: string
  products: string[]
  contracts: SupplierContract[]
  performanceHistory: PerformanceHistory[]
}

export interface SupplierContract {
  id: string
  title: string
  startDate: string
  endDate: string
  value: number
  status: string
}

export interface PerformanceHistory {
  period: string
  score: number
}

export interface Contract {
  id: string
  title: string
  supplier: string
  type: string
  status: "Active" | "Pending Approval" | "Expired" | "Terminated"
  startDate: string
  endDate: string
  value: number
  department: string
  daysToExpiry: number | null
  description: string
  contactName: string
  contactEmail: string
  contactPhone: string
  paymentTerms: string
  renewalTerms: string
  documents: ContractDocument[]
}

export interface ContractDocument {
  name: string
  type: string
  size: string
}

export interface RFxEvent {
  id: string
  title: string
  type: "RFP" | "RFQ" | "RFI"
  status: "Active" | "Draft" | "Evaluation" | "Closed"
  dueDate: string
  department: string
  responses: number
  estimatedValue: number
  progress: number
  description: string
  createdBy: string
  createdDate: string
  suppliers: RFxSupplier[]
  requirements: string[]
  evaluationCriteria: EvaluationCriterion[]
}

export interface RFxSupplier {
  id: string
  name: string
  category: string
  status: string
  responseStatus: string
  responseDate: string | null
  score: number | null
}

export interface EvaluationCriterion {
  name: string
  weight: number
  description: string
}

// Mock data for procurement requests
export const procurementRequests: ProcurementRequest[] = [
  {
    id: "PR-2023-001",
    title: "Office Furniture for New Location",
    requester: "Sarah Johnson",
    requesterEmail: "sarah.johnson@company.com",
    department: "Facilities",
    date: "2023-11-15",
    status: "Approved",
    priority: "Medium",
    amount: 12500,
    description:
      "Purchase of office furniture for the new downtown office location. This includes workstations, chairs, meeting room tables, and storage cabinets.",
    justification:
      "The company is expanding to a new downtown location which requires furnishing of 20 new workstations and 2 meeting rooms.",
    deliveryDate: "2023-12-15",
    category: "Furniture",
    items: [
      { id: "1", name: "Executive Desk", description: "Adjustable standing desk", quantity: 5, unitPrice: 800, totalPrice: 4000 },
      { id: "2", name: "Ergonomic Chair", description: "High-back mesh chair", quantity: 20, unitPrice: 300, totalPrice: 6000 },
      { id: "3", name: "Meeting Table", description: "12-person conference table", quantity: 2, unitPrice: 1000, totalPrice: 2000 },
      { id: "4", name: "Filing Cabinet", description: "4-drawer metal cabinet", quantity: 5, unitPrice: 100, totalPrice: 500 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "Sarah Johnson", date: "2023-11-15", comment: "Initial request submitted" },
      { id: "2", action: "Reviewed", user: "Mike Peters", date: "2023-11-16", comment: "Budget approved by department" },
      { id: "3", action: "Approved", user: "Jennifer Lee", date: "2023-11-17", comment: "Final approval granted" },
    ],
    attachments: [
      { id: "1", name: "Floor_Plan.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "Sarah Johnson", uploadedDate: "2023-11-15" },
      { id: "2", name: "Furniture_Catalog.pdf", type: "pdf", size: "5.1 MB", uploadedBy: "Sarah Johnson", uploadedDate: "2023-11-15" },
    ],
    comments: [
      { id: "1", user: "Mike Peters", userAvatar: "MP", date: "2023-11-16", text: "Please confirm the delivery address for the new location." },
      { id: "2", user: "Sarah Johnson", userAvatar: "SJ", date: "2023-11-16", text: "Delivery address: 123 Downtown Blvd, Suite 500" },
    ],
  },
  {
    id: "PR-2023-002",
    title: "IT Equipment Refresh",
    requester: "Michael Chen",
    requesterEmail: "michael.chen@company.com",
    department: "IT",
    date: "2023-11-18",
    status: "Pending Approval",
    priority: "High",
    amount: 45000,
    description: "Upgrade of outdated laptop fleet for the engineering team. Current equipment is 4+ years old and causing productivity issues.",
    justification: "Engineering team productivity has decreased by 15% due to slow hardware. New equipment will improve performance and reduce downtime.",
    deliveryDate: "2023-12-01",
    category: "IT Equipment",
    items: [
      { id: "1", name: "MacBook Pro 16\"", description: "M3 Pro, 32GB RAM, 1TB SSD", quantity: 15, unitPrice: 2500, totalPrice: 37500 },
      { id: "2", name: "USB-C Hub", description: "10-port docking station", quantity: 15, unitPrice: 200, totalPrice: 3000 },
      { id: "3", name: "External Monitor", description: "27\" 4K Display", quantity: 15, unitPrice: 300, totalPrice: 4500 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "Michael Chen", date: "2023-11-18", comment: "Initial request submitted" },
      { id: "2", action: "Reviewed", user: "Lisa Wong", date: "2023-11-19", comment: "IT Director review pending" },
    ],
    attachments: [
      { id: "1", name: "Equipment_Specs.pdf", type: "pdf", size: "1.2 MB", uploadedBy: "Michael Chen", uploadedDate: "2023-11-18" },
    ],
    comments: [
      { id: "1", user: "Lisa Wong", userAvatar: "LW", date: "2023-11-19", text: "Can we get 3 quotes for comparison?" },
    ],
  },
  {
    id: "PR-2023-003",
    title: "Marketing Materials for Q1 Campaign",
    requester: "Jessica Williams",
    requesterEmail: "jessica.williams@company.com",
    department: "Marketing",
    date: "2023-11-20",
    status: "Draft",
    priority: "Low",
    amount: 8750,
    description: "Printed marketing materials for the Q1 2024 product launch campaign including brochures, banners, and promotional items.",
    justification: "Q1 product launch requires physical marketing materials for trade shows and customer meetings.",
    deliveryDate: "2024-01-05",
    category: "Marketing Materials",
    items: [
      { id: "1", name: "Product Brochures", description: "Full-color tri-fold", quantity: 5000, unitPrice: 0.75, totalPrice: 3750 },
      { id: "2", name: "Roll-up Banners", description: "85x200cm retractable", quantity: 10, unitPrice: 150, totalPrice: 1500 },
      { id: "3", name: "Promotional Pens", description: "Branded ballpoint pens", quantity: 2000, unitPrice: 0.50, totalPrice: 1000 },
      { id: "4", name: "Tote Bags", description: "Canvas bags with logo", quantity: 500, unitPrice: 5, totalPrice: 2500 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "Jessica Williams", date: "2023-11-20", comment: "Draft created" },
    ],
    attachments: [],
    comments: [],
  },
  {
    id: "PR-2023-004",
    title: "Consulting Services for ERP Implementation",
    requester: "Robert Taylor",
    requesterEmail: "robert.taylor@company.com",
    department: "Finance",
    date: "2023-11-22",
    status: "Pending Approval",
    priority: "High",
    amount: 75000,
    description: "Professional consulting services to support the implementation of the new ERP system across finance and operations departments.",
    justification: "Internal team lacks expertise in ERP implementation. External consultants are required to ensure successful deployment by Q2 2024.",
    deliveryDate: "2024-06-30",
    category: "Professional Services",
    items: [
      { id: "1", name: "Project Management", description: "Senior consultant - 200 hours", quantity: 200, unitPrice: 150, totalPrice: 30000 },
      { id: "2", name: "Technical Configuration", description: "Technical specialist - 150 hours", quantity: 150, unitPrice: 175, totalPrice: 26250 },
      { id: "3", name: "Training Services", description: "End-user training - 75 hours", quantity: 75, unitPrice: 125, totalPrice: 9375 },
      { id: "4", name: "Documentation", description: "Technical documentation", quantity: 1, unitPrice: 9375, totalPrice: 9375 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "Robert Taylor", date: "2023-11-22", comment: "Initial request submitted" },
      { id: "2", action: "Reviewed", user: "CFO Office", date: "2023-11-23", comment: "Under review by executive team" },
    ],
    attachments: [
      { id: "1", name: "ERP_Project_Plan.pdf", type: "pdf", size: "3.8 MB", uploadedBy: "Robert Taylor", uploadedDate: "2023-11-22" },
      { id: "2", name: "Vendor_Proposal.pdf", type: "pdf", size: "4.2 MB", uploadedBy: "Robert Taylor", uploadedDate: "2023-11-22" },
    ],
    comments: [
      { id: "1", user: "CFO Office", userAvatar: "CF", date: "2023-11-23", text: "Please provide ROI analysis before final approval." },
    ],
  },
  {
    id: "PR-2023-005",
    title: "Office Supplies Quarterly Order",
    requester: "Amanda Rodriguez",
    requesterEmail: "amanda.rodriguez@company.com",
    department: "Administration",
    date: "2023-11-25",
    status: "Approved",
    priority: "Medium",
    amount: 3200,
    description: "Quarterly replenishment of office supplies including paper, toner, and general stationery items.",
    justification: "Regular quarterly order to maintain adequate inventory of office supplies.",
    deliveryDate: "2023-12-01",
    category: "Office Supplies",
    items: [
      { id: "1", name: "Copy Paper", description: "A4 80gsm, 10 boxes", quantity: 10, unitPrice: 45, totalPrice: 450 },
      { id: "2", name: "Printer Toner", description: "HP LaserJet cartridges", quantity: 8, unitPrice: 120, totalPrice: 960 },
      { id: "3", name: "Notebooks", description: "A5 spiral-bound, 100 pages", quantity: 200, unitPrice: 3, totalPrice: 600 },
      { id: "4", name: "Pens & Pencils", description: "Assorted writing instruments", quantity: 500, unitPrice: 1, totalPrice: 500 },
      { id: "5", name: "Sticky Notes", description: "3x3 inch, assorted colors", quantity: 100, unitPrice: 2, totalPrice: 200 },
      { id: "6", name: "Binders & Folders", description: "A4 ring binders and file folders", quantity: 50, unitPrice: 9.8, totalPrice: 490 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "Amanda Rodriguez", date: "2023-11-25", comment: "Quarterly order submitted" },
      { id: "2", action: "Approved", user: "Office Manager", date: "2023-11-25", comment: "Auto-approved - within budget" },
    ],
    attachments: [],
    comments: [],
  },
  {
    id: "PR-2023-006",
    title: "Training Materials for New Hires",
    requester: "David Wilson",
    requesterEmail: "david.wilson@company.com",
    department: "HR",
    date: "2023-11-28",
    status: "Rejected",
    priority: "Low",
    amount: 5500,
    description: "Printed training manuals and onboarding materials for new employee orientation program.",
    justification: "HR department needs updated training materials for the 2024 onboarding program.",
    deliveryDate: "2024-01-15",
    category: "Training Materials",
    items: [
      { id: "1", name: "Employee Handbook", description: "Full-color printed handbook", quantity: 100, unitPrice: 25, totalPrice: 2500 },
      { id: "2", name: "Training Workbooks", description: "Interactive workbook", quantity: 100, unitPrice: 15, totalPrice: 1500 },
      { id: "3", name: "Welcome Kits", description: "Branded welcome package", quantity: 100, unitPrice: 15, totalPrice: 1500 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "David Wilson", date: "2023-11-28", comment: "Initial request submitted" },
      { id: "2", action: "Rejected", user: "HR Director", date: "2023-11-29", comment: "Please consider digital alternatives to reduce costs and environmental impact." },
    ],
    attachments: [
      { id: "1", name: "Training_Outline.pdf", type: "pdf", size: "890 KB", uploadedBy: "David Wilson", uploadedDate: "2023-11-28" },
    ],
    comments: [
      { id: "1", user: "HR Director", userAvatar: "HD", date: "2023-11-29", text: "Please revise the request to include digital training options." },
    ],
  },
  {
    id: "PR-2023-007",
    title: "Software Licenses Renewal",
    requester: "Jennifer Lee",
    requesterEmail: "jennifer.lee@company.com",
    department: "IT",
    date: "2023-11-30",
    status: "Approved",
    priority: "High",
    amount: 28000,
    description: "Annual renewal of enterprise software licenses for productivity and collaboration tools.",
    justification: "License renewal is critical to maintain business operations. Licenses expire on December 31, 2023.",
    deliveryDate: "2023-12-31",
    category: "Software",
    items: [
      { id: "1", name: "Microsoft 365 Enterprise", description: "200 user licenses", quantity: 200, unitPrice: 100, totalPrice: 20000 },
      { id: "2", name: "Adobe Creative Cloud", description: "Team licenses - 15 users", quantity: 15, unitPrice: 400, totalPrice: 6000 },
      { id: "3", name: "Slack Business+", description: "Workspace upgrade", quantity: 1, unitPrice: 2000, totalPrice: 2000 },
    ],
    approvalHistory: [
      { id: "1", action: "Created", user: "Jennifer Lee", date: "2023-11-30", comment: "Annual renewal request" },
      { id: "2", action: "Approved", user: "IT Director", date: "2023-11-30", comment: "Critical renewal - expedited approval" },
      { id: "3", action: "Approved", user: "CFO", date: "2023-11-30", comment: "Budget approved for FY2024" },
    ],
    attachments: [
      { id: "1", name: "License_Agreement.pdf", type: "pdf", size: "1.5 MB", uploadedBy: "Jennifer Lee", uploadedDate: "2023-11-30" },
      { id: "2", name: "Renewal_Quote.pdf", type: "pdf", size: "280 KB", uploadedBy: "Jennifer Lee", uploadedDate: "2023-11-30" },
    ],
    comments: [],
  },
]

// Mock data for suppliers
export const suppliers: Supplier[] = [
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
    description:
      "Tech Solutions Inc. is a leading provider of IT services and solutions, specializing in cloud infrastructure, cybersecurity, and managed services for enterprise clients.",
    products: ["Cloud Infrastructure", "Managed IT Services", "Cybersecurity Solutions", "IT Consulting"],
    contracts: [
      { id: "CON-2023-001", title: "IT Support Services", startDate: "2023-01-15", endDate: "2024-01-14", value: 250000, status: "Active" },
      { id: "CON-2022-045", title: "Cloud Migration Project", startDate: "2022-06-01", endDate: "2023-05-31", value: 450000, status: "Active" },
      { id: "CON-2022-078", title: "Cybersecurity Assessment", startDate: "2022-09-15", endDate: "2023-09-14", value: 180000, status: "Active" },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 91 },
      { period: "Q2 2023", score: 89 },
      { period: "Q3 2023", score: 90 },
      { period: "Q4 2023", score: 92 },
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
    description:
      "Office Depot is a global provider of office supplies, furniture, technology, and services for businesses of all sizes.",
    products: ["Office Supplies", "Furniture", "Technology", "Printing Services"],
    contracts: [
      { id: "CON-2023-008", title: "Office Supplies", startDate: "2023-03-01", endDate: "2024-02-28", value: 75000, status: "Active" },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 87 },
      { period: "Q2 2023", score: 86 },
      { period: "Q3 2023", score: 89 },
      { period: "Q4 2023", score: 88 },
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
    website: "www.globallogistics.com",
    performanceScore: 85,
    riskLevel: "Medium",
    activeContracts: 2,
    totalSpend: 950000,
    onTimeDelivery: 87,
    qualityScore: 88,
    responseTime: 36,
    certifications: ["ISO 9001", "C-TPAT", "IATA"],
    financialHealth: "Good",
    paymentTerms: "Net 30",
    establishedDate: "2001-07-12",
    description:
      "Global Logistics Partners provides comprehensive logistics solutions including freight forwarding, warehousing, and supply chain management services worldwide.",
    products: ["Freight Forwarding", "Warehousing", "Supply Chain Management", "Customs Brokerage"],
    contracts: [
      { id: "CON-2023-015", title: "Logistics Services", startDate: "2023-06-01", endDate: "2025-05-31", value: 650000, status: "Active" },
      { id: "CON-2022-098", title: "Warehousing Services", startDate: "2022-11-01", endDate: "2023-10-31", value: 300000, status: "Active" },
    ],
    performanceHistory: [
      { period: "Q1 2023", score: 83 },
      { period: "Q2 2023", score: 84 },
      { period: "Q3 2023", score: 86 },
      { period: "Q4 2023", score: 85 },
    ],
  },
]

// Mock data for contracts
export const contracts: Contract[] = [
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
]

// Mock data for RFx events
export const rfxEvents: RFxEvent[] = [
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
    description:
      "Seeking proposals for upgrading our IT infrastructure including servers, networking equipment, and cloud services.",
    createdBy: "John Smith",
    createdDate: "2023-11-01",
    suppliers: [
      { id: "SUP-001", name: "Tech Solutions Inc.", category: "IT Services", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-05", score: 85 },
      { id: "SUP-008", name: "Network Systems Ltd.", category: "IT Infrastructure", status: "Invited", responseStatus: "Submitted", responseDate: "2023-12-07", score: 78 },
      { id: "SUP-015", name: "Cloud Experts Co.", category: "Cloud Services", status: "Invited", responseStatus: "In Progress", responseDate: null, score: null },
    ],
    requirements: [
      "Minimum 5 years experience in enterprise IT infrastructure",
      "ISO 27001 certification required",
      "24/7 support capability",
      "On-site presence within 4 hours for critical issues",
    ],
    evaluationCriteria: [
      { name: "Technical Capability", weight: 35, description: "Assessment of technical expertise and proposed solution quality" },
      { name: "Price", weight: 25, description: "Total cost of ownership over contract period" },
      { name: "Experience", weight: 20, description: "Relevant project experience and references" },
      { name: "Support", weight: 20, description: "Service level commitments and support infrastructure" },
    ],
  },
]

// Helper function to get procurement request by ID
export function getProcurementRequestById(id: string): ProcurementRequest | undefined {
  return procurementRequests.find((pr) => pr.id === id)
}

// Helper function to get supplier by ID
export function getSupplierById(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id)
}

// Helper function to get contract by ID
export function getContractById(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id)
}

// Helper function to get RFx event by ID
export function getRFxEventById(id: string): RFxEvent | undefined {
  return rfxEvents.find((r) => r.id === id)
}

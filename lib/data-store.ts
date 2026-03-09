// ==================== TYPE DEFINITIONS ====================

export interface ProcurementRequest {
  id: string;
  title: string;
  description?: string;
  requester: string;
  department: string;
  date: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected";
  priority: "Low" | "Medium" | "High";
  amount: number;
  items?: ProcurementItem[];
  approvalHistory?: ApprovalHistoryItem[];
  documents?: Document[];
}

export interface ProcurementItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ApprovalHistoryItem {
  id: string;
  action: string;
  status: string;
  date: string;
  approvedBy: string;
  comments?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  spend: number;
  suppliers: number;
  contracts: number;
  categoryManager?: string;
  lastUpdated?: string;
  tags?: string[];
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  description: string;
  spend: number;
  suppliers: number;
  contracts: number;
}

export interface Supplier {
  id: string;
  name: string;
  type: "Strategic" | "Preferred" | "Tactical";
  category: string;
  status: "Active" | "Inactive" | "On Hold";
  tier: string;
  riskLevel: "High" | "Medium" | "Low";
  rating: number;
  totalSpend: number;
  contractCount: number;
  performanceScore: number;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  registrationDate: string;
  certifications: string[];
  documents?: Document[];
  contracts?: string[];
}

export interface Contract {
  id: string;
  supplierId: string;
  supplierName: string;
  title: string;
  type: "Statement of Work" | "Services Agreement" | "Master Service" | "Licenses/Subscriptions" | "Lease Agreement" | "Purchase/Blanket" | "Warranty" | "Engagement Letter";
  category: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Pending" | "Expired" | "Expiring Soon" | "Terminated";
  renewalOption: boolean;
  jurisdiction: string;
  hasLocalSupplier: boolean;
  hasIndemnity: boolean;
  hasRenewalClause: boolean;
  hasTerminationClause: boolean;
  signedByCEO: boolean;
  documents?: Document[];
  milestones?: ContractMilestone[];
}

export interface ContractMilestone {
  id: string;
  name: string;
  dueDate: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  amount?: number;
}

export interface RfxEvent {
  id: string;
  title: string;
  type: "RFP" | "RFQ" | "RFI" | "RFT";
  description?: string;
  category: string;
  status: "Draft" | "Active" | "Evaluation" | "Closed" | "Awarded";
  publishedDate?: string;
  deadline: string;
  budget: number;
  createdBy: string;
  createdDate: string;
  questions?: RfxQuestion[];
  responses?: RfxResponse[];
  documents?: Document[];
  evaluationCriteria?: EvaluationCriterion[];
}

export interface RfxQuestion {
  id: string;
  question: string;
  type: "text" | "number" | "date" | "choice" | "upload";
  required: boolean;
  options?: string[];
}

export interface RfxResponse {
  id: string;
  supplierId: string;
  supplierName: string;
  submittedDate?: string;
  totalAmount?: number;
  score?: number;
  answers: { [questionId: string]: any };
  documents?: Document[];
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

export interface PerformanceEvaluation {
  id: string;
  supplierId: string;
  supplierName: string;
  category: string;
  evaluationDate: string;
  evaluatedBy: string;
  overallScore: number;
  qualityScore: number;
  deliveryScore: number;
  costScore: number;
  serviceScore: number;
  complianceScore: number;
  innovationScore: number;
  status: "Draft" | "Submitted" | "Approved";
  comments?: string;
  issues?: PerformanceIssue[];
  recommendations?: string[];
}

export interface PerformanceIssue {
  id: string;
  type: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  date: string;
  resolved: boolean;
}

// ==================== IN-MEMORY DATA STORE ====================

class InMemoryDataStore {
  private procurementRequests: ProcurementRequest[] = [];
  private categories: Category[] = [];
  private suppliers: Supplier[] = [];
  private contracts: Contract[] = [];
  private rfxEvents: RfxEvent[] = [];
  private performanceEvaluations: PerformanceEvaluation[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize Procurement Requests
    this.procurementRequests = [
      {
        id: "PR-2023-001",
        title: "Office Furniture for New Location",
        description: "Furniture for new office location including desks, chairs, and storage units",
        requester: "Sarah Johnson",
        department: "Facilities",
        date: "2023-11-15",
        status: "Approved",
        priority: "Medium",
        amount: 12500,
        items: [
          { id: "1", name: "Office Desk", quantity: 20, unitPrice: 300, totalPrice: 6000 },
          { id: "2", name: "Ergonomic Chair", quantity: 20, unitPrice: 250, totalPrice: 5000 },
          { id: "3", name: "Filing Cabinet", quantity: 10, unitPrice: 150, totalPrice: 1500 },
        ],
        approvalHistory: [
          {
            id: "1",
            action: "Submitted",
            status: "Pending Approval",
            date: "2023-11-15",
            approvedBy: "Sarah Johnson",
          },
          {
            id: "2",
            action: "Approved",
            status: "Approved",
            date: "2023-11-16",
            approvedBy: "John Smith",
            comments: "Approved within budget",
          },
        ],
      },
      {
        id: "PR-2023-002",
        title: "IT Equipment Refresh",
        description: "Refresh laptop fleet for IT department",
        requester: "Michael Chen",
        department: "IT",
        date: "2023-11-18",
        status: "Pending Approval",
        priority: "High",
        amount: 45000,
        items: [
          { id: "1", name: "Laptop", quantity: 15, unitPrice: 2500, totalPrice: 37500 },
          { id: "2", name: "Monitor", quantity: 15, unitPrice: 500, totalPrice: 7500 },
        ],
      },
      {
        id: "PR-2023-003",
        title: "Marketing Materials for Q1 Campaign",
        description: "Marketing materials for Q1 2024 campaign",
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
        description: "External consulting services for ERP system implementation",
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
        description: "Quarterly office supplies order",
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
        description: "Training materials and resources for new employee onboarding",
        requester: "David Wilson",
        department: "HR",
        date: "2023-11-28",
        status: "Rejected",
        priority: "Low",
        amount: 5500,
        approvalHistory: [
          {
            id: "1",
            action: "Submitted",
            status: "Pending Approval",
            date: "2023-11-28",
            approvedBy: "David Wilson",
          },
          {
            id: "2",
            action: "Rejected",
            status: "Rejected",
            date: "2023-11-29",
            approvedBy: "John Smith",
            comments: "Budget already allocated for internal training materials",
          },
        ],
      },
      {
        id: "PR-2023-007",
        title: "Software Licenses Renewal",
        description: "Annual software licenses renewal",
        requester: "Jennifer Lee",
        department: "IT",
        date: "2023-11-30",
        status: "Approved",
        priority: "High",
        amount: 28000,
      },
    ];

    // Initialize Categories
    this.categories = [
      {
        id: 1,
        name: "IT Equipment",
        description: "Computer hardware, software, and peripherals",
        spend: 4250000,
        suppliers: 42,
        contracts: 18,
        categoryManager: "John Smith",
        lastUpdated: "2024-01-09",
        tags: ["Strategic", "High Value", "Core Business"],
        subcategories: [
          { id: 11, name: "Hardware", description: "Physical computing devices", spend: 2800000, suppliers: 24, contracts: 10 },
          { id: 12, name: "Software", description: "Applications and operating systems", spend: 950000, suppliers: 15, contracts: 6 },
          { id: 13, name: "Peripherals", description: "External devices and accessories", spend: 500000, suppliers: 8, contracts: 2 },
        ],
      },
      {
        id: 2,
        name: "Office Supplies",
        description: "Stationery, paper products, and office consumables",
        spend: 1250000,
        suppliers: 28,
        contracts: 12,
        categoryManager: "Sarah Johnson",
        lastUpdated: "2024-01-05",
        tags: ["Operational", "Recurring"],
        subcategories: [
          { id: 21, name: "Stationery", description: "Pens, pencils, and writing materials", spend: 450000, suppliers: 12, contracts: 5 },
          { id: 22, name: "Paper Products", description: "Printing paper, notebooks, and notepads", spend: 550000, suppliers: 8, contracts: 4 },
          { id: 23, name: "Office Consumables", description: "Toner, ink, and other consumable items", spend: 250000, suppliers: 10, contracts: 3 },
        ],
      },
      {
        id: 3,
        name: "Professional Services",
        description: "Consulting, legal, and other professional services",
        spend: 3850000,
        suppliers: 35,
        contracts: 22,
        categoryManager: "Michael Chen",
        lastUpdated: "2024-01-08",
        tags: ["Strategic", "High Value"],
        subcategories: [
          { id: 31, name: "Consulting", description: "Business and management consulting", spend: 2200000, suppliers: 18, contracts: 12 },
          { id: 32, name: "Legal Services", description: "Legal advice and representation", spend: 950000, suppliers: 8, contracts: 6 },
          { id: 33, name: "Financial Services", description: "Accounting, auditing, and financial advisory", spend: 700000, suppliers: 9, contracts: 4 },
        ],
      },
      {
        id: 4,
        name: "Facilities",
        description: "Building maintenance, utilities, and facility services",
        spend: 2950000,
        suppliers: 32,
        contracts: 15,
        categoryManager: "Robert Taylor",
        lastUpdated: "2024-01-07",
        tags: ["Operational", "Critical"],
        subcategories: [
          { id: 41, name: "Maintenance", description: "Building repairs and maintenance", spend: 1200000, suppliers: 14, contracts: 6 },
          { id: 42, name: "Utilities", description: "Electricity, water, and other utilities", spend: 1050000, suppliers: 8, contracts: 5 },
          { id: 43, name: "Security", description: "Security services and equipment", spend: 700000, suppliers: 10, contracts: 4 },
        ],
      },
      {
        id: 5,
        name: "Marketing",
        description: "Advertising, promotions, and marketing services",
        spend: 1850000,
        suppliers: 25,
        contracts: 14,
        categoryManager: "Jessica Williams",
        lastUpdated: "2024-01-06",
        tags: ["Strategic", "Growth"],
        subcategories: [
          { id: 51, name: "Advertising", description: "Print, digital, and media advertising", spend: 850000, suppliers: 12, contracts: 6 },
          { id: 52, name: "Digital Marketing", description: "SEO, social media, and online marketing", spend: 650000, suppliers: 8, contracts: 5 },
          { id: 53, name: "Events", description: "Trade shows, conferences, and corporate events", spend: 350000, suppliers: 5, contracts: 3 },
        ],
      },
    ];

    // Initialize Suppliers
    this.suppliers = [
      {
        id: "SUP-001",
        name: "Tech Solutions Inc.",
        type: "Strategic",
        category: "IT Equipment",
        status: "Active",
        tier: "Tier 1",
        riskLevel: "Low",
        rating: 4.5,
        totalSpend: 2500000,
        contractCount: 5,
        performanceScore: 92,
        contactPerson: "John Anderson",
        email: "john@techsolutions.com",
        phone: "+971-4-1234567",
        address: "123 Business Bay",
        city: "Dubai",
        country: "United Arab Emirates",
        registrationDate: "2020-01-15",
        certifications: ["ISO 9001", "ISO 27001"],
        contracts: ["CON-2023-001", "CON-2023-005"],
      },
      {
        id: "SUP-002",
        name: "Office Depot",
        type: "Preferred",
        category: "Office Supplies",
        status: "Active",
        tier: "Tier 2",
        riskLevel: "Low",
        rating: 4.2,
        totalSpend: 1200000,
        contractCount: 3,
        performanceScore: 88,
        contactPerson: "Mary Johnson",
        email: "mary@officedepot.ae",
        phone: "+971-4-2345678",
        address: "456 Sheikh Zayed Road",
        city: "Dubai",
        country: "United Arab Emirates",
        registrationDate: "2019-03-20",
        certifications: ["ISO 9001"],
        contracts: ["CON-2023-008"],
      },
      {
        id: "SUP-003",
        name: "Consulting Partners",
        type: "Strategic",
        category: "Professional Services",
        status: "Active",
        tier: "Tier 1",
        riskLevel: "Medium",
        rating: 4.7,
        totalSpend: 1800000,
        contractCount: 4,
        performanceScore: 95,
        contactPerson: "David Chen",
        email: "david@consultingpartners.com",
        phone: "+971-2-3456789",
        address: "789 Corniche Road",
        city: "Abu Dhabi",
        country: "United Arab Emirates",
        registrationDate: "2018-06-10",
        certifications: ["ISO 9001", "ISO 27001", "CMMI Level 5"],
        contracts: ["CON-2023-010"],
      },
      {
        id: "SUP-004",
        name: "Marketing Agency",
        type: "Preferred",
        category: "Marketing",
        status: "Active",
        tier: "Tier 2",
        riskLevel: "Low",
        rating: 4.3,
        totalSpend: 1500000,
        contractCount: 3,
        performanceScore: 90,
        contactPerson: "Sarah Williams",
        email: "sarah@marketingagency.ae",
        phone: "+971-4-4567890",
        address: "321 Media City",
        city: "Dubai",
        country: "United Arab Emirates",
        registrationDate: "2020-08-25",
        certifications: ["ISO 9001"],
        contracts: ["CON-2023-012"],
      },
      {
        id: "SUP-005",
        name: "Facilities Management",
        type: "Tactical",
        category: "Facilities",
        status: "Active",
        tier: "Tier 3",
        riskLevel: "Medium",
        rating: 3.9,
        totalSpend: 1200000,
        contractCount: 2,
        performanceScore: 82,
        contactPerson: "Ahmed Hassan",
        email: "ahmed@facilitiesmgt.ae",
        phone: "+971-50-1234567",
        address: "654 Industrial Area",
        city: "Abu Dhabi",
        country: "United Arab Emirates",
        registrationDate: "2021-02-14",
        certifications: ["ISO 9001", "ISO 14001"],
        contracts: ["CON-2023-015"],
      },
      {
        id: "SUP-006",
        name: "Global Logistics",
        type: "Preferred",
        category: "Facilities",
        status: "Active",
        tier: "Tier 2",
        riskLevel: "Low",
        rating: 4.4,
        totalSpend: 1800000,
        contractCount: 4,
        performanceScore: 91,
        contactPerson: "Michael Brown",
        email: "michael@globallogistics.com",
        phone: "+971-4-5678901",
        address: "987 Jebel Ali",
        city: "Dubai",
        country: "United Arab Emirates",
        registrationDate: "2019-11-30",
        certifications: ["ISO 9001", "ISO 27001", "AEO"],
        contracts: ["CON-2023-023"],
      },
    ];

    // Initialize Contracts
    this.contracts = [
      {
        id: "CON-2023-001",
        supplierId: "SUP-001",
        supplierName: "Tech Solutions Inc.",
        title: "IT Equipment Supply Agreement",
        type: "Master Service",
        category: "IT Equipment",
        value: 250000,
        currency: "USD",
        startDate: "2023-01-01",
        endDate: "2023-12-15",
        status: "Expiring Soon",
        renewalOption: true,
        jurisdiction: "United Arab Emirates",
        hasLocalSupplier: true,
        hasIndemnity: true,
        hasRenewalClause: true,
        hasTerminationClause: true,
        signedByCEO: true,
        milestones: [
          { id: "1", name: "Initial Delivery", dueDate: "2023-03-15", status: "Completed", amount: 100000 },
          { id: "2", name: "Second Delivery", dueDate: "2023-06-15", status: "Completed", amount: 100000 },
          { id: "3", name: "Final Delivery", dueDate: "2023-12-15", status: "In Progress", amount: 50000 },
        ],
      },
      {
        id: "CON-2023-008",
        supplierId: "SUP-002",
        supplierName: "Office Depot",
        title: "Office Supplies Annual Contract",
        type: "Purchase/Blanket",
        category: "Office Supplies",
        value: 75000,
        currency: "USD",
        startDate: "2023-01-01",
        endDate: "2023-12-22",
        status: "Expiring Soon",
        renewalOption: true,
        jurisdiction: "United Arab Emirates",
        hasLocalSupplier: true,
        hasIndemnity: true,
        hasRenewalClause: true,
        hasTerminationClause: true,
        signedByCEO: false,
      },
      {
        id: "CON-2023-015",
        supplierId: "SUP-005",
        supplierName: "Facilities Management",
        title: "Building Maintenance Services",
        type: "Services Agreement",
        category: "Facilities",
        value: 180000,
        currency: "USD",
        startDate: "2023-01-01",
        endDate: "2024-01-05",
        status: "Active",
        renewalOption: true,
        jurisdiction: "Abu Dhabi, United Arab Emirates",
        hasLocalSupplier: true,
        hasIndemnity: true,
        hasRenewalClause: true,
        hasTerminationClause: true,
        signedByCEO: true,
      },
      {
        id: "CON-2023-023",
        supplierId: "SUP-006",
        supplierName: "Global Logistics",
        title: "Shipping and Logistics Services",
        type: "Services Agreement",
        category: "Facilities",
        value: 120000,
        currency: "USD",
        startDate: "2023-01-01",
        endDate: "2024-01-15",
        status: "Active",
        renewalOption: true,
        jurisdiction: "United Arab Emirates",
        hasLocalSupplier: true,
        hasIndemnity: true,
        hasRenewalClause: true,
        hasTerminationClause: true,
        signedByCEO: false,
      },
    ];

    // Initialize Rfx Events
    this.rfxEvents = [
      {
        id: "RFX-2023-001",
        title: "IT Infrastructure Upgrade RFP",
        type: "RFP",
        description: "Request for proposal for comprehensive IT infrastructure upgrade",
        category: "IT Equipment",
        status: "Evaluation",
        publishedDate: "2023-10-15",
        deadline: "2023-12-01",
        budget: 500000,
        createdBy: "Michael Chen",
        createdDate: "2023-10-01",
        evaluationCriteria: [
          { id: "1", name: "Technical Capability", weight: 30, description: "Technical expertise and solution quality" },
          { id: "2", name: "Price", weight: 25, description: "Total cost of ownership" },
          { id: "3", name: "Experience", weight: 20, description: "Relevant industry experience" },
          { id: "4", name: "Support", weight: 15, description: "Post-implementation support" },
          { id: "5", name: "Timeline", weight: 10, description: "Proposed implementation timeline" },
        ],
        responses: [
          {
            id: "RESP-001",
            supplierId: "SUP-001",
            supplierName: "Tech Solutions Inc.",
            submittedDate: "2023-11-20",
            totalAmount: 450000,
            score: 88,
            answers: {},
          },
          {
            id: "RESP-002",
            supplierId: "SUP-003",
            supplierName: "Consulting Partners",
            submittedDate: "2023-11-25",
            totalAmount: 420000,
            score: 92,
            answers: {},
          },
        ],
      },
      {
        id: "RFX-2023-002",
        title: "Office Supplies RFQ",
        type: "RFQ",
        description: "Request for quotation for annual office supplies",
        category: "Office Supplies",
        status: "Active",
        publishedDate: "2023-11-01",
        deadline: "2023-12-15",
        budget: 100000,
        createdBy: "Amanda Rodriguez",
        createdDate: "2023-10-28",
        responses: [
          {
            id: "RESP-003",
            supplierId: "SUP-002",
            supplierName: "Office Depot",
            submittedDate: "2023-11-15",
            totalAmount: 85000,
            score: 90,
            answers: {},
          },
        ],
      },
    ];

    // Initialize Performance Evaluations
    this.performanceEvaluations = [
      {
        id: "EVAL-2023-001",
        supplierId: "SUP-001",
        supplierName: "Tech Solutions Inc.",
        category: "IT Equipment",
        evaluationDate: "2023-12-01",
        evaluatedBy: "Michael Chen",
        overallScore: 92,
        qualityScore: 95,
        deliveryScore: 90,
        costScore: 88,
        serviceScore: 93,
        complianceScore: 94,
        innovationScore: 91,
        status: "Approved",
        comments: "Excellent performance overall. Delivered all milestones on time with high quality.",
        issues: [],
        recommendations: ["Continue current partnership", "Consider expanding scope for future projects"],
      },
      {
        id: "EVAL-2023-002",
        supplierId: "SUP-002",
        supplierName: "Office Depot",
        category: "Office Supplies",
        evaluationDate: "2023-12-05",
        evaluatedBy: "Amanda Rodriguez",
        overallScore: 88,
        qualityScore: 90,
        deliveryScore: 92,
        costScore: 85,
        serviceScore: 87,
        complianceScore: 88,
        innovationScore: 85,
        status: "Approved",
        comments: "Good performance with room for improvement in cost competitiveness.",
        issues: [
          {
            id: "1",
            type: "Delivery Delay",
            description: "Minor delay in November delivery",
            severity: "Low",
            date: "2023-11-10",
            resolved: true,
          },
        ],
        recommendations: ["Monitor delivery times closely", "Explore cost optimization opportunities"],
      },
      {
        id: "EVAL-2023-003",
        supplierId: "SUP-003",
        supplierName: "Consulting Partners",
        category: "Professional Services",
        evaluationDate: "2023-12-10",
        evaluatedBy: "Robert Taylor",
        overallScore: 95,
        qualityScore: 96,
        deliveryScore: 94,
        costScore: 93,
        serviceScore: 96,
        complianceScore: 95,
        innovationScore: 96,
        status: "Approved",
        comments: "Outstanding performance. Exceeded expectations in all areas.",
        issues: [],
        recommendations: ["Strategic partnership recommended", "Consider for high-priority projects"],
      },
    ];
  }

  // ==================== PROCUREMENT REQUESTS METHODS ====================

  getProcurementRequests(): ProcurementRequest[] {
    return [...this.procurementRequests];
  }

  getProcurementRequestById(id: string): ProcurementRequest | undefined {
    return this.procurementRequests.find((r) => r.id === id);
  }

  createProcurementRequest(request: Omit<ProcurementRequest, "id" | "date">): ProcurementRequest {
    const newRequest: ProcurementRequest = {
      ...request,
      id: `PR-${new Date().getFullYear()}-${String(this.procurementRequests.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      approvalHistory: request.approvalHistory || [
        {
          id: Date.now().toString(),
          action: "Submitted",
          status: request.status,
          date: new Date().toISOString().split("T")[0],
          approvedBy: request.requester,
        },
      ],
    };
    this.procurementRequests.push(newRequest);
    return newRequest;
  }

  updateProcurementRequest(id: string, updates: Partial<ProcurementRequest>): ProcurementRequest | null {
    const index = this.procurementRequests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.procurementRequests[index] = { ...this.procurementRequests[index], ...updates };
    return this.procurementRequests[index];
  }

  deleteProcurementRequest(id: string): boolean {
    const index = this.procurementRequests.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.procurementRequests.splice(index, 1);
    return true;
  }

  approveProcurementRequest(id: string, approvedBy: string, comments?: string): ProcurementRequest | null {
    const request = this.getProcurementRequestById(id);
    if (!request) return null;

    const updatedRequest = this.updateProcurementRequest(id, {
      status: "Approved",
      approvalHistory: [
        ...(request.approvalHistory || []),
        {
          id: Date.now().toString(),
          action: "Approved",
          status: "Approved",
          date: new Date().toISOString().split("T")[0],
          approvedBy,
          comments,
        },
      ],
    });

    return updatedRequest;
  }

  rejectProcurementRequest(id: string, rejectedBy: string, comments?: string): ProcurementRequest | null {
    const request = this.getProcurementRequestById(id);
    if (!request) return null;

    const updatedRequest = this.updateProcurementRequest(id, {
      status: "Rejected",
      approvalHistory: [
        ...(request.approvalHistory || []),
        {
          id: Date.now().toString(),
          action: "Rejected",
          status: "Rejected",
          date: new Date().toISOString().split("T")[0],
          approvedBy: rejectedBy,
          comments,
        },
      ],
    });

    return updatedRequest;
  }

  // ==================== CATEGORIES METHODS ====================

  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  createCategory(category: Omit<Category, "id" | "subcategories">): Category {
    const newId = Math.max(...this.categories.map((c) => c.id)) + 1;
    const newCategory: Category = {
      ...category,
      id: newId,
      subcategories: category.subcategories || [],
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: number, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.categories[index] = {
      ...this.categories[index],
      ...updates,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    return this.categories[index];
  }

  deleteCategory(id: number): boolean {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.categories.splice(index, 1);
    return true;
  }

  addSubcategory(categoryId: number, subcategory: Omit<Subcategory, "id">): Subcategory | null {
    const category = this.getCategoryById(categoryId);
    if (!category) return null;

    const newId = Math.max(...category.subcategories.map((s) => s.id), 10) + 1;
    const newSubcategory: Subcategory = { ...subcategory, id: newId };
    category.subcategories.push(newSubcategory);

    // Update category totals
    category.spend += subcategory.spend;
    category.suppliers += subcategory.suppliers;
    category.contracts += subcategory.contracts;
    category.lastUpdated = new Date().toISOString().split("T")[0];

    return newSubcategory;
  }

  updateSubcategory(categoryId: number, subcategoryId: number, updates: Partial<Subcategory>): Subcategory | null {
    const category = this.getCategoryById(categoryId);
    if (!category) return null;

    const subcategoryIndex = category.subcategories.findIndex((s) => s.id === subcategoryId);
    if (subcategoryIndex === -1) return null;

    category.subcategories[subcategoryIndex] = { ...category.subcategories[subcategoryIndex], ...updates };
    category.lastUpdated = new Date().toISOString().split("T")[0];

    return category.subcategories[subcategoryIndex];
  }

  deleteSubcategory(categoryId: number, subcategoryId: number): boolean {
    const category = this.getCategoryById(categoryId);
    if (!category) return false;

    const subcategoryIndex = category.subcategories.findIndex((s) => s.id === subcategoryId);
    if (subcategoryIndex === -1) return false;

    const deletedSubcategory = category.subcategories.splice(subcategoryIndex, 1)[0];

    // Update category totals
    category.spend -= deletedSubcategory.spend;
    category.suppliers -= deletedSubcategory.suppliers;
    category.contracts -= deletedSubcategory.contracts;
    category.lastUpdated = new Date().toISOString().split("T")[0];

    return true;
  }

  // ==================== SUPPLIERS METHODS ====================

  getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  getSupplierById(id: string): Supplier | undefined {
    return this.suppliers.find((s) => s.id === id);
  }

  createSupplier(supplier: Omit<Supplier, "id" | "registrationDate">): Supplier {
    const newId = `SUP-${String(this.suppliers.length + 1).padStart(3, "0")}`;
    const newSupplier: Supplier = {
      ...supplier,
      id: newId,
      registrationDate: new Date().toISOString().split("T")[0],
      contracts: supplier.contracts || [],
    };
    this.suppliers.push(newSupplier);
    return newSupplier;
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const index = this.suppliers.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.suppliers[index] = { ...this.suppliers[index], ...updates };
    return this.suppliers[index];
  }

  deleteSupplier(id: string): boolean {
    const index = this.suppliers.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.suppliers.splice(index, 1);
    return true;
  }

  getSuppliersByCategory(category: string): Supplier[] {
    return this.suppliers.filter((s) => s.category === category);
  }

  getSuppliersByType(type: string): Supplier[] {
    return this.suppliers.filter((s) => s.type === type);
  }

  getSuppliersByStatus(status: string): Supplier[] {
    return this.suppliers.filter((s) => s.status === status);
  }

  getSuppliersByTier(tier: string): Supplier[] {
    return this.suppliers.filter((s) => s.tier === tier);
  }

  // ==================== CONTRACTS METHODS ====================

  getContracts(): Contract[] {
    return [...this.contracts];
  }

  getContractById(id: string): Contract | undefined {
    return this.contracts.find((c) => c.id === id);
  }

  getContractsBySupplier(supplierId: string): Contract[] {
    return this.contracts.filter((c) => c.supplierId === supplierId);
  }

  getContractsByCategory(category: string): Contract[] {
    return this.contracts.filter((c) => c.category === category);
  }

  getContractsByStatus(status: string): Contract[] {
    return this.contracts.filter((c) => c.status === status);
  }

  getContractsByType(type: string): Contract[] {
    return this.contracts.filter((c) => c.type === type);
  }

  createContract(contract: Omit<Contract, "id">): Contract {
    const newId = `CON-${new Date().getFullYear()}-${String(this.contracts.length + 1).padStart(3, "0")}`;
    const newContract: Contract = { ...contract, id: newId };
    this.contracts.push(newContract);

    // Update supplier contract count
    const supplier = this.getSupplierById(contract.supplierId);
    if (supplier) {
      supplier.contractCount++;
      supplier.contracts = [...(supplier.contracts || []), newId];
    }

    return newContract;
  }

  updateContract(id: string, updates: Partial<Contract>): Contract | null {
    const index = this.contracts.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.contracts[index] = { ...this.contracts[index], ...updates };
    return this.contracts[index];
  }

  deleteContract(id: string): boolean {
    const index = this.contracts.findIndex((c) => c.id === id);
    if (index === -1) return false;

    const contract = this.contracts[index];

    // Update supplier contract count
    const supplier = this.getSupplierById(contract.supplierId);
    if (supplier) {
      supplier.contractCount--;
      supplier.contracts = supplier.contracts?.filter((c) => c !== id) || [];
    }

    this.contracts.splice(index, 1);
    return true;
  }

  getExpiringContracts(days: number = 60): Contract[] {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.contracts.filter((contract) => {
      const endDate = new Date(contract.endDate);
      return endDate <= futureDate && endDate > today && contract.status === "Active";
    });
  }

  // ==================== RFX EVENTS METHODS ====================

  getRfxEvents(): RfxEvent[] {
    return [...this.rfxEvents];
  }

  getRfxEventById(id: string): RfxEvent | undefined {
    return this.rfxEvents.find((r) => r.id === id);
  }

  createRfxEvent(rfx: Omit<RfxEvent, "id" | "createdDate">): RfxEvent {
    const newId = `RFX-${new Date().getFullYear()}-${String(this.rfxEvents.length + 1).padStart(3, "0")}`;
    const newRfx: RfxEvent = { ...rfx, id: newId, createdDate: new Date().toISOString().split("T")[0] };
    this.rfxEvents.push(newRfx);
    return newRfx;
  }

  updateRfxEvent(id: string, updates: Partial<RfxEvent>): RfxEvent | null {
    const index = this.rfxEvents.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.rfxEvents[index] = { ...this.rfxEvents[index], ...updates };
    return this.rfxEvents[index];
  }

  deleteRfxEvent(id: string): boolean {
    const index = this.rfxEvents.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.rfxEvents.splice(index, 1);
    return true;
  }

  addRfxResponse(rfxId: string, response: Omit<RfxResponse, "id">): RfxResponse | null {
    const rfx = this.getRfxEventById(rfxId);
    if (!rfx) return null;

    const newId = `RESP-${Date.now()}`;
    const newResponse: RfxResponse = { ...response, id: newId };
    rfx.responses = [...(rfx.responses || []), newResponse];

    return newResponse;
  }

  updateRfxResponse(rfxId: string, responseId: string, updates: Partial<RfxResponse>): RfxResponse | null {
    const rfx = this.getRfxEventById(rfxId);
    if (!rfx || !rfx.responses) return null;

    const index = rfx.responses.findIndex((r) => r.id === responseId);
    if (index === -1) return null;

    rfx.responses[index] = { ...rfx.responses[index], ...updates };
    return rfx.responses[index];
  }

  // ==================== PERFORMANCE EVALUATIONS METHODS ====================

  getPerformanceEvaluations(): PerformanceEvaluation[] {
    return [...this.performanceEvaluations];
  }

  getPerformanceEvaluationById(id: string): PerformanceEvaluation | undefined {
    return this.performanceEvaluations.find((e) => e.id === id);
  }

  getEvaluationsBySupplier(supplierId: string): PerformanceEvaluation[] {
    return this.performanceEvaluations.filter((e) => e.supplierId === supplierId);
  }

  createPerformanceEvaluation(evaluation: Omit<PerformanceEvaluation, "id">): PerformanceEvaluation {
    const newId = `EVAL-${new Date().getFullYear()}-${String(this.performanceEvaluations.length + 1).padStart(3, "0")}`;
    const newEvaluation: PerformanceEvaluation = { ...evaluation, id: newId };
    this.performanceEvaluations.push(newEvaluation);
    return newEvaluation;
  }

  updatePerformanceEvaluation(id: string, updates: Partial<PerformanceEvaluation>): PerformanceEvaluation | null {
    const index = this.performanceEvaluations.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.performanceEvaluations[index] = { ...this.performanceEvaluations[index], ...updates };
    return this.performanceEvaluations[index];
  }

  deletePerformanceEvaluation(id: string): boolean {
    const index = this.performanceEvaluations.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.performanceEvaluations.splice(index, 1);
    return true;
  }

  // ==================== DASHBOARD STATISTICS ====================

  getDashboardStats() {
    const activeContracts = this.contracts.filter((c) => c.status === "Active").length;
    const totalSpend = this.contracts.reduce((sum, c) => sum + c.value, 0);
    const suppliersFromUAE = this.suppliers.filter((s) => s.country.includes("United Arab Emirates")).length;
    const totalContracts = this.contracts.length;

    return {
      activeContracts,
      totalSuppliers: this.suppliers.length,
      totalContracts,
      totalSpend,
      suppliersFromUAE,
      icvCertifiedSuppliers: this.suppliers.filter((s) => s.certifications.includes("ISO 9001")).length,
      isoCertifiedSuppliers: this.suppliers.filter((s) => s.certifications.some((c) => c.startsWith("ISO"))).length,
      upcomingContracts: this.getExpiringContracts(60),
      pendingRequests: this.procurementRequests.filter((r) => r.status === "Pending Approval").length,
      activeRfx: this.rfxEvents.filter((r) => r.status === "Active").length,
    };
  }
}

// ==================== EXPORT SINGLETON INSTANCE ====================

export const dataStore = new InMemoryDataStore();

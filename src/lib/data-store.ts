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
    // ==================== GENERATE 30 CATEGORIES ====================
    const categoryNames = [
      "IT Equipment", "Office Supplies", "Professional Services", "Facilities", "Marketing",
      "Human Resources", "Legal Services", "Financial Services", "Transportation", "Construction",
      "Telecommunications", "Security Services", "Consulting", "Training & Development", "Insurance",
      "Software Licensing", "Travel & Expense", "Event Management", "Print & Media", "Utilities",
      "Healthcare & Medical", "Environmental Services", "Research & Development", "Logistics", "Real Estate",
      "Food & Catering", "Maintenance Services", "Raw Materials", "Industrial Equipment", "Safety Equipment"
    ];

    const categoryManagers = [
      "John Smith", "Sarah Johnson", "Michael Chen", "Jessica Williams", "Robert Taylor",
      "Amanda Rodriguez", "David Wilson", "Jennifer Lee", "Chris Martinez", "Emily Brown",
      "Daniel Garcia", "Lisa Anderson", "Kevin Thomas", "Maria Garcia", "James Wilson"
    ];

    this.categories = categoryNames.map((name, index) => ({
      id: index + 1,
      name,
      description: `Comprehensive ${name.toLowerCase()} procurement category covering all related goods and services`,
      spend: Math.floor(Math.random() * 5000000) + 500000,
      suppliers: Math.floor(Math.random() * 50) + 10,
      contracts: Math.floor(Math.random() * 25) + 5,
      categoryManager: categoryManagers[index % categoryManagers.length],
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: index % 2 === 0 ? ["Strategic", "High Value"] : ["Operational", "Recurring"],
      subcategories: [
        {
          id: (index + 1) * 10 + 1,
          name: `${name} - Goods`,
          description: `Physical ${name.toLowerCase()} products and materials`,
          spend: Math.floor(Math.random() * 3000000) + 200000,
          suppliers: Math.floor(Math.random() * 30) + 5,
          contracts: Math.floor(Math.random() * 15) + 3
        },
        {
          id: (index + 1) * 10 + 2,
          name: `${name} - Services`,
          description: `${name.toLowerCase()} related professional services`,
          spend: Math.floor(Math.random() * 2000000) + 300000,
          suppliers: Math.floor(Math.random() * 20) + 5,
          contracts: Math.floor(Math.random() * 10) + 2
        }
      ]
    }));

    // ==================== GENERATE 30 SUPPLIERS ====================
    const supplierNames = [
      "Tech Solutions Inc.", "Office Depot", "Consulting Partners", "Marketing Agency", "Facilities Management",
      "Global Logistics", "Security First Corp", "HealthCare Plus", "Eco Services Ltd", "Build Right Construction",
      "Digital Innovations", "Travel Pro International", "Media Works", "Food Services Group", "Utility Partners",
      "Safety First Supplies", "Industrial Tech Corp", "Research & Science Co", "Transport Express", "Insurance Masters",
      "Training Excellence", "Legal Eagles", "Financial Wizards", "Construction Kings", "Software Solutions Pro",
      "Telecom Giants", "Event Planners Inc", "Maintenance Masters", "Raw Materials Direct", "Real Estate Partners"
    ];

    const supplierCities = ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Ajman"];
    const contactNames = [
      "John Anderson", "Mary Johnson", "David Chen", "Sarah Williams", "Ahmed Hassan",
      "Michael Brown", "Lisa Martinez", "James Wilson", "Emily Davis", "Robert Garcia",
      "Jennifer Taylor", "Daniel Anderson", "Maria Thomas", "Chris Jackson", "Lisa White"
    ];

    this.suppliers = supplierNames.map((name, index) => {
      const category = this.categories[index % this.categories.length].name;
      const type = index < 10 ? "Strategic" : index < 20 ? "Preferred" : "Tactical";
      const tier = type === "Strategic" ? "Tier 1" : type === "Preferred" ? "Tier 2" : "Tier 3";
      
      return {
        id: `SUP-${String(index + 1).padStart(3, '0')}`,
        name,
        type,
        category,
        status: index % 10 === 0 ? "Inactive" : index % 7 === 0 ? "On Hold" : "Active",
        tier,
        riskLevel: index % 5 === 0 ? "High" : index % 3 === 0 ? "Medium" : "Low",
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        totalSpend: Math.floor(Math.random() * 3000000) + 500000,
        contractCount: Math.floor(Math.random() * 8) + 1,
        performanceScore: Math.floor(Math.random() * 20) + 80,
        contactPerson: contactNames[index % contactNames.length],
        email: `${contactNames[index % contactNames.length].toLowerCase().replace(' ', '.')}@${name.toLowerCase().replace(/\s/g, '')}.com`,
        phone: `+971-4-${String(Math.floor(Math.random() * 900000) + 100000)}`,
        address: `${Math.floor(Math.random() * 999) + 1} Business Street`,
        city: supplierCities[index % supplierCities.length],
        country: "United Arab Emirates",
        registrationDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        certifications: index % 2 === 0 ? ["ISO 9001", "ISO 27001"] : ["ISO 9001"],
        contracts: []
      };
    });

    // ==================== GENERATE 30 PROCUREMENT REQUESTS ====================
    const departments = ["IT", "Finance", "HR", "Marketing", "Operations", "Facilities", "Legal", "Administration"];
    const requesters = [
      "Sarah Johnson", "Michael Chen", "Jessica Williams", "Robert Taylor", "Amanda Rodriguez",
      "David Wilson", "Jennifer Lee", "Chris Martinez", "Emily Brown", "Daniel Garcia"
    ];

    const prTitles = [
      "Office Equipment Procurement", "IT Infrastructure Upgrade", "Consulting Services", "Facility Maintenance", "Marketing Campaign",
      "Training Program", "Legal Advisory Services", "Security System Installation", "Travel Expenses", "Event Management",
      "Software Licenses", "Office Supplies", "Professional Services", "Construction Project", "Telecommunication Services",
      "Insurance Renewal", "Research Equipment", "Transportation Services", "Catering Services", "Utility Services",
      "Healthcare Supplies", "Environmental Services", "Industrial Equipment", "Safety Equipment", "Raw Materials",
      "Real Estate Lease", "Maintenance Services", "Print Services", "Financial Advisory", "Media Production"
    ];

    const statuses: Array<"Draft" | "Pending Approval" | "Approved" | "Rejected"> = ["Draft", "Pending Approval", "Approved", "Rejected"];
    const priorities: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];

    this.procurementRequests = prTitles.map((title, index) => {
      const category = this.categories[index % this.categories.length];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `PR-2023-${String(index + 1).padStart(3, '0')}`,
        title,
        description: `Procurement request for ${title.toLowerCase()} to support business operations`,
        requester: requesters[index % requesters.length],
        department: departments[index % departments.length],
        date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        amount: Math.floor(Math.random() * 100000) + 5000,
        items: [
          {
            id: `${index + 1}-1`,
            name: `${category.name} Item 1`,
            description: `Primary ${category.name.toLowerCase()} item`,
            quantity: Math.floor(Math.random() * 50) + 1,
            unitPrice: Math.floor(Math.random() * 1000) + 100,
            totalPrice: Math.floor(Math.random() * 50000) + 1000
          }
        ],
        approvalHistory: status !== "Draft" ? [{
          id: `AH-${index + 1}`,
          action: "Submitted",
          status: "Pending Approval",
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          approvedBy: requesters[index % requesters.length]
        }] : []
      };
    });

    // ==================== GENERATE 30 CONTRACTS ====================
    const contractTypes: Array<"Statement of Work" | "Services Agreement" | "Master Service" | "Licenses/Subscriptions" | "Lease Agreement" | "Purchase/Blanket" | "Warranty" | "Engagement Letter"> = [
      "Statement of Work", "Services Agreement", "Master Service", "Licenses/Subscriptions", 
      "Lease Agreement", "Purchase/Blanket", "Warranty", "Engagement Letter"
    ];

    const contractTitles = [
      "IT Equipment Supply Agreement", "Office Supplies Annual Contract", "Consulting Services Agreement",
      "Building Maintenance Contract", "Marketing Services Agreement", "Training Services Contract",
      "Legal Services Retainer", "Security Services Agreement", "Healthcare Services Contract",
      "Environmental Services Agreement", "Construction Project Contract", "Software Licensing Agreement",
      "Telecommunication Services Contract", "Insurance Policy Contract", "Travel Services Agreement",
      "Event Management Contract", "Catering Services Agreement", "Utility Services Contract",
      "Transportation Services Contract", "Real Estate Lease Agreement", "Research Services Contract",
      "Financial Advisory Services", "Industrial Equipment Supply", "Safety Equipment Contract",
      "Raw Materials Supply Agreement", "Maintenance Services Contract", "Print Services Agreement",
      "Media Production Contract", "Professional Services Agreement", "Facility Management Contract"
    ];

    const contractStatuses: Array<"Active" | "Pending" | "Expired" | "Expiring Soon" | "Terminated"> = [
      "Active", "Pending", "Expired", "Expiring Soon", "Terminated"
    ];

    this.contracts = contractTitles.map((title, index) => {
      const supplier = this.suppliers[index % this.suppliers.length];
      const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + (Math.random() * 365 + 180) * 24 * 60 * 60 * 1000);
      const status = endDate < new Date() ? "Expired" : 
                     (endDate.getTime() - Date.now()) < 60 * 24 * 60 * 60 * 1000 ? "Expiring Soon" : 
                     contractStatuses[Math.floor(Math.random() * 3)]; // Active, Pending, or Terminated
      
      const contractId = `CON-2023-${String(index + 1).padStart(3, '0')}`;
      
      // Link contract to supplier
      if (!supplier.contracts) supplier.contracts = [];
      supplier.contracts.push(contractId);
      
      return {
        id: contractId,
        supplierId: supplier.id,
        supplierName: supplier.name,
        title,
        type: contractTypes[index % contractTypes.length],
        category: supplier.category,
        value: Math.floor(Math.random() * 500000) + 50000,
        currency: "USD",
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        status,
        renewalOption: Math.random() > 0.3,
        jurisdiction: supplier.city + ", United Arab Emirates",
        hasLocalSupplier: true,
        hasIndemnity: Math.random() > 0.2,
        hasRenewalClause: Math.random() > 0.3,
        hasTerminationClause: Math.random() > 0.1,
        signedByCEO: Math.random() > 0.4,
        milestones: [
          {
            id: `M-${index + 1}-1`,
            name: "Initial Phase",
            dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "Completed",
            amount: Math.floor(Math.random() * 50000) + 10000
          },
          {
            id: `M-${index + 1}-2`,
            name: "Milestone 2",
            dueDate: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: Math.random() > 0.5 ? "Completed" : "In Progress",
            amount: Math.floor(Math.random() * 50000) + 10000
          }
        ]
      };
    });

    // ==================== GENERATE 30 RFX EVENTS ====================
    const rfxTypes: Array<"RFP" | "RFQ" | "RFI" | "RFT"> = ["RFP", "RFQ", "RFI", "RFT"];
    const rfxStatuses: Array<"Draft" | "Active" | "Evaluation" | "Closed" | "Awarded"> = [
      "Draft", "Active", "Evaluation", "Closed", "Awarded"
    ];

    const rfxTitles = [
      "IT Infrastructure Upgrade RFP", "Office Supplies RFQ", "Consulting Services RFP",
      "Building Maintenance RFT", "Marketing Campaign RFP", "Training Services RFQ",
      "Legal Services RFP", "Security System RFT", "Healthcare Services RFP",
      "Environmental Services RFI", "Construction Project RFP", "Software Licensing RFQ",
      "Telecommunication Services RFP", "Insurance Services RFI", "Travel Services RFQ",
      "Event Management RFP", "Catering Services RFQ", "Utility Services RFT",
      "Transportation Services RFP", "Real Estate Services RFI", "Research Services RFP",
      "Financial Advisory RFQ", "Industrial Equipment RFP", "Safety Equipment RFT",
      "Raw Materials RFQ", "Maintenance Services RFP", "Print Services RFQ",
      "Media Production RFP", "Professional Services RFI", "Facility Management RFP", "Office Equipment RFQ"
    ];

    this.rfxEvents = rfxTitles.map((title, index) => {
      const category = this.categories[index % this.categories.length];
      const status = rfxStatuses[Math.floor(Math.random() * rfxStatuses.length)];
      const publishedDate = status !== "Draft" ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined;
      const deadline = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Get random suppliers as responders
      const potentialResponders = this.suppliers.filter(s => s.category === category.name).slice(0, 5);
      const responses = status !== "Draft" && status !== "Active" ? potentialResponders.slice(0, Math.floor(Math.random() * 4) + 1).map((supplier, i) => ({
        id: `RESP-${index}-${i}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        submittedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalAmount: Math.floor(Math.random() * 200000) + 50000,
        score: Math.floor(Math.random() * 20) + 80,
        answers: {}
      })) : [];
      
      return {
        id: `RFX-2023-${String(index + 1).padStart(3, '0')}`,
        title,
        type: rfxTypes[index % rfxTypes.length],
        description: `Request for ${rfxTypes[index % rfxTypes.length]} for ${title.toLowerCase()}`,
        category: category.name,
        status,
        publishedDate,
        deadline,
        budget: Math.floor(Math.random() * 500000) + 100000,
        createdBy: requesters[index % requesters.length],
        createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        evaluationCriteria: [
          { id: `EC-${index}-1`, name: "Technical Capability", weight: 30, description: "Technical expertise and solution quality" },
          { id: `EC-${index}-2`, name: "Price", weight: 25, description: "Total cost of ownership" },
          { id: `EC-${index}-3`, name: "Experience", weight: 20, description: "Relevant industry experience" },
          { id: `EC-${index}-4`, name: "Support", weight: 15, description: "Post-implementation support" },
          { id: `EC-${index}-5`, name: "Timeline", weight: 10, description: "Proposed implementation timeline" }
        ],
        responses: responses.length > 0 ? responses : undefined,
        questions: [
          {
            id: `Q-${index}-1`,
            question: "Describe your company's experience with similar projects",
            type: "text",
            required: true
          },
          {
            id: `Q-${index}-2`,
            question: "What is your proposed timeline for delivery?",
            type: "date",
            required: true
          },
          {
            id: `Q-${index}-3`,
            question: "Total bid amount",
            type: "number",
            required: true
          }
        ]
      };
    });

    // ==================== GENERATE 30 PERFORMANCE EVALUATIONS ====================
    const evalStatuses: Array<"Draft" | "Submitted" | "Approved"> = ["Draft", "Submitted", "Approved"];

    this.performanceEvaluations = this.suppliers.slice(0, 30).map((supplier, index) => {
      const overallScore = Math.floor(Math.random() * 20) + 80;
      const hasIssues = Math.random() > 0.6;
      
      return {
        id: `EVAL-2023-${String(index + 1).padStart(3, '0')}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        category: supplier.category,
        evaluationDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        evaluatedBy: requesters[index % requesters.length],
        overallScore,
        qualityScore: Math.floor(Math.random() * 15) + 85,
        deliveryScore: Math.floor(Math.random() * 15) + 85,
        costScore: Math.floor(Math.random() * 15) + 85,
        serviceScore: Math.floor(Math.random() * 15) + 85,
        complianceScore: Math.floor(Math.random() * 15) + 85,
        innovationScore: Math.floor(Math.random() * 15) + 85,
        status: evalStatuses[Math.floor(Math.random() * evalStatuses.length)],
        comments: hasIssues ? "Good performance with some areas for improvement" : "Excellent performance overall",
        issues: hasIssues ? [{
          id: `ISSUE-${index}`,
          type: ["Delivery", "Quality", "Communication"][Math.floor(Math.random() * 3)],
          description: "Minor performance issue observed during evaluation period",
          severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          resolved: Math.random() > 0.5
        }] : [],
        recommendations: [
          "Continue current partnership",
          "Monitor performance metrics closely",
          "Consider expanding scope for future projects"
        ]
      };
    });
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

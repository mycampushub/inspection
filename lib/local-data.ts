// Types and Interfaces
export interface ProcurementItem {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  requestedBy: string
  department: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'
  estimatedValue: number
  currency: string
  requestDate: string
  dueDate: string
  items: Array<{
    id: string
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  approvalHistory: Array<{
    date: string
    approver: string
    action: string
    comments?: string
  }>
  justification: string
  attachments?: Array<{
    id: string
    name: string
    size: number
    type: string
  }>
}

export interface Category {
  id: string
  name: string
  code: string
  description: string
  itemCount: number
  subcategories: Array<{
    id: string
    name: string
    itemCount: number
  }>
  createdAt: string
  updatedAt: string
}

export interface Contract {
  id: string
  title: string
  contractNumber: string
  type: 'purchase' | 'service' | 'software' | 'consulting' | 'maintenance'
  status: 'draft' | 'active' | 'pending' | 'expired' | 'terminated'
  supplierId: string
  supplierName: string
  value: number
  currency: string
  startDate: string
  endDate: string
  renewalDate?: string
  terms: string
  milestones: Array<{
    id: string
    title: string
    dueDate: string
    status: 'pending' | 'completed' | 'overdue'
    value?: number
  }>
  documents: Array<{
    id: string
    name: string
    type: string
    uploadDate: string
  }>
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  code: string
  category: string
  type: 'goods' | 'services' | 'both'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  contactPerson: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  categories: string[]
  certifications: Array<{
    id: string
    name: string
    expiryDate: string
  }>
  rating: number
  totalSpend: number
  contractCount: number
  tier: string
  riskLevel: 'Low' | 'Medium' | 'High'
  onTimeDelivery: number
  qualityScore: number
  communicationScore: number
  contracts: Array<{
    id: string
    title: string
  }>
  createdAt: string
  updatedAt: string
}

export interface EvaluationCriterion {
  id: string
  name: string
  weight: number
  description: string
}

export interface RfxResponse {
  id: string
  supplierId: string
  supplierName: string
  submittedDate: string
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected'
  totalPrice: number
  currency: string
  scores: Array<{
    criterionId: string
    criterionName: string
    score: number
    maxScore: number
  }>
  documents: Array<{
    id: string
    name: string
    type: string
  }>
}

export interface RfxEvent {
  id: string
  title: string
  type: 'rfp' | 'rfi' | 'rfq'
  status: 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled'
  category: string
  subcategory: string
  description: string
  budget: number
  currency: string
  publishedDate?: string
  closingDate: string
  evaluationCriteria: EvaluationCriterion[]
  responses: RfxResponse[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Evaluation {
  id: string
  supplierId: string
  supplierName: string
  category: string
  evaluationPeriod: string
  evaluatedAt: string
  evaluatedBy: string
  overallScore: number
  qualityOfGoods: number
  onTimeDelivery: number
  pricing: number
  customerService: number
  compliance: number
  status: 'completed' | 'in-progress' | 'scheduled'
  criteria: Array<{
    name: string
    score: number
    maxScore: number
    comments?: string
  }>
  issues: Array<{
    id: string
    type: 'quality' | 'delivery' | 'communication' | 'compliance' | 'other'
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    description: string
    reportedDate: string
    status: 'open' | 'in-progress' | 'resolved'
  }>
  comments: Array<{
    id: string
    text: string
    author: string
    timestamp: string
  }>
  evaluator: string
  evaluatedDate?: string
  createdAt: string
}

export interface DashboardStats {
  totalRequests: number
  pendingRequests: number
  activeContracts: number
  totalSuppliers: number
  monthlySpend: number
  yoyGrowth: number
  averageApprovalTime: number
  rfqOpen: number
}

export interface SpendAnalysisData {
  monthly: Array<{
    month: string
    spend: number
    budget: number
  }>
  byCategory: Array<{
    category: string
    spend: number
    percentage: number
  }>
  bySupplier: Array<{
    supplier: string
    spend: number
    contracts: number
  }>
  trends: Array<{
    period: string
    spend: number
    budget: number
    variance: number
  }>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

// Generated Data - Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalRequests: 247,
  pendingRequests: 23,
  activeContracts: 86,
  totalSuppliers: 142,
  monthlySpend: 2850000,
  yoyGrowth: 12.5,
  averageApprovalTime: 4.2,
  rfqOpen: 8,
}

// Add additional fields needed by reporting-analytics page
dashboardStats.activeSuppliers = 35
dashboardStats.contractsExpiring = 12

// Generated Data - Spend Analysis
export const spendAnalysisData: SpendAnalysisData & {
  spendByCategory: Array<{ name: string; value: number }>
  spendTrend: Array<{ month: string; value: number }>
  spendBySupplier: Array<{ name: string; value: number }>
  spendByDepartment: Array<{ name: string; value: number }>
  categoryTrend: Array<{ name: string; [key: string]: string | number }>
  totalSpend: number
  categories: number
  activeSuppliers: number
  avgCostPerOrder: number
} = {
  monthly: [
    { month: 'Jan', spend: 2450000, budget: 2600000 },
    { month: 'Feb', spend: 2800000, budget: 2700000 },
    { month: 'Mar', spend: 3100000, budget: 3000000 },
    { month: 'Apr', spend: 2750000, budget: 2800000 },
    { month: 'May', spend: 2900000, budget: 2850000 },
    { month: 'Jun', spend: 2850000, budget: 2900000 },
    { month: 'Jul', spend: 3200000, budget: 3100000 },
    { month: 'Aug', spend: 2950000, budget: 3000000 },
    { month: 'Sep', spend: 3100000, budget: 3050000 },
    { month: 'Oct', spend: 3000000, budget: 2950000 },
    { month: 'Nov', spend: 2750000, budget: 2800000 },
    { month: 'Dec', spend: 2600000, budget: 2700000 },
  ],
  byCategory: [
    { category: 'IT Equipment', spend: 8500000, percentage: 28 },
    { category: 'Office Supplies', spend: 4500000, percentage: 15 },
    { category: 'Services', spend: 7200000, percentage: 24 },
    { category: 'Software', spend: 5200000, percentage: 17 },
    { category: 'Furniture', spend: 2800000, percentage: 9 },
    { category: 'Other', spend: 2000000, percentage: 7 },
  ],
  bySupplier: [
    { supplier: 'TechCorp Solutions', spend: 5200000, contracts: 12 },
    { supplier: 'Global Services Inc', spend: 3800000, contracts: 8 },
    { supplier: 'Office Depot Pro', spend: 2900000, contracts: 15 },
    { supplier: 'Digital First Ltd', spend: 2500000, contracts: 6 },
    { supplier: 'Furniture Plus', spend: 1800000, contracts: 4 },
    { supplier: 'Consulting Experts', spend: 1500000, contracts: 3 },
  ],
  trends: [
    { period: 'Q1', spend: 8350000, budget: 8300000, variance: 0.6 },
    { period: 'Q2', spend: 8500000, budget: 8550000, variance: -0.6 },
    { period: 'Q3', spend: 9250000, budget: 9150000, variance: 1.1 },
    { period: 'Q4', spend: 8350000, budget: 8450000, variance: -1.2 },
  ],
  // Additional fields for reporting-analytics page
  spendByCategory: [
    { name: 'IT Equipment', value: 8500000 },
    { name: 'Office Supplies', value: 4500000 },
    { name: 'Services', value: 7200000 },
    { name: 'Software', value: 5200000 },
    { name: 'Furniture', value: 2800000 },
    { name: 'Other', value: 2000000 },
  ],
  spendTrend: [
    { month: 'Jan', value: 2450000 },
    { month: 'Feb', value: 2800000 },
    { month: 'Mar', value: 3100000 },
    { month: 'Apr', value: 2750000 },
    { month: 'May', value: 2900000 },
    { month: 'Jun', value: 2850000 },
    { month: 'Jul', value: 3200000 },
    { month: 'Aug', value: 2950000 },
    { month: 'Sep', value: 3100000 },
    { month: 'Oct', value: 3000000 },
    { month: 'Nov', value: 2750000 },
    { month: 'Dec', value: 2600000 },
  ],
  spendBySupplier: [
    { name: 'TechCorp Solutions', value: 5200000 },
    { name: 'Global Services Inc', value: 3800000 },
    { name: 'Office Depot Pro', value: 2900000 },
    { name: 'Digital First Ltd', value: 2500000 },
    { name: 'Furniture Plus', value: 1800000 },
    { name: 'Consulting Experts', value: 1500000 },
    { name: 'Other Suppliers', value: 8500000 },
  ],
  spendByDepartment: [
    { name: 'IT', value: 8500000 },
    { name: 'Marketing', value: 5200000 },
    { name: 'Operations', value: 6800000 },
    { name: 'HR', value: 2900000 },
    { name: 'Finance', value: 4300000 },
    { name: 'Sales', value: 2500000 },
  ],
  categoryTrend: [
    { name: 'Jan', 'IT Equipment': 500000, 'Office Supplies': 200000, Services: 450000, Software: 380000, Furniture: 420000 },
    { name: 'Feb', 'IT Equipment': 550000, 'Office Supplies': 220000, Services: 480000, Software: 400000, Furniture: 450000 },
    { name: 'Mar', 'IT Equipment': 580000, 'Office Supplies': 240000, Services: 510000, Software: 420000, Furniture: 470000 },
    { name: 'Apr', 'IT Equipment': 620000, 'Office Supplies': 210000, Services: 490000, Software: 450000, Furniture: 440000 },
    { name: 'May', 'IT Equipment': 650000, 'Office Supplies': 230000, Services: 520000, Software: 470000, Furniture: 460000 },
    { name: 'Jun', 'IT Equipment': 680000, 'Office Supplies': 250000, Services: 540000, Software: 490000, Furniture: 480000 },
  ],
  totalSpend: 30200000,
  categories: 28,
  activeSuppliers: 35,
  avgCostPerOrder: 12500,
}

// Generated Data - Procurement Requests (30 items)
const generateProcurementRequests = (): ProcurementItem[] => {
  const departments = ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales']
  const categories = ['IT Equipment', 'Office Supplies', 'Services', 'Software', 'Furniture']
  const statuses: Array<'draft' | 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'> = ['pending', 'approved', 'rejected', 'in-progress', 'completed', 'draft']
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent']
  
  const requests: ProcurementItem[] = []
  
  for (let i = 1; i <= 30; i++) {
    const status = statuses[i % statuses.length]
    const priority = priorities[i % priorities.length]
    const category = categories[i % categories.length]
    const department = departments[i % departments.length]
    
    const approvalHistory: Array<{
      date: string
      approver: string
      action: string
      comments?: string
    }> = []
    
    if (status === 'approved' || status === 'completed' || status === 'in-progress') {
      approvalHistory.push({
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        approver: 'John Smith',
        action: 'Approved',
        comments: 'Request approved within budget limits',
      })
    }
    
    if (status === 'rejected') {
      approvalHistory.push({
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        approver: 'Sarah Johnson',
        action: 'Rejected',
        comments: 'Budget exceeded. Please revise.',
      })
    }
    
    requests.push({
      id: `PR-${String(i).padStart(4, '0')}`,
      title: `${category} - ${department} Department Request`,
      description: `Procurement request for ${category.toLowerCase()} needed by ${department} department`,
      category,
      subcategory: `${category} Subcategory ${Math.ceil(i / 6)}`,
      requestedBy: `User ${i}`,
      department,
      priority,
      status,
      estimatedValue: (Math.floor(Math.random() * 50000) + 5000),
      currency: 'USD',
      requestDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: `ITM-${i}-1`,
          name: `${category} Item 1`,
          quantity: Math.floor(Math.random() * 20) + 1,
          unitPrice: Math.floor(Math.random() * 1000) + 100,
          totalPrice: 0,
        },
        {
          id: `ITM-${i}-2`,
          name: `${category} Item 2`,
          quantity: Math.floor(Math.random() * 10) + 1,
          unitPrice: Math.floor(Math.random() * 500) + 50,
          totalPrice: 0,
        },
      ].map(item => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice,
      })),
      approvalHistory,
      justification: `This procurement is required to support ${department} department operations and improve efficiency.`,
      attachments: i % 3 === 0 ? [{
        id: `ATT-${i}-1`,
        name: 'quotation.pdf',
        size: 245678,
        type: 'application/pdf',
      }] : undefined,
    })
  }
  
  return requests
}

export const localProcurementRequests = generateProcurementRequests()

// Generated Data - Categories (28 items)
const generateCategories = (): Category[] => {
  const categories = [
    'IT Equipment', 'Office Supplies', 'Services', 'Software', 'Furniture',
    'Raw Materials', 'Packaging', 'Marketing Materials', 'Training', 'Consulting',
    'Maintenance', 'Utilities', 'Transportation', 'Communication', 'Safety Equipment',
    'Industrial Supplies', 'Medical Supplies', 'Food & Beverage', 'Cleaning Supplies',
    'Electronics', 'Tools', 'Automotive', 'Construction', 'Textiles',
    'Chemicals', 'Paper Products', 'Security Equipment', 'Environmental Services',
  ]
  
  const subcategoriesList = [
    ['Laptops', 'Desktops', 'Monitors', 'Printers', 'Network Equipment'],
    ['Stationery', 'Paper', 'Ink & Toner', 'Folders', 'Office Accessories'],
    ['Consulting', 'Training', 'Maintenance', 'Support', 'Legal'],
    ['Productivity', 'Security', 'Database', 'Development', 'Analytics'],
    ['Desks', 'Chairs', 'Storage', 'Tables', 'Cabinets'],
    ['Metals', 'Plastics', 'Wood', 'Composites', 'Ceramics'],
    ['Boxes', 'Labels', 'Bubble Wrap', 'Tape', 'Containers'],
    ['Brochures', 'Banners', 'Business Cards', 'Flyers', 'Promotional Items'],
    ['Online Courses', 'In-Person Training', 'Workshops', 'Certifications', 'Seminars'],
    ['Strategy', 'Operations', 'Financial', 'Legal', 'Technical'],
    ['Facility', 'Equipment', 'Software', 'Preventive', 'Corrective'],
    ['Electricity', 'Water', 'Gas', 'Internet', 'Phone'],
    ['Logistics', 'Shipping', 'Fleet', 'Distribution', 'Warehousing'],
    ['Email', 'Video Conferencing', 'Phone Systems', 'Chat', 'Collaboration'],
    ['PPE', 'Fire Safety', 'First Aid', 'Signage', 'Emergency Equipment'],
    ['Bearings', 'Fasteners', 'Adhesives', 'Lubricants', 'Tools'],
    ['Diagnostic', 'Therapeutic', 'Surgical', 'Laboratory', 'Consumables'],
    ['Beverages', 'Snacks', 'Ingredients', 'Catering', 'Vending'],
    ['Detergents', 'Disinfectants', 'Mops', 'Brooms', 'Waste Management'],
    ['Audio', 'Video', 'Computers', 'Peripherals', 'Accessories'],
    ['Hand Tools', 'Power Tools', 'Measuring', 'Cutting', 'Assembly'],
    ['Parts', 'Accessories', 'Fluids', 'Tires', 'Electrical'],
    ['Building Materials', 'Hardware', 'Safety', 'Heavy Equipment', 'Tools'],
    ['Fabrics', 'Yarn', 'Clothing', 'Industrial Textiles', 'Carpets'],
    ['Solvents', 'Acids', 'Bases', 'Reagents', 'Specialty'],
    ['Copy Paper', 'Notebooks', 'Envelopes', 'Forms', 'Files'],
    ['CCTV', 'Access Control', 'Alarms', 'Guards', 'Cybersecurity'],
    ['Waste Management', 'Recycling', 'Composting', 'Hazardous Waste', 'Cleanup'],
  ]
  
  return categories.map((name, index) => ({
    id: `CAT-${String(index + 1).padStart(3, '0')}`,
    name,
    code: `C${String(index + 1).padStart(3, '0')}`,
    description: `${name} category for procurement and inventory management`,
    itemCount: Math.floor(Math.random() * 100) + 20,
    subcategories: subcategoriesList[index].map((sub, subIndex) => ({
      id: `SUB-${index + 1}-${subIndex + 1}`,
      name: sub,
      itemCount: Math.floor(Math.random() * 30) + 5,
    })),
    createdAt: new Date(Date.now() - (index + 1) * 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - (index + 1) * 5 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

export const localCategories = generateCategories()

// Generated Data - Suppliers (35 items) - MUST come before Contracts, RFx, Evaluations
const generateSuppliers = (): Supplier[] => {
  const supplierNames = [
    'TechCorp Solutions', 'Global Services Inc', 'Office Depot Pro', 'Digital First Ltd',
    'Furniture Plus', 'Consulting Experts', 'Industrial Supplies Co', 'Safety First Equipment',
    'Medical Solutions Group', 'Food & Beverage Partners', 'CleanTeam Services', 'Power Electronics',
    'Tool Masters', 'Auto Parts Hub', 'BuildRight Construction', 'Textile World',
    'ChemSafe Inc', 'Paper Products Unlimited', 'SecureGuard Systems', 'EcoFriendly Services',
    'FastTrack Logistics', 'Communication Central', 'Utility Partners', 'Training Academy',
    'Marketing Wizards', 'Software Solutions Pro', 'IT Hardware Giants', 'Packaging Experts',
    'Raw Materials Direct', 'Maintenance Masters', 'Transportation Solutions', 'Environmental Care',
    'Security First', 'Industrial Tools Ltd', 'Smart Tech Solutions',
  ]
  
  const types: Array<'goods' | 'services' | 'both'> = ['goods', 'services', 'both']
  const statuses: Array<'active' | 'inactive' | 'pending' | 'suspended'> = ['active', 'inactive', 'pending', 'suspended']
  const categoryOptions = [
    'IT Equipment', 'Office Supplies', 'Services', 'Software', 'Furniture',
    'Raw Materials', 'Packaging', 'Marketing Materials', 'Training', 'Consulting',
  ]
  
  const suppliers: Supplier[] = []
  
  for (let i = 0; i < supplierNames.length; i++) {
    const type = types[i % types.length]
    const status = i < 30 ? 'active' : statuses[i % statuses.length]
    const primaryCategory = categoryOptions[i % categoryOptions.length]
    const tiers = ['Strategic', 'Preferred', 'Tactical']
    const riskLevels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High']
    
    suppliers.push({
      id: `SUP-${String(i + 1).padStart(4, '0')}`,
      name: supplierNames[i],
      code: `S${String(i + 1).padStart(3, '0')}`,
      category: primaryCategory,
      type,
      status,
      contactPerson: `Contact Person ${i + 1}`,
      email: `contact@${supplierNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: {
        street: `${Math.floor(Math.random() * 9999)} Business Street`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][i % 6],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'][i % 6],
        country: 'USA',
        zipCode: String(Math.floor(Math.random() * 90000) + 10000),
      },
      categories: categoryOptions.slice(0, Math.floor(Math.random() * 4) + 2),
      certifications: [
        {
          id: `CERT-${i}-1`,
          name: 'ISO 9001:2015',
          expiryDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `CERT-${i}-2`,
          name: 'ISO 14001:2015',
          expiryDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      totalSpend: Math.floor(Math.random() * 5000000) + 100000,
      contractCount: Math.floor(Math.random() * 15) + 1,
      tier: tiers[i % tiers.length],
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      onTimeDelivery: Math.floor(Math.random() * 30) + 70,
      qualityScore: Math.floor(Math.random() * 30) + 70,
      communicationScore: Math.floor(Math.random() * 30) + 70,
      contracts: Array.from({ length: Math.floor(Math.random() * 5) }, (_, idx) => ({
        id: `CON-${i}-${idx}`,
        title: `Contract ${idx + 1} with ${supplierNames[i]}`,
      })),
      createdAt: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - (i + 1) * 5 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return suppliers
}

export const localSuppliers = generateSuppliers()

// Generated Data - Contracts (30 items) - DEPENDS ON localSuppliers
const generateContracts = (): Contract[] => {
  const suppliers = localSuppliers.slice(0, 20).map(s => ({ id: s.id, name: s.name }))
  const types: Array<'purchase' | 'service' | 'software' | 'consulting' | 'maintenance'> = ['purchase', 'service', 'software', 'consulting', 'maintenance']
  const statuses: Array<'draft' | 'active' | 'pending' | 'expired' | 'terminated'> = ['active', 'pending', 'expired', 'terminated', 'draft']
  
  const contracts: Contract[] = []
  
  for (let i = 1; i <= 30; i++) {
    const supplier = suppliers[i % suppliers.length]
    const type = types[i % types.length]
    const status = statuses[i % statuses.length]
    const startDate = new Date(Date.now() - (30 - i) * 30 * 24 * 60 * 60 * 1000)
    const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    
    const milestones = Array.from({ length: 4 }, (_, idx) => ({
      id: `MIL-${i}-${idx + 1}`,
      title: `Milestone ${idx + 1}`,
      dueDate: new Date(startDate.getTime() + (idx + 1) * 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: (idx < Math.floor(i / 8)) ? 'completed' : 'pending' as const,
      value: (Math.floor(Math.random() * 50000) + 10000),
    }))
    
    contracts.push({
      id: `CON-${String(i).padStart(4, '0')}`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Contract with ${supplier.name}`,
      contractNumber: `CNT-${2024}-${String(i).padStart(4, '0')}`,
      type,
      status,
      supplierId: supplier.id,
      supplierName: supplier.name,
      value: (Math.floor(Math.random() * 500000) + 50000),
      currency: 'USD',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      renewalDate: new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      terms: `Standard terms and conditions for ${type} agreements. Payment terms: Net 30. Warranty: 1 year.`,
      milestones,
      documents: [
        {
          id: `DOC-${i}-1`,
          name: 'contract.pdf',
          type: 'application/pdf',
          uploadDate: startDate.toISOString(),
        },
        {
          id: `DOC-${i}-2`,
          name: 'sow.pdf',
          type: 'application/pdf',
          uploadDate: startDate.toISOString(),
        },
      ],
      createdAt: startDate.toISOString(),
      updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return contracts
}

export const localContracts = generateContracts()

// Generated Data - RFx Events (30 items) - DEPENDS ON localCategories and localSuppliers
const generateRfxEvents = (): RfxEvent[] => {
  const types: Array<'rfp' | 'rfi' | 'rfq'> = ['rfp', 'rfi', 'rfq']
  const statuses: Array<'draft' | 'published' | 'closed' | 'awarded' | 'cancelled'> = ['published', 'closed', 'awarded', 'draft', 'cancelled']
  const criteria: EvaluationCriterion[] = [
    { id: 'c1', name: 'Price', weight: 30, description: 'Competitive pricing' },
    { id: 'c2', name: 'Quality', weight: 25, description: 'Product/service quality' },
    { id: 'c3', name: 'Delivery Time', weight: 20, description: 'Delivery timeline' },
    { id: 'c4', name: 'Technical Capability', weight: 15, description: 'Technical expertise' },
    { id: 'c5', name: 'Past Performance', weight: 10, description: 'Track record' },
  ]
  
  const rfxEvents: RfxEvent[] = []
  
  for (let i = 1; i <= 30; i++) {
    const type = types[i % types.length]
    const status = statuses[i % statuses.length]
    const category = localCategories[i % localCategories.length]
    const publishedDate = status !== 'draft' ? new Date(Date.now() - (30 - i) * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
    const closingDate = new Date(Date.now() + (30 - i) * 3 * 24 * 60 * 60 * 1000).toISOString()
    
    const responseCount = Math.floor(Math.random() * 5) + 2
    const responses: RfxResponse[] = Array.from({ length: responseCount }, (_, idx) => {
      const supplier = localSuppliers[(i + idx) % localSuppliers.length]
      return {
        id: `RES-${i}-${idx + 1}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        submittedDate: new Date(Date.now() - (responseCount - idx) * 24 * 60 * 60 * 1000).toISOString(),
        status: idx < Math.floor(responseCount / 2) ? 'accepted' : 'under-review',
        totalPrice: Math.floor(Math.random() * 100000) + 20000,
        currency: 'USD',
        scores: criteria.map(c => ({
          criterionId: c.id,
          criterionName: c.name,
          score: Math.floor(Math.random() * c.weight) + Math.floor(c.weight * 0.5),
          maxScore: c.weight,
        })),
        documents: [
          {
            id: `DOC-RES-${i}-${idx + 1}-1`,
            name: 'proposal.pdf',
            type: 'application/pdf',
          },
        ],
      }
    })
    
    rfxEvents.push({
      id: `RFX-${String(i).padStart(4, '0')}`,
      title: `${type.toUpperCase()} for ${category.name}`,
      type,
      status,
      category: category.name,
      subcategory: category.subcategories[0].name,
      description: `Request for ${type} related to ${category.name.toLowerCase()}. Suppliers must meet all requirements.`,
      budget: Math.floor(Math.random() * 200000) + 50000,
      currency: 'USD',
      publishedDate,
      closingDate,
      evaluationCriteria: criteria,
      responses,
      createdBy: 'Procurement Team',
      createdAt: new Date(Date.now() - (30 - i) * 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return rfxEvents
}

export const localRfxEvents = generateRfxEvents()

// Generated Data - Evaluations (30 items) - DEPENDS ON localSuppliers
const generateEvaluations = (): Evaluation[] => {
  const issueTypes: Array<'quality' | 'delivery' | 'communication' | 'compliance' | 'other'> = ['quality', 'delivery', 'communication', 'compliance', 'other']
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']
  const issueStatuses: Array<'open' | 'in-progress' | 'resolved'> = ['open', 'in-progress', 'resolved']
  const categories = ['IT Equipment', 'Office Supplies', 'Services', 'Software', 'Furniture']
  
  const evaluations: Evaluation[] = []
  
  for (let i = 1; i <= 30; i++) {
    const supplier = localSuppliers[i % localSuppliers.length]
    const category = categories[i % categories.length]
    const status = i % 5 === 0 ? 'in-progress' : 'completed'
    const evaluatedDate = status === 'completed' ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString() : undefined
    
    const qualityOfGoods = Math.floor(Math.random() * 20) + 80
    const onTimeDelivery = Math.floor(Math.random() * 20) + 80
    const pricing = Math.floor(Math.random() * 20) + 80
    const customerService = Math.floor(Math.random() * 20) + 80
    const compliance = Math.floor(Math.random() * 20) + 80
    
    const criteriaNames = ['Quality', 'Delivery', 'Communication', 'Cost', 'Innovation']
    const criteria = criteriaNames.map(name => ({
      name,
      score: Math.floor(Math.random() * 20) + 80,
      maxScore: 100,
      comments: `Performance in ${name.toLowerCase()} area meets expectations`,
    }))
    
    const issueCount = Math.floor(Math.random() * 4)
    const issues = Array.from({ length: issueCount }, (_, idx) => ({
      id: `ISS-${i}-${idx + 1}`,
      type: issueTypes[idx % issueTypes.length],
      severity: severities[idx % severities.length],
      title: `${issueTypes[idx % issueTypes.length].charAt(0).toUpperCase() + issueTypes[idx % issueTypes.length].slice(1)} Issue`,
      description: `${issueTypes[idx % issueTypes.length].charAt(0).toUpperCase() + issueTypes[idx % issueTypes.length].slice(1)} issue reported during Q${(i % 4) + 1}`,
      reportedDate: new Date(Date.now() - (idx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: issueStatuses[idx % issueStatuses.length],
    }))
    
    const comments = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, idx) => ({
      id: `COM-${i}-${idx + 1}`,
      text: idx === 0 ? `Overall performance evaluation for ${supplier.name}.` : 'Additional follow-up note.',
      author: `Evaluator ${idx + 1}`,
      timestamp: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000).toISOString(),
    }))
    
    const overallScore = Math.round((qualityOfGoods + onTimeDelivery + pricing + customerService + compliance) / 5)
    
    evaluations.push({
      id: `EVAL-${String(i).padStart(4, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      category,
      evaluationPeriod: `Q${(i % 4) + 1} 2024`,
      evaluatedAt: evaluatedDate || new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      evaluatedBy: `Evaluator ${i % 5 + 1}`,
      overallScore,
      qualityOfGoods,
      onTimeDelivery,
      pricing,
      customerService,
      compliance,
      status,
      criteria,
      issues,
      comments,
      evaluator: `Evaluator ${i % 5 + 1}`,
      evaluatedDate,
      createdAt: new Date(Date.now() - (i + 5) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return evaluations
}

export const localEvaluations = generateEvaluations()

// Generated Data - AI Chat History (5 conversations)
export const aiChatHistory: ChatConversation[] = [
  {
    id: 'chat-1',
    title: 'Procurement Process Help',
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'How do I create a new procurement request?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content: 'To create a new procurement request, navigate to the Procurement Requests page and click on the "New Request" button. Fill in all required fields including title, description, category, estimated value, and add items to your request. You can also attach supporting documents if needed.',
        timestamp: new Date(Date.now() - 3550000).toISOString(),
      },
      {
        id: 'msg-1-3',
        role: 'user',
        content: 'What information is required for approval?',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        content: 'For approval, you need to provide: a clear description of the need, business justification, selected category and subcategory, estimated total value, department and cost center information, and any supporting quotes or documentation. Requests over $10,000 require additional approvals.',
        timestamp: new Date(Date.now() - 3450000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3450000).toISOString(),
  },
  {
    id: 'chat-2',
    title: 'Supplier Evaluation Criteria',
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: 'What criteria are used for supplier evaluations?',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content: 'Supplier evaluations are based on five key criteria: Quality (25%), Delivery Time (20%), Technical Capability (15%), Past Performance (10%), and Price (30%). Each criterion is scored on a scale, and the overall score determines the supplier rating.',
        timestamp: new Date(Date.now() - 8630000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8630000).toISOString(),
  },
  {
    id: 'chat-3',
    title: 'Contract Renewal Process',
    messages: [
      {
        id: 'msg-3-1',
        role: 'user',
        content: 'How does the contract renewal process work?',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'msg-3-2',
        role: 'assistant',
        content: 'Contracts are flagged for renewal 30 days before expiration. The system sends notifications to contract owners and procurement team. A renewal review is conducted to assess supplier performance, pricing competitiveness, and continued business need. Renewals can be initiated from the Contracts page.',
        timestamp: new Date(Date.now() - 172750000).toISOString(),
      },
      {
        id: 'msg-3-3',
        role: 'user',
        content: 'Can I modify terms during renewal?',
        timestamp: new Date(Date.now() - 172700000).toISOString(),
      },
      {
        id: 'msg-3-4',
        role: 'assistant',
        content: 'Yes, you can modify terms during renewal. Common modifications include pricing adjustments, scope changes, updated delivery terms, or additional requirements. Significant changes may require a new contract instead of renewal.',
        timestamp: new Date(Date.now() - 172650000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172650000).toISOString(),
  },
  {
    id: 'chat-4',
    title: 'RFx Best Practices',
    messages: [
      {
        id: 'msg-4-1',
        role: 'user',
        content: 'What are some best practices for creating RFQs?',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 'msg-4-2',
        role: 'assistant',
        content: 'Best practices for RFQs include: 1) Clearly define your requirements and specifications, 2) Provide detailed quantity and quality standards, 3) Set realistic response deadlines, 4) Include evaluation criteria and weights, 5) Request total cost breakdown, 6) Specify delivery requirements, 7) Include terms and conditions.',
        timestamp: new Date(Date.now() - 259150000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259150000).toISOString(),
  },
  {
    id: 'chat-5',
    title: 'Spend Analysis Reports',
    messages: [
      {
        id: 'msg-5-1',
        role: 'user',
        content: 'How can I generate spend analysis reports?',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: 'msg-5-2',
        role: 'assistant',
        content: 'Spend analysis reports can be generated from the Reporting & Analytics page. You can filter by date range, category, supplier, or department. The system provides visual charts showing spending trends, category breakdowns, and top suppliers. Reports can be exported in PDF or Excel format.',
        timestamp: new Date(Date.now() - 345550000).toISOString(),
      },
      {
        id: 'msg-5-3',
        role: 'user',
        content: 'What metrics are included in the reports?',
        timestamp: new Date(Date.now() - 345500000).toISOString(),
      },
      {
        id: 'msg-5-4',
        role: 'assistant',
        content: 'Spend analysis reports include: total spend by period, budget vs actual comparison, spend by category, top suppliers by spend, year-over-year growth trends, average approval times, and variance analysis. These metrics help identify cost-saving opportunities and supplier performance.',
        timestamp: new Date(Date.now() - 345450000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345450000).toISOString(),
  },
]

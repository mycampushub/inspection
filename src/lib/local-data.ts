/**
 * Local Data Module
 * 
 * This module re-exports all data and types from data-store.ts
 * and provides convenience functions and additional data structures
 * used throughout the application.
 */

import { dataStore as dataStoreInstance } from "./data-store"

// Re-export dataStore
export const dataStore = dataStoreInstance

// Re-export types
export type {
  ProcurementRequest,
  ProcurementItem,
  ApprovalHistoryItem,
  Document,
  Category,
  Subcategory,
  Supplier,
  Contract,
  ContractMilestone,
  RfxEvent,
  RfxQuestion,
  RfxResponse,
  EvaluationCriterion,
  PerformanceEvaluation,
  PerformanceIssue,
} from "./data-store"

// ==================== CONVENIENCE FUNCTIONS ====================

// Get data as arrays for easy consumption
export const localProcurementRequests = () => dataStoreInstance.getProcurementRequests()
export const localCategories = () => dataStoreInstance.getCategories()
export const localCategoriesForManagement = () => dataStoreInstance.getCategories()
export const localSuppliers = () => dataStoreInstance.getSuppliers()
export const localContracts = () => dataStoreInstance.getContracts()
export const localRfxEvents = () => dataStoreInstance.getRfxEvents()
export const localPerformanceEvaluations = () => dataStoreInstance.getPerformanceEvaluations()
export const dashboardStats = () => dataStoreInstance.getDashboardStats()
export const localEvaluations = () => dataStoreInstance.getPerformanceEvaluations()

// ==================== SPEND ANALYSIS DATA ====================

export const spendAnalysisData = {
  totalSpend: 24500000,
  categories: 15,
  activeSuppliers: 248,
  avgCostPerOrder: 12500,
  spendByCategory: [
    { name: "IT Equipment", value: 4000000 },
    { name: "Office Supplies", value: 1500000 },
    { name: "Professional Services", value: 3000000 },
    { name: "Marketing", value: 2000000 },
    { name: "Facilities", value: 2500000 },
    { name: "Other", value: 3500000 },
  ],
  spendBySupplier: [
    { name: "Tech Solutions Inc.", value: 2500000 },
    { name: "Office Depot", value: 1200000 },
    { name: "Consulting Partners", value: 1800000 },
    { name: "Marketing Agency", value: 1500000 },
    { name: "Facilities Management", value: 1200000 },
    { name: "Other Suppliers", value: 2800000 },
  ],
  spendByDepartment: [
    { name: "IT", value: 5000000 },
    { name: "Marketing", value: 3000000 },
    { name: "Operations", value: 4000000 },
    { name: "HR", value: 1500000 },
    { name: "Finance", value: 2000000 },
    { name: "Other", value: 3500000 },
  ],
  spendTrend: [
    { month: "Jan", value: 1200000 },
    { month: "Feb", value: 1900000 },
    { month: "Mar", value: 1800000 },
    { month: "Apr", value: 2400000 },
    { month: "May", value: 1700000 },
    { month: "Jun", value: 2100000 },
    { month: "Jul", value: 2300000 },
    { month: "Aug", value: 2800000 },
    { month: "Sep", value: 2600000 },
    { month: "Oct", value: 2900000 },
    { month: "Nov", value: 3100000 },
    { month: "Dec", value: 3400000 },
  ],
  categoryTrend: [
    { name: "Jan", IT: 500000, Marketing: 300000, Operations: 400000, HR: 100000, Finance: 150000 },
    { name: "Feb", IT: 550000, Marketing: 320000, Operations: 420000, HR: 110000, Finance: 160000 },
    { name: "Mar", IT: 580000, Marketing: 350000, Operations: 450000, HR: 120000, Finance: 170000 },
    { name: "Apr", IT: 620000, Marketing: 380000, Operations: 480000, HR: 130000, Finance: 180000 },
    { name: "May", IT: 650000, Marketing: 400000, Operations: 500000, HR: 140000, Finance: 190000 },
    { name: "Jun", IT: 680000, Marketing: 420000, Operations: 520000, HR: 150000, Finance: 200000 },
  ],
}

// ==================== AI CHAT HISTORY ====================

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
}

export const aiChatHistory: ChatConversation[] = []

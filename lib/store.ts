import { create } from 'zustand'
import {
  ProcurementRequest,
  ProcurementItem,
  ApprovalHistoryItem,
  Attachment,
  Comment,
  Supplier,
  SupplierContract,
  PerformanceHistory,
  Contract,
  ContractDocument,
  RFxEvent,
  RFxSupplier,
  EvaluationCriterion,
  procurementRequests,
  suppliers,
  contracts,
  rfxEvents,
} from './data'

// Generate unique ID
const generateId = (prefix: string): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}-${year}-${random}`
}

interface AppState {
  // Procurement Requests
  procurementRequests: ProcurementRequest[]
  addProcurementRequest: (request: Omit<ProcurementRequest, 'id' | 'date' | 'approvalHistory' | 'attachments' | 'comments'>) => void
  updateProcurementRequest: (id: string, updates: Partial<ProcurementRequest>) => void
  deleteProcurementRequest: (id: string) => void
  approveProcurementRequest: (id: string, comment: string) => void
  rejectProcurementRequest: (id: string, comment: string) => void
  addCommentToRequest: (id: string, comment: Omit<Comment, 'id' | 'date'>) => void
  addAttachmentToRequest: (id: string, attachment: Attachment) => void

  // Suppliers
  suppliers: Supplier[]
  addSupplier: (supplier: Omit<Supplier, 'id' | 'activeContracts' | 'totalSpend' | 'performanceHistory'>) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  approveSupplier: (id: string) => void
  updateSupplierPerformance: (id: string, score: number, period: string) => void

  // Contracts
  contracts: Contract[]
  addContract: (contract: Omit<Contract, 'id' | 'daysToExpiry' | 'documents'>) => void
  updateContract: (id: string, updates: Partial<Contract>) => void
  deleteContract: (id: string) => void
  approveContract: (id: string) => void
  renewContract: (id: string, newEndDate: string) => void
  terminateContract: (id: string) => void
  addDocumentToContract: (id: string, document: ContractDocument) => void

  // RFx Events
  rfxEvents: RFxEvent[]
  addRFxEvent: (event: Omit<RFxEvent, 'id' | 'createdDate' | 'progress' | 'suppliers'>) => void
  updateRFxEvent: (id: string, updates: Partial<RFxEvent>) => void
  deleteRFxEvent: (id: string) => void
  addSupplierToRFx: (rfxId: string, supplier: RFxSupplier) => void
  updateSupplierRFxResponse: (rfxId: string, supplierId: string, score: number, responseStatus: string) => void

  // Dashboard Stats
  dashboardStats: {
    totalSpend: number
    activeContracts: number
    totalSuppliers: number
    pendingApprovals: number
  }
  updateDashboardStats: () => void

  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: Date
  }>
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Reset
  resetData: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
      // Initial State
      procurementRequests: [...procurementRequests],
      suppliers: [...suppliers],
      contracts: [...contracts],
      rfxEvents: [...rfxEvents],
      dashboardStats: {
        totalSpend: 21260445,
        activeContracts: 165,
        totalSuppliers: 248,
        pendingApprovals: 5,
      },
      notifications: [],

      // Procurement Request Actions
      addProcurementRequest: (requestData) => {
        const newRequest: ProcurementRequest = {
          ...requestData,
          id: generateId('PR'),
          date: new Date().toISOString().split('T')[0],
          approvalHistory: [
            {
              id: generateId('AH'),
              action: 'Created',
              user: requestData.requester,
              date: new Date().toISOString().split('T')[0],
              comment: 'Initial request submitted',
            },
          ],
          attachments: [],
          comments: [],
        }
        set((state) => ({
          procurementRequests: [...state.procurementRequests, newRequest],
          dashboardStats: {
            ...state.dashboardStats,
            pendingApprovals: state.dashboardStats.pendingApprovals + 1,
          },
        }))
        get().addNotification({
          type: 'success',
          title: 'Request Created',
          message: `Procurement request ${newRequest.id} has been created successfully.`,
        })
      },

      updateProcurementRequest: (id, updates) => {
        set((state) => ({
          procurementRequests: state.procurementRequests.map((req) =>
            req.id === id ? { ...req, ...updates } : req
          ),
        }))
      },

      deleteProcurementRequest: (id) => {
        set((state) => ({
          procurementRequests: state.procurementRequests.filter((req) => req.id !== id),
        }))
        get().addNotification({
          type: 'info',
          title: 'Request Deleted',
          message: `Procurement request ${id} has been deleted.`,
        })
      },

      approveProcurementRequest: (id, comment) => {
        const state = get()
        const request = state.procurementRequests.find((r) => r.id === id)
        if (request) {
          set((state) => ({
            procurementRequests: state.procurementRequests.map((req) =>
              req.id === id
                ? {
                    ...req,
                    status: 'Approved',
                    approvalHistory: [
                      ...req.approvalHistory,
                      {
                        id: generateId('AH'),
                        action: 'Approved',
                        user: 'Current User',
                        date: new Date().toISOString().split('T')[0],
                        comment,
                      },
                    ],
                  }
                : req
            ),
            dashboardStats: {
              ...state.dashboardStats,
              pendingApprovals: Math.max(0, state.dashboardStats.pendingApprovals - 1),
            },
          }))
          get().addNotification({
            type: 'success',
            title: 'Request Approved',
            message: `Procurement request ${id} has been approved.`,
          })
        }
      },

      rejectProcurementRequest: (id, comment) => {
        set((state) => ({
          procurementRequests: state.procurementRequests.map((req) =>
            req.id === id
              ? {
                  ...req,
                  status: 'Rejected',
                  approvalHistory: [
                    ...req.approvalHistory,
                    {
                      id: generateId('AH'),
                      action: 'Rejected',
                      user: 'Current User',
                      date: new Date().toISOString().split('T')[0],
                      comment,
                    },
                  ],
                }
              : req
          ),
          dashboardStats: {
            ...state.dashboardStats,
            pendingApprovals: Math.max(0, state.dashboardStats.pendingApprovals - 1),
          },
        }))
        get().addNotification({
          type: 'warning',
          title: 'Request Rejected',
          message: `Procurement request ${id} has been rejected.`,
        })
      },

      addCommentToRequest: (id, commentData) => {
        const comment: Comment = {
          ...commentData,
          id: generateId('C'),
          date: new Date().toISOString().split('T')[0],
        }
        set((state) => ({
          procurementRequests: state.procurementRequests.map((req) =>
            req.id === id ? { ...req, comments: [...req.comments, comment] } : req
          ),
        }))
      },

      addAttachmentToRequest: (id, attachment) => {
        set((state) => ({
          procurementRequests: state.procurementRequests.map((req) =>
            req.id === id ? { ...req, attachments: [...req.attachments, attachment] } : req
          ),
        }))
      },

      // Supplier Actions
      addSupplier: (supplierData) => {
        const newSupplier: Supplier = {
          ...supplierData,
          id: generateId('SUP'),
          activeContracts: 0,
          totalSpend: 0,
          performanceHistory: [],
        }
        set((state) => ({
          suppliers: [...state.suppliers, newSupplier],
          dashboardStats: {
            ...state.dashboardStats,
            totalSuppliers: state.dashboardStats.totalSuppliers + 1,
          },
        }))
        get().addNotification({
          type: 'success',
          title: 'Supplier Added',
          message: `Supplier ${newSupplier.name} has been added successfully.`,
        })
      },

      updateSupplier: (id, updates) => {
        set((state) => ({
          suppliers: state.suppliers.map((sup) => (sup.id === id ? { ...sup, ...updates } : sup)),
        }))
      },

      deleteSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((sup) => sup.id !== id),
          dashboardStats: {
            ...state.dashboardStats,
            totalSuppliers: Math.max(0, state.dashboardStats.totalSuppliers - 1),
          },
        }))
        get().addNotification({
          type: 'info',
          title: 'Supplier Deleted',
          message: `Supplier ${id} has been deleted.`,
        })
      },

      approveSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.map((sup) =>
            sup.id === id ? { ...sup, status: 'Approved' as const } : sup
          ),
        }))
        get().addNotification({
          type: 'success',
          title: 'Supplier Approved',
          message: `Supplier ${id} has been approved.`,
        })
      },

      updateSupplierPerformance: (id, score, period) => {
        set((state) => ({
          suppliers: state.suppliers.map((sup) =>
            sup.id === id
              ? {
                  ...sup,
                  performanceScore: score,
                  performanceHistory: [...sup.performanceHistory, { period, score }],
                }
              : sup
          ),
        }))
      },

      // Contract Actions
      addContract: (contractData) => {
        const newContract: Contract = {
          ...contractData,
          id: generateId('CON'),
          daysToExpiry: Math.floor(
            (new Date(contractData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
          documents: [],
        }
        set((state) => ({
          contracts: [...state.contracts, newContract],
          dashboardStats: {
            ...state.dashboardStats,
            activeContracts: state.dashboardStats.activeContracts + 1,
          },
        }))
        get().addNotification({
          type: 'success',
          title: 'Contract Created',
          message: `Contract ${newContract.id} has been created successfully.`,
        })
      },

      updateContract: (id, updates) => {
        set((state) => ({
          contracts: state.contracts.map((con) => (con.id === id ? { ...con, ...updates } : con)),
        }))
      },

      deleteContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((con) => con.id !== id),
          dashboardStats: {
            ...state.dashboardStats,
            activeContracts: Math.max(0, state.dashboardStats.activeContracts - 1),
          },
        }))
        get().addNotification({
          type: 'info',
          title: 'Contract Deleted',
          message: `Contract ${id} has been deleted.`,
        })
      },

      approveContract: (id) => {
        set((state) => ({
          contracts: state.contracts.map((con) =>
            con.id === id ? { ...con, status: 'Active' as const } : con
          ),
        }))
        get().addNotification({
          type: 'success',
          title: 'Contract Approved',
          message: `Contract ${id} has been approved and is now active.`,
        })
      },

      renewContract: (id, newEndDate) => {
        set((state) => ({
          contracts: state.contracts.map((con) =>
            con.id === id
              ? {
                  ...con,
                  endDate: newEndDate,
                  daysToExpiry: Math.floor(
                    (new Date(newEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  ),
                }
              : con
          ),
        }))
        get().addNotification({
          type: 'success',
          title: 'Contract Renewed',
          message: `Contract ${id} has been renewed until ${new Date(newEndDate).toLocaleDateString()}.`,
        })
      },

      terminateContract: (id) => {
        set((state) => ({
          contracts: state.contracts.map((con) =>
            con.id === id ? { ...con, status: 'Terminated' as const, daysToExpiry: null } : con
          ),
          dashboardStats: {
            ...state.dashboardStats,
            activeContracts: Math.max(0, state.dashboardStats.activeContracts - 1),
          },
        }))
        get().addNotification({
          type: 'warning',
          title: 'Contract Terminated',
          message: `Contract ${id} has been terminated.`,
        })
      },

      addDocumentToContract: (id, document) => {
        set((state) => ({
          contracts: state.contracts.map((con) =>
            con.id === id ? { ...con, documents: [...con.documents, document] } : con
          ),
        }))
      },

      // RFx Event Actions
      addRFxEvent: (eventData) => {
        const newEvent: RFxEvent = {
          ...eventData,
          id: generateId('RFX'),
          createdDate: new Date().toISOString().split('T')[0],
          progress: 0,
          suppliers: [],
        }
        set((state) => ({
          rfxEvents: [...state.rfxEvents, newEvent],
        }))
        get().addNotification({
          type: 'success',
          title: 'RFx Event Created',
          message: `${eventData.type} ${newEvent.id} has been created successfully.`,
        })
      },

      updateRFxEvent: (id, updates) => {
        set((state) => ({
          rfxEvents: state.rfxEvents.map((event) => (event.id === id ? { ...event, ...updates } : event)),
        }))
      },

      deleteRFxEvent: (id) => {
        set((state) => ({
          rfxEvents: state.rfxEvents.filter((event) => event.id !== id),
        }))
        get().addNotification({
          type: 'info',
          title: 'RFx Event Deleted',
          message: `RFx event ${id} has been deleted.`,
        })
      },

      addSupplierToRFx: (rfxId, supplier) => {
        set((state) => ({
          rfxEvents: state.rfxEvents.map((event) =>
            event.id === rfxId ? { ...event, suppliers: [...event.suppliers, supplier] } : event
          ),
        }))
      },

      updateSupplierRFxResponse: (rfxId, supplierId, score, responseStatus) => {
        set((state) => ({
          rfxEvents: state.rfxEvents.map((event) =>
            event.id === rfxId
              ? {
                  ...event,
                  suppliers: event.suppliers.map((sup) =>
                    sup.id === supplierId
                      ? {
                          ...sup,
                          score,
                          responseStatus,
                          responseDate: new Date().toISOString().split('T')[0],
                        }
                      : sup
                  ),
                }
              : event
          ),
        }))
      },

      // Dashboard Stats
      updateDashboardStats: () => {
        const state = get()
        const totalSpend = state.contracts.reduce((sum, con) => sum + con.value, 0)
        const activeContracts = state.contracts.filter((con) => con.status === 'Active').length
        const pendingApprovals = state.procurementRequests.filter(
          (req) => req.status === 'Pending Approval'
        ).length

        set({
          dashboardStats: {
            totalSpend,
            activeContracts,
            totalSuppliers: state.suppliers.length,
            pendingApprovals,
          },
        })
      },

      // Notifications
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: generateId('NOTIF'),
          timestamp: new Date(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 10), // Keep only last 10
        }))
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // Reset
      resetData: () => {
        set({
          procurementRequests: [...procurementRequests],
          suppliers: [...suppliers],
          contracts: [...contracts],
          rfxEvents: [...rfxEvents],
          dashboardStats: {
            totalSpend: 21260445,
            activeContracts: 165,
            totalSuppliers: 248,
            pendingApprovals: 5,
          },
          notifications: [],
        })
      },
    })
)

// Selectors
export const selectProcurementRequests = (state: AppState) => state.procurementRequests
export const selectSuppliers = (state: AppState) => state.suppliers
export const selectContracts = (state: AppState) => state.contracts
export const selectRFxEvents = (state: AppState) => state.rfxEvents
export const selectDashboardStats = (state: AppState) => state.dashboardStats
export const selectNotifications = (state: AppState) => state.notifications

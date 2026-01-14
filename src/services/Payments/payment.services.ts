import type {
  IPayment,
  IPaymentCreateRequest,
  IPaymentUpdateRequest,
  IPaymentFilter,
  IPaymentListResponse,
  IContractPaymentSummary,
  IAllContractsPaymentSummary,
} from "@/interface/payment/payments.interface"
import type { ITelevisionContract } from "@/interface/contract/contracts.interface"
import { useHttp } from "@/utils/base.Http"

// Payment Master Types
export interface IPaymentTypeMaster {
  guid: string
  name: string
  description?: string
  statusId: number
  statusName?: string
  sortOrder: number
}

export interface IPaymentCategoryMaster {
  guid: string
  name: string
  description?: string
  statusId: number
  statusName?: string
  sortOrder: number
}

export interface IPaymentModeMaster {
  guid: string
  name: string
  description?: string
  statusId: number
  statusName?: string
  sortOrder: number
}

export const paymentService = {
  // ========== Payment Master APIs ==========

  // Get all payment types
  getPaymentTypes: async (): Promise<IPaymentTypeMaster[]> => {
    const response = await useHttp().get("/payment-types")
    return response.data?.data || response.data || []
  },

  // Get all payment categories
  getPaymentCategories: async (): Promise<IPaymentCategoryMaster[]> => {
    const response = await useHttp().get("/payment-categories")
    return response.data?.data || response.data || []
  },

  // Get all payment modes
  getPaymentModes: async (): Promise<IPaymentModeMaster[]> => {
    const response = await useHttp().get("/payment-modes")
    return response.data?.data || response.data || []
  },

  // ========== Payment CRUD APIs ==========

  // Get all payments with filters
  getAllPayments: async (filter?: IPaymentFilter): Promise<IPaymentListResponse> => {
    const params = new URLSearchParams()

    if (filter?.page) params.append("Page", filter.page.toString())
    if (filter?.pageSize) params.append("PageSize", filter.pageSize.toString())
    if (filter?.search) params.append("Search", filter.search)
    if (filter?.contractId) params.append("ContractId", filter.contractId)
    if (filter?.paymentType) params.append("PaymentTypeId", filter.paymentType)
    if (filter?.status) params.append("Status", filter.status)
    if (filter?.startDate) params.append("StartDate", filter.startDate)
    if (filter?.endDate) params.append("EndDate", filter.endDate)
    if (filter?.minAmount) params.append("MinAmount", filter.minAmount.toString())
    if (filter?.maxAmount) params.append("MaxAmount", filter.maxAmount.toString())

    const queryString = params.toString()
    const url = queryString ? `/payments?${queryString}` : "/payments"

    const response = await useHttp().get(url)
    return response.data?.data || response.data || { data: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 }
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string): Promise<IPayment> => {
    const response = await useHttp().get(`/payments/${paymentId}`)
    return response.data?.data || response.data
  },

  // Get payments by contract ID
  getPaymentsByContractId: async (contractId: string): Promise<IPayment[]> => {
    const response = await useHttp().get(`/payments/by-contract/${contractId}`)
    return response.data?.data || response.data || []
  },

  // Get contract payment summary
  getContractPaymentSummary: async (contractId: string): Promise<IContractPaymentSummary> => {
    const response = await useHttp().get(`/payments/summary/${contractId}`)
    return response.data?.data || response.data
  },

  // Get all contracts payment summary (Aggregated)
  getContractWiseSummary: async (): Promise<IAllContractsPaymentSummary[]> => {
    const response = await useHttp().get("/payments/contract-wise-summary")
    return response.data?.data || response.data || []
  },

  // Generate new payment reference
  generatePaymentReference: async (): Promise<string> => {
    const response = await useHttp().get("/payments/reference")
    return response.data?.data?.paymentReference || response.data?.paymentReference || ""
  },

  // Create new payment
  createPayment: async (paymentData: IPaymentCreateRequest): Promise<IPayment> => {
    const response = await useHttp().post("/payments", paymentData)
    return response.data?.data || response.data
  },

  // Update payment
  updatePayment: async (paymentId: string, paymentData: IPaymentUpdateRequest): Promise<IPayment> => {
    const response = await useHttp().put(`/payments/${paymentId}`, paymentData)
    return response.data?.data || response.data
  },

  // Delete payment
  deletePayment: async (paymentId: string): Promise<{ message: string }> => {
    const response = await useHttp().delete(`/payments/${paymentId}`)
    return response.data
  },

  // Get contracts for payment selection
  getContractsForPayment: async (): Promise<ITelevisionContract[]> => {
    const response = await useHttp().get("/television-contract")
    return response.data?.data || response.data || []
  },
}

// Utility functions for payment operations
export const paymentUtils = {
  // Generate payment reference (fallback for offline)
  generatePaymentReference: (): string => {
    const prefix = "PAY"
    const date = new Date()
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${dateStr}-${random}`
  },

  // Calculate payment status
  calculatePaymentStatus: (totalAmount: number, paidAmount: number): string => {
    if (paidAmount === 0) return "Not Started"
    if (paidAmount < totalAmount) return "Partial"
    if (paidAmount === totalAmount) return "Completed"
    return "Overpaid"
  },

  // Format currency
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0)
  },

  // Check if payment can be edited (status !== Completed)
  canEdit: (payment: IPayment): boolean => {
    return payment.status !== "Completed"
  },

  // Get payment type icon
  getPaymentTypeIcon: (type: string): string => {
    const icons: Record<string, string> = {
      Cash: "Banknote",
      "Bank Transfer": "Building2",
      BankTransfer: "Building2",
      Check: "FileCheck",
      Online: "Globe",
      "Mobile Banking": "Smartphone",
      MobileBanking: "Smartphone",
      Other: "CreditCard",
    }
    return icons[type] || "CreditCard"
  },

  // Get status color
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      Pending: "warning",
      Completed: "success",
      Cancelled: "danger",
      Refunded: "info",
    }
    return colors[status] || "info"
  },

  // Format date
  formatDate: (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  },
}

export default paymentService

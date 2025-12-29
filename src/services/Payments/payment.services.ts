import type {
  IPayment,
  IPaymentCreateRequest,
  IPaymentUpdateRequest,
  IPaymentFilter,
  IPaymentListResponse,
  IContractPaymentSummary,
} from "@/interface/payment/payments.interface"
import type { ITelevisionContract } from "@/interface/contract/contracts.interface"
import { useHttp } from "@/utils/base.Http"

export const paymentService = {
  // Get all payments
  getAllPayments: async (filter?: IPaymentFilter): Promise<IPaymentListResponse> => {
    const params = new URLSearchParams()

    if (filter?.page) params.append("page", filter.page.toString())
    if (filter?.pageSize) params.append("pageSize", filter.pageSize.toString())
    if (filter?.search) params.append("search", filter.search)
    if (filter?.contractId) params.append("contractId", filter.contractId)
    if (filter?.paymentType) params.append("paymentType", filter.paymentType)
    if (filter?.status) params.append("status", filter.status)
    if (filter?.startDate) params.append("startDate", filter.startDate)
    if (filter?.endDate) params.append("endDate", filter.endDate)

    const queryString = params.toString()
    const url = queryString ? `/payments?${queryString}` : "/payments"

    const response = await useHttp().get(url)
    return response.data
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string): Promise<IPayment> => {
    const response = await useHttp().get(`/payments/${paymentId}`)
    return response.data
  },

  // Get payments by contract ID
  getPaymentsByContractId: async (contractId: string): Promise<IPayment[]> => {
    const response = await useHttp().get(`/payments/contract/${contractId}`)
    return response.data
  },

  // Get contract payment summary
  getContractPaymentSummary: async (contractId: string): Promise<IContractPaymentSummary> => {
    const response = await useHttp().get(`/payments/contract/${contractId}/summary`)
    return response.data
  },

  // Create new payment
  createPayment: async (
    paymentData: IPaymentCreateRequest,
  ): Promise<{
    message: string
    paymentId: string
    paymentReference: string
  }> => {
    const response = await useHttp().post("/payments", paymentData)
    return response.data
  },

  // Update payment
  updatePayment: async (
    paymentId: string,
    paymentData: IPaymentUpdateRequest,
  ): Promise<{
    message: string
    updatedAt: string
  }> => {
    const response = await useHttp().put(`/payments/${paymentId}`, paymentData)
    return response.data
  },

  // Delete payment
  deletePayment: async (paymentId: string): Promise<{ message: string }> => {
    const response = await useHttp().delete(`/payments/${paymentId}`)
    return response.data
  },

  // Cancel payment
  cancelPayment: async (paymentId: string, reason: string): Promise<{ message: string }> => {
    const response = await useHttp().patch(`/payments/${paymentId}/cancel`, { reason })
    return response.data
  },

  // Get contracts for payment selection
  getContractsForPayment: async (): Promise<ITelevisionContract[]> => {
    const response = await useHttp().get("/television-contract")
    return response.data
  },
}

// Utility functions for payment operations
export const paymentUtils = {
  // Generate payment reference
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

  // Get payment type icon
  getPaymentTypeIcon: (type: string): string => {
    const icons: Record<string, string> = {
      Cash: "Banknote",
      "Bank Transfer": "Building2",
      Check: "FileCheck",
      Online: "Globe",
      "Mobile Banking": "Smartphone",
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
}

export default paymentService

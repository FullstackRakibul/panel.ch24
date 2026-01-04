// Payment interfaces for the Television Contract Payment System

// Type aliases for reusable payment enums
export type PaymentType = "Cash" | "Bank Transfer" | "Check" | "Online" | "Mobile Banking" | "Other"
export type PaymentCategory = "Contract Amount" | "VAT Amount" | "Both"
export type PaymentMode = "Full Payment" | "Partial Payment"

export interface IPayment {
  guid: string
  contractId: string
  contractNo: string
  invoiceId?: string | null
  invoiceNo?: string | null
  paymentReference: string
  paymentDate: string
  paymentType: PaymentType
  paymentCategory: PaymentCategory
  paymentMode: PaymentMode

  // Amount details
  contractAmount: number
  vatAmount: number
  totalAmount: number
  paidAmount: number
  dueAmount: number

  // Reference details
  checkRef?: string | null
  bankRef?: string | null
  bankName?: string | null
  branchName?: string | null
  transactionId?: string | null

  // Contract & Party Info
  clientName?: string | null
  agencyName?: string | null
  contractedPartyType: "Client" | "Agency"

  // Additional info
  remarks?: string | null
  status: "Pending" | "Completed" | "Cancelled" | "Refunded"
  receivedBy?: string | null
  approvedBy?: string | null

  // Timestamps
  createdAt?: string | null
  updatedAt?: string | null
}

export interface IPaymentCreateRequest {
  contractId: string
  invoiceId?: string | null
  paymentReference?: string
  paymentDate: string
  paymentType: PaymentType
  paymentCategory: PaymentCategory
  paymentMode: PaymentMode

  contractAmountPaid: number
  vatAmountPaid: number

  checkRef?: string | null
  bankRef?: string | null
  bankName?: string | null
  branchName?: string | null
  transactionId?: string | null

  remarks?: string | null
  receivedBy?: string | null
}

export interface IPaymentUpdateRequest extends IPaymentCreateRequest {
  guid: string
}

export interface IPaymentFilter {
  page?: number
  pageSize?: number
  search?: string
  contractId?: string
  paymentType?: string
  paymentCategory?: string
  status?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

export interface IPaymentListResponse {
  data: IPayment[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface IContractPaymentSummary {
  contractId: string
  contractNo: string
  totalContractAmount: number
  totalVatAmount: number
  totalAmount: number
  totalPaidAmount: number
  totalPaidContractAmount: number
  totalPaidVatAmount: number
  totalDueAmount: number
  dueContractAmount: number
  dueVatAmount: number
  paymentStatus: "Not Started" | "Partial" | "Completed" | "Overpaid"
  payments: IPayment[]
}

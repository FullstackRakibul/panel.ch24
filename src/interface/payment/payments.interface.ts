// Payment interfaces for the Television Contract Payment System

export interface IPayment {
  guid: string
  contractId: string
  contractNo: string
  paymentReference: string
  paymentDate: string
  paymentType: "Cash" | "Bank Transfer" | "Check" | "Online" | "Mobile Banking" | "Other"
  paymentCategory: "Contract Amount" | "VAT Amount" | "Both"
  paymentMode: "Full Payment" | "Partial Payment"

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
  paymentReference?: string
  paymentDate: string
  paymentType: "Cash" | "Bank Transfer" | "Check" | "Online" | "Mobile Banking" | "Other"
  paymentCategory: "Contract Amount" | "VAT Amount" | "Both"
  paymentMode: "Full Payment" | "Partial Payment"

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

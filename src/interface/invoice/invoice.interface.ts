// ============================================
// Invoice Interfaces - Aligned with API DTOs
// Updated: Support for Multiple Products per Invoice
// ============================================

// Signaturer Interfaces
export interface IContractSignaturer {
  id: number
  guid: string
  name: string
  title: string
  designation?: string
  department?: string
  email?: string
  phone?: string
  sortOrder: number
}

export interface IInvoiceSignaturer {
  signaturerId: number
  name: string
  title: string
  sortOrder: number
}

export interface IInvoiceSignaturerRequest {
  signaturerId: number
  sortOrder: number
}

// Product Item Interfaces (Snapshot of TelevisionContractProductItem)
export interface IInvoiceProductItem {
  guid: string
  originalProductItemId?: string
  sl: number
  particularsName: string
  quantity: number
  rate: number
  amount: number
  vat: number
  vatRate: number
}

export interface IInvoiceProductItemRequest {
  originalProductItemId?: string
  sl: number
  particularsName: string
  quantity: number
  rate: number
  amount: number
  vat: number
  vatRate: number
}

// Product Interfaces (Snapshot of TelevisionContractProduct)
export interface IInvoiceProduct {
  guid: string
  originalProductId?: string
  productName: string
  productDescription?: string
  quantity: number
  vat: number
  vatRate: number
  total: number
  remarks?: string
  items?: IInvoiceProductItem[]
}

export interface IInvoiceProductRequest {
  originalProductId?: string
  productName: string
  productDescription?: string
  quantity: number
  vat: number
  vatRate: number
  total: number
  remarks?: string
  items?: IInvoiceProductItemRequest[]
}

// Biller Interface
export interface IInvoiceBiller {
  guid?: string
  name: string
  address: string
}

// Status Interface
export interface IInvoiceStatus {
  id?: number
  statusName: string
  description?: string
  module?: string
  isActive?: boolean
  sortOrder?: number
}

// Query Parameters for Filtering
export interface IInvoiceQueryRequest {
  page?: number
  pageSize?: number
  search?: string
  statusId?: number
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Request DTO for Creating/Updating Invoices
export interface IInvoiceRequest {
  number: string
  date: string
  contractNo: string
  contractDate: string
  billTo?: IInvoiceBiller
  advertiser: string
  products?: IInvoiceProductRequest[]
  signaturers?: IInvoiceSignaturerRequest[]
  spotTotal: number
  vatPercentage: number
  vatAmount: number
  grandTotal: number
  grandTotalWords: string
  footerContact: string
  statusId: number
  dueDate: string
}

// Response DTO for Invoice Data
export interface IInvoiceResponse {
  id?: number
  guid: string
  number: string
  date: string
  contractNo: string
  contractDate: string
  billTo?: IInvoiceBiller
  advertiser: string
  products?: IInvoiceProduct[]
  signaturers?: IInvoiceSignaturer[]
  spotTotal: number
  vatPercentage: number
  vatAmount: number
  grandTotal: number
  grandTotalWords: string
  footerContact: string
  status?: IInvoiceStatus
  dueDate: string
  createdAt?: string
}

// Paginated List Response
export interface IInvoiceListResponse {
  data: IInvoiceResponse[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Create Invoice Response
export interface IInvoiceCreateResponse {
  message: string
  invoiceId: string
  invoiceNumber: string
  createdAt: string
}

// Update Invoice Response
export interface IInvoiceUpdateResponse {
  message: string
  invoice: IInvoiceResponse
}

// Delete Invoice Response
export interface IInvoiceDeleteResponse {
  message: string
}

// Generate Invoice Number Response
export interface IInvoiceNextNumberResponse {
  invoiceNumber: string
}

// Generate Invoice from Contract Response
export interface IInvoiceFromContractResponse {
  message: string
  invoiceId: string
  invoiceNumber: string
  contractNo: string
  grandTotal: number
  createdAt: string
  statusCode: number
}

// ============================================
// Legacy type aliases for backward compatibility
// ============================================
export type Invoice = IInvoiceResponse
export type InvoiceItem = IInvoiceProductItem
export type InvoiceBiller = IInvoiceBiller
export type InvoiceProduct = IInvoiceProduct

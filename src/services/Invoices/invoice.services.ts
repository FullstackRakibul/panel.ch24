import type {
  IInvoiceResponse,
  IInvoiceListResponse,
  IInvoiceRequest,
  IInvoiceQueryRequest,
  IInvoiceCreateResponse,
  IInvoiceUpdateResponse,
  IInvoiceDeleteResponse,
  IInvoiceNextNumberResponse,
  IInvoiceFromContractResponse,
} from '@/interface/invoice/invoice.interface'
import { useHttp } from '@/utils/base.Http'

export const invoiceService = {
  /**
   * Get all invoices with pagination and filtering
   */
  getAllInvoices: async (query?: IInvoiceQueryRequest): Promise<IInvoiceListResponse> => {
    const params = new URLSearchParams()

    if (query?.page) params.append('page', query.page.toString())
    if (query?.pageSize) params.append('pageSize', query.pageSize.toString())
    if (query?.search) params.append('search', query.search)
    if (query?.statusId) params.append('statusId', query.statusId.toString())
    if (query?.startDate) params.append('startDate', query.startDate)
    if (query?.endDate) params.append('endDate', query.endDate)
    if (query?.sortBy) params.append('sortBy', query.sortBy)
    if (query?.sortOrder) params.append('sortOrder', query.sortOrder)

    const queryString = params.toString()
    const url = queryString ? `/invoice?${queryString}` : '/invoice'

    const response = await useHttp().get(url)
    return response.data
  },

  /**
   * Get invoice by GUID
   */
  getInvoiceById: async (id: string): Promise<IInvoiceResponse> => {
    const response = await useHttp().get(`/invoice/${id}`)
    return response.data
  },

  /**
   * Get invoice by invoice number
   */
  getInvoiceByNumber: async (invoiceNumber: string): Promise<IInvoiceResponse> => {
    const response = await useHttp().get(`/invoice/by-number/${invoiceNumber}`)
    return response.data
  },

  /**
   * Get next invoice number
   */
  getNextInvoiceNumber: async (lastContractNo: string): Promise<IInvoiceNextNumberResponse> => {
    const response = await useHttp().get(`/invoice/next-number?LastContractNo=${encodeURIComponent(lastContractNo)}`)
    return response.data
  },

  /**
   * Create a new invoice
   */
  createInvoice: async (invoiceData: IInvoiceRequest): Promise<IInvoiceCreateResponse> => {
    const response = await useHttp().post('/invoice', invoiceData)
    return response.data
  },

  /**
   * Update an existing invoice
   */
  updateInvoice: async (id: string, invoiceData: IInvoiceRequest): Promise<IInvoiceUpdateResponse> => {
    const response = await useHttp().put(`/invoice/${id}`, invoiceData)
    return response.data
  },

  /**
   * Delete an invoice (soft delete)
   */
  deleteInvoice: async (id: string): Promise<IInvoiceDeleteResponse> => {
    const response = await useHttp().delete(`/invoice/${id}`)
    return response.data
  },

  /**
   * Generate invoice from an existing contract
   */
  generateInvoiceFromContract: async (
    contractId: string,
    contractNo: string
  ): Promise<IInvoiceFromContractResponse> => {
    const response = await useHttp().post(`/invoice/from-contract/${contractId}/${contractNo}`)
    return response.data
  },
}

// Invoice utility functions
export const invoiceUtils = {
  /**
   * Calculate invoice totals from products
   */
  calculateTotals: (products: { total: number; vat: number }[], vatPercentage: number) => {
    const spotTotal = products.reduce((sum, product) => sum + product.total, 0)
    const vatAmount = products.reduce((sum, product) => sum + product.vat, 0) || spotTotal * (vatPercentage / 100)
    const grandTotal = spotTotal + vatAmount

    return {
      spotTotal,
      vatAmount,
      grandTotal,
    }
  },

  /**
   * Calculate product totals from items
   */
  calculateProductTotals: (items: { rate: number; quantity: number }[], vatRate: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.rate * item.quantity, 0)
    const vat = subtotal * (vatRate / 100)
    const total = subtotal + vat

    return {
      subtotal,
      vat,
      total,
    }
  },

  /**
   * Format currency for display (BDT)
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount)
  },

  /**
   * Convert number to words (basic implementation)
   */
  numberToWords: (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ]

    const convertLessThanOneHundred = (n: number): string => {
      if (n < 10) return ones[n]
      if (n < 20) return teens[n - 10]
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    }

    const convertLessThanOneThousand = (n: number): string => {
      if (n < 100) return convertLessThanOneHundred(n)
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanOneHundred(n % 100) : '')
    }

    if (num === 0) return 'Zero'

    let result = ''
    const crore = Math.floor(num / 10000000)
    const lac = Math.floor((num % 10000000) / 100000)
    const thousand = Math.floor((num % 100000) / 1000)
    const remainder = num % 1000

    if (crore > 0) result += convertLessThanOneThousand(crore) + ' Crore '
    if (lac > 0) result += convertLessThanOneHundred(lac) + ' Lac '
    if (thousand > 0) result += convertLessThanOneHundred(thousand) + ' Thousand '
    if (remainder > 0) result += convertLessThanOneThousand(remainder)

    return result.trim() + ' Taka Only'
  },

  /**
   * Validate invoice data before submission
   */
  validateInvoice: (
    invoice: IInvoiceRequest
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!invoice.number?.trim()) {
      errors.push('Invoice number is required')
    }

    if (!invoice.date?.trim()) {
      errors.push('Invoice date is required')
    }

    if (!invoice.contractNo?.trim()) {
      errors.push('Contract number is required')
    }

    if (!invoice.billTo?.name?.trim()) {
      errors.push('Bill To name is required')
    }

    // Validate products array
    if (!invoice.products || invoice.products.length === 0) {
      errors.push('At least one product is required')
    }

    invoice.products?.forEach((product, productIndex) => {
      if (!product.productName?.trim()) {
        errors.push(`Product ${productIndex + 1}: Product name is required`)
      }

      if (product.items && product.items.length > 0) {
        product.items.forEach((item, itemIndex) => {
          if (item.rate <= 0) {
            errors.push(`Product ${productIndex + 1}, Item ${itemIndex + 1}: Rate must be greater than 0`)
          }
          if (item.quantity <= 0) {
            errors.push(`Product ${productIndex + 1}, Item ${itemIndex + 1}: Quantity must be greater than 0`)
          }
        })
      }
    })

    if (invoice.grandTotal <= 0) {
      errors.push('Grand total must be greater than 0')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },
}

export default invoiceService

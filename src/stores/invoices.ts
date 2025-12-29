import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  IInvoiceResponse,
  IInvoiceRequest,
  IInvoiceQueryRequest,
  IInvoiceListResponse,
} from '@/interface/invoice/invoice.interface'
import { invoiceService } from '@/services/Invoices/invoice.services'

export const useInvoicesStore = defineStore('invoices', () => {
  // State
  const invoices = ref<IInvoiceResponse[]>([])
  const currentInvoice = ref<IInvoiceResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination state
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  // Filter state
  const filters = ref<IInvoiceQueryRequest>({
    page: 1,
    pageSize: 10,
    search: '',
    sortOrder: 'desc',
  })

  // Computed
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const invoiceCount = computed(() => invoices.value.length)
  const totalInvoices = computed(() => pagination.value.totalCount)

  // Actions

  /**
   * Fetch all invoices with optional filters
   */
  const fetchInvoices = async (query?: IInvoiceQueryRequest) => {
    try {
      loading.value = true
      error.value = null

      const queryParams = query || filters.value
      const response: IInvoiceListResponse = await invoiceService.getAllInvoices(queryParams)

      invoices.value = response.data
      pagination.value = {
        page: response.page,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage,
      }

      return { success: true, data: response }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invoices'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single invoice by ID
   */
  const fetchInvoiceById = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const invoice = await invoiceService.getInvoiceById(id)
      currentInvoice.value = invoice

      return { success: true, data: invoice }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invoice'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch an invoice by invoice number
   */
  const fetchInvoiceByNumber = async (invoiceNumber: string) => {
    try {
      loading.value = true
      error.value = null

      const invoice = await invoiceService.getInvoiceByNumber(invoiceNumber)
      currentInvoice.value = invoice

      return { success: true, data: invoice }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invoice'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get next invoice number
   */
  const getNextInvoiceNumber = async (lastContractNo: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await invoiceService.getNextInvoiceNumber(lastContractNo)
      return { success: true, invoiceNumber: response.invoiceNumber }
    } catch (err: any) {
      error.value = err.message || 'Failed to get next invoice number'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new invoice
   */
  const createInvoice = async (invoiceData: IInvoiceRequest) => {
    try {
      loading.value = true
      error.value = null

      const response = await invoiceService.createInvoice(invoiceData)

      // Refresh the invoices list
      await fetchInvoices()

      return {
        success: true,
        invoiceId: response.invoiceId,
        invoiceNumber: response.invoiceNumber,
        message: response.message,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create invoice'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing invoice
   */
  const updateInvoice = async (id: string, invoiceData: IInvoiceRequest) => {
    try {
      loading.value = true
      error.value = null

      const response = await invoiceService.updateInvoice(id, invoiceData)

      // Update local state
      const index = invoices.value.findIndex((i) => i.guid === id)
      if (index !== -1 && response.invoice) {
        invoices.value[index] = response.invoice
      }

      // Update current invoice if it's the one being edited
      if (currentInvoice.value?.guid === id && response.invoice) {
        currentInvoice.value = response.invoice
      }

      return { success: true, invoice: response.invoice, message: response.message }
    } catch (err: any) {
      error.value = err.message || 'Failed to update invoice'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an invoice
   */
  const deleteInvoice = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await invoiceService.deleteInvoice(id)

      // Remove from local state
      invoices.value = invoices.value.filter((i) => i.guid !== id)

      // Clear current invoice if it was deleted
      if (currentInvoice.value?.guid === id) {
        currentInvoice.value = null
      }

      return { success: true, message: response.message }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete invoice'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Generate invoice from a contract
   */
  const generateInvoiceFromContract = async (contractId: string, contractNo: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await invoiceService.generateInvoiceFromContract(contractId, contractNo)

      // Refresh the invoices list
      await fetchInvoices()

      return {
        success: true,
        invoiceId: response.invoiceId,
        invoiceNumber: response.invoiceNumber,
        contractNo: response.contractNo,
        grandTotal: response.grandTotal,
        message: response.message,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to generate invoice from contract'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update filters and fetch invoices
   */
  const setFilters = async (newFilters: Partial<IInvoiceQueryRequest>) => {
    filters.value = { ...filters.value, ...newFilters }
    return await fetchInvoices(filters.value)
  }

  /**
   * Reset filters to defaults
   */
  const resetFilters = async () => {
    filters.value = {
      page: 1,
      pageSize: 10,
      search: '',
      sortOrder: 'desc',
    }
    return await fetchInvoices(filters.value)
  }

  /**
   * Go to a specific page
   */
  const goToPage = async (page: number) => {
    filters.value.page = page
    return await fetchInvoices(filters.value)
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Clear current invoice
   */
  const clearCurrentInvoice = () => {
    currentInvoice.value = null
  }

  return {
    // State
    invoices,
    currentInvoice,
    loading,
    error,
    pagination,
    filters,

    // Computed
    isLoading,
    hasError,
    invoiceCount,
    totalInvoices,

    // Actions
    fetchInvoices,
    fetchInvoiceById,
    fetchInvoiceByNumber,
    getNextInvoiceNumber,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoiceFromContract,
    setFilters,
    resetFilters,
    goToPage,
    clearError,
    clearCurrentInvoice,
  }
})

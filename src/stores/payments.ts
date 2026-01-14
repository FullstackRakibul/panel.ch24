import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { IPayment, IPaymentCreateRequest, IPaymentUpdateRequest, IContractPaymentSummary, IPaymentFilter, IAllContractsPaymentSummary } from "@/interface/payment/payments.interface"
import type { ITelevisionContract } from "@/interface/contract/contracts.interface"
import { paymentService, paymentUtils, type IPaymentTypeMaster, type IPaymentCategoryMaster, type IPaymentModeMaster } from "@/services/Payments/payment.services"

export const usePaymentStore = defineStore("payments", () => {
  // State
  const payments = ref<IPayment[]>([])
  const contracts = ref<ITelevisionContract[]>([])
  const selectedContract = ref<ITelevisionContract | null>(null)
  const contractPaymentSummary = ref<IContractPaymentSummary | null>(null)
  const contractWiseSummaries = ref<IAllContractsPaymentSummary[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Master data
  const paymentTypes = ref<IPaymentTypeMaster[]>([])
  const paymentCategories = ref<IPaymentCategoryMaster[]>([])
  const paymentModes = ref<IPaymentModeMaster[]>([])

  // Pagination
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)

  // Current payment form
  const currentPayment = ref<IPaymentCreateRequest>({
    contractId: "",
    invoiceId: null,
    paymentReference: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentType: "Bank Transfer",
    paymentCategory: "ALL (Contract + Commission + Vat)",
    paymentMode: "Partial Payment",
    contractAmountPaid: 0,
    commissionAmountPaid: 0,
    vatAmountPaid: 0, // Added vatAmountPaid
    checkRef: "",
    bankRef: "",
    bankName: "",
    branchName: "",
    transactionId: "",
    remarks: "",
    receivedBy: "",
    guid: undefined, // Add guid for editing
  } as IPaymentCreateRequest & { guid?: string })

  // Getters
  const totalPaymentsAmount = computed(() => {
    return payments.value.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
  })

  const pendingPayments = computed(() => {
    return payments.value.filter((p) => p.status === "Pending")
  })

  const completedPayments = computed(() => {
    return payments.value.filter((p) => p.status === "Completed")
  })

  const totalPaidForContract = computed(() => {
    if (!currentPayment.value.contractId) return 0
    return payments.value
      .filter((p) => p.contractId === currentPayment.value.contractId && p.status === "Completed")
      .reduce((sum, p) => sum + (p.paidAmount || 0), 0)
  })

  // Calculate contract totals from summary (preferred) or selected contract
  const contractTotals = computed(() => {
    if (contractPaymentSummary.value) {
      return {
        contractAmount: contractPaymentSummary.value.totalContractAmount || 0,
        commissionAmount: contractPaymentSummary.value.totalCommissionAmount || 0,
        vatAmount: contractPaymentSummary.value.totalVatAmount || 0,
        totalAmount: contractPaymentSummary.value.totalAmount || 0,
        commissionRate: (selectedContract.value as any)?.commissionRate ?? 0
      }
    }

    if (!selectedContract.value) {
      return { contractAmount: 0, commissionAmount: 0, vatAmount: 0, totalAmount: 0, commissionRate: 0 }
    }

    const contract = selectedContract.value as any
    const commissionRate = contract.commissionRate ?? 0
    const commissionAmount = contract.commissionAmount ?? contract.commission ?? 0
    const totalAmount = contract.grandTotal ?? contract.total ?? 0
    
    let vatAmount = contract.vatAmount ?? 0
    if (!vatAmount && contract.products?.length) {
      vatAmount = contract.products.reduce((productSum: number, product: any) => {
        const itemsVat = (product.productItems || []).reduce((itemSum: number, item: any) => {
          return itemSum + ((item.rate || 0) * (item.vatRate || 0) / 100)
        }, 0)
        const productLevelVat = (product.productItems || []).reduce((sum: number, item: any) => sum + (item.rate || 0), 0) * ((product.vatRate || 0) / 100)
        return productSum + (itemsVat * (product.quantity || 1)) + productLevelVat + (product.vat || 0)
      }, 0)
    }
    
    const contractAmount = contract.spotTotal ?? (totalAmount - commissionAmount - vatAmount)

    return { contractAmount, commissionAmount, vatAmount, totalAmount, commissionRate }
  })

  // Due amounts
  const dueAmounts = computed(() => {
    const { contractAmount, commissionAmount, vatAmount, totalAmount } = contractTotals.value

    let paidContractAmount = 0
    let paidCommissionAmount = 0
    let paidVatAmount = 0

    if (contractPaymentSummary.value) {
      paidContractAmount = contractPaymentSummary.value.totalPaidContractAmount || 0
      paidCommissionAmount = contractPaymentSummary.value.totalPaidCommissionAmount || 0
      paidVatAmount = contractPaymentSummary.value.totalPaidVatAmount || 0
    } else {
      payments.value
        .filter((p) => p.contractId === currentPayment.value.contractId && p.status === "Completed")
        .forEach((p) => {
          paidContractAmount += p.contractAmount || 0
          paidCommissionAmount += p.commissionAmount || 0
          paidVatAmount += p.vatAmount || 0
        })
    }

    return {
      dueContractAmount: Math.max(0, contractAmount - paidContractAmount),
      dueCommissionAmount: Math.max(0, commissionAmount - paidCommissionAmount),
      dueVatAmount: Math.max(0, vatAmount - paidVatAmount),
      dueTotalAmount: Math.max(0, totalAmount - (paidContractAmount + paidCommissionAmount + paidVatAmount)),
      paidContractAmount,
      paidCommissionAmount,
      paidVatAmount,
      paidTotalAmount: paidContractAmount + paidCommissionAmount + paidVatAmount,
    }
  })

  // Actions

  // Fetch payment master data
  const fetchPaymentMasters = async () => {
    try {
      const [types, categories, modes] = await Promise.all([
        paymentService.getPaymentTypes(),
        paymentService.getPaymentCategories(),
        paymentService.getPaymentModes(),
      ])
      paymentTypes.value = types
      paymentCategories.value = categories
      paymentModes.value = modes
    } catch (err) {
      console.warn("Failed to fetch payment masters:", err)
    }
  }

  // Fetch payments with filters
  const fetchPayments = async (filter?: IPaymentFilter) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await paymentService.getAllPayments(filter)
      payments.value = response.data || []
      totalCount.value = response.totalCount || 0
      currentPage.value = response.page || 1
      pageSize.value = response.pageSize || 10
      totalPages.value = response.totalPages || 0
    } catch (err: unknown) {
      console.warn("Failed to fetch payments:", err)
      payments.value = []
      error.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch contracts for payment selection
  const fetchContracts = async () => {
    isLoading.value = true
    try {
      const response = await paymentService.getContractsForPayment()
      contracts.value = response || []
    } catch (err: unknown) {
      console.warn("Failed to fetch contracts:", err)
      contracts.value = []
      error.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch contract-wise payment summaries
  const fetchContractWiseSummaries = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await paymentService.getContractWiseSummary()
      contractWiseSummaries.value = response || []
    } catch (err: unknown) {
      console.warn("Failed to fetch contract-wise summaries:", err)
      contractWiseSummaries.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Fetch payments by contract
  const fetchPaymentsByContract = async (contractId: string) => {
    isLoading.value = true
    try {
      const contractPayments = await paymentService.getPaymentsByContractId(contractId)
      payments.value = payments.value.filter((p) => p.contractId !== contractId).concat(contractPayments)
    } catch (err: unknown) {
      console.warn("Failed to fetch contract payments:", err)
    } finally {
      isLoading.value = false
    }
  }

  // Select contract
  const selectContract = async (contractId: string) => {
    const contract = contracts.value.find((c) => c.guid === contractId)
    selectedContract.value = contract || null
    currentPayment.value.contractId = contractId

    if (contractId) {
      isLoading.value = true
      try {
        const summary = await paymentService.getContractPaymentSummary(contractId)
        contractPaymentSummary.value = summary
        
        // Also update local payments list if not already there
        if (summary.payments) {
           payments.value = summary.payments
        }
      } catch (err) {
        console.warn("Failed to fetch contract summary:", err)
      } finally {
        isLoading.value = false
      }
    }

    if (contract) {
      updatePaymentAmounts()
    }
  }

  // Update payment amounts based on mode/category
  const updatePaymentAmounts = () => {
    const { dueContractAmount, dueCommissionAmount, dueVatAmount } = dueAmounts.value
    const { paymentCategory, paymentMode } = currentPayment.value

    if (paymentMode === "Full Payment") {
      if (paymentCategory === "Contract Amount Only") {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.commissionAmountPaid = 0
        currentPayment.value.vatAmountPaid = 0
      } else if (paymentCategory === "Commission Amount Only") {
        currentPayment.value.contractAmountPaid = 0
        currentPayment.value.commissionAmountPaid = Math.max(0, dueCommissionAmount)
        currentPayment.value.vatAmountPaid = 0
      } else if (paymentCategory === "Vat Amount Only") {
        currentPayment.value.contractAmountPaid = 0
        currentPayment.value.commissionAmountPaid = 0
        currentPayment.value.vatAmountPaid = Math.max(0, dueVatAmount)
      } else if (paymentCategory === "Both (Contract + Commission)") {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.commissionAmountPaid = Math.max(0, dueCommissionAmount)
        currentPayment.value.vatAmountPaid = 0
      } else if (paymentCategory === "Both (Contract + Vat)") {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.commissionAmountPaid = 0
        currentPayment.value.vatAmountPaid = Math.max(0, dueVatAmount)
      } else if (paymentCategory === "Both (Vat + Commission)") {
        currentPayment.value.contractAmountPaid = 0
        currentPayment.value.commissionAmountPaid = Math.max(0, dueCommissionAmount)
        currentPayment.value.vatAmountPaid = Math.max(0, dueVatAmount)
      } else if (paymentCategory === "ALL (Contract + Commission + Vat)") {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.commissionAmountPaid = Math.max(0, dueCommissionAmount)
        currentPayment.value.vatAmountPaid = Math.max(0, dueVatAmount)
      }
    } else { // Partial Payment - reset full payment amounts
      // Keep current values or reset to 0 based on desired behavior for partial
      // For now, let's ensure they are not automatically set to full due amounts
      // if paymentMode is not "Full Payment"
      // currentPayment.value.contractAmountPaid = 0;
      // currentPayment.value.commissionAmountPaid = 0;
      // currentPayment.value.vatAmountPaid = 0;
    }
  }

  // Generate payment reference from API
  const generatePaymentReference = async () => {
    try {
      const ref = await paymentService.generatePaymentReference()
      currentPayment.value.paymentReference = ref || paymentUtils.generatePaymentReference()
    } catch {
      currentPayment.value.paymentReference = paymentUtils.generatePaymentReference()
    }
  }

  // Create payment
  const createPayment = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      // Prepare the request data
      const requestData: IPaymentCreateRequest = {
        contractId: currentPayment.value.contractId,
        invoiceId: currentPayment.value.invoiceId,
        paymentReference: currentPayment.value.paymentReference || await paymentService.generatePaymentReference(),
        paymentDate: currentPayment.value.paymentDate,
        paymentType: currentPayment.value.paymentType,
        paymentCategory: currentPayment.value.paymentCategory,
        paymentMode: currentPayment.value.paymentMode,
        contractAmountPaid: currentPayment.value.contractAmountPaid,
        commissionAmountPaid: currentPayment.value.commissionAmountPaid || 0,
        vatAmountPaid: currentPayment.value.vatAmountPaid,
        checkRef: currentPayment.value.checkRef,
        bankRef: currentPayment.value.bankRef,
        bankName: currentPayment.value.bankName,
        branchName: currentPayment.value.branchName,
        transactionId: currentPayment.value.transactionId,
        remarks: currentPayment.value.remarks,
        receivedBy: currentPayment.value.receivedBy,
      }

      const newPayment = await paymentService.createPayment(requestData)
      
      if (newPayment) {
        await fetchPayments()
        resetPaymentForm()
        return true
      }
      return false
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create payment"
      error.value = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update payment
  const updatePayment = async (paymentId: string, data: IPaymentUpdateRequest): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await paymentService.updatePayment(paymentId, data)
      if (updated) {
        await fetchPayments()
        return true
      }
      return false
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update payment"
      error.value = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Delete payment
  const deletePayment = async (paymentId: string): Promise<boolean> => {
    isLoading.value = true
    try {
      await paymentService.deletePayment(paymentId)
      payments.value = payments.value.filter((p) => p.guid !== paymentId)
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete payment"
      error.value = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Reset payment form
  const resetPaymentForm = () => {
    currentPayment.value = {
      contractId: "",
      invoiceId: null,
      paymentReference: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentType: "Bank Transfer",
      paymentCategory: "ALL (Contract + Commission + Vat)",
      paymentMode: "Partial Payment",
      contractAmountPaid: 0,
      commissionAmountPaid: 0,
      vatAmountPaid: 0,
      checkRef: "",
      bankRef: "",
      bankName: "",
      branchName: "",
      remarks: "",
      receivedBy: "",
      guid: undefined,
    } as any
    selectedContract.value = null
    contractPaymentSummary.value = null
    error.value = null
  }

  // Set current payment for editing
  const setCurrentPayment = (payment: IPayment) => {
    currentPayment.value = {
      contractId: payment.contractId,
      invoiceId: payment.invoiceId || null,
      paymentReference: payment.paymentReference,
      paymentDate: payment.paymentDate.split("T")[0],
      paymentType: payment.paymentType,
      paymentCategory: payment.paymentCategory,
      paymentMode: payment.paymentMode,
      contractAmountPaid: payment.contractAmount || 0,
      commissionAmountPaid: payment.commissionAmount || 0,
      vatAmountPaid: payment.vatAmount || 0,
      checkRef: payment.checkRef || "",
      bankRef: payment.bankRef || "",
      bankName: payment.bankName || "",
      branchName: payment.branchName || "",
      transactionId: payment.transactionId || "",
      remarks: payment.remarks || "",
      receivedBy: payment.receivedBy || "",
      guid: payment.guid,
    } as any
    
    // Set selected contract and load summary
    const contract = contracts.value.find(c => c.guid === payment.contractId)
    selectedContract.value = contract || null
    
    if (payment.contractId) {
      paymentService.getContractPaymentSummary(payment.contractId).then(summary => {
        contractPaymentSummary.value = summary
      }).catch(err => {
        console.warn("Failed to fetch summary for edit:", err)
      })
    }
  }
  // Set payment field
  const setPaymentField = <K extends keyof IPaymentCreateRequest>(field: K, value: IPaymentCreateRequest[K]) => {
    currentPayment.value[field] = value

    if (field === "paymentCategory" || field === "paymentMode") {
      updatePaymentAmounts()
    }
  }

  // Check if payment can be edited
  const canEditPayment = (payment: IPayment): boolean => {
    return paymentUtils.canEdit(payment)
  }

  return {
    // State
    payments,
    contracts,
    selectedContract,
    contractPaymentSummary,
    contractWiseSummaries,
    currentPayment,
    isLoading,
    error,
    paymentTypes,
    paymentCategories,
    paymentModes,
    totalCount,
    currentPage,
    pageSize,
    totalPages,

    // Getters
    totalPaymentsAmount,
    pendingPayments,
    completedPayments,
    totalPaidForContract,
    contractTotals,
    dueAmounts,

    // Actions
    fetchPaymentMasters,
    fetchPayments,
    fetchContracts,
    fetchContractWiseSummaries,
    fetchPaymentsByContract,
    selectContract,
    updatePaymentAmounts,
    generatePaymentReference,
    createPayment,
    updatePayment,
    deletePayment,
    resetPaymentForm,
    setCurrentPayment,
    setPaymentField,
    canEditPayment,
  }
})

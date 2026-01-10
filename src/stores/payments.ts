import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { IPayment, IPaymentCreateRequest, IPaymentUpdateRequest, IContractPaymentSummary, IPaymentFilter } from "@/interface/payment/payments.interface"
import type { ITelevisionContract } from "@/interface/contract/contracts.interface"
import { paymentService, paymentUtils, type IPaymentTypeMaster, type IPaymentCategoryMaster, type IPaymentModeMaster } from "@/services/Payments/payment.services"

export const usePaymentStore = defineStore("payments", () => {
  // State
  const payments = ref<IPayment[]>([])
  const contracts = ref<ITelevisionContract[]>([])
  const selectedContract = ref<ITelevisionContract | null>(null)
  const contractPaymentSummary = ref<IContractPaymentSummary | null>(null)
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
    paymentCategory: "Both",
    paymentMode: "Partial Payment",
    contractAmountPaid: 0,
    commissionAmountPaid: 0,
    checkRef: "",
    bankRef: "",
    bankName: "",
    branchName: "",
    transactionId: "",
    remarks: "",
    receivedBy: "",
  })

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

  // Calculate contract totals from selected contract
  const contractTotals = computed(() => {
    if (!selectedContract.value) {
      return { contractAmount: 0, commissionAmount: 0, totalAmount: 0, commissionRate: 15 }
    }

    const contractAmount = selectedContract.value.total || 0
    const commissionRate = selectedContract.value.commissionRate || 0
    const commissionAmount = selectedContract.value.commission || 0
    const totalAmount = contractAmount + commissionAmount

    return { contractAmount, commissionAmount, totalAmount, commissionRate }
  })

  // Due amounts
  const dueAmounts = computed(() => {
    const { contractAmount, commissionAmount, totalAmount } = contractTotals.value

    let paidContractAmount = 0
    let paidCommissionAmount = 0

    payments.value
      .filter((p) => p.contractId === currentPayment.value.contractId && p.status === "Completed")
      .forEach((p) => {
        paidContractAmount += p.contractAmount || 0
        paidCommissionAmount += p.commissionAmount || 0
      })

    return {
      dueContractAmount: Math.max(0, contractAmount - paidContractAmount),
      dueCommissionAmount: Math.max(0, commissionAmount - paidCommissionAmount),
      dueTotalAmount: Math.max(0, totalAmount - (paidContractAmount + paidCommissionAmount)),
      paidContractAmount,
      paidCommissionAmount,
      paidTotalAmount: paidContractAmount + paidCommissionAmount,
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
  const selectContract = (contractId: string) => {
    const contract = contracts.value.find((c) => c.guid === contractId)
    selectedContract.value = contract || null
    currentPayment.value.contractId = contractId

    if (contract) {
      updatePaymentAmounts()
    }
  }

  // Update payment amounts based on mode/category
  const updatePaymentAmounts = () => {
    const { dueContractAmount, dueCommissionAmount } = dueAmounts.value
    const { paymentCategory, paymentMode } = currentPayment.value

    if (paymentMode === "Full Payment") {
      if (paymentCategory === "Contract Amount") {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.commissionAmountPaid = 0
      } else if (paymentCategory === "Commission Amount") {
        currentPayment.value.contractAmountPaid = 0
        currentPayment.value.commissionAmountPaid = Math.max(0, dueCommissionAmount)
      } else {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.commissionAmountPaid = Math.max(0, dueCommissionAmount)
      }
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
      paymentCategory: "Both",
      paymentMode: "Partial Payment",
      contractAmountPaid: 0,
      commissionAmountPaid: 0,
      checkRef: "",
      bankRef: "",
      bankName: "",
      branchName: "",
      transactionId: "",
      remarks: "",
      receivedBy: "",
    }
    selectedContract.value = null
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
    fetchPaymentsByContract,
    selectContract,
    updatePaymentAmounts,
    generatePaymentReference,
    createPayment,
    updatePayment,
    deletePayment,
    resetPaymentForm,
    setPaymentField,
    canEditPayment,
  }
})

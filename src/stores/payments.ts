import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { IPayment, IPaymentCreateRequest, IContractPaymentSummary } from "@/interface/payment/payments.interface"
import type { ITelevisionContract } from "@/interface/contract/contracts.interface"
import { paymentService, paymentUtils } from "@/services/Payments/payment.services"

export const usePaymentStore = defineStore("payments", () => {
  // State
  const payments = ref<IPayment[]>([])
  const contracts = ref<ITelevisionContract[]>([])
  const selectedContract = ref<ITelevisionContract | null>(null)
  const contractPaymentSummary = ref<IContractPaymentSummary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Current payment form
  const currentPayment = ref<IPaymentCreateRequest>({
    contractId: "",
    paymentReference: paymentUtils.generatePaymentReference(),
    paymentDate: new Date().toISOString().split("T")[0],
    paymentType: "Bank Transfer",
    paymentCategory: "Both",
    paymentMode: "Partial Payment",
    contractAmountPaid: 0,
    vatAmountPaid: 0,
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
      return { contractAmount: 0, vatAmount: 0, totalAmount: 0, vatRate: 15 }
    }

    const products = selectedContract.value.products || []
    let contractAmount = 0

    products.forEach((product) => {
      const items = product.productItems || []
      items.forEach((item) => {
        contractAmount += item.rate || 0
      })
      contractAmount *= product.quantity || 1
    })

    if (contractAmount === 0 && selectedContract.value.total) {
      const vatRate = selectedContract.value.vatRate || 0
      //const totalWithVat = selectedContract.value.total
      contractAmount = selectedContract.value.total // (1 + vatRate / 100)
    }

    const vatRate = selectedContract.value.vatRate || 0
    const vatAmount = (selectedContract.value.vat || 0)
    const totalAmount = (selectedContract.value.total || 0) - vatAmount

    return { contractAmount, vatAmount, totalAmount, vatRate }
  })

  // Due amounts
  const dueAmounts = computed(() => {
    const { contractAmount, vatAmount, totalAmount } = contractTotals.value

    let paidContractAmount = 0
    let paidVatAmount = 0

    payments.value
      .filter((p) => p.contractId === currentPayment.value.contractId && p.status === "Completed")
      .forEach((p) => {
        paidContractAmount += p.contractAmount || 0
        paidVatAmount += p.vatAmount || 0
      })

    return {
      dueContractAmount: Math.max(0, contractAmount - paidContractAmount),
      dueVatAmount: Math.max(0, vatAmount - paidVatAmount),
      dueTotalAmount: Math.max(0, totalAmount - (paidContractAmount + paidVatAmount)),
      paidContractAmount,
      paidVatAmount,
      paidTotalAmount: paidContractAmount + paidVatAmount,
    }
  })

  // Actions
  const fetchPayments = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await paymentService.getAllPayments()
      payments.value = response.data || (response as unknown as IPayment[]) || []
    } catch (err: unknown) {
      console.warn("Failed to fetch payments, using empty array:", err)
      payments.value = []
      error.value = null // Don't show error for missing API
    } finally {
      isLoading.value = false
    }
  }

  const fetchContracts = async () => {
    isLoading.value = true
    try {
      const response = await paymentService.getContractsForPayment()
      contracts.value = response || []
    } catch (err: unknown) {
      console.warn("Failed to fetch contracts, using empty array:", err)
      contracts.value = []
      error.value = null
    } finally {
      isLoading.value = false
    }
  }

  const fetchPaymentsByContract = async (contractId: string) => {
    isLoading.value = true
    try {
      const contractPayments = await paymentService.getPaymentsByContractId(contractId)
      // Update only payments for this contract
      payments.value = payments.value.filter((p) => p.contractId !== contractId).concat(contractPayments)
    } catch (err: unknown) {
      console.warn("Failed to fetch contract payments:", err)
    } finally {
      isLoading.value = false
    }
  }

  const selectContract = (contractId: string) => {
    const contract = contracts.value.find((c) => c.guid === contractId)
    selectedContract.value = contract || null
    currentPayment.value.contractId = contractId

    // Auto-fill remaining amounts based on payment mode
    if (contract) {
      updatePaymentAmounts()
    }
  }

  const updatePaymentAmounts = () => {
    const { dueContractAmount, dueVatAmount } = dueAmounts.value
    const { paymentCategory, paymentMode } = currentPayment.value

    if (paymentMode === "Full Payment") {
      if (paymentCategory === "Contract Amount") {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.vatAmountPaid = 0
      } else if (paymentCategory === "VAT Amount") {
        currentPayment.value.contractAmountPaid = 0
        currentPayment.value.vatAmountPaid = Math.max(0, dueVatAmount)
      } else {
        currentPayment.value.contractAmountPaid = Math.max(0, dueContractAmount)
        currentPayment.value.vatAmountPaid = Math.max(0, dueVatAmount)
      }
    }
  }

  const createPayment = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const newPayment: IPayment = {
        guid: crypto.randomUUID(),
        contractId: currentPayment.value.contractId,
        contractNo: selectedContract.value?.televisionContractNo || "",
        paymentReference: currentPayment.value.paymentReference || paymentUtils.generatePaymentReference(),
        paymentDate: currentPayment.value.paymentDate,
        paymentType: currentPayment.value.paymentType,
        paymentCategory: currentPayment.value.paymentCategory,
        paymentMode: currentPayment.value.paymentMode,
        contractAmount: currentPayment.value.contractAmountPaid,
        vatAmount: currentPayment.value.vatAmountPaid,
        totalAmount: contractTotals.value.totalAmount,
        paidAmount: currentPayment.value.contractAmountPaid + currentPayment.value.vatAmountPaid,
        dueAmount:
          dueAmounts.value.dueTotalAmount -
          (currentPayment.value.contractAmountPaid + currentPayment.value.vatAmountPaid),
        checkRef: currentPayment.value.checkRef,
        bankRef: currentPayment.value.bankRef,
        bankName: currentPayment.value.bankName,
        branchName: currentPayment.value.branchName,
        transactionId: currentPayment.value.transactionId,
        clientName: selectedContract.value?.contractedClient?.clintName || null,
        agencyName: selectedContract.value?.contractedAgency?.agencyName || null,
        contractedPartyType: selectedContract.value?.contractedClient ? "Client" : "Agency",
        remarks: currentPayment.value.remarks,
        status: "Completed",
        receivedBy: currentPayment.value.receivedBy,
        createdAt: new Date().toISOString(),
      }

      try {
        await paymentService.createPayment(currentPayment.value)
        await fetchPayments()
      } catch {
        // If API fails, add locally
        payments.value.push(newPayment)
      }

      resetPaymentForm()
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create payment"
      error.value = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deletePayment = async (paymentId: string): Promise<boolean> => {
    isLoading.value = true
    try {
      try {
        await paymentService.deletePayment(paymentId)
      } catch {
        // If API fails, delete locally
      }
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

  const resetPaymentForm = () => {
    currentPayment.value = {
      contractId: "",
      paymentReference: paymentUtils.generatePaymentReference(),
      paymentDate: new Date().toISOString().split("T")[0],
      paymentType: "Bank Transfer",
      paymentCategory: "Both",
      paymentMode: "Partial Payment",
      contractAmountPaid: 0,
      vatAmountPaid: 0,
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

  const setPaymentField = <K extends keyof IPaymentCreateRequest>(field: K, value: IPaymentCreateRequest[K]) => {
    currentPayment.value[field] = value

    // Auto-update amounts when category or mode changes
    if (field === "paymentCategory" || field === "paymentMode") {
      updatePaymentAmounts()
    }
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

    // Getters
    totalPaymentsAmount,
    pendingPayments,
    completedPayments,
    totalPaidForContract,
    contractTotals,
    dueAmounts,

    // Actions
    fetchPayments,
    fetchContracts,
    fetchPaymentsByContract,
    selectContract,
    updatePaymentAmounts,
    createPayment,
    deletePayment,
    resetPaymentForm,
    setPaymentField,
  }
})

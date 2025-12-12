import { ref } from "vue"
import { defineStore } from "pinia"

export interface ContractModalData {
  televisionContractNo: string
  contractDate: string
  contractStartDate: string
  contractEndDate: string
  contractedClientId: string | null
  contractedAgencyId: string | null
  advertiserName: string
  productName: string
  particulars: string
  quantity: number
  rate: number
  amount: number
  spotTotal: number
  vatAmount: number
  grandTotal: number
  inWords: string
  remarks: string
}

export const useContractModalStore = defineStore("contractModal", () => {
  const isContractModalOpen = ref(false)
  const isEditMode = ref(false)
  const editingContractId = ref<string | null>(null)

  const defaultContractData: ContractModalData = {
    televisionContractNo: "",
    contractDate: "",
    contractStartDate: "",
    contractEndDate: "",
    contractedClientId: null,
    contractedAgencyId: null,
    advertiserName: "",
    productName: "",
    particulars: "",
    quantity: 1,
    rate: 0,
    amount: 0,
    spotTotal: 0,
    vatAmount: 0,
    grandTotal: 0,
    inWords: "",
    remarks: "",
  }

  const contractModalData = ref<ContractModalData>({ ...defaultContractData })
  const hasContractModalData = ref(false)

  // Save to localStorage
  const saveToLocalStorage = () => {
    if (!isEditMode.value) {
      localStorage.setItem("contractModalDraft", JSON.stringify(contractModalData.value))
      hasContractModalData.value = true
    }
  }

  // Load from localStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("contractModalDraft")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        contractModalData.value = { ...defaultContractData, ...data }
        hasContractModalData.value = true
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }

  // Clear localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem("contractModalDraft")
    hasContractModalData.value = false
  }

  // Set contract modal data
  const setContractModalData = (data: Partial<ContractModalData>) => {
    contractModalData.value = { ...contractModalData.value, ...data }
  }

  // Reset to default
  const resetContractModalData = () => {
    contractModalData.value = { ...defaultContractData }
    isEditMode.value = false
    editingContractId.value = null
  }

  // Open modal
  const openModal = () => {
    isContractModalOpen.value = true
    loadFromLocalStorage()
  }

  // Close modal
  const closeModal = () => {
    isContractModalOpen.value = false
  }

  return {
    isContractModalOpen,
    isEditMode,
    editingContractId,
    contractModalData,
    hasContractModalData,
    setContractModalData,
    resetContractModalData,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    openModal,
    closeModal,
  }
})

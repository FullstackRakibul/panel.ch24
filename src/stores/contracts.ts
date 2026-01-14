import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TelevisionContractProductItemsRequestDto {
  guid: string
  particularsName: string
  rate: number
  remarks: string
  vat: number
  vatRate: number
}

export interface TelevisionContractProductRequestDto {
  contractProductName: string
  contractProductDescription: string
  quantity: number
  vat: number
  vatRate: number
  total: number
  remarks: string
  productItems: TelevisionContractProductItemsRequestDto[]
}

export interface TelevisionContractTransmissionScheduleDto {
  guid: string
  onAirDescriptionId: string | null
  dateValue: string
  durationInMinute: number
  remarks: string
}

export interface TelevisionContractOnAirDescriptionDto {
  guid: string
  onAirDuration: string
  descriptionType: string
  descriptionText: string
  descriptionTypeName: string
  descriptionTypeDescription: string
  remarks: string
  createdAt: string
  statusId: number
  isDeleted: boolean
  transmissionSchedule: TelevisionContractTransmissionScheduleDto[]
}

export interface TelevisionContractRequestDto {
  guid: string
  televisionContractNo: string
  contractDate: string
  contractStartDate: string
  contractEndDate: string
  contractedClientId: string | null
  contractedAgencyId: string | null
  commission: number
  commissionRate: number
  total: number
  remarks: string
  products: TelevisionContractProductRequestDto[]
  onAirDescriptions: TelevisionContractOnAirDescriptionDto[]
}

export const useContractStore = defineStore('contract', () => {
  // State
  const currentContract = ref<TelevisionContractRequestDto>(getDefaultContract())
  const draftContracts = ref<TelevisionContractRequestDto[]>([])
  const isClientCopy = ref(true)
  const isAgencyCopy = ref(false)
  const isLoading = ref(false)
  const isEditMode = ref(false)

  // Getters
  const hasDraft = computed(() => draftContracts.value.length > 0)
  const currentDraft = computed(() => draftContracts.value[draftContracts.value.length - 1])
  const netProductsTotal = computed(() => {
    return currentContract.value.products.reduce((sum, product) => {
      return sum + calculateProductNet(product)
    }, 0)
  })

  const vatTotal = computed(() => {
    return currentContract.value.products.reduce((sum, product) => {
      return sum + calculateProductVat(product)
    }, 0)
  })

  // vatTotal =  (netProductsTotal.value * (currentContract.value.products[0].vatRate || 0 / 100));
  // total item vat account
  const itemsTotalValue = computed(() => {
    return netProductsTotal.value + vatTotal.value
  })

  const commissionAmount = computed(() => {
    return netProductsTotal.value * (currentContract.value.commissionRate / 100)
  })

  const grandTotal = computed(() => {
    return itemsTotalValue.value + commissionAmount.value
  })

  // Actions
  const initializeContract = () => {
    currentContract.value = getDefaultContract()
    loadFromLocalStorage()
  }

  const setContract = (contract: TelevisionContractRequestDto) => {
    currentContract.value = { ...contract }
    saveToLocalStorage()
  }

  const updateContractField = <K extends keyof TelevisionContractRequestDto>(
    field: K,
    value: TelevisionContractRequestDto[K]
  ) => {
    currentContract.value[field] = value
    saveToLocalStorage()
  }

  const toggleClientCopy = (value: boolean) => {
    isClientCopy.value = value
    saveToLocalStorage()
  }

  const toggleAgencyCopy = (value: boolean) => {
    isAgencyCopy.value = value
    saveToLocalStorage()
  }



  // Product Management
  const addProduct = () => {
    currentContract.value.products.push({
      contractProductName: '',
      contractProductDescription: '',
      quantity: 1,
      vat: 0,
      vatRate: 0,
      total: 0,
      remarks: '',
      productItems: [
        {
          guid: '',
          particularsName: '',
          rate: 0,
          remarks: '',
          vat: 0,
          vatRate: 0
        }
      ]
    })
    saveToLocalStorage()
  }

  const removeProduct = (index: number) => {
    currentContract.value.products.splice(index, 1)
    saveToLocalStorage()
  }

  const updateProduct = (productIndex: number, updates: Partial<TelevisionContractProductRequestDto>) => {
    currentContract.value.products[productIndex] = {
      ...currentContract.value.products[productIndex],
      ...updates
    }
    saveToLocalStorage()
  }

  // Product Items Management
  const addProductItem = (productIndex: number) => {
    currentContract.value.products[productIndex].productItems.push({
      guid: '',
      particularsName: '',
      rate: 0,
      remarks: '',
      vat: 0,
      vatRate: 0
    })
    saveToLocalStorage()
  }

  const removeProductItem = (productIndex: number, itemIndex: number) => {
    currentContract.value.products[productIndex].productItems.splice(itemIndex, 1)
    saveToLocalStorage()
  }

  const updateProductItem = (
    productIndex: number,
    itemIndex: number,
    updates: Partial<TelevisionContractProductItemsRequestDto>
  ) => {
    currentContract.value.products[productIndex].productItems[itemIndex] = {
      ...currentContract.value.products[productIndex].productItems[itemIndex],
      ...updates
    }
    saveToLocalStorage()
  }

  // On Air Descriptions Management
  const addOnAirDescription = () => {
    currentContract.value.onAirDescriptions.push({
      guid: '',
      onAirDuration: '',
      descriptionType: '',
      descriptionText: '',
      descriptionTypeName: '',
      descriptionTypeDescription: '',
      remarks: '',
      createdAt: new Date().toISOString(),
      statusId: 1,
      isDeleted: false,
      transmissionSchedule: []
    })
    saveToLocalStorage()
  }

  const removeOnAirDescription = (index: number) => {
    currentContract.value.onAirDescriptions.splice(index, 1)
    saveToLocalStorage()
  }

  const updateOnAirDescription = (index: number, updates: Partial<TelevisionContractOnAirDescriptionDto>) => {
    currentContract.value.onAirDescriptions[index] = {
      ...currentContract.value.onAirDescriptions[index],
      ...updates
    }
    saveToLocalStorage()
  }

  const addTransmissionSchedule = (descIndex: number) => {
    if (!currentContract.value.onAirDescriptions[descIndex].transmissionSchedule) {
      currentContract.value.onAirDescriptions[descIndex].transmissionSchedule = []
    }
    currentContract.value.onAirDescriptions[descIndex].transmissionSchedule.push({
      guid: '',
      onAirDescriptionId: currentContract.value.onAirDescriptions[descIndex].guid,
      dateValue: '',
      durationInMinute: 0,
      remarks: ''
    })
    saveToLocalStorage()
  }

  const removeTransmissionSchedule = (descIndex: number, scheduleIndex: number) => {
    if (currentContract.value.onAirDescriptions[descIndex]?.transmissionSchedule) {
      currentContract.value.onAirDescriptions[descIndex].transmissionSchedule.splice(scheduleIndex, 1)
      saveToLocalStorage()
    }
  }

  const updateTransmissionSchedule = (
    descIndex: number,
    scheduleIndex: number,
    updates: Partial<TelevisionContractTransmissionScheduleDto>
  ) => {
    if (currentContract.value.onAirDescriptions[descIndex]?.transmissionSchedule?.[scheduleIndex]) {
      currentContract.value.onAirDescriptions[descIndex].transmissionSchedule[scheduleIndex] = {
        ...currentContract.value.onAirDescriptions[descIndex].transmissionSchedule[scheduleIndex],
        ...updates
      }
      saveToLocalStorage()
    }
  }

  // Draft Management
  const saveDraft = () => {
    draftContracts.value.push({ ...currentContract.value })
    localStorage.setItem('contractDrafts', JSON.stringify(draftContracts.value))
  }

  const loadDraft = (index: number) => {
    if (draftContracts.value[index]) {
      currentContract.value = { ...draftContracts.value[index] }
      saveToLocalStorage()
    }
  }

  const clearDraft = (index?: number) => {
    if (index !== undefined) {
      draftContracts.value.splice(index, 1)
    } else {
      draftContracts.value = []
    }
    localStorage.setItem('contractDrafts', JSON.stringify(draftContracts.value))
  }

  // Local Storage Management
  const saveToLocalStorage = () => {
    // Don't save to localStorage when editing an existing contract
    if (isEditMode.value) return
    
    const storageData = {
      currentContract: currentContract.value,
      isClientCopy: isClientCopy.value,
      isAgencyCopy: isAgencyCopy.value,
      lastSaved: new Date().toISOString()
    }
    localStorage.setItem('contractFormData', JSON.stringify(storageData))
  }

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('contractFormData')
      if (stored) {
        const data = JSON.parse(stored)
        currentContract.value = data.currentContract || getDefaultContract()
        isClientCopy.value = data.isClientCopy !== undefined ? data.isClientCopy : true
        isAgencyCopy.value = data.isAgencyCopy !== undefined ? data.isAgencyCopy : false
        
        // Load drafts
        const storedDrafts = localStorage.getItem('contractDrafts')
        if (storedDrafts) {
          draftContracts.value = JSON.parse(storedDrafts)
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      clearLocalStorage()
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('contractFormData')
    localStorage.removeItem('contractDrafts')
    currentContract.value = getDefaultContract()
    draftContracts.value = []
    isClientCopy.value = true
    isAgencyCopy.value = false
  }

  const autoSave = () => {
    // Only auto-save for new contracts, not when editing
    if (!isEditMode.value) {
      saveToLocalStorage()
    }
  }

  const setEditMode = (mode: boolean) => {
    isEditMode.value = mode
  }

  // Utility functions
  const calculateItemTotal = (item: TelevisionContractProductItemsRequestDto) => {
    return item.rate + (item.rate * item.vatRate / 100) || 0
  }

  const calculateItemVat = (item: TelevisionContractProductItemsRequestDto) => {
    return item.rate * item.vatRate / 100 || 0
  }

  const calculateProductTotal = (product: TelevisionContractProductRequestDto) => {
    const itemsTotal = (product.productItems as any[]).reduce((sum: number, item: any) => {
      return sum + calculateItemTotal(item)
    }, 0)
    
    const quantity = product.quantity || 1
    return itemsTotal * quantity
  }

  const calculateProductNet = (product: TelevisionContractProductRequestDto) => {
    const itemsNet = product.productItems.reduce((sum, item) => {
      return sum + (item.rate || 0)
    }, 0)
    return itemsNet * (product.quantity || 1)
  }

  const calculateProductVat = (product: TelevisionContractProductRequestDto) => {
    // Calculate VAT from individual product items
    const itemsVat = product.productItems.reduce((sum, item) => {
      return sum + ((item.rate || 0) * (item.vatRate || 0) / 100)
    }, 0)


    const itemsTotal = product.productItems.reduce((sum, item) => {
      return sum + (item.rate || 0)
    }, 0)
    
    // Calculate the net product total (without VAT)
    // AI - Please don't remove this line
    //const productNet = calculateProductNet(product)
    
    // Calculate product-level VAT (applied to the entire product net amount)
    const productLevelVat = itemsTotal * ((product.vatRate || 0) / 100)
    
    // Total VAT = (item-level VAT * quantity) + product-level VAT + any fixed VAT amount
    return (itemsVat * (product.quantity || 1)) + productLevelVat + (product.vat || 0)
  }



  function getDefaultContract(): TelevisionContractRequestDto {
    return {
      guid: '',
      televisionContractNo: '',
      contractDate: '',
      contractStartDate: '',
      contractEndDate: '',
      contractedClientId: null,
      contractedAgencyId: null,
      commission: 0,
      commissionRate: 0,
      total: 0,
      remarks: '',
      products: [
        {
          contractProductName: '',
          contractProductDescription: '',
          quantity: 1,
          vat: 0,
          vatRate: 0,
          total: 0,
          remarks: '',
          productItems: [
            {
              guid: '',
              particularsName: '',
              rate: 0,
              remarks: '',
              vat: 0,
              vatRate: 0
            }
          ]
        }
      ],
      onAirDescriptions: [
        {
          guid: '',
          onAirDuration: '',
          descriptionType: '',
          descriptionText: '',
          descriptionTypeName: '',
          descriptionTypeDescription: '',
          remarks: '',
          createdAt: new Date().toISOString(),
          statusId: 1,
          isDeleted: false,
          transmissionSchedule: []
        }
      ]
    }
  }

  // Initialize store
  initializeContract()

  return {
    // State
    currentContract,
    draftContracts,
    isClientCopy,
    isAgencyCopy,
    isLoading,
    isEditMode,
    
    // Getters
    hasDraft,
    currentDraft,
    productsTotal: netProductsTotal,
    netProductsTotal,
    vatTotal,
    itemsTotalValue,
    commissionAmount,
    grandTotal,

    // Actions
    initializeContract,
    setContract,
    updateContractField,
    toggleClientCopy,
    toggleAgencyCopy,
    addProduct,
    removeProduct,
    updateProduct,
    addProductItem,
    removeProductItem,
    updateProductItem,
    addOnAirDescription,
    removeOnAirDescription,
    updateOnAirDescription,
    addTransmissionSchedule,
    removeTransmissionSchedule,
    updateTransmissionSchedule,
    saveDraft,
    loadDraft,
    clearDraft,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    autoSave,
    setEditMode,
    calculateItemTotal,
    calculateItemVat,
    calculateProductTotal
  }
})

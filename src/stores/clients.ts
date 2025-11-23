// stores/modal.store.ts
import type { IClientCreateRequest } from '@/interface/clients/clients.interface'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // Client Modal Data
  const clientModalData = ref<IClientCreateRequest>({
    clintName: '',
    email: '',
    phone: '',
    mobile: '',
    city: '',
    location: '',
    country: '',
    cTypeId: '',
    agencyId: null,
    taxId: '',
    tollFreeNumber: '',
    portfolioURL: '',
    companyRegistrationDate: '',
    companyLogo: '',
    remarks: ''
  })

  // Modal State
  const isClientModalOpen = ref(false)
  const isEditMode = ref(false)
  const editingClientId = ref<string | null>(null)

  // Getters
  const hasClientModalData = computed(() => {
    return Object.values(clientModalData.value).some(value => 
      value !== null && value !== undefined && value !== ''
    )
  })

  // Actions
  const setClientModalData = (data: Partial<IClientCreateRequest>) => {
    clientModalData.value = { ...clientModalData.value, ...data }
  }

  const resetClientModalData = () => {
    clientModalData.value = {
      clintName: '',
      email: '',
      phone: '',
      mobile: '',
      city: '',
      location: '',
      country: '',
      cTypeId: '',
      agencyId: '',
      taxId: '',
      tollFreeNumber: '',
      portfolioURL: '',
      companyRegistrationDate: '',
      companyLogo: '',
      remarks: ''
    }
    editingClientId.value = null
    isEditMode.value = false
  }

  const openClientModal = (client?: IClientCreateRequest & { guid?: string }, editMode: boolean = false) => {
    if (client) {
      setClientModalData(client)
      if (editMode && client.guid) {
        editingClientId.value = client.guid
        isEditMode.value = true
      }
    } else {
      resetClientModalData()
    }
    isClientModalOpen.value = true
  }

  const closeClientModal = (resetData: boolean = false) => {
    isClientModalOpen.value = false
    if (resetData) {
      // Reset data only if explicitly requested
      resetClientModalData()
    }
  }

  const saveClientModalData = (data: IClientCreateRequest) => {
    setClientModalData(data)
  }

  // Auto-save to localStorage for persistence across page reloads
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clientModalData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          clientModalData.value = { ...clientModalData.value, ...parsed }
        } catch (error) {
          console.warn('Failed to load modal data from localStorage:', error)
        }
      }
    }
  }

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined' && hasClientModalData.value) {
      localStorage.setItem('clientModalData', JSON.stringify(clientModalData.value))
    }
  }

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientModalData')
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    // State
    clientModalData,
    isClientModalOpen,
    isEditMode,
    editingClientId,

    // Getters
    hasClientModalData,

    // Actions
    loadFromLocalStorage,
    setClientModalData,
    resetClientModalData,
    openClientModal,
    closeClientModal,
    saveClientModalData,
    saveToLocalStorage,
    clearLocalStorage
  }
})
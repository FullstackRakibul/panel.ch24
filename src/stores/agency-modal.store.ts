import type { ICreateAgency, IUpdateAgency } from '@/interface/agency/agencies.interface'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgencyModalStore = defineStore('agencyModal', () => {
  // Agency Modal Data
  const agencyModalData = ref<ICreateAgency>({
    agencyName: '',
    tagline: '',
    location: '',
    slogan: '',
    logo: '',
    email: '',
    phone: '',
    portfolioURL: '',
    companySize: undefined,
    rating: '',
    reviewCount: '',
    budget: ''
  })

  // Modal State
  const isAgencyModalOpen = ref(false)
  const isEditMode = ref(false)
  const editingAgencyId = ref<string | null>(null)

  // Getters
  const hasAgencyModalData = computed(() => {
    return Object.values(agencyModalData.value).some(value => 
      value !== null && value !== undefined && value !== ''
    )
  })

  // Actions
  const setAgencyModalData = (data: Partial<ICreateAgency>) => {
    agencyModalData.value = { ...agencyModalData.value, ...data }
  }

  const resetAgencyModalData = () => {
    agencyModalData.value = {
      agencyName: '',
      tagline: '',
      location: '',
      slogan: '',
      logo: '',
      email: '',
      phone: '',
      portfolioURL: '',
      companySize: undefined,
      rating: '',
      reviewCount: '',
      budget: ''
    }
    editingAgencyId.value = null
    isEditMode.value = false
  }

  const openAgencyModal = (agency?: any, editMode: boolean = false) => {
    if (agency && editMode) {
      // Edit mode - populate form with agency data
      setAgencyModalData({
        agencyName: agency.agencyName || '',
        tagline: agency.tagline || '',
        location: agency.location || '',
        slogan: agency.slogan || '',
        logo: agency.logo || '',
        email: agency.email || '',
        phone: agency.phone || '',
        portfolioURL: agency.portfolioURL || '',
        companySize: agency.companySize,
        rating: agency.rating || '',
        reviewCount: agency.reviewCount || '',
        budget: agency.budget || ''
      })
      editingAgencyId.value = agency.guid
      isEditMode.value = true
    } else {
      // Add mode - reset form or load from localStorage
      resetAgencyModalData()
      loadFromLocalStorage()
    }
    isAgencyModalOpen.value = true
  }

  const closeAgencyModal = () => {
    isAgencyModalOpen.value = false
  }

  // Auto-save to localStorage for persistence across page reloads
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agencyModalData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          agencyModalData.value = { ...agencyModalData.value, ...parsed }
        } catch (error) {
          console.warn('Failed to load modal data from localStorage:', error)
        }
      }
    }
  }

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined' && hasAgencyModalData.value) {
      localStorage.setItem('agencyModalData', JSON.stringify(agencyModalData.value))
    }
  }

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agencyModalData')
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    // State
    agencyModalData,
    isAgencyModalOpen,
    isEditMode,
    editingAgencyId,

    // Getters
    hasAgencyModalData,

    // Actions
    loadFromLocalStorage,
    setAgencyModalData,
    resetAgencyModalData,
    openAgencyModal,
    closeAgencyModal,
    saveToLocalStorage,
    clearLocalStorage
  }
})
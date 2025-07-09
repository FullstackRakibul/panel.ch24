import { ref } from "vue"
import { defineStore } from "pinia"

export interface ContractItem {
  sl: number
  particulars: string
  quantity: number
  rate: number
  amount: number
}

export interface Contract {
  id?: number
  contractNo: string
  contractDate: string
  clientCopy: boolean
  startDate: string
  endDate: string
  advertiser: string
  product: string
  items: ContractItem[]
  spotTotal: number
  vatPercentage: number
  vatAmount: number
  grandTotal: number
  grandTotalWords: string
  duration: string
  onAirDescription: string
  brandingPackage: string
  schedule: {
    month: string
    dates: string
    description: string
  }
  terms: string
  preparedBy: string
  checkedBy: string
  authorizedBy: string
  status: "draft" | "active" | "completed" | "cancelled"
  createdAt?: string
}

export const useContractsStore = defineStore("contracts", () => {
  const contracts = ref<Contract[]>([
    {
      id: 1,
      contractNo: "TML2506039",
      contractDate: "31 May, 2025",
      clientCopy: true,
      startDate: "01 Jun, 2025",
      endDate: "30 Jun, 2025",
      advertiser: "Mercantile Bank PLC",
      product: "Mercantile Bank PLC",
      items: [
        {
          sl: 1,
          particulars: 'Mercantile Bank PLC "Business24"',
          quantity: 1,
          rate: 300000.0,
          amount: 300000.0,
        },
      ],
      spotTotal: 300000.0,
      vatPercentage: 15,
      vatAmount: 45000.0,
      grandTotal: 345000.0,
      grandTotalWords: "Three Lac Forty Five Thousand Taka Only",
      duration: "June 2025",
      onAirDescription: "Branding Package",
      brandingPackage:
        "Mercantile Bank PLC 'Business24' Title Sting With Sponsor Logo Presenter Endorsement & Backdrop Doggy During the News 30 Sec L Shape",
      schedule: {
        month: "1 Month",
        dates: "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30",
        description: "Business24 Branding Package",
      },
      terms:
        "I/We request CHANNEL24 LIMITED to transmit the above mention Spot. I/We agree to abide by the tariff rate and to the terms and conditions over leaf and indemnify CHANNEL24 LIMITED against all legal action by reason of the transmission of any advertisement material.",
      preparedBy: "Md.Kamrul Islam",
      checkedBy: "Authorized Person",
      authorizedBy: "Management",
      status: "active",
      createdAt: "2025-05-31T10:30:00Z",
    },
  ])

  const loading = ref(false)

  const createContract = async (contractData: Contract) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newContract: Contract = {
        ...contractData,
        id: Math.max(...contracts.value.map((c) => c.id || 0)) + 1,
        createdAt: new Date().toISOString(),
      }

      contracts.value.unshift(newContract)
      return { success: true, contract: newContract }
    } catch (error: any) {
      return { success: false, message: "Failed to create contract" }
    } finally {
      loading.value = false
    }
  }

  const updateContract = async (id: number, contractData: Contract) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 800))

      const index = contracts.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        contracts.value[index] = { ...contractData, id }
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, message: "Failed to update contract" }
    } finally {
      loading.value = false
    }
  }

  const deleteContract = async (id: number) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 500))

      contracts.value = contracts.value.filter((c) => c.id !== id)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: "Failed to delete contract" }
    } finally {
      loading.value = false
    }
  }

  return {
    contracts,
    loading,
    createContract,
    updateContract,
    deleteContract,
  }
})

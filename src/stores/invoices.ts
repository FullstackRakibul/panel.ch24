import { ref } from "vue"
import { defineStore } from "pinia"

export interface InvoiceItem {
  sl: number
  particulars: string
  quantity: number
  rate: number
  amount: number
}

export interface InvoiceBiller {
  name: string
  address: string
}

export interface Invoice {
  id?: number
  number: string
  date: string
  contractNo: string
  contractDate: string
  billTo: InvoiceBiller
  advertiser: string
  product: string
  items: InvoiceItem[]
  spotTotal: number
  vatPercentage: number
  vatAmount: number
  grandTotal: number
  grandTotalWords: string
  signature1Name: string
  signature1Title: string
  signature2Name: string
  signature2Title: string
  footerContact: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: string
  createdAt?: string
}

export const useInvoicesStore = defineStore("invoices", () => {
  const invoices = ref<Invoice[]>([
    {
      id: 1,
      number: "TML2506039",
      date: "01 Jul, 2025",
      contractNo: "TML2506039",
      contractDate: "31 May, 2025",
      billTo: {
        name: "Mercantile Bank PLC",
        address: "61,Dilkusha,Commercial Area\nDhaka-1000",
      },
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
      signature1Name: "Rashed Ahasan",
      signature1Title: "Head of Marketing",
      signature2Name: "M. M. Elias",
      signature2Title: "DGM, Finance & Accounts",
      footerContact:
        "Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 | www.channel24bd.tv",
      status: "sent",
      dueDate: "31 Jul, 2025",
      createdAt: "2025-07-01T10:30:00Z",
    },
    {
      id: 2,
      number: "TML2506040",
      date: "15 Jul, 2025",
      contractNo: "TML2506040",
      contractDate: "10 Jun, 2025",
      billTo: {
        name: "ABC Corporation Ltd",
        address: "123 Business Street\nDhaka-1215",
      },
      advertiser: "ABC Corporation Ltd",
      product: "ABC Products",
      items: [
        {
          sl: 1,
          particulars: 'ABC Corporation "Prime Time"',
          quantity: 2,
          rate: 150000.0,
          amount: 300000.0,
        },
      ],
      spotTotal: 300000.0,
      vatPercentage: 15,
      vatAmount: 45000.0,
      grandTotal: 345000.0,
      grandTotalWords: "Three Lac Forty Five Thousand Taka Only",
      signature1Name: "Rashed Ahasan",
      signature1Title: "Head of Marketing",
      signature2Name: "M. M. Elias",
      signature2Title: "DGM, Finance & Accounts",
      footerContact:
        "Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 | www.channel24bd.tv",
      status: "paid",
      dueDate: "15 Aug, 2025",
      createdAt: "2025-07-15T14:20:00Z",
    },
  ])

  const loading = ref(false)

  const createInvoice = async (invoiceData: Invoice) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newInvoice: Invoice = {
        ...invoiceData,
        id: Math.max(...invoices.value.map((i) => i.id || 0)) + 1,
        createdAt: new Date().toISOString(),
      }

      invoices.value.unshift(newInvoice)
      return { success: true, invoice: newInvoice }
    } catch (error: any) {
      return { success: false, message: "Failed to create invoice" }
    } finally {
      loading.value = false
    }
  }

  const updateInvoice = async (id: number, invoiceData: Invoice) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 800))

      const index = invoices.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        invoices.value[index] = { ...invoiceData, id }
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, message: "Failed to update invoice" }
    } finally {
      loading.value = false
    }
  }

  const deleteInvoice = async (id: number) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 500))

      invoices.value = invoices.value.filter((i) => i.id !== id)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: "Failed to delete invoice" }
    } finally {
      loading.value = false
    }
  }

  const updateInvoiceStatus = async (id: number, status: Invoice["status"]) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 300))

      const index = invoices.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        invoices.value[index].status = status
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, message: "Failed to update status" }
    } finally {
      loading.value = false
    }
  }

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
  }
})

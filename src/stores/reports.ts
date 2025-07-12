import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { Invoice } from "./invoices"

export interface AgeingReportItem {
  id: number
  invoiceNo: string
  date: string
  partyName: string
  contractNo: string
  vatChalanNo: string
  amount: number
  withVAT: number
  agencyCommission: number
  salesAmount: number
  withoutVAT: number
  grossSales: number
  receivedAgainstInvoiceNo: string
  bankPayment: number
  cashPayment: number
  vdsCertificate: number
  tdsCertificate: number
  totalCollection: number
  openingBalance: number
  daysOverdue: number
  ageCategory: "0-30" | "31-60" | "61-90" | "90+" | "Current"
  status: "paid" | "overdue" | "current"
}

export interface PartyLedgerItem {
  id: number
  serialNo: number
  month: string
  contractNo: string
  contractAmount: number
  plus15VAT: number
  minus15VAT: number
  plus5Percent: number
  minus5Percent: number
  netTotal: number
  paymentDate: string
  mrNo: string
  chequeNo: string
  bankName: string
  paymentAmount: number
  balance: number
  status: "paid" | "pending" | "partial"
}

export interface CommercialScheduleItem {
  id: number
  programName: string
  timeSlot: string
  adType: "Paid" | "Branding"
  agencyName: string
  spotCount: number
  duration: number
  advertisement: string
  category: string
  remarks: string
  date: string
}

export interface ReportFilters {
  dateFrom: string
  dateTo: string
  partyName: string
  status: string
  ageCategory: string
}

export type ReportType = "ageing" | "ledger" | "schedule"
export type ExportFormat = "excel" | "pdf"

export const useReportsStore = defineStore("reports", () => {
  const loading = ref(false)
  const ageingReportData = ref<AgeingReportItem[]>([
    {
      id: 1,
      invoiceNo: "TML2506039",
      date: "01 Jul, 2025",
      partyName: "Mercantile Bank PLC",
      contractNo: "TML2506039",
      vatChalanNo: "VAT001",
      amount: 300000.0,
      withVAT: 345000.0,
      agencyCommission: 15000.0,
      salesAmount: 285000.0,
      withoutVAT: 300000.0,
      grossSales: 300000.0,
      receivedAgainstInvoiceNo: "TML2506039",
      bankPayment: 200000.0,
      cashPayment: 0,
      vdsCertificate: 3000.0,
      tdsCertificate: 2000.0,
      totalCollection: 205000.0,
      openingBalance: 140000.0,
      daysOverdue: 45,
      ageCategory: "31-60",
      status: "overdue",
    },
    {
      id: 2,
      invoiceNo: "TML2506040",
      date: "15 Jul, 2025",
      partyName: "ABC Corporation Ltd",
      contractNo: "TML2506040",
      vatChalanNo: "VAT002",
      amount: 300000.0,
      withVAT: 345000.0,
      agencyCommission: 15000.0,
      salesAmount: 285000.0,
      withoutVAT: 300000.0,
      grossSales: 300000.0,
      receivedAgainstInvoiceNo: "TML2506040",
      bankPayment: 345000.0,
      cashPayment: 0,
      vdsCertificate: 0,
      tdsCertificate: 0,
      totalCollection: 345000.0,
      openingBalance: 0,
      daysOverdue: 0,
      ageCategory: "Current",
      status: "paid",
    },
  ])

  const partyLedgerData = ref<PartyLedgerItem[]>([
    {
      id: 1,
      serialNo: 1,
      month: "June 2025",
      contractNo: "TML2506039",
      contractAmount: 300000.0,
      plus15VAT: 45000.0,
      minus15VAT: 0,
      plus5Percent: 0,
      minus5Percent: 15000.0,
      netTotal: 330000.0,
      paymentDate: "15 Jul, 2025",
      mrNo: "MR001",
      chequeNo: "CHQ001",
      bankName: "City Bank",
      paymentAmount: 200000.0,
      balance: 130000.0,
      status: "partial",
    },
  ])

  const commercialScheduleData = ref<CommercialScheduleItem[]>([
    {
      id: 1,
      programName: "Business24",
      timeSlot: "08:00-08:30",
      adType: "Paid",
      agencyName: "Mercantile Bank PLC",
      spotCount: 5,
      duration: 30,
      advertisement: "Mercantile Bank Business Package",
      category: "Banking",
      remarks: "Title Sting With Sponsor Logo",
      date: "04 Jul, 2025",
    },
  ])

  const reportFilters = ref<ReportFilters>({
    dateFrom: "",
    dateTo: "",
    partyName: "",
    status: "",
    ageCategory: "",
  })

  // Computed properties for summary data
  const ageingSummary = computed(() => {
    const current = ageingReportData.value.filter((item) => item.ageCategory === "Current")
    const days0to30 = ageingReportData.value.filter((item) => item.ageCategory === "0-30")
    const days31to60 = ageingReportData.value.filter((item) => item.ageCategory === "31-60")
    const days61to90 = ageingReportData.value.filter((item) => item.ageCategory === "61-90")
    const days90plus = ageingReportData.value.filter((item) => item.ageCategory === "90+")

    return {
      current: {
        count: current.length,
        amount: current.reduce((sum, item) => sum + item.withVAT, 0),
      },
      days0to30: {
        count: days0to30.length,
        amount: days0to30.reduce((sum, item) => sum + item.withVAT, 0),
      },
      days31to60: {
        count: days31to60.length,
        amount: days31to60.reduce((sum, item) => sum + item.withVAT, 0),
      },
      days61to90: {
        count: days61to90.length,
        amount: days61to90.reduce((sum, item) => sum + item.withVAT, 0),
      },
      days90plus: {
        count: days90plus.length,
        amount: days90plus.reduce((sum, item) => sum + item.withVAT, 0),
      },
      total: {
        count: ageingReportData.value.length,
        amount: ageingReportData.value.reduce((sum, item) => sum + item.withVAT, 0),
      },
    }
  })

  const filteredAgeingReport = computed(() => {
    let filtered = ageingReportData.value

    if (reportFilters.value.partyName) {
      filtered = filtered.filter((item) =>
        item.partyName.toLowerCase().includes(reportFilters.value.partyName.toLowerCase()),
      )
    }

    if (reportFilters.value.status) {
      filtered = filtered.filter((item) => item.status === reportFilters.value.status)
    }

    if (reportFilters.value.ageCategory) {
      filtered = filtered.filter((item) => item.ageCategory === reportFilters.value.ageCategory)
    }

    return filtered
  })

  // Actions
  const generateAgeingReport = async (invoices: Invoice[]) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const reportItems: AgeingReportItem[] = invoices.map((invoice, index) => {
        const invoiceDate = new Date(invoice.date)
        const today = new Date()
        const daysOverdue = Math.floor((today.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24))

        let ageCategory: AgeingReportItem["ageCategory"] = "Current"
        let status: AgeingReportItem["status"] = "current"

        if (daysOverdue > 90) {
          ageCategory = "90+"
          status = "overdue"
        } else if (daysOverdue > 60) {
          ageCategory = "61-90"
          status = "overdue"
        } else if (daysOverdue > 30) {
          ageCategory = "31-60"
          status = "overdue"
        } else if (daysOverdue > 0) {
          ageCategory = "0-30"
          status = "overdue"
        }

        if (invoice.status === "paid") {
          status = "paid"
        }

        return {
          id: index + 1,
          invoiceNo: invoice.number,
          date: invoice.date,
          partyName: invoice.billTo.name,
          contractNo: invoice.contractNo,
          vatChalanNo: `VAT${String(index + 1).padStart(3, "0")}`,
          amount: invoice.spotTotal,
          withVAT: invoice.grandTotal,
          agencyCommission: invoice.spotTotal * 0.05,
          salesAmount: invoice.spotTotal * 0.95,
          withoutVAT: invoice.spotTotal,
          grossSales: invoice.spotTotal,
          receivedAgainstInvoiceNo: invoice.number,
          bankPayment: status === "paid" ? invoice.grandTotal : Math.random() * invoice.grandTotal,
          cashPayment: 0,
          vdsCertificate: invoice.spotTotal * 0.01,
          tdsCertificate: invoice.spotTotal * 0.006,
          totalCollection: status === "paid" ? invoice.grandTotal : Math.random() * invoice.grandTotal,
          openingBalance: Math.random() * 100000,
          daysOverdue,
          ageCategory,
          status,
        }
      })

      ageingReportData.value = reportItems
      return { success: true }
    } catch (error) {
      return { success: false, message: "Failed to generate ageing report" }
    } finally {
      loading.value = false
    }
  }

  const exportReport = async (reportType: ReportType, format: ExportFormat) => {
    try {
      loading.value = true
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate export functionality
      const filename = `${reportType}_report_${new Date().toISOString().split("T")[0]}.${format}`
      console.log(`Exporting ${filename}...`)

      return { success: true, filename }
    } catch (error) {
      return { success: false, message: "Failed to export report" }
    } finally {
      loading.value = false
    }
  }

  const updateFilters = (filters: Partial<ReportFilters>) => {
    reportFilters.value = { ...reportFilters.value, ...filters }
  }

  const clearFilters = () => {
    reportFilters.value = {
      dateFrom: "",
      dateTo: "",
      partyName: "",
      status: "",
      ageCategory: "",
    }
  }

  return {
    loading,
    ageingReportData,
    partyLedgerData,
    commercialScheduleData,
    reportFilters,
    ageingSummary,
    filteredAgeingReport,
    generateAgeingReport,
    exportReport,
    updateFilters,
    clearFilters,
  }
})

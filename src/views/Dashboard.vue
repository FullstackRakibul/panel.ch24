<template>
  <div class="dashboard-container">
    <!-- Breadcrumb & Header -->
    <div class="dashboard-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item">Home</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Dashboard</span>
      </div>
      <div class="header-row">
        <div class="header-content">
          <h1 class="page-title">Financial Command Center</h1>
          <p class="company-tagline">Times Media Limited | Channel 24</p>
        </div>
        <div class="header-actions">
          <el-button :icon="RefreshCw" :loading="loading" @click="refreshAllData">
            Refresh
          </el-button>
          <el-select v-model="selectedPeriod" size="default" class="period-select" @change="refreshAllData">
            <el-option label="Today" value="today" />
            <el-option label="This Week" value="week" />
            <el-option label="This Month" value="month" />
            <el-option label="This Year" value="year" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid" v-loading="loading">

      <!-- ===== SECTION 1: Financial Pulse (Top Row) ===== -->
      <section class="pulse-section">
        <h2 class="section-title">Financial Pulse</h2>
        <div class="pulse-grid">
          <!-- Total Sales (Gross) -->
          <div class="pulse-card">
            <div class="pulse-icon sales">
              <TrendingUp :size="20" />
            </div>
            <div class="pulse-data">
              <span class="pulse-label">Total Sales (Gross)</span>
              <span class="pulse-value">৳{{ formatCurrency(metrics.totalGrossSales) }}</span>
              <span class="pulse-count">{{ metrics.totalContractsCount }} contracts</span>
            </div>
          </div>

          <!-- Net Sales -->
          <div class="pulse-card">
            <div class="pulse-icon net">
              <DollarSign :size="20" />
            </div>
            <div class="pulse-data">
              <span class="pulse-label">Net Sales</span>
              <span class="pulse-value">৳{{ formatCurrency(metrics.netSales) }}</span>
              <span class="pulse-count">After VAT & discounts</span>
            </div>
          </div>

          <!-- Total Payments Received -->
          <div class="pulse-card">
            <div class="pulse-icon received">
              <Banknote :size="20" />
            </div>
            <div class="pulse-data">
              <span class="pulse-label">Payments Received</span>
              <span class="pulse-value text-success">৳{{ formatCurrency(metrics.totalPaidAmount) }}</span>
              <span class="pulse-count">{{ metrics.paymentsCount }} transactions</span>
            </div>
          </div>

          <!-- Outstanding Due -->
          <div class="pulse-card">
            <div class="pulse-icon due">
              <AlertCircle :size="20" />
            </div>
            <div class="pulse-data">
              <span class="pulse-label">Outstanding Due</span>
              <span class="pulse-value text-danger">৳{{ formatCurrency(metrics.totalDueAmount) }}</span>
              <span class="pulse-count">{{ metrics.pendingContractsCount }} pending</span>
            </div>
          </div>

          <!-- Today's Collections -->
          <div class="pulse-card today">
            <div class="pulse-icon today-icon">
              <Calendar :size="20" />
            </div>
            <div class="pulse-data">
              <span class="pulse-label">Today's Collections</span>
              <span class="pulse-value">৳{{ formatCurrency(metrics.todayCollections) }}</span>
              <span class="pulse-count">{{ metrics.todayPaymentsCount }} payments today</span>
            </div>
          </div>

          <!-- Today's Invoices -->
          <div class="pulse-card today">
            <div class="pulse-icon invoice-icon">
              <FileText :size="20" />
            </div>
            <div class="pulse-data">
              <span class="pulse-label">Today's New Invoices</span>
              <span class="pulse-value">{{ metrics.todayInvoicesCount }}</span>
              <span class="pulse-count">৳{{ formatCurrency(metrics.todayInvoicesValue) }} value</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SECTION 2: Contract & Billing Management ===== -->
      <section class="management-section">
        <div class="management-grid">
          <!-- Contract Overview -->
          <div class="management-card">
            <h3 class="card-title">
              <Briefcase :size="18" />
              Contract Overview
            </h3>
            <div class="management-stats">
              <div class="stat-item">
                <span class="stat-label">Active Contracts</span>
                <span class="stat-value text-success">{{ contractStats.activeContracts }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Pending Renewals</span>
                <span class="stat-value text-warning">{{ contractStats.pendingRenewals }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Expired Contracts</span>
                <span class="stat-value text-muted">{{ contractStats.expiredContracts }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Draft Contracts</span>
                <span class="stat-value text-info">{{ contractStats.draftContracts }}</span>
              </div>
            </div>
          </div>

          <!-- Invoice Tracking -->
          <div class="management-card">
            <h3 class="card-title">
              <Receipt :size="18" />
              Invoice Tracking
            </h3>
            <div class="management-stats">
              <div class="stat-item">
                <span class="stat-label">Total Invoices Generated</span>
                <span class="stat-value">{{ invoiceStats.totalInvoices }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Paid Invoices</span>
                <span class="stat-value text-success">{{ invoiceStats.paidInvoices }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Unpaid Invoices</span>
                <span class="stat-value text-danger">{{ invoiceStats.unpaidInvoices }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Overdue Invoices</span>
                <span class="stat-value text-danger">{{ invoiceStats.overdueInvoices }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SECTION 3: Recent Transactions Table ===== -->
      <section class="transactions-section">
        <div class="section-header">
          <h3 class="section-title">
            <Activity :size="18" />
            Recent Transactions
          </h3>
          <el-button type="primary" link @click="navigateToPayments">View All</el-button>
        </div>

        <div class="table-wrapper">
          <el-table :data="recentTransactions" stripe
            :header-cell-style="{ background: '#f1f5f9', fontWeight: '600', color: '#334155' }"
            :row-class-name="tableRowClassName" max-height="320" style="width: 100%">
            <el-table-column label="Date" prop="paymentDate" width="100">
              <template #default="{ row }">
                {{ formatDate(row.paymentDate) }}
              </template>
            </el-table-column>
            <el-table-column label="Reference" prop="paymentReference" width="140" />
            <el-table-column label="Contract No" prop="contractNo" min-width="150" />
            <el-table-column label="Client/Agency" min-width="180">
              <template #default="{ row }">
                {{ row.clientName || row.agencyName || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column label="Amount" prop="paidAmount" width="140" align="right">
              <template #default="{ row }">
                <span class="amount-cell">৳{{ formatCurrency(row.paidAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" width="110" align="center" fixed="right">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row)" size="small" effect="light">
                  {{ getStatusLabel(row) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </div>

    <!-- Corporate Footer -->
    <footer class="dashboard-footer">
      <p>Times Media Limited | 387 (South), Tejgaon I/A, Dhaka-1208</p>
      <p>Tel: +8802 55029724 | E-Mail: info@channel24bd.tv</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  TrendingUp,
  DollarSign,
  Banknote,
  AlertCircle,
  Calendar,
  FileText,
  Briefcase,
  Receipt,
  Activity,
  RefreshCw
} from 'lucide-vue-next'
import { paymentService, paymentUtils } from '@/services/Payments/payment.services'
import { contractService } from '@/services/Contracts/contract.services'
import { invoiceService } from '@/services/Invoices/invoice.services'
import type { IPayment } from '@/interface/payment/payments.interface'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'

const router = useRouter()
const loading = ref(false)
const selectedPeriod = ref('month')

// Metrics State
const metrics = reactive({
  totalGrossSales: 0,
  netSales: 0,
  totalContractsCount: 0,
  totalPaidAmount: 0,
  paymentsCount: 0,
  totalDueAmount: 0,
  pendingContractsCount: 0,
  todayCollections: 0,
  todayPaymentsCount: 0,
  todayInvoicesCount: 0,
  todayInvoicesValue: 0
})

// Contract Stats
const contractStats = reactive({
  activeContracts: 0,
  pendingRenewals: 0,
  expiredContracts: 0,
  draftContracts: 0,
  totalContracts: 0
})

// Invoice Stats
const invoiceStats = reactive({
  totalInvoices: 0,
  paidInvoices: 0,
  unpaidInvoices: 0,
  overdueInvoices: 0
})

// Recent Transactions
const recentTransactions = ref<IPayment[]>([])

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0)
}

// Format date
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  })
}

// Get status type for tag
const getStatusType = (payment: IPayment): string => {
  if (!payment.paidAmount || payment.paidAmount === 0) return 'info'

  // Calculate based on contract total vs paid
  const contractAmount = payment.contractAmount || 0
  const commissionAmount = payment.commissionAmount || 0
  const totalDue = contractAmount + commissionAmount
  const paidAmount = payment.paidAmount || 0

  if (paidAmount >= totalDue) return 'success'
  if (paidAmount > 0) return 'warning'
  return 'danger'
}

// Get status label
const getStatusLabel = (payment: IPayment): string => {
  const contractAmount = payment.contractAmount || 0
  const commissionAmount = payment.commissionAmount || 0
  const totalDue = contractAmount + commissionAmount
  const paidAmount = payment.paidAmount || 0

  if (paidAmount >= totalDue) return 'Paid'
  if (paidAmount > 0) return 'Partial'
  return 'Pending'
}

// Table row class for zebra striping (already handled by stripe prop, but for custom styling)
const tableRowClassName = ({ rowIndex }: { row: IPayment; rowIndex: number }): string => {
  return rowIndex % 2 === 0 ? 'table-row-even' : 'table-row-odd'
}

// Navigation
const navigateToPayments = () => router.push('/payments')

// Fetch all dashboard data
const refreshAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchPaymentMetrics(),
      fetchContractStats(),
      fetchInvoiceStats(),
      fetchRecentTransactions()
    ])
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
  } finally {
    loading.value = false
  }
}

// Fetch Payment Metrics
const fetchPaymentMetrics = async () => {
  try {
    // Get all payment summaries
    const summaries = await paymentService.getContractWiseSummary()

    // Calculate totals from summaries
    let totalAmount = 0
    let totalPaid = 0
    let totalDue = 0
    let pendingCount = 0

    summaries.forEach(summary => {
      totalAmount += summary.totalAmount || 0
      totalPaid += summary.totalPaidAmount || 0
      totalDue += summary.totalDueAmount || 0
      if ((summary.totalDueAmount || 0) > 0) pendingCount++
    })

    metrics.totalGrossSales = totalAmount
    metrics.netSales = totalAmount // Adjust if you have VAT/discount logic
    metrics.totalContractsCount = summaries.length
    metrics.totalPaidAmount = totalPaid
    metrics.totalDueAmount = totalDue
    metrics.pendingContractsCount = pendingCount

    // Get today's payments
    const today = new Date().toISOString().split('T')[0]
    const paymentsResponse = await paymentService.getAllPayments({
      startDate: today,
      endDate: today,
      page: 1,
      pageSize: 100
    })

    const todayPayments = paymentsResponse.data || []
    metrics.todayCollections = todayPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
    metrics.todayPaymentsCount = todayPayments.length
    metrics.paymentsCount = paymentsResponse.totalCount || todayPayments.length

  } catch (error) {
    console.error('Failed to fetch payment metrics:', error)
  }
}

// Fetch Contract Stats
const fetchContractStats = async () => {
  try {
    const contracts: ITelevisionContract[] = await contractService.getAllTelevisionContracts()
    const now = new Date()

    let active = 0
    let draft = 0
    let expired = 0
    let pendingRenewals = 0

    contracts.forEach(contract => {
      const endDate = new Date(contract.contractEndDate)
      const remarks = (contract.remarks || '').toLowerCase()

      if (remarks.includes('draft')) {
        draft++
      } else if (endDate < now) {
        expired++
      } else if (endDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        // Expiring within 30 days
        pendingRenewals++
        active++ // Still active until expired
      } else {
        active++
      }
    })

    contractStats.totalContracts = contracts.length
    contractStats.activeContracts = active
    contractStats.draftContracts = draft
    contractStats.expiredContracts = expired
    contractStats.pendingRenewals = pendingRenewals

  } catch (error) {
    console.error('Failed to fetch contract stats:', error)
  }
}

// Fetch Invoice Stats  
const fetchInvoiceStats = async () => {
  try {
    const invoicesResponse = await invoiceService.getAllInvoices({ page: 1, pageSize: 1000 })
    const invoices = invoicesResponse.data || []

    const today = new Date().toISOString().split('T')[0]
    let todayCount = 0
    let todayValue = 0
    let paid = 0
    let unpaid = 0
    let overdue = 0

    invoices.forEach(invoice => {
      // Today's invoices
      if (invoice.date?.startsWith(today)) {
        todayCount++
        todayValue += invoice.grandTotal || 0
      }

      // Status counting (based on statusId or custom logic)
      const status = invoice.status?.id
      if (status === 2) { // Assuming 2 = Paid
        paid++
      } else if (status === 1 || status === 0) { // Pending/Draft
        unpaid++
        // Check if overdue (invoice date + 30 days < now)
        const invoiceDate = new Date(invoice.date)
        const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        if (dueDate < new Date()) {
          overdue++
        }
      }
    })

    invoiceStats.totalInvoices = invoices.length
    invoiceStats.paidInvoices = paid
    invoiceStats.unpaidInvoices = unpaid
    invoiceStats.overdueInvoices = overdue
    metrics.todayInvoicesCount = todayCount
    metrics.todayInvoicesValue = todayValue

  } catch (error) {
    console.error('Failed to fetch invoice stats:', error)
  }
}

// Fetch Recent Transactions
const fetchRecentTransactions = async () => {
  try {
    const response = await paymentService.getAllPayments({ page: 1, pageSize: 10 })
    recentTransactions.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error)
  }
}

onMounted(() => {
  refreshAllData()
})
</script>

<style scoped>
/* ===== High-Density Dashboard Styles ===== */
.dashboard-container {
  padding: 12px 16px;
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.dashboard-header {
  margin-bottom: 12px;
}

.breadcrumb {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.breadcrumb-item {
  cursor: pointer;
}

.breadcrumb-item:hover {
  color: #a02408;
}

.breadcrumb-item.active {
  color: #334155;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 6px;
  color: #cbd5e1;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.company-tagline {
  font-size: 12px;
  color: #64748b;
  margin: 2px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.period-select {
  width: 120px;
}

/* Dashboard Grid */
.dashboard-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Section Title */
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ===== Pulse Section (Financial Metrics) ===== */
.pulse-section {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.pulse-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.pulse-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.pulse-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.pulse-card.today {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: #bae6fd;
}

.pulse-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pulse-icon.sales {
  background: #dbeafe;
  color: #2563eb;
}

.pulse-icon.net {
  background: #dcfce7;
  color: #16a34a;
}

.pulse-icon.received {
  background: #d1fae5;
  color: #059669;
}

.pulse-icon.due {
  background: #fee2e2;
  color: #dc2626;
}

.pulse-icon.today-icon {
  background: #fef3c7;
  color: #d97706;
}

.pulse-icon.invoice-icon {
  background: #e0e7ff;
  color: #4f46e5;
}

.pulse-data {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pulse-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.pulse-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  margin: 2px 0;
}

.pulse-count {
  font-size: 11px;
  color: #94a3b8;
}

/* ===== Management Section ===== */
.management-section {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.management-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.management-card {
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.management-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

/* ===== Transactions Section ===== */
.transactions-section {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
}

.amount-cell {
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', monospace;
  color: #1e293b;
}

/* Table Zebra Striping */
:deep(.table-row-even) {
  background-color: #ffffff;
}

:deep(.table-row-odd) {
  background-color: #f8fafc;
}

:deep(.el-table__row:hover > td) {
  background-color: #f1f5f9 !important;
}

/* ===== Color Utilities ===== */
.text-success {
  color: #16a34a;
}

.text-danger {
  color: #dc2626;
}

.text-warning {
  color: #d97706;
}

.text-info {
  color: #2563eb;
}

.text-muted {
  color: #94a3b8;
}

/* ===== Footer ===== */
.dashboard-footer {
  margin-top: 16px;
  padding: 12px;
  text-align: center;
  background: #1e293b;
  color: #94a3b8;
  border-radius: 6px;
  font-size: 11px;
}

.dashboard-footer p {
  margin: 2px 0;
}

/* ===== Responsive ===== */
@media (max-width: 1400px) {
  .pulse-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .pulse-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .management-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 8px;
  }

  .pulse-grid {
    grid-template-columns: 1fr;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .management-stats {
    grid-template-columns: 1fr;
  }
}
</style>
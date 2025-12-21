<template>
  <div class="payments-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Payment Management</h1>
          <p class="page-subtitle">Track and manage contract payments</p>
        </div>
        <el-button type="primary" size="large" @click="showPaymentModal = true">
          <Plus class="w-4 h-4 mr-2" />
          Add Payment
        </el-button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <Banknote class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <span class="stat-value">Tk. {{ formatCurrency(totalPayments) }}</span>
            <span class="stat-label">Total Received</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <CheckCircle class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ completedCount }}</span>
            <span class="stat-label">Completed Payments</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <Clock class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ pendingCount }}</span>
            <span class="stat-label">Pending Payments</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <TrendingUp class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ payments.length }}</span>
            <span class="stat-label">Total Transactions</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <el-input v-model="searchQuery" placeholder="Search by contract no, reference, client..." clearable
          class="search-input">
          <template #prefix>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </el-input>

        <el-select style="width: 200px;" v-model="filterPaymentType" placeholder="Payment Type" clearable>
          <el-option label="All Types" value="" />
          <el-option label="Cash" value="Cash" />
          <el-option label="Bank Transfer" value="Bank Transfer" />
          <el-option label="Check" value="Check" />
          <el-option label="Online" value="Online" />
          <el-option label="Mobile Banking" value="Mobile Banking" />
        </el-select>

        <el-select style="width: 200px;" v-model="filterStatus" placeholder="Status" clearable>
          <el-option label="All Status" value="" />
          <el-option label="Completed" value="Completed" />
          <el-option label="Pending" value="Pending" />
          <el-option label="Cancelled" value="Cancelled" />
        </el-select>

        <el-date-picker v-model="dateRange" type="daterange" range-separator="to" start-placeholder="Start date"
          end-placeholder="End date" format="DD MMM, YYYY" value-format="YYYY-MM-DD" />

        <el-button :icon="RefreshCw" @click="handleRefresh">Refresh</el-button>
      </div>
    </el-card>

    <!-- Payments Table -->
    <el-card class="table-card" shadow="never">
      <el-table v-loading="isLoading" :data="filteredPayments" stripe border style="width: 100%"
        :default-sort="{ prop: 'paymentDate', order: 'descending' }" @sort-change="handleSortChange">
        <el-table-column type="index" label="SL" width="60" align="center" />

        <el-table-column prop="paymentReference" label="Reference" min-width="140" sortable>
          <template #default="{ row }">
            <div class="ref-cell">
              <span class="ref-number">{{ row.paymentReference }}</span>
              <el-tag size="small" :type="getStatusType(row.status)">
                {{ row.status }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="contractNo" label="Contract" min-width="180">
          <template #default="{ row }">
            <div class="contract-cell">
              <span class="contract-no">{{ row.contractNo }}</span>
              <span class="party-name">{{ row.clientName || row.agencyName || 'N/A' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="paymentDate" label="Date" width="120" sortable>
          <template #default="{ row }">
            {{ formatDate(row.paymentDate) }}
          </template>
        </el-table-column>

        <el-table-column prop="paymentType" label="Type" width="130">
          <template #default="{ row }">
            <div class="type-cell">
              <component :is="getPaymentTypeIcon(row.paymentType)" class="w-4 h-4" />
              <span>{{ row.paymentType }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="paymentCategory" label="Category" width="140">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.paymentCategory)" size="small">
              {{ row.paymentCategory }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="contractAmount" label="Contract Amt" width="140" align="right">
          <template #default="{ row }">
            <span class="amount-value">{{ formatCurrency(row.contractAmount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="vatAmount" label="VAT Amt" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-value">{{ formatCurrency(row.vatAmount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="paidAmount" label="Total Paid" width="140" align="right">
          <template #default="{ row }">
            <span class="total-amount">Tk. {{ formatCurrency(row.paidAmount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="paymentMode" label="Mode" width="110">
          <template #default="{ row }">
            <el-tag :type="row.paymentMode === 'Full Payment' ? 'success' : 'warning'" size="small" effect="plain">
              {{ row.paymentMode === 'Full Payment' ? 'Full' : 'Partial' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="View Details" placement="top">
                <el-button type="primary" :icon="Eye" circle size="small" @click="handleViewPayment(row)" />
              </el-tooltip>
              <el-tooltip content="Delete" placement="top">
                <el-button type="danger" :icon="Trash2" circle size="small" @click="handleDeletePayment(row)" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="totalCount" layout="total, sizes, prev, pager, next, jumper" @size-change="handlePageSizeChange"
          @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- Payment Modal -->
    <PaymentModal v-model="showPaymentModal" :loading="isSubmitting" @save="handlePaymentSaved" />

    <!-- Payment Details Dialog -->
    <el-dialog v-model="showDetailsDialog" title="Payment Details" width="700px">
      <div v-if="selectedPayment" class="payment-details">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Reference</span>
            <span class="detail-value">{{ selectedPayment.paymentReference }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Contract No</span>
            <span class="detail-value">{{ selectedPayment.contractNo }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payment Date</span>
            <span class="detail-value">{{ formatDate(selectedPayment.paymentDate) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payment Type</span>
            <span class="detail-value">{{ selectedPayment.paymentType }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Client/Agency</span>
            <span class="detail-value">{{ selectedPayment.clientName || selectedPayment.agencyName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <el-tag :type="getStatusType(selectedPayment.status)">{{ selectedPayment.status }}</el-tag>
          </div>
        </div>

        <el-divider />

        <div class="amount-details">
          <div class="amount-row">
            <span>Contract Amount:</span>
            <span>Tk. {{ formatCurrency(selectedPayment.contractAmount) }}</span>
          </div>
          <div class="amount-row">
            <span>VAT Amount:</span>
            <span>Tk. {{ formatCurrency(selectedPayment.vatAmount) }}</span>
          </div>
          <div class="amount-row total">
            <span>Total Paid:</span>
            <span>Tk. {{ formatCurrency(selectedPayment.paidAmount) }}</span>
          </div>
        </div>

        <el-divider v-if="selectedPayment.bankRef || selectedPayment.checkRef" />

        <div v-if="selectedPayment.bankRef || selectedPayment.checkRef" class="bank-details">
          <h4>Bank/Check Details</h4>
          <div class="detail-grid">
            <div v-if="selectedPayment.bankName" class="detail-item">
              <span class="detail-label">Bank Name</span>
              <span class="detail-value">{{ selectedPayment.bankName }}</span>
            </div>
            <div v-if="selectedPayment.branchName" class="detail-item">
              <span class="detail-label">Branch</span>
              <span class="detail-value">{{ selectedPayment.branchName }}</span>
            </div>
            <div v-if="selectedPayment.bankRef" class="detail-item">
              <span class="detail-label">Bank Reference</span>
              <span class="detail-value">{{ selectedPayment.bankRef }}</span>
            </div>
            <div v-if="selectedPayment.checkRef" class="detail-item">
              <span class="detail-label">Check Reference</span>
              <span class="detail-value">{{ selectedPayment.checkRef }}</span>
            </div>
          </div>
        </div>

        <div v-if="selectedPayment.remarks" class="remarks-section">
          <h4>Remarks</h4>
          <p>{{ selectedPayment.remarks }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailsDialog = false">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Search, RefreshCw, Eye, Trash2,
  Banknote, CheckCircle, Clock, TrendingUp,
  Building2, FileCheck, Globe, Smartphone, CreditCard
} from 'lucide-vue-next'
import { usePaymentStore } from '@/stores/payments'
import { paymentUtils } from '@/services/Payments/payment.services'
import PaymentModal from '@/components/forms/PaymentModal.vue'
import type { IPayment } from '@/interface/payment/payments.interface'

const store = usePaymentStore()

// State
const showPaymentModal = ref(false)
const showDetailsDialog = ref(false)
const selectedPayment = ref<IPayment | null>(null)
const isSubmitting = ref(false)

// Filter state
const searchQuery = ref('')
const filterPaymentType = ref('')
const filterStatus = ref('')
const dateRange = ref<[string, string] | null>(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)

// Computed
const payments = computed(() => store.payments)
const isLoading = computed(() => store.isLoading)

const filteredPayments = computed(() => {
  let result = [...payments.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.paymentReference?.toLowerCase().includes(query) ||
      p.contractNo?.toLowerCase().includes(query) ||
      p.clientName?.toLowerCase().includes(query) ||
      p.agencyName?.toLowerCase().includes(query)
    )
  }

  // Payment type filter
  if (filterPaymentType.value) {
    result = result.filter(p => p.paymentType === filterPaymentType.value)
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }

  // Date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const [start, end] = dateRange.value
    result = result.filter(p => {
      const paymentDate = new Date(p.paymentDate)
      return paymentDate >= new Date(start) && paymentDate <= new Date(end)
    })
  }

  totalCount.value = result.length

  // Pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  return result.slice(startIndex, startIndex + pageSize.value)
})

const totalPayments = computed(() =>
  payments.value
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + (p.paidAmount || 0), 0)
)

const completedCount = computed(() =>
  payments.value.filter(p => p.status === 'Completed').length
)

const pendingCount = computed(() =>
  payments.value.filter(p => p.status === 'Pending').length
)

// Helper functions
const formatCurrency = (value: number) => paymentUtils.formatCurrency(value)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    'Completed': 'success',
    'Pending': 'warning',
    'Cancelled': 'danger',
    'Refunded': 'info'
  }
  return types[status] || 'info'
}

const getCategoryType = (category: string) => {
  const types: Record<string, string> = {
    'Contract Amount': 'primary',
    'VAT Amount': 'warning',
    'Both': 'success'
  }
  return types[category] || 'info'
}

const getPaymentTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    'Cash': Banknote,
    'Bank Transfer': Building2,
    'Check': FileCheck,
    'Online': Globe,
    'Mobile Banking': Smartphone,
    'Other': CreditCard
  }
  return icons[type] || CreditCard
}

// Handlers
const handleRefresh = async () => {
  await store.fetchPayments()
  ElMessage.success('Data refreshed')
}

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  // Implement sorting if needed
  console.log('Sort by:', prop, order)
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleViewPayment = (payment: IPayment) => {
  selectedPayment.value = payment
  showDetailsDialog.value = true
}

const handleDeletePayment = async (payment: IPayment) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete payment "${payment.paymentReference}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    const success = await store.deletePayment(payment.guid)
    if (success) {
      ElMessage.success('Payment deleted successfully')
    }
  } catch {
    // User cancelled
  }
}

const handlePaymentSaved = (success: boolean) => {
  if (success) {
    store.fetchPayments()
  }
}

// Lifecycle
onMounted(async () => {
  await store.fetchPayments()
})
</script>

<style scoped>
.payments-container {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
}

.stat-icon.green {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #E6A23C, #f0c78a);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #9c27b0, #ba68c8);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

/* Filter Card */
.filter-card {
  margin-bottom: 10px;
  border-radius: 12px;
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  overflow-x: auto;
  align-items: start;
}

.search-input {
  width: 400px;
}

/* Table Card */
.table-card {
  border-radius: 12px;
}

.ref-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ref-number {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.contract-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contract-no {
  font-weight: 600;
  color: var(--el-color-primary);
}

.party-name {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.type-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-value {
  font-family: 'Roboto Mono', monospace;
  color: var(--el-text-color-regular);
}

.total-amount {
  font-weight: 700;
  color: var(--el-color-success);
  font-family: 'Roboto Mono', monospace;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 16px;
}

/* Payment Details Dialog */
.payment-details {
  padding: 8px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.amount-details {
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  padding: 16px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.amount-row:last-child {
  border-bottom: none;
}

.amount-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
  border-top: 2px solid var(--el-color-primary);
  margin-top: 8px;
  padding-top: 16px;
}

.bank-details h4,
.remarks-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
}

.remarks-section p {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
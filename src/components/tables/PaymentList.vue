<template>
  <div class="payment-list-container">
    <!-- Header with Search and Filters -->
    <div class="list-header">
      <div class="search-section">
        <el-input v-model="searchQuery" placeholder="Search by Contract No, Client, Agency..." clearable
          class="search-input" @input="handleSearch">
          <template #prefix>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </el-input>
      </div>

      <div class="filters-section">
        <el-select v-model="statusFilter" placeholder="Status" clearable class="filter-select" @change="handleFilter">
          <el-option label="Pending" value="Pending" />
          <el-option label="Completed" value="Completed" />
          <el-option label="Cancelled" value="Cancelled" />
          <el-option label="Refunded" value="Refunded" />
        </el-select>

        <el-date-picker v-model="dateRange" type="daterange" range-separator="to" start-placeholder="Start date"
          end-placeholder="End date" format="DD MMM, YYYY" value-format="YYYY-MM-DD" class="date-range-picker"
          @change="handleFilter" />

        <el-button type="primary" @click="$emit('add-payment')">
          <Plus class="w-4 h-4 mr-1" />
          Add Payment
        </el-button>
      </div>
    </div>

    <!-- Payment Table -->
    <el-table :data="payments" v-loading="isLoading" stripe class="payment-table" @row-click="handleRowClick">
      <el-table-column prop="paymentReference" label="Reference" width="150">
        <template #default="{ row }">
          <span class="font-medium text-blue-600">{{ row.paymentReference }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="paymentDate" label="Date" width="120">
        <template #default="{ row }">
          {{ formatDate(row.paymentDate) }}
        </template>
      </el-table-column>

      <el-table-column prop="contractNo" label="Contract No" width="140">
        <template #default="{ row }">
          <span class="font-medium">{{ row.contractNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Client/Agency" min-width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-tag size="small" :type="row.contractedPartyType === 'Client' ? 'success' : 'warning'">
              {{ row.contractedPartyType }}
            </el-tag>
            <span>{{ row.clientName || row.agencyName || 'N/A' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="paymentTypeName" label="Type" width="130">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <component :is="getPaymentIcon(row.paymentTypeName)" class="w-4 h-4 text-gray-500" />
            <span>{{ formatPaymentType(row.paymentTypeName) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Amount" width="150" align="right">
        <template #default="{ row }">
          <div class="text-right">
            <div class="font-semibold text-green-600">Tk. {{ formatCurrency(row.paidAmount) }}</div>
            <div class="text-xs text-gray-500">Contract: {{ formatCurrency(row.contractAmount) }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="Status" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <div class="flex items-center justify-center gap-1">
            <el-tooltip content="View Receipt" placement="top">
              <el-button type="primary" size="small" circle @click.stop="handleViewReceipt(row)">
                <FileText class="w-4 h-4" />
              </el-button>
            </el-tooltip>

            <el-tooltip :content="canEdit(row) ? 'Edit Payment' : 'Cannot edit completed payment'" placement="top">
              <el-button type="warning" size="small" circle :disabled="!canEdit(row)" @click.stop="handleEdit(row)">
                <Pencil class="w-4 h-4" />
              </el-button>
            </el-tooltip>

            <el-tooltip content="Delete" placement="top">
              <el-button type="danger" size="small" circle :disabled="!canEdit(row)" @click.stop="handleDelete(row)">
                <Trash2 class="w-4 h-4" />
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-section">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSizeLocal" :total="totalCount"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, FileText, Pencil, Trash2, Banknote, Building2, FileCheck, Globe, Smartphone, CreditCard } from 'lucide-vue-next'
import { usePaymentStore } from '@/stores/payments'
import { paymentUtils } from '@/services/Payments/payment.services'
import type { IPayment } from '@/interface/payment/payments.interface'

const emit = defineEmits<{
  'add-payment': []
  'edit-payment': [payment: IPayment]
  'view-receipt': [payment: IPayment]
}>()

const store = usePaymentStore()

// Local state
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref<[string, string] | null>(null)
const currentPage = ref(1)
const pageSizeLocal = ref(10)

// Computed
const payments = computed(() => store.payments)
const isLoading = computed(() => store.isLoading)
const totalCount = computed(() => store.totalCount)

// Methods
const formatCurrency = (value: number) => paymentUtils.formatCurrency(value)
const formatDate = (date: string) => paymentUtils.formatDate(date)

const formatPaymentType = (type: string) => {
  const mapping: Record<string, string> = {
    'BankTransfer': 'Bank Transfer',
    'MobileBanking': 'Mobile Banking',
  }
  return mapping[type] || type
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    Pending: 'warning',
    Completed: 'success',
    Cancelled: 'danger',
    Refunded: 'info',
  }
  return types[status] || 'info'
}

const canEdit = (payment: IPayment) => {
  return payment.status !== 'Completed'
}

const getPaymentIcon = (type: string) => {
  const icons: Record<string, any> = {
    Cash: Banknote,
    BankTransfer: Building2,
    'Bank Transfer': Building2,
    Check: FileCheck,
    Online: Globe,
    MobileBanking: Smartphone,
    'Mobile Banking': Smartphone,
  }
  return icons[type] || CreditCard
}

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadPayments()
  }, 500)
}

const handleFilter = () => {
  currentPage.value = 1
  loadPayments()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadPayments()
}

const handleSizeChange = (size: number) => {
  pageSizeLocal.value = size
  currentPage.value = 1
  loadPayments()
}

const loadPayments = async () => {
  await store.fetchPayments({
    page: currentPage.value,
    pageSize: pageSizeLocal.value,
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    startDate: dateRange.value?.[0] || undefined,
    endDate: dateRange.value?.[1] || undefined,
  })
}

const handleRowClick = (row: IPayment) => {
  emit('view-receipt', row)
}

const handleViewReceipt = (payment: IPayment) => {
  emit('view-receipt', payment)
}

const handleEdit = (payment: IPayment) => {
  if (!canEdit(payment)) {
    ElMessage.warning('Completed payments cannot be edited')
    return
  }
  emit('edit-payment', payment)
}

const handleDelete = async (payment: IPayment) => {
  if (!canEdit(payment)) {
    ElMessage.warning('Completed payments cannot be deleted')
    return
  }

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete payment ${payment.paymentReference}?`,
      'Delete Payment',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const success = await store.deletePayment(payment.guid)
    if (success) {
      ElMessage.success('Payment deleted successfully')
    } else {
      ElMessage.error(store.error || 'Failed to delete payment')
    }
  } catch {
    // User cancelled
  }
}

// Lifecycle
onMounted(() => {
  loadPayments()
})
</script>

<style scoped>
.payment-list-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.search-section {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.filters-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  width: 140px;
}

.date-range-picker {
  width: 260px;
}

.payment-table {
  width: 100%;
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* Responsive */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-section {
    max-width: 100%;
  }

  .filters-section {
    justify-content: flex-start;
  }
}
</style>
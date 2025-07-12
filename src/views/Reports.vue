<template>
  <div class="reports-container">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Reports & Analytics</h1>
          <p class="page-subtitle">Comprehensive financial and operational reports</p>
        </div>
        <el-button-group>
          <el-button type="primary" :icon="Refresh" @click="refreshReports" :loading="loading">
            Refresh
          </el-button>
          <el-button :icon="Download" @click="showExportDialog = true">
            Export
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- Report Type Tabs -->
    <el-tabs v-model="activeTab" type="card" class="report-tabs">
      <el-tab-pane label="Ageing Report" name="ageing">
        <div class="report-content">
          <!-- Filters -->
          <el-card class="filter-card" shadow="never">
            <div class="filters-row">
              <el-row :gutter="16">
                <el-col :span="6">
                  <el-input v-model="reportFilters.partyName" placeholder="Search by party name" :prefix-icon="Search"
                    clearable />
                </el-col>
                <el-col :span="4">
                  <el-select v-model="reportFilters.status" placeholder="Status" clearable>
                    <el-option label="All" value="" />
                    <el-option label="Current" value="current" />
                    <el-option label="Overdue" value="overdue" />
                    <el-option label="Paid" value="paid" />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="reportFilters.ageCategory" placeholder="Age Category" clearable>
                    <el-option label="All" value="" />
                    <el-option label="Current" value="Current" />
                    <el-option label="0-30 Days" value="0-30" />
                    <el-option label="31-60 Days" value="31-60" />
                    <el-option label="61-90 Days" value="61-90" />
                    <el-option label="90+ Days" value="90+" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-date-picker v-model="dateRange" type="daterange" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" format="DD MMM, YYYY"
                    value-format="DD MMM, YYYY" />
                </el-col>
                <el-col :span="4">
                  <div class="filter-actions">
                    <el-button @click="clearFilters">Clear</el-button>
                    <el-button type="primary" @click="applyFilters">Apply</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- Summary Cards -->
          <div class="summary-cards">
            <el-row :gutter="16">
              <el-col :span="4">
                <el-card class="summary-card current">
                  <div class="card-content">
                    <div class="card-icon">
                      <el-icon>
                        <CircleCheck />
                      </el-icon>
                    </div>
                    <div class="card-info">
                      <div class="card-title">Current</div>
                      <div class="card-amount">{{ formatCurrency(ageingSummary.current.amount) }}</div>
                      <div class="card-count">{{ ageingSummary.current.count }} invoices</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card class="summary-card days-0-30">
                  <div class="card-content">
                    <div class="card-icon">
                      <el-icon>
                        <Clock />
                      </el-icon>
                    </div>
                    <div class="card-info">
                      <div class="card-title">0-30 Days</div>
                      <div class="card-amount">{{ formatCurrency(ageingSummary.days0to30.amount) }}</div>
                      <div class="card-count">{{ ageingSummary.days0to30.count }} invoices</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card class="summary-card days-31-60">
                  <div class="card-content">
                    <div class="card-icon">
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </div>
                    <div class="card-info">
                      <div class="card-title">31-60 Days</div>
                      <div class="card-amount">{{ formatCurrency(ageingSummary.days31to60.amount) }}</div>
                      <div class="card-count">{{ ageingSummary.days31to60.count }} invoices</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card class="summary-card days-61-90">
                  <div class="card-content">
                    <div class="card-icon">
                      <el-icon>
                        <Remove />
                      </el-icon>
                    </div>
                    <div class="card-info">
                      <div class="card-title">61-90 Days</div>
                      <div class="card-amount">{{ formatCurrency(ageingSummary.days61to90.amount) }}</div>
                      <div class="card-count">{{ ageingSummary.days61to90.count }} invoices</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card class="summary-card days-90-plus">
                  <div class="card-content">
                    <div class="card-icon">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                    <div class="card-info">
                      <div class="card-title">90+ Days</div>
                      <div class="card-amount">{{ formatCurrency(ageingSummary.days90plus.amount) }}</div>
                      <div class="card-count">{{ ageingSummary.days90plus.count }} invoices</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card class="summary-card total">
                  <div class="card-content">
                    <div class="card-icon">
                      <el-icon>
                        <Coin />
                      </el-icon>
                    </div>
                    <div class="card-info">
                      <div class="card-title">Total Outstanding</div>
                      <div class="card-amount">{{ formatCurrency(ageingSummary.total.amount) }}</div>
                      <div class="card-count">{{ ageingSummary.total.count }} invoices</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- Ageing Report Table -->
          <el-card class="table-card">
            <template #header>
              <div class="card-header">
                <span>Accounts Receivable Ageing Report</span>
              </div>
            </template>
            <el-table :data="filteredAgeingReport" stripe :loading="loading" height="500" style="width: 100%">
              <el-table-column prop="invoiceNo" label="Invoice No" width="120" fixed="left" />
              <el-table-column prop="date" label="Date" width="110" />
              <el-table-column prop="partyName" label="Party Name" width="200" />
              <el-table-column prop="contractNo" label="Contract No" width="120" />
              <el-table-column prop="vatChalanNo" label="VAT Chalan No" width="120" />
              <el-table-column prop="amount" label="Amount" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.amount) }}
                </template>
              </el-table-column>
              <el-table-column prop="withVAT" label="With VAT" width="130" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.withVAT) }}
                </template>
              </el-table-column>
              <el-table-column prop="agencyCommission" label="Agency Commission" width="130" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.agencyCommission) }}
                </template>
              </el-table-column>
              <el-table-column prop="totalCollection" label="Total Collection" width="130" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.totalCollection) }}
                </template>
              </el-table-column>
              <el-table-column prop="openingBalance" label="Opening Balance" width="130" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.openingBalance) }}
                </template>
              </el-table-column>
              <el-table-column prop="daysOverdue" label="Days Overdue" width="110" align="center">
                <template #default="{ row }">
                  <el-tag :type="getOverdueTagType(row.daysOverdue)">
                    {{ row.daysOverdue }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="Status" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-tag :type="getStatusTagType(row.status)">
                    {{ capitalizeFirst(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Party Ledger" name="ledger">
        <div class="report-content">
          <el-card class="table-card">
            <template #header>
              <div class="card-header">
                <span>Party Ledger - City Bank</span>
              </div>
            </template>
            <el-table :data="partyLedgerData" stripe style="width: 100%">
              <el-table-column prop="serialNo" label="S/N" width="60" />
              <el-table-column prop="month" label="Month" width="120" />
              <el-table-column prop="contractNo" label="Contract No" width="120" />
              <el-table-column prop="contractAmount" label="Contract Amount" width="130" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.contractAmount) }}
                </template>
              </el-table-column>
              <el-table-column prop="plus15VAT" label="Plus 15% VAT" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.plus15VAT) }}
                </template>
              </el-table-column>
              <el-table-column prop="netTotal" label="Net Total" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.netTotal) }}
                </template>
              </el-table-column>
              <el-table-column prop="paymentDate" label="Payment Date" width="120" />
              <el-table-column prop="mrNo" label="MR.No." width="100" />
              <el-table-column prop="chequeNo" label="Cheque No." width="120" />
              <el-table-column prop="bankName" label="Bank Name" width="120" />
              <el-table-column prop="paymentAmount" label="Payment Amount" width="130" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.paymentAmount) }}
                </template>
              </el-table-column>
              <el-table-column prop="balance" label="Balance" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.balance) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="Status" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusTagType(row.status)">
                    {{ capitalizeFirst(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Commercial Schedule" name="schedule">
        <div class="report-content">
          <el-card class="table-card">
            <template #header>
              <div class="card-header">
                <span>Regular Commercial Schedule - 4 July 2025</span>
              </div>
            </template>
            <el-table :data="commercialScheduleData" stripe style="width: 100%">
              <el-table-column prop="programName" label="Program Name" width="150" />
              <el-table-column prop="timeSlot" label="Time Slot" width="120" />
              <el-table-column prop="adType" label="Ad Type" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.adType === 'Paid' ? 'success' : 'info'">
                    {{ row.adType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="agencyName" label="Agency Name" width="200" />
              <el-table-column prop="spotCount" label="Spot Count" width="100" align="center" />
              <el-table-column prop="duration" label="Duration (sec)" width="120" align="center" />
              <el-table-column prop="advertisement" label="Advertisement" width="250" />
              <el-table-column prop="category" label="Category" width="120" />
              <el-table-column prop="remarks" label="Remarks" min-width="200" />
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Export Dialog -->
    <el-dialog v-model="showExportDialog" title="Export Report" width="400px">
      <el-form label-position="top">
        <el-form-item label="Report Type">
          <el-select v-model="exportConfig.reportType" placeholder="Select report type">
            <el-option label="Ageing Report" value="ageing" />
            <el-option label="Party Ledger" value="ledger" />
            <el-option label="Commercial Schedule" value="schedule" />
          </el-select>
        </el-form-item>
        <el-form-item label="Export Format">
          <el-radio-group v-model="exportConfig.format">
            <el-radio value="excel">Excel (.xlsx)</el-radio>
            <el-radio value="pdf">PDF</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExportDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleExport" :loading="loading">
          Export
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  Refresh,
  Download,
  CircleCheck,
  Clock,
  Warning,
  Remove,
  Close,
  Coin
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useReportsStore, type ReportType, type ExportFormat } from '@/stores/reports'
import { useInvoicesStore } from '@/stores/invoices'

const reportsStore = useReportsStore()
const invoicesStore = useInvoicesStore()

const activeTab = ref('ageing')
const showExportDialog = ref(false)
const dateRange = ref<[string, string] | null>(null)

const exportConfig = ref<{
  reportType: ReportType
  format: ExportFormat
}>({
  reportType: 'ageing',
  format: 'excel'
})

// Computed properties from store
const {
  loading,
  reportFilters,
  ageingSummary,
  filteredAgeingReport,
  partyLedgerData,
  commercialScheduleData
} = reportsStore

const refreshReports = async () => {
  const result = await reportsStore.generateAgeingReport(invoicesStore.invoices)
  if (result.success) {
    ElMessage.success('Reports refreshed successfully')
  } else {
    ElMessage.error(result.message || 'Failed to refresh reports')
  }
}

const applyFilters = () => {
  if (dateRange.value) {
    reportsStore.updateFilters({
      dateFrom: dateRange.value[0],
      dateTo: dateRange.value[1]
    })
  }
  ElMessage.success('Filters applied')
}

const clearFilters = () => {
  reportsStore.clearFilters()
  dateRange.value = null
  ElMessage.info('Filters cleared')
}

const handleExport = async () => {
  const result = await reportsStore.exportReport(exportConfig.value.reportType, exportConfig.value.format)
  if (result.success) {
    ElMessage.success(`Report exported as ${result.filename}`)
    showExportDialog.value = false
  } else {
    ElMessage.error(result.message || 'Failed to export report')
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const getOverdueTagType = (days: number) => {
  if (days === 0) return 'success'
  if (days <= 30) return 'warning'
  if (days <= 60) return 'danger'
  return 'info'
}

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'paid': return 'success'
    case 'overdue': return 'danger'
    case 'current': return 'info'
    case 'partial': return 'warning'
    case 'pending': return 'warning'
    default: return 'info'
  }
}

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

onMounted(async () => {
  await refreshReports()
})
</script>

<style scoped>
.reports-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin: 0;
}

.report-tabs {
  margin-bottom: 24px;
}

.report-content {
  min-height: 600px;
}

.filter-card {
  margin-bottom: 24px;
}

.filters-row {
  padding: 8px 0;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.summary-cards {
  margin-bottom: 24px;
}

.summary-card {
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.card-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
}

.summary-card.current .card-icon {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.summary-card.days-0-30 .card-icon {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.summary-card.days-31-60 .card-icon {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.summary-card.days-61-90 .card-icon {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.summary-card.days-90-plus .card-icon {
  background: var(--el-fill-color-dark);
  color: var(--el-text-color-primary);
}

.summary-card.total .card-icon {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.card-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.card-count {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.table-card {
  margin-bottom: 24px;
}

.card-header {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

:deep(.el-tab-pane) {
  padding: 0;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background: var(--el-fill-color-light);
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: var(--el-fill-color-lighter);
}

@media (max-width: 768px) {
  .reports-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .summary-cards .el-col {
    margin-bottom: 16px;
  }

  .filters-row .el-col {
    margin-bottom: 12px;
  }
}
</style>
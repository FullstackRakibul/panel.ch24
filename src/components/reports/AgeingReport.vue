<template>
  <div class="ageing-report">
    <div class="report-header">
      <div class="header-left">
        <h2>Accounts Receivable Ageing Report</h2>
        <p>Outstanding invoices by age (up to 2024)</p>
      </div>
      <div class="header-actions">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="To" start-placeholder="Start date"
          end-placeholder="End date" format="DD/MM/YYYY" value-format="YYYY-MM-DD" @change="handleDateChange" />
        <el-button type="primary" :icon="Download" @click="exportReport">
          Export
        </el-button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ formatCurrency(totalOutstanding) }}</div>
          <div class="summary-label">Total Outstanding</div>
        </div>
      </el-card>
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ formatCurrency(currentAmount) }}</div>
          <div class="summary-label">Current (0-30 days)</div>
        </div>
      </el-card>
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ formatCurrency(overdue30) }}</div>
          <div class="summary-label">31-60 days</div>
        </div>
      </el-card>
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ formatCurrency(overdue60) }}</div>
          <div class="summary-label">60+ days</div>
        </div>
      </el-card>
    </div>

    <!-- Ageing Report Table -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>Detailed Ageing Report</span>
          <el-input v-model="searchText" placeholder="Search by party name or invoice number" :prefix-icon="Search"
            style="width: 300px" />
        </div>
      </template>

      <el-table :data="filteredAgeingData" stripe :loading="loading" empty-text="No outstanding invoices found"
        class="ageing-table">
        <el-table-column prop="invoiceNo" label="Invoice No" width="120" fixed="left" />
        <el-table-column prop="date" label="Date" width="100" />
        <el-table-column prop="partyName" label="Party Name" width="200" />
        <el-table-column prop="contractNo" label="Contract No" width="120" />
        <el-table-column prop="vatChalanNo" label="VAT Chalan No" width="120" />
        <el-table-column prop="amount" label="Amount" width="120" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="withVAT" label="With VAT" width="120" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.withVAT) }}
          </template>
        </el-table-column>
        <el-table-column prop="agencyCommission" label="Agency Commission" width="140" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.agencyCommission) }}
          </template>
        </el-table-column>
        <el-table-column prop="salesAmount" label="Sales Amount" width="120" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.salesAmount) }}
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
              {{ row.daysOverdue }} days
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ageBucket" label="Age Bucket" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getAgeBucketType(row.ageBucket)">
              {{ row.ageBucket }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, Search } from '@element-plus/icons-vue'

interface AgeingReportItem {
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
  bank: string
  cash: number
  vdsCertificate: string
  tdsCertificate: string
  totalCollection: number
  openingBalance: number
  daysOverdue: number
  ageBucket: string
}

const loading = ref(false)
const searchText = ref('')
const dateRange = ref<[string, string]>(['2024-01-01', '2024-12-31'])

const ageingData = ref<AgeingReportItem[]>([
  {
    invoiceNo: 'TML2506039',
    date: '01/07/2025',
    partyName: 'Mercantile Bank PLC',
    contractNo: 'TML2506039',
    vatChalanNo: 'VAT-2025-001',
    amount: 300000,
    withVAT: 345000,
    agencyCommission: 15000,
    salesAmount: 285000,
    withoutVAT: 300000,
    grossSales: 345000,
    receivedAgainstInvoiceNo: '',
    bank: 'City Bank',
    cash: 0,
    vdsCertificate: 'VDS-001',
    tdsCertificate: 'TDS-001',
    totalCollection: 100000,
    openingBalance: 245000,
    daysOverdue: 15,
    ageBucket: '0-30'
  },
  {
    invoiceNo: 'TML2506040',
    date: '15/06/2025',
    partyName: 'ABC Corporation Ltd',
    contractNo: 'TML2506040',
    vatChalanNo: 'VAT-2025-002',
    amount: 250000,
    withVAT: 287500,
    agencyCommission: 12500,
    salesAmount: 237500,
    withoutVAT: 250000,
    grossSales: 287500,
    receivedAgainstInvoiceNo: '',
    bank: 'DBBL',
    cash: 0,
    vdsCertificate: 'VDS-002',
    tdsCertificate: 'TDS-002',
    totalCollection: 287500,
    openingBalance: 0,
    daysOverdue: 45,
    ageBucket: '31-60'
  },
  {
    invoiceNo: 'TML2506041',
    date: '10/05/2025',
    partyName: 'XYZ Industries',
    contractNo: 'TML2506041',
    vatChalanNo: 'VAT-2025-003',
    amount: 180000,
    withVAT: 207000,
    agencyCommission: 9000,
    salesAmount: 171000,
    withoutVAT: 180000,
    grossSales: 207000,
    receivedAgainstInvoiceNo: '',
    bank: 'Standard Bank',
    cash: 0,
    vdsCertificate: 'VDS-003',
    tdsCertificate: 'TDS-003',
    totalCollection: 50000,
    openingBalance: 157000,
    daysOverdue: 75,
    ageBucket: '60+'
  }
])

const filteredAgeingData = computed(() => {
  if (!searchText.value) return ageingData.value

  const search = searchText.value.toLowerCase()
  return ageingData.value.filter(item =>
    item.partyName.toLowerCase().includes(search) ||
    item.invoiceNo.toLowerCase().includes(search) ||
    item.contractNo.toLowerCase().includes(search)
  )
})

const totalOutstanding = computed(() => {
  return ageingData.value.reduce((sum, item) => sum + item.openingBalance, 0)
})

const currentAmount = computed(() => {
  return ageingData.value
    .filter(item => item.ageBucket === '0-30')
    .reduce((sum, item) => sum + item.openingBalance, 0)
})

const overdue30 = computed(() => {
  return ageingData.value
    .filter(item => item.ageBucket === '31-60')
    .reduce((sum, item) => sum + item.openingBalance, 0)
})

const overdue60 = computed(() => {
  return ageingData.value
    .filter(item => item.ageBucket === '60+')
    .reduce((sum, item) => sum + item.openingBalance, 0)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const getOverdueTagType = (days: number) => {
  if (days <= 30) return 'success'
  if (days <= 60) return 'warning'
  return 'danger'
}

const getAgeBucketType = (bucket: string) => {
  switch (bucket) {
    case '0-30': return 'success'
    case '31-60': return 'warning'
    case '60+': return 'danger'
    default: return 'info'
  }
}

const handleDateChange = (dates: [string, string] | null) => {
  if (dates) {
    // Filter data based on date range
    console.log('Date range changed:', dates)
  }
}

const exportReport = () => {
  // Export functionality
  console.log('Exporting ageing report...')
}

onMounted(() => {
  // Load ageing report data
})
</script>

<style scoped>
.ageing-report {
  padding: 0;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 4px 0;
}

.header-left p {
  color: var(--el-text-color-regular);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  border-radius: 12px;
}

.summary-content {
  text-align: center;
  padding: 8px 0;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.summary-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.table-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ageing-table {
  width: 100%;
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-lighter);
  font-weight: 600;
}

:deep(.el-table .el-table__cell) {
  padding: 12px 0;
}

@media (max-width: 768px) {
  .report-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
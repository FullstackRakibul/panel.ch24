<template>
  <div class="party-ledger">
    <div class="report-header">
      <div class="header-left">
        <h2>Party Ledger</h2>
        <p>Detailed transaction ledger for clients</p>
      </div>
      <div class="header-actions">
        <el-select v-model="selectedParty" placeholder="Select Party" style="width: 250px" @change="handlePartyChange">
          <el-option v-for="party in parties" :key="party.value" :label="party.label" :value="party.value" />
        </el-select>
        <el-button type="primary" :icon="Download" @click="exportLedger">
          Export
        </el-button>
      </div>
    </div>

    <!-- Party Information -->
    <el-card v-if="selectedPartyInfo" class="party-info-card">
      <div class="party-info">
        <div class="party-details">
          <h3>{{ selectedPartyInfo.name }}</h3>
          <p>{{ selectedPartyInfo.address }}</p>
        </div>
        <div class="party-summary">
          <div class="summary-item">
            <span class="label">Total Contracts:</span>
            <span class="value">{{ selectedPartyInfo.totalContracts }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Outstanding Balance:</span>
            <span class="value">{{ formatCurrency(selectedPartyInfo.outstandingBalance) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total Paid:</span>
            <span class="value">{{ formatCurrency(selectedPartyInfo.totalPaid) }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Ledger Table -->
    <el-card class="table-card">
      <template #header>
        <span>Transaction History</span>
      </template>

      <el-table :data="ledgerData" stripe :loading="loading" empty-text="Select a party to view ledger"
        class="ledger-table" :summary-method="getSummaries" show-summary>
        <el-table-column prop="sn" label="S/N" width="60" align="center" />
        <el-table-column prop="month" label="Month" width="100" />
        <el-table-column prop="contractNo" label="Contract No" width="120" />
        <el-table-column prop="contractAmount" label="Contract Amount" width="140" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.contractAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="plus15VAT" label="Plus 15% VAT" width="130" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.plus15VAT) }}
          </template>
        </el-table-column>
        <el-table-column prop="minus15VAT" label="Minus 15% VAT" width="130" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.minus15VAT) }}
          </template>
        </el-table-column>
        <el-table-column prop="plus5" label="Plus 5%" width="100" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.plus5) }}
          </template>
        </el-table-column>
        <el-table-column prop="minus5" label="Minus 5%" width="100" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.minus5) }}
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
        <el-table-column prop="bankName" label="Bank Name" width="150" />
        <el-table-column prop="paymentAmount" label="Payment Amount" width="140" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.paymentAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="Balance" width="120" align="right">
          <template #default="{ row }">
            <span :class="{ 'negative-balance': row.balance < 0 }">
              {{ formatCurrency(row.balance) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'

interface LedgerItem {
  sn: number
  month: string
  contractNo: string
  contractAmount: number
  plus15VAT: number
  minus15VAT: number
  plus5: number
  minus5: number
  netTotal: number
  paymentDate: string
  mrNo: string
  chequeNo: string
  bankName: string
  paymentAmount: number
  balance: number
  status: string
}

interface PartyInfo {
  name: string
  address: string
  totalContracts: number
  outstandingBalance: number
  totalPaid: number
}

const loading = ref(false)
const selectedParty = ref('')

const parties = ref([
  { label: 'City Bank Limited', value: 'city-bank' },
  { label: 'Mercantile Bank PLC', value: 'mercantile-bank' },
  { label: 'ABC Corporation Ltd', value: 'abc-corp' },
  { label: 'XYZ Industries', value: 'xyz-industries' }
])

const partyInfoMap = ref<Record<string, PartyInfo>>({
  'city-bank': {
    name: 'City Bank Limited',
    address: 'Motijheel Commercial Area, Dhaka-1000',
    totalContracts: 12,
    outstandingBalance: 450000,
    totalPaid: 2850000
  },
  'mercantile-bank': {
    name: 'Mercantile Bank PLC',
    address: '61, Dilkusha, Commercial Area, Dhaka-1000',
    totalContracts: 8,
    outstandingBalance: 245000,
    totalPaid: 1650000
  }
})

const ledgerDataMap = ref<Record<string, LedgerItem[]>>({
  'city-bank': [
    {
      sn: 1,
      month: 'June 2025',
      contractNo: 'CTB2506001',
      contractAmount: 500000,
      plus15VAT: 75000,
      minus15VAT: 0,
      plus5: 25000,
      minus5: 0,
      netTotal: 600000,
      paymentDate: '15/07/2025',
      mrNo: 'MR-001',
      chequeNo: 'CHQ-123456',
      bankName: 'City Bank',
      paymentAmount: 300000,
      balance: 300000,
      status: 'Partial'
    },
    {
      sn: 2,
      month: 'July 2025',
      contractNo: 'CTB2507001',
      contractAmount: 350000,
      plus15VAT: 52500,
      minus15VAT: 0,
      plus5: 17500,
      minus5: 0,
      netTotal: 420000,
      paymentDate: '20/08/2025',
      mrNo: 'MR-002',
      chequeNo: 'CHQ-789012',
      bankName: 'City Bank',
      paymentAmount: 420000,
      balance: 0,
      status: 'Paid'
    }
  ],
  'mercantile-bank': [
    {
      sn: 1,
      month: 'June 2025',
      contractNo: 'TML2506039',
      contractAmount: 300000,
      plus15VAT: 45000,
      minus15VAT: 0,
      plus5: 15000,
      minus5: 0,
      netTotal: 360000,
      paymentDate: '10/07/2025',
      mrNo: 'MR-003',
      chequeNo: 'CHQ-345678',
      bankName: 'Mercantile Bank',
      paymentAmount: 100000,
      balance: 260000,
      status: 'Partial'
    }
  ]
})

const selectedPartyInfo = computed(() => {
  return selectedParty.value ? partyInfoMap.value[selectedParty.value] : null
})

const ledgerData = computed(() => {
  return selectedParty.value ? ledgerDataMap.value[selectedParty.value] || [] : []
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const getStatusType = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid': return 'success'
    case 'partial': return 'warning'
    case 'pending': return 'danger'
    default: return 'info'
  }
}

const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []

  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = 'Total'
      return
    }

    const values = data.map((item: any) => Number(item[column.property]))
    if (!values.every((value: number) => Number.isNaN(value))) {
      if (['contractAmount', 'plus15VAT', 'netTotal', 'paymentAmount', 'balance'].includes(column.property)) {
        sums[index] = formatCurrency(values.reduce((prev: number, curr: number) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0))
      } else {
        sums[index] = ''
      }
    } else {
      sums[index] = ''
    }
  })

  return sums
}

const handlePartyChange = (value: string) => {
  console.log('Selected party:', value)
}

const exportLedger = () => {
  console.log('Exporting party ledger...')
}

onMounted(() => {
  // Load party data
})
</script>

<style scoped>
.party-ledger {
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

.party-info-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.party-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.party-details h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 4px 0;
}

.party-details p {
  color: var(--el-text-color-regular);
  margin: 0;
}

.party-summary {
  display: flex;
  gap: 32px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.summary-item .label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
}

.summary-item .value {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.table-card {
  border-radius: 12px;
}

.ledger-table {
  width: 100%;
}

.negative-balance {
  color: var(--el-color-danger);
  font-weight: 600;
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-lighter);
  font-weight: 600;
}

:deep(.el-table .el-table__cell) {
  padding: 12px 0;
}

:deep(.el-table__footer-wrapper) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-table__footer .cell) {
  font-weight: 600;
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

  .party-info {
    flex-direction: column;
    gap: 16px;
  }

  .party-summary {
    flex-direction: column;
    gap: 12px;
  }

  .summary-item {
    align-items: flex-start;
  }
}
</style>
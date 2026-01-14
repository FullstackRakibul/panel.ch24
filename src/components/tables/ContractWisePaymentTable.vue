<template>
  <div class="contract-wise-payment-table">
    <div class="table-container">
      <el-table v-loading="loading" :data="summaries" border stripe style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }">
        <el-table-column label="Contractor Name" min-width="200">
          <template #default="{ row }">
            <div class="contractor-info">
              <span class="name">{{ row.clientName || row.agencyName || 'N/A' }}</span>
              <el-tag size="small" :type="row.clientName ? 'primary' : 'warning'" class="ml-2">
                {{ row.clientName ? 'Client' : 'Agency' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="contractNo" label="Contract No" width="150" align="center">
          <template #default="{ row }">
            <el-tag effect="plain" type="info">{{ row.contractNo }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Total Amount" width="150" align="right">
          <template #default="{ row }">
            <span class="amount">{{ formatCurrency(row.totalAmount) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Total Paid" width="150" align="right">
          <template #default="{ row }">
            <span class="amount text-success">{{ formatCurrency(row.totalPaidAmount) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Total Due" width="150" align="right">
          <template #default="{ row }">
            <span class="amount text-danger">{{ formatCurrency(row.totalDueAmount) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.paymentStatus)">
              {{ row.paymentStatus }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-tooltip content="View Detailed Summary" placement="top">
                <el-button size="small" type="primary" @click="$emit('view-summary', row)">
                  <FileText class="w-4 h-4" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="Download Summary PDF" placement="top">
                <el-button size="small" type="success" @click="$emit('download-pdf', row)">
                  <Download class="w-4 h-4" />
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Download } from 'lucide-vue-next'
import { paymentUtils } from '@/services/Payments/payment.services'
import type { IAllContractsPaymentSummary } from '@/interface/payment/payments.interface'

defineProps<{
  summaries: IAllContractsPaymentSummary[]
  loading: boolean
}>()

defineEmits<{
  'view-summary': [summary: IAllContractsPaymentSummary]
  'download-pdf': [summary: IAllContractsPaymentSummary]
}>()

const formatCurrency = (value: number) => paymentUtils.formatCurrency(value)

const getStatusType = (status: string) => {
  switch (status) {
    case 'Completed': return 'success'
    case 'Partial': return 'warning'
    case 'Overpaid': return 'danger'
    default: return 'info'
  }
}
</script>

<style scoped>
.contract-wise-payment-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-container {
  padding: 1px;
}

.contractor-info {
  display: flex;
  align-items: center;
}

.name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.amount {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-weight: 600;
}

.text-success {
  color: var(--el-color-success);
}

.text-danger {
  color: var(--el-color-danger);
}

.ml-2 {
  margin-left: 8px;
}
</style>
<template>
  <el-dialog v-model="dialogVisible" title="Invoice Details" width="900px" :close-on-click-modal="false"
    class="invoice-view-modal" top="5vh">
    <div v-if="invoice" class="invoice-document">
      <!-- Header -->
      <div class="document-header">
        <div class="company-info">
          <img src="@/assets/CH24.png" alt="Channel 24" class="company-logo" />
          <h1 class="company-name">CHANNEL 24 LTD.</h1>
        </div>
        <h2 class="invoice-title">INVOICE FOR THE MONTH OF {{ getMonthYear(invoice.date) }}</h2>
      </div>

      <!-- Invoice Info -->
      <div class="invoice-info-section">
        <div class="bill-to">
          <p><strong>To</strong></p>
          <p><strong>{{ invoice.billTo.name }}</strong></p>
          <p>{{ invoice.billTo.address }}</p>
        </div>
        <div class="invoice-details">
          <div class="detail-row">
            <span>Invoice No:</span>
            <span>{{ invoice.number }}</span>
          </div>
          <div class="detail-row">
            <span>Invoice Date:</span>
            <span>{{ invoice.date }}</span>
          </div>
          <div class="detail-row">
            <span>Contract No:</span>
            <span>{{ invoice.contractNo }}</span>
          </div>
          <div class="detail-row">
            <span>Contract Date:</span>
            <span>{{ invoice.contractDate }}</span>
          </div>
        </div>
      </div>

      <!-- Advertiser Info -->
      <div class="advertiser-section">
        <div class="advertiser-row">
          <span class="label">Advertiser</span>
          <span class="value">: {{ invoice.advertiser }}</span>
        </div>
        <div class="advertiser-row">
          <span class="label">Product</span>
          <span class="value">: {{ invoice.product }}</span>
        </div>
      </div>

      <!-- Items Table -->
      <div class="items-table-section">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>SL #</th>
              <th>PARTICULARS</th>
              <th>QUANTITY</th>
              <th>RATE (Tk.)</th>
              <th>AMOUNT (Tk.)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.items" :key="item.sl">
              <td>{{ item.sl }}</td>
              <td>{{ item.particulars }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.rate) }}</td>
              <td>{{ formatCurrency(item.amount) }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="4"><strong>SPOT TOTAL Tk</strong></td>
              <td><strong>{{ formatCurrency(invoice.spotTotal) }}</strong></td>
            </tr>
            <tr class="vat-row">
              <td colspan="4">Plus {{ invoice.vatPercentage }}% VAT on Tk {{ invoice.spotTotal.toLocaleString() }} Tk
              </td>
              <td>{{ formatCurrency(invoice.vatAmount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grand Total -->
      <div class="grand-total-section">
        <div class="total-words">
          <span>In Words : {{ invoice.grandTotalWords }}</span>
        </div>
        <div class="total-amount">
          <span>Tk {{ formatCurrency(invoice.grandTotal) }}</span>
        </div>
      </div>

      <!-- Signature Section -->
      <div class="signature-section">
        <div class="signature-left">
          <div class="signature-line"></div>
          <p><strong>{{ invoice.signature1Name }}</strong></p>
          <p>{{ invoice.signature1Title }}</p>
          <p>CHANNEL 24</p>
        </div>
        <div class="signature-right">
          <div class="signature-line"></div>
          <p><strong>{{ invoice.signature2Name }}</strong></p>
          <p>{{ invoice.signature2Title }}</p>
          <p>CHANNEL 24</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="document-footer">
        <p>{{ invoice.footerContact }}</p>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <el-button @click="printInvoice">
          <el-icon class="mr-2">
            <Printer />
          </el-icon>
          Print Invoice
        </el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Close
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Invoice } from '@/stores/invoices'
import { Printer } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  invoice?: Invoice | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const getMonthYear = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

const printInvoice = () => {
  window.print()
}
</script>

<style scoped>
.invoice-view-modal {
  --el-dialog-border-radius: 16px;
}

.invoice-document {
  font-family: Arial, sans-serif;
  line-height: 1.4;
  color: #333;
}

.document-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 20px;
}

.company-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.company-logo {
  width: 40px;
  height: 40px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.invoice-title {
  font-size: 18px;
  margin: 0;
}

.invoice-info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.bill-to {
  flex: 1;
}

.invoice-details {
  text-align: right;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  min-width: 200px;
}

.advertiser-section {
  margin-bottom: 25px;
}

.advertiser-row {
  display: flex;
  margin-bottom: 5px;
}

.label {
  width: 100px;
  font-weight: bold;
}

.value {
  flex: 1;
}

.items-table-section {
  margin-bottom: 25px;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
}

.invoice-table th,
.invoice-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
}

.invoice-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.invoice-table td:nth-child(2) {
  text-align: left;
}

.invoice-table td:nth-child(4),
.invoice-table td:nth-child(5) {
  text-align: right;
}

.total-row {
  background-color: #f9f9f9;
  font-weight: bold;
}

.vat-row {
  color: #666;
}

.grand-total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #333;
  padding: 15px;
  margin-bottom: 40px;
}

.total-words {
  font-size: 14px;
  font-weight: bold;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 40px;
}

.signature-left,
.signature-right {
  flex: 1;
}

.signature-left {
  text-align: left;
}

.signature-right {
  text-align: right;
}

.signature-line {
  border-bottom: 1px solid #333;
  margin-bottom: 10px;
  height: 40px;
}

.signature-section p {
  margin: 2px 0;
  font-size: 14px;
}

.document-footer {
  text-align: center;
  font-size: 10px;
  color: #666;
  border-top: 1px solid #ccc;
  padding-top: 15px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.mr-2 {
  margin-right: 8px;
}

@media print {
  .el-dialog__wrapper {
    position: static !important;
  }

  .el-dialog {
    margin: 0 !important;
    width: 100% !important;
    max-width: none !important;
  }

  .el-dialog__header,
  .el-dialog__footer {
    display: none !important;
  }

  .invoice-document {
    margin: 0;
    padding: 0;
  }
}
</style>
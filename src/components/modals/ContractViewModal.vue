<template>
  <el-dialog v-model="dialogVisible" title="Contract Details" width="900px" :close-on-click-modal="false"
    class="contract-view-modal" top="5vh">
    <div v-if="contract" class="contract-document">
      <!-- Header -->
      <div class="document-header">
        <div class="company-info">
          <img src="@/assets/CH24.png" alt="Channel 24" class="company-logo" />
          <h1 class="company-name">CHANNEL 24 LTD.</h1>
        </div>
        <div class="document-type">
          <h2>TELEVISION CONTRACT</h2>
          <div class="client-copy" v-if="contract.clientCopy">CLIENT COPY</div>
        </div>
      </div>

      <!-- Contract Info -->
      <div class="contract-info-section">
        <div class="info-left">
          <p><strong>Between:</strong> CHANNEL24 LIMITED</p>
          <p><strong>And:</strong></p>
          <p><strong>{{ contract.advertiser }}</strong></p>
          <p>{{ contract.product }}</p>
        </div>
        <div class="info-right">
          <div class="info-row">
            <span>Contract No:</span>
            <span>{{ contract.contractNo }}</span>
          </div>
          <div class="info-row">
            <span>Contract Date:</span>
            <span>{{ contract.contractDate }}</span>
          </div>
          <div class="info-row">
            <span>Start Date:</span>
            <span>{{ contract.startDate }}</span>
          </div>
          <div class="info-row">
            <span>End Date:</span>
            <span>{{ contract.endDate }}</span>
          </div>
        </div>
      </div>

      <!-- Branding Contract Section -->
      <div class="branding-section">
        <h3>BRANDING CONTRACT</h3>
        <div class="advertiser-info">
          <div class="info-row">
            <span>Advertiser:</span>
            <span>{{ contract.advertiser }}</span>
          </div>
          <div class="info-row">
            <span>Product:</span>
            <span>{{ contract.product }}</span>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="items-table-section">
        <table class="contract-table">
          <thead>
            <tr>
              <th>SL#</th>
              <th>PARTICULARS</th>
              <th>QTY</th>
              <th>RATE (Tk.)</th>
              <th>AMOUNT (Tk.)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in contract.items" :key="item.sl">
              <td>{{ item.sl }}</td>
              <td>{{ item.particulars }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.rate) }}</td>
              <td>{{ formatCurrency(item.amount) }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="4"><strong>SPOT TOTAL Tk</strong></td>
              <td><strong>{{ formatCurrency(contract.spotTotal) }}</strong></td>
            </tr>
            <tr>
              <td colspan="4">Plus {{ contract.vatPercentage }}% VAT on Tk {{ contract.spotTotal.toLocaleString() }}
              </td>
              <td>{{ formatCurrency(contract.vatAmount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grand Total -->
      <div class="grand-total-section">
        <div class="total-words">
          <span>In Words: {{ contract.grandTotalWords }}</span>
        </div>
        <div class="total-amount">
          <span>Tk {{ formatCurrency(contract.grandTotal) }}</span>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="schedule-section">
        <div class="schedule-header">
          <div class="duration-info">
            <div class="info-row">
              <span>Duration:</span>
              <span>{{ contract.duration }}</span>
            </div>
            <div class="info-row">
              <span>On-air Description:</span>
              <span>{{ contract.onAirDescription }}</span>
            </div>
          </div>
          <div class="signature-seal">
            <span>Signature & Seal</span>
          </div>
        </div>

        <div class="branding-package">
          <h4>Branding Package</h4>
          <p>{{ contract.brandingPackage }}</p>
        </div>

        <div class="schedule-table">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Dates</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ contract.schedule.month }}</td>
                <td>{{ contract.schedule.dates }}</td>
                <td>{{ contract.schedule.description || contract.onAirDescription }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Terms Section -->
      <div class="terms-section">
        <p>{{ contract.terms }}</p>
      </div>

      <!-- Signature Section -->
      <div class="signature-section">
        <div class="signature-row">
          <div class="signature-item">
            <div class="signature-line"></div>
            <p>Prepared by: {{ contract.preparedBy }}</p>
          </div>
          <div class="signature-item">
            <div class="signature-line"></div>
            <p>Checked by: {{ contract.checkedBy }}</p>
          </div>
          <div class="signature-item">
            <div class="signature-line"></div>
            <p>Authorized by: {{ contract.authorizedBy }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="document-footer">
        <p>Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 |
          www.channel24bd.tv</p>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <el-button @click="printContract">
          <el-icon class="mr-2">
            <Printer />
          </el-icon>
          Print Contract
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
import type { Contract } from '@/stores/contracts'
import { Printer } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  contract?: Contract | null
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

const printContract = () => {
  window.print()
}
</script>

<style scoped>
.contract-view-modal {
  --el-dialog-border-radius: 16px;
}

.contract-document {
  font-family: Arial, sans-serif;
  line-height: 1.4;
  color: #333;
}

.document-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
}

.company-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
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

.document-type h2 {
  font-size: 18px;
  margin: 10px 0 5px 0;
}

.client-copy {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.contract-info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.info-left {
  flex: 1;
}

.info-right {
  text-align: right;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  min-width: 200px;
}

.branding-section {
  margin-bottom: 25px;
}

.branding-section h3 {
  text-align: center;
  font-size: 16px;
  margin-bottom: 15px;
  text-decoration: underline;
}

.advertiser-info {
  border: 1px solid #333;
  padding: 10px;
}

.items-table-section {
  margin-bottom: 25px;
}

.contract-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.contract-table th,
.contract-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
}

.contract-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.contract-table td:nth-child(2) {
  text-align: left;
}

.contract-table td:nth-child(4),
.contract-table td:nth-child(5) {
  text-align: right;
}

.total-row {
  background-color: #f9f9f9;
}

.grand-total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #333;
  padding: 10px;
  margin-bottom: 25px;
}

.total-words {
  font-size: 14px;
}

.total-amount {
  font-size: 20px;
  font-weight: bold;
}

.schedule-section {
  margin-bottom: 25px;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.signature-seal {
  text-align: right;
  font-size: 12px;
}

.branding-package {
  margin-bottom: 15px;
}

.branding-package h4 {
  text-align: center;
  margin-bottom: 10px;
}

.schedule-table table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
}

.schedule-table th {
  background-color: #f5f5f5;
}

.terms-section {
  margin-bottom: 25px;
  font-size: 12px;
  text-align: justify;
}

.signature-section {
  margin-bottom: 25px;
}

.signature-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.signature-item {
  flex: 1;
  text-align: center;
}

.signature-line {
  border-bottom: 1px solid #333;
  margin-bottom: 5px;
  height: 40px;
}

.signature-item p {
  font-size: 12px;
  margin: 0;
}

.document-footer {
  text-align: center;
  font-size: 10px;
  color: #666;
  border-top: 1px solid #ccc;
  padding-top: 10px;
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

  .contract-document {
    margin: 0;
    padding: 0;
  }
}
</style>
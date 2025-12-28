<template>
  <el-dialog v-model="dialogVisible" width="900px" :close-on-click-modal="false" class="invoice-view-modal" top="5vh">
    <div v-if="contract" class="invoice-document" id="invoiceDocument">
      <!-- Header -->
      <div class="document-header">
        <div class="company-info">
          <img src="@/assets/CH24.png" alt="Channel 24" class="company-logo" />
          <h1 class="company-name">CHANNEL 24 LTD.</h1>
        </div>
        <h2 class="invoice-title">INVOICE FOR THE MONTH OF {{ getMonthYear(contract.contractDate) }}</h2>
      </div>

      <!-- Invoice Info -->
      <div class="invoice-info-section">
        <div class="bill-to">
          <p><strong>To</strong></p>
          <p><strong>{{ getClientName() }}</strong></p>
          <p>{{ recipientAddress }}</p>
        </div>
        <div class="invoice-details">
          <div class="detail-row">
            <span>Invoice No:</span>
            <span>{{ contract.televisionContractNo }}</span>
          </div>
          <div class="detail-row">
            <span>Invoice Date:</span>
            <span>{{ formatDate(contract.contractDate) }}</span>
          </div>
          <div class="detail-row">
            <span>Contract No:</span>
            <span>{{ contract.televisionContractNo }}</span>
          </div>
          <div class="detail-row">
            <span>Contract Date:</span>
            <span>{{ formatDate(contract.contractDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Advertiser Info -->
      <div class="advertiser-section">
        <div class="advertiser-row">
          <span class="label">Advertiser</span>
          <span class="value">: {{ getClientName() }}</span>
        </div>
        <div class="advertiser-row">
          <span class="label">Product</span>
          <span class="value">: {{ getProductName() }}</span>
        </div>
      </div>

      <!-- Items Table -->
      <div class="items-table-section" v-if="contract.products && contract.products.length > 0">
        <table class="contract-table">
          <thead>
            <tr>
              <th>SL#</th>
              <th>PRODUCT NAME</th>
              <th>DESCRIPTION</th>
              <th>QTY</th>
              <th>RATE (Tk.)</th>
              <th>AMOUNT (Tk.)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(product, productIndex) in contract.products" :key="product.guid">
              <!-- Main Product Row -->
              <tr>
                <td>{{ productIndex + 1 }}</td>
                <td class="product-name-cell">{{ product.contractProductName || 'N/A' }}</td>
                <td class="description-cell">{{ product.contractProductDescription || 'N/A' }}</td>
                <td>{{ product.quantity || 0 }}</td>
                <td>{{ formatCurrency(getProductRate(product)) }}</td>
                <td>{{ formatCurrency(product.total || 0) }}</td>
              </tr>

              <!-- Product Items -->
              <tr v-for="item in product.productItems" :key="item.guid" class="product-item-row">
                <td></td>
                <td colspan="2" style="padding-left: 20px;">
                  {{ item.particularsName || 'N/A' }}
                  <span v-if="item.remarks" class="remarks-text">({{ item.remarks }})</span>
                </td>
                <td>1</td>
                <td>{{ formatCurrency(item.rate || 0) }}</td>
                <td>{{ formatCurrency(item.rate || 0) }}</td>
              </tr>
            </template>

            <!-- Totals -->
            <tr class="total-row">
              <td colspan="5"><strong>SPOT TOTAL Tk</strong></td>
              <td><strong>{{ formatCurrency(spotTotal) }}</strong></td>
            </tr>
            <tr class="vat-row">
              <td colspan="5">
                Plus {{ vatRate }}% VAT on Tk {{ formatCurrency(spotTotal) }}
              </td>
              <td>{{ formatCurrency(vatAmount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grand Total -->
      <div class="grand-total-section">
        <div class="total-words">
          <span>In Words : {{ numberToWords(grandTotal) }} Taka Only</span>
        </div>
        <div class="total-amount">
          <span>Tk {{ formatCurrency(grandTotal) }}</span>
        </div>
      </div>

      <!-- Signature Section -->
      <div class="signature-section">
        <div class="signature-left">
          <div class="signature-line"></div>
          <p><strong>Rashed Ahasan</strong></p>
          <p>Head of Marketing</p>
          <p>CHANNEL 24</p>
        </div>
        <div class="signature-right">
          <div class="signature-line"></div>
          <p><strong>M. M. Elias</strong></p>
          <p>DGM, Finance & Accounts</p>
          <p>CHANNEL 24</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="document-footer">
        <p>Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | www.channel24bd.tv</p>
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
import { computed, ref, watch } from 'vue'
import { Printer } from 'lucide-vue-next'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'
import { clientService } from '@/services/Clients/common.services'

interface Props {
  modelValue: boolean
  contract?: ITelevisionContract | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const recipientAddress = ref('N/A')

// Computed properties for nullable values
const spotTotal = computed(() => {
  if (!props.contract?.products) return 0
  return props.contract.products.reduce((total, product) => {
    const productTotal = (product.productItems || []).reduce((itemTotal, item) => {
      return itemTotal + ((item.rate || 0) * (product.quantity || 1))
    }, 0)
    return total + productTotal
  }, 0)
})

const vatRate = computed(() => props.contract?.vatRate ?? 15)
const vatAmount = computed(() => props.contract?.vat ?? (spotTotal.value * vatRate.value / 100))
const grandTotal = computed(() => spotTotal.value + vatAmount.value)

const fetchRecipientAddress = async () => {
  const guid = props.contract?.contractedClient?.guid || props.contract?.contractedAgency?.guid
  if (!guid) {
    recipientAddress.value = 'N/A'
    return
  }
  try {
    const address = await clientService.getClientById(guid)
    if (address) {
      recipientAddress.value = [address.location, address.city, address.country].filter(Boolean).join(', ')
    }
  } catch (error) {
    console.error('Error fetching address:', error)
    recipientAddress.value = 'N/A'
  }
}

watch(() => props.contract, () => {
  fetchRecipientAddress()
}, { immediate: true })

const getClientName = () => {
  if (props.contract?.contractedClient) {
    return props.contract.contractedClient.clintName
  } else if (props.contract?.contractedAgency) {
    return props.contract.contractedAgency.agencyName
  }
  return 'N/A'
}

const getProductName = () => {
  if (props.contract?.products && props.contract.products.length > 0) {
    return props.contract.products.map(p => p.contractProductName).join(', ')
  }
  return 'N/A'
}

const getProductRate = (product: any) => {
  if (product.productItems && product.productItems.length > 0) {
    return product.productItems.reduce((sum: number, item: any) => sum + (item.rate || 0), 0)
  }
  return product.total || 0
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getMonthYear = (dateString: string | null | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  if (num === 0) return 'Zero'

  const convert = (n: number): string => {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '')
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '')
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '')
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '')
  }

  return convert(Math.floor(num))
}

const printInvoice = () => {
  const element = document.getElementById('invoiceDocument')
  if (!element) return
  const elementClone = element.cloneNode(true) as HTMLElement;
  elementClone.style.width = '210mm';
  elementClone.style.transform = 'scale(0.98)';
  elementClone.style.boxSizing = 'border-box';

  const buttons = elementClone.querySelectorAll('.modal-footer, .el-dialog__header, .el-dialog__footer, .el-dialog__wrapper, .el-dialog');
  buttons.forEach(el => el.remove());
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
  overflow-x: auto;
}

.contract-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  table-layout: fixed;
}

.contract-table th,
.contract-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Column widths */
.contract-table th:nth-child(1),
.contract-table td:nth-child(1) {
  width: 40px;
}

.contract-table th:nth-child(2),
.contract-table td:nth-child(2) {
  width: 30%;
}

.contract-table th:nth-child(3),
.contract-table td:nth-child(3) {
  width: 25%;
}

.contract-table th:nth-child(4),
.contract-table td:nth-child(4) {
  width: 50px;
}

.contract-table th:nth-child(5),
.contract-table td:nth-child(5),
.contract-table th:nth-child(6),
.contract-table td:nth-child(6) {
  width: 90px;
}

.contract-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.contract-table td:nth-child(2),
.contract-table td:nth-child(3) {
  text-align: left;
}

.contract-table td:nth-child(4),
.contract-table td:nth-child(5),
.contract-table td:nth-child(6) {
  text-align: right;
}

.product-name-cell {
  font-weight: 600;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description-cell {
  color: #666;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-item-row {
  background-color: #fafafa;
}

.product-item-row td {
  font-size: 12px;
}

.remarks-text {
  font-style: italic;
  color: #666;
}

.total-row {
  background-color: #f9f9f9;
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

.long-description {
  white-space: pre-wrap;
  /* Preserve line breaks but wrap */
  word-break: break-word;
  line-height: 1.3;
  max-height: 100px;
  overflow-y: auto;
  /* Allow scrolling in view mode */
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
  .el-dialog__footer,
  .modal-footer {
    display: none !important;
  }

  .invoice-document {
    margin: 0;
    padding: 0;
  }
}
</style>
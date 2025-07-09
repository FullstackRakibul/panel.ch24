<template>
  <div class="invoice-container">
    <!-- Header Section -->
    <div class="page-header">
      <h1 class="page-title">Invoice Management</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showPreview = !showPreview">
          {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
        </el-button>
      </div>
    </div>

    <!-- Invoice Form -->
    <el-card class="invoice-form-card">
      <el-row :gutter="24">
        <!-- Left Column - Form -->
        <el-col :span="showPreview ? 14 : 24">
          <div class="form-section">
            <h2 class="section-title">Invoice Details</h2>
            <el-form :model="invoice" label-position="top">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Bill To">
                    <el-input v-model="invoice.billTo.name" placeholder="Client Name" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Invoice Number">
                    <el-input v-model="invoice.number" placeholder="Invoice Number" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Address">
                    <el-input v-model="invoice.billTo.address" placeholder="Full Address" type="textarea" :rows="2" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Due Date">
                    <el-date-picker v-model="invoice.dueDate" type="date" placeholder="Select due date" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="Advertiser">
                <el-input v-model="invoice.advertiser" placeholder="Advertiser Name" />
              </el-form-item>

              <el-form-item label="Product">
                <el-input v-model="invoice.product" placeholder="Product Name" />
              </el-form-item>

              <div class="divider-line"></div>

              <h3 class="sub-section-title">Invoice Items</h3>
              <el-form-item label="Currency">
                <el-select v-model="invoice.currency" placeholder="Select currency">
                  <el-option label="BDT - Bangladeshi Taka" value="BDT" />
                  <el-option label="USD - US Dollar" value="USD" />
                </el-select>
              </el-form-item>

              <el-table :data="invoice.items" class="items-table" border>
                <el-table-column label="SL#" width="70">
                  <template #default="{ $index }">
                    {{ $index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column label="Particulars">
                  <template #default="{ row }">
                    <el-input v-model="row.description" placeholder="Item description" />
                  </template>
                </el-table-column>
                <el-table-column label="Quantity" width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.quantity" :min="1" controls-position="right" />
                  </template>
                </el-table-column>
                <el-table-column label="Rate" width="150">
                  <template #default="{ row }">
                    <el-input-number v-model="row.rate" :min="0" :precision="2" controls-position="right">
                      <template #prefix>{{ invoice.currency }}</template>
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="Amount" width="150">
                  <template #default="{ row }">
                    <div class="amount-cell">
                      {{ invoice.currency }} {{ (row.quantity * row.rate).toFixed(2) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" width="70">
                  <template #default="{ $index }">
                    <el-button type="danger" icon="Delete" circle plain @click="removeItem($index)" />
                  </template>
                </el-table-column>
              </el-table>

              <el-button class="add-item-btn" type="primary" plain @click="addItem">
                <el-icon class="mr-1">
                  <Plus />
                </el-icon>
                Add Item
              </el-button>

              <div class="divider-line"></div>

              <el-row :gutter="20" class="totals-row">
                <el-col :span="12">
                  <el-form-item label="Subtotal">
                    <el-input-number v-model="invoice.subtotal" :min="0" :precision="2" disabled />
                  </el-form-item>

                  <el-form-item label="Tax (%)">
                    <el-input-number v-model="invoice.taxRate" :min="0" :max="100" :precision="2" />
                  </el-form-item>

                  <el-form-item label="Discount">
                    <el-input-number v-model="invoice.discount" :min="0" :precision="2" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <div class="summary-box">
                    <div class="summary-item">
                      <span>Subtotal:</span>
                      <span>{{ invoice.currency }} {{ invoice.subtotal.toFixed(2) }}</span>
                    </div>
                    <div class="summary-item">
                      <span>Tax ({{ invoice.taxRate }}%):</span>
                      <span>{{ invoice.currency }} {{ taxAmount.toFixed(2) }}</span>
                    </div>
                    <div class="summary-item">
                      <span>Discount:</span>
                      <span>{{ invoice.currency }} {{ invoice.discount.toFixed(2) }}</span>
                    </div>
                    <div class="summary-item total">
                      <span>Total:</span>
                      <span>{{ invoice.currency }} {{ invoiceTotal.toFixed(2) }}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <el-form-item label="Amount in Words">
                <el-input v-model="amountInWords" type="textarea" :rows="2" readonly />
              </el-form-item>

              <el-form-item label="Notes">
                <el-input v-model="invoice.notes" type="textarea" :rows="2" placeholder="Additional notes" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <!-- Right Column - Preview -->
        <el-col v-if="showPreview" :span="10" class="preview-column">
          <div class="preview-section">
            <h2 class="section-title">Invoice Preview</h2>
            <div class="invoice-preview">
              <!-- Invoice Header -->
              <div class="preview-header">
                <div class="company-info flex flex-row items-center gap-5 justify-center">
                  <img src="@/assets/CH24.png" alt="Channel 24" class="h-12 w-12"/>
                  <h2>CHANNEL 24 LTD.</h2>
                </div>
                <p>INVOICE FOR THE MONTH OF {{ currentMonthYear }}</p>
              </div>

              <!-- Bill To Section -->
              <div class="bill-to-section">
                <h3>To</h3>
                <div class="bill-to-details">
                  <strong>{{ invoice.billTo.name }}</strong>
                  <p>{{ invoice.billTo.address }}</p>
                </div>
              </div>

              <!-- Invoice Meta -->
              <div class="invoice-meta">
                <div class="meta-item">
                  <span>Invoice No</span>
                  <span>{{ invoice.number || 'TML2506039' }}</span>
                </div>
                <div class="meta-item">
                  <span>Invoice Date</span>
                  <span>{{ formattedInvoiceDate }}</span>
                </div>
                <div class="meta-item">
                  <span>Contract No</span>
                  <span>TML2506039</span>
                </div>
                <div class="meta-item">
                  <span>Contract Date</span>
                  <span>31 May, 2025</span>
                </div>
              </div>

              <div class="divider-line"></div>

              <!-- Advertiser Section -->
              <div class="advertiser-section">
                <h3>Advertiser</h3>
                <p>{{ invoice.advertiser || 'Mercantile Bank PLC' }}</p>
                <p><strong>Product</strong></p>
                <p>{{ invoice.product || 'Mercantile Bank PLC' }}</p>
              </div>

              <!-- Items Table -->
              <table class="items-preview-table">
                <thead>
                  <tr>
                    <th>SL#</th>
                    <th>PARTICULARS</th>
                    <th>QUANTITY</th>
                    <th>RATE ({{ invoice.currency }})</th>
                    <th>AMOUNT ({{ invoice.currency }})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in invoice.items" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.description || 'Business24' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.rate.toFixed(2) }}</td>
                    <td>{{ (item.quantity * item.rate).toFixed(2) }}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="2">SPOT TOTAL</td>
                    <td colspan="2">Plus {{ invoice.taxRate }}% VAT on {{ invoice.currency }} {{
                      invoice.subtotal.toFixed(2) }}
                    </td>
                    <td>{{ taxAmount.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Total Section -->
              <div class="total-section">
                <div class="total-in-words">
                  <p>In Words</p>
                  <p><strong>{{ amountInWords }}</strong></p>
                </div>
                <div class="total-amount">
                  <p>Total</p>
                  <p><strong>{{ invoice.currency }} {{ invoiceTotal.toFixed(2) }}</strong></p>
                </div>
              </div>

              <!-- Signatures -->
              <div class="signatures-section">
                <div class="signature">
                  <p><strong>M. M. Elias</strong></p>
                  <p>DGM, Finance & Accounts</p>
                  <p>CHANNEL 24</p>
                </div>
                <div class="signature">
                  <p><strong>Rashed Ahasan</strong></p>
                  <p>Head of Marketing</p>
                  <p>CHANNEL 24</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="invoice-footer">
                <p>Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550
                  29709 |
                  www.channel24bd.lv</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="saveInvoice">
          Save Invoice
        </el-button>
        <el-button type="success" size="large" @click="downloadInvoice">
          Download PDF
        </el-button>
        <el-button type="info" size="large">
          Send to Client
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useNumberToWords } from '@/components/ui/useNumberToWords'

// Invoice structure
interface InvoiceItem {
  description: string
  quantity: number
  rate: number
}

interface BillTo {
  name: string
  address: string
}

interface Invoice {
  number: string
  date: Date
  dueDate: Date | null
  billTo: BillTo
  advertiser: string
  product: string
  currency: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  discount: number
  notes: string
}

// Initialize invoice data
const invoice = ref<Invoice>({
  number: 'TML2506039',
  date: new Date(),
  dueDate: null,
  billTo: {
    name: 'Mercantile Bank PLC',
    address: '61,Dilkusha,Commercial Area\nDhaka-1000'
  },
  advertiser: 'Mercantile Bank PLC',
  product: 'Mercantile Bank PLC',
  currency: 'BDT',
  items: [
    { description: 'Mercantile Bank PLC "Business24"', quantity: 1, rate: 300000 }
  ],
  subtotal: 300000,
  taxRate: 15,
  discount: 0,
  notes: ''
})

const showPreview = ref(true)

// Computed properties
const currentMonthYear = computed(() => {
  const date = new Date()
  const month = date.toLocaleString('default', { month: 'long' })
  return `${month.toUpperCase()} ${date.getFullYear()}`
})

const formattedInvoiceDate = computed(() => {
  if (!invoice.value.date) return '01 Jul, 2025'
  const date = new Date(invoice.value.date)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
})

const taxAmount = computed(() => {
  return invoice.value.subtotal * (invoice.value.taxRate / 100)
})

const invoiceTotal = computed(() => {
  return invoice.value.subtotal + taxAmount.value - invoice.value.discount
})

const amountInWords = computed(() => {
  return useNumberToWords(invoiceTotal.value)
})

// Update subtotal when items change
// Watch for changes in items and update subtotal accordingly
import { watch } from 'vue'

watch(
  () => invoice.value.items,
  (items) => {
    invoice.value.subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  },
  { deep: true, immediate: true }
)

// Methods
const addItem = () => {
  invoice.value.items.push({
    description: '',
    quantity: 1,
    rate: 0
  })
}

const removeItem = (index: number) => {
  if (invoice.value.items.length > 1) {
    invoice.value.items.splice(index, 1)
  } else {
    ElMessage.warning('At least one item is required')
  }
}

const saveInvoice = () => {
  ElMessage.success('Invoice saved successfully')
  // Here you would typically make an API call
}

const downloadInvoice = () => {
  ElMessage.info('Downloading invoice as PDF')
  // Here you would typically generate and download PDF
}

// Set default due date to 30 days from now
onMounted(() => {
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30)
  invoice.value.dueDate = dueDate
})
</script>

<style scoped>
.invoice-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.invoice-form-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-section {
  padding: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.sub-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-top: 24px;
  margin-bottom: 16px;
}

.divider-line {
  height: 1px;
  background-color: #e5e7eb;
  margin: 24px 0;
}

.items-table {
  width: 100%;
  margin-bottom: 16px;
}

.amount-cell {
  padding: 0 12px;
  height: 32px;
  display: flex;
  align-items: center;
}

.add-item-btn {
  margin-bottom: 24px;
}

.totals-row {
  margin-top: 16px;
}

.summary-box {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.summary-item.total {
  font-weight: 600;
  font-size: 16px;
  border-bottom: none;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.preview-column {
  border-left: 1px solid #e5e7eb;
}

.preview-section {
  padding: 24px;
  background: white;
  height: 100%;
}

.invoice-preview {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #1f2937;
  line-height: 1.5;
  background: white;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preview-header {
  text-align: center;
  margin-bottom: 32px;
}

.company-info h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #DC6023;
}

.company-info p {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #4b5563;
}

.bill-to-section {
  margin-bottom: 24px;
}

.bill-to-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.bill-to-details {
  padding-left: 16px;
}

.invoice-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #e5e7eb;
  padding: 4px 0;
}

.meta-item span:first-child {
  font-weight: 500;
}

.advertiser-section {
  margin-bottom: 24px;
}

.advertiser-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.items-preview-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.items-preview-table th,
.items-preview-table td {
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  text-align: center;
}

.items-preview-table th {
  background-color: #f3f4f6;
  font-weight: 600;
}

.items-preview-table td:first-child,
.items-preview-table th:first-child {
  text-align: center;
}

.items-preview-table .total-row td {
  background-color: #f9fafb;
  font-weight: 600;
}

.total-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.total-in-words {
  flex: 2;
  padding-right: 24px;
}

.total-amount {
  flex: 1;
  text-align: right;
}

.signatures-section {
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #d1d5db;
}

.signature {
  text-align: center;
}

.invoice-footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid #d1d5db;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.mr-1 {
  margin-right: 4px;
}
</style>
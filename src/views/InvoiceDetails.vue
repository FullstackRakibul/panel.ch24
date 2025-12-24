<template>
  <div class="invoice-details-container">
    <!-- Page Header (consistent with new app design) -->
    <div class="page-header">
      <h1 class="page-title">Invoice Details</h1>
      <p class="page-subtitle">Viewing Invoice #{{ invoice.number || 'N/A' }}</p>
    </div>

    <!-- Invoice Document Container -->
    <el-card class="invoice-document-card">
      <div class="invoice-document-content">
        <!-- Header Section -->
        <div class="invoice-header-section">
          <div class="flex items-center gap-4 mb-4">
            <img src="@/assets/CH24.png" alt="Channel 24 Logo" class="h-10 w-10 object-contain" />
            <span class="text-2xl font-bold text-gray-800">CHANNEL 24 LTD.</span>
          </div>
          <div class="border-b border-gray-300 mb-8"></div>
          <h2 class="text-center text-xl font-bold text-gray-800 mb-8">INVOICE FOR THE MONTH OF JUNE' 2025</h2>
        </div>

        <!-- To and Invoice Info Section -->
        <div class="grid grid-cols-2 gap-x-8 mb-8 text-sm">
          <div>
            <p class="font-semibold text-gray-700 mb-2">To</p>
            <p class="font-bold text-gray-900">{{ invoice.billTo.name }}</p>
            <p class="text-gray-700">{{ invoice.billTo.address }}</p>
          </div>
          <div class="text-right">
            <div class="flex justify-between mb-1">
              <span class="text-gray-700">Invoice No :</span>
              <span class="font-semibold text-gray-900">{{ invoice.number }}</span>
            </div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-700">Invoice Date :</span>
              <span class="font-semibold text-gray-900">{{ invoice.date }}</span>
            </div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-700">Contract No :</span>
              <span class="font-semibold text-gray-900">{{ invoice.contractNo }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Contract Date :</span>
              <span class="font-semibold text-gray-900">{{ invoice.contractDate }}</span>
            </div>
          </div>
        </div>

        <!-- Advertiser/Product Section -->
        <div class="mb-8 text-sm">
          <div class="flex mb-1">
            <span class="w-24 font-semibold text-gray-700">Advertiser</span>
            <span class="flex-1 text-gray-900">: {{ invoice.advertiser }}</span>
          </div>
          <div class="flex" v-if="invoice.products && invoice.products.length > 0">
            <span class="w-24 font-semibold text-gray-700">Product(s)</span>
            <span class="flex-1 text-gray-900">: {{invoice.products.map(p => p.productName).join(', ')}}</span>
          </div>
        </div>

        <!-- Items Table -->
        <div class="items-table-wrapper mb-8">
          <template v-for="(product, pIndex) in invoice.products" :key="pIndex">
            <div v-if="invoice.products.length > 1" class="product-section-header">
              <strong>{{ product.productName }}</strong>
            </div>
            <table class="w-full border-collapse text-sm mb-4">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 py-2 px-3 text-center w-12">SL #</th>
                  <th class="border border-gray-300 py-2 px-3 text-left">PARTICULARS</th>
                  <th class="border border-gray-300 py-2 px-3 text-center w-24">QUANTITY</th>
                  <th class="border border-gray-300 py-2 px-3 text-right w-28">RATE (Tk.)</th>
                  <th class="border border-gray-300 py-2 px-3 text-right w-32">AMOUNT (Tk.)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in product.items" :key="index">
                  <td class="border border-gray-300 py-2 px-3 text-center">{{ item.sl }}</td>
                  <td class="border border-gray-300 py-2 px-3 text-left">{{ item.particularsName }}</td>
                  <td class="border border-gray-300 py-2 px-3 text-center">{{ item.quantity }}</td>
                  <td class="border border-gray-300 py-2 px-3 text-right">{{ formatCurrency(item.rate) }}</td>
                  <td class="border border-gray-300 py-2 px-3 text-right">{{ formatCurrency(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- Spot Total Row -->
          <table class="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <td colspan="4" class="border border-gray-300 py-2 px-3 text-right font-semibold">SPOT TOTAL Tk</td>
                <td class="border border-gray-300 py-2 px-3 text-right font-semibold w-32">{{
                  formatCurrency(invoice.spotTotal) }}</td>
              </tr>
              <!-- VAT Row -->
              <tr>
                <td colspan="4" class="border border-gray-300 py-2 px-3 text-right text-gray-600">Plus {{
                  invoice.vatPercentage }}% VAT on Tk {{ invoice.spotTotal.toLocaleString() }} Tk</td>
                <td class="border border-gray-300 py-2 px-3 text-right text-gray-600 w-32">{{
                  formatCurrency(invoice.vatAmount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grand Total Section -->
        <div class="flex justify-between items-center border border-gray-300 p-3 mb-16">
          <span class="text-sm font-semibold text-gray-700">In Words : {{ invoice.grandTotalWords }}</span>
          <span class="text-xl font-bold text-gray-900">Tk {{ formatCurrency(invoice.grandTotal, false) }}</span>
        </div>

        <!-- Signature Section -->
        <div class="grid grid-cols-2 gap-8 text-sm mb-16" v-if="invoice.signaturers && invoice.signaturers.length >= 2">
          <div class="text-left">
            <div class="border-t border-gray-700 pt-2 mb-1"></div>
            <p class="font-semibold text-gray-900">{{ invoice.signaturers[0]?.name }}</p>
            <p class="text-gray-700">{{ invoice.signaturers[0]?.title }}</p>
            <p class="text-gray-700">CHANNEL 24</p>
          </div>
          <div class="text-right">
            <div class="border-t border-gray-700 pt-2 mb-1"></div>
            <p class="font-semibold text-gray-900">{{ invoice.signaturers[1]?.name }}</p>
            <p class="text-gray-700">{{ invoice.signaturers[1]?.title }}</p>
            <p class="text-gray-700">CHANNEL 24</p>
          </div>
        </div>

        <!-- Footer Contact Info -->
        <div class="text-center text-xs text-gray-600 pt-4 border-t border-gray-300">
          <p>{{ invoice.footerContact }}</p>
        </div>
      </div>
    </el-card>

    <!-- Action Buttons (consistent with new app design) -->
    <div class="flex justify-center gap-4 mt-8">
      <el-button @click="$router.push('/invoices')">
        <el-icon>
          <Back />
        </el-icon>
        Back to Invoices
      </el-button>
      <el-button type="primary" @click="$router.push('/')">
        <el-icon>
          <HomeFilled />
        </el-icon>
        Back to Dashboard
      </el-button>
      <el-button type="success" @click="printInvoice">
        <el-icon>
          <Printer />
        </el-icon>
        Print Invoice
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Back,
  HomeFilled,
  Printer
} from '@element-plus/icons-vue'
import type { IInvoiceResponse, IInvoiceProduct, IInvoiceSignaturer } from '@/interface/invoice/invoice.interface'
import { invoiceService } from '@/services/Invoices/invoice.services'

const route = useRoute()

// Invoice data structure matching the API response
interface Invoice {
  id: string
  guid: string
  number: string
  date: string
  contractNo: string
  contractDate: string
  billTo: {
    name: string
    address: string
  }
  advertiser: string
  products: IInvoiceProduct[]
  signaturers: IInvoiceSignaturer[]
  spotTotal: number
  vatPercentage: number
  vatAmount: number
  grandTotalWords: string
  grandTotal: number
  footerContact: string
}

// Default invoice data
const invoice = ref<Invoice>({
  id: route.params.id as string,
  guid: '',
  number: '',
  date: '',
  contractNo: '',
  contractDate: '',
  billTo: {
    name: '',
    address: '',
  },
  advertiser: '',
  products: [],
  signaturers: [],
  spotTotal: 0,
  vatPercentage: 15,
  vatAmount: 0,
  grandTotalWords: '',
  grandTotal: 0,
  footerContact: 'Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 | www.channel24bd.tv',
})

// Function to format currency
const formatCurrency = (value: number, includeCurrencySymbol: boolean = true) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Simple print function
const printInvoice = () => {
  window.print()
}

// Load invoice data from API
const loadInvoice = async () => {
  try {
    const id = route.params.id as string
    if (id) {
      const response = await invoiceService.getInvoiceById(id)
      invoice.value = {
        id: response.id?.toString() || '',
        guid: response.guid,
        number: response.number,
        date: response.date,
        contractNo: response.contractNo,
        contractDate: response.contractDate,
        billTo: response.billTo || { name: '', address: '' },
        advertiser: response.advertiser,
        products: response.products || [],
        signaturers: response.signaturers || [],
        spotTotal: response.spotTotal,
        vatPercentage: response.vatPercentage,
        vatAmount: response.vatAmount,
        grandTotalWords: response.grandTotalWords,
        grandTotal: response.grandTotal,
        footerContact: response.footerContact,
      }
    }
  } catch (error) {
    console.error('Failed to load invoice:', error)
  }
}

onMounted(() => {
  loadInvoice()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.invoice-details-container {
  @apply p-6 bg-gray-50 min-h-screen font-poppins;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.page-header {
  @apply mb-6;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.page-subtitle {
  @apply text-base text-gray-600;
}

.invoice-document-card {
  @apply rounded-xl shadow-lg border border-gray-100;
  --el-card-padding: 0px;
}

.invoice-document-card :deep(.el-card__body) {
  @apply p-8 bg-white;
}

.invoice-document-content {
  @apply max-w-4xl mx-auto;
}

.invoice-header-section {
  @apply mb-8;
}

.invoice-header-section img {
  @apply h-10 w-auto;
}

.invoice-header-section h2 {
  @apply text-center text-xl font-bold text-gray-800 mb-8;
}

.product-section-header {
  @apply bg-gray-100 py-2 px-3 mb-2 rounded;
}

/* Specific styling for the table to match the image */
.items-table-wrapper {
  @apply overflow-x-auto;
  -webkit-overflow-scrolling: touch;
}

.items-table-wrapper table {
  @apply min-w-[700px];
}

.items-table-wrapper th,
.items-table-wrapper td {
  @apply border border-gray-300 py-2 px-3;
}

.items-table-wrapper th {
  @apply bg-gray-100 font-semibold text-gray-700 uppercase;
}

.items-table-wrapper td {
  @apply text-gray-800;
}

.items-table-wrapper td:nth-child(1),
.items-table-wrapper th:nth-child(1) {
  @apply text-center;
}

.items-table-wrapper td:nth-child(2),
.items-table-wrapper th:nth-child(2) {
  @apply text-left;
}

.items-table-wrapper td:nth-child(3),
.items-table-wrapper th:nth-child(3) {
  @apply text-center;
}

.items-table-wrapper td:nth-child(4),
.items-table-wrapper th:nth-child(4),
.items-table-wrapper td:nth-child(5),
.items-table-wrapper th:nth-child(5) {
  @apply text-right;
}

/* Signature Section */
.grid-cols-2>div {
  @apply relative;
}

.grid-cols-2>div .border-t {
  @apply absolute bottom-0 left-0 right-0;
}

/* Footer Buttons */
.el-button {
  @apply rounded-lg flex items-center gap-2;
}

/* Custom Primary Color (consistent with your app's theme) */
.text-primary-color {
  color: #A02408;
}

.el-button--primary {
  --el-button-bg-color: #A02408;
  --el-button-border-color: #A02408;
  --el-button-hover-bg-color: #c0392b;
  --el-button-hover-border-color: #c0392b;
  --el-button-active-bg-color: #7b1d0c;
  --el-button-active-border-color: #7b1d0c;
}

/* Responsive adjustments */
@media print {
  .invoice-details-container {
    padding: 0;
    background: none;
  }

  .page-header,
  .el-button {
    display: none;
  }

  .invoice-document-card {
    box-shadow: none;
    border: none;
  }

  .invoice-document-card :deep(.el-card__body) {
    padding: 0;
  }

  .invoice-document-content {
    max-width: 100%;
    margin: 0;
  }

  .items-table-wrapper {
    overflow-x: visible;
  }

  .items-table-wrapper table {
    min-width: unset;
  }
}

@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .invoice-document-card :deep(.el-card__body) {
    padding: 20px;
  }

  .invoice-document-content {
    padding: 0;
  }
}
</style>
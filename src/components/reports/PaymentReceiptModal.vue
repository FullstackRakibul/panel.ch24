<template>
  <el-dialog v-model="dialogVisible" title="Payment Receipt" width="900px" :close-on-click-modal="false"
    class="receipt-modal" top="3vh">
    <!-- Print/PDF Actions -->
    <template #header>
      <div class="modal-header">
        <h3 class="modal-title">Payment Receipt</h3>
        <div class="header-actions">
          <el-button type="primary" @click="handlePrint">
            <Printer class="w-4 h-4 mr-1" />
            Print
          </el-button>
          <el-button type="success" @click="handleDownloadPDF">
            <Download class="w-4 h-4 mr-1" />
            Download PDF
          </el-button>
        </div>
      </div>
    </template>

    <!-- Receipt Content - A4 Format -->
    <div ref="receiptRef" class="receipt-container">
      <div class="receipt-paper">
        <!-- Company Header -->
        <div class="company-header">
          <div class="company-logo">
            <div class="logo-placeholder">CH24</div>
          </div>
          <div class="company-info">
            <h1 class="company-name">Channel 24 Television</h1>
            <p class="company-address">28 Kazi Nazrul Islam Avenue, Kawran Bazar, Dhaka-1215</p>
            <p class="company-contact">Phone: +880-2-8189999 | Email: info@channel24bd.tv</p>
          </div>
        </div>

        <!-- Receipt Title -->
        <div class="receipt-title-section">
          <h2 class="receipt-title">PAYMENT RECEIPT</h2>
          <div class="receipt-meta">
            <div class="meta-item">
              <span class="meta-label">Receipt No:</span>
              <span class="meta-value">{{ payment?.paymentReference }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Date:</span>
              <span class="meta-value">{{ formatDate(payment?.paymentDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Client/Contract Info -->
        <div class="info-section">
          <div class="info-row">
            <div class="info-group">
              <span class="info-label">Received From:</span>
              <span class="info-value">{{ payment?.clientName || payment?.agencyName || 'N/A' }}</span>
            </div>
            <div class="info-group">
              <span class="info-label">Party Type:</span>
              <span class="info-value">{{ payment?.contractedPartyType }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-group">
              <span class="info-label">Contract No:</span>
              <span class="info-value">{{ payment?.contractNo }}</span>
            </div>
            <div class="info-group" v-if="payment?.invoiceNo">
              <span class="info-label">Invoice No:</span>
              <span class="info-value">{{ payment?.invoiceNo }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Details Table -->
        <div class="details-section">
          <h3 class="section-subtitle">Payment Details</h3>
          <table class="details-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Amount (Tk.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Contract Amount Paid</td>
                <td class="text-right">{{ formatCurrency(payment?.contractAmount || 0) }}</td>
              </tr>
              <tr>
                <td>VAT Amount Paid</td>
                <td class="text-right">{{ formatCurrency(payment?.vatAmount || 0) }}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total Amount Paid</strong></td>
                <td class="text-right"><strong>{{ formatCurrency(payment?.paidAmount || 0) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Amount in Words -->
        <div class="amount-words-section">
          <span class="words-label">Amount in Words:</span>
          <span class="words-value">{{ amountInWords }} Only</span>
        </div>

        <!-- Payment Method -->
        <div class="method-section">
          <div class="method-row">
            <div class="method-item">
              <span class="method-label">Payment Mode:</span>
              <span class="method-value">{{ formatPaymentType(payment?.paymentType) }}</span>
            </div>
            <div class="method-item">
              <span class="method-label">Payment Category:</span>
              <span class="method-value">{{ formatPaymentCategory(payment?.paymentCategory) }}</span>
            </div>
          </div>
          <div class="method-row" v-if="payment?.bankName || payment?.checkRef || payment?.transactionId">
            <div class="method-item" v-if="payment?.bankName">
              <span class="method-label">Bank:</span>
              <span class="method-value">{{ payment?.bankName }} {{ payment?.branchName ? `(${payment.branchName})` : ''
              }}</span>
            </div>
            <div class="method-item" v-if="payment?.checkRef">
              <span class="method-label">Check No:</span>
              <span class="method-value">{{ payment?.checkRef }}</span>
            </div>
            <div class="method-item" v-if="payment?.transactionId">
              <span class="method-label">Transaction ID:</span>
              <span class="method-value">{{ payment?.transactionId }}</span>
            </div>
          </div>
        </div>

        <!-- Remarks -->
        <div class="remarks-section" v-if="payment?.remarks">
          <span class="remarks-label">Remarks:</span>
          <span class="remarks-value">{{ payment?.remarks }}</span>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Signatures -->
        <div class="signatures-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-label">Received By</p>
            <p class="signature-name">{{ payment?.receivedBy || '________________' }}</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-label">Approved By</p>
            <p class="signature-name">{{ payment?.approvedBy || '________________' }}</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-label">Client/Agency</p>
            <p class="signature-name">________________</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="receipt-footer">
          <p>This is a computer generated receipt.</p>
          <p>Printed on: {{ currentDateTime }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Printer, Download } from 'lucide-vue-next'
import { paymentUtils } from '@/services/Payments/payment.services'
import { useNumberToWords } from '@/components/helper/useNumberToWords.js'
import type { IPayment } from '@/interface/payment/payments.interface'
import html2pdf from 'html2pdf.js'

interface Props {
  modelValue: boolean
  payment: IPayment | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const receiptRef = ref<HTMLElement | null>(null)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Computed
const formatCurrency = (value: number) => paymentUtils.formatCurrency(value)
const formatDate = (date: string | undefined) => date ? paymentUtils.formatDate(date) : ''

const formatPaymentType = (type: string | undefined) => {
  if (!type) return ''
  const mapping: Record<string, string> = {
    'BankTransfer': 'Bank Transfer',
    'MobileBanking': 'Mobile Banking',
  }
  return mapping[type] || type
}

const formatPaymentCategory = (category: string | undefined) => {
  if (!category) return ''
  const mapping: Record<string, string> = {
    'ContractAmount': 'Contract Amount',
    'VatAmount': 'VAT Amount',
  }
  return mapping[category] || category
}

const amountInWords = computed(() => {
  return useNumberToWords(props.payment?.paidAmount || 0)
})

const currentDateTime = computed(() => {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Methods
const handlePrint = () => {
  const printContent = receiptRef.value?.innerHTML
  if (!printContent) return

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt - ${props.payment?.paymentReference}</title>
      <style>
        @page { size: A4; margin: 10mm; }
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; }
        ${getReceiptStyles()}
      </style>
    </head>
    <body>
      ${printContent}
    </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

const handleDownloadPDF = async () => {
  if (!receiptRef.value) return

  const options = {
    margin: 10,
    filename: `Payment_Receipt_${props.payment?.paymentReference}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  }

  await html2pdf().set(options).from(receiptRef.value).save()
}

const getReceiptStyles = () => `
  .receipt-paper {
    max-width: 210mm;
    margin: 0 auto;
    padding: 20px;
    background: white;
  }
  .company-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #1a365d;
  }
  .logo-placeholder {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #1a365d, #2d4a7c);
    color: white;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
  .company-name { font-size: 24px; font-weight: bold; color: #1a365d; margin: 0; }
  .company-address, .company-contact { margin: 2px 0; color: #4a5568; font-size: 12px; }
  .receipt-title-section { text-align: center; margin: 20px 0; }
  .receipt-title { font-size: 20px; color: #1a365d; margin-bottom: 15px; letter-spacing: 2px; }
  .receipt-meta { display: flex; justify-content: center; gap: 40px; }
  .meta-label { font-weight: 600; color: #4a5568; }
  .meta-value { font-weight: 500; }
  .divider { height: 1px; background: #e2e8f0; margin: 20px 0; }
  .info-section { margin: 20px 0; }
  .info-row { display: flex; gap: 40px; margin-bottom: 10px; }
  .info-label { font-weight: 600; color: #4a5568; min-width: 120px; }
  .info-value { font-weight: 500; }
  .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  .details-table th, .details-table td { padding: 10px; border: 1px solid #e2e8f0; }
  .details-table th { background: #f7fafc; font-weight: 600; text-align: left; }
  .text-right { text-align: right; }
  .total-row { background: #edf2f7; }
  .amount-words-section { background: #f0fff4; padding: 12px; border-radius: 6px; margin: 15px 0; }
  .words-label { font-weight: 600; color: #276749; }
  .words-value { font-style: italic; }
  .method-section { margin: 20px 0; }
  .method-row { display: flex; gap: 30px; margin-bottom: 8px; }
  .method-label { font-weight: 600; color: #4a5568; }
  .signatures-section { display: flex; justify-content: space-between; margin-top: 60px; }
  .signature-box { text-align: center; min-width: 150px; }
  .signature-line { border-top: 1px solid #000; margin-bottom: 8px; }
  .signature-label { font-size: 12px; color: #4a5568; margin: 0; }
  .signature-name { font-weight: 500; margin: 5px 0 0; }
  .receipt-footer { text-align: center; margin-top: 30px; font-size: 11px; color: #718096; }
`
</script>

<style scoped>
.receipt-modal :deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.receipt-container {
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
  background: #f5f5f5;
}

.receipt-paper {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 30px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.company-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #1a365d;
}

.logo-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1a365d, #2d4a7c);
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #1a365d;
  margin: 0;
}

.company-address,
.company-contact {
  margin: 2px 0;
  color: #4a5568;
  font-size: 12px;
}

.receipt-title-section {
  text-align: center;
  margin: 20px 0;
}

.receipt-title {
  font-size: 20px;
  color: #1a365d;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.receipt-meta {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.meta-item {
  display: flex;
  gap: 8px;
}

.meta-label {
  font-weight: 600;
  color: #4a5568;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 20px 0;
}

.info-section {
  margin: 20px 0;
}

.info-row {
  display: flex;
  gap: 40px;
  margin-bottom: 10px;
}

.info-group {
  display: flex;
  gap: 8px;
}

.info-label {
  font-weight: 600;
  color: #4a5568;
  min-width: 100px;
}

.details-section {
  margin: 20px 0;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
}

.details-table th,
.details-table td {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
}

.details-table th {
  background: #f7fafc;
  font-weight: 600;
  text-align: left;
}

.text-right {
  text-align: right;
}

.total-row {
  background: #edf2f7;
}

.amount-words-section {
  background: #f0fff4;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 15px 0;
}

.words-label {
  font-weight: 600;
  color: #276749;
  margin-right: 8px;
}

.words-value {
  font-style: italic;
}

.method-section {
  margin: 20px 0;
}

.method-row {
  display: flex;
  gap: 30px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.method-item {
  display: flex;
  gap: 6px;
}

.method-label {
  font-weight: 600;
  color: #4a5568;
}

.remarks-section {
  margin: 15px 0;
  padding: 10px;
  background: #fffaf0;
  border-radius: 4px;
}

.remarks-label {
  font-weight: 600;
  color: #c05621;
  margin-right: 8px;
}

.signatures-section {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  padding-top: 20px;
}

.signature-box {
  text-align: center;
  min-width: 150px;
}

.signature-line {
  border-top: 1px solid #000;
  margin-bottom: 8px;
}

.signature-label {
  font-size: 12px;
  color: #4a5568;
  margin: 0;
}

.signature-name {
  font-weight: 500;
  margin: 5px 0 0;
}

.receipt-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 11px;
  color: #718096;
}

.receipt-footer p {
  margin: 3px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
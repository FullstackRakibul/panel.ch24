<template>
  <el-dialog v-model="dialogVisible" title="Contract Payment Summary" width="1000px" :close-on-click-modal="false"
    class="summary-modal" top="3vh">
    <template #header>
      <div class="modal-header">
        <h3 class="modal-title">Contract Payment Summary</h3>
        <div class="header-actions">
          <el-button type="primary" @click="handlePrint">
            <Printer class="w-4 h-4 mr-1" /> Print
          </el-button>
          <el-button type="success" @click="handleDownloadPDF">
            <Download class="w-4 h-4 mr-1" /> Download PDF
          </el-button>
        </div>
      </div>
    </template>

    <div ref="reportRef" class="report-container">
      <div class="report-paper">
        <!-- Company Header -->
        <div class="company-header">
          <div class="company-logo">
            <img src="@/assets/CH24.png" alt="Channel 24" class="company-logo" />
          </div>
          <div class="company-info">
            <h1 class="company-name">Channel 24</h1>
            <p class="company-address">Times Media Limited, 387 (South), Tejgaon I/A, Dhaka-1208</p>
            <p class="company-contact">Phone: +8802 55029724 | Email: info@channel24bd.tv</p>
          </div>
        </div>

        <div class="report-title-section">
          <h2 class="report-title">CONTRACT PAYMENT SUMMARY</h2>
          <div class="report-meta">
            <div class="meta-item">
              <span class="meta-label">Contract No:</span>
              <span class="meta-value">{{ summary?.contractNo }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Total Amount:</span>
              <span class="meta-value">Tk. {{ formatCurrency(summary?.totalAmount || 0) }}</span>
            </div>
          </div>
        </div>

        <!-- summary info -->
        <div class="info-section">
          <div class="info-row">
            <div class="info-group">
              <span class="info-label">Advertiser : </span>
              <span class="info-value">{{ summary?.clientName || summary?.agencyName || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <table class="summary-details-table">
          <thead>
            <tr>
              <th>Payment Date</th>
              <th>Reference No</th>
              <th>Method</th>
              <th class="text-right">Contract Amt</th>
              <th class="text-right">Comm. Amt</th>
              <th class="text-right">VAT Amt</th>
              <th class="text-right">Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.guid">
              <td>{{ formatDate(payment.paymentDate) }}</td>
              <td>{{ payment.paymentReference }}</td>
              <td>{{ payment.paymentType }}</td>
              <td class="text-right">{{ formatCurrency(payment.contractAmount) }}</td>
              <td class="text-right">{{ formatCurrency(payment.commissionAmount) }}</td>
              <td class="text-right">{{ formatCurrency(payment.vatAmount || 0) }}</td>
              <td class="text-right"><strong>{{ formatCurrency(payment.paidAmount) }}</strong></td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3" class="text-right"><strong>TOTAL RECEIVED</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(totalContract) }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(totalCommission) }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(totalVat) }}</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(summary?.totalPaidAmount || 0) }}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="financial-summary">
          <div class="summary-line">
            <span>Grand Total Amount:</span>
            <span>Tk. {{ formatCurrency(summary?.totalAmount || 0) }}</span>
          </div>
          <div class="summary-line">
            <span>Total Received Amount:</span>
            <span class="text-success">Tk. {{ formatCurrency(summary?.totalPaidAmount || 0) }}</span>
          </div>
          <div class="summary-line due">
            <span>Current Outstanding Due:</span>
            <span class="text-danger">Tk. {{ formatCurrency(summary?.totalDueAmount || 0) }}</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Signatures (similar to receipt) -->
        <div class="signatures-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-label">Prepared By</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-label">Checked By</p>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-label">Authorized Signature</p>
          </div>
        </div>

        <div class="report-footer">
          <p>This is a system generated statement.</p>
          <p>Printed on: {{ currentDateTime }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Printer, Download } from 'lucide-vue-next'
import { paymentUtils } from '@/services/Payments/payment.services'
import type { IAllContractsPaymentSummary, IPayment } from '@/interface/payment/payments.interface'
import html2pdf from 'html2pdf.js'

interface Props {
  modelValue: boolean
  summary: IAllContractsPaymentSummary | null
  payments: IPayment[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const reportRef = ref<HTMLElement | null>(null)
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const formatCurrency = (v: number) => paymentUtils.formatCurrency(v)
const formatDate = (d: string) => paymentUtils.formatDate(d)

const totalContract = computed(() => props.payments.reduce((s, p) => s + (p.contractAmount || 0), 0))
const totalCommission = computed(() => props.payments.reduce((s, p) => s + (p.commissionAmount || 0), 0))
const totalVat = computed(() => props.payments.reduce((s, p) => s + (p.vatAmount || 0), 0))

const currentDateTime = computed(() => new Date().toLocaleString())

const handlePrint = () => {
  const content = reportRef.value?.innerHTML
  if (!content) return
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<html><head><title>Summary - ${props.summary?.contractNo}</title><style>${getStyles()}</style></head><body>${content}</body></html>`)
  win.document.close()
  setTimeout(() => { win.print(); win.close(); }, 250)
}

const handleDownloadPDF = async () => {
  if (!reportRef.value) return
  const opt = {
    margin: 10,
    filename: `Summary_${props.summary?.contractNo}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
  }
  await html2pdf().set(opt).from(reportRef.value).save()
}

const getStyles = () => `
  .report-paper { padding: 20px; font-family: sans-serif; }
  .company-header { display: flex; align-items: center; border-bottom: 2px solid #1a365d; padding-bottom: 10px; margin-bottom: 20px; }
  .company-logo { width: 20px; margin-right: 15px; }
  .company-name { font-size: 22px; color: #1a365d; margin: 0; }
  .report-title-section { text-align: center; margin-bottom: 20px; }
  .report-title { font-size: 18px; text-decoration: underline; margin-bottom: 10px; }
  .report-meta { display: flex; justify-content: center; gap: 30px; }
  .summary-details-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .summary-details-table th, .summary-details-table td { border: 1px solid #ccc; padding: 8px; }
  .summary-details-table th { background: #f0f0f0; }
  .text-right { text-align: right; }
  .total-row { background: #eee; font-weight: bold; }
  .financial-summary { margin-top: 20px; width: 300px; margin-left: auto; }
  .summary-line { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
  .summary-line.due { font-weight: bold; border-top: 2px solid #1a365d; margin-top: 5px; }
  .signatures-section { display: flex; justify-content: space-between; margin-top: 50px; }
  .signature-box { text-align: center; border-top: 1px solid #000; padding-top: 5px; min-width: 150px; }
  .text-success { color: green; }
  .text-danger { color: red; }
`
</script>

<style scoped>
.report-container {
  max-height: 75vh;
  overflow-y: auto;
  background: #f9f9f9;
  padding: 20px;
}

.report-paper {
  background: white;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 210mm;
  min-height: 297mm;
  padding: 40px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.company-logo {
  width: 80px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.info-label {
  font-weight: bold;
  padding: 0 5px;
}

.report-paper {
  padding: 20px;
  font-family: sans-serif;
}

.company-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #1a365d;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.company-logo {
  width: 50px;
  margin-right: 15px;
}

.company-name {
  font-size: 22px;
  color: #1a365d;
  margin: 0;
}

.report-title-section {
  text-align: center;
  margin-bottom: 20px;
}

.report-title {
  font-size: 18px;
  text-decoration: underline;
  margin-bottom: 10px;
}

.report-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.summary-details-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.summary-details-table th,
.summary-details-table td {
  border: 1px solid #ccc;
  padding: 8px;
}

.summary-details-table th {
  background: #f0f0f0;
}

.text-right {
  text-align: right;
}

.total-row {
  background: #eee;
  font-weight: bold;
}

.financial-summary {
  margin-top: 20px;
  width: 300px;
  margin-left: auto;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.summary-line.due {
  font-weight: bold;
  border-top: 2px solid #1a365d;
  margin-top: 5px;
}

.signatures-section {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.signature-box {
  text-align: center;
  border-top: 1px solid #000;
  padding-top: 5px;
  min-width: 150px;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}
</style>
<template>
  <el-dialog v-model="dialogVisible" width="900px" :close-on-click-modal="false" class="contract-view-modal" top="5vh">
    <div v-if="contract" class="contract-document" ref="contractDocument">
      <!-- Header -->
      <div class="document-header">
        <div class="company-info">
          <img src="@/assets/CH24.png" alt="Channel 24" class="company-logo" />
          <h1 class="company-name">CHANNEL 24 LTD.</h1>
        </div>
        <div class="document-type">
          <h2>TELEVISION CONTRACT</h2>
          <div class="client-copy">CLIENT COPY</div>
        </div>
      </div>

      <!-- Contract Info -->
      <div class="contract-info-section">
        <div class="info-left">
          <p><strong>Between:</strong> CHANNEL24 LIMITED</p>
          <p><strong>And:</strong></p>
          <p v-if="contract.contractedClient"><strong>{{ contract.contractedClient.clintName }}</strong></p>
          <p v-else-if="contract.contractedAgency"><strong>{{ contract.contractedAgency.agencyName }}</strong></p>
          <p v-else><strong>N/A</strong></p>
          <p>{{ getClientContactInfo() }}</p>
        </div>
        <div class="info-right">
          <div class="info-row">
            <span>Contract No:</span>
            <span>{{ contract.televisionContractNo }}</span>
          </div>
          <div class="info-row">
            <span>Contract Date:</span>
            <span>{{ formatDate(contract.contractDate) }}</span>
          </div>
          <div class="info-row">
            <span>Start Date:</span>
            <span>{{ formatDate(contract.contractStartDate) }}</span>
          </div>
          <div class="info-row">
            <span>End Date:</span>
            <span>{{ formatDate(contract.contractEndDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Branding Contract Section -->
      <div class="branding-section">
        <h3>BRANDING CONTRACT</h3>
        <div class="advertiser-info">
          <div class="info-row">
            <span>Advertiser:</span>
            <span>{{ getAdvertiserName() }}</span>
          </div>
          <div class="info-row">
            <span>Contract Type:</span>
            <span>{{ contract.contractedClient ? 'Direct Client' : 'Agency' }}</span>
          </div>
        </div>
      </div>

      <!-- Products Table -->
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
              <tr v-for="(item, itemIndex) in product.productItems" :key="item.guid" class="product-item-row">
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
              <td colspan="5"><strong>SUBTOTAL Tk</strong></td>
              <td><strong>{{ formatCurrency(calculateSubtotal()) }}</strong></td>
            </tr>
            <tr>
              <td colspan="5">
                Plus {{ contract.vatRate || 0 }}% VAT on Tk {{ formatCurrency(calculateSubtotal()) }}
              </td>
              <td>{{ formatCurrency(contract.vat || 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grand Total -->
      <div class="grand-total-section">
        <div class="total-words">
          <span>In Words: {{ amountToWords(contract.total || 0) }}</span>
        </div>
        <div class="total-amount">
          <span>Tk {{ formatCurrency(contract.total || 0) }}</span>
        </div>
      </div>

      <!-- On Air Descriptions Section -->
      <div class="schedule-section" v-if="contract.onAirDescriptions && contract.onAirDescriptions.length > 0">
        <div class="schedule-header">
          <div class="duration-info">
            <div class="info-row">
              <span>Contract Duration:</span>
              <span>{{ formatDate(contract.contractStartDate) }} to {{ formatDate(contract.contractEndDate) }}</span>
            </div>
          </div>
          <div class="signature-seal">
            <span>Signature & Seal</span>
          </div>
        </div>

        <div class="schedule-table" v-for="(onAirDesc, index) in contract.onAirDescriptions" :key="onAirDesc.guid">
          <h4>On Air Description {{ contract.onAirDescriptions.length > 1 ? index + 1 : '' }}</h4>
          <table>
            <thead>
              <tr>
                <th class="description-type">Description Type</th>
                <th class="description-text">Description</th>
                <th class="duration">Duration</th>
                <th class="schedule">Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ onAirDesc.descriptionTypeName || onAirDesc.descriptionType || 'N/A' }}</td>
                <td class="long-description">{{ onAirDesc.descriptionText || 'N/A' }}</td>
                <td>{{ onAirDesc.onAirDuration || 'N/A' }}</td>
                <td>
                  <div v-if="onAirDesc.transmissionSchedule && onAirDesc.transmissionSchedule.length > 0">
                    <div v-for="schedule in onAirDesc.transmissionSchedule" :key="schedule.guid">
                      {{ formatDate(schedule.dateValue) }} ({{ schedule.durationInMinute }} mins)
                    </div>
                  </div>
                  <div v-else>No schedule</div>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="onAirDesc.remarks" class="remarks-section">Remarks: {{ onAirDesc.remarks }}</p>
        </div>
      </div>

      <!-- Remarks Section -->
      <div class="terms-section" v-if="contract.remarks">
        <h4>Remarks</h4>
        <p>{{ contract.remarks }}</p>
      </div>

      <!-- Signature Section -->
      <div class="signature-section">
        <div class="signature-row">
          <div class="signature-item">
            <div class="signature-line"></div>
            <p>Prepared by: ___________________</p>
          </div>
          <div class="signature-item">
            <div class="signature-line"></div>
            <p>Checked by: ___________________</p>
          </div>
          <div class="signature-item">
            <div class="signature-line"></div>
            <p>Authorized by: ___________________</p>
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
        <el-button @click="downloadPDF" :loading="isGeneratingPDF" type="success">
          <el-icon class="mr-2">
            <Download />
          </el-icon>
          {{ isGeneratingPDF ? 'Generating PDF...' : 'Download PDF' }}
        </el-button>
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
import { computed, ref } from 'vue'
import { Printer, Download } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'

interface Props {
  modelValue: boolean
  contract?: ITelevisionContract | null
}

const props = defineProps<Props>()
const contractDocument = ref<HTMLElement>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isGeneratingPDF = ref(false)


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-BD')
}

const getAdvertiserName = () => {
  if (props.contract?.contractedClient) {
    return props.contract.contractedClient.clintName
  } else if (props.contract?.contractedAgency) {
    return props.contract.contractedAgency?.agencyName
  }
  return 'N/A'
}

const getClientContactInfo = () => {
  if (props.contract?.contractedClient) {
    const client = props.contract.contractedClient
    return `${client.email || ''} ${client.phone || ''}`.trim()
  } else if (props.contract?.contractedAgency) {
    const agency = props.contract.contractedAgency
    return `${agency?.email || ''}`.trim()
  }
  return 'N/A'
}

const getProductRate = (product: any) => {
  if (product.productItems && product.productItems.length > 0) {
    return product.productItems.reduce((sum: number, item: any) => sum + (item.rate || 0), 0)
  }
  return product.total || 0
}

const calculateSubtotal = () => {
  if (!props.contract?.products) return 0
  return props.contract.products.reduce((sum, product) => sum + (product.total || 0), 0)
}

const amountToWords = (amount: number): string => {
  // Simple implementation - you might want to use a more robust solution
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  if (amount === 0) return 'Zero Taka'
  if (amount > 999999) return 'Amount too large to convert'

  // This is a simplified version - consider using a proper library for full implementation
  return `${amount.toFixed(2)} Taka only`
}

const printContract = () => {

  const element = contractDocument.value
  if (!element) return

  const elementClone = element.cloneNode(true) as HTMLElement;
  // Apply PDF-specific styles to clone
  elementClone.style.width = '210mm';
  elementClone.style.transform = 'scale(0.98)';
  elementClone.style.boxSizing = 'border-box';

  const buttons = elementClone.querySelectorAll('.modal-footer, .el-dialog__header, .el-dialog__footer,.el-dialog__wrapper,.el-dialog');
  buttons.forEach(el => el.remove());

  window.print()
}

const downloadPDF = async () => {
  if (!props.contract) return

  isGeneratingPDF.value = true

  try {
    const element = contractDocument.value
    if (!element) {
      throw new Error('Contract document not found')
    }

    const contractNo = props.contract.televisionContractNo || 'Contract'
    const filename = `${contractNo}_${new Date().getTime()}.pdf`



    const opt = {
      margin: [5, 5, 5, 5] as [number, number, number, number],
      filename,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: {
        scale: 0.98,
        useCORS: true,
        letterRendering: true,
        logging: false,
        windowWidth: element.scrollWidth, // Match modal width
        windowHeight: element.scrollHeight
        // windowHeight: 1000,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const,
        compress: true // Enable compression
      },
      pagebreak: { mode: 'avoid-all' as const }
    }

    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('PDF generation failed:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    isGeneratingPDF.value = false
  }
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

.contract-table td:nth-child(2),
.contract-table td:nth-child(3) {
  text-align: left;
}

.contract-table td:nth-child(4),
.contract-table td:nth-child(5),
.contract-table td:nth-child(6) {
  text-align: right;
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

.schedule-table {
  margin-bottom: 20px;
}

.schedule-table h4 {
  text-align: center;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  padding: 5px;
}

.schedule-table table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: left;
}

.schedule-table th {
  background-color: #f5f5f5;
}

.remarks-section {
  font-size: 12px;
  font-style: italic;
  margin-top: 5px;
  color: #666;
}

.terms-section {
  margin-bottom: 25px;
  font-size: 12px;
  text-align: justify;
}

.terms-section h4 {
  margin-bottom: 5px;
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

/* Print Styles for A4 Paper */
@media print {

  /* Hide dialog wrapper */
  :deep(.el-dialog__wrapper) {
    position: static !important;
    background: white !important;
  }

  :deep(.el-dialog) {
    margin: 0 !important;
    width: 100% !important;
    max-width: none !important;
    box-shadow: none !important;
  }

  /* Hide all buttons and modal controls */
  .modal-footer,
  :deep(.el-dialog__header),
  :deep(.el-dialog__footer) {
    display: none !important;
  }

  :deep(.el-dialog__body) {
    padding: 0 !important;
  }

  /* A4 Page Settings - tighter margins for more content */
  @page {
    size: A4 portrait;
    margin: 10mm 12mm;
  }

  .contract-document {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 210mm;
    background: white;
    font-size: 9pt;
    /* Smaller font for more content */
    line-height: 1.3;
    /* Tighter line spacing */
    transform: scale(0.95);
    /* Slightly scale down to fit more */
    transform-origin: top left;
  }

  /* Ensure images print correctly */
  .company-logo {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Table print optimization */
  .contract-table,
  .schedule-table table {
    page-break-inside: auto;
  }

  .contract-table tr,
  .schedule-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  .contract-table thead,
  .schedule-table thead {
    display: table-header-group;
  }

  .contract-table tfoot,
  .schedule-table tfoot {
    display: table-footer-group;
  }

  /* Ensure backgrounds print */
  .contract-table th,
  .schedule-table th,
  .total-row,
  .product-item-row {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Signature section - always on new page if needed */
  .signature-section {
    page-break-before: auto;
    page-break-inside: avoid;
  }

  /* Avoid breaking these sections */
  .document-header,
  .contract-info-section,
  .branding-section,
  .grand-total-section,
  .terms-section {
    page-break-inside: avoid;
  }

  /* Footer at bottom */
  .document-footer {
    page-break-inside: avoid;
    position: relative;
    bottom: 0;
  }
}

/* Additional print-optimized styles */
.contract-document {
  box-sizing: border-box;
}

.contract-document * {
  box-sizing: border-box;
}

/* Additional compact print styles */
@media print {
  .company-logo {
    width: 30px !important;
    height: 30px !important;
  }

  .document-header {
    margin-bottom: 12px !important;
    padding-bottom: 8px !important;
  }

  .contract-info-section,
  .branding-section,
  .items-table-section,
  .grand-total-section,
  .schedule-section,
  .terms-section,
  .signature-section {
    margin-bottom: 10px !important;
  }

  .contract-table th,
  .contract-table td,
  .schedule-table th,
  .schedule-table td {
    padding: 3px 5px !important;
    font-size: 8pt !important;
  }

  .signature-line {
    height: 25px !important;
  }

  .signature-item p {
    font-size: 8pt !important;
  }

  .document-footer {
    font-size: 7pt !important;
    margin-top: 8px !important;
    padding-top: 5px !important;
  }
}


/* Add these styles to your existing CSS */

/* Table cell wrapping fixes */
.contract-table th,
.contract-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
  word-wrap: break-word;
  /* Ensures long words break */
  overflow-wrap: break-word;
  /* Modern property for word breaking */
  hyphens: auto;
  /* Optional: adds hyphenation where needed */
}

/* Specific styles for description columns */
.contract-table td:nth-child(2),
/* PRODUCT NAME */
.contract-table td:nth-child(3) {
  /* DESCRIPTION */
  text-align: left;
  max-width: 150px;
  /* Limit width to prevent overflow */
  min-width: 100px;
  /* Ensure minimum width */
}

/* For product items description */
.product-item-row td[colspan="2"] {
  max-width: 200px;
  /* Limit width for long descriptions */
  word-break: break-word;
  /* Force break long words */
}

/* On Air Description table fixes */
.schedule-table th,
.schedule-table td {
  border: 1px solid #333;
  padding: 8px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.schedule-table td:nth-child(2) {
  /* Description column */
  max-width: 250px;
  min-width: 150px;
}

.schedule-table td:nth-child(4) {
  /* Schedule column */
  max-width: 200px;
  min-width: 120px;
}


/* Enhanced table styling for PDF */
.contract-table {
  table-layout: fixed;
  /* Use fixed layout for consistent column widths */
  width: 100%;
}

/* Column width definitions */
.contract-table th:nth-child(1) {
  width: 5%;
}

/* SL# */
.contract-table th:nth-child(2) {
  width: 20%;
}

/* PRODUCT NAME */
.contract-table th:nth-child(3) {
  width: 30%;
}

/* DESCRIPTION */
.contract-table th:nth-child(4) {
  width: 10%;
}

/* QTY */
.contract-table th:nth-child(5) {
  width: 15%;
}

/* RATE */
.contract-table th:nth-child(6) {
  width: 15%;
}

/* AMOUNT */

/* Text truncation with ellipsis for very long text */
.description-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  /* Allow wrapping */
  line-height: 1.3;
}

/* For print/PDF, show full text */
@media print {
  .description-cell {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
    max-height: none !important;
  }
}

/* Schedule table column widths */
.schedule-table {
  table-layout: fixed;
  width: 100%;
}

.schedule-table th.description-type {
  width: 15%;
}

.schedule-table th.description-text {
  width: 40%;
}

.schedule-table th.duration {
  width: 15%;
}

.schedule-table th.schedule {
  width: 30%;
}

/* Long description handling */
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
  .long-description {
    overflow-y: visible;
    max-height: none;
  }
}

/* Modal width adjustment for better PDF generation */
.contract-view-modal :deep(.el-dialog) {
  max-width: 950px;
  /* Slightly wider for better content fit */
}

.contract-document {
  max-width: 900px;
  margin: 0 auto;
}

/* Enhanced print styles */
@media print {

  /* Force table rendering */
  .contract-table,
  .schedule-table {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Allow table cells to expand for content */
  .contract-table td,
  .schedule-table td {
    max-width: none !important;
    min-width: auto !important;
    overflow: visible !important;
    white-space: normal !important;
  }

  /* Ensure all text is visible */
  .long-description,
  .description-cell {
    max-height: none !important;
    overflow: visible !important;
  }

  /* Reduce font size for better fit */
  .contract-document {
    font-size: 8pt;
    line-height: 1.2;
  }

  /* Adjust padding for compact print */
  .contract-table th,
  .contract-table td {
    padding: 2px 4px !important;
  }
}

/* Add this to your style section */
@media print {

  /* Hide ALL modal-related elements */
  body * {
    visibility: hidden;
  }

  .contract-document,
  .contract-document * {
    visibility: visible;
  }

  .contract-document {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  /* Specifically hide dialog container */
  :deep(.el-dialog) {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  /* Force hide header and close button */
  :deep(.el-dialog__header),
  :deep(.el-dialog__headerbtn),
  :deep(.el-dialog__close) {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
}
</style>
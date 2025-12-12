<template>
  <el-dialog v-model="dialogVisible" width="900px" :close-on-click-modal="false" class="certificate-view-modal"
    top="5vh">
    <div v-if="contract" class="certificate-document" ref="certificateDocument">
      <!-- Header -->
      <div class="document-header">
        <div class="company-info">
          <img src="@/assets/CH24.png" alt="Channel 24" class="company-logo" />
          <h1 class="company-name">CHANNEL 24 LTD.</h1>
        </div>
        <div class="document-type">
          <h2>TRANSMISSION CERTIFICATE</h2>
        </div>
      </div>

      <!-- Recipient Info -->
      <div class="recipient-info">
        <p class="recipient-name"><strong>{{ getRecipientName() }}</strong></p>
        <p class="recipient-address">{{ getRecipientAddress() }}</p>
      </div>

      <!-- Body Text -->
      <div class="body-text">
        <p>The following commercials have been duly transmitted during the month of {{
          getMonthYear(contract.contractStartDate) }} from CHANNEL24 LIMITED as per contracted terms and conditions</p>
      </div>

      <!-- Contract Info -->
      <div class="contract-info">
        <div class="info-row">
          <span class="label">Contract No</span>
          <span class="separator">:</span>
          <span class="value"><strong>{{ contract.televisionContractNo }}</strong></span>
        </div>
        <div class="info-row">
          <span class="label">Contract Date</span>
          <span class="separator">:</span>
          <span class="value">{{ formatDate(contract.contractDate) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Advertiser</span>
          <span class="separator">:</span>
          <span class="value">{{ getAdvertiserName() }}</span>
        </div>
        <div class="info-row">
          <span class="label">Product</span>
          <span class="separator">:</span>
          <span class="value">{{ getProductName() }}</span>
        </div>
      </div>

      <!-- Transmission Schedule Table -->
      <div class="schedule-section">
        <h3>Transmission Schedule</h3>
        <table class="schedule-table">
          <thead>
            <tr>
              <th class="duration-col">Duration</th>
              <th class="month-col">{{ getMonthYear(contract.contractStartDate) }}</th>
              <th class="description-col">On-air Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="desc in contract.onAirDescriptions" :key="desc.guid">
              <td class="duration-cell">{{ desc.onAirDuration }}</td>
              <td class="dates-cell">
                <div class="dates-content">
                  {{ getFormattedDates(desc) }}
                </div>
              </td>
              <td class="description-cell">
                <div class="description-content">
                  <div class="main-description">
                    <div class="desc-type"><u>{{ desc.descriptionTypeName || desc.descriptionType }}</u></div>
                    <div class="desc-text">{{ desc.descriptionText }}</div>
                  </div>
                  <div class="vertical-text" v-if="desc.descriptionTypeName">
                    {{ desc.descriptionTypeName }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Signatures -->
      <div class="signature-section">
        <div class="signature-item left">
          <div class="signature-box">
            <!-- Placeholder for signature image or space -->
          </div>
          <div class="signature-line"></div>
          <p><strong>Rashed Ahasan</strong></p>
          <p>Head of Marketing</p>
          <p>CHANNEL 24</p>
        </div>
        <div class="signature-item right">
          <div class="signature-box">
            <!-- Placeholder for signature image or space -->
          </div>
          <div class="signature-line"></div>
          <p><strong>M. M. Elias</strong></p>
          <p>DGM, Finance & Accounts</p>
          <p>CHANNEL 24</p>
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
        <el-button @click="printCertificate">
          <el-icon class="mr-2">
            <Printer />
          </el-icon>
          Print Certificate
        </el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Close
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Printer, Download } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
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

const isGeneratingPDF = ref(false)
const certificateDocument = ref<HTMLElement>()

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
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const getRecipientName = () => {
  if (props.contract?.contractedClient) {
    return props.contract.contractedClient.clintName
  } else if (props.contract?.contractedAgency) {
    return props.contract.contractedAgency.agencyName
  }
  return 'N/A'
}

const getRecipientAddress = async () => {

  const address = await clientService.getClientById(props.contract?.contractedClient?.guid || props.contract?.contractedAgency?.guid || '')

  console.log("props clients address", address)
  return address.location + ', ' + address.city + ', ' + address.country
}

const getAdvertiserName = () => {
  if (props.contract?.contractedClient) {
    return props.contract.contractedClient.clintName
  } else if (props.contract?.contractedAgency) {
    // If agency is the contracted party, we might need a separate field for Advertiser
    // For now, using Agency name or a placeholder if available in remarks
    return 'Square Toiletries Limited' // Placeholder based on image, should come from contract data
  }
  return 'N/A'
}

const getProductName = () => {
  if (props.contract?.products && props.contract.products.length > 0) {
    return props.contract.products[0].contractProductName
  }
  return 'Kool' // Placeholder
}

const getFormattedDates = (desc: any) => {
  if (!desc.transmissionSchedule || desc.transmissionSchedule.length === 0) return ''

  // Extract days from dates
  const days = desc.transmissionSchedule.map((s: any) => {
    const date = new Date(s.dateValue)
    return date.getDate().toString().padStart(2, '0')
  }).sort()

  return days.join(',')
}

const printCertificate = () => {
  const element = certificateDocument.value
  if (!element) return

  const elementClone = element.cloneNode(true) as HTMLElement;
  elementClone.style.width = '210mm';
  elementClone.style.transform = 'scale(0.98)';
  elementClone.style.boxSizing = 'border-box';

  const buttons = elementClone.querySelectorAll('.modal-footer, .el-dialog__header, .el-dialog__footer, .el-dialog__wrapper, .el-dialog');
  buttons.forEach(el => el.remove());

  window.print()
}

const downloadPDF = async () => {
  if (!props.contract) return

  isGeneratingPDF.value = true

  try {
    const element = certificateDocument.value
    if (!element) throw new Error('Document not found')

    const contractNo = props.contract.televisionContractNo || 'Certificate'
    const filename = `Transmission_Certificate_${contractNo}.pdf`

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 0.98,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const
      }
    }

    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('PDF generation failed:', error)
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>

<style scoped>
.certificate-view-modal {
  --el-dialog-border-radius: 0;
}

.certificate-document {
  font-family: 'Times New Roman', Times, serif;
  /* Matching the formal look */
  color: #000;
  padding: 20px;
  background: white;
  max-width: 210mm;
  margin: 0 auto;
}

.document-header {
  text-align: center;
  margin-bottom: 30px;
}

.company-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.company-logo {
  width: 50px;
  height: 50px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  font-family: Arial, sans-serif;
  /* Logo text usually sans-serif */
}

.document-type h2 {
  font-size: 18px;
  text-decoration: underline;
  text-transform: uppercase;
  margin: 0;
}

.recipient-info {
  margin-bottom: 25px;
  line-height: 1.4;
}

.recipient-name {
  font-size: 16px;
  margin-bottom: 5px;
}

.body-text {
  margin-bottom: 25px;
  text-align: justify;
  line-height: 1.5;
}

.contract-info {
  margin-bottom: 25px;
}

.info-row {
  display: flex;
  margin-bottom: 5px;
}

.info-row .label {
  width: 120px;
  font-weight: bold;
}

.info-row .separator {
  width: 20px;
  text-align: center;
  font-weight: bold;
}

.info-row .value {
  flex: 1;
}

.schedule-section h3 {
  text-decoration: underline;
  margin-bottom: 10px;
  font-size: 16px;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  border: 1px solid #000;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

.schedule-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.duration-col {
  width: 15%;
}

.month-col {
  width: 25%;
}

.description-col {
  width: 60%;
}

.dates-content {
  word-break: break-all;
  font-size: 14px;
}

.description-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 100%;
}

.main-description {
  flex: 1;
  text-align: center;
}

.desc-type {
  font-weight: bold;
  margin-bottom: 5px;
}

.desc-text {
  white-space: pre-wrap;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: bold;
  padding: 0 10px;
  border-right: 1px solid #000;
  /* Actually left because rotated */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  margin-bottom: 20px;
}

.signature-item {
  text-align: center;
  width: 200px;
}

.signature-box {
  height: 50px;
  /* Space for signature */
}

.signature-line {
  border-bottom: 1px solid #000;
  margin-bottom: 5px;
}

.signature-item p {
  margin: 2px 0;
  font-size: 14px;
}

.document-footer {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  text-align: center;
  font-size: 10px;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Print Styles */
@media print {

  .certificate-view-modal :deep(.el-dialog__header),
  .certificate-view-modal :deep(.el-dialog__footer),
  .modal-footer {
    display: none !important;
  }

  .certificate-view-modal :deep(.el-dialog__body) {
    padding: 0 !important;
  }

  .certificate-document {
    width: 100%;
    max-width: none;
    padding: 0;
    margin: 0;
  }

  @page {
    size: A4 portrait;
    margin: 10mm;
  }
}
</style>
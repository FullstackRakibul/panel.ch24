<template>
  <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Edit Contract' : 'Create New Contract / Booking Info'"
    width="900px" :close-on-click-modal="false" :close-on-press-escape="false" class="contract-modal font-sans"
    top="5vh" @close="handleDialogClose">
    <el-form ref="formRef" :model="contractModalStore.contractModalData" :rules="rules" label-position="top"
      size="default" class="contract-form" :disabled="isLoading">
      <!-- Basic Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">📋
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Contract Number" prop="televisionContractNo">
              <el-input v-model="contractModalStore.contractModalData.televisionContractNo"
                placeholder="e.g., TML2506039" :disabled="isEditMode" @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Contract Date" prop="contractDate">
              <el-date-picker v-model="contractModalStore.contractModalData.contractDate" type="date"
                placeholder="Select date" class="w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Contract Type">
              <el-select v-model="contractType" placeholder="Client or Agency" class="w-full"
                @change="handleContractTypeChange">
                <el-option label="Client" value="client" />
                <el-option label="Agency" value="agency" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="contractType === 'client' ? 'Client Name' : 'Agency Name'"
              :prop="contractType === 'client' ? 'contractedClientId' : 'contractedAgencyId'">
              <el-select v-model="selectedEntityId"
                :placeholder="`Select ${contractType === 'client' ? 'client' : 'agency'}`" class="w-full" filterable
                clearable @change="handleEntityChange">
                <el-option v-for="item in contractType === 'client' ? clients : agencies" :key="item.guid"
                  :label="item.clintName || item.agencyName" :value="item.guid">
                  <div class="flex justify-between items-center w-full">
                    <span class="font-medium">
                      {{ contractType === 'client' ? item.clintName : item.agencyName }}
                    </span>
                    <span v-if="item.email" class="text-xs text-gray-500 ml-2">{{ item.email }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Contract Duration">
              <div class="flex gap-2 items-center">
                <el-date-picker v-model="contractModalStore.contractModalData.contractStartDate" type="date"
                  placeholder="Start date" class="flex-1" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                  @change="handleFormChange" />
                <span class="text-gray-400">to</span>
                <el-date-picker v-model="contractModalStore.contractModalData.contractEndDate" type="date"
                  placeholder="End date" class="flex-1" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                  @change="handleFormChange" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Advertisement Details Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold">🎬
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Advertisement Details</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Advertiser Name" prop="advertiserName">
              <el-input v-model="contractModalStore.contractModalData.advertiserName"
                placeholder="Enter advertiser name" @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Name" prop="productName">
              <el-input v-model="contractModalStore.contractModalData.productName" placeholder="Enter product name"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Particulars / Description" prop="particulars">
              <el-input v-model="contractModalStore.contractModalData.particulars" type="textarea" :rows="2"
                placeholder="Enter advertisement details" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Pricing Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold">💰
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Calculation</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Quantity" prop="quantity">
              <el-input-number v-model="contractModalStore.contractModalData.quantity" :min="1"
                controls-position="right" class="w-full" @change="calculateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Rate (Tk.)" prop="rate">
              <el-input-number v-model="contractModalStore.contractModalData.rate" :min="0" :precision="2"
                controls-position="right" class="w-full" @change="calculateTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Amount (Tk.)" prop="amount">
              <el-input :value="formatCurrency(contractModalStore.contractModalData.amount)" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Spot Total (Tk.)" prop="spotTotal">
              <el-input :value="formatCurrency(contractModalStore.contractModalData.spotTotal)" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="VAT (15%)">
              <el-input :value="formatCurrency(contractModalStore.contractModalData.vatAmount)" disabled
                class="bg-blue-50" />
            </el-form-item>
          </el-col>
          <el-col :span="8" />
          <el-col :span="8">
            <el-form-item label="Grand Total (Tk.)" class="grand-total">
              <el-input :value="formatCurrency(contractModalStore.contractModalData.grandTotal)" disabled
                class="bg-gradient-to-r from-blue-50 to-blue-100 font-bold text-lg text-blue-700" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Amount in Words">
              <el-input v-model="contractModalStore.contractModalData.inWords"
                placeholder="Auto-filled from grand total" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Additional Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold">📝
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
          </div>
        </div>

        <el-form-item label="Remarks" prop="remarks">
          <el-input v-model="contractModalStore.contractModalData.remarks" type="textarea" :rows="3"
            placeholder="Enter any additional remarks or special terms" @input="handleFormChange" />
        </el-form-item>
      </div>

      <!-- Draft Actions -->
      <div v-if="contractModalStore.hasContractModalData && !isEditMode" class="draft-actions">
        <el-alert title="Draft Saved"
          description="Your form data has been auto-saved. You can continue where you left off." type="info"
          :closable="false" show-icon />
        <div class="draft-buttons">
          <el-button size="small" @click="clearDraft">Clear Draft</el-button>
          <el-button size="small" type="primary" @click="restoreDraft">Restore Draft</el-button>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <el-button size="large" @click="handleClose" :disabled="isLoading">
          Cancel
        </el-button>
        <el-button type="primary" size="large" :loading="isLoading" @click="handleSubmit">
          {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Contract' : 'Create Contract') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useContractModalStore } from '@/stores/contract-modal.store'

interface Props {
  modelValue: boolean
  isEdit?: boolean
  loading?: boolean
  contract?: any | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
  contract: null
})

const emit = defineEmits<Emits>()

const contractModalStore = useContractModalStore()
const formRef = ref<FormInstance>()

const isLoading = ref(false)
const contractType = ref<'client' | 'agency'>('client')
const selectedEntityId = ref<string | null>(null)
const clients = ref<any[]>()
const agencies = ref<any[]>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditMode = computed(() => props.isEdit)

const rules = {
  televisionContractNo: [
    { required: true, message: 'Please enter contract number', trigger: 'blur' }
  ],
  contractDate: [
    { required: true, message: 'Please select contract date', trigger: 'change' }
  ],
  advertiserName: [
    { required: true, message: 'Please enter advertiser name', trigger: 'blur' }
  ],
  productName: [
    { required: true, message: 'Please enter product name', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: 'Please enter quantity', trigger: 'blur' }
  ],
  rate: [
    { required: true, message: 'Please enter rate', trigger: 'blur' }
  ]
}

const handleFormChange = debounce(() => {
  if (!isEditMode.value) {
    contractModalStore.saveToLocalStorage()
  }
}, 500)

const handleContractTypeChange = () => {
  selectedEntityId.value = null
  contractModalStore.contractModalData.contractedClientId = null
  contractModalStore.contractModalData.contractedAgencyId = null
}

const handleEntityChange = () => {
  if (contractType.value === 'client') {
    contractModalStore.contractModalData.contractedClientId = selectedEntityId.value
  } else {
    contractModalStore.contractModalData.contractedAgencyId = selectedEntityId.value
  }
  handleFormChange()
}

const calculateTotal = () => {
  const quantity = contractModalStore.contractModalData.quantity || 1
  const rate = contractModalStore.contractModalData.rate || 0
  const amount = quantity * rate
  const vatAmount = amount * 0.15
  const grandTotal = amount + vatAmount

  contractModalStore.contractModalData.amount = amount
  contractModalStore.contractModalData.spotTotal = amount
  contractModalStore.contractModalData.vatAmount = vatAmount
  contractModalStore.contractModalData.grandTotal = grandTotal
  contractModalStore.contractModalData.inWords = numberToWords(grandTotal)

  handleFormChange()
}

const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const scales = ['', 'Thousand', 'Lakh', 'Crore']

  if (num === 0) return 'Zero'

  let words = ''
  let scaleIndex = 0

  while (num > 0) {
    let groupDigits = num % 1000
    if (groupDigits !== 0) {
      words = convertHundreds(groupDigits, ones, teens, tens) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (words ? ' ' + words : '')
    }
    num = Math.floor(num / 1000)
    scaleIndex++
  }

  return words.trim() + ' Taka Only'
}

const convertHundreds = (num: number, ones: string[], teens: string[], tens: string[]): string => {
  let result = ''
  const hundreds = Math.floor(num / 100)
  const remainder = num % 100

  if (hundreds > 0) {
    result += ones[hundreds] + ' Hundred'
  }

  if (remainder >= 20) {
    result += (result ? ' ' : '') + tens[Math.floor(remainder / 10)]
    if (remainder % 10 > 0) {
      result += ' ' + ones[remainder % 10]
    }
  } else if (remainder > 0) {
    result += (result ? ' ' : '') + teens[remainder - 10]
  }

  return result
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
  }).format(value)
}

const handleDialogClose = () => {
  dialogVisible.value = false
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    calculateTotal()

    const submitData = {
      ...contractModalStore.contractModalData,
      id: isEditMode.value ? props.contract?.id : Date.now().toString()
    }

    emit('save', submitData)
    handleClose()
  } catch (error) {
    ElMessage.error('Please fill in all required fields correctly.')
  }
}

const clearDraft = () => {
  contractModalStore.resetContractModalData()
  contractModalStore.clearLocalStorage()
  ElMessage.success('Draft cleared')
}

const restoreDraft = () => {
  contractModalStore.loadFromLocalStorage()
  ElMessage.success('Draft restored')
}

watch(() => props.contract, (newContract) => {
  if (newContract) {
    contractModalStore.setContractModalData(newContract)
    contractModalStore.isEditMode = true
    contractModalStore.editingContractId = newContract.id
    contractType.value = newContract.contractedClientId ? 'client' : 'agency'
    selectedEntityId.value = newContract.contractedClientId || newContract.contractedAgencyId
  } else {
    if (!contractModalStore.hasContractModalData) {
      contractModalStore.resetContractModalData()
    }
    contractModalStore.isEditMode = false
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible) {
    contractModalStore.loadFromLocalStorage()
  }
})

onMounted(() => {
  contractModalStore.loadFromLocalStorage()
})
</script>

<style scoped>
.contract-modal {
  --el-dialog-border-radius: 16px;
}

.contract-form {
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 8px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

.draft-actions {
  margin-top: 20px;
  padding: 16px;
  background: var(--el-color-info-light-9);
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-5);
}

.draft-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
}

.grand-total :deep(.el-input__wrapper) {
  background: linear-gradient(135deg, rgb(219 234 254) 0%, rgb(191 219 254) 100%);
  border-color: rgb(147 197 253);
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

@media (max-width: 768px) {
  .contract-modal {
    --el-dialog-width: 90vw;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .modal-footer .el-button {
    width: 100%;
  }
}
</style>
<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Contract' : 'Add New Contract / Booking info.'"
    width="900px" :close-on-click-modal="false" :close-on-press-escape="false" class="contract-modal font-sans"
    top="5vh">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default" class="contract-form">
      <!-- Basic Information -->
      <div class="form-section">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Contract No" prop="contractNo">
              <el-input v-model="form.contractNo" placeholder="Enter contract number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Contract Date" prop="contractDate">
              <el-date-picker v-model="form.contractDate" type="date" placeholder="Select date" class="w-full"
                format="DD MMM, YYYY" value-format="DD MMM, YYYY" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Client Copy">
              <el-switch v-model="form.clientCopy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Start Date" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="Select start date" class="w-full"
                format="DD MMM, YYYY" value-format="DD MMM, YYYY" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="End Date" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" placeholder="Select end date" class="w-full"
                format="DD MMM, YYYY" value-format="DD MMM, YYYY" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Advertiser" prop="advertiser">
              <el-input v-model="form.advertiser" placeholder="Enter advertiser name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product" prop="product">
              <el-input v-model="form.product" placeholder="Enter product name" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Contract Items -->
      <div class="form-section">
        <h3 class="section-title">Contract Items</h3>
        <div v-for="(item, index) in form.items" :key="index" class="item-row">
          <el-row :gutter="16" align="middle">
            <el-col :span="2">
              <el-form-item label="SL#">
                <el-input-number v-model="item.sl" :min="1" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Particulars">
                <el-input v-model="item.particulars" placeholder="Enter particulars" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="Quantity">
                <el-input-number v-model="item.quantity" :min="1" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="Rate (Tk.)">
                <el-input-number v-model="item.rate" :min="0" :precision="2" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label="Amount">
                <span class="amount-display">{{ formatCurrency(item.quantity * item.rate) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label=" ">
                <el-button v-if="form.items.length > 1" type="danger" :icon="Minus" circle @click="removeItem(index)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" :icon="Plus" plain @click="addItem">Add Item</el-button>
      </div>

      <!-- Branding Package Details -->
      <div class="form-section">
        <h3 class="section-title">Branding Package</h3>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Duration">
              <el-input v-model="form.duration" placeholder="e.g., June 2025" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="On-air Description">
              <el-input v-model="form.onAirDescription" placeholder="e.g., Branding Package" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Branding Package Details">
          <el-input v-model="form.brandingPackage" type="textarea" :rows="3"
            placeholder="Enter detailed branding package description" />
        </el-form-item>

        <h4 class="subsection-title">Schedule</h4>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Month">
              <el-input v-model="form.schedule.month" placeholder="e.g., 1 Month" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="Dates">
              <el-input v-model="form.schedule.dates" placeholder="e.g., 01,02,03..." />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Terms and Authorization -->
      <div class="form-section">
        <h3 class="section-title">Terms & Authorization</h3>
        <el-form-item label="Terms & Conditions">
          <el-input v-model="form.terms" type="textarea" :rows="3" placeholder="Enter terms and conditions" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Prepared By">
              <el-input v-model="form.preparedBy" placeholder="Enter name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Checked By">
              <el-input v-model="form.checkedBy" placeholder="Enter name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Authorized By">
              <el-input v-model="form.authorizedBy" placeholder="Enter name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Status">
          <el-select v-model="form.status" placeholder="Select status" class="w-full">
            <el-option label="Draft" value="draft" />
            <el-option label="Active" value="active" />
            <el-option label="Completed" value="completed" />
            <el-option label="Cancelled" value="cancelled" />
          </el-select>
        </el-form-item>
      </div>

      <!-- Totals Summary -->
      <div class="form-section">
        <h3 class="section-title">Summary</h3>
        <div class="totals-summary">
          <div class="total-row">
            <span>Spot Total:</span>
            <span>{{ formatCurrency(spotTotal) }}</span>
          </div>
          <div class="total-row">
            <span>VAT (15%):</span>
            <span>{{ formatCurrency(vatAmount) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>{{ formatCurrency(grandTotal) }}</span>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <el-button size="large" @click="handleClose">
          Cancel
        </el-button>
        <el-button type="primary" size="large" :loading="loading" :disabled="!isFormValid" @click="handleSubmit">
          {{ loading ? 'Saving...' : (isEdit ? 'Update Contract' : 'Create Contract') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import type * as _ from "../../stores/contracts"
import { Plus, Minus } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  contract?: _.Contract | null
  isEdit?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  contract: null,
  isEdit: false,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [contract: _.Contract]
}>()

const formRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref<_.Contract>({
  contractNo: '',
  contractDate: '',
  clientCopy: true,
  startDate: '',
  endDate: '',
  advertiser: '',
  product: '',
  items: [
    {
      sl: 1,
      particulars: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ],
  spotTotal: 0,
  vatPercentage: 15,
  vatAmount: 0,
  grandTotal: 0,
  grandTotalWords: '',
  duration: '',
  onAirDescription: '',
  brandingPackage: '',
  schedule: {
    month: '',
    dates: '',
    description: ''
  },
  terms: 'I/We request CHANNEL24 LIMITED to transmit the above mention Spot. I/We agree to abide by the tariff rate and to the terms and conditions over leaf and indemnify CHANNEL24 LIMITED against all legal action by reason of the transmission of any advertisement material.',
  preparedBy: '',
  checkedBy: '',
  authorizedBy: '',
  status: 'draft'
})

const rules = {
  contractNo: [
    { required: true, message: 'Please enter contract number', trigger: 'blur' }
  ],
  contractDate: [
    { required: true, message: 'Please select contract date', trigger: 'change' }
  ],
  advertiser: [
    { required: true, message: 'Please enter advertiser name', trigger: 'blur' }
  ],
  product: [
    { required: true, message: 'Please enter product name', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: 'Please select start date', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: 'Please select end date', trigger: 'change' }
  ]
}

const spotTotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
})

const vatAmount = computed(() => {
  return spotTotal.value * (form.value.vatPercentage / 100)
})

const grandTotal = computed(() => {
  return spotTotal.value + vatAmount.value
})

const isFormValid = computed(() => {
  return form.value.contractNo.trim() &&
    form.value.contractDate &&
    form.value.advertiser.trim() &&
    form.value.product.trim() &&
    form.value.startDate &&
    form.value.endDate
})

watch(() => props.contract, (newContract) => {
  if (newContract) {
    form.value = { ...newContract }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible && !props.contract) {
    resetForm()
  }
})

// Update computed values in form
watch([spotTotal, vatAmount, grandTotal], () => {
  form.value.spotTotal = spotTotal.value
  form.value.vatAmount = vatAmount.value
  form.value.grandTotal = grandTotal.value
  form.value.grandTotalWords = numberToWords(grandTotal.value)
})

const resetForm = () => {
  form.value = {
    contractNo: '',
    contractDate: '',
    clientCopy: true,
    startDate: '',
    endDate: '',
    advertiser: '',
    product: '',
    items: [
      {
        sl: 1,
        particulars: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    spotTotal: 0,
    vatPercentage: 15,
    vatAmount: 0,
    grandTotal: 0,
    grandTotalWords: '',
    duration: '',
    onAirDescription: '',
    brandingPackage: '',
    schedule: {
      month: '',
      dates: '',
      description: ''
    },
    terms: 'I/We request CHANNEL24 LIMITED to transmit the above mention Spot. I/We agree to abide by the tariff rate and to the terms and conditions over leaf and indemnify CHANNEL24 LIMITED against all legal action by reason of the transmission of any advertisement material.',
    preparedBy: '',
    checkedBy: '',
    authorizedBy: '',
    status: 'draft'
  }
  formRef.value?.clearValidate()
}

const addItem = () => {
  form.value.items.push({
    sl: form.value.items.length + 1,
    particulars: '',
    quantity: 1,
    rate: 0,
    amount: 0
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
  // Reorder SL numbers
  form.value.items.forEach((item, idx) => {
    item.sl = idx + 1
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const numberToWords = (num: number): string => {
  // Simple number to words conversion for Bangladeshi Taka
  if (num === 0) return 'Zero Taka Only'

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const convertHundreds = (n: number): string => {
    let result = ''
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' '
      n %= 10
    } else if (n >= 10) {
      result += teens[n - 10] + ' '
      return result
    }
    if (n > 0) {
      result += ones[n] + ' '
    }
    return result
  }

  let result = ''
  const crores = Math.floor(num / 10000000)
  const lacs = Math.floor((num % 10000000) / 100000)
  const thousands = Math.floor((num % 100000) / 1000)
  const hundreds = num % 1000

  if (crores > 0) {
    result += convertHundreds(crores) + 'Crore '
  }
  if (lacs > 0) {
    result += convertHundreds(lacs) + 'Lac '
  }
  if (thousands > 0) {
    result += convertHundreds(thousands) + 'Thousand '
  }
  if (hundreds > 0) {
    result += convertHundreds(hundreds)
  }

  return result.trim() + ' Taka Only'
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('save', form.value)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<style scoped>
.contract-modal {
  --el-dialog-border-radius: 16px;
}

.contract-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 20px 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 16px 0 12px 0;
}

.item-row {
  background: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.amount-display {
  font-weight: 600;
  color: var(--el-color-primary);
}

.totals-summary {
  background: var(--el-fill-color-lighter);
  padding: 20px;
  border-radius: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.total-row:last-child {
  border-bottom: none;
}

.grand-total {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

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
<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Invoice' : 'Create New Invoice'" width="800px"
    :close-on-click-modal="false" :close-on-press-escape="false" class="invoice-modal" top="5vh">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default" class="invoice-form">
      <!-- Basic Information -->
      <div class="form-section">
        <h3 class="section-title">Invoice Information</h3>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Invoice No" prop="number">
              <el-input v-model="form.number" placeholder="Enter invoice number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Invoice Date" prop="date">
              <el-date-picker v-model="form.date" type="date" placeholder="Select date" class="w-full"
                format="DD MMM, YYYY" value-format="DD MMM, YYYY" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Due Date" prop="dueDate">
              <el-date-picker v-model="form.dueDate" type="date" placeholder="Select due date" class="w-full"
                format="DD MMM, YYYY" value-format="DD MMM, YYYY" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Contract No" prop="contractNo">
              <el-input v-model="form.contractNo" placeholder="Enter contract number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Contract Date" prop="contractDate">
              <el-date-picker v-model="form.contractDate" type="date" placeholder="Select contract date" class="w-full"
                format="DD MMM, YYYY" value-format="DD MMM, YYYY" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Status">
              <el-select v-model="form.status" placeholder="Select status" class="w-full">
                <el-option label="Draft" value="draft" />
                <el-option label="Sent" value="sent" />
                <el-option label="Paid" value="paid" />
                <el-option label="Overdue" value="overdue" />
                <el-option label="Cancelled" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Bill To Information -->
      <div class="form-section">
        <h3 class="section-title">Bill To</h3>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Client Name" prop="billTo.name">
              <el-input v-model="form.billTo.name" placeholder="Enter client name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Address" prop="billTo.address">
              <el-input v-model="form.billTo.address" type="textarea" :rows="3" placeholder="Enter client address" />
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

      <!-- Invoice Items -->
      <div class="form-section">
        <h3 class="section-title">Invoice Items</h3>
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

      <!-- Signature Information -->
      <div class="form-section">
        <h3 class="section-title">Signature Information</h3>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Signature 1 Name">
              <el-input v-model="form.signature1Name" placeholder="Enter name" />
            </el-form-item>
            <el-form-item label="Signature 1 Title">
              <el-input v-model="form.signature1Title" placeholder="Enter title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Signature 2 Name">
              <el-input v-model="form.signature2Name" placeholder="Enter name" />
            </el-form-item>
            <el-form-item label="Signature 2 Title">
              <el-input v-model="form.signature2Title" placeholder="Enter title" />
            </el-form-item>
          </el-col>
        </el-row>
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
          <div class="total-row">
            <span>In Words:</span>
            <span class="words-text">{{ grandTotalWords }}</span>
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
          {{ loading ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import type { Invoice } from '@/stores/invoices'
import { Plus, Minus } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  invoice?: Invoice | null
  isEdit?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  invoice: null,
  isEdit: false,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [invoice: Invoice]
}>()

const formRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref<Invoice>({
  number: '',
  date: '',
  contractNo: '',
  contractDate: '',
  billTo: {
    name: '',
    address: ''
  },
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
  signature1Name: 'Rashed Ahasan',
  signature1Title: 'Head of Marketing',
  signature2Name: 'M. M. Elias',
  signature2Title: 'DGM, Finance & Accounts',
  footerContact: 'Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 | www.channel24bd.tv',
  status: 'draft',
  dueDate: ''
})

const rules = {
  number: [
    { required: true, message: 'Please enter invoice number', trigger: 'blur' }
  ],
  date: [
    { required: true, message: 'Please select invoice date', trigger: 'change' }
  ],
  contractNo: [
    { required: true, message: 'Please enter contract number', trigger: 'blur' }
  ],
  contractDate: [
    { required: true, message: 'Please select contract date', trigger: 'change' }
  ],
  'billTo.name': [
    { required: true, message: 'Please enter client name', trigger: 'blur' }
  ],
  'billTo.address': [
    { required: true, message: 'Please enter client address', trigger: 'blur' }
  ],
  advertiser: [
    { required: true, message: 'Please enter advertiser name', trigger: 'blur' }
  ],
  product: [
    { required: true, message: 'Please enter product name', trigger: 'blur' }
  ],
  dueDate: [
    { required: true, message: 'Please select due date', trigger: 'change' }
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

const grandTotalWords = computed(() => {
  return numberToWords(grandTotal.value)
})

const isFormValid = computed(() => {
  return form.value.number.trim() &&
    form.value.date &&
    form.value.contractNo.trim() &&
    form.value.contractDate &&
    form.value.billTo.name.trim() &&
    form.value.billTo.address.trim() &&
    form.value.advertiser.trim() &&
    form.value.product.trim() &&
    form.value.dueDate
})

watch(() => props.invoice, (newInvoice) => {
  if (newInvoice) {
    form.value = { ...newInvoice }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible && !props.invoice) {
    resetForm()
  }
})

// Update computed values in form
watch([spotTotal, vatAmount, grandTotal, grandTotalWords], () => {
  form.value.spotTotal = spotTotal.value
  form.value.vatAmount = vatAmount.value
  form.value.grandTotal = grandTotal.value
  form.value.grandTotalWords = grandTotalWords.value
})

const resetForm = () => {
  form.value = {
    number: '',
    date: '',
    contractNo: '',
    contractDate: '',
    billTo: {
      name: '',
      address: ''
    },
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
    signature1Name: 'Rashed Ahasan',
    signature1Title: 'Head of Marketing',
    signature2Name: 'M. M. Elias',
    signature2Title: 'DGM, Finance & Accounts',
    footerContact: 'Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 | www.channel24bd.tv',
    status: 'draft',
    dueDate: ''
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
.invoice-modal {
  --el-dialog-border-radius: 16px;
}

.invoice-form {
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

.words-text {
  font-style: italic;
  color: var(--el-text-color-regular);
  font-size: 14px;
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
  .invoice-modal {
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
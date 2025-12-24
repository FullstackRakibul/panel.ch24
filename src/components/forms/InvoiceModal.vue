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
            <el-form-item label="Status" prop="statusId">
              <el-select v-model="form.statusId" placeholder="Select status" class="w-full">
                <el-option label="Draft" :value="1" />
                <el-option label="Sent" :value="2" />
                <el-option label="Paid" :value="3" />
                <el-option label="Overdue" :value="4" />
                <el-option label="Cancelled" :value="5" />
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
              <el-input v-model="form.billTo?.name" placeholder="Enter client name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Address" prop="billTo.address">
              <el-input v-model="form.billTo?.address" type="textarea" :rows="3" placeholder="Enter client address" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Advertiser" prop="advertiser">
              <el-input v-model="form.advertiser" placeholder="Enter advertiser name" />
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
                <el-input v-model="item.particularsName" placeholder="Enter particulars" />
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

      <!-- Signaturers Section -->
      <div class="form-section">
        <h3 class="section-title">Signaturers</h3>
        <div v-for="(signaturer, index) in form.signaturers" :key="index" class="signaturer-row">
          <el-row :gutter="16" align="middle">
            <el-col :span="6">
              <el-form-item :label="'Signaturer ' + (index + 1)">
                <el-select v-model="signaturer.signaturerId" placeholder="Select signaturer" class="w-full"
                  @change="(val: number) => updateSignaturerInfo(index, val)">
                  <el-option v-for="s in availableSignaturers" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Name">
                <el-input v-model="signaturer.name" disabled placeholder="Name" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Title">
                <el-input v-model="signaturer.title" disabled placeholder="Title" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="Sort Order">
                <el-input-number v-model="signaturer.sortOrder" :min="1" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label=" ">
                <el-button v-if="form.signaturers.length > 1" type="danger" :icon="Minus" circle
                  @click="removeSignaturer(index)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" :icon="Plus" plain @click="addSignaturer">Add Signaturer</el-button>
      </div>

      <!-- Footer Contact -->
      <div class="form-section">
        <h3 class="section-title">Footer Contact</h3>
        <el-form-item prop="footerContact">
          <el-input v-model="form.footerContact" type="textarea" :rows="2" placeholder="Enter footer contact info" />
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
            <span>VAT ({{ form.vatPercentage }}%):</span>
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
import { ref, watch, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import type {
  IInvoiceRequest,
  IInvoiceResponse,
  IInvoiceProductItemRequest,
  IInvoiceSignaturerRequest,
  IContractSignaturer,
} from '@/interface/invoice/invoice.interface'
import { Plus, Minus } from 'lucide-vue-next'

// Extended type for form items with display fields
interface FormInvoiceItem extends IInvoiceProductItemRequest {
  particularsName?: string
}

// Extended type for form signaturers with display fields
interface FormSignaturer extends IInvoiceSignaturerRequest {
  name?: string
  title?: string
}

// Form type that matches IInvoiceRequest but with extended items
interface InvoiceFormData extends Omit<IInvoiceRequest, 'items' | 'signaturers'> {
  items: FormInvoiceItem[]
  signaturers: FormSignaturer[]
}

interface Props {
  modelValue: boolean
  invoice?: IInvoiceResponse | null
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
  save: [invoice: IInvoiceRequest]
}>()

const formRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Available signaturers (should be fetched from API in real implementation)
const availableSignaturers = ref<IContractSignaturer[]>([
  {
    id: 1,
    guid: 'sig-1',
    name: 'Rashed Ahasan',
    title: 'Head of Marketing',
    designation: 'Head of Marketing',
    sortOrder: 1
  },
  {
    id: 2,
    guid: 'sig-2',
    name: 'M. M. Elias',
    title: 'DGM, Finance & Accounts',
    designation: 'DGM, Finance & Accounts',
    sortOrder: 2
  },
  {
    id: 3,
    guid: 'sig-3',
    name: 'John Doe',
    title: 'Managing Director',
    designation: 'Managing Director',
    sortOrder: 3
  }
])

// Helper functions defined first
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

const generateProductItemId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const getDefaultFormData = (): InvoiceFormData => ({
  number: '',
  date: '',
  contractNo: '',
  contractDate: '',
  billTo: {
    name: '',
    address: ''
  },
  advertiser: '',
  productId: undefined,
  items: [
    {
      sl: 1,
      productItemId: generateProductItemId(),
      particularsName: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ],
  signaturers: [
    {
      signaturerId: 1,
      name: 'Rashed Ahasan',
      title: 'Head of Marketing',
      sortOrder: 1
    },
    {
      signaturerId: 2,
      name: 'M. M. Elias',
      title: 'DGM, Finance & Accounts',
      sortOrder: 2
    }
  ],
  spotTotal: 0,
  vatPercentage: 15,
  vatAmount: 0,
  grandTotal: 0,
  grandTotalWords: '',
  footerContact: 'Channel 24 Limited | 387 (south), Tejgaon I/A, Dhaka 1208 | Tel: +8802 550 29724 | Fax: +8802 550 29709 | www.channel24bd.tv',
  statusId: 1,
  dueDate: ''
})

const resetForm = () => {
  form.value = getDefaultFormData()
  formRef.value?.clearValidate()
}

const form = ref<InvoiceFormData>(getDefaultFormData())

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
    form.value.billTo?.name?.trim() &&
    form.value.billTo?.address?.trim() &&
    form.value.advertiser.trim() &&
    form.value.dueDate
})

// Map response to form data
const mapResponseToForm = (response: IInvoiceResponse): InvoiceFormData => {
  return {
    number: response.number,
    date: response.date,
    contractNo: response.contractNo,
    contractDate: response.contractDate,
    billTo: response.billTo || { name: '', address: '' },
    advertiser: response.advertiser,
    productId: response.product?.guid,
    items: response.items?.map(item => ({
      sl: item.sl,
      productItemId: item.productItemId,
      particularsName: item.particularsName,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount
    })) || [{ sl: 1, productItemId: generateProductItemId(), particularsName: '', quantity: 1, rate: 0, amount: 0 }],
    signaturers: response.signaturers?.map(sig => ({
      signaturerId: sig.signaturerId,
      name: sig.name,
      title: sig.title,
      sortOrder: sig.sortOrder
    })) || [],
    spotTotal: response.spotTotal,
    vatPercentage: response.vatPercentage,
    vatAmount: response.vatAmount,
    grandTotal: response.grandTotal,
    grandTotalWords: response.grandTotalWords,
    footerContact: response.footerContact,
    statusId: 1, // Map from status.guid if needed
    dueDate: response.dueDate
  }
}

// Map form data to request
const mapFormToRequest = (): IInvoiceRequest => {
  return {
    number: form.value.number,
    date: form.value.date,
    contractNo: form.value.contractNo,
    contractDate: form.value.contractDate,
    billTo: form.value.billTo,
    advertiser: form.value.advertiser,
    productId: form.value.productId,
    items: form.value.items.map(item => ({
      sl: item.sl,
      productItemId: item.productItemId,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate
    })),
    signaturers: form.value.signaturers.map(sig => ({
      signaturerId: sig.signaturerId,
      sortOrder: sig.sortOrder
    })),
    spotTotal: spotTotal.value,
    vatPercentage: form.value.vatPercentage,
    vatAmount: vatAmount.value,
    grandTotal: grandTotal.value,
    grandTotalWords: grandTotalWords.value,
    footerContact: form.value.footerContact,
    statusId: form.value.statusId,
    dueDate: form.value.dueDate
  }
}

watch(() => props.invoice, (newInvoice) => {
  if (newInvoice) {
    form.value = mapResponseToForm(newInvoice)
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

const addItem = () => {
  form.value.items.push({
    sl: form.value.items.length + 1,
    productItemId: generateProductItemId(),
    particularsName: '',
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

const addSignaturer = () => {
  form.value.signaturers.push({
    signaturerId: 0,
    name: '',
    title: '',
    sortOrder: form.value.signaturers.length + 1
  })
}

const removeSignaturer = (index: number) => {
  form.value.signaturers.splice(index, 1)
  // Reorder sort orders
  form.value.signaturers.forEach((sig, idx) => {
    sig.sortOrder = idx + 1
  })
}

const updateSignaturerInfo = (index: number, signaturerId: number) => {
  const signaturer = availableSignaturers.value.find(s => s.id === signaturerId)
  if (signaturer) {
    form.value.signaturers[index].name = signaturer.name
    form.value.signaturers[index].title = signaturer.title
  }
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const requestData = mapFormToRequest()
    emit('save', requestData)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

onMounted(() => {
  // TODO: Fetch available signaturers from API
  // fetchSignaturers()
})
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

.item-row,
.signaturer-row {
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
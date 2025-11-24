<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Contract' : 'Add New Contract / Booking info.'"
    width="900px" :close-on-click-modal="false" :close-on-press-escape="false" class="contract-modal font-sans"
    top="5vh">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default" class="contract-form"
      @input="handleAutoSave">
      <!-- Auto-save Indicator -->
      <div class="auto-save-indicator" v-if="lastSaved">
        <el-icon>
          <SuccessFilled />
        </el-icon>
        <span>Last saved: {{ formatTime(lastSaved) }}</span>
      </div>

      <!-- Draft Management -->
      <div class="draft-management" v-if="store.hasDraft && !isEdit">
        <el-alert title="You have saved drafts" type="info" :closable="false" show-icon>
          <template #append>
            <el-button type="primary" text @click="showDrafts = true">
              Manage Drafts ({{ store.draftContracts.length }})
            </el-button>
          </template>
        </el-alert>
      </div>

      <!-- Basic Information -->
      <div class="form-section">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Contract No" prop="televisionContractNo">
              <el-input v-model="form.televisionContractNo" placeholder="Enter contract number"
                @blur="handleFieldUpdate('televisionContractNo', form.televisionContractNo)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Contract Date" prop="contractDate">
              <el-date-picker v-model="form.contractDate" type="date" placeholder="Select date" class="w-full"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="handleFieldUpdate('contractDate', form.contractDate)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Client Copy">
              <el-switch v-model="store.isClientCopy" @change="store.toggleClientCopy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Start Date" prop="contractStartDate">
              <el-date-picker v-model="form.contractStartDate" type="date" placeholder="Select start date"
                class="w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="handleFieldUpdate('contractStartDate', form.contractStartDate)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="End Date" prop="contractEndDate">
              <el-date-picker v-model="form.contractEndDate" type="date" placeholder="Select end date" class="w-full"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="handleFieldUpdate('contractEndDate', form.contractEndDate)" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="store.isClientCopy ? 'Client' : 'Agency'"
              :prop="store.isClientCopy ? 'contractedClientId' : 'contractedAgencyId'">
              <!-- <el-select v-model="selectedClientOrAgency"
                :placeholder="`Select ${store.isClientCopy ? 'client' : 'agency'}`" class="w-full" filterable clearable
                @change="handleClientAgencyChange">
                <el-option v-for="item in store.isClientCopy ? clients : agencies" :key="item.guid" :label="item.email"
                  :value="item.guid" />

                <el-option v-for="agency in store.isClientCopy ? clients : agencies" :key="agency.guid"
                  :label="agency.email" :value="agency.guid">
                  <div class="flex items-center justify-between">
                    <span>{{ agency.email }}</span>
                    <span v-if="agency.email" class="text-xs text-gray-500">{{ agency.email }}</span>
                  </div>
                </el-option>
              </el-select> -->
              <el-select v-model="selectedClientOrAgency"
                :placeholder="`Select ${store.isClientCopy ? 'client' : 'agency'}`" class="w-full" filterable clearable
                @change="handleClientAgencyChange">
                <el-option v-for="item in store.isClientCopy ? clients : agencies" :label="item.email" :key="item.guid"
                  :value="item.guid">
                  <div class="flex justify-between items-center w-full">
                    <span class="font-medium">
                      {{ store.isClientCopy ? (item as IClientSimple).clintName : (item as IAgencySimple).agencyName }}
                    </span>
                    <span v-if="item.email" class="text-xs text-gray-500 ml-2">{{ item.email }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="VAT Rate (%)" prop="vatRate">
              <el-input-number v-model="form.vatRate" :min="0" :max="100" :precision="2" controls-position="right"
                class="w-full" @change="handleFieldUpdate('vatRate', form.vatRate)" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Contract Products -->
      <div class="form-section">
        <h3 class="section-title">Contract Products</h3>

        <el-button type="primary" :icon="Plus" plain @click="store.addProduct">
          Add Product
        </el-button>
      </div>

      <!-- On Air Descriptions -->
      <div class="form-section">
        <h3 class="section-title">On Air Descriptions</h3>
        <div v-for="(desc, descIndex) in form.onAirDescriptions" :key="descIndex" class="description-row">
          <el-row :gutter="16" align="middle">
            <el-col :span="6">
              <el-form-item label="Duration (Months)">
                <el-select v-model="desc.durationMonths" multiple placeholder="Select months" class="w-full"
                  @change="handleOnAirDescriptionUpdate(descIndex, 'durationMonths', desc.durationMonths)">
                  <el-option v-for="month in availableMonths" :key="month.value" :label="month.label"
                    :value="month.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="Schedule Dates">
                <el-input v-model="desc.scheduleDates" placeholder="Enter dates separated by commas (e.g., 01,02,03...)"
                  @blur="handleOnAirDescriptionUpdate(descIndex, 'scheduleDates', desc.scheduleDates)" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label=" ">
                <el-button v-if="form.onAirDescriptions.length > 1" type="danger" :icon="Minus" circle
                  @click="store.removeOnAirDescription(descIndex)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Description">
            <el-input v-model="desc.description" type="textarea" :rows="2" placeholder="Enter on-air description"
              @blur="handleOnAirDescriptionUpdate(descIndex, 'description', desc.description)" />
          </el-form-item>
        </div>
        <el-button type="primary" :icon="Plus" plain @click="store.addOnAirDescription">
          Add Description
        </el-button>
      </div>

      <!-- Terms and Remarks -->
      <div class="form-section">
        <h3 class="section-title">Terms & Remarks</h3>
        <el-form-item label="Remarks">
          <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="Enter remarks"
            @blur="handleFieldUpdate('remarks', form.remarks)" />
        </el-form-item>
      </div>

      <!-- Totals Summary -->
      <div class="form-section">
        <h3 class="section-title">Summary</h3>
        <div class="totals-summary">
          <div class="total-row">
            <span>Products Total:</span>
            <span>{{ formatCurrency(store.productsTotal) }}</span>
          </div>
          <div class="total-row">
            <span>VAT ({{ form.vatRate }}%):</span>
            <span>{{ formatCurrency(store.vatAmount) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>{{ formatCurrency(store.grandTotal) }}</span>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <div class="footer-left">
          <el-button v-if="!isEdit" type="info" @click="handleSaveDraft">
            Save Draft
          </el-button>
          <el-button type="warning" @click="handleClearStorage">
            Clear Data
          </el-button>
        </div>
        <div class="footer-right">
          <el-button size="large" @click="handleClose">
            Cancel
          </el-button>
          <el-button type="primary" size="large" :loading="loading" :disabled="!isFormValid" @click="handleSubmit">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Contract' : 'Create Contract') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- Drafts Management Dialog -->
  <el-dialog v-model="showDrafts" title="Saved Drafts" width="600px">
    <div class="drafts-list">
      <el-card v-for="(draft, index) in store.draftContracts" :key="index" class="draft-card">
        <template #header>
          <div class="draft-header">
            <span>Draft {{ index + 1 }} - {{ draft.televisionContractNo || 'Untitled' }}</span>
            <div class="draft-actions">
              <el-button type="primary" text @click="handleLoadDraft(index)">Load</el-button>
              <el-button type="danger" text @click="handleDeleteDraft(index)">Delete</el-button>
            </div>
          </div>
        </template>
        <p><strong>Contract Date:</strong> {{ formatDate(draft.contractDate) || 'Not set' }}</p>
        <p><strong>Products:</strong> {{ draft.products.length }}</p>
        <!-- <p><strong>Total:</strong> {{ formatCurrency(store.calculateContractTotal(draft.total)) }}</p> -->
      </el-card>``
    </div>
    <template #footer>
      <el-button @click="showDrafts = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Plus, Minus, SuccessFilled } from '@element-plus/icons-vue'
import { useContractStore } from '@/stores/contracts'
import { contractService, clientService, agencyService, contractUtils } from '@/services/Contracts/contract.services'
import type { IAgencySimple, IClientSimple, ITelevisionContract, ITelevisionContractCreateRequest, ITelevisionContractUpdateRequest } from '@/interface/contract/contracts.interface'

interface Props {
  modelValue: boolean
  contract?: ITelevisionContract | null
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
  'save': [contract: any]
  'refresh': []
}>()

// Store and Refs
const store = useContractStore()
const formRef = ref<FormInstance>()
const clients = ref<IClientSimple[]>([])
const agencies = ref<IAgencySimple[]>([])
const showDrafts = ref(false)
const lastSaved = ref<string>('')
const isSubmitting = ref(false)

// Form data from store
const form = computed(() => store.currentContract)

// Available months for selection
const availableMonths = ref([
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
])

// Validation rules
const rules = {
  televisionContractNo: [
    { required: true, message: 'Please enter contract number', trigger: 'blur' }
  ],
  contractDate: [
    { required: true, message: 'Please select contract date', trigger: 'change' }
  ],
  contractStartDate: [
    { required: true, message: 'Please select start date', trigger: 'change' }
  ],
  contractEndDate: [
    { required: true, message: 'Please select end date', trigger: 'change' }
  ],
  contractedClientId: [
    { required: true, message: 'Please select a client', trigger: 'change' }
  ],
  contractedAgencyId: [
    { required: true, message: 'Please select an agency', trigger: 'change' }
  ],
  vatRate: [
    { required: true, message: 'Please enter VAT rate', trigger: 'blur' }
  ]
}

// Computed properties
const selectedClientOrAgency = computed({
  get: () => store.isClientCopy ? form.value.contractedClientId : form.value.contractedAgencyId,
  set: (value) => {
    if (store.isClientCopy) {
      store.updateContractField('contractedClientId', value)
    } else {
      store.updateContractField('contractedAgencyId', value)
    }
  }
})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  const basicValid = form.value.televisionContractNo?.trim() &&
    form.value.contractDate &&
    form.value.contractStartDate &&
    form.value.contractEndDate &&
    form.value.vatRate !== null

  const clientAgencyValid = store.isClientCopy ?
    form.value.contractedClientId :
    form.value.contractedAgencyId

  const productsValid = form.value.products.length > 0 &&
    form.value.products.every(product =>
      product.contractProductName?.trim() &&
      product.productItems.length > 0 &&
      product.productItems.every(item => item.particularsName?.trim() && item.rate > 0)
    )

  return basicValid && clientAgencyValid && productsValid
})

// Watchers
watch(() => props.contract, (newContract) => {
  if (newContract && props.isEdit) {
    // Convert backend response to store format
    const storeContract = convertToStoreFormat(newContract)
    store.setContract(storeContract)
  } else if (!props.isEdit) {
    store.initializeContract()
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible) {
    // Load last saved time
    const stored = localStorage.getItem('contractFormData')
    if (stored) {
      const data = JSON.parse(stored)
      lastSaved.value = data.lastSaved
    }

    if (!props.contract && !props.isEdit) {
      store.initializeContract()
    }
  }
})

// Methods
const convertToStoreFormat = (contract: any) => {
  return {
    guid: contract.guid,
    televisionContractNo: contract.televisionContractNo,
    contractDate: contract.contractDate,
    contractStartDate: contract.contractStartDate,
    contractEndDate: contract.contractEndDate,
    contractedClientId: contract.contractedClientId,
    contractedAgencyId: contract.contractedAgencyId,
    vat: contract.vat || 0,
    vatRate: contract.vatRate || 15,
    total: contract.total || 0,
    remarks: contract.remarks || '',
    products: contract.products?.map((product: any) => ({
      contractProductName: product.contractProductName || '',
      contractProductDescription: product.contractProductDescription || '',
      quantity: product.quantity || 1,
      vat: product.vat || 0,
      vatRate: product.vatRate || 15,
      total: product.total || 0,
      remarks: product.remarks || '',
      productItems: product.productItems?.map((item: any) => ({
        guid: item.guid || "Guid()",
        particularsName: item.particularsName || '',
        rate: item.rate || 0,
        remarks: item.remarks || '',
        vat: item.vat || 0,
        vatRate: item.vatRate || 15
      })) || []
    })) || [],
    onAirDescriptions: contract.onAirDescriptions?.map((desc: any) => ({
      durationMonths: desc.durationMonths || [],
      scheduleDates: desc.scheduleDates || '',
      description: desc.description || ''
    })) || []
  }
}

const convertToApiFormat = (storeContract: any): ITelevisionContractCreateRequest | ITelevisionContractUpdateRequest => {
  const totals = contractUtils.calculateContractTotals(storeContract)

  return {
    ...storeContract,
    vat: totals.vatAmount,
    total: totals.grandTotal,
    products: storeContract.products.map((product: any) => ({
      ...product,
      vat: store.calculateProductTotal(product) * (product.vatRate / 100),
      total: store.calculateProductTotal(product),
      productItems: product.productItems.map((item: any) => ({
        ...item,
        vat: item.rate * (item.vatRate / 100)
      }))
    }))
  }
}

const handleFieldUpdate = (field: string, value: any) => {
  store.updateContractField(field as any, value)
}

const handleClientAgencyChange = (value: string) => {
  if (store.isClientCopy) {
    store.updateContractField('contractedClientId', value)
  } else {
    store.updateContractField('contractedAgencyId', value)
  }
}

const handleProductUpdate = (productIndex: number, field: string, value: any) => {
  store.updateProduct(productIndex, { [field]: value })
}

const handleProductItemUpdate = (productIndex: number, itemIndex: number, field: string, value: any) => {
  store.updateProductItem(productIndex, itemIndex, { [field]: value })
}

const handleOnAirDescriptionUpdate = (descIndex: number, field: string, value: any) => {
  store.updateOnAirDescription(descIndex, { [field]: value })
}

const handleAutoSave = () => {
  // Debounced auto-save
  clearTimeout((window as any).autoSaveTimeout)
    ; (window as any).autoSaveTimeout = setTimeout(() => {
      store.autoSave()
      lastSaved.value = new Date().toISOString()
    }, 1000)
}

const handleSaveDraft = () => {
  store.saveDraft()
  ElMessage.success('Draft saved successfully')
}

const handleLoadDraft = (index: number) => {
  store.loadDraft(index)
  showDrafts.value = false
  ElMessage.success('Draft loaded successfully')
}

const handleDeleteDraft = (index: number) => {
  store.clearDraft(index)
  ElMessage.success('Draft deleted successfully')
}

const handleClearStorage = () => {
  store.clearLocalStorage()
  lastSaved.value = ''
  ElMessage.success('All local data cleared')
}

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

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString()
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitting.value = true

    // Validate contract data
    // const validation = contractUtils.validateContract(form.value)
    // if (!validation.isValid) {
    //   ElMessage.error(validation.errors[0])
    //   return
    // }

    // Prepare data for API call
    const contractData = convertToApiFormat(form.value)

    // API call
    if (props.isEdit) {
      await contractService.updateTelevisionContract(props.contract!.guid, contractData as ITelevisionContractUpdateRequest)
    } else {
      await contractService.createTelevisionContract(contractData as ITelevisionContractCreateRequest)
    }

    // Clear local storage on successful submission
    store.clearLocalStorage()

    emit('save', contractData)
    emit('refresh')
    handleClose()

    ElMessage.success(`Contract ${props.isEdit ? 'updated' : 'created'} successfully`)

  } catch (error: any) {
    console.error('Form validation or API call failed:', error)
    ElMessage.error(error.response?.data?.message || 'Failed to save contract')
  } finally {
    isSubmitting.value = false
  }
}

// Load clients and agencies
const loadClientsAndAgencies = async () => {
  try {
    const [clientsResponse, agenciesResponse] = await Promise.all([
      await clientService.getClientsList(),
      await agencyService.getAgenciesList()
    ])

    clients.value = clientsResponse
    agencies.value = agenciesResponse
  } catch (error) {
    console.error('Failed to load clients and agencies:', error)
  }
}

onMounted(() => {
  loadClientsAndAgencies()
})
</script>

<style scoped>
/* Your existing styles remain the same */
.contract-modal {
  --el-dialog-border-radius: 16px;
}

.contract-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.auto-save-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--el-color-success-light-9);
  border: 1px solid var(--el-color-success-light-7);
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--el-color-success);
}

.auto-save-indicator .el-icon {
  font-size: 14px;
}

.draft-management {
  margin-bottom: 16px;
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

.product-section {
  margin-bottom: 24px;
}

.product-card {
  margin-bottom: 16px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-row {
  background: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.description-row {
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
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
}

.footer-left {
  display: flex;
  gap: 8px;
}

.footer-right {
  display: flex;
  gap: 12px;
}

.drafts-list {
  max-height: 400px;
  overflow-y: auto;
}

.draft-card {
  margin-bottom: 12px;
}

.draft-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.draft-actions {
  display: flex;
  gap: 8px;
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

:deep(.el-card__header) {
  padding: 12px 20px;
  background: var(--el-fill-color-lighter);
}

@media (max-width: 768px) {
  .contract-modal {
    --el-dialog-width: 90vw;
  }

  .modal-footer {
    flex-direction: column;
    gap: 16px;
  }

  .footer-left,
  .footer-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
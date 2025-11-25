<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Contract' : 'Add New Television Contract'" width="1400px"
    :close-on-click-modal="false" :close-on-press-escape="false" class="contract-modal font-sans" top="3vh">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default" class="contract-form"
      @input="handleAutoSave">
      <!-- Auto-save Indicator -->
      <div v-if="lastSaved" class="auto-save-indicator">
        <el-icon>
          <SuccessFilled />
        </el-icon>
        <span>Last saved: {{ formatTime(lastSaved) }}</span>
      </div>

      <!-- Draft Management -->
      <div v-if="store.hasDraft && !isEdit" class="draft-management">
        <el-alert title="You have saved drafts" type="info" :closable="false" show-icon>
          <template #default>
            <el-button type="primary" text @click="showDrafts = true">
              Manage Drafts ({{ store.draftContracts.length }})
            </el-button>
          </template>
        </el-alert>
      </div>

      <!-- Basic Information Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon blue">
              <FileText class="w-4 h-4" />
            </span>
            Contract Information
          </h3>
        </div>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Contract No" prop="televisionContractNo">
              <el-input v-model="form.televisionContractNo" placeholder="e.g., TML2510026"
                @blur="handleFieldUpdate('televisionContractNo', form.televisionContractNo)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Contract Date" prop="contractDate">
              <el-date-picker v-model="form.contractDate" type="date" placeholder="Select date" class="w-full"
                format="DD MMM, YYYY" value-format="YYYY-MM-DD"
                @change="handleFieldUpdate('contractDate', form.contractDate)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- Radio group to toggle between Client Copy and Agency Copy -->
            <el-form-item class="flex items-center ">
              <el-switch v-model="isClientCopy" @change="handleContractTypeChange" />
              <p v-if="isClientCopy">Client Copy (Advertiser)</p>
              <p v-else>Agency Copy</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Start Date" prop="contractStartDate">
              <el-date-picker v-model="form.contractStartDate" type="date" placeholder="Select start date"
                class="w-full" format="DD MMM, YYYY" value-format="YYYY-MM-DD"
                @change="handleFieldUpdate('contractStartDate', form.contractStartDate)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="End Date" prop="contractEndDate">
              <el-date-picker v-model="form.contractEndDate" type="date" placeholder="Select end date" class="w-full"
                format="DD MMM, YYYY" value-format="YYYY-MM-DD"
                @change="handleFieldUpdate('contractEndDate', form.contractEndDate)" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Conditional Client/Agency Selection based on isClientCopy -->
        <el-row :gutter="16">
          <!-- Client Selection - Only shown when isClientCopy is true -->
          <el-col :span="12" v-if="isClientCopy">
            <el-form-item label="Client (Advertiser)" prop="contractedClientId">
              <div class="select-with-action">
                <el-select v-model="form.contractedClientId" placeholder="Select Client/Advertiser" class="flex-1"
                  filterable clearable @change="handleFieldUpdate('contractedClientId', form.contractedClientId)">
                  <el-option v-for="client in clients" :key="client.guid" :label="client.clintName || client.email"
                    :value="client.guid">
                    <div class="option-content">
                      <span class="option-label">{{ client.clintName }}</span>
                      <span v-if="client.email" class="option-hint">{{ client.email }}</span>
                    </div>
                  </el-option>
                </el-select>
                <el-button type="primary" :icon="Plus" @click="showClientModal = true" title="Create New Client" />
              </div>
            </el-form-item>
          </el-col>

          <!-- Agency Selection - Only shown when isClientCopy is false -->
          <el-col :span="12" v-else>
            <el-form-item label="Agency (Contract Party)" prop="contractedAgencyId">
              <div class="select-with-action">
                <el-select v-model="form.contractedAgencyId" placeholder="Select Agency" class="flex-1" filterable
                  clearable @change="handleFieldUpdate('contractedAgencyId', form.contractedAgencyId)">
                  <el-option v-for="agency in agencies" :key="agency.guid" :label="agency.agencyName || agency.email"
                    :value="agency.guid">
                    <div class="option-content">
                      <span class="option-label">{{ agency.agencyName }}</span>
                      <span v-if="agency.email" class="option-hint">{{ agency.email }}</span>
                    </div>
                  </el-option>
                </el-select>
                <el-button type="primary" :icon="Plus" @click="showAgencyModal = true" title="Create New Agency" />
              </div>
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

      <!-- Contract Products Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon green">
              <Package class="w-4 h-4" />
            </span>
            Products & Items
          </h3>
          <el-button type="primary" :icon="Plus" @click="store.addProduct">
            Add Product
          </el-button>
        </div>

        <div v-for="(product, productIndex) in form.products" :key="productIndex" class="product-card">
          <el-card shadow="hover">
            <template #header>
              <div class="product-header">
                <span class="font-semibold">Product {{ productIndex + 1 }}</span>
                <el-button v-if="form.products.length > 1" type="danger" :icon="Trash2" circle size="small"
                  @click="store.removeProduct(productIndex)" />
              </div>
            </template>

            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="Product Name">
                  <el-input v-model="product.contractProductName" placeholder="e.g., Kool"
                    @blur="handleProductUpdate(productIndex, 'contractProductName', product.contractProductName)" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Quantity">
                  <el-input-number v-model="product.quantity" :min="1" controls-position="right" class="w-full"
                    @change="handleProductUpdate(productIndex, 'quantity', product.quantity)" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="VAT Rate (%)">
                  <el-input-number v-model="product.vatRate" :min="0" :max="100" :precision="2"
                    controls-position="right" class="w-full"
                    @change="handleProductUpdate(productIndex, 'vatRate', product.vatRate)" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Product Items (Particulars) -->
            <div class="items-section">
              <div class="items-header">
                <h4 class="items-title">Particulars / Items</h4>
                <el-button type="primary" size="small" :icon="Plus" plain @click="store.addProductItem(productIndex)">
                  Add Item
                </el-button>
              </div>

              <el-table :data="product.productItems" border stripe size="small" class="items-table">
                <el-table-column label="SL#" width="60" align="center">
                  <template #default="{ $index }">{{ $index + 1 }}</template>
                </el-table-column>
                <el-table-column label="Particulars" min-width="200">
                  <template #default="{ row, $index }">
                    <el-input v-model="row.particularsName" placeholder="e.g., Kool Sports24" size="small"
                      @blur="handleProductItemUpdate(productIndex, $index, 'particularsName', row.particularsName)" />
                  </template>
                </el-table-column>
                <el-table-column label="Rate (Tk.)" width="150">
                  <template #default="{ row, $index }">
                    <el-input-number v-model="row.rate" :min="0" :precision="2" controls-position="right" size="small"
                      class="w-full" @change="handleProductItemUpdate(productIndex, $index, 'rate', row.rate)" />
                  </template>
                </el-table-column>
                <el-table-column label="VAT Rate (%)" width="120">
                  <template #default="{ row, $index }">
                    <el-input-number v-model="row.vatRate" :min="0" :max="100" :precision="2" controls-position="right"
                      size="small" class="w-full"
                      @change="handleProductItemUpdate(productIndex, $index, 'vatRate', row.vatRate)" />
                  </template>
                </el-table-column>
                <el-table-column label="Amount (Tk.)" width="130" align="right">
                  <template #default="{ row }">
                    <span class="amount-value">{{ formatCurrency(store.calculateItemTotal(row)) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="" width="60" align="center">
                  <template #default="{ $index }">
                    <el-button v-if="product.productItems.length > 1" type="danger" :icon="Minus" circle size="small"
                      @click="store.removeProductItem(productIndex, $index)" />
                  </template>
                </el-table-column>
              </el-table>

              <div class="product-total">
                <span>Product Total:</span>
                <span class="product-total-value">Tk. {{ formatCurrency(store.calculateProductTotal(product)) }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- On Air Descriptions Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon purple">
              <Tv class="w-4 h-4" />
            </span>
            On-Air Descriptions
          </h3>
          <el-button type="primary" :icon="Plus" @click="store.addOnAirDescription">
            Add Description
          </el-button>
        </div>

        <div v-for="(desc, descIndex) in form.onAirDescriptions" :key="descIndex" class="description-card">
          <el-card shadow="hover">
            <template #header>
              <div class="description-header">
                <span class="font-semibold">On-Air Description {{ descIndex + 1 }}</span>
                <el-button v-if="form.onAirDescriptions.length > 1" type="danger" :icon="Trash2" circle size="small"
                  @click="store.removeOnAirDescription(descIndex)" />
              </div>
            </template>

            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="Duration (Month)">
                  <el-select v-model="desc.onAirDuration" placeholder="Select Month" class="w-full" filterable
                    allow-create @change="handleOnAirDescriptionUpdate(descIndex, 'onAirDuration', desc.onAirDuration)">
                    <el-option v-for="month in availableMonthOptions" :key="month" :label="month" :value="month" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Description Type">
                  <el-select v-model="desc.descriptionType" placeholder="Select or Enter Type" class="w-full" filterable
                    allow-create
                    @change="handleOnAirDescriptionUpdate(descIndex, 'descriptionType', desc.descriptionType)">
                    <el-option label="Branding Package" value="Branding Package" />
                    <el-option label="Spot Package" value="Spot Package" />
                    <el-option label="Program Sponsorship" value="Program Sponsorship" />
                    <el-option label="Custom" value="Custom" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Type Name">
                  <el-input v-model="desc.descriptionTypeName" placeholder="e.g., Kool Sports24"
                    @blur="handleOnAirDescriptionUpdate(descIndex, 'descriptionTypeName', desc.descriptionTypeName)" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="Description Text">
              <el-input v-model="desc.descriptionText" type="textarea" :rows="3"
                placeholder="e.g., Title Sting & Presenter Endorsement, Backdrop & doggy During the Program, 30 Sec Tvc Per Day (Per News), 30 Sec L_Shape"
                @blur="handleOnAirDescriptionUpdate(descIndex, 'descriptionText', desc.descriptionText)" />
            </el-form-item>

            <!-- Transmission Schedule -->
            <div class="transmission-section">
              <div class="transmission-header">
                <h4 class="transmission-title">Transmission Schedule</h4>
                <el-button type="primary" size="small" :icon="Plus" plain
                  @click="store.addTransmissionSchedule(descIndex)">
                  Add Schedule
                </el-button>
              </div>

              <div v-for="(schedule, scheduleIndex) in desc.transmissionSchedule" :key="scheduleIndex"
                class="schedule-row">
                <el-row :gutter="16" align="middle">
                  <el-col :span="14">
                    <el-form-item label="Dates (comma separated)">
                      <el-input v-model="schedule.dateValue"
                        placeholder="e.g., 01,02,03,04,05,06,07,08,09,10,11,12,13,14,15..."
                        @blur="handleTransmissionScheduleUpdate(descIndex, scheduleIndex, 'dateValue', schedule.dateValue)" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="Duration (Minutes)">
                      <el-input-number v-model="schedule.durationInMinute" :min="0" controls-position="right"
                        class="w-full"
                        @change="handleTransmissionScheduleUpdate(descIndex, scheduleIndex, 'durationInMinute', schedule.durationInMinute)" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label=" ">
                      <el-button v-if="desc.transmissionSchedule.length > 1" type="danger" :icon="Minus" circle
                        @click="store.removeTransmissionSchedule(descIndex, scheduleIndex)" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Terms and Remarks -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon orange">
              <FileText class="w-4 h-4" />
            </span>
            Remarks
          </h3>
        </div>
        <el-form-item>
          <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="Enter any additional remarks or notes"
            @blur="handleFieldUpdate('remarks', form.remarks)" />
        </el-form-item>
      </div>

      <!-- Totals Summary -->
      <div class="form-section summary-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon blue">
              <Calculator class="w-4 h-4" />
            </span>
            Summary
          </h3>
        </div>
        <div class="totals-summary">
          <div class="total-row">
            <span>Spot Total:</span>
            <span>Tk. {{ formatCurrency(store.productsTotal) }}</span>
          </div>
          <div class="total-row">
            <span>Plus {{ form.vatRate }}% VAT on Tk. {{ formatCurrency(store.productsTotal) }}:</span>
            <span>Tk. {{ formatCurrency(store.vatAmount) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>Tk. {{ formatCurrency(store.grandTotal) }}</span>
          </div>
          <div class="total-row grand-total-words">
            <span>In Words:</span>
            <span>{{ numberToWords(store.grandTotal) }} Taka Only</span>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <div class="footer-left">
          <el-button v-if="!isEdit" type="info" @click="handleSaveDraft">
            <Save class="w-4 h-4 mr-1" /> Save Draft
          </el-button>
          <el-button type="warning" @click="handleClearStorage">
            <Trash class="w-4 h-4 mr-1" /> Clear Data
          </el-button>
        </div>
        <div class="footer-right">
          <el-button size="large" @click="handleClose">
            Cancel
          </el-button>
          <el-button type="primary" size="large" :loading="loading" @click="handleSubmit">
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
      </el-card>
    </div>
    <template #footer>
      <el-button @click="showDrafts = false">Close</el-button>
    </template>
  </el-dialog>

  <!-- Client Create Modal -->
  <ClientModal v-model="showClientModal" :client-types="clientTypes" @save="handleClientCreated" />

  <!-- Agency Create Modal -->
  <AgencyModal v-model="showAgencyModal" @save="handleAgencyCreated" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Plus, Minus, SuccessFilled } from '@element-plus/icons-vue'
import {
  FileText,
  Package,
  Tv,
  Calculator,
  Trash2,
  Save,
  Trash
} from 'lucide-vue-next'
import { useContractStore } from '@/stores/contracts'
import { contractService } from '@/services/Contracts/contract.services'
import { agencyService } from '@/services/Agencies/agencies.services'

import type {
  IAgencySimple,
  IClientSimple,
  ITelevisionContract,
  ITelevisionContractCreateRequest,
  ITelevisionContractUpdateRequest
} from '@/interface/contract/contracts.interface'
import type { IClientType, IClientCreateRequest, IAgencyCreateRequest } from '@/interface/clients/clients.interface'
import ClientModal from '@/components/forms/ClientModal.vue'
import AgencyModal from '@/components/forms/AgencyModal.vue'
import { clientService } from '@/services/Clients/common.services'

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
const clientTypes = ref<IClientType[]>([])
const showDrafts = ref(false)
const lastSaved = ref<string>('')
const isSubmitting = ref(false)

const isClientCopy = ref(true)

// Modal controls for creating new Client/Agency
const showClientModal = ref(false)
const showAgencyModal = ref(false)

// Form data from store
const form = computed(() => store.currentContract)

// Generate month options based on contract dates
const availableMonthOptions = computed(() => {
  const months: string[] = []
  const startDate = form.value.contractStartDate ? new Date(form.value.contractStartDate) : new Date()
  const endDate = form.value.contractEndDate ? new Date(form.value.contractEndDate) : new Date()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const current = new Date(startDate)
  while (current <= endDate) {
    const monthYear = `${monthNames[current.getMonth()]}' ${current.getFullYear()}`
    if (!months.includes(monthYear)) {
      months.push(monthYear)
    }
    current.setMonth(current.getMonth() + 1)
  }

  if (months.length === 0) {
    const currentYear = new Date().getFullYear()
    monthNames.forEach(month => {
      months.push(`${month}' ${currentYear}`)
    })
  }

  return months
})

const rules = computed(() => ({
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
  vatRate: [
    { required: true, message: 'Please enter VAT rate', trigger: 'blur' }
  ],
  // Conditional validation based on contract type
  contractedClientId: isClientCopy.value ? [
    { required: true, message: 'Please select a client', trigger: 'change' }
  ] : [],
  contractedAgencyId: !isClientCopy.value ? [
    { required: true, message: 'Please select an agency', trigger: 'change' }
  ] : []
}))

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Watchers
watch(() => props.contract, (newContract) => {
  if (newContract && props.isEdit) {
    const storeContract = convertToStoreFormat(newContract)
    store.setContract(storeContract)
    isClientCopy.value = !!newContract.contractedClientId
  } else if (!props.isEdit) {
    store.initializeContract()
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible) {
    const stored = localStorage.getItem('contractFormData')
    if (stored) {
      const data = JSON.parse(stored)
      lastSaved.value = data.lastSaved
      if (data.isClientCopy !== undefined) {
        isClientCopy.value = data.isClientCopy
      }
    }

    if (!props.contract && !props.isEdit) {
      store.initializeContract()
    }
  }
})

watch(isClientCopy, (value) => {
  store.toggleClientCopy(value)
})

// Methods
const handleContractTypeChange = (value: boolean) => {
  isClientCopy.value = value
  if (value) {
    // Switching to Client Copy - clear agency
    store.updateContractField('contractedAgencyId', null)
  } else {
    // Switching to Agency Copy - clear client
    store.updateContractField('contractedClientId', null)
  }
}

const convertToStoreFormat = (contract: any) => {
  return {
    guid: contract.guid || null,
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
        guid: item.guid || null,
        particularsName: item.particularsName || '',
        rate: item.rate || 0,
        remarks: item.remarks || '',
        vat: item.vat || 0,
        vatRate: item.vatRate || 15
      })) || []
    })) || [],
    onAirDescriptions: contract.onAirDescriptions?.map((desc: any) => ({
      guid: desc.guid || null,
      onAirDuration: desc.onAirDuration || '',
      descriptionType: desc.descriptionType || '',
      descriptionText: desc.descriptionText || '',
      descriptionTypeName: desc.descriptionTypeName || '',
      descriptionTypeDescription: desc.descriptionTypeDescription || '',
      remarks: desc.remarks || '',
      createdAt: desc.createdAt || new Date().toISOString(),
      statusId: desc.statusId || 1,
      isDeleted: desc.isDeleted || false,
      transmissionSchedule: desc.transmissionSchedule?.map((schedule: any) => ({
        guid: schedule.guid || null,
        onAirDescriptionId: desc.guid,
        dateValue: schedule.dateValue || '',
        durationInMinute: schedule.durationInMinute || 0,
        remarks: schedule.remarks || ''
      })) || []
    })) || []
  }
}

const convertToApiFormat = (): ITelevisionContractCreateRequest | ITelevisionContractUpdateRequest => {
  const contractData = form.value

  // Generate GUID if not present
  const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  return {
    guid: contractData.guid || generateGuid(),
    televisionContractNo: contractData.televisionContractNo,
    contractDate: contractData.contractDate,
    contractStartDate: contractData.contractStartDate,
    contractEndDate: contractData.contractEndDate,
    contractedClientId: isClientCopy.value ? contractData.contractedClientId : null,
    contractedAgencyId: !isClientCopy.value ? contractData.contractedAgencyId : null,
    vat: store.vatAmount,
    vatRate: contractData.vatRate,
    total: store.grandTotal,
    remarks: contractData.remarks || '',
    products: contractData.products.map((product) => {
      const productTotal = store.calculateProductTotal(product)
      return {
        contractProductName: product.contractProductName,
        contractProductDescription: product.contractProductDescription || '',
        quantity: product.quantity,
        vat: productTotal * (product.vatRate / 100),
        vatRate: product.vatRate,
        total: productTotal,
        remarks: product.remarks || '',
        productItems: product.productItems.map((item) => ({
          guid: item.guid || generateGuid(),
          particularsName: item.particularsName,
          rate: item.rate,
          remarks: item.remarks || '',
          vat: item.rate * (item.vatRate / 100),
          vatRate: item.vatRate
        }))
      }
    }),
    onAirDescriptions: contractData.onAirDescriptions.map((desc) => {
      const descGuid = desc.guid || generateGuid()
      return {
        guid: descGuid,
        onAirDuration: desc.onAirDuration,
        descriptionType: desc.descriptionType,
        descriptionText: desc.descriptionText,
        descriptionTypeName: desc.descriptionTypeName || '',
        descriptionTypeDescription: desc.descriptionTypeDescription || '',
        remarks: desc.remarks || '',
        createdAt: desc.createdAt || new Date().toISOString(),
        statusId: desc.statusId || 1,
        isDeleted: desc.isDeleted || false,
        transmissionSchedule: desc.transmissionSchedule.map((schedule) => ({
          guid: schedule.guid || generateGuid(),
          onAirDescriptionId: descGuid,
          dateValue: schedule.dateValue,
          durationInMinute: schedule.durationInMinute,
          remarks: schedule.remarks || ''
        }))
      }
    })
  }
}

const handleFieldUpdate = (field: string, value: any) => {
  store.updateContractField(field as any, value)
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

const handleTransmissionScheduleUpdate = (descIndex: number, scheduleIndex: number, field: string, value: any) => {
  store.updateTransmissionSchedule(descIndex, scheduleIndex, { [field]: value })
}

const handleAutoSave = () => {
  clearTimeout((window as any).autoSaveTimeout)
    ; (window as any).autoSaveTimeout = setTimeout(() => {
      store.autoSave()
      const stored = localStorage.getItem('contractFormData')
      if (stored) {
        const data = JSON.parse(stored)
        data.isClientCopy = isClientCopy.value
        localStorage.setItem('contractFormData', JSON.stringify(data))
      }
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
  isClientCopy.value = true
  lastSaved.value = ''
  ElMessage.success('All local data cleared')
}

// Handle Client/Agency creation
const handleClientCreated = async (clientData: IClientCreateRequest) => {
  try {
    const response = await clientService.createClient(clientData)
    ElMessage.success('Client created successfully')
    showClientModal.value = false
    await loadClientsAndAgencies()
    if (response && response.clientId) {
      store.updateContractField('contractedClientId', response.clientId)
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to create client')
  }
}

const handleAgencyCreated = async (agencyData: IAgencyCreateRequest) => {
  try {
    const response = await agencyService.createAgency(agencyData)
    ElMessage.success('Agency created successfully')
    showAgencyModal.value = false
    await loadClientsAndAgencies()
    if (response && response.guid) {
      store.updateContractField('contractedAgencyId', response.guid)
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to create agency')
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString()
}

const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero'

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const numToWords = (n: number): string => {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '')
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '')
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lac' + (n % 100000 ? ' ' + numToWords(n % 100000) : '')
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '')
  }

  return numToWords(Math.floor(num))
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isSubmitting.value = true

    const contractData = convertToApiFormat()

    console.log('Contract JSON:', JSON.stringify(contractData, null, 2))

    if (props.isEdit) {
      await contractService.updateTelevisionContract(props.contract!.guid, contractData as ITelevisionContractUpdateRequest)
    } else {
      await contractService.createTelevisionContract(contractData as ITelevisionContractCreateRequest)
    }

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

const loadClientsAndAgencies = async () => {
  try {
    const [clientsResponse, agenciesResponse, clientTypesResponse] = await Promise.all([
      clientService.getAllClientsInfo(),
      agencyService.getAllAgencies(),
      clientService.getClientTypes().catch(() => [])
    ])

    clients.value = clientsResponse
    agencies.value = agenciesResponse
    clientTypes.value = clientTypesResponse
  } catch (error) {
    console.error('Failed to load clients and agencies:', error)
  }
}

onMounted(() => {
  loadClientsAndAgencies()
  isClientCopy.value = store.isClientCopy
})
</script>

<style scoped>
.contract-modal {
  --el-dialog-border-radius: 16px;
}

.contract-form {
  max-height: 75vh;
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

.draft-management {
  margin-bottom: 16px;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.section-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}

.section-icon.green {
  background: #f0fdf4;
  color: #16a34a;
}

.section-icon.purple {
  background: #faf5ff;
  color: #9333ea;
}

.section-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}

.select-with-action {
  display: flex;
  gap: 8px;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-label {
  font-weight: 500;
}

.option-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}

.product-card {
  margin-bottom: 16px;
}

.product-header,
.description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.items-section {
  margin-top: 16px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.items-header,
.transmission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.items-title,
.transmission-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-regular);
  margin: 0;
}

.items-table {
  margin-bottom: 12px;
}

.amount-value {
  font-weight: 600;
  color: #2563eb;
}

.product-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color);
  font-size: 14px;
}

.product-total-value {
  font-weight: 700;
  color: #16a34a;
}

.description-card {
  margin-bottom: 16px;
}

.transmission-section {
  margin-top: 16px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.schedule-row {
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.summary-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.totals-summary {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.total-row:last-child {
  border-bottom: none;
}

.grand-total {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  margin: 8px -20px -20px;
  padding: 16px 20px;
  border-radius: 0 0 8px 8px;
}

.grand-total-words {
  font-size: 13px;
  font-style: italic;
  color: var(--el-text-color-secondary);
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
  margin-bottom: 6px;
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
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
}

:deep(.el-table .el-input-number) {
  width: 100%;
}

@media (max-width: 768px) {
  .contract-modal {
    --el-dialog-width: 95vw;
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
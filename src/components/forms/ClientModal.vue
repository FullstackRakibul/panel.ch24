<template>
  <el-dialog v-model="dialogVisible" :title="modalStore.isEditMode ? 'Edit Client' : 'Create New Client'" width="800px"
    :close-on-click-modal="false" :close-on-press-escape="false" class="client-modal" top="5vh"
    @close="handleDialogClose">
    <template #header>
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ modalStore.isEditMode ? 'Edit Client' : 'Create New Client' }}
            </h2>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ modalStore.isEditMode ? 'Update client information below' : 'Fill in the details to add a new client'
              }}
              <span v-if="modalStore.hasClientModalData" class="text-xs text-blue-500 ml-2">
                (Draft saved)
              </span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default" class="client-form">
      <!-- Basic Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-50 flex items-center justify-center rounded-full">
              <User class="w-4 h-4 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Client Name" prop="clintName">
              <el-input v-model="form.clintName" placeholder="Enter client name" :prefix-icon="User"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Email Address" prop="email">
              <el-input v-model="form.email" type="email" placeholder="Enter email address" :prefix-icon="Mail"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone Number" prop="phone">
              <el-input v-model="form.phone" placeholder="Enter phone number" :prefix-icon="Phone"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Mobile Number">
              <el-input v-model="form.mobile" placeholder="Enter mobile number" :prefix-icon="Phone"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Toll-Free Number">
              <el-input v-model="form.tollFreeNumber" placeholder="Enter toll-free number" :prefix-icon="Phone"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Address Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
              <MapPin class="w-4 h-4 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="City">
              <el-input v-model="form.city" placeholder="Enter city" :prefix-icon="MapPin" @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Location" prop="location">
              <el-input v-model="form.location" placeholder="Enter location" :prefix-icon="MapPin"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Country">
              <el-input v-model="form.country" placeholder="Enter country" :prefix-icon="MapPin"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Client Classification Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
              <Building2 class="w-4 h-4 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Client Classification</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Client Type" prop="cTypeId">
              <el-select v-model="form.cTypeId" placeholder="Select client type" class="w-full"
                @change="handleFormChange" :loading="loadingClientTypes">
                <el-option v-for="type in clientTypes" :key="type.guid" :label="type.cTypeName" :value="type.guid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Agency">
              <el-select v-model="form.agencyId" placeholder="Select agency (optional)" class="w-full"
                @change="handleFormChange" :loading="loadingAgencies" clearable filterable>
                <el-option v-for="agency in agencies" :key="agency.guid" :label="agency.agencyName"
                  :value="agency.guid">
                  <div class="flex items-center justify-between">
                    <span>{{ agency.agencyName }}</span>
                    <span v-if="agency.email" class="text-xs text-gray-500">{{ agency.email }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Additional Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <FileText class="w-4 h-4 text-orange-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Tax ID / Registration Number">
              <el-input v-model="form.taxId" placeholder="Enter tax ID or registration number" :prefix-icon="FileText"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Portfolio URL">
              <el-input v-model="form.portfolioURL" placeholder="https://example.com" :prefix-icon="Globe"
                @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Company Registration Date">
              <el-date-picker v-model="form.companyRegistrationDate" type="date" placeholder="Select date"
                class="w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Company Logo">
              <el-input v-model="form.companyLogo" placeholder="Enter company logo URL" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Remarks">
          <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="Enter any additional remarks or notes"
            @input="handleFormChange" />
        </el-form-item>
      </div>

      <!-- Draft Actions -->
      <div v-if="modalStore.hasClientModalData && !props.client" class="draft-actions">
        <el-alert title="Draft Saved" description="Your form data has been saved. You can continue where you left off."
          type="info" :closable="false" show-icon />
        <div class="draft-buttons">
          <el-button size="small" @click="clearDraft">
            Clear Draft
          </el-button>
          <el-button size="small" type="primary" @click="restoreDraft">
            Restore Draft
          </el-button>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <el-button size="large" @click="handleClose" :disabled="loading">
          Cancel
        </el-button>
        <el-button type="primary" size="large" :loading="loading" @click="handleSubmit">
          {{ loading ? 'Saving...' : (modalStore.isEditMode ? 'Update Client' : 'Create Client') }}
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

import {
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  MapPin,
  Building2
} from 'lucide-vue-next'
import type { IAgency, IClient, IClientCreateRequest, IClientType } from '@/interface/clients/clients.interface'
import { useModalStore } from '@/stores/clients'
import { agencyService } from '@/services/Agencies/agencies.services'

interface Props {
  modelValue: boolean
  client?: IClient | null
  loading?: boolean
  clientTypes: IClientType[]
}

const props = withDefaults(defineProps<Props>(), {
  client: null,
  loading: false,
  clientTypes: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [client: IClientCreateRequest]
}>()

const modalStore = useModalStore()
const formRef = ref<FormInstance>()

const agencies = ref<IAgency[]>([])
const loadingAgencies = ref(false)
const loadingClientTypes = ref(false)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Use store data as form source
const form = computed(() => modalStore.clientModalData)

const rules = {
  clintName: [
    { required: true, message: 'Please enter client name', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' }
  ],
  location: [
    { required: true, message: 'Please enter location', trigger: 'blur' }
  ],
  cTypeId: [
    { required: true, message: 'Please select client type', trigger: 'change' }
  ]
}

// Fetch agencies
const fetchAgencies = async () => {
  try {
    loadingAgencies.value = true
    const response = await agencyService.getAllAgencies()
    console.log("Agency getch data : ", response)
    agencies.value = response
  } catch (error) {
    console.error('Error fetching agencies:', error)
    ElMessage.error('Failed to load agencies')
  } finally {
    loadingAgencies.value = false
  }
}

// Debounced auto-save
const handleFormChange = debounce(() => {
  modalStore.saveToLocalStorage()
}, 500)

watch(() => props.client, (newClient) => {
  if (newClient) {
    // When editing existing client, load their data and don't save to draft
    modalStore.setClientModalData({
      clintName: newClient.clintName,
      email: newClient.email || '',
      phone: newClient.phone || '',
      mobile: newClient.mobile || '',
      city: newClient.city || '',
      location: newClient.location,
      country: newClient.country || '',
      cTypeId: newClient.cTypeId,
      agencyId: newClient.agencyId || null, // Ensure null instead of empty string
      taxId: newClient.taxId || '',
      tollFreeNumber: newClient.tollFreeNumber || '',
      portfolioURL: newClient.portfolioURL || '',
      companyRegistrationDate: newClient.companyRegistrationDate || '',
      companyLogo: newClient.companyLogo || '',
      remarks: newClient.remarks || ''
    })
    modalStore.isEditMode = true
    modalStore.editingClientId = newClient.guid
  } else {
    // When creating new client, check if we have draft data
    if (!modalStore.hasClientModalData) {
      modalStore.resetClientModalData()
    }
    modalStore.isEditMode = false
    modalStore.editingClientId = null
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible) {
    // Modal opened - load any existing draft data
    modalStore.loadFromLocalStorage()
    fetchAgencies() // Load agencies when modal opens
  }
})

const handleDialogClose = () => {
  // Don't reset data when modal closes accidentally
  // Data persists in store and localStorage
  dialogVisible.value = false
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // Prepare data for submission - ensure agencyId is null if empty
    const submitData: IClientCreateRequest = {
      ...form.value,
      agencyId: form.value.agencyId || null // Convert empty string to null
    }

    console.log("Submitting client data:", submitData)

    emit('save', submitData)
  } catch (error) {
    ElMessage.error('Please fill in all required fields correctly.')
  }
}

const clearDraft = () => {
  modalStore.resetClientModalData()
  modalStore.clearLocalStorage()
  ElMessage.success('Draft cleared')
}

const restoreDraft = () => {
  modalStore.loadFromLocalStorage()
  ElMessage.success('Draft restored')
}

onMounted(() => {
  // Load any existing draft data when component mounts
  modalStore.loadFromLocalStorage()
})
</script>

<style scoped>
.client-modal {
  --el-dialog-border-radius: 16px;
}

.modal-header {
  padding-bottom: 16px;
}

.client-form {
  max-height: 60vh;
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
  .client-modal {
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
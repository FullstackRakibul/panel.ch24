<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Client' : 'Create New Client'" width="800px"
    :close-on-click-modal="false" :close-on-press-escape="false" class="client-modal" top="5vh">
    <template #header>
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ isEdit ? 'Edit Client' : 'Create New Client' }}
            </h2>
            <p class="text-sm text-gray-600">
              {{ isEdit ? 'Update client information below' : 'Fill in the details to add a new client' }}
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
            <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <User class="w-4 h-4 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Client Name" prop="name">
              <el-input v-model="form.name" placeholder="Enter client name" :prefix-icon="User" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Contact Person" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="Enter contact person name" :prefix-icon="UserCheck" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Email Address" prop="email">
              <el-input v-model="form.email" type="email" placeholder="Enter email address" :prefix-icon="Mail" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Title/Position" prop="title">
              <el-input v-model="form.title" placeholder="e.g., CEO, CTO, Manager" :prefix-icon="Briefcase" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Phone Number" prop="phone">
              <el-input v-model="form.phone" placeholder="Enter phone number" :prefix-icon="Phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Toll-Free Number">
              <el-input v-model="form.tollFreeNumber" placeholder="Enter toll-free number" :prefix-icon="Phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Website">
              <el-input v-model="form.website" placeholder="https://example.com" :prefix-icon="Globe" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Subject/Project">
              <el-input v-model="form.subject" placeholder="e.g., Mobile App Design" :prefix-icon="FileText" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Address Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <MapPin class="w-4 h-4 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Address Information</h3>
          </div>
        </div>

        <el-form-item label="Address" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="2" placeholder="Enter complete address" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="City" prop="city">
              <el-input v-model="form.city" placeholder="Enter city" :prefix-icon="MapPin" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="State" prop="state">
              <el-input v-model="form.state" placeholder="Enter state" :prefix-icon="MapPin" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Country" prop="country">
              <el-select v-model="form.country" placeholder="Select country" class="w-full" filterable>
                <el-option label="বাংলাদেশ" value="Bangladesh">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>বাংলাদেশ</span>
                  </div>
                </el-option>
                <el-option label="Canada" value="Canada">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>Canada</span>
                  </div>
                </el-option>
                <el-option label="United Kingdom" value="UK">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>United Kingdom</span>
                  </div>
                </el-option>
                <el-option label="Australia" value="Australia">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>Australia</span>
                  </div>
                </el-option>
                <el-option label="Germany" value="Germany">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>Germany</span>
                  </div>
                </el-option>
                <el-option label="France" value="France">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>France</span>
                  </div>
                </el-option>
                <el-option label="Japan" value="Japan">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>Japan</span>
                  </div>
                </el-option>
                <el-option label="Other" value="Other">
                  <div class="flex items-center">
                    <el-icon class="mr-2">
                      <Flag />
                    </el-icon> <span>Other</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Client Classification Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Building2 class="w-4 h-4 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Client Classification</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Client Type" prop="type">
              <el-select v-model="form.type" placeholder="Select client type" class="w-full">
                <el-option label="Agent" value="agent" />
                <el-option label="Company" value="company" />
                <el-option label="Individual" value="individual" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type === 'agent'">
            <el-form-item label="Associated Agency">
              <el-select v-model="form.agencyId" placeholder="Select agency" class="w-full">
                <el-option label="Creative Agency" value="1" />
                <el-option label="Media Partners" value="2" />
                <el-option label="Digital Solutions" value="3" />
                <el-option label="Brand Masters" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Additional Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText class="w-4 h-4 text-orange-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Additional Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Tax ID / Registration Number">
              <el-input v-model="form.taxId" placeholder="Enter tax ID or registration number"
                :prefix-icon="FileText" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Company Registration Date">
              <el-date-picker v-model="form.companyRegistrationDate" type="date" placeholder="Select date"
                class="w-full" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Office Space Ownership">
          <el-radio-group v-model="form.officeSpaceOwnership">
            <el-radio label="owned">Owned</el-radio>
            <el-radio label="rental">Rental</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Company Logo">
          <el-upload class="upload-demo" action="#" :auto-upload="false" :on-change="handleLogoUpload" :limit="1"
            :file-list="form.companyLogo ? [{ name: 'Company Logo', url: '' }] : []" :on-exceed="handleExceed">
            <el-button type="primary" :icon="Upload">Choose File</el-button>
            <template #tip>
              <div class="el-upload__tip text-xs text-gray-500 mt-1">
                PNG/JPG file with a size less than 500KB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <el-button size="large" @click="handleClose">
          Cancel
        </el-button>
        <el-button type="primary" size="large" :loading="loading" :disabled="!isFormValid" @click="handleSubmit">
          {{ loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FormInstance, UploadFile, UploadFiles } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Client } from '@/stores/clients'
import {
  Flag 
} from '@element-plus/icons-vue'
import {
  User,
  UserCheck,
  Mail,
  Phone,
  Globe,
  FileText,
  MapPin,
  Building2,
  Briefcase,
  Upload
} from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  client?: Client | null
  isEdit?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  client: null,
  isEdit: false,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [client: Client]
}>()

const formRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref<Client>({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  type: 'company',
  contactPerson: '',
  title: '',
  taxId: '',
  tollFreeNumber: '',
  website: '',
  subject: '',
  companyRegistrationDate: null,
  officeSpaceOwnership: 'owned',
  companyLogo: null
})

const rules = {
  name: [
    { required: true, message: 'Please enter client name', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Please enter address', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Please enter city', trigger: 'blur' }
  ],
  state: [
    { required: true, message: 'Please enter state', trigger: 'blur' }
  ],
  contactPerson: [
    { required: true, message: 'Please enter contact person name', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Please select client type', trigger: 'change' }
  ]
}

const isFormValid = computed(() => {
  return form.value.name.trim() &&
    form.value.email.trim() &&
    form.value.phone.trim() &&
    form.value.address.trim() &&
    form.value.city.trim() &&
    form.value.state.trim() &&
    form.value.contactPerson.trim() &&
    form.value.type
})

watch(() => props.client, (newClient) => {
  if (newClient) {
    form.value = { ...newClient }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (visible) => {
  if (visible && !props.client) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    type: 'company',
    contactPerson: '',
    title: '',
    taxId: '',
    tollFreeNumber: '',
    website: '',
    subject: '',
    companyRegistrationDate: null,
    officeSpaceOwnership: 'owned',
    companyLogo: null
  }
  formRef.value?.clearValidate()
}

const handleLogoUpload = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const isJPGorPNG = uploadFile.raw?.type === 'image/jpeg' || uploadFile.raw?.type === 'image/png'
  const isLt500KB = uploadFile.raw ? uploadFile.raw.size / 1024 < 500 : false

  if (!isJPGorPNG) {
    ElMessage.error('Company logo must be JPG/PNG format!')
    form.value.companyLogo = null
    return false
  }
  if (!isLt500KB) {
    ElMessage.error('Company logo size cannot exceed 500KB!')
    form.value.companyLogo = null
    return false
  }

  form.value.companyLogo = uploadFile.raw
  return true
}

const handleExceed = () => {
  ElMessage.warning('You can only upload 1 file. Please remove the existing one before re-uploading.')
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
    ElMessage.error('Please fill in all required fields correctly.')
  }
}
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
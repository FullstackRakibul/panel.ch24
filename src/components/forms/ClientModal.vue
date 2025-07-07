<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2" @click="$emit('close')">
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all"
      @click.stop
    >
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEdit ? 'Edit Client' : 'Add New Client' }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isEdit ? 'Update client information below' : 'Fill in the details to add a new client' }}
          </p>
        </div>
        <el-button
          @click="$emit('close')"
          type="text"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
        >
          <X class="h-6 w-6" />
        </el-button>
      </div>

      <div class="overflow-y-auto max-h-[calc(90vh-160px)]">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="p-6 space-y-8"
        >
          <div class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <User class="h-5 w-5 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <el-form-item label="Client Name" prop="name">
                <el-input v-model="form.name" placeholder="Enter client name" />
              </el-form-item>

              <el-form-item label="Contact Person" prop="contactPerson">
                <el-input v-model="form.contactPerson" placeholder="Enter contact person name" />
              </el-form-item>

              <el-form-item label="Email Address" prop="email">
                <el-input v-model="form.email" type="email" placeholder="Enter email address" />
              </el-form-item>

              <el-form-item label="Phone Number" prop="phone">
                <el-input v-model="form.phone" type="tel" placeholder="Enter phone number" />
              </el-form-item>

              <el-form-item label="Toll-Free Number">
                <el-input v-model="form.tollFreeNumber" placeholder="Enter toll-free number" />
              </el-form-item>

              <el-form-item label="Website">
                <el-input v-model="form.website" placeholder="Enter website URL (e.g., https://example.com)" />
              </el-form-item>
            </div>

            <el-form-item label="Address" prop="address">
              <el-input
                v-model="form.address"
                type="textarea"
                :rows="3"
                placeholder="Enter complete address"
              />
            </el-form-item>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <el-form-item label="City" prop="city">
                    <el-input v-model="form.city" placeholder="Enter city" />
                </el-form-item>
                <el-form-item label="State" prop="state">
                    <el-input v-model="form.state" placeholder="Enter state" />
                </el-form-item>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Building2 class="h-5 w-5 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Client Classification</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <el-form-item label="Client Type" prop="type">
                <el-select v-model="form.type" placeholder="Select client type" class="w-full">
                  <el-option label="Agent" value="agent"></el-option>
                  <el-option label="Company" value="company"></el-option>
                  <el-option label="Individual" value="individual"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="form.type === 'agent'" label="Associated Agency">
                <el-select v-model="form.agencyId" placeholder="Select agency" class="w-full">
                  <el-option label="Creative Agency" value="1"></el-option>
                  <el-option label="Media Partners" value="2"></el-option>
                  <el-option label="Digital Solutions" value="3"></el-option>
                  <el-option label="Brand Masters" value="4"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
                <FileText class="h-5 w-5 text-green-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Other Information</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <el-form-item label="Tax ID / Registration Number">
                <el-input
                  v-model="form.taxId"
                  placeholder="Enter tax ID or registration number"
                />
                <p class="text-sm text-gray-500 mt-2">Optional - Used for invoice generation and tax purposes</p>
              </el-form-item>

              <el-form-item label="Company Registration Date">
                <el-date-picker
                  v-model="form.companyRegistrationDate"
                  type="date"
                  placeholder="Select date"
                  class="w-full"
                />
              </el-form-item>
            </div>

            <el-form-item label="Office Space Ownership">
                <el-radio-group v-model="form.officeSpaceOwnership">
                    <el-radio label="owned">Owned</el-radio>
                    <el-radio label="rental">Rental</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="Company Logo">
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :on-change="handleLogoUpload"
                :limit="1"
                :file-list="form.companyLogo ? [{ name: form.companyLogo.name, url: '' }] : []"
                :on-exceed="handleExceed"
              >
                <el-button type="primary">Choose File</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    PNG/JPG file with a size less than 500KB.
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="flex items-center justify-end gap-4 p-6 border-t border-gray-100 bg-gray-50">
        <el-button
          @click="$emit('close')"
          class="px-6 py-3 font-semibold"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="loading"
          class="px-8 py-3 font-semibold flex items-center gap-2"
        >
          <span v-if="loading" class="el-icon-loading animate-spin"></span>
          {{ loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElUpload,
  ElDatePicker,
  ElButton,
  ElMessage, // For showing warnings about file size/type
  type FormInstance,
  type UploadFile,
  type UploadFiles,
  type UploadRawFile
} from 'element-plus'
import { X, User, Building2, FileText } from 'lucide-vue-next'

// Define the Client interface to include new fields
interface Client {
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  type: 'agent' | 'company' | 'individual' | '' // Updated client types
  agencyId?: string // Optional for agent type
  taxId?: string
  city?: string
  state?: string
  tollFreeNumber?: string
  website?: string
  companyRegistrationDate?: Date | null
  officeSpaceOwnership?: 'owned' | 'rental' | ''
  companyLogo?: File | null // To store the actual File object
}

interface Props {
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
  close: []
  save: [client: Client]
}>()

const formRef = ref<FormInstance>()

const form = ref<Client>({
  name: '',
  email: '',
  phone: '',
  address: '',
  contactPerson: '',
  type: '', // Default to empty, require selection
  taxId: '',
  city: '',
  state: '',
  tollFreeNumber: '',
  website: '',
  companyRegistrationDate: null,
  officeSpaceOwnership: '',
  companyLogo: null
})

// Validation rules for Element Plus form
const rules = {
  name: [{ required: true, message: 'Please enter client name', trigger: 'blur' }],
  contactPerson: [{ required: true, message: 'Please enter contact person', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
  ],
  phone: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }],
  address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
  city: [{ required: true, message: 'Please enter city', trigger: 'blur' }],
  state: [{ required: true, message: 'Please enter state', trigger: 'blur' }],
  type: [{ required: true, message: 'Please select client type', trigger: 'change' }]
}

watch(() => props.client, (newClient) => {
  if (newClient) {
    // Ensure reactivity for new fields
    form.value = {
      ...newClient,
      city: newClient.city || '',
      state: newClient.state || '',
      tollFreeNumber: newClient.tollFreeNumber || '',
      website: newClient.website || '',
      companyRegistrationDate: newClient.companyRegistrationDate ? new Date(newClient.companyRegistrationDate) : null,
      officeSpaceOwnership: newClient.officeSpaceOwnership || '',
      companyLogo: newClient.companyLogo || null
    }
  } else {
    // Reset form for new client
    form.value = {
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      type: '',
      taxId: '',
      city: '',
      state: '',
      tollFreeNumber: '',
      website: '',
      companyRegistrationDate: null,
      officeSpaceOwnership: '',
      companyLogo: null
    }
  }
}, { immediate: true })


const handleLogoUpload = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const isJPGorPNG = uploadFile.raw?.type === 'image/jpeg' || uploadFile.raw?.type === 'image/png'
  const isLt500KB = uploadFile.raw ? uploadFile.raw.size / 1024 < 500 : false

  if (!isJPGorPNG) {
    ElMessage.error('Company logo must be JPG/PNG format!')
    // Clear the file list if invalid type
    form.value.companyLogo = null;
    return false
  }
  if (!isLt500KB) {
    ElMessage.error('Company logo size cannot exceed 500KB!')
    // Clear the file list if too large
    form.value.companyLogo = null;
    return false
  }
  
  // Store the raw file object
  form.value.companyLogo = uploadFile.raw;
  return true
}

const handleExceed = (files: File[], uploadFiles: UploadFiles) => {
  ElMessage.warning(`You can only upload 1 file. Please remove the existing one before re-uploading.`)
}


const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      if (!props.loading) {
        emit('save', form.value)
      }
    } else {
      ElMessage.error('Please fill in all required fields correctly.')
    }
  })
}
</script>

<style scoped>
/* Base styling for labels - Element Plus handles the actual input styling */
:deep(.el-form-item__label) {
  @apply text-sm font-semibold text-gray-900 mb-2; /* Adjusted mb-2 for slightly tighter spacing */
}

/* Customizing Element Plus input, select, textarea borders and focus */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  @apply border border-gray-200 rounded-xl px-4 py-2; /* Consistent border and padding */
  box-shadow: none !important; /* Remove default Element Plus shadow */
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus),
:deep(.el-select__wrapper.is-focused) {
  @apply ring-2 ring-gray-900 border-transparent; /* Custom focus ring */
}

/* Adjusting ElButton styles for a more minimalist look */
:deep(.el-button) {
  @apply rounded-xl font-semibold; /* Consistent border-radius and font weight */
  border: none !important; /* Remove default borders */
  box-shadow: none !important; /* Remove default shadows */
}

/* Primary button styles */
:deep(.el-button--primary) {
  @apply bg-gray-900 text-white hover:bg-gray-800;
}

/* Default button (Cancel) styles */
:deep(.el-button:not(.el-button--primary)) {
  @apply text-gray-700 hover:bg-gray-100 hover:text-gray-900;
}

/* File upload button styling */
:deep(.el-upload-dragger) {
  @apply rounded-xl border border-dashed border-gray-300;
}
:deep(.el-upload-list__item) {
  @apply rounded-xl border border-gray-200;
}

/* Date picker input styling */
:deep(.el-date-editor.el-input),
:deep(.el-date-editor.el-input__wrapper) {
    @apply w-full; /* Ensure date picker takes full width */
}
:deep(.el-date-editor.el-input__wrapper .el-input__inner) {
    @apply px-0; /* Remove default inner padding to rely on wrapper padding */
}
</style>
<template>
  <el-dialog v-model="showModal" :title="isEdit ? 'Edit Agency' : 'Add New Agency'" width="800px"
    :close-on-click-modal="false" :close-on-press-escape="false" class="agency-modal" top="5vh"
    @close="handleDialogClose">
    <template #header>
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Building2 class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ isEdit ? 'Edit Agency' : 'Create New Agency' }}
            </h2>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ isEdit ? 'Update agency information below' : 'Fill in the details to add a new agency' }}
              <span v-if="agencyModalStore.hasAgencyModalData && !isEdit" class="text-xs text-blue-500 ml-2">
                (Draft saved)
              </span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <el-form ref="formRef" :model="agencyModalStore.agencyModalData" :rules="rules" label-position="top" size="default"
      class="agency-form">
      <!-- Basic Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-50 flex items-center justify-center rounded-full">
              <Building2 class="w-4 h-4 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Agency Name" prop="agencyName">
              <el-input v-model="agencyModalStore.agencyModalData.agencyName" placeholder="Enter agency name"
                :prefix-icon="Building2" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Tagline" prop="tagline">
              <el-input v-model="agencyModalStore.agencyModalData.tagline" placeholder="Enter tagline"
                :prefix-icon="Tag" @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Slogan" prop="slogan">
              <el-input v-model="agencyModalStore.agencyModalData.slogan" placeholder="Enter slogan"
                :prefix-icon="MessageSquare" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="agencyModalStore.agencyModalData.email" type="email" placeholder="Enter email address"
                :prefix-icon="Mail" @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="agencyModalStore.agencyModalData.phone" placeholder="Enter phone number"
                :prefix-icon="Phone" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Location Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
              <MapPin class="w-4 h-4 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Location Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="Location" prop="location">
              <el-input v-model="agencyModalStore.agencyModalData.location" placeholder="Enter location"
                :prefix-icon="MapPin" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Company Details Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
              <Users class="w-4 h-4 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Company Details</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Company Size" prop="companySize">
              <el-select v-model="agencyModalStore.agencyModalData.companySize" placeholder="Select company size"
                class="w-full" @change="handleFormChange">
                <el-option label="1-10" :value="10" />
                <el-option label="11-50" :value="50" />
                <el-option label="51-200" :value="200" />
                <el-option label="201-500" :value="500" />
                <el-option label="501-1000" :value="1000" />
                <el-option label="1000+" :value="1001" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Budget">
              <el-input-number v-model="agencyModalStore.agencyModalData.budget" :min="0" :precision="2"
                placeholder="Enter budget" controls-position="right" style="width: 100%" @change="handleFormChange">
                <template #prefix>৳</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Rating">
              <el-input-number v-model="agencyModalStore.agencyModalData.rating" :min="0" :max="5" :step="0.1"
                placeholder="Enter rating" controls-position="right" style="width: 100%" @change="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Review Count">
              <el-input-number v-model="agencyModalStore.agencyModalData.reviewCount" :min="0"
                placeholder="Review count" controls-position="right" style="width: 100%" @change="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Additional Information Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <Globe class="w-4 h-4 text-orange-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
          </div>
        </div>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Logo URL">
              <el-input v-model="agencyModalStore.agencyModalData.logo" placeholder="Enter logo URL"
                :prefix-icon="Image" @input="handleFormChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Portfolio URL">
              <el-input v-model="agencyModalStore.agencyModalData.portfolioURL" placeholder="https://example.com"
                :prefix-icon="Globe" @input="handleFormChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Draft Actions -->
      <div v-if="agencyModalStore.hasAgencyModalData && !isEdit" class="draft-actions">
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
          {{ loading ? 'Saving...' : (isEdit ? 'Update Agency' : 'Create Agency') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import { type FormInstance, type FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Tag,
  MessageSquare,
  Image
} from 'lucide-vue-next';
import type { ICreateAgency, IUpdateAgency } from '@/interface/agency/agencies.interface';
import { useAgencyModalStore } from '@/stores/agency-modal.store';

const agencyModalStore = useAgencyModalStore();
const formRef = ref<FormInstance>();

interface Props {
  modelValue: boolean;
  isEdit?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', data: ICreateAgency | IUpdateAgency): void;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false
});

const emit = defineEmits<Emits>();

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const rules: FormRules = {
  agencyName: [
    { required: true, message: 'Please enter agency name', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  location: [
    { required: true, message: 'Please enter location', trigger: 'blur' }
  ]
};

// Debounced auto-save
const handleFormChange = debounce(() => {
  if (!props.isEdit) {
    agencyModalStore.saveToLocalStorage();
  }
}, 500);

const handleDialogClose = () => {
  // Don't reset data when modal closes accidentally
  // Data persists in store and localStorage
  showModal.value = false;
};

const handleClose = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  // Prepare data for emission
  const formData = { ...agencyModalStore.agencyModalData };

  // Convert numbers to strings for API compatibility
  const emitData: any = {
    agencyName: formData.agencyName,
    tagline: formData.tagline,
    location: formData.location,
    slogan: formData.slogan,
    logo: formData.logo,
    email: formData.email,
    phone: formData.phone,
    portfolioURL: formData.portfolioURL,
    companySize: formData.companySize,
    rating: formData.rating?.toString(),
    reviewCount: formData.reviewCount?.toString(),
    budget: formData.budget?.toString(),
  };

  // Remove undefined values
  Object.keys(emitData).forEach(key => {
    if (emitData[key] === undefined || emitData[key] === '') {
      delete emitData[key];
    }
  });

  emit('save', emitData);
};

const clearDraft = () => {
  agencyModalStore.resetAgencyModalData();
  agencyModalStore.clearLocalStorage();
  ElMessage.success('Draft cleared');
};

const restoreDraft = () => {
  agencyModalStore.loadFromLocalStorage();
  ElMessage.success('Draft restored');
};

onMounted(() => {
  // Load any existing draft data when component mounts
  if (!props.isEdit) {
    agencyModalStore.loadFromLocalStorage();
  }
});

// Auto-save to localStorage when form data changes
watch(() => agencyModalStore.agencyModalData, (newData) => {
  if (!props.isEdit) {
    agencyModalStore.saveToLocalStorage();
  }
}, { deep: true });
</script>

<style scoped>
.agency-modal {
  --el-dialog-border-radius: 16px;
}

.modal-header {
  padding-bottom: 16px;
}

.agency-form {
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

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .agency-modal {
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
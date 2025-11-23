<template>
  <el-dialog v-model="showModal" :title="isEdit ? 'Edit Agency' : 'Add New Agency'" width="600px"
    :before-close="handleClose">
    <el-form ref="formRef" :model="agencyModalStore.agencyModalData" :rules="rules" label-width="120px"
      label-position="left">
      <el-form-item label="Agency Name" prop="agencyName">
        <el-input v-model="agencyModalStore.agencyModalData.agencyName" placeholder="Enter agency name" />
      </el-form-item>

      <el-form-item label="Tagline" prop="tagline">
        <el-input v-model="agencyModalStore.agencyModalData.tagline" placeholder="Enter tagline" />
      </el-form-item>

      <el-form-item label="Location" prop="location">
        <el-input v-model="agencyModalStore.agencyModalData.location" placeholder="Enter location" />
      </el-form-item>

      <el-form-item label="Slogan" prop="slogan">
        <el-input v-model="agencyModalStore.agencyModalData.slogan" placeholder="Enter slogan" />
      </el-form-item>

      <el-form-item label="Logo URL" prop="logo">
        <el-input v-model="agencyModalStore.agencyModalData.logo" placeholder="Enter logo URL" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="agencyModalStore.agencyModalData.email" placeholder="Enter email" type="email" />
      </el-form-item>

      <el-form-item label="Phone" prop="phone">
        <el-input v-model="agencyModalStore.agencyModalData.phone" placeholder="Enter phone number" />
      </el-form-item>

      <el-form-item label="Portfolio URL" prop="portfolioURL">
        <el-input v-model="agencyModalStore.agencyModalData.portfolioURL" placeholder="Enter portfolio URL" />
      </el-form-item>

      <el-form-item label="Company Size" prop="companySize">
        <el-select v-model="agencyModalStore.agencyModalData.companySize" placeholder="Select company size"
          style="width: 100%">
          <el-option label="1-10" :value="10" />
          <el-option label="11-50" :value="50" />
          <el-option label="51-200" :value="200" />
          <el-option label="201-500" :value="500" />
          <el-option label="501-1000" :value="1000" />
          <el-option label="1000+" :value="1001" />
        </el-select>
      </el-form-item>

      <el-form-item label="Rating" prop="rating">
        <el-input-number v-model="agencyModalStore.agencyModalData.rating" :min="0" :max="5" :step="0.1"
          controls-position="right" style="width: 100%" />
      </el-form-item>

      <el-form-item label="Review Count" prop="reviewCount">
        <el-input-number v-model="agencyModalStore.agencyModalData.reviewCount" :min="0" controls-position="right"
          style="width: 100%" />
      </el-form-item>

      <el-form-item label="Budget" prop="budget">
        <el-input-number v-model="agencyModalStore.agencyModalData.budget" :min="0" :precision="2"
          controls-position="right" style="width: 100%">
          <template #prefix>৳</template>
        </el-input-number>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { type FormInstance, type FormRules } from 'element-plus';
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
    { required: true, message: 'Please input agency name', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: 'Please input valid email', trigger: 'blur' }
  ]
};

// Auto-save to localStorage when form data changes
watch(() => agencyModalStore.agencyModalData, (newData) => {
  if (!props.isEdit) {
    agencyModalStore.saveToLocalStorage();
  }
}, { deep: true, immediate: true });

const handleClose = () => {
  showModal.value = false;
  if (!props.isEdit) {
    // Only clear localStorage when closing create modal
    // agencyModalStore.clearLocalStorage();
  }
  agencyModalStore.resetAgencyModalData();
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
</script>
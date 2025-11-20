<template>
  <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Edit Agency' : 'Create New Agency'" width="600px"
    :before-close="handleClose" class="agency-modal" destroy-on-close>
    <div class="form-wrapper">
      <div v-if="isLoading" class="loading-overlay">
        <el-skeleton :rows="12" animated />
      </div>

      <el-form :model="form" ref="agencyFormRef" label-position="top" class="agency-form" :disabled="isLoading">
        <div class="form-grid">
          <el-form-item label="Agency Name" prop="AgencyName" class="form-col-1">
            <el-input v-model="form.AgencyName" placeholder="Enter agency name" prefix-icon="Building" clearable />
          </el-form-item>
          <el-form-item label="Location" prop="Location" class="form-col-2">
            <el-input v-model="form.Location" placeholder="e.g., Dhaka, Bangladesh" prefix-icon="Location" clearable />
          </el-form-item>
        </div>

        <el-form-item label="Tagline" prop="Tagline">
          <el-input v-model="form.Tagline" placeholder="Your agency tagline" clearable />
        </el-form-item>

        <el-form-item label="Slogan" prop="Slogan">
          <el-input v-model="form.Slogan" type="textarea" :rows="2" placeholder="Agency slogan or mission statement"
            clearable />
        </el-form-item>

        <div class="form-grid">
          <el-form-item label="Email" prop="Email" class="form-col-1">
            <el-input v-model="form.Email" type="email" placeholder="contact@agency.com" prefix-icon="Message"
              clearable />
          </el-form-item>
          <el-form-item label="Phone" prop="Phone" class="form-col-2">
            <el-input v-model="form.Phone" placeholder="+8801700000000" prefix-icon="Phone" clearable />
          </el-form-item>
        </div>

        <el-form-item label="Logo URL" prop="Logo">
          <el-input v-model="form.Logo" placeholder="https://example.com/logo.png" prefix-icon="Picture" clearable />
        </el-form-item>

        <el-form-item label="Portfolio URL" prop="PortfolioURL">
          <el-input v-model="form.PortfolioURL" placeholder="https://agency.com" prefix-icon="Link" clearable />
        </el-form-item>

        <div class="form-grid">
          <el-form-item label="Company Size" prop="CompanySize" class="form-col-1">
            <el-input-number v-model="form.CompanySize" :min="1" :max="10000" controls-position="right" class="w-full"
              placeholder="Employee count" />
          </el-form-item>
          <el-form-item label="Budget (৳)" prop="Budget" class="form-col-2">
            <el-input v-model="form.Budget" type="number" placeholder="0" prefix-icon="Money" clearable />
          </el-form-item>
        </div>

        <div class="form-grid">
          <el-form-item label="Rating" prop="Rating" class="form-col-1">
            <el-input v-model="form.Rating" type="number" :min="0" :max="5" step="0.1" placeholder="0 - 5" clearable />
          </el-form-item>
          <el-form-item label="Review Count" prop="ReviewCount" class="form-col-2">
            <el-input-number v-model="reviewCountNum" :min="0" controls-position="right" class="w-full"
              @input="(val) => (form.ReviewCount = String(val))" />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="isSubmitting || isLoading">Cancel</el-button>
        <el-button type="primary" :loading="isSubmitting" :disabled="isLoading" @click="handleSubmit">
          {{ isEditMode ? "Save Changes" : "Create Agency" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue"
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElButton,
  ElMessage,
  ElSkeleton,
} from "element-plus"
import type { FormInstance } from "element-plus"

import { useAgenciesStore } from "@/stores/agencies"
import type { CreateAgencyInterface } from "@/interface/agency/agencies.interface";

const props = defineProps<{
  visible: boolean
  agency?: CreateAgencyInterface | null
}>()

const emit = defineEmits<{
  "update:visible": [boolean]
  save: [CreateAgencyInterface]
}>()

const agenciesStore = useAgenciesStore()

const dialogVisible = ref(props.visible)
const isEditMode = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const agencyFormRef = ref<FormInstance>()

const defaultForm: CreateAgencyInterface = {
  Id: "",
  AgencyName: "",
  Tagline: "",
  Location: "",
  Slogan: "",
  Logo: "",
  Email: "",
  Phone: "",
  PortfolioURL: "",
  CompanySize: 0,
  Rating: "0",
  ReviewCount: "0",
  Budget: "",
}

const form = reactive<CreateAgencyInterface>({ ...defaultForm })

const reviewCountNum = computed({
  get: () => Number(form.ReviewCount),
  set: (val) => {
    form.ReviewCount = String(val)
  },
})

const rules = reactive({
  AgencyName: [
    { required: true, message: "Agency name is required", trigger: "blur" },
    { min: 3, message: "Agency name must be at least 3 characters", trigger: "blur" },
  ],
  Tagline: [
    { required: true, message: "Tagline is required", trigger: "blur" },
    { min: 5, message: "Tagline must be at least 5 characters", trigger: "blur" },
  ],
  Location: [{ required: true, message: "Location is required", trigger: "blur" }],
  Slogan: [{ required: true, message: "Slogan is required", trigger: "blur" }],
  Logo: [
    { required: true, message: "Logo URL is required", trigger: "blur" },
    {
      pattern:
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: "Please enter a valid URL",
      trigger: "blur",
    },
  ],
  Email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Please enter a valid email", trigger: "blur" },
  ],
  Phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      message: "Please enter a valid phone number",
      trigger: "blur",
    },
  ],
  PortfolioURL: [
    { required: true, message: "Portfolio URL is required", trigger: "blur" },
    {
      pattern:
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: "Please enter a valid URL",
      trigger: "blur",
    },
  ],
  CompanySize: [
    { required: true, message: "Company size is required", trigger: "blur" },
    { type: "number", message: "Please enter a valid number", trigger: "blur" },
  ],
  Rating: [
    { required: true, message: "Rating is required", trigger: "blur" },
    {
      pattern: /^([0-5](\.[0-9])?|5(\.0)?)$/,
      message: "Rating must be between 0 and 5",
      trigger: "blur",
    },
  ],
  ReviewCount: [
    { required: true, message: "Review count is required", trigger: "blur" },
  ],
  Budget: [{ required: true, message: "Budget is required", trigger: "blur" }],
})

const handleSubmit = () => {
  agencyFormRef.value?.validate(async (valid) => {
    // if (valid) {
    //   isSubmitting.value = true
    //   try {
    //     if (isEditMode.value && form.id) {
    //       await agenciesStore.updateAgency(form.id, form)
    //       ElMessage.success("Agency updated successfully")
    //     } else {
    //       await agenciesStore.createAgency(form)
    //       ElMessage.success("Agency created successfully")
    //     }

    //     emit("save", { ...form })
    //     handleClose()
    //   } catch (error) {
    //     ElMessage.error("Failed to save agency")
    //     console.error("[v0] Save error:", error)
    //   } finally {
    //     isSubmitting.value = false
    //   }
    // } else {
    //   ElMessage.error("Please correct the form errors")
    // }
  })
}

const handleClose = () => {
  dialogVisible.value = false
  emit("update:visible", false)
  agencyFormRef.value?.resetFields()
}

watch(
  () => props.visible,
  async (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      isLoading.value = true
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (props.agency) {
        Object.assign(form, props.agency)
        isEditMode.value = true
      } else {
        Object.assign(form, defaultForm)
        isEditMode.value = false
      }

      isLoading.value = false
      agencyFormRef.value?.clearValidate()
    }
  },
)
</script>

<style scoped>
.agency-modal :deep(.el-dialog__header) {

  background: linear-gradient(135deg, #f5f7fa 0%, #f9fafb 100%);
}

.agency-modal :deep(.el-dialog__title) {

  letter-spacing: 0.5px;
}

.agency-modal :deep(.el-dialog__body) {

  max-height: 70vh;
  overflow-y: auto;
}

.agency-modal :deep(.el-dialog__footer) {

  text-align: right;
}

.form-wrapper {

  min-height: 400px;
}


@media (max-width: 640px) {
  .form-grid {}
}

.agency-form :deep(.el-form-item) {}

.agency-form :deep(.el-form-item__label) {
  font-size: 13px;
  letter-spacing: 0.3px;
}

.agency-form :deep(.el-input__wrapper),
.agency-form :deep(.el-select__wrapper),
.agency-form :deep(.el-input-number__wrapper) {
  transition: all 0.3s ease;
}

.agency-form :deep(.el-input__wrapper:hover),
.agency-form :deep(.el-select__wrapper:hover) {}

.agency-form :deep(.el-input__wrapper.is-focus),
.agency-form :deep(.el-select__wrapper.is-focused) {}

.agency-form :deep(.el-input__inner) {}

.agency-form :deep(.el-textarea__inner) {}

.agency-form :deep(.is-disabled) {}

.dialog-footer {}

.dialog-footer button:first-child {}

.dialog-footer button:last-child {}

.loading-overlay {
  z-index: 10;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;
}

.loading-overlay :deep(.el-skeleton__item) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
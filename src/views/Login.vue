<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 sm:p-6 lg:p-8 font-inter">
    <div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row w-full max-w-6xl">
      <!-- Left Section (Placeholder for marketing/info) -->
      <div class="hidden lg:flex lg:w-1/2 p-8 items-center justify-center bg-gradient-to-br  relative">
        <div class="text-center space-y-4">
          <h2 class="text-4xl font-extrabold text-gray-900 leading-tight">
            Welcome back!
          </h2>
          <p class="text-lg text-gray-700 max-w-sm mx-auto">
            Start managing your billing and invoicing faster and better.
          </p>
          <!-- You can add more elements here, like illustrations or key features -->
          <img src="https://rsssc.org/assest/img/Login.jpg" alt="Illustration" class="mt-8 max-w-xl mx-auto rounded-lg " />
        </div>
      </div>

      <!-- Right Section (Login Form) -->
      <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <div class="max-w-md mx-auto w-full space-y-8">
          <div>
            <!-- Replaced image with text for a cleaner, minimalist look as per demo -->
             <div class="text-center mb-6 flex flex-row items-center justify-center">
                             <img src="@/assets/CH24.png" alt="Channel 24" class="h-16 w-16" />
             </div>
            
            <p class="mt-2 font-bold text-center text-lg text-gray-600">System Dashboard
            </p>
          </div>
          <!-- Demo Credentials Info -->
          <!-- <el-alert title="Demo Credentials" type="info" show-icon :closable="false" class="rounded-lg">
            <p class="text-sm"><strong>Email:</strong> admin@ch24.com</p>
            <p class="text-sm"><strong>Password:</strong> admin@ch24.com</p>
          </el-alert> -->
          
          <el-form ref="loginFormRef" :model="form" :rules="rules" class="space-y-6">
            <el-form-item prop="email">
              <el-input
                v-model="form.email"
                placeholder="Email address"
                :prefix-icon="MessageSquare"
                size="large"
                class="rounded-lg"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="Password"
                :prefix-icon="Lock"
                show-password
                size="large"
                class="rounded-lg"
              />
            </el-form-item>

            <div class="flex items-center justify-between">
              <el-checkbox v-model="rememberMe" label="Remember me" size="small">
                <span class="text-sm text-gray-900">Remember me</span>
              </el-checkbox>

              <el-button
                type="text"
                @click="fillDemoCredentials"
                class="font-medium text-primary  hover:text-blue-800 p-0 h-auto"
              >
                Use demo credentials
              </el-button>
            </div>

            <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" class="rounded-lg" />

            <div>
              <el-button
                type="primary"
                @click="submitForm"
                :loading="loading"
                size="large"
                class="w-full py-2.5 rounded-lg bg-[#b94720] font-semibold tracking-wide"
              >
                <span v-if="loading">Signing in...</span>
                <span v-else>Sign in</span>
              </el-button>
            </div>
          </el-form>

          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              or
            </span>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <el-button size="large" class="w-full flex items-center justify-center rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google" class="h-5 w-5 mr-2" />
              Sign in with Google
            </el-button>
            <el-button size="large" class="w-full flex items-center justify-center rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjvzC_QRv6moAhgNb5C6e3yicKgFND1g2RwA&s" alt="Facebook" class="h-5 w-5 mr-2" />
              Sign in with Facebook
            </el-button>
          </div>

          <!-- <div class="text-center text-sm mt-6">
            <p class="text-gray-600">
              Don't have an account?
              <el-button type="text" class="text-blue-600 hover:text-blue-800 p-0 h-auto">Sign Up</el-button>
            </p>
          </div> -->

          <div class="text-center mt-8">
            <p class="text-xs text-gray-500">
              © 2024 Channel 24. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MessageSquare, Lock } from 'lucide-vue-next'
import { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElAlert, type FormInstance } from 'element-plus'
import 'element-plus/es/components/message/style/css' // Import ElMessage styles if you use it elsewhere
import type { FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()

const form = reactive({
  email: '',
  password: ''
})

const rememberMe = ref(false) // Added remember me state

const error = ref('')
const loading = ref(false)

// Validation rules for Element Plus form
const rules: FormRules = {
  email: [
    {
      required: true,
      message: 'Please input email',
      trigger: 'blur',
      type: 'email' // ✅ MUST be literal
    }
  ],
  password: [
    {
      required: true,
      message: 'Please input password',
      trigger: 'blur',
      min: 6, // optional length rule
      type: 'string'
    }
  ]
}

const fillDemoCredentials = () => {
  form.email = 'admin@ch24.com'
  form.password = 'admin@ch24.com'
}



const submitForm = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    error.value = ''
    loading.value = true

    const result = await authStore.login(form)

    if (result.success) {
      router.push('/')
    } else {
      error.value = result.message || 'Login failed'
    }

    loading.value = false
  } catch (validationError) {
    console.log('Validation failed!')
    // Element Plus form validation will show error messages next to fields
  }
}
</script>

<style scoped>
/* Customizing Element Plus input, button, checkbox, alert for minimalist design */
:deep(.el-input__wrapper) {
  @apply rounded-lg px-4 py-2.5 border border-gray-200 shadow-sm;
  box-shadow: none !important; /* Remove default Element Plus shadow */
}

:deep(.el-input__wrapper.is-focus) {
  @apply ring-2 ring-blue-500 border-transparent; /* Custom focus ring */
}

:deep(.el-button) {
  @apply rounded-lg font-semibold;
  border: none !important; /* Remove default borders */
  box-shadow: none !important; /* Remove default shadows */
}

:deep(.el-button--primary) {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  @apply bg-blue-600 border-blue-600;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  @apply text-blue-600;
}

:deep(.el-alert) {
  @apply rounded-lg;
}

/* Ensure the font is applied globally if not already */
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
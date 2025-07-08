<script setup lang="ts">
import { onMounted, computed, onErrorCaptured } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Sidebar from '@/layouts/Sidebar.vue'
import HeaderComponent from '@/layouts/HeaderComponent.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isLoginPage = computed(() => route.path === '/login')

// Error handling
onErrorCaptured((error, instance, info) => {
  console.error('Vue error captured:', error, info)
  return false // Don't propagate error
})

onMounted(async () => {
  try {
    authStore.initializeAuth()
    themeStore.initializeTheme()
  } catch (error) {
    console.error('App initialization error:', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <!-- Error Boundary -->
    <Suspense>
      <template #default>
        <template v-if="!isLoginPage && authStore.isAuthenticated">
          <div class="flex h-screen">
            <Sidebar />
            <div class="flex-1 flex flex-col overflow-hidden">
              <HeaderComponent />
              <main class="flex-1 overflow-y-auto p-6">
                <RouterView v-slot="{ Component, route }">
                  <Transition name="fade" mode="out-in">
                    <component :is="Component" :key="route.path" />
                  </Transition>
                </RouterView>
              </main>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterView />
        </template>
      </template>

      <template #fallback>
        <div class="loading-screen">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading Channel 24...</p>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #ffffff;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #A02408;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 1024px) {}
</style>
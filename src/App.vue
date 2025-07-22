<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <!-- Main App Content -->
    <div v-if="!isLoginPage && authStore.isAuthenticated" class="flex h-screen">
      <!-- Sidebar Component: Receives mobileSidebarOpen as a prop and emits updates -->
      <Sidebar :mobileSidebarOpen="mobileSidebarOpen" @update:mobileSidebarOpen="mobileSidebarOpen = $event" />
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header Component: Receives mobileSidebarOpen as prop and emits 'toggle-sidebar' -->
        <HeaderComponent :mobileSidebarOpen="mobileSidebarOpen" @toggle-sidebar="handleToggleSidebar" />
        <main class="flex-1 overflow-y-auto">
          <Suspense>
            <template #default>
              <RouterView v-slot="{ Component, route }">
                <Transition name="fade" mode="out-in">
                  <component :is="Component" :key="route.path" />
                </Transition>
              </RouterView>
            </template>

            <template #fallback>
              <div class="loading-container">
                <div class="loading-content">
                  <div class="loading-spinner"></div>
                  <h2>Loading...</h2>
                  <p>Please wait while we load the page</p>
                </div>
              </div>
            </template>
          </Suspense>
        </main>
      </div>
    </div>

    <!-- Login Page -->
    <div v-else>
      <Suspense>
        <template #default>
          <RouterView />
        </template>

        <template #fallback>
          <div class="loading-container">
            <div class="loading-content">
              <div class="loading-spinner"></div>
              <h2>Loading Channel 24...</h2>
              <p>Please wait while we prepare your dashboard</p>
            </div>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onErrorCaptured } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import Sidebar from './layouts/Sidebar.vue'
import HeaderComponent from './layouts/HeaderComponent.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isLoginPage = computed(() => route.path === '/login')

// Mobile sidebar state - single source of truth
const mobileSidebarOpen = ref(false)

// Handle toggle sidebar event from HeaderComponent
const handleToggleSidebar = (isOpen: boolean) => {
  console.log('App.vue: Received toggle-sidebar event from HeaderComponent. New state:', isOpen)
  mobileSidebarOpen.value = isOpen
}

// Error handling
onErrorCaptured((error, instance, info) => {
  console.error('Vue error captured:', error, info)
  return false // Don't propagate error
})

onMounted(async () => {
  try {
    // Initialize stores
    authStore.initializeAuth()
    themeStore.initializeTheme()

    // Register service worker for PWA (only in production)
    // if ('serviceWorker' in navigator && import.meta.env.PROD) {
    //   try {
    //     const registration = await navigator.serviceWorker.register('/sw.js')
    //     console.log('SW registered: ', registration)
    //   } catch (registrationError) {
    //     console.log('SW registration failed: ', registrationError)
    //   }
    // }
  } catch (error) {
    console.error('App initialization error:', error)
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loading-content {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #A02408;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

.loading-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.loading-content p {
  font-size: 16px;
  opacity: 0.8;
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
</style>
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Sidebar from '@/layouts/Sidebar.vue'
import HeaderComponent from '@/layouts/HeaderComponent.vue'
import FooterComponent from '@/layouts/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const isLoginPage = computed(() => route.path === '/login')

onMounted(() => {
  authStore.initializeAuth()
  themeStore.initializeTheme()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <template v-if="!isLoginPage && authStore.isAuthenticated">
      <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 flex flex-col overflow-hidden">
          <HeaderComponent />
          <main class="flex-1 overflow-y-auto p-6">
            <RouterView  :key="route.fullPath" />
          </main>
          <FooterComponent />
        </div>
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {}
</style>

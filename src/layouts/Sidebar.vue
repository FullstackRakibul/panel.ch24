<template>
  <el-aside 
    :width="themeStore.sidebarCollapsed ? '72px' : '280px'"
    class="sidebar-container"
  >
    <!-- Logo Section -->
    <div class="logo-section">
      <div class="logo-content" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
        <div class="logo-wrapper">
          <el-avatar :size="themeStore.sidebarCollapsed ? 32 : 40" class="logo-avatar">
            <img src="@/assets/CH24.png" alt="Channel 24" class="h-12 w-12" />
          </el-avatar>
          <div v-if="!themeStore.sidebarCollapsed" class="logo-info">
            <div class="logo-title">Channel 24</div>
            <div class="logo-subtitle">Billing & Analytics System</div>
          </div>
        </div>
        
        <!-- Collapse Toggle -->
        <el-button
          v-if="!themeStore.sidebarCollapsed"
          :icon="Fold"
          text
          size="small"
          class="collapse-btn"
          @click="themeStore.toggleSidebar"
        />
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="menu-section">
      <nav class="sidebar-nav">
        <div class="nav-group">
          <router-link
  v-for="item in mainMenuItems"
  :key="item.path"
  :to="item.path"
  class="nav-item"
>
  <el-tooltip
    v-if="themeStore.sidebarCollapsed"
    :content="item.name"
    placement="right"
    :show-after="500"
  >
    <div class="nav-item-content">
      <el-icon class="nav-icon">
        <component :is="item.icon" />
      </el-icon>
      <span v-if="!themeStore.sidebarCollapsed" class="nav-label">{{ item.name }}</span>
    </div>
  </el-tooltip>
</router-link>

        </div>

        <!-- Management Section -->
        <div v-if="!themeStore.sidebarCollapsed" class="nav-section">
          <div class="section-title">Management</div>
          <div class="nav-group">
            <router-link
              v-for="item in managementItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'active': isActiveRoute(item.path) }"
            >
              <div class="nav-item-content">
                <el-icon class="nav-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="nav-label">{{ item.name }}</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- System Section -->
        <div v-if="!themeStore.sidebarCollapsed" class="nav-section">
          <div class="section-title">System</div>
          <div class="nav-group">
            <router-link
              v-for="item in systemItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'active': isActiveRoute(item.path) }"
            >
              <div class="nav-item-content">
                <el-icon class="nav-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="nav-label">{{ item.name }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </nav>
    </div>

    <!-- User Section -->
    <div class="user-section">
      <div class="user-content" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
        <el-dropdown trigger="click" placement="top-start" :disabled="themeStore.sidebarCollapsed">
          <div class="user-profile-section">
            <el-avatar :size="36" class="user-avatar">
              <img
        :src="currentUser.avatar"
      />
            </el-avatar>
            <div v-if="!themeStore.sidebarCollapsed" class="user-details">
              <div class="user-name">Admin User</div>
              <div class="user-status">
                <div class="status-dot"></div>
                <span class="status-text">Online</span>
              </div>
            </div>
            <el-icon v-if="!themeStore.sidebarCollapsed" class="dropdown-icon">
              <ArrowUp />
            </el-icon>
          </div>
          
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-menu">
              <el-dropdown-item @click="goToProfile">
                <el-icon><UserFilled /></el-icon>
                <span>Profile Settings</span>
              </el-dropdown-item>
              <el-dropdown-item @click="goToSettings">
                <el-icon><Setting /></el-icon>
                <span>Account Settings</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>Sign Out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Expand Button for Collapsed State -->
    <el-button
      v-if="themeStore.sidebarCollapsed"
      :icon="Expand"
      circle
      size="small"
      class="expand-toggle"
      @click="themeStore.toggleSidebar"
    />
  </el-aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import {
  HomeFilled,
  User,
  OfficeBuilding,
  Calendar,
  Document,
  CreditCard,
  DataAnalysis,
  Van,
  Setting,
  Fold,
  Expand,
  ArrowUp,
  UserFilled,
  SwitchButton,
  Search,
  Bell
} from '@element-plus/icons-vue'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const mainMenuItems = [
  { name: 'Dashboard', path: '/', icon: HomeFilled },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Notifications', path: '/notifications', icon: Bell }
]

const managementItems = [
  { name: 'Clients', path: '/clients', icon: User },
  { name: 'Agencies', path: '/agencies', icon: OfficeBuilding },
  { name: 'Ad Bookings', path: '/ad-bookings', icon: Calendar },
  { name: 'Invoices', path: '/invoices', icon: Document },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Reports', path: '/reports', icon: DataAnalysis },
  { name: 'Delivery Logs', path: '/delivery-logs', icon: Van }

]


const currentUser = computed(() => authStore.user || { 
   
   name: 'Admin User', 
   email: 'admin@ch24.com',
   role: 'Administrator',
   avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'
 })


const systemItems = [
  { name: 'Settings', path: '/settings', icon: Setting }
]

// const isActiveRoute = (path: string) => {
//   return computed(() => {
//     return route.path === path || route.path.startsWith(path)
//   }).value
// }

const isActiveRoute = (path: string) => route.path.startsWith(path)


const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar-container {
  background: #ffffff;
  border-right: 1px solid #f0f0f0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.logo-section {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.logo-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-content.collapsed {
  justify-content: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.logo-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
  flex-shrink: 0;
}

.logo-text {
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.logo-info {
  flex: 1;
  min-width: 0;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 2px;
}

.logo-subtitle {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
}

.collapse-btn {
  --el-button-text-color: #6b7280;
  --el-button-hover-text-color: #374151;
  --el-button-hover-bg-color: #f3f4f6;
  flex-shrink: 0;
}

.menu-section {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-nav {
  padding: 0 16px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-section {
  margin-top: 32px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item:hover .nav-item-content {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item.active .nav-item-content {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background-color: #2563eb;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
  color: inherit;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
  color: inherit;
  white-space: nowrap;
}

.user-section {
  padding: 16px 24px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.user-content {
  display: flex;
  align-items: center;
}

.user-content.collapsed {
  justify-content: center;
}

.user-profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.user-profile-section:hover {
  background-color: #f3f4f6;
}

.user-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #10b981, #059669);
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  color: #6b7280;
}

.dropdown-icon {
  font-size: 14px;
  color: #9ca3af;
  flex-shrink: 0;
}

.expand-toggle {
  position: absolute;
  top: 24px;
  right: -16px;
  z-index: 10;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --el-button-text-color: #6b7280;
  --el-button-hover-text-color: #374151;
  --el-button-hover-bg-color: #f9fafb;
}

.user-dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.user-dropdown-menu :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Dark mode styles */
.dark .sidebar-container {
  background: #1f2937;
  border-right-color: #374151;
}

.dark .logo-title {
  color: #f9fafb;
}

.dark .logo-subtitle {
  color: #9ca3af;
}

.dark .section-title {
  color: #6b7280;
}

.dark .nav-item:hover .nav-item-content {
  background-color: #374151;
  color: #f3f4f6;
}

.dark .nav-item.active .nav-item-content {
  background-color: #1e40af;
  color: #dbeafe;
}

.dark .user-profile-section:hover {
  background-color: #374151;
}

.dark .user-name {
  color: #f9fafb;
}

.dark .status-text {
  color: #9ca3af;
}

.dark .expand-toggle {
  background: #374151;
  border-color: #4b5563;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar-container.mobile-open {
    transform: translateX(0);
  }
}
</style>

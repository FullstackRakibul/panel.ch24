<template>
  <el-header class="header-container">
    <!-- Left Section - Page Title -->
    <div class="header-left">
      <h1 class="page-title">
        {{ getPageTitle }}
        <span v-if="getPageCount" class="page-count">({{ getPageCount }})</span>
      </h1>
    </div>

    <!-- Center - Search -->
    <div class="header-center">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="Search here..."
          :prefix-icon="Search"
          size="large"
          class="search-input"
          clearable
        />
      </div>
    </div>

    <!-- Right Section -->
    <div class="header-right">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <!-- Help/Info Button -->
        <el-tooltip content="Help & Support" placement="bottom">
          <el-button
            :icon="QuestionFilled"
            circle
            size="large"
            class="action-btn"
            @click="openHelp"
          />
        </el-tooltip>

        <!-- Notifications -->
        <el-dropdown
          trigger="click"
          placement="bottom-end"
          @visible-change="handleNotificationVisibility"
        >
          <div class="notification-trigger">
            <el-badge :value="unreadNotifications" :hidden="unreadNotifications === 0" class="notification-badge">
              <el-button
                :icon="Bell"
                circle
                size="large"
                class="action-btn"
              />
            </el-badge>
          </div>
          
          <template #dropdown>
            <el-dropdown-menu class="notification-dropdown">
              <div class="notification-header">
                <h3>Notifications</h3>
                <el-button type="primary" link size="small">Mark all as read</el-button>
              </div>
              
              <div class="notification-list">
                <div
  v-for="notification in recentNotifications"
  :key="notification.id"
  class="notification-item flex items-start gap-3"
  :class="{ 'unread': !notification.read }"
>
  <el-icon class="text-blue-500 mt-1"><Bell /></el-icon>
  <div class="notification-content">
    <div class="notification-title">{{ notification.title }}</div>
    <div class="notification-message">{{ notification.message }}</div>
    <div class="notification-time">{{ notification.time }}</div>
  </div>
</div>

              </div>
              
              <div class="notification-footer">
                <el-button type="primary" link>View all notifications</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- User Profile -->
      <el-dropdown trigger="click" placement="bottom-end">
        <div class="user-profile">
          <el-avatar :size="36" class="user-avatar">
            <img
        :src="currentUser.avatar"
      />
          </el-avatar>
          <div class="user-info">
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-role">{{ currentUser.role || 'Administrator' }}</div>
          </div>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <!-- User Info Header -->
            <div class="user-dropdown-header flex gap-3 items-center">
  <el-avatar :size="48" :src="currentUser.avatar" @error="errorHandler" class="user-avatar-large" >
    <img
        :src="currentUser.avatar"
      />
    </el-avatar>
  <div class="user-details">
    <div class="user-name-large">{{ currentUser.name }}</div>
    <div class="user-email">{{ currentUser.email }}</div>
    <div class="user-role-small">{{ currentUser.role || 'Administrator' }}</div>
  </div>
</div>

            
            <el-divider class="dropdown-divider" />
            
            <!-- Menu Items -->
            <el-dropdown-item
              v-for="item in userMenuItems"
              :key="item.name"
              @click="item.action"
              class="user-menu-item"
            >
              <el-icon class="menu-icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </el-dropdown-item>
            
            <el-divider class="dropdown-divider" />
            
            <!-- Theme Toggle -->
            <div class="theme-toggle-section">
              <div class="theme-toggle-label">
                <el-icon><Moon /></el-icon>
                <span>Dark Mode</span>
              </div>
              <el-switch
                :model-value="themeStore.isDark"
                @change="themeStore.toggleTheme"
                size="small"
              />

            </div>
            
            <el-divider class="dropdown-divider" />
            
            <!-- Logout -->
            <el-dropdown-item @click="handleLogout" class="logout-item">
              <el-icon class="menu-icon"><SwitchButton /></el-icon>
              <span>Sign Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useClientsStore } from '@/stores/clients'
import { 
  Search, 
  Bell, 
  User, 
  Moon, 
  Setting, 
  UserFilled, 
  CreditCard, 
  QuestionFilled, 
  SwitchButton 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const clientsStore = useClientsStore()
const errorHandler = () => true
const searchQuery = ref('')

const currentUser = computed(() => authStore.user || { 
   
  name: 'Admin User', 
  email: 'admin@ch24.com',
  role: 'Administrator',
  avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'
})

const recentNotifications = ref([
  {
    id: 1,
    title: 'New Invoice Payment',
    message: 'Payment received for Invoice #INV-001',
    time: '2 min ago',
    read: false
  },
  {
    id: 2,
    title: 'Invoice Overdue',
    message: 'Invoice #INV-003 is now 5 days overdue',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    title: 'New Client Added',
    message: 'Global Retail Inc has been added',
    time: '3 hours ago',
    read: true
  }
])

const unreadNotifications = computed(() => 
  recentNotifications.value.filter(n => !n.read).length
)

const userMenuItems = [
  { name: 'My Profile', icon: UserFilled, action: () => router.push('/profile') },
  { name: 'Account Settings', icon: Setting, action: () => router.push('/settings') },
  { name: 'Billing & Plans', icon: CreditCard, action: () => router.push('/billing') },
  { name: 'Help & Support', icon: QuestionFilled, action: () => openHelp() }
]

const getPageTitle = computed(() => {
  const routeNames: Record<string, string> = {
    '/': 'Dashboard',
    '/clients': 'Clients',
    '/agencies': 'Agencies',
    '/ad-bookings': 'Ad Bookings',
    '/invoices': 'Invoices',
    '/payments': 'Payments',
    '/reports': 'Reports',
    '/delivery-logs': 'Delivery Logs',
    '/settings': 'Settings'
  }
  return routeNames[route.path] || 'Dashboard'
})

const getPageCount = computed(() => {
  if (route.path === '/clients') {
    return clientsStore.clients.length
  }
  // Add other counts as needed
  return null
})

const openHelp = () => {
  window.open('/help', '_blank')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleNotificationVisibility = (visible: boolean) => {
  // Handle notification dropdown visibility
}
</script>

<style scoped>
.header-container {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  flex: 0 0 auto;
  min-width: 200px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-count {
  font-size: 16px;
  font-weight: 400;
  color: #6b7280;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
  margin: 0 40px;
}

.search-container {
  width: 100%;
  max-width: 400px;
}

.search-input {
  --el-input-border-radius: 8px;
  --el-input-border-color: #e5e7eb;
  --el-input-focus-border-color: #3b82f6;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  --el-button-border-color: transparent;
  --el-button-bg-color: transparent;
  --el-button-text-color: #6b7280;
  --el-button-hover-bg-color: #f3f4f6;
  --el-button-hover-text-color: #374151;
  --el-button-hover-border-color: transparent;
}

.notification-trigger {
  position: relative;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #ef4444;
  border: 2px solid #ffffff;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.user-profile:hover {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

.user-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
}

/* Dropdown Styles */
.notification-dropdown {
  width: 380px;
  max-height: 480px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.notification-list {
  max-height: 320px;
  overflow-y: auto;
}

.notification-item {
  padding: 16px 20px;
  border-bottom: 1px solid #f9fafb;
  transition: background-color 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.user-dropdown {
  width: 280px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.user-avatar-large {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

.user-details {
  flex: 1;
}

.user-name-large {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-email {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
}

.user-role-small {
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-divider {
  margin: 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  transition: background-color 0.2s;
}

.user-menu-item:hover {
  background-color: #f9fafb;
}

.menu-icon {
  font-size: 16px;
  color: #6b7280;
}

.theme-toggle-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
}

.theme-toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.logout-item {
  color: #ef4444;
}

.logout-item:hover {
  background-color: #fef2f2;
}

/* Dark mode styles */
.dark .header-container {
  background: #1f2937;
  border-bottom-color: #374151;
}

.dark .page-title {
  color: #f9fafb;
}

.dark .page-count {
  color: #9ca3af;
}

.dark .user-profile:hover {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .user-name {
  color: #f9fafb;
}

.dark .user-role {
  color: #9ca3af;
}


/* Soft background on dropdowns */
.user-dropdown,
.notification-dropdown {
  background-color: #fff;
  border: 1px solid #e5e7eb;
}

/* Soft shadows */
.user-dropdown,
.notification-dropdown {
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

/* Dropdown icons */
.menu-icon {
  color: #6b7280;
  transition: color 0.2s;
}

.user-menu-item:hover .menu-icon {
  color: #374151;
}



/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .header-center {
    margin: 0 16px;
  }
  
  .user-info {
    display: none;
  }
  
  .page-title {
    font-size: 18px;
  }
}
</style>

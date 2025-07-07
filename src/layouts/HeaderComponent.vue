<template>
  <el-header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-0 h-16 flex items-center justify-between">
    <!-- Left Section -->
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
          Good {{ greeting }}, {{ firstName }}!
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentDate }}
        </p>
      </div>
    </div>

    <!-- Center - Search -->
    <div class="flex-1 max-w-xl mx-8">
      <el-input
        v-model="searchQuery"
        placeholder="Search clients, invoices, reports..."
        :prefix-icon="Search"
        size="large"
        class="search-input"
      />
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <el-button
        :icon="themeStore.isDark ? Sunny : Moon"
        circle
        size="large"
        @click="themeStore.toggleTheme"
        class="theme-toggle"
      />

      <!-- Notifications -->
      <el-dropdown
        trigger="click"
        placement="bottom-end"
        @visible-change="handleNotificationVisibility"
      >
        <el-badge :value="unreadNotifications" :hidden="unreadNotifications === 0">
          <el-button :icon="Bell" circle size="large" class="notification-btn" />
        </el-badge>
        
        <template #dropdown>
          <el-dropdown-menu class="notification-dropdown">
            <div class="notification-header">
              <h3 class="text-lg font-semibold">Notifications</h3>
              <el-button type="primary" link size="small">Mark all as read</el-button>
            </div>
            
            <el-tabs v-model="activeNotificationTab" class="notification-tabs">
              <el-tab-pane label="Direct" name="direct">
                <div class="notification-list">
                  <div
                    v-for="notification in directNotifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{ 'unread': !notification.read }"
                  >
                    <div class="notification-content">
                      <div class="notification-title">{{ notification.title }}</div>
                      <div class="notification-message">{{ notification.message }}</div>
                      <div class="notification-actions" v-if="notification.actions">
                        <el-button
                          v-for="action in notification.actions"
                          :key="action"
                          type="primary"
                          size="small"
                          plain
                        >
                          {{ action }}
                        </el-button>
                      </div>
                    </div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="Watching" name="watching">
                <div class="notification-list">
                  <div class="empty-state">
                    <el-empty description="No watching notifications" />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            
            <div class="notification-footer">
              <el-button type="primary" link>View all notifications</el-button>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- User Menu -->
      <el-dropdown trigger="click" placement="bottom-end">
        <div class="user-avatar-section">
          <el-avatar :size="40" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-info hidden lg:block">
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-email">{{ currentUser.email }}</div>
          </div>
          <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <!-- User Info Header -->
            <div class="user-dropdown-header">
              <el-avatar :size="48" class="user-avatar-large">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-details">
                <div class="user-name-large">{{ currentUser.name }}</div>
                <div class="user-email-small">{{ currentUser.email }}</div>
                <div class="user-role">Administrator</div>
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
                v-model="themeStore.isDark"
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { 
  Search, 
  Bell, 
  User, 
  ArrowDown, 
  Sunny, 
  Moon, 
  Setting, 
  UserFilled, 
  CreditCard, 
  QuestionFilled, 
  SwitchButton 
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const searchQuery = ref('')
const activeNotificationTab = ref('direct')

const currentUser = computed(() => authStore.user || { 
  name: 'Admin User', 
  email: 'admin@ch24.com' 
})

const directNotifications = ref([
  {
    id: 1,
    title: 'New Invoice Payment',
    message: 'Payment received for Invoice #INV-001 from TechCorp Solutions',
    time: '2 min ago',
    read: false,
    actions: ['View Invoice', 'Send Receipt']
  },
  {
    id: 2,
    title: 'Invoice Overdue',
    message: 'Invoice #INV-003 is now 5 days overdue',
    time: '1 hour ago',
    read: false,
    actions: ['Send Reminder', 'View Details']
  },
  {
    id: 3,
    title: 'New Client Registration',
    message: 'Global Retail Inc has been added to your client list',
    time: '3 hours ago',
    read: true
  }
])

const unreadNotifications = computed(() => 
  directNotifications.value.filter(n => !n.read).length
)

const userMenuItems = [
  { name: 'My Profile', icon: UserFilled, action: () => router.push('/profile') },
  { name: 'Account Settings', icon: Setting, action: () => router.push('/settings') },
  { name: 'Billing & Plans', icon: CreditCard, action: () => router.push('/billing') },
  { name: 'Help & Support', icon: QuestionFilled, action: () => window.open('/help', '_blank') }
]

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const firstName = computed(() => {
  return currentUser.value.name?.split(' ')[0] || 'Admin'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleNotificationVisibility = (visible: boolean) => {
  // Handle notification dropdown visibility
}
</script>

<style scoped>
.search-input {
  --el-input-border-radius: 12px;
}

.theme-toggle, .notification-btn {
  --el-button-border-color: transparent;
  --el-button-bg-color: transparent;
  --el-button-hover-bg-color: var(--el-fill-color-light);
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-avatar-section:hover {
  background-color: var(--el-fill-color-light);
}

.user-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.user-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.dropdown-arrow {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.notification-dropdown {
  width: 400px;
  max-height: 500px;
}

.notification-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.notification-tabs {
  --el-tabs-header-height: 40px;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: var(--el-fill-color-lighter);
}

.notification-item.unread {
  background-color: var(--el-color-primary-light-9);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.notification-message {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.notification-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--el-border-color-light);
  text-align: center;
}

.user-dropdown {
  width: 320px;
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.user-avatar-large {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

.user-details {
  flex: 1;
}

.user-name-large {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.user-email-small {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.user-role {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.dropdown-divider {
  margin: 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
}

.menu-icon {
  font-size: 16px;
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
  font-weight: 500;
}

.logout-item {
  color: var(--el-color-danger);
}

.empty-state {
  padding: 40px 20px;
}
</style>

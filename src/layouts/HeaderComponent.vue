<template>
  <el-header class="header-container">
    <!-- Mobile Hamburger Menu Icon -->
    <div v-if="isMobile" class="mobile-menu-toggle" @click="toggleMobileSidebar">
      <el-icon :size="24">
        <Menu />
      </el-icon>
    </div>

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
        <el-input v-model="searchQuery" placeholder="Search here..." :prefix-icon="Search" size="large"
          class="search-input" clearable />
      </div>
    </div>

    <!-- Right Section -->
    <div class="header-right">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <!-- Help/Info Button -->
        <el-tooltip content="Help & Support" placement="bottom">
          <el-button :icon="QuestionFilled" circle size="large" class="action-btn" @click="openHelp" />
        </el-tooltip>

        <!-- Notifications -->
        <el-dropdown trigger="click" placement="bottom-end" @visible-change="handleNotificationVisibility">
          <div class="notification-trigger">
            <el-badge :value="unreadNotifications" :hidden="unreadNotifications === 0" class="notification-badge">
              <el-button :icon="Bell" circle size="large" class="action-btn" />
            </el-badge>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="notification-dropdown">
              <div class="notification-header">
                <h3>Notifications</h3>
                <el-button type="text" size="small" @click="markAllAsRead">Mark all as read</el-button>
              </div>
              <el-scrollbar max-height="300px">
                <div v-if="notifications.length > 0">
                  <div v-for="notification in notifications" :key="notification.id" class="notification-item"
                    :class="{ 'unread': !notification.read }">
                    <div class="notification-icon">
                      <el-icon>
                        <component :is="getNotificationIcon(notification.type)" />
                      </el-icon>
                    </div>
                    <div class="notification-content">
                      <div class="notification-title">{{ notification.title }}</div>
                      <div class="notification-message">{{ notification.message }}</div>
                      <div class="notification-time">{{ notification.time }}</div>
                    </div>
                    <el-button v-if="!notification.read" :icon="CircleCheck" circle size="small" class="mark-read-btn"
                      @click.stop="markAsRead(notification.id)" />
                  </div>
                </div>
                <div v-else class="empty-notifications">
                  <el-empty description="No new notifications" :image-size="50" />
                </div>
              </el-scrollbar>
              <div class="notification-footer">
                <el-button type="primary" link @click="viewAllNotifications">View All Notifications</el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- User Profile Dropdown -->
      <el-dropdown trigger="click" placement="bottom-end" @command="handleUserCommand">
        <div class="user-profile">
          <el-avatar :size="36" class="user-avatar">
            <img :src="currentUser.avatar" alt="User Avatar" />
          </el-avatar>
          <div class="user-info">
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-role">{{ currentUser.role }}</div>
          </div>
          <el-icon class="dropdown-arrow">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item command="profile" class="user-menu-item">
              <el-icon class="menu-icon">
                <UserFilled />
              </el-icon>
              <span>Profile Settings</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings" class="user-menu-item">
              <el-icon class="menu-icon">
                <Setting />
              </el-icon>
              <span>Account Settings</span>
            </el-dropdown-item>
            <el-dropdown-item command="theme" class="theme-toggle-section">
              <div class="theme-toggle-label">
                <el-icon class="menu-icon">
                  <component :is="themeStore.isDark ? Moon : Sunny" />
                </el-icon>
                <span>Dark Mode</span>
              </div>
              <el-switch :model-value="themeStore.isDark" @change="themeStore.toggleTheme" size="small" />
            </el-dropdown-item>
            <el-dropdown-item divided command="logout" class="user-menu-item logout-item">
              <el-icon class="menu-icon">
                <SwitchButton />
              </el-icon>
              <span>Sign Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useClientsStore } from '@/stores/clients' // Assuming you have this store
import {
  Search,
  Bell,
  QuestionFilled,
  UserFilled,
  Setting,
  SwitchButton,
  ArrowDown,
  InfoFilled,
  WarningFilled,
  SuccessFilled,
  CircleCheck,
  Moon,
  Sunny,
  Menu // Import Menu icon for hamburger
} from '@element-plus/icons-vue'

const props = defineProps<{
  mobileSidebarOpen: boolean; // Add this prop
}>();

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const clientsStore = useClientsStore() // Initialize clients store

const searchQuery = ref('')
const isMobile = ref(window.innerWidth <= 768); // Reactive mobile state


const mobileSidebarOpen = ref(false)
const showSearch = ref(false)

const currentUser = computed(() => authStore.user || {
  name: 'Admin User',
  email: 'admin@ch24.com',
  role: 'Administrator',
  avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'
})

// Dummy notifications data
const notifications = ref([
  { id: 1, title: 'New Invoice Created', message: 'Invoice #2023001 for Client A has been created.', type: 'success', time: '5 mins ago', read: false },
  { id: 2, title: 'Payment Due Soon', message: 'Invoice #2023005 for Client B is due in 2 days.', type: 'warning', time: '1 hour ago', read: false },
  { id: 3, title: 'System Update', message: 'The system will undergo maintenance tonight at 10 PM.', type: 'info', time: 'Yesterday', read: true },
])

const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length)

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return SuccessFilled
    case 'warning': return WarningFilled
    case 'info': return InfoFilled
    default: return Bell
  }
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const handleNotificationVisibility = (visible: boolean) => {
  if (!visible) {
    // Optionally mark all visible notifications as read when dropdown closes
    // notifications.value.forEach(n => n.read = true);
  }
}

const viewAllNotifications = () => {
  router.push('/notifications') // Redirect to a dedicated notifications page
}

const getPageTitle = computed(() => {
  // Logic to dynamically get page title based on route
  const path = route.path
  if (path === '/') return 'Dashboard'
  if (path.startsWith('/clients')) return 'Clients'
  if (path.startsWith('/agencies')) return 'Advertising Agencies'
  if (path.startsWith('/ad-bookings')) return 'Ad Bookings'
  if (path.startsWith('/invoices')) return 'Invoice Management'
  if (path.startsWith('/payments')) return 'Payments'
  if (path.startsWith('/reports')) return 'Reports'
  if (path.startsWith('/delivery-logs')) return 'Delivery Logs'
  if (path.startsWith('/settings')) return 'Settings'
  if (path.startsWith('/profile')) return 'Profile'
  if (path.startsWith('/todo')) return 'To-do List'
  if (path.startsWith('/goals')) return 'Goals'

  return 'Page Title'
})

const getPageCount = computed(() => {
  // This is a placeholder. In a real app, you'd fetch counts
  // For demonstration, let's return some dummy counts
  const path = route.path
  if (path === '/clients') return clientsStore.clients.length // Example using client store
  if (path === '/agencies') return 45
  if (path === '/invoices') return 345
  if (path === '/payments') return 280
  return 0
})

const openHelp = () => {
  window.open('#', '_blank') // Replace with actual help URL
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      authStore.logout()
      router.push('/login')
      break
  }
}

// Mobile specific functions
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  // If we transition from mobile to desktop, ensure sidebar is closed
  if (!isMobile.value && props.mobileSidebarOpen) {
    mobileSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});

const emit = defineEmits(['toggle-sidebar']);

const toggleMobileSidebar = () => {
  const newState = !props.mobileSidebarOpen; // Toggle the prop's value
  // console.log('HeaderComponent: Emitting toggle-sidebar with new state:', newState);
  emit('toggle-sidebar', newState); // Emit the new state
};

// Expose mobileSidebarOpen to the template
defineExpose({
  mobileSidebarOpen,
});
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: 'Poppins', sans-serif;
  z-index: 100;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left {
  flex-shrink: 0;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
}

.page-count {
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
}

.header-center {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}

.search-container {
  width: 100%;
  max-width: 400px;
}

.search-input {
  --el-input-border-radius: 8px;
  --el-input-border-color: #e5e7eb;
  --el-input-focus-border-color: #A02408;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #A02408;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(160, 36, 8, 0.1);
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  --el-button-bg-color: #f3f4f6;
  --el-button-text-color: #6b7280;
  --el-button-hover-bg-color: #e5e7eb;
  --el-button-hover-text-color: #374151;
  border: none;
  transition: all 0.2s ease;
}

.notification-trigger {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-badge {
  --el-badge-bg-color: #ef4444;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border: 1px solid transparent;
}

.user-profile:hover {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}

.dropdown-arrow {
  font-size: 14px;
  color: #9ca3af;
  margin-left: 4px;
}

/* Dropdown Menus */
.notification-dropdown,
.user-dropdown {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  padding: 0;
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9fafb;
}

.notification-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background-color: #fffbeb;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-icon {
  flex-shrink: 0;
  font-size: 20px;
  color: #A02408;
  margin-top: 2px;
}

.notification-item.unread .notification-icon {
  color: #A02408;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: #9ca3af;
}

.mark-read-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  --el-button-bg-color: #e5e7eb;
  --el-button-text-color: #6b7280;
  --el-button-hover-bg-color: #d1d5db;
  --el-button-hover-text-color: #374151;
}

.empty-notifications {
  padding: 20px;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  background-color: #f9fafb;
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
  color: #ef4444 !important;
}

.logout-item:hover {
  background-color: #fef2f2 !important;
}

/* Dark mode styles */
.dark .header-container {
  background-color: #1f2937;
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

.dark .action-btn {
  --el-button-bg-color: #374151;
  --el-button-text-color: #9ca3af;
  --el-button-hover-bg-color: #4b5563;
  --el-button-hover-text-color: #f9fafb;
}

.dark .search-input :deep(.el-input__wrapper) {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .search-input :deep(.el-input__wrapper.is-focus) {
  background-color: #4b5563;
  border-color: #A02408;
}

.dark .notification-dropdown,
.dark .user-dropdown {
  background-color: #1f2937;
  border-color: #374151;
}

.dark .notification-header {
  background-color: #374151;
  border-bottom-color: #4b5563;
}

.dark .notification-header h3 {
  color: #f9fafb;
}

.dark .notification-item.unread {
  background-color: #2d261e;
}

.dark .notification-item:hover {
  background-color: #374151;
}

.dark .notification-title {
  color: #f9fafb;
}

.dark .notification-message {
  color: #9ca3af;
}

.dark .notification-time {
  color: #6b7280;
}

.dark .mark-read-btn {
  --el-button-bg-color: #4b5563;
  --el-button-text-color: #9ca3af;
  --el-button-hover-bg-color: #6b7280;
  --el-button-hover-text-color: #f9fafb;
}

.dark .empty-notifications {
  background-color: #1f2937;
}

.dark .notification-footer {
  background-color: #374151;
  border-top-color: #4b5563;
}

.dark .user-menu-item:hover {
  background-color: #374151;
}

.dark .menu-icon {
  color: #9ca3af;
}

.dark .theme-toggle-label {
  color: #f9fafb;
}

.dark .logout-item:hover {
  background-color: #4b5563 !important;
}

/* Mobile specific styles */
.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  margin-right: 16px;
}

.mobile-menu-toggle:hover {
  background-color: #f3f4f6;
}

@media (max-width: 768px) {
  .header-container {
    padding-left: 16px;
    padding-right: 16px;
    justify-content: flex-start;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .header-center {
    display: none;
  }

  .header-right {
    margin-left: auto;
  }

  .page-title {
    font-size: 18px;
  }
}
</style>
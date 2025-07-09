<template>
  <el-aside :width="themeStore.sidebarCollapsed ? '80px' : '280px'" class="sidebar-container"
    :class="{ 'mobile-open': mobileSidebarOpen }">
    <!-- Mobile Toggle Button (Hamburger Menu) -->
    <div class="mobile-toggle" @click="toggleMobileSidebar">
      <el-icon :size="24">
        <Menu />
      </el-icon>
    </div>

    <!-- Header Section -->
    <div class="sidebar-header">
      <div class="header-content" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
        <!-- Logo and Brand -->
        <div class="brand-section">
          <div class="logo-wrapper">
            <img src="@/assets/CH24.png" alt="Channel 24" class="logo-image"
              :class="{ 'collapsed': themeStore.sidebarCollapsed }" />
            <div v-if="!themeStore.sidebarCollapsed" class="brand-info">
              <h1 class="brand-title">Channel 24</h1>
              <p class="brand-subtitle">Billing System</p>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div v-if="!themeStore.sidebarCollapsed" class="search-section">
          <el-input v-model="searchQuery" placeholder="Search" :prefix-icon="Search" size="large" class="sidebar-search"
            clearable />
          <div class="search-shortcut">Ctrl+D</div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="nav-section">
      <el-scrollbar class="nav-scrollbar">
        <!-- General Section -->
        <div class="nav-group">
          <div v-if="!themeStore.sidebarCollapsed" class="section-header">
            <span class="section-title">GENERAL</span>
          </div>

          <nav class="nav-menu">
            <router-link v-for="item in generalItems" :key="item.path" :to="item.path" class="nav-item"
              :class="{ 'active': isActiveRoute(item.path) }">
              <el-tooltip v-if="themeStore.sidebarCollapsed" :content="item.name" placement="right" :show-after="300">
                <div class="nav-content">
                  <el-icon class="nav-icon">
                    <component :is="item.icon" />
                  </el-icon>
                  <!-- Label and Badge only visible when not collapsed -->
                  <span v-if="!themeStore.sidebarCollapsed" class="nav-label">{{ item.name }}</span>
                  <el-tag v-if="item.badge && !themeStore.sidebarCollapsed" :type="item.badgeType || 'warning'"
                    size="small" class="nav-badge">
                    {{ item.badge }}
                  </el-tag>
                </div>
              </el-tooltip>

              <div v-else class="nav-content">
                <el-icon class="nav-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="nav-label">{{ item.name }}</span>
                <el-tag v-if="item.badge" :type="item.badgeType || 'warning'" size="small" class="nav-badge">
                  {{ item.badge }}
                </el-tag>
              </div>
            </router-link>
          </nav>
        </div>

        <!-- Management Section - Always present, content adjusts -->
        <div class="nav-group">
          <div v-if="!themeStore.sidebarCollapsed" class="section-header">
            <span class="section-title">MANAGEMENT</span>
          </div>

          <nav class="nav-menu">
            <router-link v-for="item in managementItems" :key="item.path" :to="item.path" class="nav-item"
              :class="{ 'active': isActiveRoute(item.path) }">
              <el-tooltip v-if="themeStore.sidebarCollapsed" :content="item.name" placement="right" :show-after="300">
                <div class="nav-content">
                  <el-icon class="nav-icon">
                    <component :is="item.icon" />
                  </el-icon>
                  <span v-if="!themeStore.sidebarCollapsed" class="nav-label">{{ item.name }}</span>
                  <el-tag v-if="item.badge && !themeStore.sidebarCollapsed" :type="item.badgeType || 'warning'"
                    size="small" class="nav-badge">
                    {{ item.badge }}
                  </el-tag>
                </div>
              </el-tooltip>

              <div v-else class="nav-content">
                <el-icon class="nav-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="nav-label">{{ item.name }}</span>
                <el-tag v-if="item.badge" :type="item.badgeType || 'warning'" size="small" class="nav-badge">
                  {{ item.badge }}
                </el-tag>
              </div>
            </router-link>
          </nav>
        </div>

        <!-- Invoice Submenu - Always present, content adjusts -->
        <!-- <div class="nav-group">
          <div v-if="!themeStore.sidebarCollapsed" class="section-header">
            <span class="section-title">INVOICES</span>
          </div>

          <nav class="nav-menu">
            <router-link to="/invoices/create" class="nav-item"
              :class="{ 'active': $route.path.startsWith('/invoices/create') }">
              <el-tooltip v-if="themeStore.sidebarCollapsed" content="Create Invoice" placement="right"
                :show-after="300">
                <div class="nav-content">
                  <el-icon class="nav-icon">
                    <Plus />
                  </el-icon>
                  <span v-if="!themeStore.sidebarCollapsed" class="nav-label">Create Invoice</span>
                </div>
              </el-tooltip>
              <div v-else class="nav-content">
                <el-icon class="nav-icon">
                  <Plus />
                </el-icon>
                <span class="nav-label">Create Invoice</span>
              </div>
            </router-link>
            <router-link to="/invoices" class="nav-item"
              :class="{ 'active': $route.path === '/invoices' || ($route.path.startsWith('/invoices/') && $route.path !== '/invoices/create') }">
              <el-tooltip v-if="themeStore.sidebarCollapsed" content="Invoice List" placement="right" :show-after="300">
                <div class="nav-content">
                  <el-icon class="nav-icon">
                    <List />
                  </el-icon>
                  <span v-if="!themeStore.sidebarCollapsed" class="nav-label">Invoice List</span>
                </div>
              </el-tooltip>
              <div v-else class="nav-content">
                <el-icon class="nav-icon">
                  <List />
                </el-icon>
                <span class="nav-label">Invoice List</span>
              </div>
            </router-link>
          </nav>
        </div> -->

        <!-- System Section - Always present, content adjusts -->
        <div class="nav-group">
          <div v-if="!themeStore.sidebarCollapsed" class="section-header">
            <span class="section-title">SYSTEM</span>
          </div>

          <nav class="nav-menu">
            <router-link v-for="item in systemItems" :key="item.path" :to="item.path" class="nav-item"
              :class="{ 'active': isActiveRoute(item.path) }">
              <el-tooltip v-if="themeStore.sidebarCollapsed" :content="item.name" placement="right" :show-after="300">
                <div class="nav-content">
                  <el-icon class="nav-icon">
                    <component :is="item.icon" />
                  </el-icon>
                  <span v-if="!themeStore.sidebarCollapsed" class="nav-label">{{ item.name }}</span>
                  <el-tag v-if="item.badge && !themeStore.sidebarCollapsed" :type="item.badgeType || 'warning'"
                    size="small" class="nav-badge">
                    {{ item.badge }}
                  </el-tag>
                </div>
              </el-tooltip>
              <div v-else class="nav-content">
                <el-icon class="nav-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="nav-label">{{ item.name }}</span>
                <el-tag v-if="item.badge" :type="item.badgeType || 'warning'" size="small" class="nav-badge">
                  {{ item.badge }}
                </el-tag>
              </div>
            </router-link>
          </nav>
        </div>
      </el-scrollbar>
    </div>

    <!-- User Profile Section -->
    <div class="user-section">
      <div class="user-content" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
        <el-dropdown trigger="click" placement="top-start" :disabled="themeStore.sidebarCollapsed"
          @command="handleUserCommand">
          <div class="user-profile">
            <el-avatar :size="36" class="user-avatar">
              <img :src="currentUser.avatar" alt="User Avatar" />
            </el-avatar>

            <div v-if="!themeStore.sidebarCollapsed" class="user-info">
              <div class="user-name">{{ currentUser.name }}</div>
              <div class="user-status">
                <div class="status-indicator online"></div>
                <span class="status-text">Online</span>
              </div>
            </div>

            <el-icon v-if="!themeStore.sidebarCollapsed" class="dropdown-arrow">
              <ArrowUp />
            </el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <el-dropdown-item command="profile">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <span>Profile Settings</span>
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon>
                  <Setting />
                </el-icon>
                <span>Account Settings</span>
              </el-dropdown-item>
              <el-dropdown-item command="help">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
                <span>Help & Support</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout" class="logout-item">
                <el-icon>
                  <SwitchButton />
                </el-icon>
                <span>Sign Out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Collapse Toggle - Always visible, repositioned for better UX -->
    <el-button :icon="themeStore.sidebarCollapsed ? Expand : Fold" circle size="small" class="collapse-toggle"
      @click="themeStore.toggleSidebar" />
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
  Search,
  Bell,
  Fold,
  Expand,
  ArrowUp,
  UserFilled,
  SwitchButton,
  QuestionFilled,
  List,
  WindPower,
  Plus,
  Menu // Hamburger icon for mobile
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const searchQuery = ref('')
const mobileSidebarOpen = ref(false) // State to control mobile sidebar visibility

const currentUser = computed(() => authStore.user || {
  name: 'Admin User',
  email: 'admin@ch24.com',
  role: 'Administrator',
  avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'
})

// Navigation items
const generalItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: HomeFilled,
  },
  {
    name: 'To-do List',
    path: '/todo',
    icon: List,
    badge: 'Comming Soon',
    badgeType: 'warning',
  },
  {
    name: 'Goals',
    path: '/goals',
    icon: WindPower,
    badge: undefined,
    badgeType: undefined
  }
]

const managementItems = [
  { name: 'Clients', path: '/clients', icon: User, badge: undefined, badgeType: undefined },
  { name: 'Agencies', path: '/agencies', icon: OfficeBuilding, badge: undefined, badgeType: undefined },
  { name: 'Ad Bookings', path: '/ad-bookings', icon: Calendar, badge: undefined, badgeType: undefined },
  { name: 'Invoices', path: '/invoices', icon: List, badge: undefined, badgeType: undefined },
  {
    name: 'Payments',
    path: '/payments',
    icon: CreditCard,
    badge: 'On Hold',
    badgeType: 'primary'
  },
  {
    name: 'Reports', path: '/reports', icon: DataAnalysis, badge: undefined, badgeType: undefined
  },
  { name: 'Delivery Logs', path: '/delivery-logs', icon: Van, badge: undefined, badgeType: undefined }
]

const systemItems = [
  {
    name: 'Settings', path: '/settings', icon: Setting, badge: undefined, badgeType: undefined
  },
]

// Check if route is active
const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Toggle mobile sidebar visibility
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
  document.body.classList.toggle('sidebar-open', mobileSidebarOpen.value) // Add/remove class to body for overlay/scroll lock
}

// Close mobile sidebar when a route changes
watch(route, () => {
  if (mobileSidebarOpen.value) {
    toggleMobileSidebar();
  }
});

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'help':
      window.open('/help', '_blank')
      break
    case 'logout':
      authStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.sidebar-container {
  background: #ffffff;
  border-right: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  z-index: 999;
  /* Ensure sidebar is above main content */
}

/* Mobile Toggle Button (Hamburger) */
.mobile-toggle {
  display: none;
  /* Hidden by default on desktop */
  position: fixed;
  /* Fixed position so it's always visible */
  top: 16px;
  left: 16px;
  z-index: 1100;
  /* Higher than sidebar */
  cursor: pointer;
  padding: 8px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #A02408;
  /* Icon color */
}

/* Header Section */
.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.header-content.collapsed {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  width: 100%;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  transition: all 0.3s ease;
}

.logo-image.collapsed {
  width: 32px;
  height: 32px;
}

.brand-info {
  flex: 1;
  min-width: 0;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
}

/* Search Section */
.search-section {
  position: relative;
  width: 100%;
}

.sidebar-search {
  --el-input-border-radius: 8px;
  --el-input-border-color: #e5e7eb;
  --el-input-focus-border-color: #A02408;
}

.sidebar-search :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  transition: all 0.5s ease;
}

.sidebar-search :deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
}

.sidebar-search :deep(.el-input__wrapper.is-focus) {
  border-color: #A02408;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(160, 36, 8, 0.1);
}

.search-shortcut {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

/* Navigation Section */
.nav-section {
  flex: 1;
  overflow: hidden;
  padding: 8px 0;
}

.nav-scrollbar {
  height: 100%;
}

.nav-group {
  margin-bottom: 24px;
  padding: 0 16px;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

/* Adjust gap and padding for collapsed state */
.sidebar-container.is-collapsed .nav-content {
  gap: 0;
  /* Remove gap when collapsed */
  justify-content: center;
  /* Center icons when collapsed */
  padding: 12px 0;
  /* Adjust padding for collapsed icons */
}

.nav-item:hover .nav-content {
  background-color: #f8f9fa;
  color: #374151;
}

.nav-item.active .nav-content {
  background-color: rgba(160, 36, 8, 0.1);
  color: #A02408;
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
  background-color: #A02408;
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
  flex: 1;
  overflow: hidden;
  /* Hide overflow when collapsed */
}

.nav-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  --el-tag-bg-color: #A02408;
  --el-tag-text-color: #ffffff;
  --el-tag-border-color: #A02408;
}

.nav-badge.el-tag--warning {
  --el-tag-bg-color: #f59e0b;
  --el-tag-text-color: #ffffff;
  --el-tag-border-color: #f59e0b;
}

.nav-badge.el-tag--primary {
  --el-tag-bg-color: #3b82f6;
  --el-tag-text-color: #ffffff;
  --el-tag-border-color: #3b82f6;
}

/* User Section */
.user-section {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  width: 100%;
}

.user-content.collapsed {
  display: flex;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

/* Adjust user profile for collapsed state */
.sidebar-container.is-collapsed .user-profile {
  justify-content: center;
  gap: 0;
  padding: 8px 0;
}

.user-profile:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #A02408, #d97706);
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
  margin-bottom: 4px;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online {
  background-color: #10b981;
}

.status-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 14px;
  color: #9ca3af;
  flex-shrink: 0;
}

/* Collapse Toggle */
.collapse-toggle {
  position: absolute;
  top: 28px;
  right: -16px;
  /* Positioned outside for better visibility */
  z-index: 100;
  /* Ensure it's above other elements */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --el-button-text-color: #6b7280;
  --el-button-hover-text-color: #A02408;
  --el-button-hover-bg-color: #f9fafb;
  --el-button-border-color: #e5e7eb;
  transition: all 0.3s ease;
  /* Smooth transition */
}

/* User Dropdown */
.user-dropdown {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  width: 100%;
}

.user-dropdown :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;
}

.user-dropdown :deep(.el-dropdown-menu__item:hover) {
  background-color: #f8f9fa;
  color: #A02408;
}

.logout-item {
  color: #ef4444 !important;
}

.logout-item:hover {
  background-color: #fef2f2 !important;
}

/* Animations */
@keyframes pulse {

  0%,
  100% {
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

.dark .brand-title {
  color: #f9fafb;
}

.dark .brand-subtitle {
  color: #9ca3af;
}

.dark .section-title {
  color: #6b7280;
}

.dark .nav-item:hover .nav-content {
  background-color: #374151;
  color: #f3f4f6;
}

.dark .nav-item.active .nav-content {
  background-color: rgba(160, 36, 8, 0.2);
  color: #fca5a5;
}

.dark .user-profile:hover {
  background-color: #374151;
}

.dark .user-name {
  color: #f9fafb;
}

.dark .status-text {
  color: #9ca3af;
}

.dark .collapse-toggle {
  background: #374151;
  border-color: #4b5563;
}

.dark .sidebar-search :deep(.el-input__wrapper) {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .sidebar-search :deep(.el-input__wrapper.is-focus) {
  background-color: #4b5563;
  border-color: #A02408;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
    /* Hidden by default */
    transition: transform 0.3s ease;
    width: 280px;
    /* Fixed width for mobile sidebar */
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    /* Shadow for mobile sidebar */
  }

  .sidebar-container.mobile-open {
    transform: translateX(0);
    /* Show when open */
  }

  .mobile-toggle {
    display: block;
    /* Show hamburger on mobile */
  }

  .collapse-toggle {
    display: none;
    /* Hide desktop collapse toggle on mobile */
  }

  /* When mobile sidebar is open, prevent body scroll and add overlay */
  body.sidebar-open {
    overflow: hidden;
  }

  body.sidebar-open::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    /* Below sidebar, above content */
  }
}

/* Scrollbar styling */
.nav-scrollbar :deep(.el-scrollbar__bar) {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-scrollbar:hover :deep(.el-scrollbar__bar) {
  opacity: 1;
}

.nav-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: rgba(160, 36, 8, 0.3);
  border-radius: 4px;
}
</style>
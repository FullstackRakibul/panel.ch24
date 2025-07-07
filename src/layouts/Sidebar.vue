<template>
  <el-aside 
    :width="themeStore.sidebarCollapsed ? '64px' : '256px'"
    class="sidebar-container"
  >
    <!-- Logo Section -->
    <div class="logo-section">
      <div class="logo-content" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
        <el-avatar :size="32" class="logo-avatar">
          <img src="@/assets/CH24.png" alt="Channel 24"  />
        </el-avatar>
        <div v-if="!themeStore.sidebarCollapsed" class="logo-info">
          <div class="logo-title">Channel 24</div>
          <!-- <div class="logo-subtitle">Billing System</div> -->
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <el-menu
      :default-active="$route.path"
      :collapse="themeStore.sidebarCollapsed"
      :collapse-transition="true"
      router
      class="sidebar-menu"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
        class="menu-item"
      >
        <el-icon class="menu-icon">
          <component :is="item.icon" />
        </el-icon>
        <template #title>
          <span class="menu-title">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </el-menu>

    <!-- User Section -->
    <div class="user-section">
      <div class="user-content" :class="{ 'collapsed': themeStore.sidebarCollapsed }">
        <el-avatar :size="32" class="user-avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <div v-if="!themeStore.sidebarCollapsed" class="user-info">
          <div class="user-name">Admin User</div>
          <div class="user-email">admin@ch24.com</div>
        </div>
      </div>
    </div>

    <!-- Collapse Toggle -->
    <el-button
      :icon="themeStore.sidebarCollapsed ? ArrowRight : ArrowLeft"
      circle
      size="small"
      class="collapse-toggle"
      @click="themeStore.toggleSidebar"
    />
  </el-aside>
</template>

<script setup lang="ts">
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
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'

const themeStore = useThemeStore()

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeFilled },
  { name: 'Clients', path: '/clients', icon: User },
  { name: 'Agencies', path: '/agencies', icon: OfficeBuilding },
  { name: 'Ad Bookings', path: '/ad-bookings', icon: Calendar },
  { name: 'Invoices', path: '/invoices', icon: Document },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Reports', path: '/reports', icon: DataAnalysis },
  { name: 'Delivery Logs', path: '/delivery-logs', icon: Van },
  { name: 'Settings', path: '/settings', icon: Setting }
]
</script>

<style scoped>
.sidebar-container {
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  transition: width 1s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.logo-section {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-content.collapsed {
  justify-content: center;
}

.logo-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
  flex-shrink: 0;
}

.logo-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.logo-info {
  flex: 1;
  min-width: 0;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.sidebar-menu {
  flex: 1;
  border: none;
  padding: 8px;
}

.menu-item {
  margin-bottom: 4px;
  border-radius: 12px;
  --el-menu-item-height: 48px;
}

.menu-icon {
  font-size: 18px;
}

.menu-title {
  font-weight: 500;
}

.user-section {
  padding: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: auto;
}

.user-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-content:hover {
  background-color: var(--el-fill-color-light);
}

.user-content.collapsed {
  justify-content: center;
}

.user-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.user-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collapse-toggle {
  position: absolute;
  top: 80px;
  right: -12px;
  z-index: 10;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { channelApiHttpJson } from '@/utils/base.Http'
import { ElMessage, ElMessageBox } from 'element-plus'
import PermissionMatrix from '@/components/PermissionMatrix.vue'
import { useAuthStore } from '@/stores/auth'

interface User {
  id: string
  email: string
  name: string
  employeeId: string
  phoneNumber?: string
  status: number
  createdAt: string
  roles: string[]
}

interface Role {
  id: string
  name: string
  description?: string
  status?: number
}

const auth = useAuthStore()
const loading = ref(false)
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const searchQuery = ref('')

// Drawer states
const editUserDrawerVisible = ref(false)
const permissionsDrawerVisible = ref(false)
const selectedUser = ref<User | null>(null)
const selectedRole = ref<Role | null>(null)
const selectedRoleForUser = ref('')

// Fetch users - mock data for now since endpoint may not exist
const fetchUsers = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call when endpoint exists
    // const response = await channelApiHttpJson().get('/users')
    users.value = [
      { id: '1', email: 'admin@ch24.com', name: 'Admin User', employeeId: 'EMP001', status: 1, createdAt: '2024-01-01', roles: ['Admin'] },
      { id: '2', email: 'manager@ch24.com', name: 'Manager User', employeeId: 'EMP002', status: 1, createdAt: '2024-01-15', roles: ['Manager'] },
      { id: '3', email: 'officer@ch24.com', name: 'Officer User', employeeId: 'EMP003', status: 1, createdAt: '2024-02-01', roles: ['Officer'] },
      { id: '4', email: 'accounts@ch24.com', name: 'Accounts User', employeeId: 'EMP004', status: 1, createdAt: '2024-02-15', roles: ['Accounts'] },
    ]
  } catch (error) {
    ElMessage.error('Failed to fetch users')
  } finally {
    loading.value = false
  }
}

// Fetch roles
const fetchRoles = async () => {
  try {
    // TODO: Replace with actual API call
    roles.value = [
      { id: 'role-1', name: 'Admin', description: 'Full system access' },
      { id: 'role-2', name: 'Manager', description: 'Oversees sales and billing' },
      { id: 'role-3', name: 'Officer', description: 'Daily data entry and bookings' },
      { id: 'role-4', name: 'Accounts', description: 'Financial and tax management' },
    ]
  } catch (error) {
    ElMessage.error('Failed to fetch roles')
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.employeeId.toLowerCase().includes(query)
  )
})

// Edit user role
const openEditUserDrawer = (user: User) => {
  selectedUser.value = user
  selectedRoleForUser.value = user.roles[0] || ''
  editUserDrawerVisible.value = true
}

const saveUserRole = async () => {
  if (!selectedUser.value) return

  try {
    // TODO: Call API to update user role
    // await channelApiHttpJson().put(`/users/${selectedUser.value.id}/role`, { roleName: selectedRoleForUser.value })

    // Update local state
    const userIndex = users.value.findIndex(u => u.id === selectedUser.value!.id)
    if (userIndex !== -1) {
      users.value[userIndex].roles = [selectedRoleForUser.value]
    }

    ElMessage.success('User role updated successfully')
    editUserDrawerVisible.value = false
  } catch (error) {
    ElMessage.error('Failed to update user role')
  }
}

// Manage role permissions
const openPermissionsDrawer = (role: Role) => {
  selectedRole.value = role
  permissionsDrawerVisible.value = true
}

const getStatusType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}

const getStatusLabel = (status: number) => {
  return status === 1 ? 'Active' : 'Inactive'
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>

<template>
  <div class="user-management">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <span class="breadcrumb-item">Home</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item">Settings</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item active">User Management</span>
        </div>
        <h1 class="page-title">User & Role Management</h1>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <el-input v-model="searchQuery" placeholder="Search users..." prefix-icon="Search" class="search-input"
        clearable />
      <el-button type="primary" v-can="'user.manage'" class="add-btn">
        <el-icon>
          <Plus />
        </el-icon>
        Add User
      </el-button>
    </div>

    <!-- Users Table -->
    <el-card class="table-card" shadow="never">
      <el-table :data="filteredUsers" v-loading="loading" stripe class="user-table"
        :header-cell-style="{ background: '#f1f5f9', color: '#475569', fontWeight: '600' }">
        <el-table-column prop="employeeId" label="Employee ID" width="120" />
        <el-table-column prop="name" label="Name" min-width="150" />
        <el-table-column prop="email" label="Email" min-width="200" />
        <el-table-column label="Role" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="row.roles[0] === 'Admin' ? 'danger' : 'primary'">
              {{ row.roles[0] || 'No Role' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text v-can="'role.assign'" @click="openEditUserDrawer(row)">
              Edit Role
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Roles Section -->
    <el-card class="roles-card" shadow="never">
      <template #header>
        <div class="roles-header">
          <h3>Roles & Permissions</h3>
        </div>
      </template>
      <el-table :data="roles" stripe class="roles-table"
        :header-cell-style="{ background: '#f1f5f9', color: '#475569', fontWeight: '600' }">
        <el-table-column prop="name" label="Role Name" width="150" />
        <el-table-column prop="description" label="Description" min-width="250" />
        <el-table-column label="Actions" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" v-can="'role.assign'" @click="openPermissionsDrawer(row)">
              Manage Permissions
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Edit User Role Drawer -->
    <el-drawer v-model="editUserDrawerVisible" title="Edit User Role" direction="rtl" size="400px">
      <div class="drawer-content" v-if="selectedUser">
        <div class="user-info">
          <p><strong>Name:</strong> {{ selectedUser.name }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Employee ID:</strong> {{ selectedUser.employeeId }}</p>
        </div>

        <el-form label-position="top" class="role-form">
          <el-form-item label="Assign Role">
            <el-select v-model="selectedRoleForUser" placeholder="Select role" style="width: 100%">
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.name" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="drawer-actions">
          <el-button @click="editUserDrawerVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveUserRole">Save Changes</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- Permissions Matrix Drawer -->
    <el-drawer v-model="permissionsDrawerVisible" title="Manage Permissions" direction="rtl" size="600px">
      <PermissionMatrix v-if="selectedRole" :role="selectedRole" @close="permissionsDrawerVisible = false" />
    </el-drawer>
  </div>
</template>

<style scoped>
.user-management {
  padding: 16px 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 16px;
}

.breadcrumb {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-item.active {
  color: #C14D21;
  font-weight: 500;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.search-input {
  max-width: 300px;
}

.add-btn {
  background: #C14D21;
  border-color: #C14D21;
}

.add-btn:hover {
  background: #a83d18;
  border-color: #a83d18;
}

.table-card {
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.table-card :deep(.el-card__body) {
  padding: 0;
}

.user-table {
  width: 100%;
}

.roles-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.roles-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.drawer-content {
  padding: 16px;
}

.user-info {
  background: #f1f5f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.user-info p {
  margin: 8px 0;
  color: #475569;
}

.role-form {
  margin-bottom: 24px;
}

.drawer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}
</style>
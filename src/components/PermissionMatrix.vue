<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { channelApiHttpJson } from '@/utils/base.Http'
import { ElMessage } from 'element-plus'

interface Permission {
  id: number
  name: string
  code: string
  module: string
  isAssigned: boolean
}

interface Role {
  id: string
  name: string
  description?: string
}

const props = defineProps<{
  role: Role
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const loading = ref(false)
const saving = ref(false)
const permissions = ref<Permission[]>([])

// Group permissions by module
const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {}
  permissions.value.forEach(p => {
    const module = p.module || 'Other'
    if (!groups[module]) {
      groups[module] = []
    }
    groups[module].push(p)
  })
  return groups
})

// Fetch permissions for the role
const fetchPermissions = async () => {
  loading.value = true
  try {
    const response = await channelApiHttpJson().get(`/permissions/roles/${props.role.id}`)
    permissions.value = response.data.Permissions || response.data.permissions || []
  } catch (error) {
    // Fallback to mock data if API fails
    permissions.value = [
      { id: 1, name: 'View Contracts', code: 'contracts.view', module: 'Contract', isAssigned: true },
      { id: 2, name: 'Create Contracts', code: 'contracts.create', module: 'Contract', isAssigned: props.role.name === 'Admin' || props.role.name === 'Officer' },
      { id: 3, name: 'Edit Contracts', code: 'contracts.edit', module: 'Contract', isAssigned: props.role.name !== 'Accounts' },
      { id: 4, name: 'Delete Contracts', code: 'contracts.delete', module: 'Contract', isAssigned: props.role.name === 'Admin' },
      { id: 5, name: 'Approve Billing', code: 'billing.approve', module: 'Financial', isAssigned: props.role.name === 'Admin' || props.role.name === 'Manager' },
      { id: 6, name: 'Export Reports', code: 'billing.export', module: 'Financial', isAssigned: props.role.name !== 'Officer' },
      { id: 7, name: 'Edit VAT Rates', code: 'billing.vat_edit', module: 'Financial', isAssigned: props.role.name === 'Admin' || props.role.name === 'Accounts' },
      { id: 8, name: 'Manage Users', code: 'user.manage', module: 'System', isAssigned: props.role.name === 'Admin' },
      { id: 9, name: 'Assign Roles', code: 'role.assign', module: 'System', isAssigned: props.role.name === 'Admin' },
    ]
  } finally {
    loading.value = false
  }
}

// Toggle permission
const togglePermission = (permission: Permission) => {
  permission.isAssigned = !permission.isAssigned
}

// Get assigned permission IDs
const getAssignedPermissionIds = () => {
  return permissions.value
    .filter(p => p.isAssigned)
    .map(p => p.id)
}

// Save permissions
const savePermissions = async () => {
  saving.value = true
  try {
    const permissionIds = getAssignedPermissionIds()
    await channelApiHttpJson().put(`/permissions/roles/${props.role.id}`, {
      permissionIds
    })
    ElMessage.success('Permissions updated successfully')
    emit('close')
  } catch (error) {
    ElMessage.error('Failed to update permissions')
  } finally {
    saving.value = false
  }
}

// Get module icon
const getModuleIcon = (module: string) => {
  switch (module) {
    case 'Contract': return 'Document'
    case 'Financial': return 'Money'
    case 'System': return 'Setting'
    default: return 'More'
  }
}

onMounted(() => {
  fetchPermissions()
})
</script>

<template>
  <div class="permission-matrix" v-loading="loading">
    <div class="matrix-header">
      <div class="role-info">
        <el-tag type="primary" size="large">{{ role.name }}</el-tag>
        <p v-if="role.description" class="role-description">{{ role.description }}</p>
      </div>
    </div>

    <div class="permissions-list">
      <div v-for="(perms, module) in groupedPermissions" :key="module" class="permission-group">
        <div class="group-header">
          <el-icon>
            <component :is="getModuleIcon(module)" />
          </el-icon>
          <span>{{ module }}</span>
        </div>

        <div class="permission-items">
          <div v-for="permission in perms" :key="permission.id" class="permission-item">
            <el-checkbox v-model="permission.isAssigned" :label="permission.name" />
            <span class="permission-code">{{ permission.code }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="matrix-actions">
      <el-button @click="emit('close')">Cancel</el-button>
      <el-button type="primary" :loading="saving" @click="savePermissions">
        Save Permissions
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.permission-matrix {
  padding: 8px;
}

.matrix-header {
  margin-bottom: 24px;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.role-description {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.permissions-list {
  max-height: 60vh;
  overflow-y: auto;
}

.permission-group {
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f1f5f9;
  font-weight: 600;
  color: #475569;
}

.permission-items {
  padding: 8px 16px;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.permission-item:last-child {
  border-bottom: none;
}

.permission-code {
  font-family: monospace;
  font-size: 12px;
  color: #94a3b8;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 4px;
}

.matrix-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
}
</style>
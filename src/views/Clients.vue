<template>
  <div class="clients-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Clients</h1>
        <p class="page-subtitle">Manage your clients and their information</p>
      </div>
      <el-button type="primary" size="large" @click="openCreateModal">
        <el-icon class="mr-2">
          <Plus />
        </el-icon>
        New Client
      </el-button>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="24" class="stats-section">
      <el-col :xs="24" :sm="8">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon total">
              <el-icon size="24">
                <User />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ clients.length }}</div>
              <div class="stats-label">Total Clients</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon company">
              <el-icon size="24">
                <Building2 />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ companyClients }}</div>
              <div class="stats-label">Companies</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon agent">
              <el-icon size="24">
                <Users />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ agentClients }}</div>
              <div class="stats-label">Agents</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Search and Filters -->
    <el-card class="filters-card" shadow="never">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="8">
          <el-input v-model="searchQuery" placeholder="Search clients..." :prefix-icon="Search" size="large" clearable
            @input="handleSearch" />
        </el-col>

        <el-col :xs="24" :sm="4">
          <el-select v-model="selectedType" placeholder="All Types" size="large" clearable @change="handleFilter">
            <el-option label="Company" value="company" />
            <el-option label="Agent" value="agent" />
            <el-option label="Individual" value="individual" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="4">
          <el-select v-model="selectedStatus" placeholder="All Status" size="large" clearable @change="handleFilter">
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="8">
          <div class="filter-actions">
            <el-button @click="resetFilters">Reset</el-button>
            <el-button type="primary" plain>
              <el-icon class="mr-1">
                <Download />
              </el-icon>
              Export
            </el-button>
            <div class="view-toggle">
              <el-button-group>
                <el-button :type="viewMode === 'cards' ? 'primary' : 'default'" @click="viewMode = 'cards'">
                  <el-icon>
                    <Grid3X3 />
                  </el-icon>
                </el-button>
                <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
                  <el-icon>
                    <List />
                  </el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- Loading State -->
    <div v-if="clientsStore.loading" class="loading-container">
      <el-skeleton animated :rows="8" />
    </div>

    <!-- Cards View -->
    <div v-else-if="viewMode === 'cards'" class="clients-grid">
      <el-row :gutter="24">
        <el-col v-for="client in filteredClients" :key="client.id" :xs="24" :sm="12" :lg="8" :xl="6">
          <el-card class="client-card" shadow="hover">
            <!-- Client Header -->
            <div class="client-header">
              <div class="client-avatar-section">
                <el-avatar :size="48" class="client-avatar">
                  <el-icon>
                    <User />
                  </el-icon>
                </el-avatar>
                <div class="client-basic-info">
                  <h3 class="client-name">{{ client.name }}</h3>
                  <div class="client-badges">
                    <el-tag :type="getTypeColor(client.type)" size="small" effect="light">
                      {{ formatType(client.type) }}
                    </el-tag>
                    <el-tag :type="client.status === 'active' ? 'success' : 'danger'" size="small" effect="light">
                      {{ client.status === 'active' ? 'Active' : 'Inactive' }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- Actions Dropdown -->
              <el-dropdown trigger="click" @command="handleCommand">
                <el-button :icon="MoreHorizontal" circle size="small" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'edit', client }">
                      <el-icon class="mr-2">
                        <Edit />
                      </el-icon>
                      Edit Client
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'view', client }">
                      <el-icon class="mr-2">
                        <Eye />
                      </el-icon>
                      View Details
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'delete', client }" divided>
                      <el-icon class="mr-2">
                        <Trash2 />
                      </el-icon>
                      Delete Client
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- Client Info -->
            <div class="client-info">
              <div class="info-item">
                <el-icon class="info-icon">
                  <Mail />
                </el-icon>
                <span class="info-text">{{ client.email }}</span>
              </div>
              <div class="info-item">
                <el-icon class="info-icon">
                  <Phone />
                </el-icon>
                <span class="info-text">{{ client.phone }}</span>
              </div>
              <div class="info-item">
                <el-icon class="info-icon">
                  <MapPin />
                </el-icon>
                <span class="info-text">{{ client.city }}, {{ client.state }}</span>
              </div>
              <div class="info-item" v-if="client.subject">
                <el-icon class="info-icon">
                  <FileText />
                </el-icon>
                <span class="info-text">{{ client.subject }}</span>
              </div>
            </div>

            <!-- Client Footer -->
            <div class="client-footer">
              <span class="created-date">Added {{ formatDate(client.createdAt) }}</span>
              <div class="status-indicator">
                <div class="status-dot active"></div>
                <span class="status-text">Online</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Empty State for Cards -->
      <el-empty v-if="filteredClients.length === 0"
        :description="searchQuery ? 'No clients found matching your search' : 'No clients yet'" :image-size="120">
        <el-button v-if="!searchQuery" type="primary" @click="openCreateModal">
          <el-icon class="mr-2">
            <Plus />
          </el-icon>
          Add Your First Client
        </el-button>
      </el-empty>
    </div>

    <!-- List View -->
    <div v-else class="clients-table">
      <el-table :data="filteredClients" style="width: 100%" :default-sort="{ prop: 'createdAt', order: 'descending' }"
        empty-text="No clients found" class="modern-table">
        <el-table-column width="60">
          <template #default="{ row }">
            <el-avatar :size="40" class="client-avatar">
              <el-icon>
                <User />
              </el-icon>
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column label="Name" prop="name" min-width="200" sortable>
          <template #default="{ row }">
            <div class="client-name-cell">
              <div class="name">{{ row.name }}</div>
              <div class="contact-person">{{ row.contactPerson }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Title" prop="title" min-width="150">
          <template #default="{ row }">
            <span class="title-text">{{ row.title || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Email" prop="email" min-width="200">
          <template #default="{ row }">
            <el-link :href="`mailto:${row.email}`" type="primary">
              {{ row.email }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="Phone" prop="phone" min-width="150">
          <template #default="{ row }">
            <el-link :href="`tel:${row.phone}`" type="primary">
              {{ row.phone }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="Location" min-width="150">
          <template #default="{ row }">
            <div class="location-cell">
              <div class="city">{{ row.city }}, {{ row.state }}</div>
              <div class="country">{{ row.country }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Type" prop="type" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small" effect="light">
              {{ formatType(row.type) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Subject" prop="subject" min-width="150">
          <template #default="{ row }">
            <span class="subject-text">{{ row.subject || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Created" prop="createdAt" width="120" sortable>
          <template #default="{ row }">
            <span class="date-text">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="100" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="editClient(row)" :icon="Edit" size="small" />
              <el-button type="danger" link @click="deleteClient(row.id!)" :icon="Trash2" size="small" />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="clientsStore.currentPage" v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="filteredClients.length"
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- Client Modal -->
    <ClientModal v-model="showModal" :client="selectedClient" :is-edit="isEditMode" :loading="clientsStore.loading"
      @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useClientsStore, type Client } from '@/stores/clients'
import ClientModal from '@/components/forms/ClientModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Download,
  User,
  Building2,
  Users,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Grid3X3,
  List
} from 'lucide-vue-next'

const clientsStore = useClientsStore()

const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const selectedClient = ref<Client | null>(null)
const viewMode = ref<'cards' | 'list'>('cards')
const pageSize = ref(10)

const clients = computed(() => clientsStore.clients)
const companyClients = computed(() => clients.value.filter(c => c.type === 'company').length)
const agentClients = computed(() => clients.value.filter(c => c.type === 'agent').length)

const filteredClients = computed(() => {
  let filtered = [...clients.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.contactPerson.toLowerCase().includes(query) ||
      client.city.toLowerCase().includes(query) ||
      client.subject?.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(client => client.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(client => client.status === selectedStatus.value)
  }

  return filtered
})

const handleSearch = () => {
  // Search is handled by computed property
}

const handleFilter = () => {
  // Filtering is handled by computed property
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
}

const openCreateModal = () => {
  selectedClient.value = null
  isEditMode.value = false
  showModal.value = true
}

const handleCommand = (command: { action: string; client: Client }) => {
  const { action, client } = command

  switch (action) {
    case 'edit':
      editClient(client)
      break
    case 'view':
      viewClientDetails(client)
      break
    case 'delete':
      deleteClient(client.id!)
      break
  }
}

const editClient = (client: Client) => {
  selectedClient.value = client
  isEditMode.value = true
  showModal.value = true
}

const viewClientDetails = (client: Client) => {
  ElMessage.info(`Viewing details for ${client.name}`)
}

const deleteClient = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the client. Continue?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const result = await clientsStore.deleteClient(id)
    if (result.success) {
      ElMessage.success('Client deleted successfully')
    } else {
      ElMessage.error(result.message || 'Failed to delete client')
    }
  } catch {
    ElMessage.info('Delete cancelled')
  }
}

const handleSave = async (clientData: Client) => {
  let result

  if (isEditMode.value && selectedClient.value?.id) {
    result = await clientsStore.updateClient(selectedClient.value.id, clientData)
  } else {
    result = await clientsStore.createClient(clientData)
  }

  if (result.success) {
    showModal.value = false
    ElMessage.success(isEditMode.value ? 'Client updated successfully' : 'Client created successfully')
  } else {
    ElMessage.error(result.message || 'Operation failed')
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  clientsStore.currentPage = val
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'Recently'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatType = (type: string) => {
  const typeMap = {
    company: 'Company',
    agent: 'Agent',
    individual: 'Individual'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const getTypeColor = (type: string) => {
  const colorMap = {
    company: 'primary',
    agent: 'success',
    individual: 'warning'
  }
  return colorMap[type as keyof typeof colorMap] || 'default'
}

onMounted(() => {
  clientsStore.fetchClients()
})
</script>

<style scoped>
.clients-container {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin: 0;
}

.stats-section {
  margin-bottom: 32px;
}

.stats-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow);
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-icon.total {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.stats-icon.company {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stats-icon.agent {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.stats-info {
  flex: 1;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.2;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.filters-card {
  margin-bottom: 32px;
  --el-card-padding: 24px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}

.view-toggle {
  margin-left: 12px;
}

.loading-container {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
}

.clients-grid {
  min-height: 400px;
}

.client-card {
  --el-card-padding: 24px;
  transition: all 0.3s ease;
  height: 100%;
  border-radius: 12px;
}

.client-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow-dark);
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.client-avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.client-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #3b82f6, #8b5cf6);
  flex-shrink: 0;
}

.client-basic-info {
  flex: 1;
  min-width: 0;
}

.client-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.client-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.client-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  flex-shrink: 0;
}

.info-text {
  font-size: 14px;
  color: var(--el-text-color-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.client-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.created-date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active {
  background: var(--el-color-success);
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.clients-table {
  background: var(--el-bg-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
}

.modern-table {
  --el-table-border-radius: 12px;
}

.client-name-cell .name {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.client-name-cell .contact-person {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.location-cell .city {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.location-cell .country {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.title-text,
.subject-text {
  color: var(--el-text-color-regular);
}

.date-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.pagination-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--el-border-color-lighter);
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .clients-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filter-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .client-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
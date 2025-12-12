<template>
  <div class="agencies-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Advertising Agencies</h1>
        <p class="page-subtitle">Manage all your advertising agency partners</p>
      </div>
      <el-button type="primary" size="large" @click="openCreateModal">
        <el-icon class="mr-2">
          <Plus />
        </el-icon>
        New Agency
      </el-button>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="24" class="stats-section">
      <el-col :xs="24" :sm="8">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon total">
              <el-icon size="24">
                <Building2 />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ agenciesStore.totalAgencies }}</div>
              <div class="stats-label">Total Agencies</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon active">
              <el-icon size="24">
                <CheckCircle />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ premiumAgencies }}</div>
              <div class="stats-label">Premium Agencies</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon company">
              <el-icon size="24">
                <Users />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ largeAgencies }}</div>
              <div class="stats-label">Large Agencies</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Search and Filters -->
    <el-card class="filters-card" shadow="never">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="6">
          <el-input v-model="agenciesStore.searchTerm" placeholder="Search agencies..." :prefix-icon="Search"
            size="large" clearable />
        </el-col>

        <el-col :xs="24" :sm="4">
          <el-select v-model="agenciesStore.filterByLocation" placeholder="All Locations" size="large" clearable>
            <el-option v-for="location in agenciesStore.locations" :key="location" :label="location"
              :value="location" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="4">
          <el-select v-model="agenciesStore.filterBySize" placeholder="All Sizes" size="large" clearable>
            <el-option v-for="size in agenciesStore.sizes" :key="size" :label="size" :value="size" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="4">
          <el-select v-model="agenciesStore.sortBy" placeholder="Sort By" size="large">
            <el-option label="Name (A-Z)" value="agencyName" />
            <el-option label="Rating (High to Low)" value="rating" />
            <el-option label="Budget (Low to High)" value="budget" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="6">
          <div class="filter-actions">
            <el-button @click="resetFilters">Reset</el-button>
            <el-button type="primary" plain @click="handleFetchAgencies">
              <el-icon class="mr-1">
                <Refresh />
              </el-icon>
              Refresh
            </el-button>
            <div class="view-toggle">
              <el-button-group>
                <el-button :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
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
    <div v-if="agenciesStore.loading" class="loading-container">
      <el-skeleton animated :rows="8" />
    </div>

    <!-- Cards View -->
    <div v-else-if="viewMode === 'grid'" class="agencies-grid">
      <el-row :gutter="10">
        <el-col class="mb-2" v-for="agency in agenciesStore.filteredAndSortedAgencies" :key="agency.guid" :xs="24"
          :sm="12" :lg="8" :xl="6">
          <el-card class="agency-card " shadow="hover">
            <!-- Agency Header -->
            <div class="agency-header">
              <div class="agency-avatar-section">
                <div v-if="agency.logo" class="agency-logo">
                  <img :src="agency.logo" :alt="agency.agencyName" class="logo-image" />
                </div>
                <el-avatar v-else :size="48" class="agency-avatar">
                  <el-icon>
                    <Building2 />
                  </el-icon>
                </el-avatar>
                <div class="agency-basic-info">
                  <h3 class="agency-name">{{ agency.agencyName }}</h3>
                  <div class="agency-badges">
                    <el-tag type="primary" size="small" effect="light">
                      {{ getSizeLabel(agency.companySize) }}
                    </el-tag>
                    <el-tag type="success" size="small" effect="light" v-if="parseFloat(agency.rating || '0') >= 4">
                      Premium
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- Actions Dropdown -->
              <el-dropdown trigger="click" @command="handleCommand">
                <el-button :icon="MoreHorizontal" circle size="small" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'edit', agency }">
                      <el-icon class="mr-2">
                        <Edit />
                      </el-icon>
                      Edit Agency
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'view', agency }">
                      <el-icon class="mr-2">
                        <Eye />
                      </el-icon>
                      View Details
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'delete', agency }" divided>
                      <el-icon class="mr-2">
                        <Trash2 />
                      </el-icon>
                      Delete Agency
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- Agency Info -->
            <div class="agency-info">
              <div class="info-item" v-if="agency.tagline">
                <el-icon class="info-icon">
                  <Quote />
                </el-icon>
                <span class="info-text">{{ agency.tagline }}</span>
              </div>
              <div class="info-item" v-if="agency.location">
                <el-icon class="info-icon">
                  <MapPin />
                </el-icon>
                <span class="info-text">{{ agency.location }}</span>
              </div>
              <div class="info-item" v-if="agency.email">
                <el-icon class="info-icon">
                  <Mail />
                </el-icon>
                <span class="info-text">{{ agency.email }}</span>
              </div>
              <div class="info-item" v-if="agency.phone">
                <el-icon class="info-icon">
                  <Phone />
                </el-icon>
                <span class="info-text">{{ agency.phone }}</span>
              </div>
            </div>

            <!-- Agency Stats -->
            <div class="agency-stats">
              <div class="stat-item">
                <div class="stat-value">{{ agency.rating || '0' }}/5</div>
                <div class="stat-label">Rating</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ agency.reviewCount || '0' }}</div>
                <div class="stat-label">Reviews</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ formatCurrency(agency.budget) }}</div>
                <div class="stat-label">Budget</div>
              </div>
            </div>

            <!-- Agency Footer -->
            <div class="agency-footer">
              <span class="created-date">Added {{ formatDate(agency.createdAt) }}</span>
              <div class="rating-indicator">
                <el-rate v-model="agency.rating" disabled size="small" :colors="['#f5be22', '#f5be22', '#f5be22']" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Empty State for Cards -->
      <el-empty v-if="agenciesStore.filteredAndSortedAgencies.length === 0"
        :description="agenciesStore.searchTerm ? 'No agencies found matching your search' : 'No agencies yet'"
        :image-size="120">
        <el-button v-if="!agenciesStore.searchTerm" type="primary" @click="openCreateModal">
          <el-icon class="mr-2">
            <Plus />
          </el-icon>
          Add Your First Agency
        </el-button>
      </el-empty>
    </div>

    <!-- List View -->
    <div v-else class="agencies-table">
      <el-table :data="agenciesStore.filteredAndSortedAgencies" style="width: 100%"
        :default-sort="{ prop: 'createdAt', order: 'descending' }" empty-text="No agencies found" class="modern-table">

        <el-table-column width="60">
          <template #default="{ row }">
            <div v-if="row.logo" class="agency-logo-small">
              <img :src="row.logo" :alt="row.agencyName" class="logo-image-small" />
            </div>
            <el-avatar v-else :size="40" class="agency-avatar-small">
              <el-icon>
                <Building2 />
              </el-icon>
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column label="Agency Name" prop="agencyName" min-width="200" sortable>
          <template #default="{ row }">
            <div class="agency-name-cell">
              <div class="name">{{ row.agencyName }}</div>
              <div class="tagline">{{ row.tagline }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Location" prop="location" min-width="150" sortable>
          <template #default="{ row }">
            <div class="location-cell">
              <div class="city">{{ row.location || 'N/A' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Size" width="120" sortable>
          <template #default="{ row }">
            <el-tag type="primary" size="small" effect="light">
              {{ getSizeLabel(row.companySize) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Budget" prop="budget" width="150" sortable align="right">
          <template #default="{ row }">
            <div class="budget-cell">
              {{ formatCurrency(row.budget) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Rating" width="150" sortable align="center">
          <template #default="{ row }">
            <div class="rating-cell">
              <el-rate v-model="row.rating" disabled size="small" :colors="['#f5be22', '#f5be22', '#f5be22']" />
              <span class="rating-text">{{ row.rating }}/5</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Created" prop="createdAt" width="120" sortable>
          <template #default="{ row }">
            <span class="date-text">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="editAgency(row)" :icon="Edit" size="small" />
              <el-button type="danger" link @click="deleteAgency(row.guid)" :icon="Trash2" size="small" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Agency Modal -->
    <AgencyModal v-model="agencyModalStore.isAgencyModalOpen" :is-edit="agencyModalStore.isEditMode"
      :loading="modalLoading" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AgencyModal from '@/components/forms/AgencyModal.vue'
import { useAgenciesStore } from '@/stores/agencies'
import { useAgencyModalStore } from '@/stores/agency-modal.store'
import type { IAgency, ICreateAgency, IUpdateAgency } from '@/interface/agency/agencies.interface'
import {
  Plus,
  Search,
  Building2,
  Users,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Grid3X3,
  List,
  Quote
} from 'lucide-vue-next'

const agenciesStore = useAgenciesStore()
const agencyModalStore = useAgencyModalStore()
const modalLoading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

// Computed properties for stats
const premiumAgencies = computed(() => {
  return agenciesStore.agencies.filter(agency =>
    parseFloat(agency.rating || '0') >= 4
  ).length
})

const largeAgencies = computed(() => {
  return agenciesStore.agencies.filter(agency =>
    (agency.companySize || 0) > 200
  ).length
})

const handleFetchAgencies = async () => {
  try {
    await agenciesStore.fetchAgencies()
    console.log("Here is all the agencies data:", agenciesStore.agencies)
  } catch (error) {
    ElMessage.error('Failed to fetch agencies')
    console.error('Error fetching agencies:', error)
  }
}

const resetFilters = () => {
  agenciesStore.resetFilters()
  ElMessage.info('Filters cleared!')
}

const openCreateModal = () => {
  agencyModalStore.openAgencyModal() // This will open modal for creating new agency
}

const handleCommand = (command: { action: string; agency: IAgency }) => {
  const { action, agency } = command

  switch (action) {
    case 'edit':
      editAgency(agency)
      break
    case 'view':
      viewAgencyDetails(agency)
      break
    case 'delete':
      deleteAgency(agency.guid)
      break
  }
}

const editAgency = (agency: IAgency) => {
  agencyModalStore.openAgencyModal(agency, true) // This will open modal for editing
}

const viewAgencyDetails = (agency: IAgency) => {
  ElMessage.info(`Viewing details for ${agency.agencyName}`)
}

const deleteAgency = async (guid: string) => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the agency. Continue?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    await agenciesStore.deleteAgency(guid)
    ElMessage.success('Agency deleted successfully')
  } catch {
    ElMessage.info('Delete cancelled')
  }
}

const handleSave = async (agencyData: ICreateAgency | IUpdateAgency) => {
  try {
    modalLoading.value = true
    console.log("Agency Data:", agencyData)

    if (agencyModalStore.isEditMode && agencyModalStore.editingAgencyId) {
      await agenciesStore.updateAgency(agencyModalStore.editingAgencyId, agencyData as IUpdateAgency)
      ElMessage.success('Agency updated successfully')
    } else {
      await agenciesStore.createAgency(agencyData as ICreateAgency)
      ElMessage.success('Agency created successfully')
    }

    // Clear the draft after successful save
    agencyModalStore.resetAgencyModalData()
    agencyModalStore.clearLocalStorage()
    await handleFetchAgencies()
  } catch (error) {
    ElMessage.error('Operation failed')
    console.error('Error saving agency:', error)
  } finally {
    modalLoading.value = false
  }
}

const formatCurrency = (value?: string) => {
  if (!value) return '৳ 0'
  const numValue = parseFloat(value)
  return `৳ ${numValue.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'Recently'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getSizeLabel = (size?: number) => {
  if (!size) return 'N/A'
  if (size <= 10) return '1-10'
  if (size <= 50) return '11-50'
  if (size <= 200) return '51-200'
  if (size <= 500) return '201-500'
  if (size <= 1000) return '501-1000'
  return '1000+'
}

onMounted(() => {
  handleFetchAgencies()
})
</script>

<style scoped>
.agencies-container {
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

.stats-icon.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stats-icon.company {
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

.agencies-grid {
  min-height: 300px;
}



.agency-card {
  --el-card-padding: 24px;
  transition: all 0.3s ease;
  height: 100%;
  border-radius: 12px;
}

.agency-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow-dark);
}

.agency-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.agency-avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.agency-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agency-avatar {
  --el-avatar-bg-color: linear-gradient(135deg, #f59e0b, #d97706);
  flex-shrink: 0;
}

.agency-basic-info {
  flex: 1;
  min-width: 0;
}

.agency-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agency-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.agency-info {
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

.agency-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.agency-footer {
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

.rating-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.agencies-table {
  background: var(--el-bg-color);
  border-radius: 12px;
  overflow: hidden;
  padding: 12px;
  box-shadow: var(--el-box-shadow-light);
}

.modern-table {
  --el-table-border-radius: 12px;
}

.agency-logo-small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.logo-image-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agency-avatar-small {
  --el-avatar-bg-color: linear-gradient(135deg, #f59e0b, #d97706);
}

.agency-name-cell .name {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.agency-name-cell .tagline {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.location-cell .city {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.budget-cell {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.rating-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rating-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.date-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .agencies-container {
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

  .agency-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .agency-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
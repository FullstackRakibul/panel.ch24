<template>
  <div class="agencies-container">
    <div class="page-header ">
      <div class="header-content">
        <h1 class="page-title">Advertising Agencies</h1>
        <p class="page-subtitle">Manage all your advertising agency partners</p>
      </div>
      <el-button type="primary" size="large" @click="openAddAgencyModal">
        <el-icon class="mr-2">
          <Plus />
        </el-icon>
        Add New Agency
      </el-button>
    </div>

    <el-card class="control-bar-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>Agency Overview</h3>
          <div class="header-actions">
            <el-input v-model="agenciesStore.searchTerm" placeholder="Search agencies..." :prefix-icon="Search"
              clearable class="control-input" @input="handleSearch" />
            <el-select v-model="agenciesStore.filterByLocation" placeholder="Location" clearable class="control-select"
              @change="handleFilter">
              <el-option v-for="location in agenciesStore.locations" :key="location" :label="location"
                :value="location" />
            </el-select>
            <el-select v-model="agenciesStore.filterByWork" placeholder="Work Type" clearable class="control-select"
              @change="handleFilter">
              <el-option v-for="workType in agenciesStore.workTypes" :key="workType" :label="workType"
                :value="workType" />
            </el-select>
            <el-select v-model="agenciesStore.filterBySize" placeholder="Team Size" clearable class="control-select"
              @change="handleFilter">
              <el-option v-for="size in agenciesStore.sizes" :key="size" :label="size" :value="size" />
            </el-select>
            <el-select v-model="agenciesStore.sortBy" placeholder="Sort By" class="control-select" @change="handleSort">
              <el-option label="Name (A-Z)" value="name" />
              <el-option label="Rating (High to Low)" value="rating" />
              <el-option label="Budget (Low to High)" value="budget" />
            </el-select>
            <el-button @click="clearFilters" :icon="FilterX" class="clear-filters-button">Clear Filters</el-button>
            <el-radio-group v-model="viewType" size="small" class="view-toggle">
              <el-radio-button label="grid">
                <el-icon>
                  <Grid3X3 />
                </el-icon>
                <span class="ml-1 hidden sm:inline">Grid</span>
              </el-radio-button>
              <el-radio-button label="list">
                <el-icon>
                  <List />
                </el-icon>
                <span class="ml-1 hidden sm:inline">List</span>
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div v-loading="agenciesStore.loading" class="min-h-[300px] flex flex-col">
        <div v-if="agenciesStore.filteredAndSortedAgencies.length > 0" class="flex-1">
          <div v-if="viewType === 'grid'"
            class="agencies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AgencyCard v-for="agency in agenciesStore.filteredAndSortedAgencies" :key="agency.id" :agency="agency"
              @viewProfile="handleViewProfile" @editAgency="openEditAgencyModal" @deleteAgency="handleDeleteAgency" />
          </div>

          <div v-else class="agencies-list bg-white rounded-xl overflow-hidden">
            <div class="table-responsive-wrapper">
              <el-table :data="agenciesStore.filteredAndSortedAgencies" style="width: 100%" stripe>
                <el-table-column prop="name" label="Agency Name" sortable>
                  <template #default="{ row }">
                    <div class="flex items-center gap-3">
                      <img :src="row.logo" :alt="row.name"
                        class="w-10 h-10 rounded-md object-contain border border-gray-100 p-0.5" />
                      <span class="font-medium text-gray-800">{{ row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="tagline" label="Tagline" min-width="150" />
                <el-table-column prop="location" label="Location" sortable />
                <el-table-column prop="work" label="Work Type" sortable />
                <el-table-column prop="budget" label="Budget" sortable align="right">
                  <template #default="{ row }">
                    {{ formatCurrency(row.budget) }}
                  </template>
                </el-table-column>
                <el-table-column prop="rating" label="Rating" sortable align="center">
                  <template #default="{ row }">
                    <el-rate v-model="row.rating" disabled size="small" :colors="['#f5be22', '#f5be22', '#f5be22']" />
                    <span class="text-xs text-gray-500 ml-1">({{ row.reviewCount }})</span>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" width="250" fixed="right" align="center">
                  <template #default="{ row }">
                    <div class="action-buttons">
                      <el-button type="primary" link @click="handleViewProfile(row.id)" :icon="Eye" size="small">
                        View
                      </el-button>
                      <el-button type="success" link @click="openEditAgencyModal(row)" :icon="Edit" size="small">
                        Edit
                      </el-button>
                      <el-button type="danger" link @click="handleDeleteAgency(row.id)" :icon="Trash2" size="small">
                        Delete
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm w-full flex-1">
          <el-empty description="No agencies found matching your criteria." />
          <el-button type="primary" @click="openAddAgencyModal" class="mt-4">Add First Agency</el-button>
        </div>
      </div>
    </el-card>
    <el-button type="primary" @click="openAddAgencyModal" class="mt-4">Fetch Agency</el-button>


    <AgencyModal :visible="isAgencyModalVisible" @update:visible="isAgencyModalVisible = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAgenciesStore } from '@/stores/agencies';
import AgencyModal from '@/components/forms/AgencyModal.vue'; // Assuming this path is correct

interface IAgency {
  id: string
  name: string
  tagline: string
  logo: string
  rating: number
  reviewCount: number
  work: string
  location: string
  budget: number
  size: string
  slogan?: string
  contactEmail?: string
  phoneNumber?: string
  website?: string
}

import {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadioButton,
  ElTable,
  ElTableColumn,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElIcon,
  ElRate,
  ElCard,
  ElRow,
  ElCol,
  ElTag,
  ElLoading // For v-loading directive
} from 'element-plus';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  MapPin,
  Briefcase,
  Users,
  Star,
  DollarSign,
  Edit,
  Trash2,
  FilterX,
  Eye // Added for view action
} from 'lucide-vue-next';

// Define AgencyCard inline if it's not a separate component, or ensure it matches this styling if it is.
// For consistency, I'll provide an inline version that can be copied to AgencyCard.vue if it exists.
const AgencyCard = {
  props: {
    agency: {
      type: Object as () => IAgency,
      required: true,
    },
  },
  emits: ['viewProfile', 'editAgency', 'deleteAgency'],
  setup(props: any, { emit }: any) {
    const formatCurrency = (value: number) => {
      return `৳ ${value.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    return {
      formatCurrency,
      MapPin, Briefcase, Users, Star, DollarSign, Edit, Trash2, Eye,
      emit
    };
  },
  template: `
    <el-card class="agency-card group" shadow="hover">
      <div class="flex items-center justify-between mb-4">
        <img :src="agency.logo" :alt="agency.name" class="w-16 h-16 rounded-lg object-contain border border-gray-100 p-1" />
        <el-tag size="small" type="info" class="rounded-md">{{ agency.size }}</el-tag>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ agency.name }}</h3>
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ agency.tagline }}</p>

      <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-4">
        <div class="flex items-center gap-2">
          <el-icon :size="16" class="text-gray-500"><MapPin /></el-icon>
          <span>{{ agency.location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <el-icon :size="16" class="text-gray-500"><Briefcase /></el-icon>
          <span>{{ agency.work }}</span>
        </div>
        <div class="flex items-center gap-2">
          <el-icon :size="16" class="text-gray-500"><DollarSign /></el-icon>
          <span>{{ formatCurrency(agency.budget) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <el-icon :size="16" class="text-gray-500"><Star /></el-icon>
          <el-rate v-model="agency.rating" disabled size="small" :colors="['#f5be22', '#f5be22', '#f5be22']" />
          <span class="text-xs text-gray-500 ml-1">({{ agency.reviewCount }})</span>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-100">
        <el-button link type="primary" size="small" @click="emit('viewProfile', agency.id)">
          <el-icon><Eye /></el-icon> View Profile
        </el-button>
        <div class="action-buttons">
          <el-button link type="primary" size="small" @click="emit('editAgency', agency)">
            <el-icon><Edit /></el-icon> Edit
          </el-button>
          <el-button link type="danger" size="small" @click="emit('deleteAgency', agency.id)">
            <el-icon><Trash2 /></el-icon> Delete
          </el-button>
        </div>
      </div>
    </el-card>
  `,
};


const agenciesStore = useAgenciesStore();

const viewType = ref<'grid' | 'list'>('list'); // Default to list view for better table visibility

const isAgencyModalVisible = ref(false);
const currentAgency = ref<IAgency | null>(null);

const openAddAgencyModal = () => {
  currentAgency.value = null;
  isAgencyModalVisible.value = true;
};

const openEditAgencyModal = (agency: IAgency) => {
  currentAgency.value = { ...agency };
  isAgencyModalVisible.value = true;
};

const handleSaveAgency = (agency: IAgency) => {
  // This logic is already API-friendly, assuming agenciesStore methods
  // would internally handle API calls (e.g., using axios)
  if (agency.id && agenciesStore.allAgencies.some((a: IAgency) => a.id === agency.id)) {
    agenciesStore.updateAgency(agency);
    ElMessage.success('Agency updated successfully!');
  } else {
    // For new agencies, assign a simple ID. In a real API, the backend would assign the ID.
    agenciesStore.addAgency({ ...agency, id: Date.now().toString() });
    ElMessage.success('Agency added successfully!');
  }
  isAgencyModalVisible.value = false;
};

const handleDeleteAgency = (id: string) => {
  ElMessageBox.confirm(
    'This will permanently delete the agency. Continue?',
    'Warning',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  )
    .then(() => {
      agenciesStore.deleteAgency(id);
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

const handleViewProfile = (id: string) => {
  ElMessage.info(`Viewing profile for agency ID: ${id}`);
  // In a real app, you might navigate to a dedicated agency profile page
  // router.push(`/agencies/${id}`);
};

const clearFilters = () => {
  agenciesStore.searchTerm = '';
  agenciesStore.filterByLocation = '';
  agenciesStore.filterByWork = '';
  agenciesStore.filterBySize = '';
  agenciesStore.sortBy = 'name'; // Reset sort to default
  ElMessage.info('Filters cleared!');
};

const handleSearch = () => {
  // Search is handled by computed property in store
};

const handleFilter = () => {
  // Filtering is handled by computed property in store
};

const handleSort = () => {
  // Sorting is handled by computed property in store
};


const formatCurrency = (value: number) => {
  return `৳ ${value.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.agencies-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* Page Header styles - consistent with Invoices.vue */
.page-header {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #4b5563;
}

.el-button.el-button--large {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
}

/* Control Bar Card styles - consistent with Invoices.vue card header */
.control-bar-card {
  --el-card-padding: 24px;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  background-color: #ffffff;
}

.control-bar-card :deep(.el-card__header) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.control-bar-card .card-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.control-bar-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.control-bar-card .header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-input,
.control-select {
  width: 100%;
  flex: 1;
}

.control-input :deep(.el-input__wrapper),
.control-select :deep(.el-select__wrapper) {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: none !important;
  padding: 0.625rem 0.75rem;
}

.control-input :deep(.el-input__wrapper.is-focus),
.control-select :deep(.el-select__wrapper.is-focused) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.clear-filters-button {
  border-radius: 0.5rem;
  color: #4b5563;
  transition-property: background-color, color;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.clear-filters-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.view-toggle :deep(.el-radio-button__inner) {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  padding: 0.5rem 1rem;
  box-shadow: none !important;
}

.view-toggle :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
  background-color: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.view-toggle :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner:hover) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

/* Agency Card Styling (for grid view) */
.agency-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition-property: box-shadow;
  transition-duration: 0.3s;
  padding: 1.5rem;
  --el-card-padding: 0px;
}

.agency-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.agency-card :deep(.el-card__body) {
  padding: 0;
}

/* Table Styling (for list view) - consistent with Invoices.vue table */
.agencies-list {
  background-color: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
}

/* New wrapper for table to handle overflow and ensure full width */
.table-responsive-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

:deep(.el-table) {
  border-radius: 0.75rem;
  min-width: 800px;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

:deep(.el-table td.el-table__cell) {
  color: #374151;
  padding: 0.75rem 1rem;
}

:deep(.el-table__row--striped td.el-table__cell) {
  background-color: #f9fafb;
}

:deep(.el-table__row:hover) {
  background-color: #f3f4f6;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.el-button.el-button--link.el-button--small {
  font-size: 0.875rem;
  font-weight: 500;
}

.mr-2 {
  margin-right: 8px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-title {
    margin-bottom: 0;
  }

  .control-bar-card .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .control-input,
  .control-select {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .agencies-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .control-bar-card .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }


}
</style>
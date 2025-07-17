<template>
  <div class="agencies-container">
    <!-- Page Header -->
    <div class="page-header">
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

    <!-- Control Bar (as an ElCard) -->
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

      <!-- Agency Display Area -->
      <div v-loading="agenciesStore.loading" class="min-h-[300px] flex items-center justify-center">
        <div v-if="agenciesStore.filteredAndSortedAgencies.length > 0">
          <div v-if="viewType === 'grid'"
            class="agencies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AgencyCard v-for="agency in agenciesStore.filteredAndSortedAgencies" :key="agency.id" :agency="agency"
              @viewProfile="handleViewProfile" @editAgency="openEditAgencyModal" @deleteAgency="handleDeleteAgency" />
          </div>

          <div v-else class="agencies-list bg-white rounded-xl overflow-hidden">
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
              <el-table-column label="Actions" width="180" fixed="right" align="center">
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
        <div v-else class="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm w-full">
          <el-empty description="No agencies found matching your criteria." />
          <el-button type="primary" @click="openAddAgencyModal" class="mt-4">Add First Agency</el-button>
        </div>
      </div>
    </el-card>

    <!-- Agency Modal -->
    <AgencyModal :visible="isAgencyModalVisible" :agency="currentAgency" @update:visible="isAgencyModalVisible = $event"
      @save="handleSaveAgency" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAgenciesStore, IAgency } from '@/stores/agencies';
import AgencyModal from '@/components/forms/AgencyModal.vue'; // Assuming this path is correct
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
  setup(props, { emit }) {
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

const viewType = ref<'grid' | 'list'>('list');

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
  if (agency.id && agenciesStore.allAgencies.some(a => a.id === agency.id)) {
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
  @apply p-6 bg-gray-50 min-h-screen;
}

/* Page Header styles - consistent with Invoices.vue */
.page-header {
  @apply flex flex-col md:flex-row items-start md:items-center justify-between mb-8;
}

.header-content {
  @apply flex-1;
}

.page-title {
  @apply text-3xl font-bold text-gray-800 mb-2 md:mb-0;
}

.page-subtitle {
  @apply text-base text-gray-600;
}

.el-button.el-button--large {
  @apply px-6 py-3 rounded-lg text-base;
}

/* Control Bar Card styles - consistent with Invoices.vue card header */
.control-bar-card {
  --el-card-padding: 24px;
  @apply rounded-xl shadow-md mb-6 bg-white;
}

.control-bar-card :deep(.el-card__header) {
  @apply py-4 px-6 border-b border-gray-100;
}

.control-bar-card .card-header {
  @apply flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4;
}

.control-bar-card h3 {
  @apply text-lg font-semibold text-gray-800 m-0;
}

.control-bar-card .header-actions {
  @apply flex flex-wrap gap-5 items-center;
}

.control-input,
.control-select {
  @apply w-full sm:w-auto flex-1 max-w-[600px];
}

.control-input :deep(.el-input__wrapper),
.control-select :deep(.el-select__wrapper) {
  @apply rounded-lg border border-gray-200 shadow-none px-3 py-2.5;
  box-shadow: none !important;
}

.control-input :deep(.el-input__wrapper.is-focus),
.control-select :deep(.el-select__wrapper.is-focused) {
  @apply border-blue-500 ring-2 ring-blue-500/20;
}

.clear-filters-button {
  @apply rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors;
}

.view-toggle :deep(.el-radio-button__inner) {
  @apply rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2;
  box-shadow: none !important;
}

.view-toggle :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
  @apply bg-blue-600 border-blue-600 text-white;
}

.view-toggle :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner:hover) {
  @apply bg-blue-700 border-blue-700;
}

/* Agency Card Styling (for grid view) */
.agency-card {
  @apply bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6;
  --el-card-padding: 0px;
  /* Reset Element Plus default padding */
}

.agency-card :deep(.el-card__body) {
  @apply p-0;
  /* Ensure internal padding is handled by Tailwind classes */
}

/* Table Styling (for list view) - consistent with Invoices.vue table */
.agencies-list {
  @apply bg-white rounded-xl overflow-hidden;
}

:deep(.el-table) {
  @apply rounded-xl;
}

:deep(.el-table th.el-table__cell) {
  @apply bg-gray-100 text-gray-700 font-semibold py-3 px-4;
}

:deep(.el-table td.el-table__cell) {
  @apply text-gray-700 py-3 px-4;
}

:deep(.el-table__row--striped td.el-table__cell) {
  @apply bg-gray-50;
}

:deep(.el-table__row:hover) {
  @apply bg-gray-100;
}

.action-buttons {
  @apply flex gap-2 justify-center;
  /* Center actions in table */
}

.el-button.el-button--link.el-button--small {
  @apply text-sm font-medium;
}

.mr-2 {
  margin-right: 8px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .control-bar-card .header-actions {
    @apply flex-col items-stretch;
  }

  .control-input,
  .control-select {
    @apply max-w-full;
  }
}

@media (max-width: 768px) {
  .agencies-container {
    @apply p-4;
  }

  .page-header {
    @apply flex-col gap-4 items-stretch;
  }

  .page-title {
    @apply text-2xl;
  }

  .control-bar-card .card-header {
    @apply flex-col items-stretch;
  }

  .action-buttons {
    @apply flex-col items-start;
  }
}
</style>
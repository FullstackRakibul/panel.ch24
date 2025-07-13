<template>
  <div class="agencies-container p-6 bg-gray-50 min-h-screen">
    <div class="page-header flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <h1 class="page-title text-3xl font-bold text-gray-800 mb-4 md:mb-0">Advertising Agencies</h1>
      <el-button type="primary" :icon="Plus" @click="openAddAgencyModal" class="add-agency-button">
        Add New Agency
      </el-button>
    </div>

    <div
      class="control-bar bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <el-input v-model="agenciesStore.searchTerm" placeholder="Search agencies..." :prefix-icon="Search" clearable
        class="search-input" />

      <el-select v-model="agenciesStore.filterByLocation" placeholder="Filter by Location" clearable
        class="filter-select">
        <el-option v-for="location in agenciesStore.locations" :key="location" :label="location" :value="location" />
      </el-select>

      <el-select v-model="agenciesStore.filterByWork" placeholder="Filter by Work Type" clearable class="filter-select">
        <el-option v-for="workType in agenciesStore.workTypes" :key="workType" :label="workType" :value="workType" />
      </el-select>

      <el-select v-model="agenciesStore.filterBySize" placeholder="Filter by Team Size" clearable class="filter-select">
        <el-option v-for="size in agenciesStore.sizes" :key="size" :label="size" :value="size" />
      </el-select>

      <el-select v-model="agenciesStore.sortBy" placeholder="Sort By" class="sort-select">
        <el-option label="Name (A-Z)" value="name" />
        <el-option label="Rating (High to Low)" value="rating" />
        <el-option label="Budget (Low to High)" value="budget" />
      </el-select>

      <div class="view-toggle flex justify-end md:col-span-2 lg:col-span-1">
        <el-radio-group v-model="viewType" size="small">
          <el-radio-button label="grid">
            <el-icon>
              <Grid3X3 />
            </el-icon>
            <span class="ml-1 hidden sm:inline">Grid View</span>
          </el-radio-button>
          <el-radio-button label="list">
            <el-icon>
              <List />
            </el-icon>
            <span class="ml-1 hidden sm:inline">List View</span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div v-if="agenciesStore.filteredAndSortedAgencies.length > 0">
      <div v-if="viewType === 'grid'"
        class="agencies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AgencyCard v-for="agency in agenciesStore.filteredAndSortedAgencies" :key="agency.id" :agency="agency"
          @viewProfile="handleViewProfile" />
      </div>

      <div v-else class="agencies-list bg-white rounded-lg shadow-sm overflow-hidden">
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
          <el-table-column prop="tagline" label="Tagline" />
          <el-table-column prop="location" label="Location" sortable />
          <el-table-column prop="work" label="Work Type" sortable />
          <el-table-column prop="budget" label="Budget" sortable>
            <template #default="{ row }">
              {{ formatCurrency(row.budget) }}
            </template>
          </el-table-column>
          <el-table-column prop="rating" label="Rating" sortable>
            <template #default="{ row }">
              <el-rate v-model="row.rating" disabled size="small" :colors="['#f5be22', '#f5be22', '#f5be22']" />
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="120">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="openEditAgencyModal(row)">Edit</el-button>
              <el-button link type="danger" size="small" @click="handleDeleteAgency(row.id)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
      <el-empty description="No agencies found matching your criteria." />
      <el-button type="primary" @click="openAddAgencyModal" class="mt-4">Add First Agency</el-button>
    </div>

    <AgencyModal :visible="isAgencyModalVisible" :agency="currentAgency" @update:visible="isAgencyModalVisible = $event"
      @save="handleSaveAgency" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAgenciesStore, IAgency } from '@/stores/agencies';
import AgencyCard from '@/components/ui/AgencyCard.vue';
import AgencyModal from '@/components/forms/AgencyModal.vue';
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
  ElRate
} from 'element-plus';
import { Plus, Search, Grid3X3, List } from 'lucide-vue-next';

const agenciesStore = useAgenciesStore();

const viewType = ref<'grid' | 'list'>('grid');

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
  if (agency.id && agenciesStore.allAgencies.some(a => a.id === agency.id)) {
    agenciesStore.updateAgency(agency);
  } else {
    agenciesStore.addAgency({ ...agency, id: Date.now().toString() });
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
  console.log('View profile for agency ID:', id);
};

const formatCurrency = (value: number) => {
  return `৳ ${value.toLocaleString('en-BD')}`;
};
</script>

<style scoped>
.agencies-container {
  @apply bg-gray-50;
}

.page-title {
  @apply text-gray-800;
}

.add-agency-button {
  @apply bg-primary text-white border-primary rounded-lg px-4 py-2 text-base font-semibold;
}

.add-agency-button:hover {
  @apply bg-primary-dark border-primary-dark;
}

.control-bar {
  @apply bg-white p-4 rounded-lg shadow-sm;
}

.search-input,
.filter-select,
.sort-select {
  @apply w-full;
}

/* Element Plus overrides for minimalist design */
:deep(.el-input__wrapper) {
  @apply rounded-md border border-gray-200 shadow-none;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px var(--primary-light) !important;
  border-color: var(--primary) !important;
}

:deep(.el-select__wrapper) {
  @apply rounded-md border border-gray-200 shadow-none;
}

:deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 2px var(--primary-light) !important;
  border-color: var(--primary) !important;
}

:deep(.el-radio-button__inner) {
  @apply rounded-md border border-gray-200 bg-white text-gray-700;
}

:deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
  @apply bg-primary border-primary text-white;
}

:deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner:hover) {
  @apply bg-primary-dark border-primary-dark;
}

.agencies-grid {
  /* Grid styles handled by Tailwind classes */
}

.agencies-list {
  @apply bg-white rounded-lg shadow-sm;
}

/* Table specific styles for minimalist look */
:deep(.el-table) {
  @apply rounded-lg;
}

:deep(.el-table th.el-table__cell) {
  @apply bg-gray-100 text-gray-700 font-semibold;
}

:deep(.el-table td.el-table__cell) {
  @apply text-gray-700;
}

:deep(.el-table__row--striped td.el-table__cell) {
  @apply bg-gray-50;
}

:deep(.el-table__row:hover) {
  @apply bg-gray-100;
}
</style>
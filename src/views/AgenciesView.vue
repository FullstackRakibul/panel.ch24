<template>
  <div class="agencies-page-container">
    <div class="header-section">
      <h1 class="text-xl font-semibold text-gray-800">All Advertising Companies in Bangladesh</h1>
      <el-input v-model="searchQuery" placeholder="Search agencies..." :prefix-icon="Search" clearable
        class="search-input" />
    </div>

    <div class="agencies-grid">
      <AgencyCard v-for="agency in filteredAgencies" :key="agency.id" :agency="agency"
        @view-profile="handleViewProfile" />
      <div v-if="filteredAgencies.length === 0" class="no-results">
        <el-empty description="No agencies found matching your search."></el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElInput, ElEmpty } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import AgencyCard from '@/components/ui/AgencyCard.vue'

// data fetching
interface Agency {
  id: string;
  logo: string;
  name: string;
  rating: number;
  reviewCount: number;
  slogan: string;
  work: string;
  location: string;
  budget: number;
  size: string;
}

const agencies = ref<Agency[]>([
  {
    id: '1',
    logo: 'https://via.placeholder.com/150/000000/FFFFFF?text=P',
    name: 'Pursuit Limited',
    rating: 0,
    reviewCount: 0,
    slogan: 'unlock your dreams',
    work: '1 work',
    location: 'Dhaka, Bangladesh',
    budget: 1000,
    size: '1-10',
  },
  {
    id: '2',
    logo: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=IS',
    name: 'Instant Solution',
    rating: 0,
    reviewCount: 0,
    slogan: 'Effortlessly accurate, every time',
    work: '1 work',
    location: 'Dhaka, Bangladesh',
    budget: 2000,
    size: '11-50',
  },
  {
    id: '3',
    logo: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=MK',
    name: 'Markimist',
    rating: 0,
    reviewCount: 0,
    slogan: 'Build a Brand, Not Just a Business!!',
    work: 'Looking for work',
    location: 'Dhaka, Bangladesh',
    budget: 50,
    size: '11-50',
  },
  {
    id: '4',
    logo: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=CT',
    name: 'Ctmrs Limited',
    rating: 0,
    reviewCount: 0,
    slogan: 'Leading the way in digital solutions.', // Example slogan
    work: '1 work',
    location: 'Dhaka District, Bangladesh',
    budget: 1000,
    size: '11-50',
  },
  {
    id: '5',
    logo: 'https://via.placeholder.com/150/FFFF00/000000?text=BCI',
    name: 'BCI Technosys Limited',
    rating: 5, // Example rating
    reviewCount: 1, // Example review count
    slogan: 'Innovating for a brighter future.', // Example slogan
    work: 'Looking for work',
    location: 'Dhaka, Bangladesh',
    budget: 1000,
    size: '11-50',
  },
  {
    id: '6',
    logo: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=A',
    name: 'Augnitive',
    rating: 0,
    reviewCount: 0,
    slogan: 'Your trusted partner in growth.',
    work: 'Looking for work',
    location: 'Dhaka, Bangladesh',
    budget: 0,
    size: '1-10',
  },
]);

const searchQuery = ref('');

const filteredAgencies = computed(() => {
  if (!searchQuery.value) {
    return agencies.value;
  }
  const query = searchQuery.value.toLowerCase();
  return agencies.value.filter(agency =>
    agency.name.toLowerCase().includes(query) ||
    agency.slogan.toLowerCase().includes(query) ||
    agency.location.toLowerCase().includes(query)
  );
});

const handleViewProfile = (id: string) => {
  console.log('Viewing profile for agency ID:', id);
  // Implement navigation to agency profile page here
  // e.g., router.push(`/agencies/${id}`);
};
</script>

<style scoped>
.agencies-page-container {
  @apply p-6 bg-gray-50 min-h-screen;
  /* Added background color and min-height */
}

.header-section {
  @apply flex flex-col md:flex-row md:items-center md:justify-between mb-8;
}

.search-input {
  @apply w-full md:w-80 mt-4 md:mt-0;
}

/* Customizing Element Plus input for search bar */
:deep(.search-input .el-input__wrapper) {
  @apply rounded-lg shadow-sm border border-gray-200 px-4 py-2;
  /* More rounded, light shadow */
}

:deep(.search-input .el-input__inner) {
  @apply placeholder-gray-400;
}

:deep(.search-input .el-input__prefix) {
  @apply text-gray-400;
}

.agencies-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  /* Responsive grid */
}

.no-results {
  @apply col-span-full flex justify-center items-center py-12;
}
</style>
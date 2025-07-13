<template>
  <el-card shadow="hover" class="agency-card">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <img :src="agency.logo" :alt="agency.name"
          class="w-16 h-16 rounded-lg object-contain border border-gray-100 p-1" />
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ agency.name }}</h3>
          <el-rate v-model="agency.rating" disabled score-template="{value} review" class="mt-1"
            :colors="['#f5be22', '#f5be22', '#f5be22']" />
          <p class="text-sm text-gray-500 mt-0.5">{{ agency.reviewCount }} review{{ agency.reviewCount !== 1 ? 's' : ''
          }}</p>
        </div>
      </div>
      <el-icon class="text-gray-400 hover:text-red-500 cursor-pointer">
        <Star class="h-5 w-5" />
      </el-icon>
    </div>

    <p class="text-gray-700 text-sm mb-4">{{ agency.slogan }}</p>

    <div class="space-y-3 text-sm text-gray-600 mb-6">
      <div class="flex items-center gap-2">
        <Briefcase class="h-4 w-4 text-gray-500" />
        <span>{{ agency.work }} in Advertising</span>
      </div>
      <div class="flex items-center gap-2">
        <MapPin class="h-4 w-4 text-gray-500" />
        <span>Located in {{ agency.location }}</span>
      </div>
      <div class="flex items-center gap-2">
        <DollarSign class="h-4 w-4 text-gray-500" />
        <span>From {{ formatCurrency(agency.budget) }} for Advertising</span>
      </div>
      <div class="flex items-center gap-2">
        <Users class="h-4 w-4 text-gray-500" />
        <span>{{ agency.size }} members</span>
      </div>
    </div>

    <el-button type="primary" class="w-full agency-card-button" @click="$emit('viewProfile', agency.id)">
      See profile
    </el-button>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ElCard, ElRate, ElButton, ElIcon } from 'element-plus';
import { Star, MapPin, Users, DollarSign, Briefcase } from 'lucide-vue-next';

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

defineProps<{
  agency: Agency;
}>();

defineEmits(['viewProfile']);

const formatCurrency = (value: number) => {
  return `৳ ${value.toLocaleString('en-BD')}`;
};
</script>

<style scoped>
.agency-card {
  @apply rounded-xl p-6 border border-gray-200 shadow-sm bg-white;
  transition: all 0.2s ease-in-out;
}

.agency-card:hover {
  @apply shadow-md border-gray-300;
}

/* Customizing El-Rate stars */
:deep(.el-rate__icon) {
  font-size: 14px !important;
  margin-right: 2px !important;
}

:deep(.el-rate__text) {
  @apply text-sm text-gray-500 !important;
}

.agency-card-button {
  @apply rounded-lg font-semibold;
  background-color: var(--ch24-primary);
  color: white;
  border: 1px solid var(--ch24-primary);
  transition: all 0.2s ease-in-out;
}

.agency-card-button:hover {
  background-color: var(--ch24-primary-dark);
  border-color: var(--ch24-primary-dark);
}

/* Override Element Plus default button hover/focus if necessary */
:deep(.el-button.is-hover),
:deep(.el-button:focus) {
  background-color: var(--ch24-primary-dark) !important;
  color: white !important;
  border-color: var(--ch24-primary-dark) !important;
}
</style>
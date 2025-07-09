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
        <StarFilled class="h-5 w-5" />
      </el-icon>
    </div>

    <p class="text-gray-700 text-sm mb-4">{{ agency.slogan }}</p>

    <div class="space-y-3 text-sm text-gray-600 mb-6">
      <div class="flex items-center gap-2">
        <Work class="h-4 w-4 text-gray-500" />
        <span>{{ agency.status }} in Advertising</span>
      </div>
      <div class="flex items-center gap-2">
        <LocationFilled class="h-4 w-4 text-gray-500" />
        <span>Located in {{ agency.location }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Money class="h-4 w-4 text-gray-500" />
        <span>From {{ agency.budget }} for Advertising</span>
      </div>
      <div class="flex items-center gap-2">
        <UserFilled class="h-4 w-4 text-gray-500" />
        <span>{{ agency.members }} members</span>
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
import { StarFilled, LocationFilled, UserFilled, Money } from '@element-plus/icons-vue';
// Custom icon for 'Work'. Since Element Plus Icons don't have a direct 'Work' icon,
// we can either use a generic one or import from another library like Lucide Vue if available.
// For this example, I'll use a placeholder or assume a suitable one from Element Plus Icons.
// Let's assume you have 'Briefcase' or similar. If not, use a generic one like 'Setting' or 'Paperclip'
// or stick to Lucide for more specific icons if you have it installed.
// For now, let's use a generic El icon or text.
// If you want 'Briefcase', you would import it from '@element-plus/icons-vue' if it exists.
// As per the Element Plus Icons site, there isn't a direct 'Work' icon that exactly matches.
// Let's create a simple wrapper for a "Work" icon if you don't have Lucide, or just use text.
// For the demo, I'll use a local 'Work' icon to represent a briefcase.
// If you have `lucide-vue-next` installed, you can use:
import { Briefcase as Work } from 'lucide-vue-next'; // If you use lucide for more specific icons.
// Otherwise, fall back to a generic El icon or remove it.
// For the sake of matching the demo visually, let's assume `Work` exists or use a generic one.


interface Agency {
  id: number;
  logo: string;
  name: string;
  rating: number;
  reviewCount: number;
  slogan: string;
  status: string;
  location: string;
  budget: string;
  members: string;
}

defineProps<{
  agency: Agency;
}>();

defineEmits(['viewProfile']);
</script>

<style scoped>
.agency-card {
  @apply rounded-xl p-6 border-0;
  /* Adjust padding and remove default border */
}

/* Customizing El-Rate stars */
:deep(.el-rate__icon) {
  font-size: 14px !important;
  /* Smaller stars */
  margin-right: 2px !important;
  /* Closer together */
}

:deep(.el-rate__text) {
  @apply text-sm text-gray-500 !important;
  /* Styling for the review text */
}

.agency-card-button {
  @apply rounded-lg font-semibold;
  /* Adjust button border-radius */
  background-color: #e0e7ff;
  /* Lighter blue background similar to demo */
  color: #3f51b5;
  /* Darker blue text */
  border: 1px solid #c5cae9;
  /* Light border */
  transition: all 0.2s ease-in-out;
}

.agency-card-button:hover {
  background-color: #c5cae9;
  /* Darker hover */
  color: #2c387e;
  border-color: #9fa8da;
}

/* Override Element Plus default button hover/focus if necessary */
:deep(.el-button.is-hover),
:deep(.el-button:focus) {
  background-color: #c5cae9 !important;
  color: #2c387e !important;
  border-color: #9fa8da !important;
}
</style>
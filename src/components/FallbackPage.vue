<template>
  <div class="fallback-page">
    <el-result icon="warning" :title="title" :sub-title="subtitle">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">
          Go to Dashboard
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<style scoped>
.fallback-page {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
</style>
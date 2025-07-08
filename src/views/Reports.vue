<template>
  <div class="reports-container">
    <div class="page-header">
      <h1 class="page-title">Reports</h1>
      <p class="page-subtitle">View analytics and reports</p>
    </div>

    <el-card class="content-card">
      <div class="coming-soon">
        <el-icon size="64" class="icon">
          <DataAnalysis />
        </el-icon>
        <h2>Reports & Analytics</h2>
        <p>This feature is coming soon. You'll be able to view detailed reports and analytics here.</p>
        <el-button type="primary" @click="$router.push('/')">
          Back to Dashboard
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { DataAnalysis } from '@element-plus/icons-vue'
</script>

<style scoped>
.reports-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
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

.content-card {
  min-height: 400px;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  gap: 16px;
}

.icon {
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.coming-soon h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.coming-soon p {
  font-size: 16px;
  color: var(--el-text-color-regular);
  max-width: 400px;
  margin: 0;
}
</style>
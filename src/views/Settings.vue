<template>
  <div class="settings-container">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your application settings</p>
    </div>

    <el-card class="content-card">
      <div class="coming-soon">
        <el-icon size="64" class="icon">
          <Setting />
        </el-icon>
        <h2>Application Settings</h2>
        <p>This feature is coming soon. You'll be able to configure all application settings here.</p>
        <el-button type="primary" @click="$router.push('/')">
          Back to Dashboard
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
</script>

<style scoped>
.settings-container {
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
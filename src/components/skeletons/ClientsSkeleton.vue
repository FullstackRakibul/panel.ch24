<template>
  <div class="clients-skeleton">
    <!-- Header -->
    <div class="skeleton-header">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="h1" style="width: 20%; margin-bottom: 8px;" />
          <el-skeleton-item variant="text" style="width: 40%;" />
        </template>
      </el-skeleton>
    </div>

    <!-- Stats Cards -->
    <div class="skeleton-stats-section">
      <el-row :gutter="24">
        <el-col v-for="i in 3" :key="i" :xs="24" :sm="8">
          <div class="skeleton-stats-card">
            <el-skeleton animated>
              <template #template>
                <div class="stats-skeleton-content">
                  <el-skeleton-item variant="circle" style="width: 56px; height: 56px;" />
                  <div class="stats-skeleton-info">
                    <el-skeleton-item variant="h3" style="width: 60%; margin-bottom: 8px;" />
                    <el-skeleton-item variant="text" style="width: 80%;" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Filters -->
    <div class="skeleton-filters">
      <el-skeleton animated>
        <template #template>
          <el-row :gutter="16">
            <el-col :xs="24" :sm="8">
              <el-skeleton-item variant="button" style="width: 100%; height: 40px;" />
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-skeleton-item variant="button" style="width: 100%; height: 40px;" />
            </el-col>
            <el-col :xs="24" :sm="4">
              <el-skeleton-item variant="button" style="width: 100%; height: 40px;" />
            </el-col>
            <el-col :xs="24" :sm="8">
              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <el-skeleton-item variant="button" style="width: 100px; height: 40px;" />
                <el-skeleton-item variant="button" style="width: 100px; height: 40px;" />
              </div>
            </el-col>
          </el-row>
        </template>
      </el-skeleton>
    </div>

    <!-- Client Cards Grid -->
    <div class="skeleton-clients-grid">
      <el-row :gutter="24">
        <el-col v-for="i in 8" :key="i" :xs="24" :sm="12" :lg="8" :xl="6">
          <div class="skeleton-client-card">
            <el-skeleton animated>
              <template #template>
                <!-- Card Header -->
                <div class="client-card-header">
                  <div class="client-avatar-section">
                    <el-skeleton-item variant="circle" style="width: 48px; height: 48px;" />
                    <div class="client-basic-info">
                      <el-skeleton-item variant="h3" style="width: 80%; margin-bottom: 8px;" />
                      <div style="display: flex; gap: 8px;">
                        <el-skeleton-item variant="button" style="width: 60px; height: 20px;" />
                        <el-skeleton-item variant="button" style="width: 50px; height: 20px;" />
                      </div>
                    </div>
                  </div>
                  <el-skeleton-item variant="circle" style="width: 32px; height: 32px;" />
                </div>

                <!-- Card Content -->
                <div class="client-card-content">
                  <div v-for="j in 4" :key="j" class="info-item-skeleton">
                    <el-skeleton-item variant="circle" style="width: 16px; height: 16px;" />
                    <el-skeleton-item variant="text" style="width: 70%;" />
                  </div>
                </div>

                <!-- Card Footer -->
                <div class="client-card-footer">
                  <el-skeleton-item variant="text" style="width: 40%;" />
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <el-skeleton-item variant="circle" style="width: 8px; height: 8px;" />
                    <el-skeleton-item variant="text" style="width: 40px;" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.clients-skeleton {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.skeleton-header {
  margin-bottom: 32px;
}

.skeleton-stats-section {
  margin-bottom: 32px;
}

.skeleton-stats-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.stats-skeleton-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-skeleton-info {
  flex: 1;
}

.skeleton-filters {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 32px;
}

.skeleton-clients-grid {
  min-height: 400px;
}

.skeleton-client-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 24px;
}

.client-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.client-avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.client-basic-info {
  flex: 1;
}

.client-card-content {
  margin-bottom: 20px;
}

.info-item-skeleton {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.client-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
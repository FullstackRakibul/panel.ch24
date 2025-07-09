<template>
  <div class="dashboard-skeleton">
    <!-- Header -->
    <div class="skeleton-header">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="h1" style="width: 25%; margin-bottom: 8px;" />
          <el-skeleton-item variant="text" style="width: 45%;" />
        </template>
      </el-skeleton>
    </div>

    <!-- KPI Cards -->
    <div class="skeleton-kpi-section">
      <el-row :gutter="24">
        <el-col v-for="i in 4" :key="i" :xs="24" :sm="12" :lg="6">
          <div class="skeleton-kpi-card">
            <el-skeleton animated>
              <template #template>
                <div class="kpi-skeleton-content">
                  <el-skeleton-item variant="circle" style="width: 56px; height: 56px;" />
                  <div class="kpi-skeleton-info">
                    <el-skeleton-item variant="h3" style="width: 80%; margin-bottom: 8px;" />
                    <el-skeleton-item variant="text" style="width: 60%;" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Charts Section -->
    <div class="skeleton-charts-section">
      <el-row :gutter="24">
        <el-col :xs="24" :lg="12">
          <div class="skeleton-chart-card">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="h3" style="width: 40%; margin-bottom: 16px;" />
                <el-skeleton-item variant="image" style="width: 100%; height: 300px;" />
              </template>
            </el-skeleton>
          </div>
        </el-col>
        <el-col :xs="24" :lg="12">
          <div class="skeleton-chart-card">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="h3" style="width: 35%; margin-bottom: 16px;" />
                <el-skeleton-item variant="image" style="width: 100%; height: 300px;" />
              </template>
            </el-skeleton>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Activity Section -->
    <div class="skeleton-activity-section">
      <div class="skeleton-activity-card">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="h3" style="width: 30%; margin-bottom: 20px;" />
            <div v-for="i in 4" :key="i" class="skeleton-activity-item">
              <el-skeleton-item variant="circle" style="width: 40px; height: 40px;" />
              <div class="skeleton-activity-content">
                <el-skeleton-item variant="text" style="width: 70%; margin-bottom: 4px;" />
                <el-skeleton-item variant="text" style="width: 30%;" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-skeleton {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.skeleton-header {
  margin-bottom: 32px;
}

.skeleton-kpi-section {
  margin-bottom: 32px;
}

.skeleton-kpi-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.kpi-skeleton-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kpi-skeleton-info {
  flex: 1;
}

.skeleton-charts-section {
  margin-bottom: 32px;
}

.skeleton-chart-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.skeleton-activity-section {
  margin-bottom: 32px;
}

.skeleton-activity-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.skeleton-activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.skeleton-activity-content {
  flex: 1;
}
</style>
<template>
  <div class="page-skeleton">
    <!-- Header Skeleton -->
    <div class="skeleton-header">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="h1" style="width: 30%; margin-bottom: 8px;" />
          <el-skeleton-item variant="text" style="width: 50%;" />
        </template>
      </el-skeleton>
    </div>

    <!-- Content Skeleton -->
    <div class="skeleton-content">
      <el-skeleton animated :rows="8" :loading="true">
        <template #template>
          <div class="skeleton-cards">
            <div v-for="i in 6" :key="i" class="skeleton-card">
              <el-skeleton-item variant="image" style="width: 100%; height: 200px;" />
              <div style="padding: 16px;">
                <el-skeleton-item variant="h3" style="width: 70%; margin-bottom: 12px;" />
                <el-skeleton-item variant="text" style="width: 100%; margin-bottom: 8px;" />
                <el-skeleton-item variant="text" style="width: 80%;" />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<style scoped>
.page-skeleton {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.skeleton-header {
  margin-bottom: 32px;
}

.skeleton-content {
  width: 100%;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.skeleton-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
}
</style>
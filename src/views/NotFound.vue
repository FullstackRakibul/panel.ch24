<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- Animated 404 -->
      <div class="error-animation">
        <div class="error-number">
          <span class="four">4</span>
          <span class="zero">0</span>
          <span class="four">4</span>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message">
        <h1>Oops! Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <p>Don't worry, let's get you back on track!</p>
      </div>

      <!-- Action Buttons -->
      <div class="error-actions">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon class="mr-2">
            <HomeFilled />
          </el-icon>
          Go to Dashboard
        </el-button>
        <el-button size="large" @click="goBack">
          <el-icon class="mr-2">
            <ArrowLeft />
          </el-icon>
          Go Back
        </el-button>
        <el-button size="large" @click="refresh">
          <el-icon class="mr-2">
            <Refresh />
          </el-icon>
          Refresh Page
        </el-button>
      </div>

      <!-- Quick Links -->
      <!-- <div class="quick-links">
        <h3>Quick Links</h3>
        <div class="links-grid">
          <router-link v-for="link in quickLinks" :key="link.path" :to="link.path" class="quick-link">
            <el-icon class="link-icon">
              <component :is="link.icon" />
            </el-icon>
            <span>{{ link.name }}</span>
          </router-link>
        </div>
      </div> -->

      <!-- Search -->
      <div class="search-section">
        <h3>Search for what you need</h3>
        <el-input v-model="searchQuery" placeholder="Search pages, clients, invoices..." size="large"
          class="search-input" @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
          <template #append>
            <el-button @click="handleSearch">Search</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- Background Animation -->
    <div class="background-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  HomeFilled,
  ArrowLeft,
  Refresh,
  Search,
  User,
  Document,
  CreditCard,
  DataAnalysis,
  Setting
} from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

const quickLinks = [
  { name: 'Dashboard', path: '/', icon: HomeFilled },
  { name: 'Clients', path: '/clients', icon: User },
  { name: 'Invoices', path: '/invoices', icon: Document },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Reports', path: '/reports', icon: DataAnalysis },
  { name: 'Settings', path: '/settings', icon: Setting }
]

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const refresh = () => {
  window.location.reload()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    ElMessage.info(`Searching for: ${searchQuery.value}`)
    // Implement search functionality here
    // For now, redirect to dashboard
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.not-found-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.error-animation {
  margin-bottom: 40px;
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.error-number span {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(45deg, #A02408, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bounce 2s infinite;
}

.error-number .zero {
  animation-delay: 0.2s;
}

.error-number .four:last-child {
  animation-delay: 0.4s;
}

.error-text {
  font-size: 24px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.error-message {
  margin-bottom: 40px;
}

.error-message h1 {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.error-message p {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.mr-2 {
  margin-right: 8px;
}

.quick-links {
  margin-bottom: 40px;
}

.quick-links h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(160, 36, 8, 0.1);
  border-radius: 12px;
  text-decoration: none;
  color: #A02408;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.quick-link:hover {
  background: rgba(160, 36, 8, 0.2);
  border-color: #A02408;
  transform: translateY(-2px);
}

.link-icon {
  font-size: 24px;
}

.search-section {
  margin-top: 40px;
}

.search-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.search-input {
  max-width: 400px;
  margin: 0 auto;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-20px);
  }

  60% {
    transform: translateY(-10px);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 20px;
  }

  .error-number span {
    font-size: 80px;
  }

  .error-message h1 {
    font-size: 28px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions .el-button {
    width: 100%;
    max-width: 200px;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
<template>
  <!-- PWA Install Banner -->
  <Transition name="slide-down">
    <div v-if="showInstallPrompt" class="pwa-install-banner">
      <div class="install-content">
        <div class="install-info">
          <div class="install-icon">
            <img src="@/assets/CH24.png" alt="Channel 24" class="app-icon" />
          </div>
          <div class="install-text">
            <h3>Install Channel 24</h3>
            <p>Get the full app experience with offline access and push notifications</p>
          </div>
        </div>
        <div class="install-actions">
          <el-button @click="dismissInstall" size="small">
            Not Now
          </el-button>
          <el-button type="primary" @click="installApp" size="small">
            <el-icon class="mr-1">
              <Download />
            </el-icon>
            Install
          </el-button>
        </div>
      </div>
      <el-button :icon="Close" circle size="small" class="close-btn" @click="dismissInstall" />
    </div>
  </Transition>

  <!-- PWA Install Modal -->
  <el-dialog v-model="showInstallModal" title="Install Channel 24 App" width="500px" :close-on-click-modal="false">
    <div class="install-modal-content">
      <div class="modal-icon">
        <img src="@/assets/CH24.png" alt="Channel 24" class="large-app-icon" />
      </div>
      <h2>Install Channel 24</h2>
      <div class="features-list">
        <div class="feature-item">
          <el-icon class="feature-icon">
            <Check />
          </el-icon>
          <span>Work offline with cached data</span>
        </div>
        <div class="feature-item">
          <el-icon class="feature-icon">
            <Check />
          </el-icon>
          <span>Faster loading and better performance</span>
        </div>
        <div class="feature-item">
          <el-icon class="feature-icon">
            <Check />
          </el-icon>
          <span>Push notifications for important updates</span>
        </div>
        <div class="feature-item">
          <el-icon class="feature-icon">
            <Check />
          </el-icon>
          <span>Native app-like experience</span>
        </div>
        <div class="feature-item">
          <el-icon class="feature-icon">
            <Check />
          </el-icon>
          <span>Quick access from home screen</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <el-button @click="showInstallModal = false">
          Maybe Later
        </el-button>
        <el-button type="primary" @click="installApp">
          <el-icon class="mr-1">
            <Download />
          </el-icon>
          Install Now
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Close, Check } from '@element-plus/icons-vue'

const showInstallPrompt = ref(false)
const showInstallModal = ref(false)
const deferredPrompt = ref<any>(null)

// Check if app is already installed
const isAppInstalled = ref(false)

onMounted(() => {
  // Check if running as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isAppInstalled.value = true
    return
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

  // Check if user has dismissed the prompt recently
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  const now = Date.now()
  const oneWeek = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds

  if (!dismissedTime || (now - parseInt(dismissedTime)) > oneWeek) {
    // Show prompt after a delay
    setTimeout(() => {
      if (deferredPrompt.value && !isAppInstalled.value) {
        showInstallPrompt.value = true
      }
    }, 10000) // Show after 10 seconds
  }

  // Listen for app installed event
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})

const handleBeforeInstallPrompt = (e: Event) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault()
  // Stash the event so it can be triggered later
  deferredPrompt.value = e
}

const handleAppInstalled = () => {
  isAppInstalled.value = true
  showInstallPrompt.value = false
  showInstallModal.value = false
  ElMessage.success('Channel 24 app installed successfully!')

  // Clear the deferredPrompt
  deferredPrompt.value = null
}

const installApp = async () => {
  if (!deferredPrompt.value) {
    // Fallback for browsers that don't support PWA installation
    showInstallModal.value = true
    return
  }

  try {
    // Show the install prompt
    deferredPrompt.value.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      ElMessage.success('App installation started!')
    } else {
      ElMessage.info('App installation cancelled')
    }

    // Clear the deferredPrompt
    deferredPrompt.value = null
    showInstallPrompt.value = false
    showInstallModal.value = false
  } catch (error) {
    console.error('Error installing app:', error)
    ElMessage.error('Failed to install app')
  }
}

const dismissInstall = () => {
  showInstallPrompt.value = false
  showInstallModal.value = false

  // Remember that user dismissed the prompt
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}
</script>

<style scoped>
.pwa-install-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #A02408, #d97706);
  color: white;
  padding: 16px 20px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.install-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.install-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.install-icon {
  flex-shrink: 0;
}

.app-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.install-text h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.install-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.install-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.install-modal-content {
  text-align: center;
  padding: 20px 0;
}

.modal-icon {
  margin-bottom: 20px;
}

.large-app-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.install-modal-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 24px 0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  color: var(--el-color-success);
  font-size: 16px;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.mr-1 {
  margin-right: 4px;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .install-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .install-actions {
    width: 100%;
    justify-content: center;
  }

  .close-btn {
    position: static;
    margin-top: 8px;
  }
}
</style>
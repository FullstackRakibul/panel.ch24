<template>
  <div class="media-upload-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Media Library</h1>
        <p class="page-subtitle">Upload and manage your media files</p>
      </div>
      <el-button type="primary" size="large" @click="triggerFileInput">
        <el-icon class="mr-2">
          <Plus />
        </el-icon>
        Upload Files
      </el-button>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left Sidebar -->
      <div class="sidebar ">
        <!-- File Categories -->
        <div class="category-section ">
          <h3 class="section-title">Categories</h3>
          <div class="category-list">
            <div v-for="category in categories" :key="category.type" class="category-item"
              :class="{ active: selectedCategory === category.type }" @click="selectedCategory = category.type">
              <el-icon class="category-icon">
                <component :is="category.icon" />
              </el-icon>
              <span class="category-name">{{ category.name }}</span>
              <span class="file-count">{{ category.count }}</span>
            </div>
          </div>
        </div>

        <!-- Storage Usage -->
        <div class="storage-section">
          <h3 class="section-title">Storage Usage</h3>
          <div class="storage-info">
            <div class="storage-header">
              <span class="storage-used">{{ formatStorage(usedStorage) }}</span>
              <span class="storage-total">of {{ formatStorage(totalStorage) }}</span>
            </div>
            <el-progress :percentage="storagePercentage" :stroke-width="8" :show-text="false"
              class="storage-progress" />

            <div class="storage-breakdown">
              <div v-for="item in storageBreakdown" :key="item.type" class="storage-item">
                <div class="storage-type">
                  <span class="type-name">{{ item.name }}</span>
                  <span class="type-size">{{ formatStorage(item.size) }}</span>
                </div>
                <div class="storage-count">{{ item.count }} Files</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Uploads -->
        <div class="recent-section">
          <h3 class="section-title">Recent Uploads</h3>
          <div class="recent-list">
            <div v-for="file in recentFiles" :key="file.id" class="recent-item">
              <div class="file-icon">
                <el-icon>
                  <component :is="getFileIcon(file.type)" />
                </el-icon>
              </div>
              <div class="file-info">
                <div class="file-name">{{ file.name }}</div>
                <div class="file-meta">
                  <span class="file-size">{{ formatStorage(file.size) }}</span>
                  <span class="file-date">{{ file.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-area">
        <!-- Upload Area -->
        <div class="upload-area" @drop="handleDrop" @dragover="handleDragOver" @dragleave="handleDragLeave"
          :class="{ 'drag-over': isDragOver }">
          <input ref="fileInput" type="file" multiple @change="handleFileSelect" style="display: none" />

          <div class="upload-content">
            <el-icon class="upload-icon">
              <Upload />
            </el-icon>
            <h3 class="upload-title">Upload your files</h3>
            <p class="upload-subtitle">Drop your files here, or click to browse</p>
            <el-button type="primary" @click="triggerFileInput">
              Browse Files
            </el-button>
          </div>
        </div>

        <!-- File List -->
        <div class="file-list-section">
          <div class="section-header">
            <h3 class="section-title">All Files</h3>
            <div class="section-actions">
              <el-input v-model="searchQuery" placeholder="Search files..." :prefix-icon="Search" clearable
                style="width: 300px;" />
              <el-select v-model="sortBy" placeholder="Sort by" style="width: 150px;">
                <el-option label="Name" value="name" />
                <el-option label="Date" value="date" />
                <el-option label="Size" value="size" />
                <el-option label="Type" value="type" />
              </el-select>
            </div>
          </div>

          <!-- Files Grid -->
          <div class="files-grid">
            <div v-for="file in filteredFiles" :key="file.id" class="file-card">
              <div class="file-preview">
                <div class="file-icon-large">
                  <el-icon>
                    <component :is="getFileIcon(file.type)" />
                  </el-icon>
                </div>
                <div class="file-actions">
                  <el-button type="primary" link :icon="Download" @click="downloadFile(file)" />
                  <el-button type="primary" link :icon="View" @click="previewFile(file)" />
                  <el-button type="danger" link :icon="Delete" @click="deleteFile(file)" />
                </div>
              </div>
              <div class="file-details">
                <div class="file-name" :title="file.name">{{ file.name }}</div>
                <div class="file-meta">
                  <span class="file-size">{{ formatStorage(file.size) }}</span>
                  <span class="file-date">{{ file.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredFiles.length === 0" class="empty-state">
            <el-icon class="empty-icon">
              <FolderOpen />
            </el-icon>
            <h3>No files found</h3>
            <p>Upload some files to get started</p>
          </div>
        </div>
      </div>
    </div>

    <!-- File Preview Modal -->
    <el-dialog v-model="showPreview" :title="previewFileData?.name" width="80%">
      <div class="preview-content">
        <img v-if="isImage(previewFileData)" :src="previewFileData?.url" :alt="previewFileData?.name"
          class="preview-image" />
        <div v-else class="preview-placeholder">
          <el-icon class="preview-icon">
            <component :is="getFileIcon(previewFileData?.type || '')" />
          </el-icon>
          <p>Preview not available for this file type</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Upload,
  Search,
  Download,
  View,
  Delete,
  FolderOpen,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File
} from 'lucide-vue-next'

// Types
interface FileItem {
  id: string
  name: string
  type: string
  size: number
  date: string
  url?: string
}

interface StorageItem {
  type: string
  name: string
  size: number
  count: number
}

// Reactive data
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const searchQuery = ref('')
const sortBy = ref('date')
const selectedCategory = ref('all')
const showPreview = ref(false)
const previewFileData = ref<FileItem | null>(null)

// Mock data - replace with actual API calls
const files = ref<FileItem[]>([
  {
    id: '1',
    name: 'Campaign Analysis - Q3.docx',
    type: 'document',
    size: 2700000,
    date: 'Apr 11, 2024',
    url: '#'
  },
  {
    id: '2',
    name: 'landscape_002.jpg',
    type: 'image',
    size: 1500000,
    date: 'Apr 11, 2024',
    url: '#'
  },
  {
    id: '3',
    name: 'interview_downtown_20241025.mp4',
    type: 'video',
    size: 85000000,
    date: 'Apr 10, 2024',
    url: '#'
  },
  {
    id: '4',
    name: 'proposal_new_product_idoe.docx',
    type: 'document',
    size: 3200000,
    date: 'Apr 10, 2024',
    url: '#'
  },
  {
    id: '5',
    name: 'sunset_beach_20241025.jpg',
    type: 'image',
    size: 2200000,
    date: 'Apr 10, 2024',
    url: '#'
  }
])

const categories = ref([
  { type: 'all', name: 'All Files', icon: File, count: 42 },
  { type: 'document', name: 'Documents', icon: FileText, count: 15 },
  { type: 'image', name: 'Images', icon: Image, count: 28 },
  { type: 'video', name: 'Videos', icon: Video, count: 8 },
  { type: 'audio', name: 'Audio', icon: Music, count: 12 },
  { type: 'archive', name: 'ZIP Files', icon: Archive, count: 5 }
])

const storageBreakdown = ref<StorageItem[]>([
  { type: 'document', name: 'Documents', size: 112800000, count: 42 },
  { type: 'image', name: 'Images', size: 286800000, count: 75 },
  { type: 'video', name: 'Videos', size: 639200000, count: 32 },
  { type: 'audio', name: 'Audio', size: 23600000, count: 20 },
  { type: 'archive', name: 'ZIP', size: 213300000, count: 14 }
])

const recentFiles = ref<FileItem[]>([
  { id: '6', name: 'social_media_report_20241025.docx', type: 'document', size: 1800000, date: 'Today' },
  { id: '7', name: 'HR_meeting_notes_20241025.docx', type: 'document', size: 950000, date: 'Today' },
  { id: '8', name: 'rebrand_mockup_v2_2024102.png', type: 'image', size: 3200000, date: 'Yesterday' }
])

// Computed properties
const usedStorage = computed(() =>
  storageBreakdown.value.reduce((sum, item) => sum + item.size, 0)
)

const totalStorage = 256 * 1024 * 1024 * 1024 // 256 GB in bytes

const storagePercentage = computed(() =>
  Math.round((usedStorage.value / totalStorage) * 100)
)

const filteredFiles = computed(() => {
  let filtered = files.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(file => file.type === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(file =>
      file.name.toLowerCase().includes(query)
    )
  }

  // Sort files
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const formatStorage = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const getFileIcon = (fileType: string) => {
  const iconMap: { [key: string]: any } = {
    document: FileText,
    image: Image,
    video: Video,
    audio: Music,
    archive: Archive
  }
  return iconMap[fileType] || File
}

const isImage = (file: FileItem | null) => {
  return file?.type === 'image'
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    processFiles(target.files)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files) {
    processFiles(event.dataTransfer.files)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const processFiles = (fileList: FileList) => {
  // Here you would typically upload files to your server
  ElMessage.success(`Selected ${fileList.length} file(s) for upload`)

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const downloadFile = (file: FileItem) => {
  ElMessage.info(`Downloading ${file.name}`)
  // Implement download logic
}

const previewFile = (file: FileItem) => {
  previewFileData.value = file
  showPreview.value = true
}

const deleteFile = async (file: FileItem) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${file.name}"?`,
      'Delete File',
      { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }
    )

    files.value = files.value.filter(f => f.id !== file.id)
    ElMessage.success('File deleted successfully')
  } catch {
    // User cancelled
  }
}

onMounted(() => {
  // Load initial data if needed
})
</script>

<style scoped>
.media-upload-container {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
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

.main-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: calc(100vh - 50px);
  overflow-y: auto;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 16px 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: var(--el-color-primary-light-9);
}

.category-item.active {
  background: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}

.category-icon {
  width: 20px;
  height: 20px;
}

.category-name {
  flex: 1;
  font-size: 14px;
}

.file-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  padding: 2px 8px;
  border-radius: 12px;
}

.storage-info {
  background: var(--el-bg-color);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
}

.storage-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.storage-used {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.storage-total {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.storage-progress {
  margin-bottom: 16px;
}

.storage-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.storage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.storage-type {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.type-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.type-size {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.storage-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.recent-item:hover {
  background: var(--el-fill-color-light);
}

.file-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  color: var(--el-color-primary);
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-area {
  border: 2px dashed var(--el-border-color);
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--el-bg-color);
  cursor: pointer;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: var(--el-color-primary);
}

.upload-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.upload-subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.file-list-section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--el-border-color-lighter);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.file-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-card:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow-light);
}

.file-preview {
  position: relative;
  margin-bottom: 12px;
}

.file-icon-large {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  color: var(--el-color-primary);
  margin: 0 auto;
}

.file-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-card:hover .file-actions {
  opacity: 1;
}

.file-details {
  text-align: center;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--el-text-color-secondary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: var(--el-text-color-placeholder);
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
}

.preview-placeholder {
  text-align: center;
  color: var(--el-text-color-secondary);
}

.preview-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: var(--el-text-color-placeholder);
}

.mr-2 {
  margin-right: 8px;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }

  .content-area {
    order: 1;
  }
}

@media (max-width: 768px) {
  .media-upload-container {
    padding: 16px;
  }

  .header-section {
    flex-direction: column;
    gap: 16px;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .section-actions {
    justify-content: space-between;
  }

  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
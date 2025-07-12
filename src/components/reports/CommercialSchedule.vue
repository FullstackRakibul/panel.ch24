<template>
  <div class="commercial-schedule">
    <div class="report-header">
      <div class="header-left">
        <h2>Commercial Transmission Schedule</h2>
        <p>Daily program schedule with advertisements</p>
      </div>
      <div class="header-actions">
        <el-date-picker v-model="selectedDate" type="date" placeholder="Select date" format="DD MMM, YYYY"
          value-format="YYYY-MM-DD" @change="handleDateChange" />
        <el-button type="primary" :icon="Download" @click="exportSchedule">
          Export
        </el-button>
      </div>
    </div>

    <!-- Schedule Summary -->
    <div class="summary-cards">
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ totalSpots }}</div>
          <div class="summary-label">Total Spots</div>
        </div>
      </el-card>
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ totalDuration }}</div>
          <div class="summary-label">Total Duration (min)</div>
        </div>
      </el-card>
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ paidSpots }}</div>
          <div class="summary-label">Paid Spots</div>
        </div>
      </el-card>
      <el-card class="summary-card">
        <div class="summary-content">
          <div class="summary-value">{{ brandingSpots }}</div>
          <div class="summary-label">Branding Spots</div>
        </div>
      </el-card>
    </div>

    <!-- Schedule Table -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>Schedule for {{ formatDate(selectedDate) }}</span>
          <el-input v-model="searchText" placeholder="Search by program or agency" :prefix-icon="Search"
            style="width: 300px" />
        </div>
      </template>

      <el-table :data="filteredScheduleData" stripe :loading="loading" empty-text="No schedule found for selected date"
        class="schedule-table" :row-class-name="getRowClassName">
        <el-table-column prop="time" label="Time" width="100" fixed="left" />
        <el-table-column prop="program" label="Program" width="200" />
        <el-table-column prop="segment" label="Segment" width="150" />
        <el-table-column prop="adType" label="Ad Type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.adType === 'Paid' ? 'success' : 'info'">
              {{ row.adType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="agency" label="Agency" width="180" />
        <el-table-column prop="advertiser" label="Advertiser" width="180" />
        <el-table-column prop="product" label="Product/Brand" width="200" />
        <el-table-column prop="duration" label="Duration (sec)" width="120" align="center" />
        <el-table-column prop="category" label="Category" width="100" align="center" />
        <el-table-column prop="contractNo" label="Contract No" width="120" />
        <el-table-column prop="rate" label="Rate (Tk.)" width="120" align="right">
          <template #default="{ row }">
            {{ row.rate ? formatCurrency(row.rate) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="Remarks" width="200" />
        <el-table-column prop="status" label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add Schedule Item Dialog -->
    <el-dialog v-model="showAddDialog" title="Add Schedule Item" width="600px">
      <el-form :model="newScheduleItem" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Time">
              <el-time-picker v-model="newScheduleItem.time" format="HH:mm" value-format="HH:mm"
                placeholder="Select time" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Program">
              <el-input v-model="newScheduleItem.program" placeholder="Enter program name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Segment">
              <el-input v-model="newScheduleItem.segment" placeholder="Enter segment" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ad Type">
              <el-select v-model="newScheduleItem.adType" placeholder="Select ad type">
                <el-option label="Paid" value="Paid" />
                <el-option label="Branding" value="Branding" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Agency">
              <el-input v-model="newScheduleItem.agency" placeholder="Enter agency name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Advertiser">
              <el-input v-model="newScheduleItem.advertiser" placeholder="Enter advertiser" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Product/Brand">
              <el-input v-model="newScheduleItem.product" placeholder="Enter product/brand" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Duration (seconds)">
              <el-input-number v-model="newScheduleItem.duration" :min="1" :max="300" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Category">
              <el-select v-model="newScheduleItem.category" placeholder="Select category">
                <el-option label="Banking" value="Banking" />
                <el-option label="FMCG" value="FMCG" />
                <el-option label="Industrial" value="Industrial" />
                <el-option label="Telecom" value="Telecom" />
                <el-option label="Automotive" value="Automotive" />
                <el-option label="Branding" value="Branding" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Contract No">
              <el-input v-model="newScheduleItem.contractNo" placeholder="Enter contract number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Rate (Tk.)">
              <el-input-number v-model="newScheduleItem.rate" :min="0" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Status">
              <el-select v-model="newScheduleItem.status" placeholder="Select status">
                <el-option label="Scheduled" value="Scheduled" />
                <el-option label="Aired" value="Aired" />
                <el-option label="Cancelled" value="Cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Remarks">
          <el-input v-model="newScheduleItem.remarks" type="textarea" :rows="2" placeholder="Enter remarks" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addScheduleItem">Add Item</el-button>
      </template>
    </el-dialog>

    <!-- Floating Action Button -->
    <el-button type="primary" :icon="Plus" circle size="large" class="fab" @click="showAddDialog = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface ScheduleItem {
  time: string
  program: string
  segment: string
  adType: 'Paid' | 'Branding'
  agency: string
  advertiser: string
  product: string
  duration: number
  category: string
  contractNo: string
  rate: number | null
  remarks: string
  status: 'Aired' | 'Scheduled' | 'Cancelled'
}

const loading = ref(false)
const searchText = ref('')
const selectedDate = ref('2025-07-04')
const showAddDialog = ref(false)

const newScheduleItem = ref<ScheduleItem>({
  time: '',
  program: '',
  segment: '',
  adType: 'Paid',
  agency: '',
  advertiser: '',
  product: '',
  duration: 30,
  category: '',
  contractNo: '',
  rate: null,
  remarks: '',
  status: 'Scheduled'
})

const scheduleData = ref<ScheduleItem[]>([
  {
    time: '06:00',
    program: 'Business24',
    segment: 'Morning News',
    adType: 'Paid',
    agency: 'Mediacom',
    advertiser: 'Mercantile Bank PLC',
    product: 'Business Banking',
    duration: 30,
    category: 'Banking',
    contractNo: 'TML2506039',
    rate: 15000,
    remarks: 'Title Sting With Sponsor Logo',
    status: 'Aired'
  },
  {
    time: '06:30',
    program: 'Business24',
    segment: 'Market Update',
    adType: 'Branding',
    agency: 'Channel 24',
    advertiser: 'Channel 24',
    product: 'Channel Branding',
    duration: 15,
    category: 'Branding',
    contractNo: '',
    rate: null,
    remarks: 'Channel Ident',
    status: 'Aired'
  },
  {
    time: '07:00',
    program: 'Business24',
    segment: 'Business News',
    adType: 'Paid',
    agency: 'Grey Advertising',
    advertiser: 'ABC Corporation',
    product: 'ABC Products',
    duration: 45,
    category: 'FMCG',
    contractNo: 'TML2506040',
    rate: 25000,
    remarks: 'Product Commercial',
    status: 'Aired'
  },
  {
    time: '07:30',
    program: 'Business24',
    segment: 'Stock Market',
    adType: 'Paid',
    agency: 'Ogilvy',
    advertiser: 'XYZ Industries',
    product: 'Industrial Solutions',
    duration: 30,
    category: 'Industrial',
    contractNo: 'TML2506041',
    rate: 18000,
    remarks: 'Corporate TVC',
    status: 'Scheduled'
  },
  {
    time: '08:00',
    program: 'Business24',
    segment: 'Economic Analysis',
    adType: 'Branding',
    agency: 'Channel 24',
    advertiser: 'Channel 24',
    product: 'Program Branding',
    duration: 10,
    category: 'Branding',
    contractNo: '',
    rate: null,
    remarks: 'Program Logo',
    status: 'Scheduled'
  },
  {
    time: '08:30',
    program: 'Business24',
    segment: 'Corporate News',
    adType: 'Paid',
    agency: 'McCann',
    advertiser: 'Tech Solutions Ltd',
    product: 'Software Services',
    duration: 60,
    category: 'Technology',
    contractNo: 'TML2506042',
    rate: 35000,
    remarks: 'Technology showcase',
    status: 'Scheduled'
  }
])

const filteredScheduleData = computed(() => {
  if (!searchText.value) return scheduleData.value

  const search = searchText.value.toLowerCase()
  return scheduleData.value.filter(item =>
    item.program.toLowerCase().includes(search) ||
    item.agency.toLowerCase().includes(search) ||
    item.advertiser.toLowerCase().includes(search) ||
    item.product.toLowerCase().includes(search)
  )
})

const totalSpots = computed(() => scheduleData.value.length)

const totalDuration = computed(() => {
  return Math.round(scheduleData.value.reduce((sum, item) => sum + item.duration, 0) / 60 * 10) / 10
})

const paidSpots = computed(() => {
  return scheduleData.value.filter(item => item.adType === 'Paid').length
})

const brandingSpots = computed(() => {
  return scheduleData.value.filter(item => item.adType === 'Branding').length
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusType = (status: string) => {
  switch (status.toLowerCase()) {
    case 'aired': return 'success'
    case 'scheduled': return 'warning'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}

const getRowClassName = ({ row }: { row: ScheduleItem }) => {
  if (row.adType === 'Branding') return 'branding-row'
  if (row.status === 'Cancelled') return 'cancelled-row'
  return ''
}

const handleDateChange = (date: string) => {
  console.log('Selected date:', date)
  // Here you would typically fetch schedule data for the selected date
  loadScheduleForDate(date)
}

const loadScheduleForDate = async (date: string) => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In a real app, you would fetch data from your API
    ElMessage.success(`Schedule loaded for ${formatDate(date)}`)
  } catch (error) {
    ElMessage.error('Failed to load schedule')
  } finally {
    loading.value = false
  }
}

const exportSchedule = async () => {
  loading.value = true
  try {
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500))
    const filename = `commercial_schedule_${selectedDate.value}.xlsx`
    ElMessage.success(`Schedule exported as ${filename}`)
  } catch (error) {
    ElMessage.error('Failed to export schedule')
  } finally {
    loading.value = false
  }
}

const addScheduleItem = () => {
  if (!newScheduleItem.value.time || !newScheduleItem.value.program) {
    ElMessage.warning('Please fill in required fields')
    return
  }

  scheduleData.value.push({ ...newScheduleItem.value })
  scheduleData.value.sort((a, b) => a.time.localeCompare(b.time))

  // Reset form
  newScheduleItem.value = {
    time: '',
    program: '',
    segment: '',
    adType: 'Paid',
    agency: '',
    advertiser: '',
    product: '',
    duration: 30,
    category: '',
    contractNo: '',
    rate: null,
    remarks: '',
    status: 'Scheduled'
  }

  showAddDialog.value = false
  ElMessage.success('Schedule item added successfully')
}

onMounted(() => {
  loadScheduleForDate(selectedDate.value)
})
</script>

<style scoped>
.commercial-schedule {
  padding: 24px;
  position: relative;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
}

.header-left p {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  height: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.summary-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.summary-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.summary-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.table-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.schedule-table {
  font-size: 14px;
}

:deep(.branding-row) {
  background-color: var(--el-color-info-light-9);
}

:deep(.cancelled-row) {
  background-color: var(--el-color-danger-light-9);
  opacity: 0.7;
}

:deep(.el-table th) {
  background: var(--el-fill-color-light);
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: var(--el-fill-color-lighter);
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fab:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .commercial-schedule {
    padding: 16px;
  }

  .report-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .fab {
    bottom: 16px;
    right: 16px;
  }
}
</style>
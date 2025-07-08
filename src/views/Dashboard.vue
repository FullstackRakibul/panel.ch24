<template>
  <div class="dashboard-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>
      <el-select v-model="selectedPeriod" @change="fetchData" class="period-select">
        <el-option label="This Month" value="month" />
        <el-option label="This Quarter" value="quarter" />
        <el-option label="This Year" value="year" />
      </el-select>
    </div>

    <!-- KPI Cards -->
    <el-row :gutter="24" class="kpi-section">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="kpi-card" shadow="hover" @click="navigateToInvoices">
          <div class="kpi-content">
            <div class="kpi-icon invoices">
              <el-icon size="24">
                <Document />
              </el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">{{ dashboardStore.stats.totalInvoices.toLocaleString() }}</div>
              <div class="kpi-label">Total Invoices</div>
              <div class="kpi-change positive">+12% from last month</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="kpi-card" shadow="hover" @click="navigateToReports">
          <div class="kpi-content">
            <div class="kpi-icon revenue">
              <el-icon size="24">
                <Money />
              </el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">৳{{ dashboardStore.stats.totalRevenue.toLocaleString() }}</div>
              <div class="kpi-label">Total Revenue</div>
              <div class="kpi-change positive">+8.2% from last month</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="kpi-card" shadow="hover" @click="navigateToPayments">
          <div class="kpi-content">
            <div class="kpi-icon due">
              <el-icon size="24">
                <Clock />
              </el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">৳{{ dashboardStore.stats.totalDue.toLocaleString() }}</div>
              <div class="kpi-label">Amount Due</div>
              <div class="kpi-change negative">-3.1% from last month</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="kpi-card" shadow="hover" @click="navigateToPayments">
          <div class="kpi-content">
            <div class="kpi-icon paid">
              <el-icon size="24">
                <CircleCheck />
              </el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-value">৳{{ dashboardStore.stats.totalPaid.toLocaleString() }}</div>
              <div class="kpi-label">Paid Amount</div>
              <div class="kpi-change positive">+15.3% from last month</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Section -->
    <el-row :gutter="24" class="charts-section">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Monthly Revenue</h3>
              <el-button type="primary" link size="small">View Details</el-button>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="revenueChart" height="300"></canvas>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Top Clients</h3>
              <el-button type="primary" link size="small">View All</el-button>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="clientsChart" height="300"></canvas>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Revenue by Agency -->
    <el-row class="agency-section">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Revenue by Agency</h3>
              <div class="chart-actions">
                <el-button type="primary" link size="small">Export Data</el-button>
                <el-button type="primary" link size="small">View Report</el-button>
              </div>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="agencyChart" height="300"></canvas>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Activity -->
    <el-row class="activity-section">
      <el-col :span="24">
        <el-card class="activity-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Recent Activity</h3>
              <el-button type="primary" link size="small">View All</el-button>
            </div>
          </template>
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon">
                <el-icon :size="16">
                  <component :is="activity.icon" />
                </el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-description">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <el-button type="primary" link size="small">View</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import {
  Document,
  Money,
  Clock,
  CircleCheck,
  ArrowUp,
  User,
  OfficeBuilding
} from '@element-plus/icons-vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const router = useRouter()
const dashboardStore = useDashboardStore()

const selectedPeriod = ref('month')
const revenueChart = ref<HTMLCanvasElement>()
const clientsChart = ref<HTMLCanvasElement>()
const agencyChart = ref<HTMLCanvasElement>()

const recentActivities = ref([
  {
    id: 1,
    description: 'New invoice #INV-001 created for ABC Corp',
    time: '2 minutes ago',
    icon: Document
  },
  {
    id: 2,
    description: 'Payment received from XYZ Agency',
    time: '1 hour ago',
    icon: Money
  },
  {
    id: 3,
    description: 'New client "Tech Solutions" added',
    time: '3 hours ago',
    icon: User
  },
  {
    id: 4,
    description: 'Monthly report generated successfully',
    time: '5 hours ago',
    icon: ArrowUp
  }
])

const navigateToInvoices = () => router.push('/invoices')
const navigateToReports = () => router.push('/reports')
const navigateToPayments = () => router.push('/payments')

const fetchData = async () => {
  await dashboardStore.fetchDashboardData()
  await nextTick()
  initializeCharts()
}

const initializeCharts = () => {
  // Revenue Chart
  if (revenueChart.value) {
    new Chart(revenueChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '৳' + value.toLocaleString()
              }
            }
          }
        }
      }
    })
  }

  // Top Clients Chart
  if (clientsChart.value) {
    new Chart(clientsChart.value, {
      type: 'doughnut',
      data: {
        labels: ['ABC Corp', 'XYZ Agency', 'Tech Solutions', 'Media Group', 'Others'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#6b7280'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }

  // Agency Revenue Chart
  if (agencyChart.value) {
    new Chart(agencyChart.value, {
      type: 'bar',
      data: {
        labels: ['Creative Agency', 'Media Partners', 'Digital Solutions', 'Brand Masters', 'Ad Experts'],
        datasets: [{
          label: 'Revenue',
          data: [45000, 38000, 32000, 28000, 22000],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '৳' + value.toLocaleString()
              }
            }
          }
        }
      }
    })
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.page-header {
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

.period-select {
  width: 160px;
}

.kpi-section {
  margin-bottom: 32px;
}

.kpi-card {
  cursor: pointer;
  transition: all 0.3s ease;
  --el-card-padding: 24px;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow-dark);
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon.invoices {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.kpi-icon.revenue {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.kpi-icon.due {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.kpi-icon.paid {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.kpi-info {
  flex: 1;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.2;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.kpi-change {
  font-size: 12px;
  font-weight: 500;
}

.kpi-change.positive {
  color: var(--el-color-success);
}

.kpi-change.negative {
  color: var(--el-color-danger);
}

.charts-section {
  margin-bottom: 32px;
}

.agency-section {
  margin-bottom: 32px;
}

.activity-section {
  margin-bottom: 32px;
}

.chart-card {
  --el-card-padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.activity-card {
  --el-card-padding: 24px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: var(--el-fill-color-lighter);
  transition: background-color 0.2s;
}

.activity-item:hover {
  background: var(--el-fill-color-light);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-description {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .kpi-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
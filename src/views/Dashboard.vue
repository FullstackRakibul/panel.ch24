<template>
  <div class="dashboard-container">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>
      <div class="header-actions">
        <el-select v-model="selectedPeriod" @change="fetchData" class="period-select">
          <el-option label="This Month" value="month" />
          <el-option label="This Quarter" value="quarter" />
          <el-option label="This Year" value="year" />
        </el-select>
        <el-button type="primary" link size="small" class="hidden sm:block">Export Report</el-button>
      </div>
    </div>

    <el-row :gutter="20" class="kpi-grid mb-8">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToReports">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Total Income <span class="kpi-period text-green-600">This month</span></span>
              <div class="kpi-icon bg-green-100 text-green-600">
                <el-icon size="20">
                  <Money />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-green-700">৳{{ (dashboardStore.stats.totalIncome || 200500).toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500">Total income of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToReports">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Total Expenses <span class="kpi-period text-red-600">This month</span></span>
              <div class="kpi-icon bg-red-100 text-red-600">
                <el-icon size="20">
                  <ShoppingCart />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-red-700">৳{{ (dashboardStore.stats.totalExpenses || 62352).toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500">Total expense of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToReports">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Net Profit <span class="kpi-period text-blue-600">This month</span></span>
              <div class="kpi-icon bg-blue-100 text-blue-600">
                <el-icon size="20">
                  <Top />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-blue-700">৳{{ (dashboardStore.stats.netProfit || 138148).toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500">Total net profit of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToInvoices">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Outstanding Invoices <span class="kpi-period text-purple-600">This
                  month</span></span>
              <div class="kpi-icon bg-purple-100 text-purple-600">
                <el-icon size="20">
                  <Document />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-purple-700">৳{{ (dashboardStore.stats.outstandingInvoices ||
              200500).toLocaleString() }}</div>
            <div class="text-sm text-gray-500">Outstanding invoices of this month</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToPayments">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Upcoming Payments <span class="kpi-period text-indigo-600">This
                  month</span></span>
              <div class="kpi-icon bg-indigo-100 text-indigo-600">
                <el-icon size="20">
                  <Clock />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-indigo-700">৳{{ (dashboardStore.stats.upcomingPayments ||
              150352).toLocaleString() }}</div>
            <div class="text-sm text-gray-500">Upcoming payment of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToPayments">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Overdues Amounts <span class="kpi-period text-orange-600">This month</span></span>
              <div class="kpi-icon bg-orange-100 text-orange-600">
                <el-icon size="20">
                  <Warning />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-orange-700">৳{{ (dashboardStore.stats.overduesAmounts || 80550).toLocaleString()
              }}</div>
            <div class="text-sm text-gray-500">Overdues amount of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToSubscription">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Total Subscription</span>
              <div class="kpi-icon bg-blue-100 text-blue-600">
                <el-icon size="20">
                  <User />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-blue-700">{{ (dashboardStore.stats.totalSubscription || 1255).toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500">All time subscription user</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToSubscription">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Active/Inactive Subscription <span class="text-red-600">275</span></span>
              <div class="kpi-icon bg-purple-100 text-purple-600">
                <el-icon size="20">
                  <User />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-purple-700">{{ (dashboardStore.stats.activeSubscription || 980).toLocaleString()
              }}</div>
            <div class="text-sm text-gray-500">Active & inactive subscription users</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToLeads">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">New Leads <span class="kpi-period text-teal-600">This month</span></span>
              <div class="kpi-icon bg-teal-100 text-teal-600">
                <el-icon size="20">
                  <Plus />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-teal-700">{{ (dashboardStore.stats.newLeads || 200).toLocaleString() }}</div>
            <div class="text-sm text-gray-500">New leads of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToProjects">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Ongoing / Overdue Projects <span class="text-red-600">50</span></span>
              <div class="kpi-icon bg-yellow-100 text-yellow-600">
                <el-icon size="20">
                  <FolderOpened />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-yellow-700">{{ (dashboardStore.stats.ongoingProjects || 20).toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500">Total ongoing & overdue projects</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToSubscription">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Subscription Expiring Soon</span>
              <div class="kpi-icon bg-orange-100 text-orange-600">
                <el-icon size="20">
                  <Calendar />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-orange-700">{{ (dashboardStore.stats.subscriptionExpiringSoon ||
              780).toLocaleString() }}</div>
            <div class="text-sm text-gray-500">Subscription expiring of this month</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5">
        <el-card class="kpi-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl"
          @click="navigateToTickets">
          <div class="kpi-content">
            <div class="kpi-header">
              <span class="kpi-label">Open / Pending Tickets <span class="text-blue-600">145</span></span>
              <div class="kpi-icon bg-red-100 text-red-600">
                <el-icon size="20">
                  <Ticket />
                </el-icon>
              </div>
            </div>
            <div class="kpi-value text-red-700">{{ (dashboardStore.stats.openTickets || 220).toLocaleString() }}</div>
            <div class="text-sm text-gray-500">Total open & pending tickets</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card mb-8 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
      <template #header>
        <div class="chart-header">
          <h3 class="chart-title">Monthly Wise Invoice Reports</h3>
          <div class="chart-actions">
            <el-select v-model="selectedReportPeriod" size="small" class="w-[120px]">
              <el-option label="Last 12 Months" value="12month" />
              <el-option label="Last 6 Months" value="6month" />
            </el-select>
            <el-button type="primary" link size="small">Export</el-button>
          </div>
        </div>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        <div class="report-summary-item">
          <div class="text-sm font-medium text-gray-600">Total Generated</div>
          <div class="text-lg font-bold text-blue-700">৳{{ (dashboardStore.stats.totalGeneratedInvoices ||
            124500).toLocaleString() }}</div>
        </div>
        <div class="report-summary-item">
          <div class="text-sm font-medium text-gray-600">Total Paid</div>
          <div class="text-lg font-bold text-green-700">৳{{ (dashboardStore.stats.totalPaidInvoices ||
            105750).toLocaleString() }}</div>
        </div>
        <div class="report-summary-item">
          <div class="text-sm font-medium text-gray-600">Total Due</div>
          <div class="text-lg font-bold text-orange-700">৳{{ (dashboardStore.stats.totalDueInvoices ||
            15750).toLocaleString()
            }}</div>
        </div>
        <div class="report-summary-item">
          <div class="text-sm font-medium text-gray-600">Total Cancelled</div>
          <div class="text-lg font-bold text-red-700">৳{{ (dashboardStore.stats.totalCancelledInvoices ||
            10000).toLocaleString() }}</div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="charts-section mb-8">
      <el-col :xs="24" :lg="12" class="mb-5">
        <el-card class="chart-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Monthly Revenue</h3>
              <el-button type="primary" link size="small" @click="navigateToReports">View Details</el-button>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="revenueChart"></canvas>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12" class="mb-5">
        <el-card class="chart-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Top Clients</h3>
              <el-button type="primary" link size="small" @click="navigateToClients">View All</el-button>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="clientsChart"></canvas>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="agency-section mb-8">
      <el-col :span="24">
        <el-card class="chart-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Revenue by Agency</h3>
              <div class="chart-actions">
                <el-button type="primary" link size="small">Export Data</el-button>
                <el-button type="primary" link size="small" @click="navigateToReports">View Report</el-button>
              </div>
            </div>
          </template>
          <div class="chart-container">
            <canvas ref="agencyChart"></canvas>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="activity-section mb-8">
      <el-col :span="24">
        <el-card class="activity-card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">Recent Activity</h3>
              <el-button type="primary" link size="small" @click="navigateToActivityLog">View All</el-button>
            </div>
          </template>
          <div class="activity-list mt-4">
            <div v-for="activity in recentActivities" :key="activity.id"
              class="activity-item bg-gray-50 hover:bg-gray-100 rounded-lg p-4 flex items-center gap-4 transition-colors duration-200">
              <div class="activity-icon rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                <el-icon :size="18">
                  <component :is="activity.icon" />
                </el-icon>
              </div>
              <div class="activity-content flex-grow">
                <div class="activity-description text-sm font-medium text-gray-800">{{ activity.description }}</div>
                <div class="activity-time text-xs text-gray-500">{{ activity.time }}</div>
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
import { useDashboardStore } from '../stores/dashboard'
import {
  Document,
  Money,
  Clock,
  CircleCheck,
  ArrowUp,
  User,
  OfficeBuilding,
  ShoppingCart, // For Total Expenses
  Top, // Replaced TrendingUp for Net Profit
  Warning, // Replaced CircleOff for Overdues Amounts
  Plus, // Replaced UserPlus for New Leads
  FolderOpened, // Replaced FolderDot for Ongoing/Overdue Projects
  Calendar, // Replaced CalendarClock for Subscription Expiring Soon
  Ticket // Kept Ticket as it seems available and suitable for tickets
} from '@element-plus/icons-vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const router = useRouter()
const dashboardStore = useDashboardStore()

const selectedPeriod = ref('month')
const selectedReportPeriod = ref('12month') // New period selector for invoice reports
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
    icon: ArrowUp // Using ArrowUp as a general trend/report icon
  }
])

// Navigation functions
const navigateToInvoices = () => router.push('/invoices')
const navigateToReports = () => router.push('/reports')
const navigateToPayments = () => router.push('/payments')
// New navigation placeholders for new KPIs
const navigateToSubscription = () => router.push('/subscriptions')
const navigateToLeads = () => router.push('/leads')
const navigateToProjects = () => router.push('/projects')
const navigateToTickets = () => router.push('/tickets')
const navigateToClients = () => router.push('/clients')
const navigateToActivityLog = () => router.push('/activity-log')

const fetchData = async () => {
  await dashboardStore.fetchDashboardData()
  await nextTick()
  initializeCharts()
}

const initializeCharts = () => {
  // Revenue Chart
  if (revenueChart.value) {
    // Destroy existing chart instance to prevent duplicates if fetchData is called multiple times
    if ((revenueChart.value as any).chart) {
      (revenueChart.value as any).chart.destroy();
    }
    const ctx = revenueChart.value.getContext('2d');
    if (ctx) {
      (revenueChart.value as any).chart = new Chart(ctx, { // Storing chart instance on the ref
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
      });
    }
  }

  // Top Clients Chart
  if (clientsChart.value) {
    if ((clientsChart.value as any).chart) {
      (clientsChart.value as any).chart.destroy();
    }
    const ctx = clientsChart.value.getContext('2d');
    if (ctx) {
      (clientsChart.value as any).chart = new Chart(ctx, {
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
      });
    }
  }

  // Agency Revenue Chart
  if (agencyChart.value) {
    if ((agencyChart.value as any).chart) {
      (agencyChart.value as any).chart.destroy();
    }
    const ctx = agencyChart.value.getContext('2d');
    if (ctx) {
      (agencyChart.value as any).chart = new Chart(ctx, {
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
      });
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Updated Styling for a more modern and minimalist look based on image_0e7299.jpg */
.dashboard-container {
  @apply p-6 bg-gray-50 min-h-screen;
  /* Lighter background, more padding */
}

.page-header {
  @apply flex justify-between items-center mb-8 flex-wrap gap-4;
  /* Adjusted margin, added flex-wrap */
}

.header-content {
  @apply flex-1;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
  /* Slightly larger, bolder title */
}

.page-subtitle {
  @apply text-base text-gray-600;
  /* Slightly larger subtitle */
}

.header-actions {
  @apply flex items-center gap-4;
  /* Space between select and button */
}

.period-select {
  @apply w-[160px];
}

/* --- New KPI Grid Styling --- */
.kpi-grid {
  @apply -mx-2.5;
  /* Counteracts gutter for full width on small screens */
}

.kpi-card {
  @apply rounded-xl border border-gray-100 p-5;
  /* Clean border, more padding */
  --el-card-padding: 0px;
  /* Override Element Plus default padding for internal control */
  transition: all 0.2s ease-in-out;
  /* Smooth transition for hover */
}

.kpi-card:hover {
  @apply transform -translate-y-1 shadow-lg;
  /* Lift and deeper shadow on hover */
}

.kpi-content {
  @apply flex flex-col gap-3;
  /* Vertical layout with spacing */
}

.kpi-header {
  @apply flex justify-between items-start mb-2;
}

.kpi-label {
  @apply text-sm font-medium text-gray-600;
}

.kpi-period {
  @apply ml-1 text-xs font-semibold;
  /* Smaller, bolder period text */
}

.kpi-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0;
  /* Specific colors handled inline in template */
}

.kpi-value {
  @apply text-2xl font-bold leading-tight;
  /* Larger, bolder value */
  /* Specific colors handled inline in template */
}

/* --- Monthly Wise Invoice Reports Styling --- */
.report-summary-item {
  @apply p-4 rounded-lg bg-gray-50 flex flex-col items-start;
}

/* --- Charts and Activity Card Styling Refinements --- */
.chart-card {
  @apply rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300;
  --el-card-padding: 0px;
  /* Reset padding to control internally */
}

.chart-card :deep(.el-card__header) {
  @apply py-4 px-6 border-b border-gray-100;
  /* Header padding */
}

.chart-card :deep(.el-card__body) {
  @apply p-6;
  /* Body padding */
}

.chart-header {
  @apply flex justify-between items-center;
}

.chart-title {
  @apply text-lg font-semibold text-gray-900 m-0;
}

.chart-actions {
  @apply flex gap-3;
}

.chart-container {
  @apply h-[300px] w-full;
  /* Ensure full width for responsiveness */
}

.activity-card {
  @apply rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300;
  --el-card-padding: 0px;
}

.activity-card :deep(.el-card__header) {
  @apply py-4 px-6 border-b border-gray-100;
}

.activity-card :deep(.el-card__body) {
  @apply p-6;
}

.activity-list {
  @apply mt-0;
  /* Removed default margin from template, relying on card body padding */
}

.activity-item {
  @apply flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200;
}

.activity-icon {
  @apply w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0;
}

.activity-description {
  @apply text-sm font-medium text-gray-800;
}

.activity-time {
  @apply text-xs text-gray-500;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .page-header {
    @apply flex-col items-start;
  }

  .header-actions {
    @apply w-full justify-between;
  }

  .period-select {
    @apply flex-grow;
  }

  .charts-section .el-col,
  .kpi-grid .el-col {
    @apply mb-4;
    /* Add bottom margin for columns on small screens */
  }

  .activity-item {
    @apply flex-col items-start text-center;
  }
}
</style>
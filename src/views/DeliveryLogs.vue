<template>
  <div class="delivery-logs">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Delivery Logs</h1>
          <p class="page-subtitle">TV Commercial transmission tracking and verification</p>
        </div>
        <div class="header-actions">
          <el-button-group>
            <el-button type="primary" :icon="Plus" @click="showAddDialog = true">
              Add Log
            </el-button>
            <el-button :icon="Upload" @click="showImportDialog = true">
              Import
            </el-button>
            <el-button :icon="Download" @click="exportLogs">
              Export
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon total">
                <el-icon>
                  <VideoPlay />
                </el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">Total Ads</div>
                <div class="card-amount">{{ totalAds }}</div>
                <div class="card-count">Today: {{ todayAds }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon revenue">
                <el-icon>
                  <Coin />
                </el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">Total Revenue</div>
                <div class="card-amount">{{ formatCurrency(totalRevenue) }}</div>
                <div class="card-count">Today: {{ formatCurrency(todayRevenue) }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon duration">
                <el-icon>
                  <Timer />
                </el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">Total Duration</div>
                <div class="card-amount">{{ totalDuration }}s</div>
                <div class="card-count">{{ Math.round(totalDuration / 60) }} minutes</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="summary-card">
            <div class="card-content">
              <div class="card-icon incomplete">
                <el-icon>
                  <Warning />
                </el-icon>
              </div>
              <div class="card-info">
                <div class="card-title">Incomplete Ads</div>
                <div class="card-amount">{{ incompleteAds }}</div>
                <div class="card-count">{{ ((incompleteAds / totalAds) * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Filters -->
    <el-card class="filter-card" shadow="never">
      <div class="filters-container">
        <el-row :gutter="16">
          <el-col :span="4">
            <el-date-picker v-model="filters.dateRange" type="daterange" range-separator="To"
              start-placeholder="Start date" end-placeholder="End date" format="DD MMM, YYYY" value-format="YYYY-MM-DD"
              @change="applyFilters" />
          </el-col>
          <el-col :span="3">
            <el-input v-model="filters.company" placeholder="Search company" :prefix-icon="Search" clearable
              @input="applyFilters" />
          </el-col>
          <el-col :span="3">
            <el-select v-model="filters.adType" placeholder="Ad Type" clearable @change="applyFilters">
              <el-option label="All Types" value="" />
              <el-option label="TVC" value="TVC" />
              <el-option label="L-Shape" value="L-Shape" />
              <el-option label="Aston" value="Aston" />
              <el-option label="Ticker" value="Ticker" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="filters.peakTime" placeholder="Peak/Off-peak" clearable @change="applyFilters">
              <el-option label="All Times" value="" />
              <el-option label="Peak" value="Peak" />
              <el-option label="Off-peak" value="Off-peak" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="filters.programType" placeholder="Program Type" clearable @change="applyFilters">
              <el-option label="All Programs" value="" />
              <el-option label="Talk Show" value="Talk Show" />
              <el-option label="News" value="News" />
              <el-option label="Drama" value="Drama" />
              <el-option label="Magazine" value="Magazine" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input v-model="filters.brand" placeholder="Search brand" :prefix-icon="Search" clearable
              @input="applyFilters" />
          </el-col>
          <el-col :span="5">
            <div class="filter-actions">
              <el-button @click="clearFilters">Clear</el-button>
              <el-button type="primary" @click="applyFilters">Apply</el-button>
              <el-button :icon="Refresh" @click="refreshData">Refresh</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>Delivery Logs ({{ filteredLogs.length }} records)</span>
          <div class="table-actions">
            <el-button-group size="small">
              <el-button :type="viewMode === 'table' ? 'primary' : ''" @click="viewMode = 'table'">
                <el-icon>
                  <Grid />
                </el-icon>
              </el-button>
              <el-button :type="viewMode === 'cards' ? 'primary' : ''" @click="viewMode = 'cards'">
                <el-icon>
                  <Postcard />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>

      <!-- Table View -->
      <div v-if="viewMode === 'table'">
        <el-table :data="paginatedLogs" stripe :loading="loading" height="600" style="width: 100%"
          @sort-change="handleSortChange">
          <el-table-column prop="adDate" label="Ad Date" width="100" sortable="custom" fixed="left">
            <template #default="{ row }">
              <span class="date-text">{{ formatDate(row.adDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="telecastTime" label="Time" width="90" sortable="custom">
            <template #default="{ row }">
              <el-tag size="small" :type="getTimeTagType(row.peakOffPeak)">
                {{ row.telecastTime }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="company" label="Company" width="180" sortable="custom" />
          <el-table-column prop="adType" label="Ad Type" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="getAdTypeTagType(row.adType)" size="small">
                {{ row.adType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="adName" label="Ad Name" width="200" show-overflow-tooltip />
          <el-table-column prop="brand" label="Brand" width="150" />
          <el-table-column prop="product" label="Product" width="150" />
          <el-table-column prop="programName" label="Program" width="120" />
          <el-table-column prop="adDuration" label="Duration" width="80" align="center" sortable="custom">
            <template #default="{ row }">
              <span class="duration-text">{{ row.adDuration }}s</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="Price (BDT)" width="120" align="right" sortable="custom">
            <template #default="{ row }">
              <span class="price-text">{{ formatCurrency(row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="incompleteAd" label="Status" width="100" align="center" fixed="right">
            <template #default="{ row }">
              <el-tag :type="row.incompleteAd ? 'danger' : 'success'" size="small">
                {{ row.incompleteAd ? 'Incomplete' : 'Complete' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <el-button-group size="small">
                <el-button type="primary" :icon="View" @click="viewDetails(row)" />
                <el-button type="warning" :icon="Edit" @click="editLog(row)" />
                <el-button type="danger" :icon="Delete" @click="deleteLog(row)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- Pagination -->
        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[20, 50, 100, 200]" :total="filteredLogs.length"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>

      <!-- Cards View -->
      <div v-else class="cards-view">
        <div class="cards-grid">
          <el-card v-for="log in paginatedLogs" :key="log.id" class="log-card" shadow="hover">
            <template #header>
              <div class="card-log-header">
                <div class="log-time">
                  <el-tag :type="getTimeTagType(log.peakOffPeak)" size="small">
                    {{ log.telecastTime }}
                  </el-tag>
                  <span class="log-date">{{ formatDate(log.adDate) }}</span>
                </div>
                <el-tag :type="getAdTypeTagType(log.adType)" size="small">
                  {{ log.adType }}
                </el-tag>
              </div>
            </template>
            <div class="log-details">
              <h4 class="ad-name">{{ log.adName }}</h4>
              <p class="company-name">{{ log.company }}</p>
              <div class="log-meta">
                <div class="meta-item">
                  <span class="meta-label">Brand:</span>
                  <span class="meta-value">{{ log.brand }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Program:</span>
                  <span class="meta-value">{{ log.programName }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Duration:</span>
                  <span class="meta-value">{{ log.adDuration }}s</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Price:</span>
                  <span class="meta-value price">{{ formatCurrency(log.price) }}</span>
                </div>
              </div>
              <div class="log-status">
                <el-tag :type="log.incompleteAd ? 'danger' : 'success'" size="small">
                  {{ log.incompleteAd ? 'Incomplete' : 'Complete' }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>

        <!-- Pagination for cards -->
        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[12, 24, 48, 96]"
            :total="filteredLogs.length" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="showAddDialog" :title="editingLog ? 'Edit Delivery Log' : 'Add Delivery Log'" width="800px">
      <el-form :model="logForm" :rules="logRules" ref="logFormRef" label-position="top">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Ad Date" prop="adDate">
              <el-date-picker v-model="logForm.adDate" type="date" placeholder="Select date" format="DD MMM, YYYY"
                value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Telecast Time" prop="telecastTime">
              <el-time-picker v-model="logForm.telecastTime" format="HH:mm:ss" value-format="HH:mm:ss"
                placeholder="Select time" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Peak/Off-peak" prop="peakOffPeak">
              <el-select v-model="logForm.peakOffPeak" placeholder="Select" style="width: 100%">
                <el-option label="Peak" value="Peak" />
                <el-option label="Off-peak" value="Off-peak" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Company" prop="company">
              <el-input v-model="logForm.company" placeholder="Enter company name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Ad Type" prop="adType">
              <el-select v-model="logForm.adType" placeholder="Select" style="width: 100%">
                <el-option label="TVC" value="TVC" />
                <el-option label="L-Shape" value="L-Shape" />
                <el-option label="Aston" value="Aston" />
                <el-option label="Ticker" value="Ticker" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Duration (sec)" prop="adDuration">
              <el-input-number v-model="logForm.adDuration" :min="1" :max="300" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Ad Name" prop="adName">
              <el-input v-model="logForm.adName" placeholder="Enter ad name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Brand" prop="brand">
              <el-input v-model="logForm.brand" placeholder="Enter brand" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Sub Brand" prop="subBrand">
              <el-input v-model="logForm.subBrand" placeholder="Enter sub brand" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Product Type" prop="productType">
              <el-select v-model="logForm.productType" placeholder="Select" style="width: 100%">
                <el-option label="Beverage" value="Beverage" />
                <el-option label="Digital Services" value="Digital Services" />
                <el-option label="Banking" value="Banking" />
                <el-option label="FMCG" value="FMCG" />
                <el-option label="Telecom" value="Telecom" />
                <el-option label="Automotive" value="Automotive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Product" prop="product">
              <el-input v-model="logForm.product" placeholder="Enter product" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Program Type" prop="programType">
              <el-select v-model="logForm.programType" placeholder="Select" style="width: 100%">
                <el-option label="Talk Show" value="Talk Show" />
                <el-option label="News" value="News" />
                <el-option label="Drama" value="Drama" />
                <el-option label="Magazine" value="Magazine" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Program Name" prop="programName">
              <el-input v-model="logForm.programName" placeholder="Enter program name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Break Type" prop="breakType">
              <el-select v-model="logForm.breakType" placeholder="Select" style="width: 100%">
                <el-option label="2MB" value="2MB" />
                <el-option label="After" value="After" />
                <el-option label="Before" value="Before" />
                <el-option label="Mid" value="Mid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Price (BDT)" prop="price">
              <el-input-number v-model="logForm.price" :min="0" :precision="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Ad Quantity" prop="adQty">
              <el-input-number v-model="logForm.adQty" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Ad Position" prop="adPos">
              <el-input-number v-model="logForm.adPos" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Campaign" prop="campaign">
              <el-input v-model="logForm.campaign" placeholder="Enter campaign" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Incomplete Ad">
              <el-switch v-model="logForm.incompleteAd" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveLog" :loading="saving">
          {{ editingLog ? 'Update' : 'Save' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Import Dialog -->
    <el-dialog v-model="showImportDialog" title="Import Delivery Logs" width="500px">
      <div class="import-content">
        <el-upload class="upload-demo" drag :auto-upload="false" :on-change="handleFileChange" accept=".xlsx,.xls,.csv">
          <el-icon class="el-icon--upload">
            <UploadFilled />
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Excel files (.xlsx, .xls) or CSV files only
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="showImportDialog = false">Cancel</el-button>
        <el-button type="primary" @click="importLogs" :loading="importing">
          Import
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Plus,
  Upload,
  Download,
  Search,
  Refresh,
  VideoPlay,
  Coin,
  Timer,
  Warning,
  Grid,
  Postcard,
  View,
  Edit,
  Delete,
  UploadFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadFile } from 'element-plus'

interface DeliveryLog {
  id: number
  adDate: string
  channelName: string
  company: string
  adType: string
  peakOffPeak: string
  telecastTime: string
  adDuration: number
  adName: string
  brand: string
  subBrand: string
  productType: string
  product: string
  programType: string
  programName: string
  breakPlacing: string
  breakType: string
  adQty: number
  adPos: number
  campaign: string
  price: number
  incompleteAd: boolean
}

const loading = ref(false)
const saving = ref(false)
const importing = ref(false)
const showAddDialog = ref(false)
const showImportDialog = ref(false)
const editingLog = ref<DeliveryLog | null>(null)
const viewMode = ref<'table' | 'cards'>('table')
const currentPage = ref(1)
const pageSize = ref(20)
const logFormRef = ref<FormInstance>()

const filters = ref({
  dateRange: null as [string, string] | null,
  company: '',
  adType: '',
  peakTime: '',
  programType: '',
  brand: ''
})

const logForm = ref<Partial<DeliveryLog>>({
  adDate: '',
  channelName: 'Channel 24',
  company: '',
  adType: '',
  peakOffPeak: '',
  telecastTime: '',
  adDuration: 30,
  adName: '',
  brand: '',
  subBrand: '',
  productType: '',
  product: '',
  programType: '',
  programName: '',
  breakPlacing: '',
  breakType: '',
  adQty: 1,
  adPos: 1,
  campaign: '',
  price: 0,
  incompleteAd: false
})

const logRules = {
  adDate: [{ required: true, message: 'Please select ad date', trigger: 'change' }],
  company: [{ required: true, message: 'Please enter company name', trigger: 'blur' }],
  adType: [{ required: true, message: 'Please select ad type', trigger: 'change' }],
  peakOffPeak: [{ required: true, message: 'Please select peak/off-peak', trigger: 'change' }],
  telecastTime: [{ required: true, message: 'Please select telecast time', trigger: 'change' }],
  adName: [{ required: true, message: 'Please enter ad name', trigger: 'blur' }],
  brand: [{ required: true, message: 'Please enter brand', trigger: 'blur' }],
  programName: [{ required: true, message: 'Please enter program name', trigger: 'blur' }],
  price: [{ required: true, message: 'Please enter price', trigger: 'blur' }]
}

// Sample data based on the provided Excel format
const deliveryLogs = ref<DeliveryLog[]>([
  {
    id: 1,
    adDate: '2025-07-02',
    channelName: 'Channel 24',
    company: 'Ispahani Group of Companies',
    adType: 'L-Shape',
    peakOffPeak: 'Peak',
    telecastTime: '00:03:38',
    adDuration: 10,
    adName: 'Ananna Shade',
    brand: 'Ispahani Tea',
    subBrand: 'Ispahani Mirzapore Tea',
    productType: 'Beverage',
    product: 'Tea',
    programType: 'Talk Show',
    programName: 'Muktobak',
    breakPlacing: '2MB',
    breakType: '2MB',
    adQty: 1,
    adPos: 1,
    campaign: '',
    price: 7500,
    incompleteAd: false
  },
  {
    id: 2,
    adDate: '2025-07-02',
    channelName: 'Channel 24',
    company: 'Ispahani Group of Companies',
    adType: 'L-Shape',
    peakOffPeak: 'Peak',
    telecastTime: '00:08:32',
    adDuration: 10,
    adName: 'Ananna Shade',
    brand: 'Ispahani Tea',
    subBrand: 'Ispahani Mirzapore Tea',
    productType: 'Beverage',
    product: 'Tea',
    programType: 'Talk Show',
    programName: 'Muktobak',
    breakPlacing: '2MB',
    breakType: '2MB',
    adQty: 1,
    adPos: 1,
    campaign: '',
    price: 7500,
    incompleteAd: false
  },
  {
    id: 3,
    adDate: '2025-07-02',
    channelName: 'Channel 24',
    company: 'Grameenphone Limited',
    adType: 'L-Shape',
    peakOffPeak: 'Peak',
    telecastTime: '00:13:40',
    adDuration: 10,
    adName: 'MyGP App Bochorer Sobcheye Boro Celebration 100% Cashback',
    brand: 'MyGP App',
    subBrand: 'MyGP App',
    productType: 'Digital Services',
    product: 'App',
    programType: 'Talk Show',
    programName: 'Muktobak',
    breakPlacing: '2MB',
    breakType: '2MB',
    adQty: 1,
    adPos: 1,
    campaign: '1.7 Campaign',
    price: 7500,
    incompleteAd: false
  },
  {
    id: 4,
    adDate: '2025-07-02',
    channelName: 'Channel 24',
    company: 'Ispahani Group of Companies',
    adType: 'TVC',
    peakOffPeak: 'Peak',
    telecastTime: '00:26:52',
    adDuration: 20,
    adName: 'Ispahani Mirzapore Tea_Couple',
    brand: 'Ispahani Tea',
    subBrand: 'Ispahani Mirzapore Tea',
    productType: 'Beverage',
    product: 'Tea',
    programType: 'Talk Show',
    programName: 'Muktobak',
    breakPlacing: 'After',
    breakType: 'After',
    adQty: 5,
    adPos: 1,
    campaign: '',
    price: 15000,
    incompleteAd: false
  },
  {
    id: 5,
    adDate: '2025-07-02',
    channelName: 'Channel 24',
    company: 'Ispahani Group of Companies',
    adType: 'TVC',
    peakOffPeak: 'Peak',
    telecastTime: '00:27:12',
    adDuration: 20,
    adName: 'Ispahani Mirzapore Tea_Live Video',
    brand: 'Ispahani Tea',
    subBrand: 'Ispahani Mirzapore Tea',
    productType: 'Beverage',
    product: 'Tea',
    programType: 'Talk Show',
    programName: 'Muktobak',
    breakPlacing: 'After',
    breakType: 'After',
    adQty: 5,
    adPos: 2,
    campaign: '',
    price: 15000,
    incompleteAd: false
  },
  {
    id: 6,
    adDate: '2025-07-03',
    channelName: 'Channel 24',
    company: 'Robi Axiata Limited',
    adType: 'TVC',
    peakOffPeak: 'Peak',
    telecastTime: '19:15:30',
    adDuration: 30,
    adName: 'Robi 4G Network',
    brand: 'Robi',
    subBrand: 'Robi 4G',
    productType: 'Telecom',
    product: '4G Service',
    programType: 'News',
    programName: 'Channel 24 News',
    breakPlacing: 'Mid',
    breakType: 'Mid',
    adQty: 3,
    adPos: 2,
    campaign: 'Network Campaign',
    price: 25000,
    incompleteAd: false
  },
  {
    id: 7,
    adDate: '2025-07-03',
    channelName: 'Channel 24',
    company: 'Square Pharmaceuticals Ltd',
    adType: 'L-Shape',
    peakOffPeak: 'Off-peak',
    telecastTime: '14:22:15',
    adDuration: 15,
    adName: 'Napa Extra',
    brand: 'Napa',
    subBrand: 'Napa Extra',
    productType: 'Pharmaceutical',
    product: 'Pain Relief',
    programType: 'Magazine',
    programName: 'Health Plus',
    breakPlacing: '2MB',
    breakType: '2MB',
    adQty: 2,
    adPos: 1,
    campaign: 'Health Campaign',
    price: 5000,
    incompleteAd: true
  }
])

const filteredLogs = computed(() => {
  let filtered = deliveryLogs.value

  if (filters.value.dateRange) {
    const [startDate, endDate] = filters.value.dateRange
    filtered = filtered.filter(log =>
      log.adDate >= startDate && log.adDate <= endDate
    )
  }

  if (filters.value.company) {
    filtered = filtered.filter(log =>
      log.company.toLowerCase().includes(filters.value.company.toLowerCase())
    )
  }

  if (filters.value.adType) {
    filtered = filtered.filter(log => log.adType === filters.value.adType)
  }

  if (filters.value.peakTime) {
    filtered = filtered.filter(log => log.peakOffPeak === filters.value.peakTime)
  }

  if (filters.value.programType) {
    filtered = filtered.filter(log => log.programType === filters.value.programType)
  }

  if (filters.value.brand) {
    filtered = filtered.filter(log =>
      log.brand.toLowerCase().includes(filters.value.brand.toLowerCase())
    )
  }

  return filtered
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// Summary computations
const totalAds = computed(() => deliveryLogs.value.length)
const todayAds = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return deliveryLogs.value.filter(log => log.adDate === today).length
})

const totalRevenue = computed(() =>
  deliveryLogs.value.reduce((sum, log) => sum + log.price, 0)
)

const todayRevenue = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return deliveryLogs.value
    .filter(log => log.adDate === today)
    .reduce((sum, log) => sum + log.price, 0)
})

const totalDuration = computed(() =>
  deliveryLogs.value.reduce((sum, log) => sum + log.adDuration, 0)
)

const incompleteAds = computed(() =>
  deliveryLogs.value.filter(log => log.incompleteAd).length
)

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
    month: 'short'
  })
}

const getTimeTagType = (peakOffPeak: string) => {
  return peakOffPeak === 'Peak' ? 'danger' : 'success'
}

const getAdTypeTagType = (adType: string) => {
  switch (adType) {
    case 'TVC': return 'primary'
    case 'L-Shape': return 'warning'
    case 'Aston': return 'info'
    case 'Ticker': return 'success'
    default: return 'info'
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    dateRange: null,
    company: '',
    adType: '',
    peakTime: '',
    programType: '',
    brand: ''
  }
  currentPage.value = 1
}

const refreshData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Data refreshed successfully')
  } finally {
    loading.value = false
  }
}

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  // Implement sorting logic here
  console.log('Sort:', prop, order)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const viewDetails = (log: DeliveryLog) => {
  ElMessageBox.alert(
    `
    <div style="text-align: left;">
      <p><strong>Company:</strong> ${log.company}</p>
      <p><strong>Ad Name:</strong> ${log.adName}</p>
      <p><strong>Brand:</strong> ${log.brand}</p>
      <p><strong>Program:</strong> ${log.programName}</p>
      <p><strong>Time:</strong> ${log.telecastTime} (${log.peakOffPeak})</p>
      <p><strong>Duration:</strong> ${log.adDuration} seconds</p>
      <p><strong>Price:</strong> ${formatCurrency(log.price)} BDT</p>
      <p><strong>Status:</strong> ${log.incompleteAd ? 'Incomplete' : 'Complete'}</p>
    </div>
    `,
    'Delivery Log Details',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: 'Close'
    }
  )
}

const editLog = (log: DeliveryLog) => {
  editingLog.value = log
  logForm.value = { ...log }
  showAddDialog.value = true
}

const deleteLog = async (log: DeliveryLog) => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the delivery log. Continue?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const index = deliveryLogs.value.findIndex(l => l.id === log.id)
    if (index > -1) {
      deliveryLogs.value.splice(index, 1)
      ElMessage.success('Delivery log deleted successfully')
    }
  } catch {
    ElMessage.info('Delete cancelled')
  }
}

const saveLog = async () => {
  if (!logFormRef.value) return

  try {
    await logFormRef.value.validate()
    saving.value = true

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingLog.value) {
      const index = deliveryLogs.value.findIndex(l => l.id === editingLog.value!.id)
      if (index > -1) {
        deliveryLogs.value[index] = { ...logForm.value as DeliveryLog }
      }
      ElMessage.success('Delivery log updated successfully')
    } else {
      const newLog: DeliveryLog = {
        ...logForm.value as DeliveryLog,
        id: Math.max(...deliveryLogs.value.map(l => l.id)) + 1
      }
      deliveryLogs.value.push(newLog)
      ElMessage.success('Delivery log added successfully')
    }

    showAddDialog.value = false
    editingLog.value = null
    resetForm()
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  logForm.value = {
    adDate: '',
    channelName: 'Channel 24',
    company: '',
    adType: '',
    peakOffPeak: '',
    telecastTime: '',
    adDuration: 30,
    adName: '',
    brand: '',
    subBrand: '',
    productType: '',
    product: '',
    programType: '',
    programName: '',
    breakPlacing: '',
    breakType: '',
    adQty: 1,
    adPos: 1,
    campaign: '',
    price: 0,
    incompleteAd: false
  }
}

const exportLogs = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const filename = `delivery_logs_${new Date().toISOString().split('T')[0]}.xlsx`
    ElMessage.success(`Logs exported as ${filename}`)
  } finally {
    loading.value = false
  }
}

const handleFileChange = (file: UploadFile) => {
  console.log('File selected:', file.name)
}

const importLogs = async () => {
  importing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('Delivery logs imported successfully')
    showImportDialog.value = false
  } finally {
    importing.value = false
  }
}

onMounted(() => {
  // Initialize with today's date range
  const today = new Date().toISOString().split('T')[0]
  filters.value.dateRange = [today, today]
})
</script>

<style scoped>
.delivery-logs {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.summary-cards {
  margin-bottom: 24px;
}

.summary-card {
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.card-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
}

.card-icon.total {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.card-icon.revenue {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.card-icon.duration {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.card-icon.incomplete {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.card-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.card-count {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.filter-card {
  margin-bottom: 24px;
}

.filters-container {
  padding: 8px 0;
}

.filter-actions {
  display: flex;
  gap: 8px;
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

.table-actions {
  display: flex;
  gap: 8px;
}

.date-text {
  font-size: 12px;
  font-weight: 600;
}

.duration-text {
  font-weight: 600;
  color: var(--el-color-warning);
}

.price-text {
  font-weight: 600;
  color: var(--el-color-success);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* Cards View Styles */
.cards-view {
  min-height: 600px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.log-card {
  transition: all 0.3s ease;
}

.log-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-time {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.log-details {
  padding: 8px 0;
}

.ad-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.company-name {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0 0 12px 0;
}

.log-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  font-weight: 600;
}

.meta-value {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.meta-value.price {
  font-weight: 600;
  color: var(--el-color-success);
}

.log-status {
  display: flex;
  justify-content: flex-end;
}

.import-content {
  padding: 20px 0;
}

:deep(.el-table th) {
  background: var(--el-fill-color-light);
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: var(--el-fill-color-lighter);
}

@media (max-width: 768px) {
  .delivery-logs {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filters-container .el-col {
    margin-bottom: 12px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .log-meta {
    grid-template-columns: 1fr;
  }
}
</style>
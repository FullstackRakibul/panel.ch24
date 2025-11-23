<template>
  <div class="ad-bookings-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">TV Contract Booking</h1>
        <p class="page-subtitle">Create and manage television advertisement contracts</p>
      </div>
      <el-button type="primary" size="large" @click="openCreateModal">
        <el-icon class="mr-2">
          <Plus />
        </el-icon>
        New Contract
      </el-button>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="24" class="stats-section">
      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon total">
              <el-icon size="24">
                <FileText />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ contractsData.total }}</div>
              <div class="stats-label">Total Contracts</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon active">
              <el-icon size="24">
                <CircleCheck />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ statistics.activeContracts || 0 }}</div>
              <div class="stats-label">Active</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon draft">
              <el-icon size="24">
                <Edit />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ statistics.draftContracts || 0 }}</div>
              <div class="stats-label">Draft</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon completed">
              <el-icon size="24">
                <Check />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ statistics.completedContracts || 0 }}</div>
              <div class="stats-label">Completed</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- View Toggle -->
    <div class="view-toggle-section">
      <el-radio-group v-model="viewMode" size="large">
        <el-radio-button label="table">
          <el-icon class="mr-1">
            <Grid />
          </el-icon>
          Table View
        </el-radio-button>
        <el-radio-button label="grid">
          <el-icon class="mr-1">
            <Menu />
          </el-icon>
          Grid View
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- Filters and Search -->
    <el-card class="filters-card" shadow="never">
      <div class="filters-content">
        <el-input v-model="searchQuery" placeholder="Search contracts by number, client, agency..."
          :prefix-icon="Search" clearable style="max-width: 300px;" @input="handleSearch" />
        <div class="filter-controls">
          <el-select v-model="selectedStatus" placeholder="All Status" clearable @change="loadContracts">
            <el-option label="Draft" value="draft" />
            <el-option label="Active" value="active" />
            <el-option label="Completed" value="completed" />
            <el-option label="Cancelled" value="cancelled" />
          </el-select>

          <el-date-picker v-model="dateRange" type="daterange" range-separator="To" start-placeholder="Start date"
            end-placeholder="End date" value-format="YYYY-MM-DD" @change="handleDateRangeChange" />

          <el-button type="primary" :icon="RefreshCcwDot" @click="loadContracts">
            Refresh
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Contracts Table View -->
    <el-card v-if="viewMode === 'table'" class="contracts-table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>Contracts ({{ contractsData.total }})</h3>
          <div class="header-actions">
            <el-button :icon="Download" @click="exportContracts">
              Export
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="contractsData.data" style="width: 100%"
        :default-sort="{ prop: 'contractDate', order: 'descending' }" empty-text="No contracts found"
        v-loading="loading" @sort-change="handleSortChange">
        <el-table-column label="Contract No" prop="televisionContractNo" width="180" sortable>
          <template #default="{ row }">
            <div class="contract-number">
              <span class="number">{{ row.televisionContractNo }}</span>
              <el-tag v-if="row.remarks?.toLowerCase().includes('draft')" type="info" size="small">
                Draft
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Client/Agency" min-width="100">
          <template #default="{ row }">
            <div class="client-info">
              <div class="name">{{ getClientOrAgencyName(row) }}</div>
              <div class="type">{{ row.contractedClientId ? 'Client' : 'Agency' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Contract Date" prop="contractDate" width="120" sortable>
          <template #default="{ row }">
            {{ formatDate(row.contractDate) }}
          </template>
        </el-table-column>

        <el-table-column label="Duration" width="150">
          <template #default="{ row }">
            <div class="duration">
              <div>{{ formatDate(row.contractStartDate) }}</div>
              <div class="to">to</div>
              <div>{{ formatDate(row.contractEndDate) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Products" width="100">
          <template #default="{ row }">
            <span class="products-count">{{ row.products?.length || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Amount" width="140" sortable prop="total">
          <template #default="{ row }">
            <span class="amount-text">{{ formatCurrency(row.total) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row)" size="small" effect="light">
              {{ getStatusText(row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="viewContractDetails(row)" :icon="View" size="small">
                Details
              </el-button>
              <el-button type="success" link @click="editContract(row)" :icon="Edit" size="small">
                Edit
              </el-button>
              <el-button type="info" link @click="printContract(row)" :icon="Printer" size="small">
                Print
              </el-button>
              <el-dropdown @command="(command: string) => handleContractAction(row, command)">
                <el-button type="warning" link size="small">
                  More
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="duplicate" :icon="Copy">
                      Duplicate
                    </el-dropdown-item>
                    <el-dropdown-item command="export" :icon="Download">
                      Export PDF
                    </el-dropdown-item>
                    <el-dropdown-item v-if="!row.remarks?.toLowerCase().includes('draft')" command="mark-draft"
                      :icon="Edit">
                      Mark as Draft
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.remarks?.toLowerCase().includes('draft')" command="mark-active"
                      :icon="CircleCheck">
                      Mark as Active
                    </el-dropdown-item>
                    <el-dropdown-item divided command="delete" :icon="Trash2" class="danger">
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-section">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="contractsData.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- Contracts Grid View -->
    <div v-else class="contracts-grid">
      <div class="grid-container">
        <el-card v-for="contract in contractsData.data" :key="contract.guid" class="contract-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="contract-number">
                <h4>{{ contract.televisionContractNo }}</h4>
                <el-tag v-if="contract.remarks?.toLowerCase().includes('draft')" type="info" size="small">
                  Draft
                </el-tag>
              </div>
              <el-dropdown @command="(command: string) => handleContractAction(contract, command)">
                <el-button type="primary" link>
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="view" :icon="View">View Details</el-dropdown-item>
                    <el-dropdown-item command="edit" :icon="Edit">Edit</el-dropdown-item>
                    <el-dropdown-item command="print" :icon="Printer">Print</el-dropdown-item>
                    <el-dropdown-item command="duplicate" :icon="Copy">Duplicate</el-dropdown-item>
                    <el-dropdown-item divided command="delete" :icon="Trash2" class="danger">Delete</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>

          <div class="contract-info">
            <div class="info-item">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ getClientOrAgencyName(contract) }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Calendar />
              </el-icon>
              <span>{{ formatDate(contract.contractDate) }}</span>
            </div>
            <!-- <div class="info-item">
              <el-icon>
                <Clock />
              </el-icon>
              <span>{{ formatDate(contract.contractStartDate) }} - {{ formatDate(contract.contractEndDate) }}</span>
            </div> -->
            <div class="info-item">
              <el-icon>
                <Box />
              </el-icon>
              <span>{{ contract.products?.length || 0 }} Products</span>
            </div>
            <div class="info-item amount">
              <el-icon>
                <Coin />
              </el-icon>
              <span class="amount-value">{{ formatCurrency(contract.total || 0) }}</span>
            </div>
          </div>

          <div class="card-footer">
            <el-tag :type="getStatusColor(contract)" size="small">
              {{ getStatusText(contract) }}
            </el-tag>
            <div class="footer-actions">
              <el-button type="primary" link @click="viewContractDetails(contract)" :icon="View" size="small">
                View
              </el-button>
              <el-button type="success" link @click="editContract(contract)" :icon="Edit" size="small">
                Edit
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- Pagination for Grid View -->
      <div class="pagination-section">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
          :page-sizes="[12, 24, 48, 96]" :total="contractsData.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- Contract Modal -->
    <ContractModal v-model="showModal" :contract="selectedContract" :is-edit="isEditMode" :loading="modalLoading"
      @save="handleSave" @refresh="loadContracts" />

    <!-- Contract Details Modal -->
    <ContractDetailsModal v-model="showDetailsModal" :contract="selectedContract" @edit="editContractFromDetails" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  FileText,
  CircleCheck,
  Edit,
  Check,
  View,
  Printer,
  Trash2,
  Download,
  Grid,
  Menu,
  ArrowDown,
  Copy,
  User,
  Calendar,
  Clock,
  Box,
  RefreshCcwDot,
} from 'lucide-vue-next'
import ContractModal from '@/components/forms/ContractModal.vue'
import ContractDetailsModal from '@/components/modals/ContractDetailsModal.vue'
import { contractService } from '@/services/Contracts/contract.services'
import type { ITelevisionContract, ITelevisionContractFilter } from '@/interface/contract/contracts.interface'
import { useContractStore } from '@/stores/contracts'

// Reactive data
const loading = ref(false)
const modalLoading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const dateRange = ref<[string, string]>(['', ''])
const viewMode = ref<'table' | 'grid'>('table')
const showModal = ref(false)
const showDetailsModal = ref(false)
const isEditMode = ref(false)
const selectedContract = ref<ITelevisionContract | null>(null)
const store = useContractStore()
const contractsData = reactive({
  data: [] as ITelevisionContract[],
  total: 0
})

const statistics = reactive({
  activeContracts: 0,
  draftContracts: 0,
  completedContracts: 0,
  cancelledContracts: 0,
  totalRevenue: 0
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const sort = reactive({
  prop: 'contractDate',
  order: 'descending'
})

// Format currency as BDT with commas and two decimals
const formatCurrency = (amount: number) => {
  return '৳' + amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-BD')
}

const getClientOrAgencyName = (contract: ITelevisionContract) => {
  // This would need to be implemented based on your client/agency data
  // For now, return a placeholder
  return contract.contractedClientId ? 'Client' : 'Agency'
}

const getStatusText = (contract: ITelevisionContract) => {
  if (contract.remarks?.toLowerCase().includes('draft')) return 'Draft'
  if (contract.remarks?.toLowerCase().includes('completed')) return 'Completed'
  if (contract.remarks?.toLowerCase().includes('cancelled')) return 'Cancelled'
  return 'Active'
}

const getStatusColor = (contract: ITelevisionContract) => {
  const status = getStatusText(contract).toLowerCase()
  const colorMap = {
    draft: 'info',
    active: 'success',
    completed: 'primary',
    cancelled: 'danger'
  }
  return colorMap[status as keyof typeof colorMap] || 'default'
}

// Load contracts from API
const loadContracts = async () => {
  loading.value = true
  try {
    const filter: ITelevisionContractFilter = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchQuery.value || undefined,
      status: selectedStatus.value || undefined,
      startDate: dateRange.value[0] || undefined,
      endDate: dateRange.value[1] || undefined
    }

    const response = await contractService.getAllTelevisionContracts()

    console.log("Television Contract  response", response)
    contractsData.data = response
    contractsData.total = response.length

    // Load statistics
    // const stats = await contractService.getContractStatistics()
    // Object.assign(statistics, stats)

  } catch (error) {
    console.error('Failed to load contracts:', error)
    ElMessage.error('Failed to load contracts')
  } finally {
    loading.value = false
  }
}

// Event handlers
const handleSearch = () => {
  pagination.currentPage = 1
  loadContracts()
}

const handleDateRangeChange = () => {
  pagination.currentPage = 1
  loadContracts()
}

const handleSortChange = (sortProps: any) => {
  sort.prop = sortProps.prop
  sort.order = sortProps.order
  loadContracts()
}

const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize
  pagination.currentPage = 1
  loadContracts()
}

const handleCurrentChange = (newPage: number) => {
  pagination.currentPage = newPage
  loadContracts()
}

const openCreateModal = () => {
  selectedContract.value = null
  isEditMode.value = false
  showModal.value = true

  // Initialize the store for new contract
  nextTick(() => {
    store.initializeContract()
  })
}
const viewContractDetails = (contract: ITelevisionContract) => {
  selectedContract.value = contract
  showDetailsModal.value = true
}

const editContract = (contract: ITelevisionContract) => {
  selectedContract.value = contract
  isEditMode.value = true
  showModal.value = true
}

const editContractFromDetails = (contract: ITelevisionContract) => {
  selectedContract.value = contract
  isEditMode.value = true
  showDetailsModal.value = false
  showModal.value = true
}

const printContract = async (contract: ITelevisionContract) => {
  try {
    const blob = await contractService.exportContractAsPdf(contract.guid)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contract-${contract.televisionContractNo}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export contract:', error)
    ElMessage.error('Failed to export contract')
  }
}

const handleContractAction = async (contract: ITelevisionContract, command: string) => {
  try {
    switch (command) {
      case 'view':
        viewContractDetails(contract)
        break
      case 'edit':
        editContract(contract)
        break
      case 'print':
        printContract(contract)
        break
      case 'duplicate':
        await duplicateContract(contract)
        break
      case 'export':
        await printContract(contract)
        break
      case 'mark-draft':
        await updateContractStatus(contract, 'draft')
        break
      case 'mark-active':
        await updateContractStatus(contract, 'active')
        break
      case 'delete':
        await deleteContract(contract)
        break
    }
  } catch (error) {
    console.error('Action failed:', error)
  }
}

const duplicateContract = async (contract: ITelevisionContract) => {
  try {
    await ElMessageBox.confirm(
      'This will create a duplicate of this contract. Continue?',
      'Duplicate Contract',
      { confirmButtonText: 'Duplicate', cancelButtonText: 'Cancel' }
    )

    const result = await contractService.duplicateContract(contract.guid)
    ElMessage.success(`Contract duplicated successfully. New contract: ${result.newContractNo}`)
    loadContracts()
  } catch {
    // User cancelled
  }
}

const updateContractStatus = async (contract: ITelevisionContract, status: string) => {
  try {
    await contractService.updateContractStatus(contract.guid, status)
    ElMessage.success(`Contract status updated to ${status}`)
    loadContracts()
  } catch (error) {
    console.error('Failed to update status:', error)
    ElMessage.error('Failed to update contract status')
  }
}

const deleteContract = async (contract: ITelevisionContract) => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the contract. Continue?',
      'Warning',
      { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }
    )

    await contractService.deleteTelevisionContract(contract.guid)
    ElMessage.success('Contract deleted successfully')
    loadContracts()
  } catch {
    // User cancelled
  }
}

const handleSave = async (contractData: any) => {
  modalLoading.value = true
  try {
    if (isEditMode.value && selectedContract.value) {
      await contractService.updateTelevisionContract(selectedContract.value.guid, contractData)
      ElMessage.success('Contract updated successfully')
    } else {
      await contractService.createTelevisionContract(contractData)
      ElMessage.success('Contract created successfully')
    }

    showModal.value = false
    loadContracts()
  } catch (error) {
    console.error('Failed to save contract:', error)
    ElMessage.error('Failed to save contract')
  } finally {
    modalLoading.value = false
  }
}

const exportContracts = async () => {
  try {
    ElMessage.info('Export feature coming soon...')
    // Implement export functionality here
  } catch (error) {
    console.error('Export failed:', error)
    ElMessage.error('Export failed')
  }
}

// Initial load
onMounted(() => {
  loadContracts()
})
</script>

<style scoped>
.ad-bookings-container {
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

.stats-section {
  margin-bottom: 32px;
}

.stats-card {
  background: var(--el-bg-color);
  padding: 24px;
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow);
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-icon.total {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.stats-icon.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stats-icon.draft {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.stats-icon.completed {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.stats-info {
  flex: 1;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1.2;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.view-toggle-section {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.contracts-table-card {
  --el-card-padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.contract-number {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contract-number .number {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.client-info .name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.client-info .type {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 2px;
}

.duration {
  text-align: center;
}

.duration .to {
  font-size: 10px;
  color: var(--el-text-color-regular);
  margin: 2px 0;
}

.products-count {
  font-weight: 600;
  color: var(--el-color-primary);
}

.amount-text {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* Grid View Styles */
.contracts-grid {
  margin-bottom: 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.contract-card {
  height: 100%;
  transition: all 0.3s ease;
}

.contract-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow-dark);
}

.contract-card .card-header {
  padding: 16px 20px 0;
}

.contract-info {
  padding: 0 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-text-color-regular);
}

.info-item.amount {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.amount-value {
  font-weight: 600;
  color: var(--el-color-primary);
  font-size: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

:deep(.danger) {
  color: var(--el-color-danger);
}

:deep(.danger:hover) {
  color: var(--el-color-danger-light-3);
}

@media (max-width: 768px) {
  .ad-bookings-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filters-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: space-between;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .footer-actions {
    justify-content: space-between;
  }
}
</style>
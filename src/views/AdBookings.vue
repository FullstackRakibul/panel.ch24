<template>
  <div class="control-center" @keydown.n="handleKeyboardShortcut" tabindex="0">
    <!-- Fixed Top Section -->
    <div class="control-header">
      <!-- Breadcrumb & Title Row -->
      <div class="header-row">
        <div class="header-left">
          <h1 class="page-title">Contract</h1>
        </div>
        <!-- Status Indicator Bar -->
        <div class="status-bar">
          <div class="status-badge total">
            <el-icon size="14">
              <FileText />
            </el-icon>
            <span class="badge-value">{{ contractsData.total }}</span>
            <span class="badge-label">Total</span>
          </div>
          <div class="status-badge active">
            <el-icon size="14">
              <CircleCheck />
            </el-icon>
            <span class="badge-value">{{ statistics.activeContracts || 0 }}</span>
            <span class="badge-label">Active</span>
          </div>
          <div class="status-badge draft">
            <el-icon size="14">
              <Edit />
            </el-icon>
            <span class="badge-value">{{ statistics.draftContracts || 0 }}</span>
            <span class="badge-label">Draft</span>
          </div>
          <div class="status-badge completed">
            <el-icon size="14">
              <Check />
            </el-icon>
            <span class="badge-value">{{ statistics.completedContracts || 0 }}</span>
            <span class="badge-label">Completed</span>
          </div>
        </div>
      </div>

      <!-- Unified Command & Filter Ribbon -->
      <div class="command-ribbon">
        <div class="ribbon-left">
          <el-input v-model="searchQuery" placeholder="Search contracts..." :prefix-icon="Search" clearable
            class="search-input" @input="handleSearch" />
          <el-select v-model="selectedStatus" placeholder="All Status" clearable class="status-select"
            @change="loadContracts">
            <el-option label="Draft" value="draft" />
            <el-option label="Active" value="active" />
            <el-option label="Completed" value="completed" />
            <el-option label="Cancelled" value="cancelled" />
          </el-select>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="Start"
            end-placeholder="End" value-format="YYYY-MM-DD" class="date-picker" @change="handleDateRangeChange" />
        </div>
        <div class="ribbon-right">
          <!-- View Toggle -->
          <el-radio-group v-model="viewMode" size="small" class="view-toggle">
            <el-radio-button label="table">
              <el-icon>
                <Grid />
              </el-icon>
            </el-radio-button>
            <el-radio-button label="grid">
              <el-icon>
                <Menu />
              </el-icon>
            </el-radio-button>
          </el-radio-group>

          <el-divider direction="vertical" />

          <!-- Quick Actions -->
          <el-tooltip content="Export Excel" placement="bottom">
            <el-button :icon="Download" class="quick-action" @click="exportToExcel" />
          </el-tooltip>
          <el-tooltip content="Print" placement="bottom">
            <el-button :icon="Printer" class="quick-action" @click="printCurrentView" />
          </el-tooltip>
          <el-tooltip content="Refresh (R)" placement="bottom">
            <el-button :icon="RefreshCcwDot" class="quick-action" @click="loadContracts" />
          </el-tooltip>

          <el-divider direction="vertical" />

          <el-button type="primary" class="new-contract-btn" @click="openCreateModal">
            <el-icon class="mr-1">
              <Plus />
            </el-icon>
            New Contract
            <span class="shortcut-hint">N</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Scrollable Data Area -->
    <div class="data-container">
      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="table-wrapper">
        <el-table :data="displayedContracts" style="width: 100%" :max-height="tableHeight" stripe border size="small"
          :default-sort="{ prop: 'contractDate', order: 'descending' }" empty-text="No contracts found"
          v-loading="loading" @sort-change="handleSortChange" @row-click="openDetailDrawer" class="contracts-table">
          <el-table-column label="Contract No" prop="televisionContractNo" width="160" sortable>
            <template #default="{ row }">
              <div class="contract-no-cell">
                <span class="contract-link" @click.stop="copyContractNo(row.televisionContractNo)">
                  {{ row.televisionContractNo }}
                </span>
                <el-tag v-if="row.remarks?.toLowerCase().includes('draft')" type="info" size="small"
                  class="status-pill">
                  Draft
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Client/Agency" min-width="100">
            <template #default="{ row }">
              <div class="client-cell">
                <span class="client-name">{{ getClientOrAgencyName(row) }}</span>
                <span class="client-type">{{ row.contractedClientId ? 'Client' : 'Agency' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Contract Date" prop="contractDate" width="180" sortable>
            <template #default="{ row }">
              <span class="date-cell">{{ formatDate(row.contractDate) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Duration" width="180">
            <template #default="{ row }">
              <span class="duration-cell">
                {{ formatDate(row.contractStartDate) }} → {{ formatDate(row.contractEndDate) }}
              </span>
            </template>
          </el-table-column>

          <!-- <el-table-column label="Products" width="80" align="center">
            <template #default="{ row }">
              <span class="products-badge">{{ row.products?.length || 0 }}</span>
            </template>
          </el-table-column> -->

          <el-table-column label="Amount" width="130" sortable prop="total" align="right">
            <template #default="{ row }">
              <span class="amount-cell">{{ formatCurrency(row.total) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusColor(row)" size="small" class="status-pill" effect="plain">
                {{ getStatusText(row) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="Created" sortable prop="createdAt" width="150">
            <template #default="{ row }">
              <span class="date-cell">{{ formatDateTime(row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Actions" fixed="right" width="100">
            <template #default="{ row }">
              <div class="actions-cell">
                <el-button type="primary" link size="small" @click.stop="editContract(row)">
                  Edit
                </el-button>
                <el-dropdown @command="(cmd: string) => handleContractAction(row, cmd)" trigger="hover">
                  <el-button type="info" link size="small" @click.stop>
                    More <el-icon class="el-icon--right">
                      <ArrowDown />
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="view" :icon="View">View Details</el-dropdown-item>
                      <el-dropdown-item command="print" :icon="Printer">Print</el-dropdown-item>
                      <el-dropdown-item command="duplicate" :icon="Copy">Duplicate</el-dropdown-item>
                      <el-dropdown-item command="export" :icon="Download">Export PDF</el-dropdown-item>
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
        <div class="pagination-bar">
          <span class="results-info">Showing {{ displayedContracts.length }} of {{ filteredContracts.length }}
            contracts</span>
          <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :page-sizes="[25, 50, 100, 200]" :total="filteredContracts.length" layout="sizes, prev, pager, next, jumper"
            small @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid-wrapper">
        <div class="grid-container">
          <div v-for="contract in displayedContracts" :key="contract.guid" class="contract-card"
            @click="openDetailDrawer(contract)">
            <div class="card-header">
              <div class="card-title">
                <span class="contract-link" @click.stop="copyContractNo(contract.televisionContractNo)">
                  {{ contract.televisionContractNo }}
                </span>
                <el-tag :type="getStatusColor(contract)" size="small" class="status-pill" effect="plain">
                  {{ getStatusText(contract) }}
                </el-tag>
              </div>
              <el-dropdown @command="(cmd: string) => handleContractAction(contract, cmd)" trigger="click">
                <el-button type="info" link size="small" @click.stop>
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="view" :icon="View">View</el-dropdown-item>
                    <el-dropdown-item command="edit" :icon="Edit">Edit</el-dropdown-item>
                    <el-dropdown-item command="print" :icon="Printer">Print</el-dropdown-item>
                    <el-dropdown-item command="duplicate" :icon="Copy">Duplicate</el-dropdown-item>
                    <el-dropdown-item divided command="delete" :icon="Trash2" class="danger">Delete</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="card-body">
              <div class="card-row">
                <el-icon size="12">
                  <User />
                </el-icon>
                <span>{{ getClientOrAgencyName(contract) }}</span>
              </div>
              <div class="card-row">
                <el-icon size="12">
                  <Calendar />
                </el-icon>
                <span>{{ formatDate(contract.contractDate) }}</span>
              </div>
              <div class="card-row">
                <el-icon size="12">
                  <Box />
                </el-icon>
                <span>{{ contract.products?.length || 0 }} Products</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="card-amount">{{ formatCurrency(contract.total || 0) }}</span>
              <div class="card-actions">
                <el-button type="primary" link size="small" @click.stop="editContract(contract)">Edit</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Pagination -->
        <div class="pagination-bar">
          <span class="results-info">Showing {{ displayedContracts.length }} of {{ filteredContracts.length }}
            contracts</span>
          <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :page-sizes="[12, 24, 48, 96]" :total="filteredContracts.length" layout="sizes, prev, pager, next, jumper"
            small @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <!-- Contract Modal -->
    <ContractModal v-model="showModal" :contract="selectedContract" :is-edit="isEditMode" :loading="modalLoading"
      @save="handleSave" @refresh="loadContracts" />

    <!-- Contract Details Modal (kept for compatibility) -->
    <ContractDetailsModal v-model="showDetailsModal" :contract="selectedContract" @edit="editContractFromDetails" />

    <!-- Master-Detail Drawer -->
    <el-drawer v-model="showDrawer" title="Contract Details" direction="rtl" size="420px" class="detail-drawer">
      <template v-if="selectedContract">
        <div class="drawer-content">
          <div class="drawer-section">
            <h4>Contract Information</h4>
            <div class="drawer-row">
              <span class="drawer-label">Contract No:</span>
              <span class="drawer-value contract-link" @click="copyContractNo(selectedContract.televisionContractNo)">
                {{ selectedContract.televisionContractNo }}
              </span>
            </div>
            <div class="drawer-row">
              <span class="drawer-label">Status:</span>
              <el-tag :type="getStatusColor(selectedContract)" size="small" effect="plain">
                {{ getStatusText(selectedContract) }}
              </el-tag>
            </div>
            <div class="drawer-row">
              <span class="drawer-label">Contract Date:</span>
              <span class="drawer-value">{{ formatDate(selectedContract.contractDate) }}</span>
            </div>
            <div class="drawer-row">
              <span class="drawer-label">Duration:</span>
              <span class="drawer-value">
                {{ formatDate(selectedContract.contractStartDate) }} - {{ formatDate(selectedContract.contractEndDate)
                }}
              </span>
            </div>
          </div>

          <el-divider />

          <div class="drawer-section">
            <h4>Financial Summary</h4>
            <div class="drawer-row">
              <span class="drawer-label">Products:</span>
              <span class="drawer-value">{{ selectedContract.products?.length || 0 }}</span>
            </div>
            <div class="drawer-row highlight">
              <span class="drawer-label">Total Amount:</span>
              <span class="drawer-value amount">{{ formatCurrency(selectedContract.total || 0) }}</span>
            </div>
          </div>

          <el-divider />

          <div class="drawer-section">
            <h4>Remarks</h4>
            <p class="drawer-remarks">{{ selectedContract.remarks || 'No remarks' }}</p>
          </div>
        </div>

        <div class="drawer-footer">
          <el-button @click="showDrawer = false">Close</el-button>
          <el-button type="primary" @click="editContract(selectedContract); showDrawer = false">
            <el-icon class="mr-1">
              <Edit />
            </el-icon>
            Edit Contract
          </el-button>
          <el-button type="success" @click="printContract(selectedContract)">
            <el-icon class="mr-1">
              <Printer />
            </el-icon>
            Print
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, computed, onUnmounted } from 'vue'
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
  Box,
  RefreshCcwDot,

} from 'lucide-vue-next'
import ContractModal from '@/components/forms/ContractModal.vue'
import ContractDetailsModal from '@/components/modals/ContractDetailsModal.vue'
import { contractService } from '@/services/Contracts/contract.services'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'
import { useContractStore } from '@/stores/contracts'
import { formatDateTime } from '@/services/global/formateDateTime'

// Reactive data
const loading = ref(false)
const modalLoading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const dateRange = ref<[string, string]>(['', ''])
const viewMode = ref<'table' | 'grid'>('table')
const showModal = ref(false)
const showDetailsModal = ref(false)
const showDrawer = ref(false)
const isEditMode = ref(false)
const selectedContract = ref<ITelevisionContract | null>(null)
const store = useContractStore()
const tableHeight = ref('calc(100vh - 220px)')

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
  pageSize: 50,
  total: 0
})

const sort = reactive({
  prop: 'contractDate',
  order: 'descending'
})

// Keyboard shortcut handler
const handleKeyboardShortcut = (e: KeyboardEvent) => {
  // Ignore if user is typing in an input
  if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return

  if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    openCreateModal()
  }
  if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    loadContracts()
  }
}

// Format currency as BDT with commas and two decimals
const formatCurrency = (amount: number) => {
  return '৳' + amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-BD')
}

// Copy contract number to clipboard
const copyContractNo = (contractNo: string) => {
  navigator.clipboard.writeText(contractNo).then(() => {
    ElMessage.success(`Copied: ${contractNo}`)
  }).catch(() => {
    ElMessage.error('Failed to copy contract number')
  })
}

const getClientOrAgencyName = (contract: ITelevisionContract) => {
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
    const response = await contractService.getAllTelevisionContracts()
    contractsData.data = response
    contractsData.total = response.length

    // Calculate statistics
    statistics.activeContracts = response.filter(c => getStatusText(c) === 'Active').length
    statistics.draftContracts = response.filter(c => getStatusText(c) === 'Draft').length
    statistics.completedContracts = response.filter(c => getStatusText(c) === 'Completed').length
    statistics.cancelledContracts = response.filter(c => getStatusText(c) === 'Cancelled').length
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
}

const handleDateRangeChange = () => {
  pagination.currentPage = 1
}

const handleSortChange = (sortProps: any) => {
  sort.prop = sortProps.prop
  sort.order = sortProps.order
}

const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize
  pagination.currentPage = 1
}

const handleCurrentChange = (newPage: number) => {
  pagination.currentPage = newPage
}

const openCreateModal = () => {
  selectedContract.value = null
  isEditMode.value = false
  showModal.value = true

  nextTick(() => {
    store.initializeContract()
  })
}

const openDetailDrawer = (row: ITelevisionContract) => {
  selectedContract.value = row
  showDrawer.value = true
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

const printCurrentView = () => {
  window.print()
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

// Computed property for filtered contracts
const filteredContracts = computed(() => {
  let filtered = [...contractsData.data]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract =>
      contract.televisionContractNo?.toLowerCase().includes(query) ||
      getClientOrAgencyName(contract).toLowerCase().includes(query) ||
      contract.remarks?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(contract => {
      const status = getStatusText(contract).toLowerCase()
      return status === selectedStatus.value
    })
  }

  // Date range filter
  if (dateRange.value[0] && dateRange.value[1]) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])

    filtered = filtered.filter(contract => {
      const contractDate = new Date(contract.contractDate)
      return contractDate >= startDate && contractDate <= endDate
    })
  }

  return filtered
})

// Displayed contracts with pagination applied to filtered results
const displayedContracts = computed(() => {
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize
  const endIndex = startIndex + pagination.pageSize
  return filteredContracts.value.slice(startIndex, endIndex)
})

// Export to Excel via backend API
const exportToExcel = async () => {
  try {
    ElMessage.info('Generating Excel file...')
    const blob = await contractService.exportContractsToExcel()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const date = new Date().toISOString().split('T')[0]
    link.download = `TV_Contracts_${date}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('Excel file exported successfully')
  } catch (error) {
    console.error('Export failed:', error)
    ElMessage.error('Failed to export contracts to Excel')
  }
}

// Lifecycle
onMounted(() => {
  loadContracts()
})
</script>

<style scoped>
/* ========================================
   CONTROL CENTER LAYOUT - "Desktop App" Feel
   ======================================== */

.control-center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f8fafc;
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #0f172a;
  outline: none;
}

/* ========================================
   FIXED HEADER SECTION
   ======================================== */

.control-header {
  flex-shrink: 0;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.breadcrumb {
  font-size: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

/* Status Indicator Bar */
.status-bar {
  display: flex;
  gap: 12px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: #f1f5f9;
  font-size: 12px;
  transition: all 0.2s ease;
}

.status-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.status-badge.total {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1e40af;
}

.status-badge.active {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #047857;
}

.status-badge.draft {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  color: #b45309;
}

.status-badge.completed {
  background: linear-gradient(135deg, #f5f3ff, #ede9fe);
  color: #7c3aed;
}

.badge-value {
  font-weight: 700;
  font-size: 14px;
}

.badge-label {
  font-weight: 500;
  opacity: 0.8;
}

/* ========================================
   COMMAND & FILTER RIBBON
   ======================================== */

.command-ribbon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 0 0;
}

.ribbon-left {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
}

.ribbon-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  width: 280px;
}

.status-select {
  width: 130px;
}

.date-picker {
  width: 220px;
}

.view-toggle :deep(.el-radio-button__inner) {
  padding: 6px 10px;
}

.quick-action {
  padding: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.quick-action:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.new-contract-btn {
  font-weight: 600;
  padding: 8px 16px;
}

.shortcut-hint {
  margin-left: 8px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

/* ========================================
   SCROLLABLE DATA CONTAINER
   ======================================== */

.data-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px 16px;
}

.grid-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 12px 16px;
}

/* ========================================
   HIGH-DENSITY TABLE STYLES
   ======================================== */

.contracts-table {
  font-size: 13px;
}

.contracts-table :deep(.el-table__header th) {
  background: #f8fafc !important;
  font-weight: 600;
  color: #475569;
  padding: 8px 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contracts-table :deep(.el-table__row) {
  cursor: pointer;
  transition: background 0.15s ease;
}

.contracts-table :deep(.el-table__row:hover > td) {
  background: #f1f5f9 !important;
}

.contracts-table :deep(.el-table__cell) {
  padding: 8px 12px;
}

/* Contract Number as Link */
.contract-no-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contract-link {
  color: #ff5100;
  font-weight: 600;
  font-family: 'Montserrat', 'Roboto Mono', 'Consolas', monospace;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s ease;
}

.contract-link:hover {
  color: #ff5100;
  text-decoration: underline;
  cursor: grab;
}

/* Client Cell */
.client-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.client-name {
  font-weight: 500;
  color: #0f172a;
}

.client-type {
  font-size: 11px;
  color: #64748b;
}

/* Date Cells */
.date-cell {
  color: #475569;
  font-size: 12px;
}

.duration-cell {
  font-size: 12px;
  color: #475569;
}

/* Products Badge */
.products-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
  border-radius: 12px;
  font-size: 12px;
}

/* Amount Cell - Monospace & Right-Aligned */
.amount-cell {
  font-family: 'JetBrains Mono', 'Roboto Mono', 'Consolas', monospace;
  font-weight: 600;
  color: #0f172a;
  font-size: 13px;
}

/* Status Pills */
.status-pill {
  border-radius: 12px;
  font-weight: 500;
  font-size: 11px;
  padding: 2px 8px;
}

/* Actions Cell */
.actions-cell {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* ========================================
   PAGINATION BAR
   ======================================== */

.pagination-bar {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 0;
  border-top: 1px solid #e2e8f0;
  margin-top: 12px;
}

.results-info {
  font-size: 12px;
  color: #64748b;
}

/* ========================================
   GRID VIEW STYLES
   ======================================== */

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.contract-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contract-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.contract-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  margin-bottom: 10px;
}

.card-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  margin-bottom: 4px;
}

.contract-card .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.card-amount {
  font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
  font-weight: 600;
  color: #0f172a;
}

/* ========================================
   DETAIL DRAWER STYLES
   ======================================== */

.detail-drawer :deep(.el-drawer__header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 20px;
  margin-bottom: 0;
}

.detail-drawer :deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.drawer-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
}

.drawer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.drawer-row:last-child {
  border-bottom: none;
}

.drawer-row.highlight {
  background: #f8fafc;
  margin: 0 -20px;
  padding: 12px 20px;
  border-radius: 8px;
}

.drawer-label {
  color: #64748b;
  font-size: 13px;
}

.drawer-value {
  font-weight: 500;
  color: #0f172a;
}

.drawer-value.amount {
  font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: #059669;
}

.drawer-remarks {
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.drawer-footer {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

/* ========================================
   UTILITY CLASSES
   ======================================== */

.mr-1 {
  margin-right: 4px;
}

:deep(.danger) {
  color: var(--el-color-danger) !important;
}

:deep(.danger:hover) {
  color: var(--el-color-danger-light-3) !important;
}

/* ========================================
   MICRO-INTERACTIONS & TRANSITIONS
   ======================================== */

.el-button {
  transition: all 0.15s ease;
}

.el-button:hover {
  transform: translateY(-1px);
}

.el-tag {
  transition: all 0.15s ease;
}

/* ========================================
   RESPONSIVE ADJUSTMENTS
   ======================================== */

@media (max-width: 1200px) {
  .status-bar {
    display: none;
  }

  .ribbon-left {
    flex-wrap: wrap;
  }

  .search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .control-header {
    padding: 8px 12px;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .command-ribbon {
    flex-direction: column;
    align-items: stretch;
  }

  .ribbon-left,
  .ribbon-right {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }
}

/* Print Styles */
@media print {

  .control-header,
  .pagination-bar,
  .actions-cell {
    display: none !important;
  }

  .control-center {
    height: auto;
    overflow: visible;
  }

  .data-container {
    overflow: visible;
  }
}
</style>
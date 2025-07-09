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
              <div class="stats-value">{{ contracts.length }}</div>
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
              <div class="stats-value">{{ activeContracts }}</div>
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
              <div class="stats-value">{{ draftContracts }}</div>
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
              <div class="stats-value">{{ completedContracts }}</div>
              <div class="stats-label">Completed</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Contracts Table -->
    <el-card class="contracts-table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>Contracts</h3>
          <div class="header-actions">
            <el-input v-model="searchQuery" placeholder="Search contracts..." :prefix-icon="Search" clearable
              @input="handleSearch" />
            <el-select v-model="selectedStatus" placeholder="All Status" clearable @change="handleFilter">
              <el-option label="Draft" value="draft" />
              <el-option label="Active" value="active" />
              <el-option label="Completed" value="completed" />
              <el-option label="Cancelled" value="cancelled" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredContracts" style="width: 100%" :default-sort="{ prop: 'createdAt', order: 'descending' }"
        empty-text="No contracts found" v-loading="contractsStore.loading">
        <el-table-column label="Contract No" prop="contractNo" width="150" sortable />

        <el-table-column label="Advertiser" prop="advertiser" min-width="200" />

        <el-table-column label="Product" prop="product" min-width="150" />

        <el-table-column label="Contract Date" prop="contractDate" width="120" sortable />

        <el-table-column label="Duration" width="120">
          <template #default="{ row }">
            <span class="duration-text">{{ row.duration }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Amount" width="120" sortable>
          <template #default="{ row }">
            <span class="amount-text">{{ formatCurrency(row.grandTotal) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small" effect="light">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">\
              <el-button type="primary" link @click="viewContract(row)" :icon="Eye" size="small">
                View
              </el-button>
              <el-button type="success" link @click="editContract(row)" :icon="Edit" size="small">
                Edit
              </el-button>
              <el-button type="info" link @click="printContract(row)" :icon="Printer" size="small">
                Print
              </el-button>
              <el-button type="danger" link @click="deleteContract(row.id!)" :icon="Trash2" size="small">
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Contract Modal -->
    <ContractModal v-model="showModal" :contract="selectedContract" :is-edit="isEditMode"
      :loading="contractsStore.loading" @save="handleSave" />

    <!-- Contract View Modal -->
    <ContractViewModal v-model="showViewModal" :contract="selectedContract" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useContractsStore, type Contract } from '@/stores/contracts'
import ContractModal from '@/components/forms/ContractModal.vue'
import ContractViewModal from '@/components/modals/ContractViewModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  FileText,
  CircleCheck,
  Edit,
  Check,
  Eye,
  Printer,
  Trash2
} from 'lucide-vue-next'
// Format currency as BDT with commas and two decimals
function formatCurrency(amount: number) {
  return '৳' + amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const contractsStore = useContractsStore()

const searchQuery = ref('')
const selectedStatus = ref('')
const showModal = ref(false)
const showViewModal = ref(false)
const isEditMode = ref(false)
const selectedContract = ref<Contract | null>(null)

const contracts = computed(() => contractsStore.contracts)
const activeContracts = computed(() => contracts.value.filter(c => c.status === 'active').length)
const draftContracts = computed(() => contracts.value.filter(c => c.status === 'draft').length)
const completedContracts = computed(() => contracts.value.filter(c => c.status === 'completed').length)

const filteredContracts = computed(() => {
  let filtered = [...contracts.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract =>
      contract.contractNo.toLowerCase().includes(query) ||
      contract.advertiser.toLowerCase().includes(query) ||
      contract.product.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(contract => contract.status === selectedStatus.value)
  }

  return filtered
})

const handleSearch = () => {
  // Search is handled by computed property
}

const handleFilter = () => {
  // Filtering is handled by computed property
}

const openCreateModal = () => {
  selectedContract.value = null
  isEditMode.value = false
  showModal.value = true
}

const editContract = (contract: Contract) => {
  selectedContract.value = contract
  isEditMode.value = true
  showModal.value = true
}

const viewContract = (contract: Contract) => {
  selectedContract.value = contract
  showViewModal.value = true
}

const printContract = (contract: Contract) => {
  // Open contract in new window for printing
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Contract ${contract.contractNo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .contract-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CHANNEL 24 LTD.</h1>
            <h2>TELEVISION CONTRACT</h2>
          </div>
          <div class="contract-details">
            <p><strong>Contract No:</strong> ${contract.contractNo}</p>
            <p><strong>Contract Date:</strong> ${contract.contractDate}</p>
            <p><strong>Advertiser:</strong> ${contract.advertiser}</p>
            <p><strong>Product:</strong> ${contract.product}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>SL#</th>
                <th>PARTICULARS</th>
                <th>QTY</th>
                <th>RATE (Tk.)</th>
                <th>AMOUNT (Tk.)</th>
              </tr>
            </thead>
            <tbody>
              ${contract.items.map(item => `
                <tr>
                  <td>${item.sl}</td>
                  <td>${item.particulars}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.rate)}</td>
                  <td>${formatCurrency(item.amount)}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="4"><strong>SPOT TOTAL Tk</strong></td>
                <td><strong>${formatCurrency(contract.spotTotal)}</strong></td>
              </tr>
              <tr>
                <td colspan="4">Plus ${contract.vatPercentage}% VAT on Tk ${contract.spotTotal.toLocaleString()}</td>
                <td>${formatCurrency(contract.vatAmount)}</td>
              </tr>
              <tr>
                <td colspan="4"><strong>GRAND TOTAL</strong></td>
                <td><strong>${formatCurrency(contract.grandTotal)}</strong></td>
              </tr>
            </tbody>
          </table>
          <p><strong>In Words:</strong> ${contract.grandTotalWords}</p>
          <script>window.print(); window.close();<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

const deleteContract = async (id: number) => {
try {
await ElMessageBox.confirm(
'This will permanently delete the contract. Continue?',
'Warning',
{
confirmButtonText: 'Delete',
cancelButtonText: 'Cancel',
type: 'warning',
}
)

const result = await contractsStore.deleteContract(id)
if (result.success) {
ElMessage.success('Contract deleted successfully')
} else {
ElMessage.error(result.message || 'Failed to delete contract')
}
} catch {
ElMessage.info('Delete cancelled')
}
}

const handleSave = async (contractData: Contract) => {
let result

if (isEditMode.value && selectedContract.value?.id) {
result = await contractsStore.updateContract(selectedContract.value.id, contractData)
} else {
result = await contractsStore.createContract(contractData)
}

if (result.success) {
showModal.value = false
ElMessage.success(isEditMode.value ? 'Contract updated successfully' : 'Contract created successfully')
} else {
ElMessage.error(result.message || 'Operation failed')
}
}

const formatStatus = (status: string) => {
const statusMap = {
draft: 'Draft',
active: 'Active',
completed: 'Completed',
cancelled: 'Cancelled'
}
return statusMap[status as keyof typeof statusMap] || status
}

const getStatusColor = (status: string) => {
const colorMap = {
draft: 'info',
active: 'success',
completed: 'primary',
cancelled: 'danger'
}
return colorMap[status as keyof typeof colorMap] || 'default'
}

onMounted(() => {
// Contracts are already loaded from store
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

.contracts-table-card {
  --el-card-padding: 24px;
  border-radius: 12px;
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

.duration-text,
.amount-text {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mr-2 {
  margin-right: 8px;
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

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
<template>
  <div class="invoices-page">
    <div class="page-header">
      <div class="header-left">
        <h2>Invoices</h2>
        <p class="text-gray-500">Generate and view invoices for contracts</p>
      </div>
      <div class="header-right">
        <el-input v-model="searchQuery"
          :placeholder="activeTab === 'contracts' ? 'Search contracts...' : 'Search invoices...'" prefix-icon="Search"
          class="search-input" clearable @input="handleSearch" />
        <el-button type="primary" :icon="Plus" @click="handleAddInvoice">Add Invoice</el-button>
      </div>
    </div>

    <!-- Tabs -->
    <el-tabs v-model="activeTab" class="invoice-tabs" @tab-change="handleTabChange">
      <!-- Contracts Tab -->
      <el-tab-pane label="All Contracts" name="contracts">
        <el-card class="table-card" shadow="never">
          <el-table v-loading="loading" :data="filteredContracts" style="width: 100%" border stripe>
            <el-table-column prop="televisionContractNo" label="Contract No" width="180" sortable />
            <el-table-column label="Contract Date" width="180" align="center">
              <template #default="{ row }">
                {{ row.contractDate }}
              </template>
            </el-table-column>
            <el-table-column label="Client/Agency" min-width="200">
              <template #default="{ row }">
                <div class="client-info">
                  <span class="font-medium">
                    {{ row.contractedClient?.clintName || row.contractedAgency?.agencyName || 'N/A' }}
                    <el-tag size="small" :type="row.contractedClient ? 'success' : 'warning'">
                      {{ row.contractedClient ? 'Client' : 'Agency' }}
                    </el-tag>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Total" width="140" align="right">
              <template #default="{ row }">
                <span class="amount">{{ formatCurrency(row.total || 0) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="200" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="success" size="small" plain
                  @click="generateInvoiceFromContract(row.guid, row.televisionContractNo)">
                  <el-icon class="mr-1">
                    <Check />
                  </el-icon>
                  Approve
                </el-button>
                <el-button type="primary" size="small" plain @click="handleViewInvoice(row)">
                  <el-icon class="mr-1">
                    <Document />
                  </el-icon>
                  View
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Approved Invoices Tab -->
      <el-tab-pane label="Approved Invoices" name="approved">
        <el-card class="table-card" shadow="never">
          <el-table v-loading="loading" :data="filteredInvoices" style="width: 100%" border stripe
            :empty-text="invoices.length === 0 ? 'No invoices found' : 'No matching invoices'">
            <el-table-column prop="number" label="Invoice No" width="150" sortable />
            <el-table-column label="Client" min-width="200">
              <template #default="{ row }">
                <div class="client-info">
                  <span class="font-medium">{{ row.billTo?.name || 'N/A' }}</span>
                  <span class="client-address">{{ row.billTo?.address?.split('\n')[0] || '' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Contract No" width="180">
              <template #default="{ row }">
                {{ row.contractNo || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column label="Invoice Date" width="130" align="center">
              <template #default="{ row }">
                {{ row.date || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column label="Due Date" width="130" align="center">
              <template #default="{ row }">
                <span :class="{ 'text-danger': isOverdue(row.dueDate) }">
                  {{ row.dueDate || 'N/A' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Grand Total" width="140" align="right">
              <template #default="{ row }">
                <span class="amount">{{ formatCurrency(row.grandTotal || 0) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status?.statusName)" size="small">
                  {{ row.status?.statusName || 'Unknown' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="180" align="center" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-tooltip content="View Invoice" placement="top">
                    <el-button type="primary" size="small" :icon="View" circle
                      @click="handleViewApprovedInvoice(row)" />
                  </el-tooltip>
                  <el-tooltip content="Edit" placement="top">
                    <el-button type="warning" size="small" :icon="Edit" circle @click="handleEditInvoice(row)" />
                  </el-tooltip>
                  <el-tooltip content="Delete" placement="top">
                    <el-button type="danger" size="small" :icon="Delete" circle @click="handleDeleteInvoice(row)" />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- Pagination -->
          <div class="pagination-wrapper" v-if="pagination.totalCount > 0">
            <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]" :total="pagination.totalCount"
              layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
              @current-change="handlePageChange" />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- Invoice Modal for Contracts -->
    <InvoiceViewModal v-model="showInvoiceModal" :contract="selectedContract" />

    <!-- Invoice Modal for Viewing Approved Invoices -->
    <el-dialog v-model="showApprovedInvoiceModal" title="Invoice Details" width="800px" top="5vh">
      <div v-if="selectedInvoice" class="invoice-preview">
        <div class="preview-header">
          <div class="preview-row">
            <span class="label">Invoice No:</span>
            <span class="value">{{ selectedInvoice.number }}</span>
          </div>
          <div class="preview-row">
            <span class="label">Date:</span>
            <span class="value">{{ selectedInvoice.date }}</span>
          </div>
          <div class="preview-row">
            <span class="label">Contract No:</span>
            <span class="value">{{ selectedInvoice.contractNo }}</span>
          </div>
        </div>

        <el-divider />

        <div class="preview-section">
          <h4>Bill To</h4>
          <p class="font-medium">{{ selectedInvoice.billTo?.name }}</p>
          <p class="text-gray-500">{{ selectedInvoice.billTo?.address }}</p>
        </div>

        <el-divider />

        <div class="preview-section">
          <h4>Products & Items</h4>
          <template v-for="(product, pIndex) in selectedInvoice.products" :key="pIndex">
            <div class="product-preview-header" v-if="selectedInvoice.products && selectedInvoice.products.length > 1">
              <strong>{{ product.productName }}</strong>
            </div>
            <el-table :data="product.items" border size="small" class="mb-4">
              <el-table-column prop="sl" label="SL" width="60" align="center" />
              <el-table-column prop="particularsName" label="Particulars" min-width="200" />
              <el-table-column prop="quantity" label="Qty" width="80" align="center" />
              <el-table-column prop="rate" label="Rate" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.rate) }}
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="Amount" width="120" align="right">
                <template #default="{ row }">
                  {{ formatCurrency(row.amount) }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>

        <div class="preview-totals">
          <div class="total-row">
            <span>Spot Total:</span>
            <span>{{ formatCurrency(selectedInvoice.spotTotal) }}</span>
          </div>
          <div class="total-row">
            <span>VAT ({{ selectedInvoice.vatPercentage }}%):</span>
            <span>{{ formatCurrency(selectedInvoice.vatAmount) }}</span>
          </div>
          <div class="total-row grand">
            <span>Grand Total:</span>
            <span>{{ formatCurrency(selectedInvoice.grandTotal) }}</span>
          </div>
          <div class="total-row words">
            <span>In Words:</span>
            <span>{{ selectedInvoice.grandTotalWords }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showApprovedInvoiceModal = false">Close</el-button>
        <el-button type="primary" :icon="Printer" @click="handlePrintInvoice">Print</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Document, Check } from '@element-plus/icons-vue'
import { Plus, View, Edit, Delete, Printer } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { contractService } from '@/services/Contracts/contract.services'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'
import InvoiceViewModal from '@/components/modals/InvoiceViewModal.vue'
import invoiceService from '@/services/Invoices/invoice.services'
import type { IInvoiceQueryRequest, IInvoiceResponse } from '@/interface/invoice/invoice.interface'

// State
const loading = ref(false)
const contracts = ref<ITelevisionContract[]>([])
const invoices = ref<IInvoiceResponse[]>([])
const searchQuery = ref('')
const activeTab = ref('contracts')

// Modals
const showInvoiceModal = ref(false)
const showApprovedInvoiceModal = ref(false)
const selectedContract = ref<ITelevisionContract | null>(null)
const selectedInvoice = ref<IInvoiceResponse | null>(null)

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false
})

// Load Contracts
const loadContracts = async () => {
  loading.value = true
  try {
    const response = await contractService.getAllTelevisionContracts()
    contracts.value = response
  } catch (error) {
    console.error('Failed to load contracts:', error)
    ElMessage.error('Failed to load contracts')
  } finally {
    loading.value = false
  }
}

// Load Invoices
const getAllInvoices = async (query?: IInvoiceQueryRequest) => {
  loading.value = true
  try {
    const params: IInvoiceQueryRequest = {
      page: query?.page || pagination.value.page,
      pageSize: query?.pageSize || pagination.value.pageSize,
      search: searchQuery.value || undefined,
      ...query
    }
    const response = await invoiceService.getAllInvoices(params)
    invoices.value = response.data
    pagination.value = {
      page: response.page,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      hasNextPage: response.hasNextPage,
      hasPreviousPage: response.hasPreviousPage
    }
  } catch (error) {
    console.error('Failed to load invoices:', error)
    ElMessage.error('Failed to load invoices')
  } finally {
    loading.value = false
  }
}

// Get contract numbers that already have invoices
const invoicedContractNumbers = computed(() => {
  return new Set(invoices.value.map(inv => inv.contractNo))
})

// Computed - Filtered Contracts (excludes contracts that already have invoices)
const filteredContracts = computed(() => {
  // First filter out contracts that already have approved invoices
  let result = contracts.value.filter(c =>
    !invoicedContractNumbers.value.has(c.televisionContractNo)
  )

  // Then apply search filter if there's a search query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      (c.contractedClient?.clintName?.toLowerCase().includes(q)) ||
      (c.contractedAgency?.agencyName?.toLowerCase().includes(q)) ||
      c.televisionContractNo?.toLowerCase().includes(q)
    )
  }

  return result
})

// Computed - Filtered Invoices
const filteredInvoices = computed(() => {
  if (!searchQuery.value) return invoices.value
  const q = searchQuery.value.toLowerCase()
  return invoices.value.filter(inv =>
    inv.number?.toLowerCase().includes(q) ||
    inv.billTo?.name?.toLowerCase().includes(q) ||
    inv.contractNo?.toLowerCase().includes(q) ||
    inv.advertiser?.toLowerCase().includes(q)
  )
})

// Handlers
const handleViewInvoice = (contract: ITelevisionContract) => {
  selectedContract.value = contract
  showInvoiceModal.value = true
}

const handleViewApprovedInvoice = (invoice: IInvoiceResponse) => {
  selectedInvoice.value = invoice
  showApprovedInvoiceModal.value = true
}

const handleEditInvoice = (invoice: IInvoiceResponse) => {
  // TODO: Implement edit functionality
  ElMessage.info(`Edit invoice: ${invoice.number}`)
}

const handleDeleteInvoice = async (invoice: IInvoiceResponse) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete invoice "${invoice.number}"?`,
      'Delete Invoice',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    loading.value = true
    await invoiceService.deleteInvoice(invoice.guid)
    ElMessage.success('Invoice deleted successfully')
    await getAllInvoices()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete invoice:', error)
      ElMessage.error('Failed to delete invoice')
    }
  } finally {
    loading.value = false
  }
}

const handleAddInvoice = () => {
  // Switch to contracts tab to select a contract
  activeTab.value = 'contracts'
  ElMessage.info('Select a contract to generate an invoice')
}

const handlePrintInvoice = () => {
  window.print()
}

const handleSearch = () => {
  if (activeTab.value === 'approved') {
    getAllInvoices({ page: 1 })
  }
}

const handleTabChange = (tab: string | number) => {
  searchQuery.value = ''
  if (tab === 'approved') {
    getAllInvoices()
  }
}

const handlePageChange = (page: number) => {
  getAllInvoices({ page })
}

const handleSizeChange = (size: number) => {
  getAllInvoices({ page: 1, pageSize: size })
}

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const isOverdue = (dueDate: string) => {
  if (!dueDate) return false
  try {
    const due = new Date(dueDate)
    return due < new Date()
  } catch {
    return false
  }
}

const getStatusType = (status?: string): 'success' | 'warning' | 'danger' | 'info' | '' => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'success'
    case 'sent':
      return 'info'
    case 'draft':
      return 'warning'
    case 'overdue':
    case 'cancelled':
      return 'danger'
    default:
      return ''
  }
}

// Generate invoice from contract
const generateInvoiceFromContract = async (guid: string, contractNo: string) => {
  try {
    loading.value = true
    const response = await invoiceService.generateInvoiceFromContract(guid, contractNo)
    if (response.statusCode === 201) {
      ElMessage.success('Invoice generated successfully')
      // Refresh invoices list and switch to approved tab
      await getAllInvoices()
      activeTab.value = 'approved'
    } else {
      ElMessage.error('Failed to generate invoice')
    }
  } catch (error) {
    console.error('Failed to generate invoice:', error)
    ElMessage.error('Failed to generate invoice')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContracts()
  getAllInvoices()
})
</script>

<style scoped>
.invoices-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--el-text-color-primary);
}

.header-left p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 280px;
}

.invoice-tabs {
  margin-top: 8px;
}

.table-card {
  border-radius: 12px;
}

.client-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.client-address {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.amount {
  font-weight: 600;
  color: var(--el-color-primary);
}

.text-danger {
  color: var(--el-color-danger);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 16px;
}

/* Invoice Preview Styles */
.invoice-preview {
  padding: 16px;
}

.preview-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.preview-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-row .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.preview-row .value {
  font-weight: 600;
  font-size: 14px;
}

.preview-section {
  margin: 16px 0;
}

.preview-section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.preview-totals {
  background: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.total-row:last-child {
  border-bottom: none;
}

.total-row.grand {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.total-row.words {
  font-style: italic;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.product-preview-header {
  background: var(--el-fill-color);
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
}

.mb-4 {
  margin-bottom: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-right {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .preview-header {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 1024px) {
  :deep(.el-table) {
    font-size: 12px;
  }

  .pagination-wrapper {
    justify-content: center;
  }

  :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
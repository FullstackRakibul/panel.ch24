<template>
  <div class="invoices-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Invoice Management</h1>
        <p class="page-subtitle">Create and manage invoices for your contracts</p>
      </div>
      <el-button type="primary" size="large" @click="openCreateModal">
        <el-icon class="mr-2">
          <Plus />
        </el-icon>
        New Invoice
      </el-button>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="24" class="stats-section">
      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon total">
              <el-icon size="24">
                <Receipt />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ invoices.length }}</div>
              <div class="stats-label">Total Invoices</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon paid">
              <el-icon size="24">
                <CircleCheck />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ paidInvoices }}</div>
              <div class="stats-label">Paid</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon pending">
              <el-icon size="24">
                <Clock />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ pendingInvoices }}</div>
              <div class="stats-label">Pending</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="6">
        <div class="stats-card">
          <div class="stats-content">
            <div class="stats-icon overdue">
              <el-icon size="24">
                <AlertCircle />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ overdueInvoices }}</div>
              <div class="stats-label">Overdue</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Invoices Table -->
    <el-card class="invoices-table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>Invoices</h3>
          <div class="header-actions">
            <el-input v-model="searchQuery" placeholder="Search invoices..." :prefix-icon="Search" clearable
              @input="handleSearch" />
            <el-select v-model="selectedStatus" placeholder="All Status" clearable @change="handleFilter">
              <el-option label="Draft" value="draft" />
              <el-option label="Sent" value="sent" />
              <el-option label="Paid" value="paid" />
              <el-option label="Overdue" value="overdue" />
              <el-option label="Cancelled" value="cancelled" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredInvoices" style="width: 100%" :default-sort="{ prop: 'createdAt', order: 'descending' }"
        empty-text="No invoices found" v-loading="invoicesStore.loading">
        <el-table-column label="Invoice No" prop="number" width="150" sortable />

        <el-table-column label="Client" prop="billTo.name" min-width="200" />

        <el-table-column label="Advertiser" prop="advertiser" min-width="150" />

        <el-table-column label="Invoice Date" prop="date" width="120" sortable />

        <el-table-column label="Due Date" prop="dueDate" width="120" sortable />

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

        <el-table-column label="Actions" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="viewInvoice(row)" :icon="Eye" size="small">
                View
              </el-button>
              <el-button type="success" link @click="editInvoice(row)" :icon="Edit" size="small">
                Edit
              </el-button>
              <el-button type="info" link @click="printInvoice(row)" :icon="Printer" size="small">
                Print
              </el-button>
              <el-dropdown @command="(command: string) => handleStatusChange(row, command as Invoice['status'])">
                <el-button type="warning" link size="small">
                  Status <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="draft">Mark as Draft</el-dropdown-item>
                    <el-dropdown-item command="sent">Mark as Sent</el-dropdown-item>
                    <el-dropdown-item command="paid">Mark as Paid</el-dropdown-item>
                    <el-dropdown-item command="overdue">Mark as Overdue</el-dropdown-item>
                    <el-dropdown-item command="cancelled">Mark as Cancelled</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button type="danger" link @click="deleteInvoice(row.id!)" :icon="Trash2" size="small">
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Invoice Modal -->
    <InvoiceModal v-model="showModal" :invoice="selectedInvoice" :is-edit="isEditMode" :loading="invoicesStore.loading"
      @save="handleSave" />

    <!-- Invoice View Modal -->
    <InvoiceViewModal v-model="showViewModal" :invoice="selectedInvoice" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useInvoicesStore, type Invoice } from '@/stores/invoices'
import InvoiceModal from '@/components/forms/InvoiceModal.vue'
import InvoiceViewModal from '@/components/modals/InvoiceViewModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Receipt,
  CircleCheck,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Printer,
  ArrowDown,
  Trash2
} from 'lucide-vue-next'
// Simple currency formatter for BDT (Taka)
function formatCurrency(amount: number) {
  return amount.toLocaleString('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 2 }).replace('BDT', '৳');
}

const invoicesStore = useInvoicesStore()

const searchQuery = ref('')
const selectedStatus = ref('')
const showModal = ref(false)
const showViewModal = ref(false)
const isEditMode = ref(false)
const selectedInvoice = ref<Invoice | null>(null)

const invoices = computed(() => invoicesStore.invoices)
const paidInvoices = computed(() => invoices.value.filter(i => i.status === 'paid').length)
const pendingInvoices = computed(() => invoices.value.filter(i => i.status === 'sent').length)
const overdueInvoices = computed(() => invoices.value.filter(i => i.status === 'overdue').length)

const filteredInvoices = computed(() => {
  let filtered = [...invoices.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(invoice =>
      invoice.number.toLowerCase().includes(query) ||
      invoice.billTo.name.toLowerCase().includes(query) ||
      invoice.advertiser.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(invoice => invoice.status === selectedStatus.value)
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
  selectedInvoice.value = null
  isEditMode.value = false
  showModal.value = true
}

const editInvoice = (invoice: Invoice) => {
  selectedInvoice.value = invoice
  isEditMode.value = true
  showModal.value = true
}

const viewInvoice = (invoice: Invoice) => {
  selectedInvoice.value = invoice
  showViewModal.value = true
}

const printInvoice = (invoice: Invoice) => {
  // Open invoice in new window for printing
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .invoice-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CHANNEL 24 LTD.</h1>
            <h2>INVOICE FOR THE MONTH OF ${invoice.date}</h2>
          </div>
          <div class="invoice-details">
            <p><strong>To:</strong> ${invoice.billTo.name}</p>
            <p>${invoice.billTo.address}</p>
            <br>
            <p><strong>Invoice No:</strong> ${invoice.number}</p>
            <p><strong>Invoice Date:</strong> ${invoice.date}</p>
            <p><strong>Contract No:</strong> ${invoice.contractNo}</p>
            <p><strong>Contract Date:</strong> ${invoice.contractDate}</p>
            <br>
            <p><strong>Advertiser:</strong> ${invoice.advertiser}</p>
            <p><strong>Product:</strong> ${invoice.product}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>SL#</th>
                <th>PARTICULARS</th>
                <th>QUANTITY</th>
                <th>RATE (Tk.)</th>
                <th>AMOUNT (Tk.)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
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
                <td><strong>${formatCurrency(invoice.spotTotal)}</strong></td>
              </tr>
              <tr>
                <td colspan="4">Plus ${invoice.vatPercentage}% VAT on Tk ${invoice.spotTotal.toLocaleString()}</td>
                <td>${formatCurrency(invoice.vatAmount)}</td>
              </tr>
            </tbody>
          </table>
          <p><strong>In Words:</strong> ${invoice.grandTotalWords}</p>
          <p><strong>Grand Total:</strong> Tk ${formatCurrency(invoice.grandTotal)}</p>
          <script>window.print(); window.close();<\/script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}

const handleStatusChange = async (invoice: Invoice, status: Invoice['status']) => {
const result = await invoicesStore.updateInvoiceStatus(invoice.id!, status)
if (result.success) {
ElMessage.success(`Invoice status updated to ${formatStatus(status)}`)
} else {
ElMessage.error(result.message || 'Failed to update status')
}
}

const deleteInvoice = async (id: number) => {
try {
await ElMessageBox.confirm(
'This will permanently delete the invoice. Continue?',
'Warning',
{
confirmButtonText: 'Delete',
cancelButtonText: 'Cancel',
type: 'warning',
}
)

const result = await invoicesStore.deleteInvoice(id)
if (result.success) {
ElMessage.success('Invoice deleted successfully')
} else {
ElMessage.error(result.message || 'Failed to delete invoice')
}
} catch {
ElMessage.info('Delete cancelled')
}
}

const handleSave = async (invoiceData: Invoice) => {
let result

if (isEditMode.value && selectedInvoice.value?.id) {
result = await invoicesStore.updateInvoice(selectedInvoice.value.id, invoiceData)
} else {
result = await invoicesStore.createInvoice(invoiceData)
}

if (result.success) {
showModal.value = false
ElMessage.success(isEditMode.value ? 'Invoice updated successfully' : 'Invoice created successfully')
} else {
ElMessage.error(result.message || 'Operation failed')
}
}

const formatStatus = (status: string) => {
const statusMap = {
draft: 'Draft',
sent: 'Sent',
paid: 'Paid',
overdue: 'Overdue',
cancelled: 'Cancelled'
}
return statusMap[status as keyof typeof statusMap] || status
}

const getStatusColor = (status: string) => {
const colorMap = {
draft: 'info',
sent: 'warning',
paid: 'success',
overdue: 'danger',
cancelled: 'info'
}
return colorMap[status as keyof typeof colorMap] || 'default'
}

onMounted(() => {
// Invoices are already loaded from store
})
</script>

<style scoped>
.invoices-container {
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

.stats-icon.paid {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stats-icon.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.stats-icon.overdue {
  background: linear-gradient(135deg, #ef4444, #dc2626);
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

.invoices-table-card {
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
  .invoices-container {
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
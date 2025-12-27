<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Payment' : 'Add New Payment'" width="1200px"
    :close-on-click-modal="false" :close-on-press-escape="false" class="payment-modal font-sans" top="3vh">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default" class="payment-form">
      <!-- Contract Selection Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon blue">
              <FileText class="w-4 h-4" />
            </span>
            Contract Selection
          </h3>
        </div>

        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="Search Contract/Invoice" prop="contractId">
              <div class="search-container w-full">
                <el-input v-model="searchQuery" placeholder="Type to search..." clearable @input="handleSearchInput"
                  @focus="showSearchResults = true" @blur="handleSearchBlur">
                  <template #prepend>
                    <el-select v-model="searchCategory" style="width: 140px" @change="executeSearch">
                      <el-option label="Contract No" value="contractNo" />
                      <el-option label="Client Name" value="client" />
                      <el-option label="Agency Name" value="agency" />
                      <el-option label="Status" value="status" />
                    </el-select>
                  </template>
                  <template #append>
                    <el-button :icon="Search" @click="executeSearch" />
                  </template>
                </el-input>

                <!-- Search Results Dropdown -->
                <div v-if="showSearchResults && filteredSearchResults.length > 0" class="search-results-dropdown">
                  <div v-for="contract in filteredSearchResults" :key="contract.guid" class="search-result-item"
                    @mousedown.prevent="selectSearchResult(contract)">
                    <div class="result-main">
                      <span class="contract-no">{{ contract.televisionContractNo }}</span>
                      <el-tag size="small" :type="getPaymentStatusType(contract)">
                        {{ getPaymentStatus(contract) }}
                      </el-tag>
                    </div>
                    <div class="result-sub">
                      <span class="client-name">
                        {{ contract.contractedClient?.clintName || contract.contractedAgency?.agencyName || 'N/A' }}
                      </span>
                      <span class="amount">Tk. {{ formatCurrency(contract.total || 0) }}</span>
                    </div>
                  </div>
                </div>

                <!-- No Results Message -->
                <div v-if="showSearchResults && filteredSearchResults.length === 0 && searchQuery.trim()"
                  class="search-results-dropdown no-results">
                  <p>No contracts found matching "{{ searchQuery }}"</p>
                  <p class="hint">Try searching by {{ searchCategory === 'contractNo' ? 'contract number' :
                    searchCategory }}</p>
                </div>

                <!-- Selected Contract Display -->
                <div v-if="selectedContract && !showSearchResults" class="selected-contract-badge">
                  <span class="badge-label">Selected:</span>
                  <span class="badge-value">{{ selectedContract.televisionContractNo }}</span>
                  <span class="badge-client">
                    - {{ selectedContract.contractedClient?.clintName || selectedContract.contractedAgency?.agencyName
                    }}
                  </span>
                  <el-button text type="primary" size="small" @click="clearSelection">Change</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Payment Reference" prop="paymentReference">
              <el-input v-model="form.paymentReference" placeholder="Auto-generated" readonly>
                <template #prefix>
                  <Hash class="w-4 h-4 text-gray-400" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Contract Summary Card -->
        <div v-if="selectedContract" class="contract-summary-card">
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Contract No</span>
              <span class="summary-value">{{ selectedContract.televisionContractNo }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">{{ selectedContract.contractedClient ? 'Client' : 'Agency' }}</span>
              <span class="summary-value">
                {{ selectedContract.contractedClient?.clintName || selectedContract.contractedAgency?.agencyName }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Contract Period</span>
              <span class="summary-value">
                {{ formatDate(selectedContract.contractStartDate) }} - {{ formatDate(selectedContract.contractEndDate)
                }}
              </span>
            </div>
            <div class="summary-item highlight">
              <span class="summary-label">Contract Amount</span>
              <span class="summary-value">Tk. {{ formatCurrency(contractTotals.contractAmount) }}</span>
            </div>
            <div class="summary-item highlight">
              <span class="summary-label">VAT ({{ contractTotals.vatRate }}%)</span>
              <span class="summary-value">Tk. {{ formatCurrency(contractTotals.vatAmount) }}</span>
            </div>
            <div class="summary-item highlight primary">
              <span class="summary-label">Total Amount</span>
              <span class="summary-value">Tk. {{ formatCurrency(contractTotals.totalAmount) }}</span>
            </div>
          </div>

          <!-- Payment Status Bar -->
          <div class="payment-status-bar">
            <div class="status-header">
              <span>Payment Progress</span>
              <span class="status-percentage">{{ paymentPercentage }}% Paid</span>
            </div>
            <el-progress :percentage="paymentPercentage" :stroke-width="12" :color="progressColor" />
            <div class="status-details">
              <div class="status-detail">
                <span class="detail-label">Paid</span>
                <span class="detail-value success">Tk. {{ formatCurrency(dueAmounts.paidTotalAmount) }}</span>
              </div>
              <div class="status-detail">
                <span class="detail-label">Due</span>
                <span class="detail-value danger">Tk. {{ formatCurrency(dueAmounts.dueTotalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Details Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon green">
              <CreditCard class="w-4 h-4" />
            </span>
            Payment Details
          </h3>
        </div>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Payment Date" prop="paymentDate">
              <el-date-picker v-model="form.paymentDate" type="date" placeholder="Select date" class="w-full"
                format="DD MMM, YYYY" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Payment Type" prop="paymentType">
              <el-select v-model="form.paymentType" placeholder="Select type" class="w-full">
                <el-option label="Cash" value="Cash">
                  <div class="flex items-center gap-2">
                    <Banknote class="w-4 h-4" />
                    <span>Cash</span>
                  </div>
                </el-option>
                <el-option label="Bank Transfer" value="Bank Transfer">
                  <div class="flex items-center gap-2">
                    <Building2 class="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>
                </el-option>
                <el-option label="Check" value="Check">
                  <div class="flex items-center gap-2">
                    <FileCheck class="w-4 h-4" />
                    <span>Check</span>
                  </div>
                </el-option>
                <el-option label="Online" value="Online">
                  <div class="flex items-center gap-2">
                    <Globe class="w-4 h-4" />
                    <span>Online</span>
                  </div>
                </el-option>
                <el-option label="Mobile Banking" value="Mobile Banking">
                  <div class="flex items-center gap-2">
                    <Smartphone class="w-4 h-4" />
                    <span>Mobile Banking</span>
                  </div>
                </el-option>
                <el-option label="Other" value="Other">
                  <div class="flex items-center gap-2">
                    <CircleDot class="w-4 h-4" />
                    <span>Other</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Payment Mode" prop="paymentMode">
              <el-radio-group v-model="form.paymentMode" class="w-full" @change="handlePaymentModeChange">
                <el-radio-button label="Partial Payment">Partial</el-radio-button>
                <el-radio-button label="Full Payment">Full Payment</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Payment Category" prop="paymentCategory">
              <el-select v-model="form.paymentCategory" placeholder="Select category" class="w-full"
                @change="handleCategoryChange">
                <el-option label="Contract Amount Only" value="Contract Amount" />
                <el-option label="VAT Amount Only" value="VAT Amount" />
                <el-option label="Both (Contract + VAT)" value="Both" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Received By">
              <el-input v-model="form.receivedBy" placeholder="Enter name" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Bank/Check Details Section (Conditional) -->
      <div v-if="showBankDetails" class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon orange">
              <Building2 class="w-4 h-4" />
            </span>
            {{ form.paymentType === 'Check' ? 'Check Details' : 'Bank Details' }}
          </h3>
        </div>

        <el-row :gutter="20">
          <el-col v-if="form.paymentType === 'Check'" :span="8">
            <el-form-item label="Check Reference">
              <el-input v-model="form.checkRef" placeholder="Enter check number">
                <template #prefix>
                  <FileCheck class="w-4 h-4 text-gray-400" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="form.paymentType === 'Bank Transfer' || form.paymentType === 'Check'" :span="8">
            <el-form-item label="Bank Name">
              <el-input v-model="form.bankName" placeholder="Enter bank name" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.paymentType === 'Bank Transfer' || form.paymentType === 'Check'" :span="8">
            <el-form-item label="Branch Name">
              <el-input v-model="form.branchName" placeholder="Enter branch name" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.paymentType === 'Bank Transfer'" :span="8">
            <el-form-item label="Bank Reference / Transaction ID">
              <el-input v-model="form.bankRef" placeholder="Enter reference number" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.paymentType === 'Online' || form.paymentType === 'Mobile Banking'" :span="8">
            <el-form-item label="Transaction ID">
              <el-input v-model="form.transactionId" placeholder="Enter transaction ID" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Amount Input Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon purple">
              <Calculator class="w-4 h-4" />
            </span>
            Payment Amount
          </h3>
        </div>
        <div class="amount-input-grid">
          <!-- Contract Amount -->
          <div class="amount-card" :class="{ disabled: form.paymentCategory === 'VAT Amount' }">
            <div class="amount-card-header">
              <span class="amount-label">Contract Amount</span>
              <el-tag size="small" type="info">Due: Tk. {{ formatCurrency(dueAmounts.dueContractAmount) }}</el-tag>
            </div>
            <el-form-item prop="contractAmountPaid">
              <el-input-number v-model="form.contractAmountPaid" :min="0" :max="dueAmounts.dueContractAmount"
                :precision="2" :disabled="form.paymentCategory === 'VAT Amount'" controls-position="right"
                class="w-full amount-input" @change="validateAmounts" />
            </el-form-item>
            <div class="amount-remaining">
              Remaining: Tk. {{ formatCurrency(dueAmounts.dueContractAmount - form.contractAmountPaid) }}
            </div>
          </div>

          <!-- VAT Amount -->
          <div class="amount-card" :class="{ disabled: form.paymentCategory === 'Contract Amount' }">
            <div class="amount-card-header">
              <span class="amount-label">VAT Amount</span>
              <el-tag size="small" type="warning">Due: Tk. {{ formatCurrency(dueAmounts.dueVatAmount) }}</el-tag>
            </div>
            <el-form-item prop="vatAmountPaid">
              <el-input-number v-model="form.vatAmountPaid" :min="0" :max="dueAmounts.dueVatAmount" :precision="2"
                :disabled="form.paymentCategory === 'Contract Amount'" controls-position="right"
                class="w-full amount-input" @change="validateAmounts" />
            </el-form-item>
            <div class="amount-remaining">
              Remaining: Tk. {{ formatCurrency(dueAmounts.dueVatAmount - form.vatAmountPaid) }}
            </div>
          </div>

          <!-- Total Payment -->
          <div class="amount-card total">
            <div class="amount-card-header">
              <span class="amount-label">Total Payment</span>
            </div>
            <div class="total-amount">
              <span class="currency">Tk.</span>
              <span class="value">{{ formatCurrency(totalPaymentAmount) }}</span>
            </div>
            <div class="amount-words">
              {{ numberToWords(totalPaymentAmount) }}
            </div>
          </div>
        </div>
      </div>



      <!-- Remarks Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">
            <span class="section-icon gray">
              <MessageSquare class="w-4 h-4" />
            </span>
            Remarks
          </h3>
        </div>
        <el-form-item>
          <el-input v-model="form.remarks" type="textarea" :rows="3"
            placeholder="Enter any additional notes or remarks about this payment" />
        </el-form-item>
      </div>

      <!-- Payment Summary -->
      <div class="form-section summary-section">
        <div class="payment-summary">
          <div class="summary-row">
            <span>Contract Amount Paying:</span>
            <span>Tk. {{ formatCurrency(form.contractAmountPaid) }}</span>
          </div>
          <div class="summary-row">
            <span>VAT Amount Paying:</span>
            <span>Tk. {{ formatCurrency(form.vatAmountPaid) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total Payment:</span>
            <span>Tk. {{ formatCurrency(totalPaymentAmount) }}</span>
          </div>
          <div class="summary-row words">
            <span>In Words:</span>
            <span>{{ numberToWords(totalPaymentAmount) }}</span>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="modal-footer">
        <div class="footer-left">
          <el-button type="warning" @click="handleReset">
            <RotateCcw class="w-4 h-4 mr-1" /> Reset
          </el-button>
        </div>
        <div class="footer-right">
          <el-button size="large" @click="handleClose">
            Cancel
          </el-button>
          <el-button type="primary" size="large" :loading="loading" :disabled="!isFormValid" @click="handleSubmit">
            {{ loading ? 'Processing...' : (isEdit ? 'Update Payment' : 'Record Payment') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import {
  FileText, CreditCard, Calculator, Building2, Hash,
  MessageSquare, RotateCcw, Banknote, FileCheck,
  Globe, Smartphone, CircleDot, Search
} from 'lucide-vue-next'
import { usePaymentStore } from '@/stores/payments'
import { paymentUtils } from '@/services/Payments/payment.services'
import { useNumberToWords } from '@/components/helper/useNumberToWords.js'

interface Props {
  modelValue: boolean
  isEdit?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [success: boolean]
}>()

const store = usePaymentStore()
const formRef = ref<FormInstance>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form data
const form = computed(() => store.currentPayment)
const contracts = computed(() => store.contracts)
const payments = computed(() => store.payments)
const selectedContract = computed(() => store.selectedContract)
const contractTotals = computed(() => store.contractTotals)
const dueAmounts = computed(() => store.dueAmounts)

// Search state
const searchCategory = ref('contractNo')
const searchQuery = ref('')
const showSearchResults = ref(false)

// Debounce timeout
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Filtered search results based on category and query
const filteredSearchResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return contracts.value.slice(0, 10) // Show first 10 when empty
  }

  const query = searchQuery.value.toLowerCase().trim()
  let results = contracts.value

  switch (searchCategory.value) {
    case 'contractNo':
      results = contracts.value.filter(c =>
        c.televisionContractNo?.toLowerCase().includes(query)
      )
      break
    case 'client':
      results = contracts.value.filter(c =>
        c.contractedClient?.clintName?.toLowerCase().includes(query)
      )
      break
    case 'agency':
      results = contracts.value.filter(c =>
        c.contractedAgency?.agencyName?.toLowerCase().includes(query)
      )
      break
    case 'status':
      results = contracts.value.filter(c => {
        const status = getPaymentStatus(c)
        return status.toLowerCase().includes(query)
      })
      break
    default:
      results = contracts.value.filter(c =>
        c.televisionContractNo?.toLowerCase().includes(query) ||
        c.contractedClient?.clintName?.toLowerCase().includes(query) ||
        c.contractedAgency?.agencyName?.toLowerCase().includes(query)
      )
  }

  return results.slice(0, 10) // Limit to 10 results
})

// Get payment status for a contract
const getPaymentStatus = (contract: any) => {
  const paid = getContractPaidAmount(contract.guid)
  const total = contract.total || 0

  if (paid === 0) return 'Pending'
  if (paid >= total) return 'Paid'
  return 'Partial'
}

// Get paid amount for a contract
const getContractPaidAmount = (contractId: string) => {
  return payments.value
    .filter((p: any) => p.contractId === contractId && p.status === 'Completed')
    .reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0)
}

// Payment status tag type
const getPaymentStatusType = (contract: any) => {
  const status = getPaymentStatus(contract)
  switch (status) {
    case 'Paid': return 'success'
    case 'Partial': return 'warning'
    default: return 'danger'
  }
}

// Search handlers
const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    showSearchResults.value = true
  }, 300) // 300ms debounce
}

const executeSearch = () => {
  showSearchResults.value = true
}

const handleSearchBlur = () => {
  // Delay hiding to allow click on results
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// Select search result
const selectSearchResult = (contract: any) => {
  store.selectContract(contract.guid)
  searchQuery.value = contract.televisionContractNo
  showSearchResults.value = false
}

// Clear selection
const clearSelection = () => {
  store.resetPaymentForm()
  searchQuery.value = ''
  showSearchResults.value = true
}

// Computed values
const totalPaymentAmount = computed(() => {
  return (form.value.contractAmountPaid || 0) + (form.value.vatAmountPaid || 0)
})

const paymentPercentage = computed(() => {
  if (contractTotals.value.totalAmount === 0) return 0
  return Math.round((dueAmounts.value.paidTotalAmount / contractTotals.value.totalAmount) * 100)
})

const progressColor = computed(() => {
  if (paymentPercentage.value >= 100) return '#67C23A'
  if (paymentPercentage.value >= 50) return '#E6A23C'
  return '#F56C6C'
})

const showBankDetails = computed(() => {
  return ['Bank Transfer', 'Check', 'Online', 'Mobile Banking'].includes(form.value.paymentType)
})

const isFormValid = computed(() => {
  return form.value.contractId &&
    form.value.paymentDate &&
    totalPaymentAmount.value > 0
})

// Validation rules
const rules = {
  contractId: [
    { required: true, message: 'Please select a contract', trigger: 'change' }
  ],
  paymentDate: [
    { required: true, message: 'Please select payment date', trigger: 'change' }
  ],
  paymentType: [
    { required: true, message: 'Please select payment type', trigger: 'change' }
  ],
  paymentCategory: [
    { required: true, message: 'Please select payment category', trigger: 'change' }
  ],
  paymentMode: [
    { required: true, message: 'Please select payment mode', trigger: 'change' }
  ]
}

// Helper functions
const formatCurrency = (value: number) => paymentUtils.formatCurrency(value)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const numberToWords = (num: number) => useNumberToWords(num)
const handlePaymentModeChange = () => {
  store.updatePaymentAmounts()
}

const handleCategoryChange = () => {
  store.updatePaymentAmounts()
}

const validateAmounts = () => {
  // Ensure amounts don't exceed due amounts
  if (form.value.contractAmountPaid > dueAmounts.value.dueContractAmount) {
    store.setPaymentField('contractAmountPaid', dueAmounts.value.dueContractAmount)
  }
  if (form.value.vatAmountPaid > dueAmounts.value.dueVatAmount) {
    store.setPaymentField('vatAmountPaid', dueAmounts.value.dueVatAmount)
  }
}

const handleReset = () => {
  store.resetPaymentForm()
  formRef.value?.clearValidate()
}

const handleClose = () => {
  store.resetPaymentForm()
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const success = await store.createPayment()

    if (success) {
      ElMessage.success('Payment recorded successfully!')
      emit('save', true)
      handleClose()
    } else {
      ElMessage.error(store.error || 'Failed to record payment')
    }
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}


// Lifecycle
onMounted(async () => {
  await store.fetchContracts()
  await store.fetchPayments()
})

watch(() => props.modelValue, (visible) => {
  if (visible) {
    store.fetchContracts()
    store.fetchPayments()
  }
})
</script>

<style scoped>
.payment-modal {
  --el-dialog-border-radius: 16px;
}

.payment-form {
  max-height: 75vh;
  overflow-y: auto;
  padding-right: 10px;
}

.form-section {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: white;
}

.section-icon.blue {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
}

.section-icon.green {
  background: linear-gradient(135deg, #67C23A, #85ce61);
}

.section-icon.purple {
  background: linear-gradient(135deg, #9c27b0, #ba68c8);
}

.section-icon.orange {
  background: linear-gradient(135deg, #E6A23C, #f0c78a);
}

.section-icon.gray {
  background: linear-gradient(135deg, #909399, #b4b4b4);
}

/* Contract Option Styling */
.contract-option {
  padding: 8px 0;
}

.contract-option-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.contract-no {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.contract-option-sub {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.contract-amount {
  font-weight: 500;
  color: var(--el-color-success);
}

/* Search Container Styling */
.search-container {
  position: relative;
}

.search-results-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: all 0.2s ease;
}

.search-result-item:hover {
  background: var(--el-fill-color-light);
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-main {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.result-main .contract-no {
  font-weight: 600;
  color: var(--el-color-primary);
  font-size: 14px;
}

.result-sub {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.result-sub .client-name {
  color: var(--el-text-color-secondary);
}

.result-sub .amount {
  font-weight: 600;
  color: var(--el-color-success);
}

.search-results-dropdown.no-results {
  padding: 20px;
  text-align: center;
}

.search-results-dropdown.no-results p {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.search-results-dropdown.no-results .hint {
  font-size: 12px;
  margin-top: 8px;
  color: var(--el-text-color-placeholder);
}

.selected-contract-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #ecf5ff, #f0f9eb);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 8px;
  margin-top: 10px;
}

.badge-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.badge-value {
  font-weight: 600;
  color: var(--el-color-primary);
}

.badge-client {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  flex: 1;
}

/* Contract Summary Card */
.contract-summary-card {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item.highlight {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.summary-item.primary {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  color: white;
}

.summary-item.primary .summary-label {
  color: rgba(255, 255, 255, 0.8);
}

.summary-item.primary .summary-value {
  color: white;
  font-size: 18px;
}

.summary-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* Payment Status Bar */
.payment-status-bar {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 500;
}

.status-percentage {
  color: var(--el-color-primary);
  font-weight: 600;
}

.status-details {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.status-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.detail-value {
  font-weight: 600;
}

.detail-value.success {
  color: var(--el-color-success);
}

.detail-value.danger {
  color: var(--el-color-danger);
}

/* Amount Input Grid */
.amount-input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 20px;
}

.amount-card {
  background: var(--el-fill-color-lighter);
  border: 2px solid var(--el-border-color);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.amount-card:hover:not(.disabled) {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.amount-card.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.amount-card.total {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  border-color: transparent;
  color: white;
}

.amount-card.total .amount-label {
  color: rgba(255, 255, 255, 0.9);
}

.amount-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.amount-label {
  font-weight: 600;
  font-size: 14px;
}

.amount-input :deep(.el-input-number) {
  width: 100%;
}

.amount-input :deep(.el-input__inner) {
  font-size: 18px;
  font-weight: 600;
  text-align: right;
}

.amount-remaining {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
  text-align: right;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.total-amount .currency {
  font-size: 16px;
  opacity: 0.9;
}

.total-amount .value {
  font-size: 28px;
  font-weight: 700;
}

.amount-words {
  font-size: 11px;
  opacity: 0.85;
  line-height: 1.4;
}

/* Payment Summary */
.payment-summary {
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  padding: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-color-primary);
  padding-top: 16px;
  margin-top: 8px;
  border-top: 2px solid var(--el-color-primary);
  border-bottom: none;
}

.summary-row.words {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-style: italic;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.footer-left,
.footer-right {
  display: flex;
  gap: 12px;
}

/* Responsive */
@media (max-width: 1200px) {
  .amount-input-grid {
    grid-template-columns: 1fr 1fr;
  }

  .amount-card.total {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .amount-input-grid {
    grid-template-columns: 1fr;
  }

  .amount-card.total {
    grid-column: span 1;
  }

  .modal-footer {
    flex-direction: column-reverse;
    gap: 12px;
  }

  .footer-left,
  .footer-right {
    width: 100%;
    justify-content: center;
  }
}
</style>
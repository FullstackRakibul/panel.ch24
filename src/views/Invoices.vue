<template>
  <div class="invoices-page">
    <div class="page-header">
      <div class="header-left">
        <h2>Invoices</h2>
        <p class="text-gray-500">Generate and view invoices for contracts</p>
      </div>
      <div class="header-right">
        <el-input v-model="searchQuery" placeholder="Search contracts..." prefix-icon="Search" class="search-input"
          clearable @input="handleSearch" />
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table v-loading="loading" :data="filteredContracts" style="width: 100%" border stripe>
        <el-table-column prop="televisionContractNo" label="Contract No" width="180" sortable />
        <el-table-column label="Client/Agency" min-width="200">
          <template #default="{ row }">
            <div class="client-info">
              <span class="font-medium">
                {{ row.contractedClient?.clintName || row.contractedAgency?.agencyName || 'N/A' }}
              </span>
              <el-tag size="small" :type="row.contractedClient ? 'success' : 'warning'">
                {{ row.contractedClient ? 'Client' : 'Agency' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Invoice" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" plain @click="handleViewInvoice(row)">
              <el-icon class="mr-1">
                <Document />
              </el-icon>
              View Invoice
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Invoice Modal -->
    <InvoiceViewModal v-model="showInvoiceModal" :contract="selectedContract" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { contractService } from '@/services/Contracts/contract.services'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'
import InvoiceViewModal from '@/components/modals/InvoiceViewModal.vue'

const loading = ref(false)
const contracts = ref<ITelevisionContract[]>([])
const searchQuery = ref('')

const showInvoiceModal = ref(false)
const selectedContract = ref<ITelevisionContract | null>(null)

const loadContracts = async () => {
  loading.value = true
  try {
    const response = await contractService.getAllTelevisionContracts()
    contracts.value = response
  } catch (error) {
    console.error('Failed to load contracts:', error)
  } finally {
    loading.value = false
  }
}

const filteredContracts = computed(() => {
  if (!searchQuery.value) return contracts.value
  const q = searchQuery.value.toLowerCase()
  return contracts.value.filter(c =>
    (c.contractedClient?.clintName?.toLowerCase().includes(q)) ||
    (c.contractedAgency?.agencyName?.toLowerCase().includes(q)) ||
    c.televisionContractNo?.toLowerCase().includes(q)
  )
})

const handleViewInvoice = (contract: ITelevisionContract) => {
  selectedContract.value = contract
  showInvoiceModal.value = true
}

const handleSearch = () => {
  // The computed `filteredContracts` reacts to `searchQuery`
  
}

onMounted(() => {
  loadContracts()
})
</script>

<style scoped>
.invoices-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-left p {
  margin: 4px 0 0;
  font-size: 14px;
}

.search-input {
  width: 300px;
}
</style>
<template>
  <div class="transmission-certificate-page">
    <div class="page-header">
      <div class="header-left">
        <h2>Transmission Certificates</h2>
        <p class="text-gray-500">Generate and view transmission certificates for contracts</p>
      </div>
      <div class="header-right">
        <el-input v-model="searchQuery" placeholder="Search contracts..." prefix-icon="Search" class="search-input"
          clearable @input="handleSearch" />
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table v-loading="loading" :data="contracts" style="width: 100%" border stripe>
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
        <el-table-column label="Duration" width="220">
          <template #default="{ row }">
            {{ formatDate(row.contractStartDate) }} - {{ formatDate(row.contractEndDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="Amount" width="150" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.total) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" plain @click="handleViewCertificate(row)">
              <el-icon class="mr-1">
                <Document />
              </el-icon>
              Certificate
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" :total="totalContracts" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- Certificate Modal -->
    <TransmissionCertificateModal v-model="showCertificateModal" :contract="selectedContract" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { contractService } from '@/services/Contracts/contract.services'
import type { ITelevisionContract } from '@/interface/contract/contracts.interface'
import TransmissionCertificateModal from '@/components/modals/TransmissionCertificateModal.vue'

const loading = ref(false)
const contracts = ref<ITelevisionContract[]>([])
const totalContracts = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')

const showCertificateModal = ref(false)
const selectedContract = ref<ITelevisionContract | null>(null)

const loadContracts = async () => {
  loading.value = true
  try {
    const response = await contractService.getAllTelevisionContracts()
    // Apply client-side search filter if query present
    const query = searchQuery.value.trim().toLowerCase()
    let filtered = response
    if (query) {
      filtered = response.filter((c) => {
        const contractNo = c.televisionContractNo?.toString().toLowerCase() ?? ''
        const clientName = c.contractedClient?.clintName?.toLowerCase() ?? ''
        const agencyName = c.contractedAgency?.agencyName?.toLowerCase() ?? ''
        return (
          contractNo.includes(query) ||
          clientName.includes(query) ||
          agencyName.includes(query)
        )
      })
    }
    contracts.value = filtered
    totalContracts.value = filtered.length
  } catch (error) {
    console.error('Failed to load contracts:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadContracts()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadContracts()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadContracts()
}

const handleViewCertificate = (contract: ITelevisionContract) => {
  selectedContract.value = contract
  showCertificateModal.value = true
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2
  }).format(value)
}

onMounted(() => {
  loadContracts()
})
</script>

<style scoped>
.transmission-certificate-page {
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
  color: #1f2937;
  margin: 0;
}

.header-left p {
  margin: 4px 0 0;
  font-size: 14px;
}

.search-input {
  width: 300px;
}

.table-card {
  border-radius: 8px;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mr-1 {
  margin-right: 4px;
}
</style>
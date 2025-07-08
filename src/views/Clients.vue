<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Client Management</h1>
      <button
        @click="showCreateModal = true"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center space-x-2"
      >
        <Plus class="h-4 w-4" />
        <span>Add Client</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search clients..."
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <select
            v-model="selectedType"
            @change="handleFilter"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="direct">Direct Client</option>
            <option value="agency">Agency Client</option>
          </select>
        </div>
        <div>
          <select
            v-model="selectedAgency"
            @change="handleFilter"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Agencies</option>
            <option value="1">Creative Agency</option>
            <option value="2">Media Partners</option>
          </select>
        </div>
        <div>
          <button
            @click="resetFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clientsStore.clients" :key="client.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                  <div class="text-sm text-gray-500">{{ client.email }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">{{ client.contactPerson }}</div>
                  <div class="text-sm text-gray-500">{{ client.phone }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="client.type === 'direct' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ client.type === 'direct' ? 'Direct' : 'Agency' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ client.agencyId ? 'Creative Agency' : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(client.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editClient(client)"
                    class="text-primary hover:text-primary-dark"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteClient(client.id!)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="clientsStore.currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="clientsStore.currentPage === clientsStore.totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Page {{ clientsStore.currentPage }} of {{ clientsStore.totalPages }}
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="clientsStore.currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                @click="nextPage"
                :disabled="clientsStore.currentPage === clientsStore.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ClientModal
      v-if="showCreateModal || showEditModal"
      :client="selectedClient"
      :is-edit="showEditModal"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientsStore, type Client } from '@/stores/clients'
import ClientModal from '@/components/forms/ClientModal.vue'
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

const clientsStore = useClientsStore()

const searchQuery = ref('')
const selectedType = ref('')
const selectedAgency = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedClient = ref<Client | null>(null)

const handleSearch = () => {
  clientsStore.fetchClients(1, searchQuery.value)
}

const handleFilter = () => {
  // Implement filtering logic
  clientsStore.fetchClients(1, searchQuery.value)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedAgency.value = ''
  clientsStore.fetchClients(1, '')
}

const editClient = (client: Client) => {
  selectedClient.value = client
  showEditModal.value = true
}

const deleteClient = async (id: number) => {
  if (confirm('Are you sure you want to delete this client?')) {
    await clientsStore.deleteClient(id)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedClient.value = null
}

const handleSave = async (clientData: Client) => {
  if (showEditModal.value && selectedClient.value?.id) {
    await clientsStore.updateClient(selectedClient.value.id, clientData)
  } else {
    await clientsStore.createClient(clientData)
  }
  closeModal()
}

const previousPage = () => {
  if (clientsStore.currentPage > 1) {
    clientsStore.fetchClients(clientsStore.currentPage - 1, searchQuery.value)
  }
}

const nextPage = () => {
  if (clientsStore.currentPage < clientsStore.totalPages) {
    clientsStore.fetchClients(clientsStore.currentPage + 1, searchQuery.value)
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  clientsStore.fetchClients()
})
</script>

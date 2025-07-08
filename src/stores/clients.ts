import { ref } from "vue"
import { defineStore } from "pinia"

export interface Client {
  id?: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  type: "agent" | "company" | "individual"
  agencyId?: string
  contactPerson: string
  taxId?: string
  tollFreeNumber?: string
  website?: string
  companyRegistrationDate?: Date | string | null
  officeSpaceOwnership?: "owned" | "rental"
  companyLogo?: File | string | null
  createdAt?: string
  status?: "active" | "inactive"
  country?: string
  subject?: string
  title?: string
}

export const useClientsStore = defineStore("clients", () => {
  const clients = ref<Client[]>([
    {
      id: 1,
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      tollFreeNumber: "+1 (800) 123-4567",
      address: "123 Business Ave, Suite 100",
      city: "New York",
      state: "NY",
      country: "USA",
      type: "company",
      contactPerson: "John Smith",
      title: "Chief Executive Officer",
      taxId: "TC-2024-001",
      website: "https://techcorp.com",
      companyRegistrationDate: "2020-01-15",
      officeSpaceOwnership: "owned",
      subject: "Mobile App Design",
      createdAt: "2024-01-15T10:30:00Z",
      status: "active",
    },
    {
      id: 2,
      name: "Creative Media Group",
      email: "hello@creativemedia.com",
      phone: "+1 (555) 987-6543",
      tollFreeNumber: "+1 (800) 987-6543",
      address: "456 Design Street, Floor 5",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      type: "agent",
      agencyId: "1",
      contactPerson: "Sarah Johnson",
      title: "Creative Director",
      taxId: "CMG-2024-002",
      website: "https://creativemedia.com",
      companyRegistrationDate: "2019-03-20",
      officeSpaceOwnership: "rental",
      subject: "Brand Development",
      createdAt: "2024-02-20T14:15:00Z",
      status: "active",
    },
    {
      id: 3,
      name: "Global Retail Inc",
      email: "partnerships@globalretail.com",
      phone: "+1 (555) 456-7890",
      tollFreeNumber: "+1 (800) 456-7890",
      address: "789 Commerce Blvd",
      city: "Chicago",
      state: "IL",
      country: "USA",
      type: "company",
      contactPerson: "Michael Chen",
      title: "Chief Operating Officer",
      taxId: "GRI-2024-003",
      website: "https://globalretail.com",
      companyRegistrationDate: "2018-06-10",
      officeSpaceOwnership: "owned",
      subject: "E-commerce Platform",
      createdAt: "2024-03-10T09:45:00Z",
      status: "active",
    },
    {
      id: 4,
      name: "Digital Solutions Ltd",
      email: "info@digitalsolutions.com",
      phone: "+1 (555) 321-9876",
      tollFreeNumber: "+1 (800) 321-9876",
      address: "321 Tech Park Drive",
      city: "Austin",
      state: "TX",
      country: "USA",
      type: "company",
      contactPerson: "Emily Rodriguez",
      title: "Chief Technology Officer",
      taxId: "DSL-2024-004",
      website: "https://digitalsolutions.com",
      companyRegistrationDate: "2021-09-15",
      officeSpaceOwnership: "rental",
      subject: "Web Development",
      createdAt: "2024-04-05T11:20:00Z",
      status: "active",
    },
    {
      id: 5,
      name: "Innovation Hub",
      email: "contact@innovationhub.com",
      phone: "+1 (555) 654-3210",
      address: "654 Innovation Way",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      type: "individual",
      contactPerson: "David Park",
      title: "Founder & CEO",
      taxId: "IH-2024-005",
      website: "https://innovationhub.com",
      companyRegistrationDate: "2022-01-20",
      officeSpaceOwnership: "owned",
      subject: "Product Design",
      createdAt: "2024-05-12T16:45:00Z",
      status: "active",
    },
  ])

  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const searchQuery = ref("")

  const fetchClients = async (page = 1, search = "") => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filteredClients = [...clients.value]

      if (search) {
        filteredClients = filteredClients.filter(
          (client) =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.email.toLowerCase().includes(search.toLowerCase()) ||
            client.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
            client.city.toLowerCase().includes(search.toLowerCase()) ||
            client.subject?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      // Simulate pagination
      const itemsPerPage = 10
      totalPages.value = Math.ceil(filteredClients.length / itemsPerPage)
      currentPage.value = page
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      loading.value = false
    }
  }

  const createClient = async (clientData: Client) => {
    try {
      loading.value = true
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newClient: Client = {
        ...clientData,
        id: Math.max(...clients.value.map((c) => c.id || 0)) + 1,
        createdAt: new Date().toISOString(),
        status: "active",
      }

      clients.value.unshift(newClient)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to create client" }
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id: number, clientData: Client) => {
    try {
      loading.value = true
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const index = clients.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        clients.value[index] = { ...clientData, id }
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update client" }
    } finally {
      loading.value = false
    }
  }

  const deleteClient = async (id: number) => {
    try {
      loading.value = true
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      clients.value = clients.value.filter((c) => c.id !== id)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete client" }
    } finally {
      loading.value = false
    }
  }

  return {
    clients,
    loading,
    currentPage,
    totalPages,
    searchQuery,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
})

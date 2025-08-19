// API Response Types
export interface User {
  id: string | number
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string | number
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Agency {
  id: string | number
  name: string
  contact_person: string
  email: string
  phone?: string
  address?: string
  commission_rate: number
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string | number
  client_id: string | number
  agency_id?: string | number
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  due_date: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  items: InvoiceItem[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id?: string | number
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Payment {
  id: string | number
  invoice_id: string | number
  amount: number
  payment_method: string
  payment_date: string
  reference_number?: string
  status: "pending" | "completed" | "failed"
  created_at: string
  updated_at: string
}

export interface AdBooking {
  id: string | number
  client_id: string | number
  agency_id?: string | number
  title: string
  description?: string
  start_date: string
  end_date: string
  duration: number
  rate: number
  total_amount: number
  status: "scheduled" | "running" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

// API Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface CreateClientRequest {
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: "active" | "inactive"
}

export interface CreateAgencyRequest {
  name: string
  contact_person: string
  email: string
  phone?: string
  address?: string
  commission_rate: number
}

export interface CreateInvoiceRequest {
  client_id: string | number
  agency_id?: string | number
  due_date: string
  items: Omit<InvoiceItem, "id">[]
  notes?: string
}

export interface CreateAdBookingRequest {
  client_id: string | number
  agency_id?: string | number
  title: string
  description?: string
  start_date: string
  end_date: string
  duration: number
  rate: number
}

// Pagination Types
export interface PaginationParams {
  page?: number
  limit?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
  filter?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
    has_next_page: boolean
    has_prev_page: boolean
  }
}

// Dashboard Stats
export interface DashboardStats {
  clients: {
    total: number
    active: number
    inactive: number
    recent: number
  }
  invoices: {
    total: number
    paid: number
    pending: number
    overdue: number
    total_amount: number
    paid_amount: number
    pending_amount: number
  }
  payments: {
    total: number
    this_month: number
    last_month: number
    total_amount: number
  }
  bookings: {
    total: number
    active: number
    completed: number
    scheduled: number
  }
}

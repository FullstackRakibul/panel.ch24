import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { ElMessage } from "element-plus"

// Types for better type safety
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  status: number
}

export interface ApiError {
  message: string
  status: number
  data?: any
}

// Get auth token from localStorage
export const getAuthToken = (): string => {
  return localStorage.getItem("access_token") || localStorage.getItem("token") || ""
}

// Get refresh token
export const getRefreshToken = (): string => {
  return localStorage.getItem("refresh_token") || ""
}

// Set auth tokens
export const setAuthTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("access_token", accessToken)
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken)
  }
}

// Clear auth tokens
export const clearAuthTokens = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("token")
}

// Base HTTP client factory
export const createHttpClient = (baseUrl?: string, additionalHeaders: Record<string, string> = {}): AxiosInstance => {
  const authToken = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...additionalHeaders,
  }

  const axiosInstance = axios.create({
    baseURL: baseUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    timeout: 30000, // 30 seconds timeout
    headers,
    withCredentials: false, // Set to true if you need cookies
  })

  // Request interceptor - add fresh token to each request
  axiosInstance.interceptors.request.use(
    (config) => {
      const currentToken = getAuthToken()
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`
      }

      // Log request in development
      if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        })
      }

      return config
    },
    (error) => {
      console.error("Request interceptor error:", error)
      return Promise.reject(error)
    },
  )

  // Response interceptor - handle responses and errors globally
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        })
      }

      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Log error in development
      if (import.meta.env.DEV) {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        })
      }

      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = getRefreshToken()
          if (refreshToken) {
            // Attempt to refresh token
            const refreshResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
              refresh_token: refreshToken,
            })

            const { access_token, refresh_token: newRefreshToken } = refreshResponse.data

            // Update tokens
            setAuthTokens(access_token, newRefreshToken)

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return axiosInstance(originalRequest)
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)

          // Clear tokens and redirect to login
          clearAuthTokens()

          // Show error message
          ElMessage.error("Session expired. Please login again.")

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }
      }

      // Handle other HTTP errors
      const errorMessage = error.response?.data?.message || error.message || "An error occurred"
      const errorStatus = error.response?.status || 500

      // Show user-friendly error messages
      if (errorStatus >= 500) {
        ElMessage.error("Server error. Please try again later.")
      } else if (errorStatus === 403) {
        ElMessage.error("Access denied. You do not have permission.")
      } else if (errorStatus === 404) {
        ElMessage.error("Resource not found.")
      } else if (errorStatus !== 401) {
        // Don't show 401 errors as they're handled above
        ElMessage.error(errorMessage)
      }

      return Promise.reject({
        message: errorMessage,
        status: errorStatus,
        data: error.response?.data,
      } as ApiError)
    },
  )

  return axiosInstance
}

// Main API client
export const useHttp = () => {
  const client = createHttpClient()

  return {
    // GET request
    get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      const response = await client.get(url, config)
      return {
        data: response.data,
        message: response.data?.message,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
      }
    },

    // POST request
    post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      const response = await client.post(url, data, config)
      return {
        data: response.data,
        message: response.data?.message,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
      }
    },

    // PUT request
    put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      const response = await client.put(url, data, config)
      return {
        data: response.data,
        message: response.data?.message,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
      }
    },

    // PATCH request
    patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      const response = await client.patch(url, data, config)
      return {
        data: response.data,
        message: response.data?.message,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
      }
    },

    // DELETE request
    delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      const response = await client.delete(url, config)
      return {
        data: response.data,
        message: response.data?.message,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
      }
    },

    // Raw client for custom requests
    client,
  }
}

// Channel API specific client
export const channelApiHttpJson = (): AxiosInstance => {
  const baseUrl: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
  const accessToken = getAuthToken()

  const headers: Record<string, string> = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  return createHttpClient(baseUrl, headers)
}

// Specialized HTTP clients for different purposes
export const useChannelApi = () => createHttpClient()
export const useFileUpload = () => createHttpClient(undefined, { "Content-Type": "multipart/form-data" })

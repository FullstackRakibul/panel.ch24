import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios from "axios"
import { channelApiHttpJson } from "@/utils/base.Http"

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("access_token") || "")
  const user = ref<null | { id: number; name: string; email: string; role: string ;avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'}>(null)
  const loading = ref(false)
  const permissions = ref<string[]>([])

  const isAuthenticated = computed(() => !!token.value)

  // JWT Decoder - extracts permission claims from token
  const decodeJwtPermissions = (jwtToken: string): string[] => {
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]))
      // Handle both single string and array of permissions
      if (Array.isArray(payload.permission)) {
        return payload.permission
      } else if (payload.permission) {
        return [payload.permission]
      }
      return []
    } catch (error) {
      console.error("Failed to decode JWT permissions:", error)
      return []
    }
  }

  // Check if user has a specific permission
  const hasPermission = (code: string): boolean => {
    return permissions.value.includes(code)
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (codes: string[]): boolean => {
    return codes.some(code => permissions.value.includes(code))
  }

  // Check if user has all of the specified permissions
  const hasAllPermissions = (codes: string[]): boolean => {
    return codes.every(code => permissions.value.includes(code))
  }

  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    try {
      // Static admin credentials
      const ADMIN_EMAIL = "admin@ch24.com"
      const ADMIN_PASSWORD = "admin@ch24.com"

      const response = await channelApiHttpJson().post("/Auth/login", credentials)
 
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (response.status === 401) {
        return { success: false, message: "Invalid email or password" }
      }
      if (response.status === 200) {
        token.value = response.data.access_token
        
        // Extract permissions from JWT
        permissions.value = decodeJwtPermissions(token.value)
        
        user.value = {
          id: 1,
          name: "Admin User",
          email: ADMIN_EMAIL,
          role: "admin",
          avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'
        }

        localStorage.setItem("access_token", token.value)
        localStorage.setItem("user", JSON.stringify(user.value))
        localStorage.setItem("permissions", JSON.stringify(permissions.value))

        // Set default authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`

        return { success: true }
      } else {
        return { success: false, message: "Invalid email or password" }
      }
    } catch (error: any) {
      return { success: false, message: "Login failed" }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = ""
    user.value = null
    permissions.value = []
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("permissions")
    delete axios.defaults.headers.common["Authorization"]
  }

  const initializeAuth = () => {
    if (token.value) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`

      // Restore user data from localStorage
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch (error) {
          console.error("Failed to parse saved user data:", error)
          logout()
        }
      }

      // Restore permissions from localStorage
      const savedPermissions = localStorage.getItem("permissions")
      if (savedPermissions) {
        try {
          permissions.value = JSON.parse(savedPermissions)
        } catch (error) {
          console.error("Failed to parse saved permissions:", error)
          // Try to decode from token as fallback
          permissions.value = decodeJwtPermissions(token.value)
        }
      } else {
        // Decode from token if not in localStorage
        permissions.value = decodeJwtPermissions(token.value)
      }
    }
  }

  return {
    token,
    user,
    loading,
    permissions,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
    initializeAuth,
  }
})

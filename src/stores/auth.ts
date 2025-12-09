import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios from "axios"
import { channelApiHttpJson } from "@/utils/base.Http"

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("access_token") || "")
  const user = ref<null | { id: number; name: string; email: string; role: string ;avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'}>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

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
        // Generate a mock token
        // const mockToken = "mock-jwt-token-" + Date.now()



        token.value = response.data.access_token
        user.value = {
          id: 1,
          name: "Admin User",
          email: ADMIN_EMAIL,
          role: "admin",
          avatar: 'https://assets-v2.lottiefiles.com/a/82411e66-1184-11ee-8cfa-d707e53cae38/bccvxj7Ogv.gif'
        }

        localStorage.setItem("access_token", token.value)
        localStorage.setItem("user", JSON.stringify(user.value))

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
    localStorage.removeItem("token")
    localStorage.removeItem("user")
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
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    initializeAuth,
  }
})

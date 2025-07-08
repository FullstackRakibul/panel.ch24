import { ref } from "vue"
import { defineStore } from "pinia"

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(localStorage.getItem("theme") === "dark")
  const sidebarCollapsed = ref(localStorage.getItem("sidebar-collapsed") === "true")

  const toggleTheme = () => {
    isDark.value = !isDark.value
  localStorage.setItem("theme", isDark.value ? "dark" : "light")
  updateTheme()
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed.value.toString())
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const initializeTheme = () => {
    updateTheme()
  }

  return {
    isDark,
    sidebarCollapsed,
    toggleTheme,
    toggleSidebar,
    initializeTheme,
  }
})

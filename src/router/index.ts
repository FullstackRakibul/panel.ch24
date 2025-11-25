import { h, defineComponent } from 'vue'
import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"
// Import critical components directly for faster loading
import Login from "@/views/Login.vue"

// Create simple fallback component
import FallbackPage from "@/components/FallbackPage.vue"


// Fallback loader

const lazyLoadComponent = (name: keyof typeof viewsMap) => {
  return () =>
    viewsMap[name]()
      .then((module) => module)
      .catch((error) => {
        console.warn(`Failed to load ${name}:`, error)
        return {
          default: defineComponent({
            name: `Fallback${name}`,
            render() {
              return h(FallbackPage, {
                title: `${name} Page`,
                subtitle: 'This page is currently under development',
              })
            },
          }),
        }
      })
}

// Lazy loaded components
const viewsMap = {
  Dashboard: () => import('@/views/Dashboard.vue'),
  Clients: () => import('@/views/Clients.vue'),
  Agencies: () => import('@/views/Agencies.vue'),
  AdBookings: () => import('@/views/AdBookings.vue'),
  Invoices: () => import('@/views/Invoices.vue'),
  InvoiceDetails: () => import('@/views/InvoiceDetails.vue'),
  Payments: () => import('@/views/Payments.vue'),
  Reports: () => import('@/views/Reports.vue'),
  DeliveryLogs: () => import('@/views/DeliveryLogs.vue'),
  Settings: () => import('@/views/Settings.vue'),
  NotFound: () => import('@/views/NotFound.vue'),
  CompanyGolas : () => import('@/views/Goals.vue'),
  MediaUpload : () => import('@/views/MediaUpload.vue'),
}

const Dashboard = lazyLoadComponent('Dashboard')
const Clients = lazyLoadComponent('Clients')
const Agencies = lazyLoadComponent('Agencies')
const AdBookings = lazyLoadComponent('AdBookings')
const Invoices = lazyLoadComponent('Invoices')
const InvoiceDetails = lazyLoadComponent('InvoiceDetails')
const Payments = lazyLoadComponent('Payments')
const Reports = lazyLoadComponent('Reports')
const DeliveryLogs = lazyLoadComponent('DeliveryLogs')
const Settings = lazyLoadComponent('Settings')
const NotFound = lazyLoadComponent('NotFound')
const CompanyGolas = lazyLoadComponent('CompanyGolas')
const MediaUpload = lazyLoadComponent('MediaUpload')




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false,
        title: "Login - Channel 24",
        description: "Sign in to your Channel 24 account",
      },
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: "Dashboard - Channel 24",
        description: "Channel 24 billing system dashboard",
      },
    },
    {
      path: "/goals",
      name: "Goals",
      component: CompanyGolas,
      meta: { requiresAuth: false },
    },
    {
      path: "/clients",
      name: "Clients",
      component: Clients,
      meta: {
        requiresAuth: true,
        title: "Clients - Channel 24",
        description: "Manage your clients",
      },
    },
    {
      path: "/agencies",
      name: "Agencies",
      component: Agencies,
      meta: {
        requiresAuth: true,
        title: "Agencies - Channel 24",
        description: "Manage advertising agencies",
      },
    },
    {
      path: "/ad-bookings",
      name: "AdBookings",
      component: AdBookings,
      meta: {
        requiresAuth: true,
        title: "Ad Bookings - Channel 24",
        description: "Manage advertisement bookings",
      },
    },
    {
      path: "/invoices",
      name: "Invoices",
      component: Invoices,
      meta: {
        requiresAuth: true,
        title: "Invoices - Channel 24",
        description: "Manage invoices and billing",
      },
    },
    {
      path: "/invoices/:id",
      name: "InvoiceDetails",
      component: InvoiceDetails,
      meta: {
        requiresAuth: true,
        title: "Invoice Details - Channel 24",
        description: "View invoice details",
      },
      props: true,
    },
    {
      path: "/payments",
      name: "Payments",
      component: Payments,
      meta: {
        requiresAuth: true,
        title: "Payments - Channel 24",
        description: "Track and manage payments",
      },
    },
    {
      path: "/reports",
      name: "Reports",
      component: Reports,
      meta: {
        requiresAuth: true,
        title: "Reports - Channel 24",
        description: "View analytics and reports",
      },
    },
    {
      path: "/delivery-logs",
      name: "DeliveryLogs",
      component: DeliveryLogs,
      meta: {
        requiresAuth: true,
        title: "Delivery Logs - Channel 24",
        description: "Track delivery status and logs",
      },
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      meta: {
        requiresAuth: true,
        title: "Settings - Channel 24",
        description: "Configure application settings",
      },
    },
    {
      path: "/media-upload",
      name: "Media Upload",
      component: MediaUpload,
      meta: {
        requiresAuth: true,
        title: "Media Upload - Channel 24",
        description: "Upload media files",
      },
    },
    // 404 Not Found - must be last
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
      meta: {
        title: "Page Not Found - Channel 24",
        description: "The page you're looking for doesn't exist",
      },
    },
  ],
})

// Enhanced route guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  try {
    // Initialize auth if needed
    if (!authStore.user && authStore.token) {
      authStore.initializeAuth()
    }

    // Check authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      })
      return
    }

    // Redirect authenticated users away from login
    if (to.path === "/login" && authStore.isAuthenticated) {
      const redirect = to.query.redirect as string
      next(redirect || "/")
      return
    }

    // Set page title
    if (to.meta.title) {
      document.title = to.meta.title as string
    }

    next()
  } catch (error) {
    console.error("Router navigation error:", error)
    next(false)
  }
})

export default router

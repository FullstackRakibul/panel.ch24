import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

// Import components directly first to check for issues
import Dashboard from "@/views/Dashboard.vue"
import Login from "@/views/Login.vue"
import Clients from "@/views/Clients.vue"

// Create fallback components for missing views
const FallbackComponent = {
  template: `
    <div class="fallback-page">
      <h1>Page Under Development</h1>
      <p>This page is currently being built.</p>
      <el-button type="primary" @click="$router.push('/')">Go to Dashboard</el-button>
    </div>
  `,
  style: `
    .fallback-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      gap: 16px;
    }
  `,
}

// Lazy load with error handling
const lazyLoad = (componentPath: string) => {
  return () =>
    import(componentPath).catch(() => {
      console.warn(`Failed to load component: ${componentPath}`)
      return FallbackComponent
    })
}

// Lazy load components for better performance
const Agencies = lazyLoad("@/views/Agencies.vue")
const AdBookings = lazyLoad("@/views/AdBookings.vue")
const Invoices = lazyLoad("@/views/Invoices.vue")
const InvoiceDetails = lazyLoad("@/views/InvoiceDetails.vue")
const Payments = lazyLoad("@/views/Payments.vue")
const Reports = lazyLoad("@/views/Reports.vue")
const DeliveryLogs = lazyLoad("@/views/DeliveryLogs.vue")
const Settings = lazyLoad("@/views/Settings.vue")
const AgencyView = lazyLoad("@/views/AgenciesView.vue")

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false,
        title: "Login",
      },
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: "Dashboard",
      },
    },
    {
      path: "/clients",
      name: "Clients",
      component: Clients,
      meta: {
        requiresAuth: true,
        title: "Clients",
      },
    },
    {
      path: "/agencies",
      name: "Agencies",
      component: Agencies,
      meta: {
        requiresAuth: true,
        title: "Agencies",
      },
    },
    {
      path: "/ad-bookings",
      name: "AdBookings",
      component: AdBookings,
      meta: {
        requiresAuth: true,
        title: "Ad Bookings",
      },
    },
    {
      path: "/invoices",
      name: "Invoices",
      component: Invoices,
      meta: {
        requiresAuth: true,
        title: "Invoices",
      },
    },
    {
      path: "/invoices/:id",
      name: "InvoiceDetails",
      component: InvoiceDetails,
      meta: {
        requiresAuth: true,
        title: "Invoice Details",
      },
      props: true,
    },
    {
      path: "/payments",
      name: "Payments",
      component: Payments,
      meta: {
        requiresAuth: true,
        title: "Payments",
      },
    },
    {
      path: "/reports",
      name: "Reports",
      component: Reports,
      meta: {
        requiresAuth: true,
        title: "Reports",
      },
    },
    {
      path: "/delivery-logs",
      name: "DeliveryLogs",
      component: DeliveryLogs,
      meta: {
        requiresAuth: true,
        title: "Delivery Logs",
      },
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      meta: {
        requiresAuth: true,
        title: "Settings",
      },
    },
    // Add missing routes that might be referenced in sidebar
    {
      path: "/todo",
      name: "Todo",
      component: FallbackComponent,
      meta: {
        requiresAuth: true,
        title: "To-do List",
      },
    },
    {
      path: "/goals",
      name: "Goals",
      component: FallbackComponent,
      meta: {
        requiresAuth: true,
        title: "Goals",
      },
    },
    {
      path: "/notifications",
      name: "Notifications",
      component: FallbackComponent,
      meta: {
        requiresAuth: true,
        title: "Notifications",
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: FallbackComponent,
      meta: {
        requiresAuth: true,
        title: "Profile",
      },
    },
    // Catch all route - must be last
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: {
        template: `
          <div class="not-found-page">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <el-button type="primary" @click="$router.push('/')">Go Home</el-button>
          </div>
        `,
        style: `
          .not-found-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            gap: 16px;
          }
        `,
      },
    },
  ],
})

// Enhanced route guard with better error handling
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  try {
    // Initialize auth if not already done
    if (!authStore.user && authStore.token) {
      authStore.initializeAuth()
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.log("Redirecting to login - not authenticated")
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      })
      return
    }

    // Redirect to dashboard if already authenticated and trying to access login
    if (to.path === "/login" && authStore.isAuthenticated) {
      console.log("Redirecting to dashboard - already authenticated")
      next("/")     
      return
    }

    // Set page title
    if (to.meta.title) {
      document.title = `${to.meta.title} - Channel 24`
    }

    console.log(`Navigating to: ${to.path}`)
    next()
  } catch (error) {
    console.error("Router navigation error:", error)
    // Don't redirect to login on error, just continue
    next()
  }
})

// Handle router errors
router.onError((error) => {
  console.error("Router error:", error)
  // You can add more sophisticated error handling here
})

export default router

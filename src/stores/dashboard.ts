// dashboard.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useDashboardStore = defineStore("dashboard", () => {
  const stats = ref({
    totalInvoices: 0,
    monthlyInvoices: 0, // This is an existing field
    yearlyInvoices: 0, // This is an existing field
    totalRevenue: 0,
    totalDue: 0,
    totalPaid: 0,
    // --- New KPI fields inspired by image_0e7299.jpg ---
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    outstandingInvoices: 0,
    upcomingPayments: 0,
    overduesAmounts: 0,
    totalSubscription: 0,
    activeSubscription: 0,
    inactiveSubscription: 0, // This is derived from active/total in demo, but good to have explicit
    subscriptionExpiringSoon: 0,
    newLeads: 0,
    ongoingProjects: 0,
    overdueProjects: 0,
    openTickets: 0,
    pendingTickets: 0,
    // --- Monthly Invoice Report fields ---
    totalGeneratedInvoices: 0,
    totalPaidInvoices: 0,
    totalDueInvoices: 0,
    totalCancelledInvoices: 0,
  });

  const topClients = ref([]); // This is an existing field
  const revenueByAgency = ref([]); // This is an existing field
  const monthlyRevenue = ref([]); // This is an existing field
  const loading = ref(false); // This is an existing field

  const fetchDashboardData = async () => {
    loading.value = true;
    try {
      const [statsRes, clientsRes, agencyRes, revenueRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/dashboard/top-clients"),
        axios.get("/api/dashboard/revenue-by-agency"),
        axios.get("/api/dashboard/monthly-revenue"),
      ]);

      // Assuming statsRes.data contains all the new and existing stats
      stats.value = {
        ...stats.value, // Keep defaults in case API doesn't return everything
        ...statsRes.data,
      };
      topClients.value = clientsRes.data;
      revenueByAgency.value = agencyRes.data;
      monthlyRevenue.value = revenueRes.data;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    stats,
    topClients,
    revenueByAgency,
    monthlyRevenue,
    loading,
    fetchDashboardData,
  };
});

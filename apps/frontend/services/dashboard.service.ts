import api from "@/lib/axios";

export const DashboardService = {
  async getStats() {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};
import axios from "@/lib/axios";

export const dashboardService = {
  async getStats() {
    const response = await axios.get(
      "/dashboard/stats"
    );

    return response.data;
  },
};
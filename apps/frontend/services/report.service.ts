import api from "@/lib/axios";

import { BillingReportResponse } from "@/types/report";

export const ReportsService = {
  async getSummary() {
    const response = await api.get("/reports/summary");

    return response.data;
  },

  async getBillingReport(
    sellerId?: string,
    billingMonth?: string,
  ) {
    const response = await api.get<BillingReportResponse>(
      "/reports/billing",
      {
        params: {
          sellerId,
          billingMonth,
        },
      },
    );

    return response.data;
  },
};
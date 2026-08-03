import api from "@/lib/axios";
import { ReportResponse } from "@/types/report";

export const ReportService = {
  async getSummary(): Promise<ReportResponse> {
    const response = await api.get("/reports/summary");
    return response.data;
  },
};
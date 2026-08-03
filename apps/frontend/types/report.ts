export interface ReportSummary {
  totalBills: number;
  totalRevenue: number;
}

export interface ReportResponse {
  success: boolean;
  summary: ReportSummary;
}
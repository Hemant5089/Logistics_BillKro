export interface BillingReport {
  id: string;

  shipmentId: string;
  sellerId: string;
  carrierId: string;
  zoneId: string;

  billingMonth: string;

  applicableWeight: number;
  billedWeight: number;

  forwardTotalCharge: number;
  codCharge: number;
  rtoCharge: number;
  totalCharge: number;

  shipment: {
    awbNumber: string;
    orderId: string;
    shipmentStatus: string;
  };

  seller: {
    sellerName: string;
  };

  carrier: {
    name: string;
  };

  zone: {
    name: string;
  };
}

export interface BillingReportResponse {
  success: boolean;

  totalBills: number;

  totalRevenue: number;

  reports: BillingReport[];
}
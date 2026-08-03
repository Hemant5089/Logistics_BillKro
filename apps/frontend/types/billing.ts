export interface BillingCalculation {
  awbNumber: string;
  orderId: string;
  carrier: string;
  zone: string;
  shipmentStatus: string;
  paymentMode: string;

  actualWeight: number;
  volumetricWeight: number;
  applicableWeight: number;

  forwardBaseCharge: number;
  forwardAdditionalCharge: number;
  forwardTotalCharge: number;

  codCharge: number;
  rtoCharge: number;

  totalCharge: number;
}

export interface BillingPreviewResponse {
  success: boolean;

  message?: string;

  seller?: string;

  billingMonth?: string;

  shipmentCount?: number;

  calculations?: BillingCalculation[];
}
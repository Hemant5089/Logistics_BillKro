import api from "@/lib/axios";

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
  seller: string;
  billingMonth: string;
  shipmentCount: number;
  calculations: BillingCalculation[];
}

export const BillingService = {

  async preview(
    sellerId: string,
    month: string
  ): Promise<BillingPreviewResponse> {
    const response = await api.get(
      `/billing/preview/${sellerId}?month=${month}`
    );

    return response.data;
  },

  async generate(
    sellerId: string,
    month: string
  ) {
    const response = await api.post(
      `/billing/generate/${sellerId}?month=${month}`
    );

    return response.data;
  },

  async downloadExcel(
    sellerId: string,
    month: string
  ) {
    const response = await api.get(
      `/invoice/excel/${sellerId}?month=${month}`,
      {
        responseType: "blob",
      }
    );

    return response;
  },

   async downloadPdf(
    sellerId: string,
    month: string,
    invoicePrefix: string,
    invoiceNumber: string
  ) {
    const response = await api.post(
      `/invoice/pdf/${sellerId}?month=${month}`,
      {
        invoicePrefix,
        invoiceNumber,
      },
      {
        responseType: "blob",
      }
    );

    return response;
  },

};
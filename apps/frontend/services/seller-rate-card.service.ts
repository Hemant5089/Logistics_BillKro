import api from "@/lib/axios";

export interface RateCardImportError {
  row?: unknown;
  reason: string;
}

export interface SellerRateCardImportResponse {
  success: boolean;
  totalRows: number;
  imported: number;
  skipped: number;
  errors: RateCardImportError[];
}

export interface CopySellerRateCardResponse {
  success: boolean;
  copied: number;
  sourceSeller?: string;
  targetSeller?: string;
  targetSellers?: string[];
  message?: string;
}

export interface SellerRateCard {
  id: string;
  name?: string | null;
  sellerId: string;
  carrierId: string;
  carrier?: {
    id: string;
    name: string;
  };
  service: string;
  startWeight: number;
  endWeight: number;
  maxWeight: number;
  additionalWeight: number;
  localAmount: number;
  localAdditionalAmount: number;
  stateAmount: number;
  stateAdditionalAmount: number;
  roiAmount: number;
  roiAdditionalAmount: number;
  metroAmount: number;
  metroAdditionalAmount: number;
  specialAmount: number;
  specialAdditionalAmount: number;
  codThresholdAmount: number;
  codFixedCharge: number;
  codPercentage: number;
  rtoCharge: number;
  isActive: boolean;
}

export interface CarrierCodSetting {
  carrierId: string;
  codFixedCharge?: number;
  codPercentage?: number;
}

export const SellerRateCardService = {
  async getBySellerId(
    sellerId: string,
  ): Promise<SellerRateCard[]> {
    const response = await api.get(
      `/seller-rate-cards/seller/${sellerId}`,
    );

    return response.data;
  },

  async importExcel(
    sellerId: string,
    file: File,
    options?: {
      codFixedCharge?: number;
      codPercentage?: number;
      carrierCodSettings?: CarrierCodSetting[];
    },
  ): Promise<SellerRateCardImportResponse> {
    const formData = new FormData();

    formData.append("file", file);

    if (options?.codFixedCharge !== undefined) {
      formData.append(
        "codFixedCharge",
        String(options.codFixedCharge),
      );
    }

    if (options?.codPercentage !== undefined) {
      formData.append(
        "codPercentage",
        String(options.codPercentage),
      );
    }

    if (options?.carrierCodSettings?.length) {
      formData.append(
        "carrierCodSettings",
        JSON.stringify(options.carrierCodSettings),
      );
    }

    const response = await api.post(
      `/seller-rate-cards/${sellerId}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  async copyRateCard(
    sellerId: string,
    carrierId: string,
  ) {
    const response = await api.post(
      "/seller-rate-cards/copy",
      {
        sellerId,
        carrierId,
      },
    );

    return response.data;
  },

  async copySellerRateCards(
    sourceSellerId: string,
    targetSellerIds: string[],
  ): Promise<CopySellerRateCardResponse> {
    const response = await api.post(
      "/seller-rate-cards/copy-seller",
      {
        sourceSellerId,
        targetSellerIds,
      },
    );

    return response.data;
  },
};

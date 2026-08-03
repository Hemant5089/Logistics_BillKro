import api from "@/lib/axios";

export const SellerRateCardService = {
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
};
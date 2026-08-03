import api from "@/lib/axios";

export interface ShipmentImportResponse {
  success: boolean;
  totalRows: number;
  creates: number;
  updates: number;
  errors: any[];
}

export const ShipmentService = {
  async importShipment(
    sellerId: string,
    file: File,
  ): Promise<ShipmentImportResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      `/shipments/test-import/${sellerId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
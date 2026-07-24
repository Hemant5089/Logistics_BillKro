import api from "@/lib/axios";
import { Seller } from "@/types/seller";
export const SellerService = {
  async getAll(): Promise<Seller[]> {
    const response = await api.get("/sellers");
    return response.data;
  },

  async add(seller: Omit<Seller, "id">): Promise<Seller> {
    const response = await api.post("/sellers", seller);
    return response.data;
  },

  async getById(id: string): Promise<Seller> {
    const response = await api.get(`/sellers/${id}`);
    return response.data;
  },

  async update(
    id: string,
    seller: Partial<Seller>
  ): Promise<Seller> {
    const response = await api.patch(`/sellers/${id}`, seller);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/sellers/${id}`);
  },
};
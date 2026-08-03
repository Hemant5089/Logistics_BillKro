import api from "@/lib/axios";
import { Carrier } from "@/types/carrier";

export const CarrierService = {
  async getAll(): Promise<Carrier[]> {
    const response = await api.get("/carriers");
    return response.data;
  },

  async add(
    carrier: Omit<Carrier, "id" | "isActive">
  ): Promise<Carrier> {
    const response = await api.post("/carriers", carrier);
    return response.data;
  },
};
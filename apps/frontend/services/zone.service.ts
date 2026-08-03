import api from "@/lib/axios";
import { Zone } from "@/types/zone";

export const ZoneService = {
  async getAll(): Promise<Zone[]> {
    const response = await api.get("/zones");
    return response.data;
  },

  async add(
    zone: Omit<Zone, "id" | "isActive">
  ): Promise<Zone> {
    const response = await api.post("/zones", zone);
    return response.data;
  },
};
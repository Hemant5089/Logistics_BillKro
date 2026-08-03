import api from "@/lib/axios";
import { UploadJob } from "@/types/upload";

export const UploadService = {
  async upload(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      "/uploads/file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async getJob(
    id: string | number
  ): Promise<UploadJob> {
    const response = await api.get(
      `/uploads/${id}`
    );

    return response.data;
  },
};
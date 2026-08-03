import api from "@/lib/axios";

export const RateCardTemplateService = {
  async importExcel(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      "/rate-card-template/import",
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
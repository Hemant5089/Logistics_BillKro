import axios from "@/lib/axios";

interface RegisterData {
  name: string;

  email: string;

  password: string;
}

interface LoginData {
  email: string;

  password: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await axios.post(
      "/auth/login",
      data
    );

    return response.data;
  },

  async register(
    data: RegisterData
  ) {
    const response = await axios.post(
      "/auth/register",
      data
    );

    return response.data;
  },

  async getMe() {
    const response = await axios.get(
      "/auth/me"
    );

    return response.data;
  },
};
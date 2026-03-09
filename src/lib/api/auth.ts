import api from "@/lib/axios";
import { AuthUser } from "@/types/auth";

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post("/api/auth/register", data),

  login: (data: LoginPayload) =>
    api.post<LoginResponse>("/api/auth/login", data),
};
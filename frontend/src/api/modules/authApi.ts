import api from "../axios";
import type { LoginRequest, TokenResponse, UserResponse } from "@/types/auth";

export const login = async (payload: LoginRequest): Promise<TokenResponse> => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const getMe = async (): Promise<UserResponse> => {
  const response = await api.get("/auth/me");
  return response.data;
};
import api from "../axios";
import type {
  DashboardStats,
  RecentProduct,
  LowStockProduct,
} from "@/types/dashboard";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getRecentProducts = async (): Promise<RecentProduct[]> => {
  const response = await api.get("/dashboard/recent-products");
  return response.data;
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const response = await api.get("/dashboard/low-stock");
  return response.data;
};
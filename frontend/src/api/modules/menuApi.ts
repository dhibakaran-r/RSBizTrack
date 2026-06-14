import api from "../axios";
import type { MenuResponse } from "@/types/menu";

export const getMyMenus = async (): Promise<MenuResponse[]> => {
  const response = await api.get("/menus/my-menus");
  return response.data;
};
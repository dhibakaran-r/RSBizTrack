import api from "../axios";
import type { StockWithProduct, Stock, StockUpdate } from "@/types/stock";

// Get all stocks with product name
export const getAllStocks = async (): Promise<StockWithProduct[]> => {
  const response = await api.get("/stocks/all");
  return response.data;
};

// Get stock by product id
export const getStockByProductId = async (
  productId: number
): Promise<Stock> => {
  const response = await api.get(`/stocks/product/${productId}`);
  return response.data;
};

// Update stock quantity
export const updateStock = async (
  stockId: number,
  data: StockUpdate
): Promise<Stock> => {
  const response = await api.put(`/stocks/update/${stockId}`, data);
  return response.data;
};
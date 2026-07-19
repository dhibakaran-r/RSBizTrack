import api from "../axios";
import type { Product, ProductCreate, ProductUpdate } from "@/types/product";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/all");
  return response.data;
};

// Get single Product by id
export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get single Product by business id
export const getProductByBusinessId = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/business/${id}`);
  return response.data;
};

// Get single Product by category id
export const getProductByCategoryId = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/category/${id}`);
  return response.data;
};

// Get single Product by unit id
export const getProductByUnitId = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/unit/${id}`);
  return response.data;
};

// Create new Product
export const createProduct = async (
  data: ProductCreate
): Promise<Product> => {
  const response = await api.post("/products/create", data);
  return response.data;
};

// Update existing Product
export const updateProduct = async (
  id: number,
  data: ProductUpdate
): Promise<Product> => {
  const response = await api.put(`/products/update/${id}`, data);
  return response.data;
};

// Delete Product (soft delete)
export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await api.delete(`/products/delete/${id}`);
  return response.data;
};
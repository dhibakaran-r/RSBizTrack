import api from "../axios";
import type { Category, CategoryCreate, CategoryUpdate } from "@/types/category";

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories/all");
  return response.data;
};

// Get single category by id
export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create new category
export const createCategory = async (
  data: CategoryCreate
): Promise<Category> => {
  const response = await api.post("/categories/create", data);
  return response.data;
};

// Update existing category
export const updateCategory = async (
  id: number,
  data: CategoryUpdate
): Promise<Category> => {
  const response = await api.put(`/categories/update/${id}`, data);
  return response.data;
};

// Delete category (soft delete)
export const deleteCategory = async (id: number): Promise<Category> => {
  const response = await api.delete(`/categories/delete/${id}`);
  return response.data;
};
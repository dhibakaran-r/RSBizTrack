import api from "../axios";
import type { Business, BusinessCreate, BusinessUpdate } from "@/types/business";

// Get all businesses
export const getAllBusinesses = async (): Promise<Business[]> => {
  const response = await api.get("/businesses/all");
  return response.data;
};

// Get single business by id
export const getBusinessById = async (id: number): Promise<Business> => {
  const response = await api.get(`/businesses/${id}`);
  return response.data;
};

// Create new business
export const createBusiness = async (
  data: BusinessCreate
): Promise<Business> => {
  const response = await api.post("/businesses/create", data);
  return response.data;
};

// Update existing business
export const updateBusiness = async (
  id: number,
  data: BusinessUpdate
): Promise<Business> => {
  const response = await api.put(`/businesses/update/${id}`, data);
  return response.data;
};

// Delete business (soft delete)
export const deleteBusiness = async (id: number): Promise<Business> => {
  const response = await api.delete(`/businesses/delete/${id}`);
  return response.data;
};
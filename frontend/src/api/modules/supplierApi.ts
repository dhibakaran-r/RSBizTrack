import api from "../axios";
import type { Supplier, SupplierCreate, SupplierUpdate } from "@/types/suppliers";

// Get all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get("/suppliers/all");
  return response.data;
};

// Get single supplier by id
export const getSupplierById = async (id: number): Promise<Supplier> => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

// Create new supplier
export const createSupplier = async (
  data: SupplierCreate
): Promise<Supplier> => {
  const response = await api.post("/suppliers/create", data);
  return response.data;
};

// Update existing supplier
export const updateSupplier = async (
  id: number,
  data: SupplierUpdate
): Promise<Supplier> => {
  const response = await api.put(`/suppliers/update/${id}`, data);
  return response.data;
};

// Delete supplier (soft delete)
export const deleteSupplier = async (id: number): Promise<Supplier> => {
  const response = await api.delete(`/suppliers/delete/${id}`);
  return response.data;
};
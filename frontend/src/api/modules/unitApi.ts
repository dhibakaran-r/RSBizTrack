import api from "../axios";
import type { Unit, UnitCreate, UnitUpdate } from "@/types/unit";

// Get all units
export const getAllUnits = async (): Promise<Unit[]> => {
  const response = await api.get("/units/all");
  return response.data;
};

// Get single unit by id
export const getUnitById = async (id: number): Promise<Unit> => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

// Create new unit
export const createUnit = async (
  data: UnitCreate
): Promise<Unit> => {
  const response = await api.post("/units/create", data);
  return response.data;
};

// Update existing unit
export const updateUnit = async (
  id: number,
  data: UnitUpdate
): Promise<Unit> => {
  const response = await api.put(`/units/update/${id}`, data);
  return response.data;
};

// Delete unit (soft delete)
export const deleteUnit = async (id: number): Promise<Unit> => {
  const response = await api.delete(`/units/delete/${id}`);
  return response.data;
};
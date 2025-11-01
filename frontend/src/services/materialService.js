import apiClient from '../config/api';

/**
 * Material Service - Handles all material-related API calls
 */

// Get all materials
export const getAllMaterials = async () => {
  const response = await apiClient.get('/materials');
  return response.data;
};

// Get single material by ID
export const getMaterialById = async (materialId) => {
  const response = await apiClient.get(`/materials/${materialId}`);
  return response.data;
};

// Create new material
export const createMaterial = async (materialData) => {
  const response = await apiClient.post('/materials', materialData);
  return response.data;
};

// Update material
export const updateMaterial = async (materialId, materialData) => {
  const response = await apiClient.put(`/materials/${materialId}`, materialData);
  return response.data;
};

// Delete material
export const deleteMaterial = async (materialId) => {
  const response = await apiClient.delete(`/materials/${materialId}`);
  return response.data;
};

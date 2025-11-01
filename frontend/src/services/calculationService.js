import apiClient from '../config/api';

/**
 * Calculation Service - Handles all calculation-related API calls
 */

// Get all calculations for a project
export const getCalculationsByProject = async (projectId) => {
  const response = await apiClient.get(`/calculations/project/${projectId}`);
  return response.data;
};

// Get single calculation by ID
export const getCalculationById = async (calculationId) => {
  const response = await apiClient.get(`/calculations/${calculationId}`);
  return response.data;
};

// Create new calculation (room)
export const createCalculation = async (calculationData) => {
  const response = await apiClient.post('/calculations', calculationData);
  return response.data;
};

// Update calculation
export const updateCalculation = async (calculationId, calculationData) => {
  const response = await apiClient.put(`/calculations/${calculationId}`, calculationData);
  return response.data;
};

// Delete calculation
export const deleteCalculation = async (calculationId) => {
  const response = await apiClient.delete(`/calculations/${calculationId}`);
  return response.data;
};

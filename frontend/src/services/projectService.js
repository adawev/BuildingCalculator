import apiClient from '../config/api';

/**
 * Project Service - Handles all project-related API calls
 */

// Get all projects
export const getAllProjects = async () => {
  const response = await apiClient.get('/projects');
  return response.data;
};

// Get single project by ID
export const getProjectById = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}`);
  return response.data;
};

// Create new project
export const createProject = async (projectData) => {
  const response = await apiClient.post('/projects', projectData);
  return response.data;
};

// Update project
export const updateProject = async (projectId, projectData) => {
  const response = await apiClient.put(`/projects/${projectId}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (projectId) => {
  const response = await apiClient.delete(`/projects/${projectId}`);
  return response.data;
};

// Get project summary
export const getProjectSummary = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/summary`);
  return response.data;
};

// Download project PDF
export const downloadProjectPdf = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/summary/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

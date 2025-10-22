import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const calculationAPI = {
  calculate: (data) => api.post('/calculate', data),
  getCalculation: (id) => api.get(`/calculate/${id}`),
  getProjectCalculations: (projectId) => api.get(`/calculate/project/${projectId}`),
};

export const materialAPI = {
  getAll: () => api.get('/materials'),
  getByType: (type) => api.get(`/materials/type/${type}`),
  getMaterial: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export default api;

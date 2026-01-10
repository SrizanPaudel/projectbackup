import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

// Admin/Properties API
export const adminAPI = {
  getAllProperties: async () => {
    const response = await api.get('/admin/properties');
    return response.data;
  },
  getPropertyById: async (id) => {
    const response = await api.get(`/admin/properties/${id}`);
    return response.data;
  },
  createProperty: async (propertyData) => {
    const response = await api.post('/admin/properties', propertyData);
    return response.data;
  },
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/admin/properties/${id}`, propertyData);
    return response.data;
  },
  deleteProperty: async (id) => {
    const response = await api.delete(`/admin/properties/${id}`);
    return response.data;
  },
};

export default api;


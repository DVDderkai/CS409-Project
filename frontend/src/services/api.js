import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password) =>
    api.post('/register', { email, password }),
  
  login: (email, password) =>
    api.post('/login', { email, password }),
};

// Notes API
export const notesAPI = {
  getAll: () =>
    api.get('/notes'),
  
  getOne: (id) =>
    api.get(`/notes/${id}`),
  
  create: (data) =>
    api.post('/notes', data),
  
  update: (id, data) =>
    api.put(`/notes/${id}`, data),
  
  delete: (id) =>
    api.delete(`/notes/${id}`),
};

// Review Plan API
export const reviewPlanAPI = {
  getAll: () =>
    api.get('/review-plan'),
  
  getOne: (id) =>
    api.get(`/review-plan/${id}`),
  
  create: (data) =>
    api.post('/review-plan', data),
  
  update: (id, data) =>
    api.put(`/review-plan/${id}`, data),
  
  delete: (id) =>
    api.delete(`/review-plan/${id}`),
};

// Progress API
export const progressAPI = {
  get: () =>
    api.get('/progress'),
};

export default api;


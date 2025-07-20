import axios from 'axios';
import { config } from '../config';

// API base URL - Use environment variable or fallback to Render URL
export const API_BASE_URL = config.API_BASE_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request interceptor
apiClient.interceptors.request.use(
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_roles');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { identifier: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string }) =>
    apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (userData: any) => apiClient.put('/auth/profile', userData),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/auth/change-password', passwordData),
};

export const usersAPI = {
  getAll: () => apiClient.get('/users'),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (userData: any) => apiClient.post('/users', userData),
  update: (id: string, userData: any) => apiClient.put(`/users/${id}`, userData),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

export const productsAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  getFeatured: () => apiClient.get('/products'),
  getImageUrl: (imagePath: string) => `${API_BASE_URL}/uploads/${imagePath}`,
  create: (productData: any) => apiClient.post('/products', productData),
  update: (id: string, productData: any) => apiClient.put(`/products/${id}`, productData),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
  getActive: () => apiClient.get('/categories'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
  create: (categoryData: { name: string; description: string }) => apiClient.post('/categories', categoryData),
  update: (id: string, categoryData: { name: string; description: string }) => apiClient.put(`/categories/${id}`, categoryData),
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

export const ordersAPI = {
  create: (data: any) => apiClient.post('/orders', data),
  getAll: () => apiClient.get('/orders'),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  getByUser: (userId: string) => apiClient.get(`/orders/user/${userId}`),
  updateStatus: (id: string, status: string) => apiClient.put(`/orders/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/orders/${id}`),
};

export const searchAPI = {
  products: (query?: string, category?: string) => 
    apiClient.get('/search/products', { params: { q: query, category } }),
  categories: (query?: string) => 
    apiClient.get('/search/categories', { params: { q: query } }),
  stats: () => apiClient.get('/search/stats'),
};

export const statsAPI = {
  getDashboardStats: () => apiClient.get('/search/stats'),
  getStats: () => apiClient.get('/search/stats'),
};

export const promotionsAPI = {
  getActive: () => Promise.resolve({ data: [] }),
  subscribe: (email: string) => Promise.resolve({ data: { message: 'Subscribed' } }),
  getNotifications: () => Promise.resolve({ data: [] }),
};

export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Fallback method for when backend upload isn't available
  uploadImageLocal: (file: File) => {
    return new Promise((resolve) => {
      // Store in localStorage as base64 for demo purposes
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const imageKey = `product_image_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        try {
          localStorage.setItem(imageKey, base64);
          resolve({
            data: {
              imageUrl: imageKey,
              filename: file.name,
              success: true
            }
          });
        } catch (error) {
          // If localStorage is full, just return the filename
          resolve({
            data: {
              imageUrl: file.name.replace(/\s+/g, '-').toLowerCase(),
              filename: file.name,
              success: true
            }
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }
};

// Keep backward compatibility
export const api = apiClient;
export default apiClient;

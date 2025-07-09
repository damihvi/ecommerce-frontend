import axios from 'axios';

// API base URL
export const API_BASE_URL = 'http://localhost:3010/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
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
    // Handle common errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string }) =>
    apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/session/profile'),
};

export const productsAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  getFeatured: () => apiClient.get('/products/featured'),
  getByCategory: (categoryId: string) => apiClient.get(`/products/category/${categoryId}`),
};

export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
  getActive: () => apiClient.get('/categories/active'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
};

export const cartAPI = {
  getCart: (userId: string) => apiClient.get(`/cart/user/${userId}`),
  addToCart: (data: { userId: string; productId: string; quantity: number }) =>
    apiClient.post('/cart/add', data),
  updateCartItem: (cartItemId: string, data: { quantity: number }) =>
    apiClient.put(`/cart/item/${cartItemId}`, data),
  removeFromCart: (data: { userId: string; productId: string }) =>
    apiClient.delete('/cart/remove', { data }),
  clearCart: (userId: string) => apiClient.delete(`/cart/user/${userId}/clear`),
};

export const ordersAPI = {
  create: (data: any) => apiClient.post('/orders', data),
  getAll: (params?: any) => apiClient.get('/orders', { params }),
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => apiClient.put(`/orders/${id}`, { status }),
};

export const statsAPI = {
  getStats: () => apiClient.get('/stats'),
  getDashboardStats: () => apiClient.get('/stats/dashboard'),
};

export const promotionsAPI = {
  getActive: () => apiClient.get('/promotions/active'),
  subscribe: (email: string) => apiClient.post('/promotions/subscribe', { email }),
  getNotifications: () => apiClient.get('/promotions/notifications'),
};

// Keep backward compatibility
export const api = apiClient;
export default apiClient;

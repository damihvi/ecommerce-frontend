import axios from 'axios';

// API base URL - VPS Production Server
export const API_BASE_URL = 'https://nestjs-ecommerce-backend-api.desarrollo-software.xyz/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Importante para CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('user_roles');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', token); // Debug
    } else {
      console.log('No token found in localStorage'); // Debug
    }
    
    if (roles) {
      config.headers['X-User-Roles'] = roles;
      console.log('Roles added to request:', roles); // Debug
    } else {
      console.log('No roles found in localStorage'); // Debug
    }

    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params
    }); // Debug
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error); // Debug
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    }); // Debug

    // Handle common errors
    if (error.response?.status === 401) {
      // Only redirect to login if there's a token (user was logged in)
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_roles');
        window.location.href = '/login';
      }
    }
    
    if (error.response?.status === 403) {
      const token = localStorage.getItem('token');
      const roles = localStorage.getItem('user_roles');
      console.error('Forbidden Error Details:', {
        token: token ? 'Present' : 'Missing',
        roles: roles || 'Missing',
        url: error.config?.url
      }); // Debug
      
      // Si es un error de permisos, formatear el mensaje
      error.message = 'No tienes permisos para realizar esta acción';
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
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/session/profile'),
};

export const usersAPI = {
  getAll: (params?: any) => apiClient.get('/users', { params }),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (userData: any) => apiClient.post('/users', userData),
  update: (id: string, userData: any) => apiClient.put(`/users/${id}`, userData),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  updateRole: (id: string, role: string) => apiClient.patch(`/users/${id}/role`, { role }),
};

export const productsAPI = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  getFeatured: () => apiClient.get('/products/featured'),
  getByCategory: (categoryId: string) => apiClient.get(`/products/category/${categoryId}`),
  create: (productData: FormData) => apiClient.post('/products', productData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, productData: FormData) => apiClient.put(`/products/${id}`, productData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
  uploadImage: (productId: string, imageFile: FormData) => 
    apiClient.post(`/products/${productId}/image`, imageFile, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteImage: (productId: string, imageId: string) => 
    apiClient.delete(`/products/${productId}/images/${imageId}`),
  getImageUrl: (imagePath: string) => `${API_BASE_URL}/uploads/${imagePath}`,
};

export const categoriesAPI = {
  getAll: (params?: any) => apiClient.get('/admin/categories', { params }),
  getActive: () => apiClient.get('/categories/active'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
  create: (categoryData: { name: string; description: string }) => apiClient.post('/admin/categories', categoryData),
  update: (id: number, categoryData: { name: string; description: string }) => apiClient.put(`/admin/categories/${id}`, categoryData),
  delete: (id: number) => apiClient.delete(`/admin/categories/${id}`),
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

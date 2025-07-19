// Rutas públicas
export const PUBLIC_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  CATEGORIES: {
    LIST: '/categories',
    PUBLIC_LIST: '/categories/public',
    BY_SLUG: (slug: string) => `/categories/${slug}`,
    ACTIVE: '/categories/active',
  },
  PRODUCTS: {
    LIST: '/products',
    PUBLIC_LIST: '/products/public',
    FEATURED: '/products/featured',
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
    BY_SLUG: (slug: string) => `/products/${slug}`,
  },
  CART: {
    GET: (userId: string) => `/cart/user/${userId}`,
    ADD: '/cart/add',
    UPDATE: (itemId: string) => `/cart/item/${itemId}`,
    REMOVE: '/cart/remove',
    CLEAR: (userId: string) => `/cart/user/${userId}/clear`,
  },
};

// Rutas administrativas (requieren autenticación y rol de admin)
export const ADMIN_ROUTES = {
  CATEGORIES: {
    BASE: '/categories',
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    TOGGLE: (id: string) => `/categories/${id}/toggle-active`,
    UPLOAD_IMAGE: (id: string) => `/categories/${id}/image`,
  },
  PRODUCTS: {
    BASE: '/products',
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    TOGGLE: (id: string) => `/products/${id}/toggle-active`,
    TOGGLE_FEATURED: (id: string) => `/products/${id}/toggle-featured`,
    UPLOAD_IMAGES: (id: string) => `/products/${id}/images`,
  },
  ORDERS: {
    BASE: '/orders',
    LIST: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    STATS: '/orders/stats',
  },
  USERS: {
    BASE: '/users',
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    TOGGLE: (id: string) => `/users/${id}/toggle-active`,
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
  },
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
    SALES: '/admin/dashboard/sales',
    INVENTORY: '/admin/dashboard/inventory',
  },
};

// Configuración de API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://damihvi.onrender.com/api',
  TIMEOUT: 45000, // 45 segundos para Render
  RETRY_ATTEMPTS: 3,
};

// Headers comunes
export const API_HEADERS = {
  PUBLIC: {
    'Content-Type': 'application/json',
  },
  PRIVATE: {
    'Content-Type': 'application/json',
    // El token se agregará dinámicamente
  },
  MULTIPART: {
    // Para subida de archivos
    // Content-Type se establecerá automáticamente con FormData
  },
};

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  SELLER: 'seller',
};

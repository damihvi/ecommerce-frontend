// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://damihvi.onrender.com/api',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // App Configuration
  APP_NAME: 'E-commerce Frontend',
  VERSION: '1.0.0',
  
  // Timeout settings
  API_TIMEOUT: 90000, // 90 seconds for Render cold start (increased from 45s)
  
  // Upload settings
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

export default config;

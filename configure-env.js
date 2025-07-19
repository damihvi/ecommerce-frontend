#!/usr/bin/env node

/**
 * Configuration script for different environments
 * Usage: node configure-env.js [environment] [backend-url]
 * 
 * Examples:
 * node configure-env.js production https://my-backend.onrender.com/api
 * node configure-env.js development http://localhost:3001/api
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const environment = args[0] || 'production';
const backendUrl = args[1];

if (!backendUrl) {
  console.error('❌ Error: Backend URL is required');
  console.log('Usage: node configure-env.js [environment] [backend-url]');
  console.log('Example: node configure-env.js production https://my-backend.onrender.com/api');
  process.exit(1);
}

const envContent = `# Environment Configuration
# Generated on ${new Date().toISOString()}

# Backend API Configuration
REACT_APP_API_BASE_URL=${backendUrl}

# Environment
REACT_APP_ENV=${environment}
NODE_ENV=${environment}

# App Configuration
REACT_APP_NAME=E-commerce Frontend
REACT_APP_VERSION=1.0.0
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment configuration updated successfully!');
  console.log(`📍 Environment: ${environment}`);
  console.log(`🔗 Backend URL: ${backendUrl}`);
  console.log(`📄 File: ${envPath}`);
} catch (error) {
  console.error('❌ Error writing .env file:', error.message);
  process.exit(1);
}

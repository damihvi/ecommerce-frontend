#!/usr/bin/env node

/**
 * Backend Connection Test Script
 * Tests the connection to the backend API
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://tu-backend.onrender.com/api';

console.log('🔍 Testing Backend Connection...');
console.log(`📍 Backend URL: ${API_BASE_URL}`);
console.log('');

async function testEndpoint(name, endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      timeout: 10000,
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    console.log(`✅ ${name}: ${response.status} ${response.statusText}`);
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`❌ ${name}: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      console.log(`❌ ${name}: No response received (timeout or network error)`);
    } else {
      console.log(`❌ ${name}: ${error.message}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('Testing API endpoints...\n');
  
  const tests = [
    ['Health Check', '/'],
    ['Products', '/products'],
    ['Categories', '/categories'],
    ['Users', '/users'],
    ['Search Products', '/search/products'],
    ['Search Stats', '/search/stats'],
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const [name, endpoint] of tests) {
    if (await testEndpoint(name, endpoint)) {
      passed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Backend is accessible.');
  } else {
    console.log('⚠️  Some tests failed. Check your backend configuration.');
  }
  
  return passed === total;
}

// Run the tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test runner error:', error.message);
    process.exit(1);
  });
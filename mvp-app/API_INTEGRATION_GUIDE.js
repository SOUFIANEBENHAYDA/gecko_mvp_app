import React from 'react';

/**
 * GECKO API INTEGRATION GUIDE
 * 
 * This file contains template code and instructions for integrating
 * the GECKO MVP app with real backend APIs and DGI systems.
 */

// ============================================================================
// 1. BASIC FETCH API INTEGRATION (HTTP Requests)
// ============================================================================

/**
 * Example: Send invoice to your backend API
 * 
 * Replace the mock setTimeout in FactureCreation.jsx's sendToApi() with:
 */

const submitInvoiceToApi = async (apiPayload) => {
  try {
    const response = await fetch('https://api.your-domain.com/v1/factures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-API-Key': 'your-api-key-here'
      },
      body: JSON.stringify(apiPayload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to submit invoice:', error);
    throw error;
  }
};

// ============================================================================
// 2. AXIOS INTEGRATION (Alternative to Fetch)
// ============================================================================

/**
 * Installation:
 * npm install axios
 * 
 * Usage:
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.your-domain.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});

const submitInvoiceWithAxios = async (apiPayload) => {
  try {
    const response = await axiosInstance.post('/factures', apiPayload);
    return response.data;
  } catch (error) {
    console.error('Axios error:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================================================
// 3. ENVIRONMENT VARIABLES SETUP
// ============================================================================

/**
 * Create a .env file in your project root:
 */

const ENV_EXAMPLE = `
# API Configuration
VITE_API_BASE_URL=https://api.your-domain.com/v1
VITE_API_KEY=your-api-key-here
VITE_DGI_API_URL=https://dgi.gov.ma/api
VITE_AUTH_TOKEN_KEY=gecko_auth_token

# Environment
VITE_ENV=development
VITE_DEBUG=true
`;

/**
 * Access in React:
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// ============================================================================
// 4. API REQUEST/RESPONSE INTERCEPTORS
// ============================================================================

/**
 * Create a utility file: src/utils/apiClient.js
 */

const apiClientTemplate = `
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - Add auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
`;

// ============================================================================
// 5. FACTURE SUBMISSION HOOK
// ============================================================================

/**
 * Create a custom hook: src/hooks/useFactureSubmission.js
 */

const useFactureSubmissionHook = `
import { useState } from 'react';
import client from '../utils/apiClient';

export const useFactureSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submitFacture = async (factureData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate facture data
      if (!factureData.invoiceNumber || !factureData.xmlData) {
        throw new Error('Données de facture incomplètes');
      }

      // Submit to API
      const response = await client.post('/factures', {
        ...factureData,
        submittedAt: new Date().toISOString(),
      });

      // Handle response
      if (response.data?.validationId) {
        setSuccess({
          message: 'Facture soumise avec succès',
          validationId: response.data.validationId,
          receiptNumber: response.data.receiptNumber
        });
        return response.data;
      }

      throw new Error('Réponse API invalide');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitFacture, loading, error, success };
};
`;

// ============================================================================
// 6. DGI API INTEGRATION TEMPLATE
// ============================================================================

/**
 * For integrating with Morocco's DGI (Tax Authority) API
 */

const dgiApiTemplate = `
// src/services/dgiService.js

const DGI_API_BASE = import.meta.env.VITE_DGI_API_URL;

export const dgiService = {
  // Validate invoice with DGI
  validateInvoice: async (xmlData, signature) => {
    try {
      const response = await fetch(\`\${DGI_API_BASE}/validate\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'X-Signature': signature,
          'X-Certificate': getCertificate(),
        },
        body: xmlData
      });

      if (!response.ok) throw new Error('DGI validation failed');
      return await response.json();
    } catch (error) {
      console.error('DGI validation error:', error);
      throw error;
    }
  },

  // Submit invoice to DGI
  submitInvoice: async (invoiceData) => {
    try {
      const formData = new FormData();
      formData.append('invoice', invoiceData.xmlData);
      formData.append('signature', invoiceData.signature);
      formData.append('certificate', invoiceData.certificate);

      const response = await fetch(\`\${DGI_API_BASE}/submit\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${getAPIToken()}\`,
        },
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('DGI submission error:', error);
      throw error;
    }
  },

  // Get validation status
  getValidationStatus: async (validationId) => {
    const response = await fetch(\`\${DGI_API_BASE}/status/\${validationId}\`);
    return await response.json();
  }
};
`;

// ============================================================================
// 7. ERROR HANDLING & RETRY LOGIC
// ============================================================================

/**
 * Retry utility for failed requests
 */

const retryUtility = `
export const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
};

// Usage:
const submitWithRetry = retryRequest(
  () => submitInvoiceToApi(apiPayload),
  3,
  1000
);
`;

// ============================================================================
// 8. NOTIFICATION/TOAST SYSTEM
// ============================================================================

/**
 * For displaying API responses to users
 */

const toastNotificationTemplate = `
// src/utils/toast.js

export const toast = {
  success: (message) => {
    // Implement your toast library (react-toastify, etc)
    console.log('✅ Success:', message);
  },
  error: (message) => {
    console.error('❌ Error:', message);
  },
  info: (message) => {
    console.info('ℹ️ Info:', message);
  }
};

// Integration with sendToApi():
const sendToApi = async () => {
  try {
    const result = await submitInvoiceToApi(apiPayload);
    toast.success('Facture envoyée avec succès!');
    setValidationMessage('✅ ' + result.message);
  } catch (error) {
    toast.error('Erreur: ' + error.message);
    setError('Erreur lors de l\'envoi: ' + error.message);
  }
};
`;

// ============================================================================
// 9. AUTHENTICATION TOKEN MANAGEMENT
// ============================================================================

/**
 * Handle JWT tokens and authentication
 */

const authTokenManagement = `
// src/utils/authToken.js

export const authTokenManager = {
  // Save token from login response
  saveToken: (token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', Date.now() + (24 * 60 * 60 * 1000)); // 24h
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Check if token is still valid
  isTokenValid: () => {
    const expiry = localStorage.getItem('tokenExpiry');
    return expiry && Date.now() < parseInt(expiry);
  },

  // Clear token on logout
  clearToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
  }
};
`;

// ============================================================================
// 10. BACKEND REQUIREMENTS CHECKLIST
// ============================================================================

const backendRequirements = `
# Backend API Requirements for GECKO

## Authentication Endpoints
- POST /auth/login (email, password, companyName) → returns JWT token
- POST /auth/logout
- POST /auth/refresh-token

## Facture Endpoints
- POST /api/v1/factures (Submit new invoice)
  Input: Full apiPayload from frontend
  Output: { success: bool, invoiceNumber: string, validationId: string }

- GET /api/v1/factures/:invoiceNumber (Retrieve invoice)
- GET /api/v1/factures (List all invoices for user)
- PUT /api/v1/factures/:invoiceNumber (Update invoice)
- DELETE /api/v1/factures/:invoiceNumber (Soft delete)

## XML/Document Endpoints
- POST /api/v1/factures/:invoiceNumber/xml (Get XML)
- POST /api/v1/factures/:invoiceNumber/pdf (Generate PDF)
- POST /api/v1/factures/validate-xml (Validate XML against schema)

## DGI Integration Endpoints
- GET /api/v1/dgi/validation-status/:validationId
- POST /api/v1/dgi/submit (Forward to DGI servers)

## Database Models Needed
- User (email, password, companyName, companySiret, companyIce, createdAt)
- Invoice (invoiceNumber, userId, clientIce, clientData, amountHt, tvaRate, xmlData, status, createdAt)
- InvoiceHistory (Audit log of all changes)

## Security Requirements
- JWT authentication on all protected endpoints
- Rate limiting (e.g., 100 requests/minute)
- HTTPS only
- CORS properly configured
- Input validation and sanitization
- SQL injection prevention
- XML injection prevention
`;

// ============================================================================
// 11. DATABASE SCHEMA EXAMPLES
// ============================================================================

const databaseSchemas = `
-- SQL Example (PostgreSQL)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_ice VARCHAR(15) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL REFERENCES users(id),
  validation_id VARCHAR(50) UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  client_ice VARCHAR(15) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  client_address TEXT,
  amount_ht DECIMAL(12, 2) NOT NULL,
  vat_rate INT DEFAULT 20,
  xml_data LONGTEXT,
  pdf_data LONGBLOB,
  status ENUM('draft', 'submitted', 'validated', 'rejected') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE invoice_history (
  id SERIAL PRIMARY KEY,
  invoice_id INT NOT NULL REFERENCES invoices(id),
  action VARCHAR(50),
  old_value LONGTEXT,
  new_value LONGTEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// ============================================================================
// 12. DEPLOYMENT CHECKLIST
// ============================================================================

const deploymentChecklist = `
# Before Going to Production

Frontend Checklist:
- [ ] Replace all mock data with real API calls
- [ ] Add environment variable configuration
- [ ] Implement proper error handling
- [ ] Add loading states and user feedback
- [ ] Test all file downloads
- [ ] Verify HTTPS on all API calls
- [ ] Add SSL certificate pinning (optional)
- [ ] Test on mobile browsers
- [ ] Implement caching strategy
- [ ] Add service worker for offline support
- [ ] Minify and optimize assets
- [ ] Run security audit (npm audit)

Backend Checklist:
- [ ] Implement real authentication (JWT, OAuth2)
- [ ] Add database for persistence
- [ ] Setup database backups
- [ ] Implement rate limiting
- [ ] Add API logging and monitoring
- [ ] Setup CORS correctly
- [ ] Add input validation on all endpoints
- [ ] Implement XSS protection
- [ ] Add CSRF tokens
- [ ] Setup DGI API integration
- [ ] Create comprehensive API documentation
- [ ] Setup monitoring and alerting
- [ ] Create disaster recovery plan

DevOps Checklist:
- [ ] Setup CI/CD pipeline
- [ ] Configure automated testing
- [ ] Setup staging environment
- [ ] Setup production environment
- [ ] Configure domain and SSL
- [ ] Setup CDN for static assets
- [ ] Configure database backups
- [ ] Setup log aggregation
- [ ] Monitor application performance
- [ ] Alert on errors and failures
`;

export {
  submitInvoiceToApi,
  submitInvoiceWithAxios,
  apiClientTemplate,
  useFactureSubmissionHook,
  dgiApiTemplate,
  retryUtility,
  toastNotificationTemplate,
  authTokenManagement,
  backendRequirements,
  databaseSchemas,
  deploymentChecklist
};

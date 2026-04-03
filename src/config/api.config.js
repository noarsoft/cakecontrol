/**
 * API Configuration
 * Centralized API endpoint configuration
 */

const API_CONFIG = {
  // API Base URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3002',

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      REGISTER: '/auth/register',
    },
    USERS: '/users',
    GROUPS: '/groups',
    ROLES: '/roles',
  },

  // Request Timeout (ms)
  TIMEOUT: 10000,

  // Default Headers
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

/**
 * Get full API URL for an endpoint
 * @param {string} endpoint - The endpoint path (e.g., '/auth/login')
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG;

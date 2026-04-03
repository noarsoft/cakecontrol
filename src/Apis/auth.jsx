// src/Apis/auth.jsx
import API_CONFIG, { getApiUrl } from '../config/api.config';
const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.BASE);

/**
 * Login with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{accessToken: string, userxRootId: string, expiresAt: number}>}
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง โปรดตรวจสอบการเชื่อมต่อ');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  // Save tokens to localStorage
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('userxRootId', data.userxRootId);
    localStorage.setItem('expiresAt', data.expiresAt);
  }

  return data;
};

/**
 * Register new user
 * @param {Object} userData - { email, password }
 * @returns {Promise<{accessToken: string, userxRootId: string, expiresAt: number}>}
 */
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง โปรดตรวจสอบการเชื่อมต่อ');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'ลงทะเบียนไม่สำเร็จ');
  }

  // Save tokens to localStorage
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('userxRootId', data.userxRootId);
    localStorage.setItem('expiresAt', data.expiresAt);
  }

  return data;
};

/**
 * Logout - clear local storage
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userxRootId');
  localStorage.removeItem('expiresAt');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const expiresAt = localStorage.getItem('expiresAt');
  
  if (!token || !expiresAt) {
    return false;
  }

  // Check if token is expired
  const now = Date.now();
  if (now >= parseInt(expiresAt)) {
    logout();
    return false;
  }

  return true;
};

/**
 * Get current access token
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Get current user's rootId
 * @returns {string|null}
 */
export const getUserRootId = () => {
  return localStorage.getItem('userxRootId');
};

/**
 * Refresh token (if backend supports it)
 * @returns {Promise<{accessToken: string, expiresAt: number}>}
 */
export const refreshToken = async () => {
  const token = getAccessToken();
  
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'ไม่สามารถรีเฟรช token ได้');
  }

  // Update tokens
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('expiresAt', data.expiresAt);
  }

  return data;
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getAccessToken,
  getUserRootId,
  refreshToken
};

// src/Apis/user.jsx
import API_CONFIG, { getApiUrl } from '../config/api.config';
const API_URL = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.BASE);

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Get current user's rootId
 */
const getUserRootId = () => {
  return localStorage.getItem('userxRootId');
};

/**
 * List all users with pagination
 * @param {Object} options - { page, limit, search }
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
export const listUsers = async (options = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  const userxRootId = getUserRootId();
  
  const params = new URLSearchParams({
    userxRootId,
    page,
    limit,
    search
  });

  const response = await fetch(`${API_URL}/userx?${params}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch users');
  }

  return response.json();
};

/**
 * Get user by rootId
 * @param {string} rootId 
 * @returns {Promise<Object>}
 */
export const getUserByRootId = async (rootId) => {
  const userxRootId = getUserRootId();
  
  const response = await fetch(`${API_URL}/userx/root/${rootId}?userxRootId=${userxRootId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user');
  }

  return response.json();
};

/**
 * Create new user
 * @param {Object} userData - { email, password, isPowerUser }
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  const userxRootId = getUserRootId();
  
  const response = await fetch(`${API_URL}/userx?userxRootId=${userxRootId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user');
  }

  return response.json();
};

/**
 * Update user by rootId
 * @param {string} rootId 
 * @param {Object} userData - { email?, password?, isPowerUser? }
 * @returns {Promise<Object>}
 */
export const updateUser = async (rootId, userData) => {
  const userxRootId = getUserRootId();
  
  const response = await fetch(`${API_URL}/userx/root/${rootId}?userxRootId=${userxRootId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }

  return response.json();
};

/**
 * Delete user by rootId
 * @param {string} rootId 
 * @returns {Promise<void>}
 */
export const deleteUser = async (rootId) => {
  const userxRootId = getUserRootId();
  
  const response = await fetch(`${API_URL}/userx/root/${rootId}?userxRootId=${userxRootId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }

  return;
};

/**
 * Get user's groups
 * @param {string} userRootId 
 * @returns {Promise<{data: Array}>}
 */
export const getUserGroups = async (userRootId) => {
  const response = await fetch(`${API_URL}/groupx-userx/user/${userRootId}/details`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user groups');
  }

  const result = await response.json();
  
  // API returns array directly, wrap in standard format
  return {
    data: Array.isArray(result) ? result : []
  };
};

/**
 * Add user to group
 * @param {string} userRootId 
 * @param {string} groupRootId 
 * @returns {Promise<Object>}
 */
export const addUserToGroup = async (userRootId, groupRootId) => {
  const response = await fetch(`${API_URL}/groupx-userx`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      userxRootId: userRootId,
      groupxRootId: groupRootId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add user to group');
  }

  return response.json();
};

/**
 * Remove user from group
 * @param {string} membershipRootId 
 * @returns {Promise<void>}
 */
export const removeUserFromGroup = async (membershipRootId) => {
  const response = await fetch(`${API_URL}/groupx-userx/root/${membershipRootId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove user from group');
  }

  return;
};

/**
 * Get user's roles
 * @param {string} userRootId 
 * @returns {Promise<{data: Array}>}
 */
export const getUserRoles = async (userRootId) => {
  const response = await fetch(`${API_URL}/userx-rolex/user/${userRootId}/details`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user roles');
  }

  const result = await response.json();
  
  // API returns array directly, wrap in standard format
  return {
    data: Array.isArray(result) ? result : []
  };
};

/**
 * Add role to user
 * @param {string} userRootId 
 * @param {string} roleRootId 
 * @param {string} appRootId 
 * @returns {Promise<Object>}
 */
export const addRoleToUser = async (userRootId, roleRootId, appRootId) => {
  const response = await fetch(`${API_URL}/userx-rolex`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      userxRootId: userRootId,
      rolexRootId: roleRootId,
      appxRootId: appRootId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add role to user');
  }

  return response.json();
};

/**
 * Remove role from user
 * @param {string} assignmentRootId 
 * @returns {Promise<void>}
 */
export const removeRoleFromUser = async (assignmentRootId) => {
  const response = await fetch(`${API_URL}/userx-rolex/root/${assignmentRootId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove role from user');
  }

  return;
};

// ============================================
// GROUP (groupx) API
// ============================================

/**
 * List all groups
 * @param {Object} options - { page, limit, search }
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
export const listGroups = async (options = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  
  const params = new URLSearchParams({ page, limit, search });

  const response = await fetch(`${API_URL}/groupx?${params}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch groups');
  }

  return response.json();
};

/**
 * Get group by rootId
 * @param {string} rootId 
 * @returns {Promise<Object>}
 */
export const getGroup = async (rootId) => {
  const response = await fetch(`${API_URL}/groupx/${rootId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch group');
  }

  return response.json();
};

/**
 * Create new group
 * @param {Object} groupData - { groupKey, name, description }
 * @returns {Promise<Object>}
 */
export const createGroup = async (groupData) => {
  const response = await fetch(`${API_URL}/groupx`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(groupData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create group');
  }

  return response.json();
};

/**
 * Update group
 * @param {string} rootId 
 * @param {Object} groupData 
 * @returns {Promise<Object>}
 */
export const updateGroup = async (rootId, groupData) => {
  const response = await fetch(`${API_URL}/groupx/${rootId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(groupData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update group');
  }

  return response.json();
};

/**
 * Delete group
 * @param {string} rootId 
 * @returns {Promise<void>}
 */
export const deleteGroup = async (rootId) => {
  const response = await fetch(`${API_URL}/groupx/${rootId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete group');
  }

  return;
};

/**
 * Get group members
 * @param {string} groupRootId 
 * @returns {Promise<{data: Array}>}
 */
export const getGroupMembers = async (groupRootId) => {
  const response = await fetch(`${API_URL}/groupx-userx/group/${groupRootId}/members`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch group members');
  }

  return response.json();
};

// ============================================
// ROLE (rolex) API
// ============================================

/**
 * List all roles
 * @param {Object} options - { page, limit, search }
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
export const listRoles = async (options = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  
  const params = new URLSearchParams({ page, limit, search });

  const response = await fetch(`${API_URL}/rolex?${params}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch roles');
  }

  return response.json();
};

/**
 * Get role by rootId
 * @param {string} rootId 
 * @returns {Promise<Object>}
 */
export const getRole = async (rootId) => {
  const response = await fetch(`${API_URL}/rolex/${rootId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch role');
  }

  return response.json();
};

/**
 * Create new role
 * @param {Object} roleData - { roleKey, name, description, perms_schema, perms_service }
 * @returns {Promise<Object>}
 */
export const createRole = async (roleData) => {
  const response = await fetch(`${API_URL}/rolex`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(roleData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create role');
  }

  return response.json();
};

/**
 * Update role
 * @param {string} rootId 
 * @param {Object} roleData 
 * @returns {Promise<Object>}
 */
export const updateRole = async (rootId, roleData) => {
  const response = await fetch(`${API_URL}/rolex/${rootId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(roleData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update role');
  }

  return response.json();
};

/**
 * Delete role
 * @param {string} rootId 
 * @returns {Promise<void>}
 */
export const deleteRole = async (rootId) => {
  const response = await fetch(`${API_URL}/rolex/${rootId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete role');
  }

  return;
};

// ============================================
// FILE UPLOAD API
// ============================================

/**
 * Initiate file upload
 * @param {string} filename 
 * @returns {Promise<{uploadToken: string, uploadPath: string}>}
 */
export const initiateUpload = async (filename) => {
  const response = await fetch(`${API_URL}/fileupload/initiate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ filename })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to initiate upload');
  }

  return response.json();
};

/**
 * Upload file chunk
 * @param {string} uploadToken 
 * @param {string} filename 
 * @param {number} part 
 * @param {number} totalParts 
 * @param {string} base64Data 
 * @returns {Promise}
 */
export const uploadChunk = async (uploadToken, filename, part, totalParts, base64Data) => {
  const response = await fetch(`${API_URL}/fileupload/${uploadToken}/chunk`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      filename,
      part,
      total_part_number: totalParts,
      base64: base64Data
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload chunk');
  }

  return response.json();
};

/**
 * Finalize file upload
 * @param {string} uploadToken 
 * @returns {Promise}
 */
export const finalizeUpload = async (uploadToken) => {
  const response = await fetch(`${API_URL}/fileupload/${uploadToken}/finalize`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to finalize upload');
  }

  return response.json();
};

/**
 * Cancel file upload
 * @param {string} uploadToken 
 * @returns {Promise}
 */
export const cancelUpload = async (uploadToken) => {
  const response = await fetch(`${API_URL}/fileupload/${uploadToken}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel upload');
  }

  return response.json();
};

/**
 * Get file by rootId
 * @param {string} fileId 
 * @returns {Promise}
 */
export const getFile = async (fileId) => {
  const response = await fetch(`${API_URL}/fileupload/${fileId}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch file');
  }

  return response.json();
};

/**
 * List uploaded files
 * @param {Object} options - { page, limit }
 * @returns {Promise}
 */
export const listFiles = async (options = {}) => {
  const { page = 1, limit = 10 } = options;
  
  const params = new URLSearchParams({ page, limit });

  const response = await fetch(`${API_URL}/fileupload?${params}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch files');
  }

  return response.json();
};

/**
 * Update file record
 * @param {string} fileId 
 * @param {Object} fileData 
 * @returns {Promise}
 */
export const updateFile = async (fileId, fileData) => {
  const response = await fetch(`${API_URL}/fileupload/${fileId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(fileData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update file');
  }

  return response.json();
};

/**
 * Delete file
 * @param {string} fileId 
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileId) => {
  const response = await fetch(`${API_URL}/fileupload/${fileId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete file');
  }

  return;
};

// ============================================
// PERMISSIONS API
// ============================================

/**
 * Check if user has specific permission
 * @param {string} permission - Permission key (e.g., 'userx.read')
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // In a real implementation, decode JWT or call backend
    // For now, assume backend validates on request
    return true;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};

/**
 * Get user's permissions
 * @returns {Promise<Array>}
 */
export const getUserPermissions = async () => {
  try {
    const response = await fetch(`${API_URL}/userx/permissions`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch permissions');
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return [];
  }
};

export default {
  listUsers,
  getUserByRootId,
  createUser,
  updateUser,
  deleteUser,
  getUserGroups,
  addUserToGroup,
  removeUserFromGroup,
  getUserRoles,
  addRoleToUser,
  removeRoleFromUser,
  // Groups
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  // Roles
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  // File Upload
  initiateUpload,
  uploadChunk,
  finalizeUpload,
  cancelUpload,
  getFile,
  listFiles,
  updateFile,
  deleteFile,
  // Permissions
  hasPermission,
  getUserPermissions
};

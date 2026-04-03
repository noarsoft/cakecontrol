// src/Apis_test/user.test.jsx
import {
  // User
  listUsers,
  getUserByRootId,
  createUser,
  updateUser,
  deleteUser,
  getUserGroups,
  addUserToGroup,
  removeUserFromGroup,
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
} from '../Apis/user';

/**
 * ============================================
 * USER (userx) TESTS
 * ============================================
 */

/**
 * Test: List all users
 */
export const testListUsers = async () => {
  console.log('=== Test: List Users ===');
  try {
    const result = await listUsers({ page: 1, limit: 10 });
    console.log('✅ Users fetched:', result.data?.length || 0, 'users');
    console.log('Pagination:', result.pagination);
    return result;
  } catch (error) {
    console.error('❌ Failed to list users:', error.message);
    throw error;
  }
};

/**
 * Test: Create new user
 */
export const testCreateUser = async () => {
  console.log('=== Test: Create User ===');
  try {
    const timestamp = Date.now();
    const userData = {
      email: `testuser${timestamp}@example.com`,
      password: 'Test@12345',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const result = await createUser(userData);
    console.log('✅ User created:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to create user:', error.message);
    throw error;
  }
};

/**
 * Test: Get user by rootId
 */
export const testGetUser = async () => {
  console.log('=== Test: Get User ===');
  try {
    // First list users to get a rootId
    const users = await listUsers({ limit: 1 });
    if (!users.data || users.data.length === 0) {
      console.warn('⚠️ No users available for testing');
      return null;
    }

    const rootId = users.data[0]._rootid;
    const result = await getUserByRootId(rootId);
    console.log('✅ User fetched:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to get user:', error.message);
    throw error;
  }
};

/**
 * Test: Update user
 */
export const testUpdateUser = async () => {
  console.log('=== Test: Update User ===');
  try {
    // First create a user
    const createResult = await testCreateUser();
    const rootId = createResult.data._rootid;

    // Then update it
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name'
    };

    const result = await updateUser(rootId, updateData);
    console.log('✅ User updated:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to update user:', error.message);
    throw error;
  }
};

/**
 * Test: Delete user
 */
export const testDeleteUser = async () => {
  console.log('=== Test: Delete User ===');
  try {
    // First create a user
    const createResult = await testCreateUser();
    const rootId = createResult.data._rootid;

    // Then delete it
    await deleteUser(rootId);
    console.log('✅ User deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete user:', error.message);
    throw error;
  }
};

/**
 * Test: Get user's groups
 */
export const testGetUserGroups = async () => {
  console.log('=== Test: Get User Groups ===');
  try {
    const users = await listUsers({ limit: 1 });
    if (!users.data || users.data.length === 0) {
      console.warn('⚠️ No users available for testing');
      return null;
    }

    const userRootId = users.data[0]._rootid;
    const result = await getUserGroups(userRootId);
    console.log('✅ User groups fetched:', result.data?.length || 0, 'groups');
    return result;
  } catch (error) {
    console.error('❌ Failed to get user groups:', error.message);
    throw error;
  }
};

/**
 * ============================================
 * GROUP (groupx) TESTS
 * ============================================
 */

/**
 * Test: List all groups
 */
export const testListGroups = async () => {
  console.log('=== Test: List Groups ===');
  try {
    const result = await listGroups({ page: 1, limit: 10 });
    console.log('✅ Groups fetched:', result.data?.length || 0, 'groups');
    console.log('Pagination:', result.pagination);
    return result;
  } catch (error) {
    console.error('❌ Failed to list groups:', error.message);
    throw error;
  }
};

/**
 * Test: Create new group
 */
export const testCreateGroup = async () => {
  console.log('=== Test: Create Group ===');
  try {
    const timestamp = Date.now();
    const groupData = {
      groupKey: `testgroup${timestamp}`,
      name: `Test Group ${timestamp}`,
      description: 'Test group description'
    };
    
    const result = await createGroup(groupData);
    console.log('✅ Group created:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to create group:', error.message);
    throw error;
  }
};

/**
 * Test: Get group by rootId
 */
export const testGetGroup = async () => {
  console.log('=== Test: Get Group ===');
  try {
    const groups = await listGroups({ limit: 1 });
    if (!groups.data || groups.data.length === 0) {
      console.warn('⚠️ No groups available for testing');
      return null;
    }

    const rootId = groups.data[0]._rootid;
    const result = await getGroup(rootId);
    console.log('✅ Group fetched:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to get group:', error.message);
    throw error;
  }
};

/**
 * Test: Update group
 */
export const testUpdateGroup = async () => {
  console.log('=== Test: Update Group ===');
  try {
    const createResult = await testCreateGroup();
    const rootId = createResult.data._rootid;

    const updateData = {
      description: 'Updated group description'
    };

    const result = await updateGroup(rootId, updateData);
    console.log('✅ Group updated:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to update group:', error.message);
    throw error;
  }
};

/**
 * Test: Delete group
 */
export const testDeleteGroup = async () => {
  console.log('=== Test: Delete Group ===');
  try {
    const createResult = await testCreateGroup();
    const rootId = createResult.data._rootid;

    await deleteGroup(rootId);
    console.log('✅ Group deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete group:', error.message);
    throw error;
  }
};

/**
 * Test: Add user to group
 */
export const testAddUserToGroup = async () => {
  console.log('=== Test: Add User to Group ===');
  try {
    const users = await listUsers({ limit: 1 });
    const groups = await listGroups({ limit: 1 });

    if (!users.data?.length || !groups.data?.length) {
      console.warn('⚠️ Need users and groups for this test');
      return null;
    }

    const userRootId = users.data[0]._rootid;
    const groupRootId = groups.data[0]._rootid;

    const result = await addUserToGroup(userRootId, groupRootId);
    console.log('✅ User added to group:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to add user to group:', error.message);
    throw error;
  }
};

/**
 * ============================================
 * ROLE (rolex) TESTS
 * ============================================
 */

/**
 * Test: List all roles
 */
export const testListRoles = async () => {
  console.log('=== Test: List Roles ===');
  try {
    const result = await listRoles({ page: 1, limit: 10 });
    console.log('✅ Roles fetched:', result.data?.length || 0, 'roles');
    console.log('Pagination:', result.pagination);
    return result;
  } catch (error) {
    console.error('❌ Failed to list roles:', error.message);
    throw error;
  }
};

/**
 * Test: Create new role
 */
export const testCreateRole = async () => {
  console.log('=== Test: Create Role ===');
  try {
    const timestamp = Date.now();
    const roleData = {
      roleKey: `testrole${timestamp}`,
      name: `Test Role ${timestamp}`,
      description: 'Test role description',
      perms_schema: 'userx.read,userx.write',
      perms_service: 'email.send'
    };
    
    const result = await createRole(roleData);
    console.log('✅ Role created:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to create role:', error.message);
    throw error;
  }
};

/**
 * Test: Get role by rootId
 */
export const testGetRole = async () => {
  console.log('=== Test: Get Role ===');
  try {
    const roles = await listRoles({ limit: 1 });
    if (!roles.data || roles.data.length === 0) {
      console.warn('⚠️ No roles available for testing');
      return null;
    }

    const rootId = roles.data[0]._rootid;
    const result = await getRole(rootId);
    console.log('✅ Role fetched:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to get role:', error.message);
    throw error;
  }
};

/**
 * Test: Update role
 */
export const testUpdateRole = async () => {
  console.log('=== Test: Update Role ===');
  try {
    const createResult = await testCreateRole();
    const rootId = createResult.data._rootid;

    const updateData = {
      description: 'Updated role description'
    };

    const result = await updateRole(rootId, updateData);
    console.log('✅ Role updated:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to update role:', error.message);
    throw error;
  }
};

/**
 * Test: Delete role
 */
export const testDeleteRole = async () => {
  console.log('=== Test: Delete Role ===');
  try {
    const createResult = await testCreateRole();
    const rootId = createResult.data._rootid;

    await deleteRole(rootId);
    console.log('✅ Role deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete role:', error.message);
    throw error;
  }
};

/**
 * ============================================
 * FILE UPLOAD TESTS
 * ============================================
 */

/**
 * Test: Initiate file upload
 */
export const testInitiateUpload = async () => {
  console.log('=== Test: Initiate Upload ===');
  try {
    const result = await initiateUpload('test-document.pdf');
    console.log('✅ Upload initiated:', result);
    console.log('Upload Token:', result.uploadToken);
    return result;
  } catch (error) {
    console.error('❌ Failed to initiate upload:', error.message);
    throw error;
  }
};

/**
 * Test: Upload file chunk
 */
export const testUploadChunk = async () => {
  console.log('=== Test: Upload Chunk ===');
  try {
    // Initiate upload first
    const initResult = await initiateUpload('test-document.pdf');
    const uploadToken = initResult.uploadToken;

    // Create dummy base64 data (simulating file content)
    const dummyData = 'SGVsbG8gV29ybGQh'; // "Hello World!" in base64
    
    const result = await uploadChunk(uploadToken, 'test-document.pdf', 1, 1, dummyData);
    console.log('✅ Chunk uploaded:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to upload chunk:', error.message);
    throw error;
  }
};

/**
 * Test: Upload and finalize file
 */
export const testUploadAndFinalize = async () => {
  console.log('=== Test: Upload and Finalize ===');
  try {
    // Initiate upload
    const initResult = await initiateUpload('test-complete.pdf');
    const uploadToken = initResult.uploadToken;

    // Upload chunk
    const dummyData = 'SGVsbG8gV29ybGQh';
    await uploadChunk(uploadToken, 'test-complete.pdf', 1, 1, dummyData);
    console.log('✅ Chunk uploaded');

    // Finalize
    const finalizeResult = await finalizeUpload(uploadToken);
    console.log('✅ Upload finalized:', finalizeResult);
    return finalizeResult;
  } catch (error) {
    console.error('❌ Failed to upload and finalize:', error.message);
    throw error;
  }
};

/**
 * Test: Cancel upload
 */
export const testCancelUpload = async () => {
  console.log('=== Test: Cancel Upload ===');
  try {
    // Initiate upload
    const initResult = await initiateUpload('test-cancel.pdf');
    const uploadToken = initResult.uploadToken;

    // Cancel
    const result = await cancelUpload(uploadToken);
    console.log('✅ Upload cancelled:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to cancel upload:', error.message);
    throw error;
  }
};

/**
 * Test: List uploaded files
 */
export const testListFiles = async () => {
  console.log('=== Test: List Files ===');
  try {
    const result = await listFiles({ page: 1, limit: 10 });
    console.log('✅ Files fetched:', result.data?.length || 0, 'files');
    console.log('Pagination:', result.pagination);
    return result;
  } catch (error) {
    console.error('❌ Failed to list files:', error.message);
    throw error;
  }
};

/**
 * Test: Get file record
 */
export const testGetFile = async () => {
  console.log('=== Test: Get File ===');
  try {
    const files = await listFiles({ limit: 1 });
    if (!files.data || files.data.length === 0) {
      console.warn('⚠️ No files available for testing');
      return null;
    }

    const fileId = files.data[0]._rootid;
    const result = await getFile(fileId);
    console.log('✅ File fetched:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to get file:', error.message);
    throw error;
  }
};

/**
 * Test: Update file
 */
export const testUpdateFile = async () => {
  console.log('=== Test: Update File ===');
  try {
    const files = await listFiles({ limit: 1 });
    if (!files.data || files.data.length === 0) {
      console.warn('⚠️ No files available for testing');
      return null;
    }

    const fileId = files.data[0]._rootid;
    const result = await updateFile(fileId, { filename: 'renamed-file.pdf' });
    console.log('✅ File updated:', result.data);
    return result;
  } catch (error) {
    console.error('❌ Failed to update file:', error.message);
    throw error;
  }
};

/**
 * Test: Delete file
 */
export const testDeleteFile = async () => {
  console.log('=== Test: Delete File ===');
  try {
    // Create and finalize a file first
    const uploadResult = await testUploadAndFinalize();
    const fileId = uploadResult.fileId;

    // Delete it
    await deleteFile(fileId);
    console.log('✅ File deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete file:', error.message);
    throw error;
  }
};

/**
 * ============================================
 * PERMISSIONS TESTS
 * ============================================
 */

/**
 * Test: Check permission
 */
export const testHasPermission = async () => {
  console.log('=== Test: Has Permission ===');
  try {
    const hasUserRead = hasPermission('userx.read');
    console.log('✅ Has userx.read:', hasUserRead);
    return hasUserRead;
  } catch (error) {
    console.error('❌ Permission check failed:', error.message);
    throw error;
  }
};

/**
 * Test: Get user permissions
 */
export const testGetUserPermissions = async () => {
  console.log('=== Test: Get User Permissions ===');
  try {
    const result = await getUserPermissions();
    console.log('✅ User permissions fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to get permissions:', error.message);
    throw error;
  }
};

/**
 * ============================================
 * RUN ALL TESTS
 * ============================================
 */

/**
 * Run all user API tests
 */
export const runAllUserTests = async () => {
  console.log('🧪 Starting User API Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const tests = [
    // Users
    { name: 'List Users', fn: testListUsers },
    { name: 'Create User', fn: testCreateUser },
    { name: 'Get User', fn: testGetUser },
    { name: 'Update User', fn: testUpdateUser },
    { name: 'Get User Groups', fn: testGetUserGroups },
    // Groups
    { name: 'List Groups', fn: testListGroups },
    { name: 'Create Group', fn: testCreateGroup },
    { name: 'Get Group', fn: testGetGroup },
    { name: 'Update Group', fn: testUpdateGroup },
    { name: 'Add User to Group', fn: testAddUserToGroup },
    // Roles
    { name: 'List Roles', fn: testListRoles },
    { name: 'Create Role', fn: testCreateRole },
    { name: 'Get Role', fn: testGetRole },
    { name: 'Update Role', fn: testUpdateRole },
    // Files
    { name: 'Initiate Upload', fn: testInitiateUpload },
    { name: 'Upload Chunk', fn: testUploadChunk },
    { name: 'List Files', fn: testListFiles },
    // Permissions
    { name: 'Check Permission', fn: testHasPermission }
  ];

  for (const test of tests) {
    try {
      await test.fn();
      results.passed++;
      results.tests.push({ name: test.name, status: 'passed' });
      console.log('\n');
    } catch (error) {
      results.failed++;
      results.tests.push({ name: test.name, status: 'failed', error: error.message });
      console.log('\n');
    }
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}/${tests.length}`);
  console.log(`❌ Failed: ${results.failed}/${tests.length}`);
  
  if (results.failed > 0) {
    console.log('\nFailed tests:');
    results.tests
      .filter(t => t.status === 'failed')
      .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
  }

  return results;
};

// Export for browser console
window.userApiTests = {
  // User tests
  testListUsers,
  testCreateUser,
  testGetUser,
  testUpdateUser,
  testDeleteUser,
  testGetUserGroups,
  // Group tests
  testListGroups,
  testCreateGroup,
  testGetGroup,
  testUpdateGroup,
  testDeleteGroup,
  testAddUserToGroup,
  // Role tests
  testListRoles,
  testCreateRole,
  testGetRole,
  testUpdateRole,
  testDeleteRole,
  // File tests
  testInitiateUpload,
  testUploadChunk,
  testUploadAndFinalize,
  testCancelUpload,
  testListFiles,
  testGetFile,
  testUpdateFile,
  testDeleteFile,
  // Permission tests
  testHasPermission,
  testGetUserPermissions,
  // Run all
  runAllUserTests
};

console.log('📝 User API Tests loaded! Available commands:');
console.log('- userApiTests.runAllUserTests()');
console.log('- userApiTests.testListUsers()');
console.log('- userApiTests.testCreateUser()');
console.log('- userApiTests.testListGroups()');
console.log('- userApiTests.testListRoles()');
console.log('- userApiTests.testInitiateUpload()');

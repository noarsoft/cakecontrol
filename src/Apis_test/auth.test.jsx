// src/Apis_test/auth.test.jsx
import {
  login,
  register,
  logout,
  isAuthenticated,
  getAccessToken,
  getUserRootId,
  refreshToken
} from '../Apis/auth';

/**
 * Test credentials
 */
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@cmu.ac.th',
    password: 'admin123456'
  },
  user: {
    email: 'user@cmu.ac.th',
    password: '12345678'
  }
};

/**
 * Test 1: Login with admin credentials
 */
export const testLoginAdmin = async () => {
  console.log('=== Test: Login as Admin ===');
  try {
    const result = await login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    console.log('✅ Login successful:', result);
    console.log('Access Token:', result.accessToken);
    console.log('User RootId:', result.userxRootId);
    console.log('Expires At:', new Date(result.expiresAt).toLocaleString());
    
    // Verify token is stored
    const token = getAccessToken();
    const userRootId = getUserRootId();
    console.log('Token stored in localStorage:', !!token);
    console.log('UserRootId stored in localStorage:', !!userRootId);
    
    return result;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

/**
 * Test 2: Login with user credentials
 */
export const testLoginUser = async () => {
  console.log('=== Test: Login as User ===');
  try {
    const result = await login(TEST_CREDENTIALS.user.email, TEST_CREDENTIALS.user.password);
    console.log('✅ Login successful:', result);
    console.log('Access Token:', result.accessToken);
    console.log('User RootId:', result.userxRootId);
    return result;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

/**
 * Test 3: Login with wrong credentials
 */
export const testLoginWrongPassword = async () => {
  console.log('=== Test: Login with Wrong Password ===');
  try {
    await login('admin@cmu.ac.th', 'wrongpassword');
    console.error('❌ Should have failed but succeeded!');
    return false;
  } catch (error) {
    console.log('✅ Correctly rejected wrong password:', error.message);
    return true;
  }
};

/**
 * Test 4: Login with non-existent user
 */
export const testLoginNonExistentUser = async () => {
  console.log('=== Test: Login with Non-existent User ===');
  try {
    await login('nonexistent@example.com', 'password');
    console.error('❌ Should have failed but succeeded!');
    return false;
  } catch (error) {
    console.log('✅ Correctly rejected non-existent user:', error.message);
    return true;
  }
};

/**
 * Test 5: Check authentication status
 */
export const testIsAuthenticated = async () => {
  console.log('=== Test: Check Authentication Status ===');
  try {
    // First login
    await login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    
    const authenticated = isAuthenticated();
    console.log('Is authenticated:', authenticated);
    
    if (authenticated) {
      console.log('✅ Authentication check passed');
    } else {
      console.error('❌ Should be authenticated but is not');
    }
    
    return authenticated;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
};

/**
 * Test 6: Logout
 */
export const testLogout = async () => {
  console.log('=== Test: Logout ===');
  try {
    // First login
    await login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    console.log('Logged in, token exists:', !!getAccessToken());
    
    // Then logout
    logout();
    console.log('Logged out, token exists:', !!getAccessToken());
    
    const authenticated = isAuthenticated();
    if (!authenticated) {
      console.log('✅ Logout successful');
      return true;
    } else {
      console.error('❌ Should be logged out but still authenticated');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
};

/**
 * Test 7: Register new user
 */
export const testRegister = async () => {
  console.log('=== Test: Register New User ===');
  try {
    const timestamp = Date.now();
    const result = await register({
      email: `testuser${timestamp}@example.com`,
      password: 'Test@12345'
    });
    console.log('✅ Registration successful:', result);
    console.log('Access Token:', result.accessToken);
    console.log('User RootId:', result.userxRootId);
    return result;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
};

/**
 * Test 8: Register with existing email
 */
export const testRegisterDuplicateEmail = async () => {
  console.log('=== Test: Register with Existing Email ===');
  try {
    await register({
      email: 'admin@cmu.ac.th',
      password: 'Test@12345'
    });
    console.error('❌ Should have failed but succeeded!');
    return false;
  } catch (error) {
    console.log('✅ Correctly rejected duplicate email:', error.message);
    return true;
  }
};

/**
 * Test 9: Token expiry check
 */
export const testTokenExpiry = async () => {
  console.log('=== Test: Token Expiry Check ===');
  try {
    // Login first
    await login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    
    // Manually set expired time
    const expiredTime = Date.now() - 1000; // 1 second ago
    localStorage.setItem('expiresAt', expiredTime.toString());
    
    const authenticated = isAuthenticated();
    if (!authenticated) {
      console.log('✅ Correctly detected expired token');
      return true;
    } else {
      console.error('❌ Should have detected expired token');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
};

/**
 * Test 10: Get stored credentials
 */
export const testGetStoredCredentials = async () => {
  console.log('=== Test: Get Stored Credentials ===');
  try {
    // Login first
    const loginResult = await login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    
    const token = getAccessToken();
    const userRootId = getUserRootId();
    
    console.log('Access Token from storage:', token ? token.substring(0, 20) + '...' : null);
    console.log('User RootId from storage:', userRootId);
    
    if (token && userRootId) {
      console.log('✅ Credentials retrieved successfully');
      return { token, userRootId };
    } else {
      console.error('❌ Failed to retrieve credentials');
      return null;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
};

/**
 * Run all auth tests
 */
export const runAllAuthTests = async () => {
  console.log('🧪 Starting Authentication API Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const tests = [
    { name: 'Login Admin', fn: testLoginAdmin },
    { name: 'Login User', fn: testLoginUser },
    { name: 'Wrong Password', fn: testLoginWrongPassword },
    { name: 'Non-existent User', fn: testLoginNonExistentUser },
    { name: 'Check Authentication', fn: testIsAuthenticated },
    { name: 'Get Stored Credentials', fn: testGetStoredCredentials },
    { name: 'Token Expiry', fn: testTokenExpiry },
    { name: 'Logout', fn: testLogout },
    { name: 'Register New User', fn: testRegister },
    { name: 'Duplicate Email', fn: testRegisterDuplicateEmail }
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

/**
 * Quick login helper for testing
 */
export const quickLoginAdmin = async () => {
  console.log('🔑 Quick login as admin...');
  const result = await login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
  console.log('✅ Logged in as admin');
  return result;
};

export const quickLoginUser = async () => {
  console.log('🔑 Quick login as user...');
  const result = await login(TEST_CREDENTIALS.user.email, TEST_CREDENTIALS.user.password);
  console.log('✅ Logged in as user');
  return result;
};

// Export for browser console
window.authApiTests = {
  testLoginAdmin,
  testLoginUser,
  testLoginWrongPassword,
  testLoginNonExistentUser,
  testIsAuthenticated,
  testLogout,
  testRegister,
  testRegisterDuplicateEmail,
  testTokenExpiry,
  testGetStoredCredentials,
  runAllAuthTests,
  quickLoginAdmin,
  quickLoginUser,
  TEST_CREDENTIALS
};

console.log('📝 Auth API Tests loaded! Available commands:');
console.log('- authApiTests.quickLoginAdmin()');
console.log('- authApiTests.quickLoginUser()');
console.log('- authApiTests.runAllAuthTests()');
console.log('- authApiTests.testLoginAdmin()');
console.log('- authApiTests.TEST_CREDENTIALS');

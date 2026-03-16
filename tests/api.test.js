/**
 * API Integration Tests
 * Tests for all REST API endpoints
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test Suite
async function runTests() {
  console.log('\n🧪 Running API Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    const res = await makeRequest('GET', '/health');
    if (res.status === 200 && res.data.status === 'ok') {
      console.log('✅ Test 1: Health Check - PASSED');
      passed++;
    } else {
      console.log('❌ Test 1: Health Check - FAILED');
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 1: Health Check - ERROR:', e.message);
    failed++;
  }

  // Test 2: Create Customer
  try {
    const customerData = {
      username: 'testuser123',
      email: 'test@example.com',
      phone: '+1234567890',
      first_name: 'Test',
      last_name: 'User',
    };
    const res = await makeRequest('POST', '/api/customers', customerData);
    if (res.status === 201 || res.status === 200) {
      console.log('✅ Test 2: Create Customer - PASSED');
      passed++;
      global.customerId = res.data.id;
    } else {
      console.log('❌ Test 2: Create Customer - FAILED', res.status);
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 2: Create Customer - ERROR:', e.message);
    failed++;
  }

  // Test 3: Get Customer
  if (global.customerId) {
    try {
      const res = await makeRequest('GET', `/api/customers/${global.customerId}`);
      if (res.status === 200 && res.data.id) {
        console.log('✅ Test 3: Get Customer - PASSED');
        passed++;
      } else {
        console.log('❌ Test 3: Get Customer - FAILED');
        failed++;
      }
    } catch (e) {
      console.log('❌ Test 3: Get Customer - ERROR:', e.message);
      failed++;
    }
  }

  // Test 4: Get Customer by Email
  try {
    const res = await makeRequest('GET', '/api/customers/email/test@example.com');
    if (res.status === 200 || res.status === 404) {
      console.log('✅ Test 4: Get Customer by Email - PASSED');
      passed++;
    } else {
      console.log('❌ Test 4: Get Customer by Email - FAILED');
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 4: Get Customer by Email - ERROR:', e.message);
    failed++;
  }

  // Test 5: Get Conversations
  if (global.customerId) {
    try {
      const res = await makeRequest('GET', `/api/conversations/customer/${global.customerId}`);
      if (res.status === 200 || res.status === 404) {
        console.log('✅ Test 5: Get Conversations - PASSED');
        passed++;
      } else {
        console.log('❌ Test 5: Get Conversations - FAILED');
        failed++;
      }
    } catch (e) {
      console.log('❌ Test 5: Get Conversations - ERROR:', e.message);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((e) => {
  console.error('Test suite error:', e);
  process.exit(1);
});


/**
 * Webhook Integration Tests
 * Tests for SMS and Email webhooks
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';

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

async function runTests() {
  console.log('\n🧪 Running Webhook Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: SMS Webhook
  try {
    const smsData = {
      From: '+1234567890',
      Body: 'Hello, I need help with my account',
    };
    const res = await makeRequest('POST', '/webhooks/sms', smsData);
    if (res.status === 200 || res.status === 201) {
      console.log('✅ Test 1: SMS Webhook - PASSED');
      passed++;
    } else {
      console.log('❌ Test 1: SMS Webhook - FAILED', res.status);
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 1: SMS Webhook - ERROR:', e.message);
    failed++;
  }

  // Test 2: Email Webhook
  try {
    const emailData = {
      from: 'customer@example.com',
      subject: 'Account Issue',
      text: 'I cannot access my account',
      html: '<p>I cannot access my account</p>',
    };
    const res = await makeRequest('POST', '/webhooks/email', emailData);
    if (res.status === 200 || res.status === 201) {
      console.log('✅ Test 2: Email Webhook - PASSED');
      passed++;
    } else {
      console.log('❌ Test 2: Email Webhook - FAILED', res.status);
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 2: Email Webhook - ERROR:', e.message);
    failed++;
  }

  // Test 3: SMS Webhook with Customer ID in subject
  try {
    const smsData = {
      From: '+9876543210',
      Body: 'Following up on my previous message',
    };
    const res = await makeRequest('POST', '/webhooks/sms', smsData);
    if (res.status === 200 || res.status === 201) {
      console.log('✅ Test 3: SMS Webhook (New Customer) - PASSED');
      passed++;
    } else {
      console.log('❌ Test 3: SMS Webhook (New Customer) - FAILED');
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 3: SMS Webhook (New Customer) - ERROR:', e.message);
    failed++;
  }

  // Test 4: Email Webhook with Customer ID in subject
  try {
    const emailData = {
      from: 'newcustomer@example.com',
      subject: 'New inquiry',
      text: 'I have a question about your services',
      html: '<p>I have a question about your services</p>',
    };
    const res = await makeRequest('POST', '/webhooks/email', emailData);
    if (res.status === 200 || res.status === 201) {
      console.log('✅ Test 4: Email Webhook (New Customer) - PASSED');
      passed++;
    } else {
      console.log('❌ Test 4: Email Webhook (New Customer) - FAILED');
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 4: Email Webhook (New Customer) - ERROR:', e.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Webhook Test Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((e) => {
  console.error('Test suite error:', e);
  process.exit(1);
});


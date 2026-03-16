/**
 * Database Connection Tests
 * Tests for database connectivity and schema
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'message_broker',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runTests() {
  console.log('\n🧪 Running Database Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Database Connection
  try {
    const client = await pool.connect();
    console.log('✅ Test 1: Database Connection - PASSED');
    passed++;
    client.release();
  } catch (e) {
    console.log('❌ Test 1: Database Connection - FAILED:', e.message);
    failed++;
  }

  // Test 2: Check Tables Exist
  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    const tables = result.rows.map((r) => r.table_name);
    const expectedTables = [
      'agents',
      'attachments',
      'conversations',
      'customers',
      'livechat_sessions',
      'messages',
    ];
    const allExist = expectedTables.every((t) => tables.includes(t));

    if (allExist) {
      console.log('✅ Test 2: All Tables Exist - PASSED');
      console.log(`   Tables found: ${tables.join(', ')}`);
      passed++;
    } else {
      console.log('❌ Test 2: All Tables Exist - FAILED');
      console.log(`   Expected: ${expectedTables.join(', ')}`);
      console.log(`   Found: ${tables.join(', ')}`);
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 2: All Tables Exist - ERROR:', e.message);
    failed++;
  }

  // Test 3: Insert Customer
  try {
    const result = await pool.query(
      `INSERT INTO customers (username, email, phone, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['dbtest_user', 'dbtest@example.com', '+1111111111', 'DB', 'Test']
    );
    if (result.rows.length > 0) {
      console.log('✅ Test 3: Insert Customer - PASSED');
      passed++;
      global.testCustomerId = result.rows[0].id;
    } else {
      console.log('❌ Test 3: Insert Customer - FAILED');
      failed++;
    }
  } catch (e) {
    console.log('❌ Test 3: Insert Customer - ERROR:', e.message);
    failed++;
  }

  // Test 4: Query Customer
  if (global.testCustomerId) {
    try {
      const result = await pool.query('SELECT * FROM customers WHERE id = $1', [
        global.testCustomerId,
      ]);
      if (result.rows.length > 0) {
        console.log('✅ Test 4: Query Customer - PASSED');
        passed++;
      } else {
        console.log('❌ Test 4: Query Customer - FAILED');
        failed++;
      }
    } catch (e) {
      console.log('❌ Test 4: Query Customer - ERROR:', e.message);
      failed++;
    }
  }

  // Test 5: Create Conversation
  if (global.testCustomerId) {
    try {
      const result = await pool.query(
        `INSERT INTO conversations (customer_id, last_channel, status)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [global.testCustomerId, 'sms', 'open']
      );
      if (result.rows.length > 0) {
        console.log('✅ Test 5: Create Conversation - PASSED');
        passed++;
        global.testConversationId = result.rows[0].id;
      } else {
        console.log('❌ Test 5: Create Conversation - FAILED');
        failed++;
      }
    } catch (e) {
      console.log('❌ Test 5: Create Conversation - ERROR:', e.message);
      failed++;
    }
  }

  // Test 6: Add Message
  if (global.testConversationId) {
    try {
      const result = await pool.query(
        `INSERT INTO messages (conversation_id, channel, direction, sender_id, message)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [global.testConversationId, 'sms', 'incoming', global.testCustomerId, 'Test message']
      );
      if (result.rows.length > 0) {
        console.log('✅ Test 6: Add Message - PASSED');
        passed++;
      } else {
        console.log('❌ Test 6: Add Message - FAILED');
        failed++;
      }
    } catch (e) {
      console.log('❌ Test 6: Add Message - ERROR:', e.message);
      failed++;
    }
  }

  // Cleanup
  try {
    if (global.testConversationId) {
      await pool.query('DELETE FROM messages WHERE conversation_id = $1', [global.testConversationId]);
      await pool.query('DELETE FROM conversations WHERE id = $1', [global.testConversationId]);
    }
    if (global.testCustomerId) {
      await pool.query('DELETE FROM customers WHERE id = $1', [global.testCustomerId]);
    }
  } catch (e) {
    console.log('Warning: Cleanup failed:', e.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Database Test Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((e) => {
  console.error('Test suite error:', e);
  process.exit(1);
});


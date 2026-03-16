-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,
  username VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  segment VARCHAR(100),
  affiliate_tag VARCHAR(100),
  balance DECIMAL(15, 2) DEFAULT 0,
  bet_limit DECIMAL(15, 2),
  lifetime_bets DECIMAL(15, 2) DEFAULT 0,
  sports_revenue DECIMAL(15, 2) DEFAULT 0,
  casino_revenue DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  last_channel VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open',
  assigned_agent_id INTEGER,
  locked_by_agent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id),
  channel VARCHAR(50),
  direction VARCHAR(20),
  sender_id INTEGER,
  message TEXT,
  attachment_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  mime_type VARCHAR(100),
  size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live Chat Sessions table
CREATE TABLE IF NOT EXISTS livechat_sessions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  jwt_id VARCHAR(500),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_username ON customers(username);


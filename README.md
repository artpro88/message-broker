# Message Broker v2

A unified communication interface that allows brokers to handle SMS, Email, and Live Chat conversations in a single threaded view per customer.

## Features

- **Multi-Channel Support**: SMS (Twilio), Email (IMAP/Webhook), Live Chat (JWT)
- **Unified Thread System**: All messages from same customer in ONE conversation
- **Smart Reply Logic**: Default reply via last used channel with manual override
- **Customer Data Integration**: Load from Snowflake, Spreadsheet, or API
- **Live Chat Features**: Greeting messages, scheduling, segment routing, file uploads
- **Multi-Instance Support**: Same codebase, different configs for multiple brands/regions
- **Agent Interface**: Conversation list, thread view, customer info panel, reply box

## Architecture

```
Frontend (React)
    ↓
Backend API (Node.js/Express)
    ├── Message Service
    ├── Twilio Webhook
    ├── Email Listener
    └── Live Chat Socket Server
    ↓
Database (PostgreSQL)
```

## Core Tables

- `customers` - Customer information
- `conversations` - Conversation threads per customer
- `messages` - Individual messages with channel info
- `attachments` - File attachments
- `agents` - Broker/agent information
- `livechat_sessions` - Live chat session tracking

## Quick Start

### Local Development
```bash
# Install dependencies
npm run setup

# Create .env file
cp .env.example .env

# Start backend
npm run dev

# Start frontend (in another terminal)
npm run client

# Run tests
npm run test
```

### Docker Deployment
```bash
# Deploy to staging with Docker Compose
./scripts/deploy-docker.sh up

# View logs
./scripts/deploy-docker.sh logs

# Run tests
./scripts/deploy-docker.sh test
```

### Production Deployment
See [STAGING_DEPLOYMENT_SUMMARY.md](./STAGING_DEPLOYMENT_SUMMARY.md) for deployment options:
- **Docker Compose** (2 minutes)
- **Railway** (5 minutes)
- **Manual VPS** (20 minutes)

## API Endpoints

### Conversations
- `GET /api/conversations/customer/:customerId` - Get customer conversation
- `GET /api/conversations/:conversationId` - Get conversation details
- `POST /api/conversations/:conversationId/reply/sms` - Send SMS reply
- `POST /api/conversations/:conversationId/reply/email` - Send email reply
- `POST /api/conversations/:conversationId/reply/livechat` - Send live chat reply
- `POST /api/conversations/:conversationId/lock` - Lock conversation
- `POST /api/conversations/:conversationId/unlock` - Unlock conversation
- `POST /api/conversations/:conversationId/close` - Close conversation

### Customers
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/email/:email` - Get customer by email
- `GET /api/customers/phone/:phone` - Get customer by phone
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer

### Webhooks
- `POST /webhooks/sms` - Twilio SMS webhook
- `POST /webhooks/email` - Email webhook

## Environment Variables

See `.env.example` for all required configuration options.

## Multi-Instance Support

Configure different instances by setting `INSTANCE_NAME` in `.env`:
- Instance A: `INSTANCE_NAME=brand_a`
- Instance B: `INSTANCE_NAME=brand_b`

Each instance can have separate database, Twilio account, email settings, etc.

## Optional Features (v2+)

- WhatsApp support
- Message templates
- AI auto-replies
- SLA timers
- Tags
- Internal notes
- Conversation assignment
- Audit log


# Message Broker v2 - Quick Start Guide

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Twilio account (for SMS)
- Email service (Gmail, SendGrid, etc.)

## Installation

### 1. Clone and Setup

```bash
cd "Message Broker"
npm run setup
```

### 2. Database Setup

```bash
# Create database
createdb message_broker

# Load schema
psql -U postgres -d message_broker -f db/schema.sql
```

### 3. Environment Configuration

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required environment variables:
- `TWILIO_ACCOUNT_SID` - Your Twilio account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `EMAIL_HOST` - SMTP host (e.g., smtp.gmail.com)
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - Email password
- `JWT_SECRET` - Secret key for JWT tokens
- `DB_*` - Database credentials

## Running the Application

### Development Mode

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
npm run client
```

Backend: http://localhost:3000
Frontend: http://localhost:5173

### Production Mode

```bash
# Build frontend
cd client && npm run build && cd ..

# Start backend
npm start
```

## Testing the System

### 1. Create a Customer

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john123",
    "email": "john@example.com",
    "phone": "+1234567890",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 2. Simulate Incoming SMS

```bash
curl -X POST http://localhost:3000/webhooks/sms \
  -H "Content-Type: application/json" \
  -d '{
    "From": "+1234567890",
    "Body": "Hello, I need help with my account"
  }'
```

### 3. Simulate Incoming Email

```bash
curl -X POST http://localhost:3000/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "john@example.com",
    "subject": "Account Issue",
    "text": "I cannot access my account"
  }'
```

### 4. Send Reply via SMS

```bash
curl -X POST http://localhost:3000/api/conversations/1/reply/sms \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "message": "Thank you for contacting us. How can we help?"
  }'
```

## Multi-Instance Setup

To run multiple instances (different brands/regions):

```bash
# Instance A
INSTANCE_NAME=brand_a PORT=3000 npm start

# Instance B (in another terminal)
INSTANCE_NAME=brand_b PORT=3001 npm start
```

Each instance can have separate:
- Database
- Twilio account
- Email settings
- JWT secret
- Configuration

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DB credentials in .env
- Verify database exists: `psql -l`

### Twilio Webhook Not Working
- Verify Twilio credentials in .env
- Check webhook URL in Twilio console
- Ensure server is accessible from internet

### Email Not Sending
- Verify SMTP credentials
- Check email provider's app password requirements
- Enable "Less secure apps" if using Gmail

### Frontend Not Loading
- Ensure backend is running on port 3000
- Check Vite proxy configuration
- Clear browser cache

## Next Steps

1. Configure Twilio webhook URL
2. Set up email forwarding/IMAP
3. Create agent accounts
4. Test all three channels (SMS, Email, Live Chat)
5. Deploy to production


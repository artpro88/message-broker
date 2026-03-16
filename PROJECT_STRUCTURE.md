# Message Broker v2 - Project Structure

## Directory Layout

```
Message Broker/
├── server.js                 # Main Express server entry point
├── package.json             # Backend dependencies
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
├── PROJECT_STRUCTURE.md    # This file
│
├── db/
│   └── schema.sql          # PostgreSQL database schema
│
├── src/
│   ├── config.js           # Configuration management
│   ├── db.js               # Database connection pool
│   │
│   ├── services/
│   │   ├── customerService.js      # Customer CRUD operations
│   │   ├── conversationService.js  # Conversation management
│   │   ├── smsService.js           # SMS handling (Twilio)
│   │   ├── emailService.js         # Email handling
│   │   └── liveChatService.js      # Live chat handling
│   │
│   └── routes/
│       ├── conversations.js        # Conversation API endpoints
│       ├── customers.js            # Customer API endpoints
│       └── webhooks.js             # Webhook endpoints
│
└── client/                  # React frontend
    ├── package.json        # Frontend dependencies
    ├── vite.config.js      # Vite configuration
    ├── index.html          # HTML entry point
    │
    └── src/
        ├── main.jsx        # React entry point
        ├── App.jsx         # Main App component
        ├── App.css         # App styles
        ├── index.css       # Global styles
        │
        └── components/
            ├── ConversationList.jsx    # Conversation list component
            ├── ConversationList.css
            ├── ThreadView.jsx          # Message thread display
            ├── ThreadView.css
            ├── CustomerInfo.jsx        # Customer info panel
            ├── CustomerInfo.css
            ├── ReplyBox.jsx            # Message reply interface
            └── ReplyBox.css
```

## Backend Services

### customerService.js
- `findCustomerByEmail(email)` - Find customer by email
- `findCustomerByPhone(phone)` - Find customer by phone
- `findCustomerByUsername(username)` - Find customer by username
- `findCustomerById(id)` - Find customer by ID
- `createCustomer(data)` - Create new customer
- `updateCustomer(id, data)` - Update customer info
- `getOrCreateCustomer(email, phone, username)` - Smart lookup/create

### conversationService.js
- `getConversationByCustomerId(customerId)` - Get active conversation
- `createConversation(customerId, channel)` - Create new conversation
- `updateConversationChannel(conversationId, channel)` - Update last channel
- `getConversationMessages(conversationId)` - Get all messages
- `addMessage(...)` - Add message to conversation
- `lockConversation(conversationId, agentId)` - Lock for agent
- `unlockConversation(conversationId)` - Unlock conversation
- `closeConversation(conversationId)` - Close conversation

### smsService.js
- `sendSMS(toPhone, message)` - Send SMS via Twilio
- `handleIncomingSMS(fromPhone, messageText)` - Process incoming SMS
- `sendSMSReply(conversationId, customerId, messageText)` - Send reply

### emailService.js
- `sendEmail(toEmail, subject, html, text)` - Send email
- `handleIncomingEmail(fromEmail, subject, html, text)` - Process incoming
- `sendEmailReply(conversationId, customerId, subject, html, text)` - Send reply

### liveChatService.js
- `verifyJWT(token)` - Verify JWT token
- `createLiveChatSession(customerId, jwtId)` - Create session
- `endLiveChatSession(sessionId)` - End session
- `handleLiveChatMessage(jwtPayload, messageText)` - Process message
- `sendLiveChatReply(conversationId, customerId, messageText)` - Send reply

## API Endpoints

### Conversations
- `GET /api/conversations/customer/:customerId`
- `GET /api/conversations/:conversationId`
- `POST /api/conversations/:conversationId/reply/sms`
- `POST /api/conversations/:conversationId/reply/email`
- `POST /api/conversations/:conversationId/reply/livechat`
- `POST /api/conversations/:conversationId/lock`
- `POST /api/conversations/:conversationId/unlock`
- `POST /api/conversations/:conversationId/close`

### Customers
- `GET /api/customers/:id`
- `GET /api/customers/email/:email`
- `GET /api/customers/phone/:phone`
- `POST /api/customers`
- `PUT /api/customers/:id`

### Webhooks
- `POST /webhooks/sms` - Twilio SMS webhook
- `POST /webhooks/email` - Email webhook

## Database Schema

### customers
- id, user_id, username, email, phone
- first_name, last_name, segment, affiliate_tag
- balance, bet_limit, lifetime_bets
- sports_revenue, casino_revenue
- created_at, updated_at

### conversations
- id, customer_id, last_channel, status
- assigned_agent_id, locked_by_agent
- created_at, updated_at

### messages
- id, conversation_id, channel, direction
- sender_id, message, attachment_id
- created_at

### attachments
- id, file_name, file_path, mime_type, size
- created_at

### agents
- id, name, email, role, active
- created_at

### livechat_sessions
- id, customer_id, jwt_id
- started_at, ended_at


# How to Use Message Broker v2

## Overview

Message Broker v2 is a unified communication interface that consolidates SMS, Email, and Live Chat conversations in one place. This guide explains how to use the application.

## Getting Started

### 1. Access the Application

- **Local**: `http://localhost:3000`
- **Render.com**: `https://message-broker-backend.onrender.com`

### 2. Two Main Pages

The application has two main sections accessible via the top navigation:

#### **Conversations Page** (Default)
- View all incoming messages from customers
- Manage conversations across SMS, Email, and Live Chat
- Reply to customers via their preferred channel

#### **Settings Page**
- Configure Twilio credentials for SMS
- Configure Email (SMTP) credentials
- Update credentials without restarting the application

## Conversations Page

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Message Broker v2  │  [Conversations] [Settings]       │
├──────────────┬──────────────────────┬──────────────────┤
│              │                      │                  │
│ Conversation │   Message Thread     │  Customer Info   │
│    List      │                      │                  │
│              │                      │                  │
│              ├──────────────────────┤                  │
│              │   Reply Box          │                  │
│              │                      │                  │
└──────────────┴──────────────────────┴──────────────────┘
```

### Using Conversations

1. **View Conversations**:
   - Left sidebar shows all open conversations
   - Each item shows customer ID, channel (SMS/Email), and status
   - Click a conversation to view details

2. **Read Messages**:
   - Center panel shows message thread
   - Messages are ordered chronologically
   - Shows sender, timestamp, and message content

3. **View Customer Info**:
   - Right panel shows customer details
   - Name, email, phone number
   - Conversation history

4. **Reply to Customer**:
   - Use the Reply Box at the bottom
   - Select channel (SMS, Email, or Live Chat)
   - Type your message
   - Click Send

### Reply Channels

#### **SMS (Twilio)**
- Requires Twilio credentials in Settings
- Limited to 160 characters per message
- Instant delivery

#### **Email**
- Requires Email credentials in Settings
- Can include subject line
- Supports HTML formatting
- Delivery may take a few seconds

#### **Live Chat**
- Real-time messaging
- Requires Socket.IO connection
- Best for immediate support

## Settings Page

### Configuring Twilio (SMS)

1. Click **Settings** in top navigation
2. Scroll to **Twilio Configuration**
3. Enter:
   - **Account SID**: From Twilio dashboard
   - **Auth Token**: From Twilio dashboard
   - **Phone Number**: Your Twilio phone number (e.g., +1234567890)
4. Click **Save Credentials**

### Configuring Email (SMTP)

1. Click **Settings** in top navigation
2. Scroll to **Email Configuration**
3. Enter:
   - **SMTP Host**: Your email provider's SMTP server
   - **SMTP Port**: Usually 587 (TLS) or 465 (SSL)
   - **Email User**: Your email address
   - **Email Password**: Your password or app-specific password
   - **From Address**: Email to send from
4. Click **Save Credentials**

### Email Provider Examples

- **Gmail**: `smtp.gmail.com:587` (use [App Password](https://myaccount.google.com/apppasswords))
- **Outlook**: `smtp.office365.com:587`
- **SendGrid**: `smtp.sendgrid.net:587` (user: `apikey`)

## Receiving Messages

### Email Webhooks

To receive incoming emails, you need to set up email forwarding:

1. **Configure Email Credentials** in Settings
2. **Set up Email Forwarding** using:
   - SendGrid Inbound Parse
   - Mailgun Webhooks
   - Manual forwarding service
3. **Point webhook to**: `https://your-domain.com/webhooks/email`

See [EMAIL_WEBHOOK_SETUP.md](./EMAIL_WEBHOOK_SETUP.md) for detailed instructions.

### SMS Webhooks

To receive incoming SMS:

1. **Configure Twilio Credentials** in Settings
2. **Set up Twilio Webhook**:
   - Go to Twilio Console
   - Phone Numbers → Manage Numbers
   - Select your number
   - Messaging → Webhook URL
   - Set to: `https://your-domain.com/webhooks/sms`
3. **Save** and test

### Live Chat

Live Chat is enabled by default. Customers can connect via Socket.IO for real-time messaging.

## Workflow Example

### Receiving an Email

1. Customer sends email to your configured address
2. Email forwarding service sends webhook to Message Broker
3. Message appears in Conversations list
4. Click conversation to view message
5. Type reply in Reply Box
6. Select "Email" channel
7. Click Send
8. Email is sent to customer via SMTP

### Receiving an SMS

1. Customer sends SMS to your Twilio number
2. Twilio sends webhook to Message Broker
3. Message appears in Conversations list
4. Click conversation to view message
5. Type reply in Reply Box
6. Select "SMS" channel
7. Click Send
8. SMS is sent to customer via Twilio

## Troubleshooting

### Conversations Not Appearing

- Check that webhooks are configured correctly
- Verify credentials in Settings page
- Check application logs for errors
- Test webhook manually with curl

### Emails Not Sending

- Verify email credentials in Settings
- Check SMTP host and port are correct
- Ensure "From Address" is valid
- Check email provider's sending limits

### SMS Not Sending

- Verify Twilio credentials in Settings
- Ensure phone number is in correct format
- Check Twilio account has credits
- Verify customer phone number is valid

## API Endpoints

### Conversations
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get conversation details
- `POST /api/conversations/:id/reply/sms` - Send SMS reply
- `POST /api/conversations/:id/reply/email` - Send email reply
- `POST /api/conversations/:id/reply/livechat` - Send live chat reply

### Settings
- `GET /api/settings/credentials` - Get current credentials
- `POST /api/settings/credentials` - Update credentials
- `GET /api/settings/config` - Get config (debug)

### Webhooks
- `POST /webhooks/sms` - Receive SMS
- `POST /webhooks/email` - Receive email

## Security Notes

- Credentials are stored in memory (not persisted to database)
- Use environment variables for production
- Webhooks should be protected with authentication
- Use HTTPS for all communications
- Regularly rotate API keys and passwords


# Email Webhook Setup Guide

## Overview

The Message Broker v2 can receive incoming emails via webhooks. To enable this, you need to:

1. **Configure Email Credentials** in the Settings page
2. **Set up Email Forwarding** to send incoming emails to your webhook endpoint
3. **Test** the webhook with sample emails

## Step 1: Configure Email Credentials

1. Go to **Settings** page in the Message Broker UI
2. Fill in your **Email Configuration**:
   - **SMTP Host**: Your email provider's SMTP server (e.g., `smtp.gmail.com`)
   - **SMTP Port**: Usually `587` for TLS or `465` for SSL
   - **Email User**: Your email address
   - **Email Password**: Your email password or app-specific password
   - **From Address**: The email address to send replies from
3. Click **Save Credentials**

### Email Provider Examples

#### Gmail
- **Host**: `smtp.gmail.com`
- **Port**: `587`
- **User**: Your Gmail address
- **Password**: [Generate App Password](https://myaccount.google.com/apppasswords)

#### Outlook/Office 365
- **Host**: `smtp.office365.com`
- **Port**: `587`
- **User**: Your Outlook email
- **Password**: Your Outlook password

#### SendGrid
- **Host**: `smtp.sendgrid.net`
- **Port**: `587`
- **User**: `apikey`
- **Password**: Your SendGrid API key

## Step 2: Set Up Email Forwarding

### Option A: Using SendGrid Inbound Parse (Recommended)

1. **Sign up for SendGrid** (free tier available)
2. **Enable Inbound Parse**:
   - Go to Settings → Inbound Parse
   - Add your domain or subdomain
   - Set webhook URL to: `https://your-app.onrender.com/webhooks/email`
3. **Configure MX Records** with your domain registrar
4. **Test** by sending an email to your configured address

### Option B: Using Mailgun

1. **Sign up for Mailgun** (free tier available)
2. **Enable Webhooks**:
   - Go to Sending → Webhooks
   - Add webhook for "Received Messages"
   - Set URL to: `https://your-app.onrender.com/webhooks/email`
3. **Configure MX Records** with your domain registrar
4. **Test** by sending an email

### Option C: Manual Email Forwarding

If you don't want to use a service, you can manually forward emails:

1. Set up email forwarding in your email provider
2. Forward to a webhook service like:
   - **Zapier** (connect email to webhook)
   - **IFTTT** (if this then that)
   - **Make** (formerly Integromat)

## Step 3: Test the Webhook

### Manual Test

Send a POST request to your webhook:

```bash
curl -X POST https://your-app.onrender.com/webhooks/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "customer@example.com",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<p>This is a test email</p>"
  }'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": 1,
      "email": "customer@example.com",
      "name": null,
      "phone_number": null
    },
    "conversation": {
      "id": 1,
      "customer_id": 1,
      "last_channel": "email",
      "status": "open"
    },
    "message": {
      "id": 1,
      "conversation_id": 1,
      "channel": "email",
      "direction": "incoming",
      "message": "This is a test email"
    }
  }
}
```

## Step 4: View Conversations

1. Go back to **Conversations** page
2. You should see the new conversation in the list
3. Click on it to view the message thread
4. Reply via email using the **Reply Box**

## Webhook Payload Format

The webhook expects a POST request with:

```json
{
  "from": "sender@example.com",        // Required: sender email
  "subject": "Email Subject",          // Optional: email subject
  "text": "Plain text content",        // Optional: plain text body
  "html": "<p>HTML content</p>"        // Optional: HTML body
}
```

## Troubleshooting

### Emails Not Appearing

1. **Check Email Configuration**:
   - Go to Settings and verify credentials are saved
   - Test SMTP connection with a test email

2. **Check Webhook URL**:
   - Ensure webhook URL is correct: `https://your-domain.com/webhooks/email`
   - Test with curl command above

3. **Check Logs**:
   - Look at Render.com logs for errors
   - Check email provider's webhook logs

4. **Database Connection**:
   - Ensure database is configured and accessible
   - Check that conversations table exists

### SMTP Connection Errors

- **Port 587**: Use TLS (not SSL)
- **Port 465**: Use SSL (not TLS)
- **Authentication Failed**: Check username/password
- **Gmail**: Use [App Password](https://myaccount.google.com/apppasswords), not regular password

## Security Notes

- Credentials are stored in memory (not persisted)
- Use environment variables for production
- Consider adding authentication to webhook endpoint
- Use HTTPS for all webhook communications
- Validate sender email addresses

## Next Steps

- Set up SMS webhooks for Twilio
- Configure Live Chat integration
- Add database persistence for credentials
- Implement webhook authentication


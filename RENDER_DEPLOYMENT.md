# Message Broker v2 - Render.com Deployment Guide

## Overview

Render.com is a modern cloud platform that makes it easy to deploy web applications, APIs, and databases. This guide covers deploying Message Broker v2 to Render.com.

**Benefits:**
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL support
- ✅ SSL/HTTPS included
- ✅ Easy environment variable management
- ✅ Automatic scaling
- ✅ No credit card required for free tier

---

## Prerequisites

1. **GitHub Account** - Repository must be on GitHub
2. **Render.com Account** - Sign up at https://render.com
3. **GitHub Personal Access Token** (optional, for private repos)

---

## Step 1: Push to GitHub

```bash
cd "Message Broker"

# Initialize git
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Message Broker v2 - Unified communication platform"

# Add remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/message-broker.git

# Rename to main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 2: Create Render.com Account

1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize Render to access your GitHub account

---

## Step 3: Deploy to Render.com

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Select your GitHub repository
4. Render will auto-detect `render.yaml`
5. Review the configuration
6. Click "Create New Services"
7. Wait for deployment (5-10 minutes)

### Option B: Manual Setup

#### Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: message-broker-db
   - **Database**: message_broker
   - **User**: postgres
   - **Region**: Choose closest to you
   - **Plan**: Free (or paid for production)
4. Click "Create Database"
5. Copy the connection string (you'll need it)

#### Create Backend Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name**: message-broker-backend
   - **Environment**: Docker
   - **Build Command**: `npm install && cd client && npm install && cd ..`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or paid for production)
4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   INSTANCE_NAME=render
   DB_HOST=<from PostgreSQL service>
   DB_PORT=5432
   DB_NAME=message_broker
   DB_USER=postgres
   DB_PASSWORD=<from PostgreSQL service>
   TWILIO_ACCOUNT_SID=<your-sid>
   TWILIO_AUTH_TOKEN=<your-token>
   TWILIO_PHONE_NUMBER=<your-number>
   EMAIL_HOST=<your-email-host>
   EMAIL_PORT=587
   EMAIL_USER=<your-email>
   EMAIL_PASSWORD=<your-password>
   EMAIL_FROM=<your-email>
   JWT_SECRET=<generate-strong-secret>
   LIVECHAT_ENABLED=true
   CORS_ORIGIN=https://message-broker-frontend.onrender.com
   ```
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)

#### Create Frontend Service

1. Click "New +" → "Static Site"
2. Select your GitHub repository
3. Configure:
   - **Name**: message-broker-frontend
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Plan**: Free
4. Add Environment Variables:
   ```
   VITE_API_URL=https://message-broker-backend.onrender.com
   ```
5. Click "Create Static Site"
6. Wait for deployment (2-3 minutes)

---

## Step 4: Verify Deployment

### Check Services

1. Go to https://dashboard.render.com
2. Verify all three services are running:
   - ✅ message-broker-db (PostgreSQL)
   - ✅ message-broker-backend (Web Service)
   - ✅ message-broker-frontend (Static Site)

### Test Backend

```bash
# Health check
curl https://message-broker-backend.onrender.com/health

# Expected response:
# {"status":"ok","instance":"render"}
```

### Test Frontend

Visit: https://message-broker-frontend.onrender.com

---

## Step 5: Configure Custom Domain (Optional)

1. In Render dashboard, select your service
2. Go to "Settings" → "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. Render provides free SSL certificate

---

## Environment Variables

### Required Variables

```
NODE_ENV=production
PORT=3000
DB_HOST=<PostgreSQL host>
DB_PORT=5432
DB_NAME=message_broker
DB_USER=postgres
DB_PASSWORD=<PostgreSQL password>
JWT_SECRET=<strong-random-secret>
```

### Optional Variables

```
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
TWILIO_PHONE_NUMBER=<your-number>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
EMAIL_FROM=<your-email>
LIVECHAT_ENABLED=true
CORS_ORIGIN=https://message-broker-frontend.onrender.com
LOG_LEVEL=info
```

---

## Monitoring & Logs

### View Logs

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time logs

### Monitor Performance

1. Click "Metrics" tab
2. View CPU, memory, and request metrics
3. Set up alerts (paid plans)

---

## Database Management

### Access PostgreSQL

```bash
# Get connection string from Render dashboard
# Format: postgresql://user:password@host:port/database

# Connect with psql
psql postgresql://user:password@host:port/database

# Run queries
\dt  # List tables
SELECT * FROM customers;
```

### Backup Database

1. Go to PostgreSQL service in Render
2. Click "Backups" tab
3. Click "Create Backup"
4. Download backup file

### Restore Database

1. Click "Backups" tab
2. Select backup
3. Click "Restore"

---

## Troubleshooting

### Service Won't Start

1. Check logs in Render dashboard
2. Verify environment variables are set
3. Check database connection string
4. Ensure all required variables are present

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:**
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Check PostgreSQL service is running
- Ensure backend service can reach database

### Frontend Not Loading

```
Error: Failed to fetch from API
```

**Solution:**
- Verify VITE_API_URL is correct
- Check CORS_ORIGIN in backend
- Ensure backend service is running

### Deployment Fails

1. Check build logs in Render dashboard
2. Verify Dockerfile is correct
3. Check for missing dependencies
4. Ensure all files are committed to GitHub

---

## Updating Deployment

### Automatic Updates

1. Push changes to GitHub
2. Render automatically redeploys
3. Check deployment status in dashboard

### Manual Redeploy

1. Go to Render dashboard
2. Select service
3. Click "Manual Deploy"
4. Select branch
5. Click "Deploy"

---

## Scaling

### Free Tier Limits

- 0.5 CPU
- 512 MB RAM
- 100 GB bandwidth/month
- Auto-sleep after 15 minutes of inactivity

### Upgrade to Paid

1. Go to service settings
2. Click "Plan"
3. Select paid plan
4. Billing starts immediately

---

## Cost Estimation

| Service | Free Tier | Paid (Starter) |
|---------|-----------|----------------|
| PostgreSQL | $7/month | $15/month |
| Web Service | Free | $7/month |
| Static Site | Free | Free |
| **Total** | **$7/month** | **$22/month** |

---

## Next Steps

1. ✅ Push to GitHub
2. ✅ Create Render.com account
3. ✅ Deploy services
4. ✅ Configure environment variables
5. ✅ Test all endpoints
6. ✅ Set up custom domain (optional)
7. ✅ Configure monitoring
8. ✅ Set up backups

---

## Support

- **Render Docs**: https://render.com/docs
- **GitHub Issues**: Create issue in your repository
- **Render Support**: https://render.com/support

---

## Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: https://github.com/YOUR_USERNAME/message-broker
- **Frontend URL**: https://message-broker-frontend.onrender.com
- **Backend URL**: https://message-broker-backend.onrender.com
- **Health Check**: https://message-broker-backend.onrender.com/health


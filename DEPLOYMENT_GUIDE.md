# Message Broker v2 - Staging Deployment Guide

## Deployment Options

### Option 1: Railway (Recommended) ⭐
- **Cost**: Free tier available
- **Setup Time**: 5-10 minutes
- **Features**: PostgreSQL included, automatic deployments, environment variables
- **URL**: https://railway.app

### Option 2: Heroku
- **Cost**: Paid (free tier discontinued)
- **Setup Time**: 10-15 minutes
- **Features**: Easy deployment, add-ons for PostgreSQL

### Option 3: DigitalOcean App Platform
- **Cost**: $5-12/month
- **Setup Time**: 15-20 minutes
- **Features**: Full control, scalable, PostgreSQL included

### Option 4: AWS (Elastic Beanstalk)
- **Cost**: Variable (free tier available)
- **Setup Time**: 20-30 minutes
- **Features**: Highly scalable, production-ready

---

## Quick Start: Railway Deployment

### Prerequisites
- GitHub account with code pushed
- Railway account (free signup at railway.app)
- PostgreSQL database

### Step 1: Prepare for Deployment

```bash
# Ensure all code is committed
git add .
git commit -m "Ready for staging deployment"
git push origin main

# Create production .env file
cp .env .env.production
# Update .env.production with staging credentials
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select the Message Broker repository
6. Railway will auto-detect Node.js

### Step 3: Configure Environment Variables

In Railway dashboard:
1. Go to Variables tab
2. Add all variables from .env.production:
   - `NODE_ENV=staging`
   - `PORT=3000`
   - `DB_HOST=` (Railway PostgreSQL host)
   - `DB_NAME=message_broker`
   - `DB_USER=postgres`
   - `DB_PASSWORD=` (Railway generated)
   - `TWILIO_ACCOUNT_SID=`
   - `TWILIO_AUTH_TOKEN=`
   - `TWILIO_PHONE_NUMBER=`
   - `EMAIL_HOST=`
   - `EMAIL_PORT=`
   - `EMAIL_USER=`
   - `EMAIL_PASSWORD=`
   - `JWT_SECRET=` (generate strong secret)

### Step 4: Add PostgreSQL Database

1. In Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway will auto-populate DB variables
4. Run migrations/schema setup

### Step 5: Deploy Backend

1. Railway auto-deploys on git push
2. Monitor deployment in Railway dashboard
3. Check logs for errors

### Step 6: Deploy Frontend

Option A: Deploy to Railway (same project)
```bash
# Add build script to package.json
"build": "npm run build"
```

Option B: Deploy to Vercel (recommended for React)
1. Go to https://vercel.com
2. Import GitHub repository
3. Select client folder as root
4. Set API proxy to Railway backend URL

---

## Manual Staging Setup (Local/VPS)

### Prerequisites
- Ubuntu/Debian server
- Node.js 18+
- PostgreSQL 13+
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

### Installation Steps

```bash
# 1. SSH into server
ssh user@staging.example.com

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 4. Clone repository
git clone https://github.com/yourusername/message-broker.git
cd message-broker

# 5. Install dependencies
npm install
cd client && npm install && cd ..

# 6. Create .env file
cp .env.example .env
# Edit .env with staging values

# 7. Setup database
sudo -u postgres createdb message_broker
psql -U postgres -d message_broker -f db/schema.sql

# 8. Start backend with PM2
npm install -g pm2
pm2 start server.js --name "message-broker-backend"
pm2 save

# 9. Build frontend
cd client
npm run build
cd ..

# 10. Configure Nginx
sudo nano /etc/nginx/sites-available/message-broker
# Add configuration (see below)

# 11. Enable site
sudo ln -s /etc/nginx/sites-available/message-broker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Nginx Configuration

```nginx
upstream backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name staging.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name staging.example.com;

    ssl_certificate /etc/letsencrypt/live/staging.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.example.com/privkey.pem;

    # Frontend
    location / {
        root /home/user/message-broker/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhooks
    location /webhooks {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## Post-Deployment Verification

```bash
# 1. Check backend health
curl https://staging.example.com/health

# 2. Run tests against staging
npm run test

# 3. Check database
psql -U postgres -d message_broker -c "\dt"

# 4. Monitor logs
pm2 logs message-broker-backend

# 5. Check SSL certificate
curl -I https://staging.example.com
```

---

## Monitoring & Maintenance

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 restart message-broker-backend
```

### Database Backups
```bash
# Daily backup
pg_dump -U postgres message_broker > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres message_broker < backup_20260316.sql
```

### SSL Certificate Renewal
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs message-broker-backend
# Check for missing environment variables
# Check database connection
```

### Database connection errors
```bash
psql -U postgres -d message_broker -c "SELECT 1"
# Verify DB_HOST, DB_USER, DB_PASSWORD in .env
```

### Frontend not loading
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
# Verify client/dist exists
ls -la client/dist
```

---

## Rollback Procedure

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Railway will auto-redeploy
# Or manually restart PM2
pm2 restart message-broker-backend
```

---

## Next Steps

1. Choose deployment platform (Railway recommended)
2. Set up staging environment
3. Configure environment variables
4. Deploy and test
5. Set up monitoring and alerts
6. Plan production deployment


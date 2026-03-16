# 🚀 Deploy to Render.com NOW

## ✅ GitHub Push Complete!
Your code is now at: https://github.com/artpro88/message-broker

## 📋 Deploy to Render.com (5 minutes)

### Step 1: Sign In to Render
1. Go to https://dashboard.render.com
2. Click "Sign up with GitHub" (if new account)
3. Authorize GitHub access

### Step 2: Create Blueprint Deployment
1. Click **"New +"** button (top right)
2. Select **"Blueprint"**
3. Select your **message-broker** repository
4. Render auto-detects `render.yaml`
5. Click **"Create New Services"**

### Step 3: Wait for Deployment
- PostgreSQL database: ~2 minutes
- Backend API: ~3 minutes  
- Frontend: ~2 minutes
- **Total: ~5-10 minutes**

### Step 4: Add Environment Variables
Once deployment starts, go to each service and add:

**Backend Service:**
- `TWILIO_ACCOUNT_SID` - Your Twilio account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `EMAIL_HOST` - SMTP host (e.g., smtp.gmail.com)
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - Email password
- `EMAIL_FROM` - From address
- `JWT_SECRET` - Random string for JWT signing
- `DATABASE_URL` - Auto-filled by Render

**Frontend Service:**
- `VITE_API_URL` - Backend URL (e.g., https://message-broker-backend.onrender.com)

### Step 5: Verify Deployment
Once all services are live:
```bash
# Test backend health
curl https://message-broker-backend.onrender.com/health

# Expected response:
# {"status":"ok","instance":"render","timestamp":"..."}
```

## 📊 Service URLs
- **Frontend**: https://message-broker.onrender.com
- **Backend API**: https://message-broker-backend.onrender.com
- **Database**: Managed by Render (internal)

## 🔧 Troubleshooting

**Services won't start?**
- Check environment variables are set
- Check logs in Render dashboard
- Verify database is running first

**Database connection error?**
- Wait 2-3 minutes for database to initialize
- Check DATABASE_URL is correct
- Verify backend can reach database

**Frontend shows blank page?**
- Check VITE_API_URL is set correctly
- Check browser console for errors
- Verify backend is responding

## 📚 Documentation
- Full guide: `RENDER_DEPLOYMENT.md`
- Quick start: `QUICK_DEPLOY.md`
- Troubleshooting: `DEPLOYMENT_GUIDE.md`

## ✨ You're Done!
Your Message Broker v2 is now deployed to production! 🎉


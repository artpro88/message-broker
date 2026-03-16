# Message Broker v2 - Staging Deployment Checklist

## Pre-Deployment (Local)

### Code Preparation
- [ ] All code committed to git
- [ ] No uncommitted changes
- [ ] All tests passing locally
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database schema verified

### Testing
- [ ] Database tests: 6/6 passing
- [ ] API tests: 5/5 passing
- [ ] Webhook tests: 4/4 passing
- [ ] Frontend builds without errors
- [ ] No security vulnerabilities (npm audit)

### Documentation
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] .env.staging configured
- [ ] Backup strategy documented
- [ ] Rollback procedure documented

---

## Deployment Method Selection

### Option A: Docker Compose (Recommended for Testing)
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] docker-compose.yml reviewed
- [ ] Dockerfile reviewed
- [ ] nginx.conf reviewed

### Option B: Railway (Recommended for Production-like)
- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] PostgreSQL service added
- [ ] Deployment triggered

### Option C: Manual VPS Deployment
- [ ] VPS provisioned (Ubuntu/Debian)
- [ ] SSH access verified
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed
- [ ] Nginx installed
- [ ] SSL certificate obtained

---

## Docker Compose Deployment

### Setup
- [ ] Run: `docker-compose build`
- [ ] Run: `docker-compose up -d`
- [ ] Wait for services to start (30 seconds)
- [ ] Check: `docker-compose ps`

### Verification
- [ ] Backend health: `curl http://localhost:3000/health`
- [ ] Frontend loads: `curl http://localhost`
- [ ] Database connected: `docker-compose exec postgres psql -U postgres -d message_broker -c "\dt"`
- [ ] All services healthy: `docker-compose ps` shows "healthy"

### Testing
- [ ] Run: `npm run test`
- [ ] All 15 tests passing
- [ ] No errors in logs: `docker-compose logs`

---

## Railway Deployment

### Setup
- [ ] GitHub repository pushed
- [ ] Railway project created
- [ ] PostgreSQL service added
- [ ] Environment variables set
- [ ] Deployment triggered

### Verification
- [ ] Deployment successful (Railway dashboard)
- [ ] Backend health check passing
- [ ] Database tables created
- [ ] Logs show no errors

### Testing
- [ ] Access staging URL
- [ ] Health check endpoint responds
- [ ] API endpoints working
- [ ] Database queries successful

---

## Manual VPS Deployment

### Server Setup
- [ ] SSH access working
- [ ] Node.js version: 18+
- [ ] npm version: 8+
- [ ] PostgreSQL running
- [ ] Nginx installed

### Application Deployment
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] .env.staging configured
- [ ] Database schema loaded
- [ ] PM2 configured
- [ ] Application started

### Web Server Setup
- [ ] Nginx configuration applied
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] DNS records updated

### Verification
- [ ] SSH: `ssh user@staging.example.com`
- [ ] Backend: `curl http://localhost:3000/health`
- [ ] Database: `psql -U postgres -d message_broker -c "\dt"`
- [ ] Nginx: `sudo systemctl status nginx`
- [ ] PM2: `pm2 status`

---

## Post-Deployment Verification

### Health Checks
- [ ] Backend responds to health check
- [ ] Frontend loads without errors
- [ ] Database connection working
- [ ] All services running

### Functionality Tests
- [ ] Create customer via API
- [ ] Retrieve customer data
- [ ] Create conversation
- [ ] Add message to conversation
- [ ] SMS webhook accepts requests
- [ ] Email webhook accepts requests

### Performance Checks
- [ ] Page load time < 2 seconds
- [ ] API response time < 200ms
- [ ] Database queries < 100ms
- [ ] No memory leaks (check logs)

### Security Checks
- [ ] HTTPS working
- [ ] Security headers present
- [ ] CORS properly configured
- [ ] Rate limiting working
- [ ] No sensitive data in logs

---

## Monitoring Setup

### Logging
- [ ] Application logs configured
- [ ] Error logs monitored
- [ ] Access logs reviewed
- [ ] Log rotation configured

### Alerts
- [ ] Health check monitoring enabled
- [ ] Error rate alerts configured
- [ ] Database connection alerts set
- [ ] Disk space alerts configured

### Backups
- [ ] Database backup scheduled
- [ ] Backup location verified
- [ ] Restore procedure tested
- [ ] Backup retention policy set

---

## Sign-Off

### Deployment Approval
- [ ] Code review completed
- [ ] All tests passing
- [ ] Staging environment verified
- [ ] Performance acceptable
- [ ] Security review passed

### Documentation
- [ ] Deployment documented
- [ ] Configuration documented
- [ ] Monitoring setup documented
- [ ] Runbook created

### Team Notification
- [ ] Team notified of deployment
- [ ] Staging URL shared
- [ ] Access credentials provided
- [ ] Testing instructions provided

---

## Rollback Plan

### If Issues Found
- [ ] Identify issue
- [ ] Check logs for errors
- [ ] Attempt fix
- [ ] If fix fails, execute rollback

### Rollback Steps
- [ ] Docker: `docker-compose down && docker-compose up -d`
- [ ] Railway: Revert to previous deployment
- [ ] VPS: `git revert HEAD && pm2 restart all`

---

## Next Steps After Staging

- [ ] Conduct UAT (User Acceptance Testing)
- [ ] Gather feedback from stakeholders
- [ ] Fix any issues found
- [ ] Plan production deployment
- [ ] Set up production monitoring
- [ ] Create production runbook

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Approved By**: _______________  
**Notes**: _______________________________________________


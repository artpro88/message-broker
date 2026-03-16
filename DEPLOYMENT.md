# Message Broker v2 - Deployment Guide

## Production Checklist

- [ ] Database backed up
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Twilio webhook URLs updated
- [ ] Email service configured
- [ ] Frontend built and optimized
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: message_broker
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_NAME: message_broker
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "80:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Heroku Deployment

### 1. Create Heroku App

```bash
heroku create message-broker-app
heroku addons:create heroku-postgresql:standard-0
```

### 2. Set Environment Variables

```bash
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set JWT_SECRET=your_secret
# ... set all other variables
```

### 3. Deploy

```bash
git push heroku main
heroku run "psql -d $DATABASE_URL -f db/schema.sql"
```

## AWS Deployment

### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 message-broker

# Create environment
eb create production

# Deploy
eb deploy
```

### Using ECS + RDS

1. Create RDS PostgreSQL instance
2. Create ECR repository
3. Build and push Docker image
4. Create ECS cluster and task definition
5. Configure load balancer
6. Set environment variables in task definition

## Nginx Configuration

```nginx
upstream backend {
  server localhost:3000;
}

server {
  listen 80;
  server_name api.example.com;

  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.example.com;

  ssl_certificate /etc/ssl/certs/cert.pem;
  ssl_certificate_key /etc/ssl/private/key.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;

  location / {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /socket.io {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
}
```

## Monitoring & Logging

### PM2 (Process Manager)

```bash
npm install -g pm2

# Start with PM2
pm2 start server.js --name "message-broker"

# Monitor
pm2 monit

# Logs
pm2 logs message-broker
```

### Application Insights / DataDog

Add monitoring to track:
- API response times
- Database query performance
- Error rates
- User activity
- Message throughput

## Backup Strategy

### Database Backups

```bash
# Daily backup
0 2 * * * pg_dump message_broker > /backups/db_$(date +\%Y\%m\%d).sql

# Upload to S3
aws s3 cp /backups/db_*.sql s3://my-bucket/backups/
```

### File Attachments

- Store in S3 or similar cloud storage
- Implement lifecycle policies
- Regular backups to secondary region

## Scaling Considerations

1. **Database**: Use read replicas for scaling reads
2. **Cache**: Implement Redis for session/conversation caching
3. **Message Queue**: Use RabbitMQ/Kafka for async processing
4. **Load Balancing**: Use sticky sessions for Socket.IO
5. **CDN**: Serve static assets from CDN

## Security Hardening

- [ ] Enable HTTPS/TLS
- [ ] Implement CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Implement request validation
- [ ] Use helmet.js for security headers
- [ ] Regular security audits
- [ ] Keep dependencies updated


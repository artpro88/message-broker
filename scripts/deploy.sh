#!/bin/bash

# Message Broker v2 - Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Message Broker v2 - Deployment Script                        ║"
echo "║  Environment: $ENVIRONMENT                                      ║"
echo "║  Timestamp: $TIMESTAMP                                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if environment is valid
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo "❌ .env.$ENVIRONMENT file not found"
    exit 1
fi

echo "📋 Step 1: Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✅ Prerequisites OK"
echo ""

echo "📋 Step 2: Installing dependencies..."
npm install
cd client && npm install && cd ..
echo "✅ Dependencies installed"
echo ""

echo "📋 Step 3: Running tests..."
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Aborting deployment."
    exit 1
fi
echo "✅ All tests passed"
echo ""

echo "📋 Step 4: Building frontend..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..
echo "✅ Frontend built successfully"
echo ""

echo "📋 Step 5: Creating backup..."
BACKUP_DIR="backups/$ENVIRONMENT"
mkdir -p "$BACKUP_DIR"
cp .env.$ENVIRONMENT "$BACKUP_DIR/.env.$ENVIRONMENT.$TIMESTAMP"
echo "✅ Backup created: $BACKUP_DIR/.env.$ENVIRONMENT.$TIMESTAMP"
echo ""

echo "📋 Step 6: Preparing deployment..."
echo "Environment: $ENVIRONMENT"
echo "Backup: $BACKUP_DIR/.env.$ENVIRONMENT.$TIMESTAMP"
echo ""

echo "✅ Deployment preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review the deployment configuration"
echo "2. For Railway: Push to GitHub and Railway will auto-deploy"
echo "3. For manual deployment: Use PM2 or Docker"
echo "4. Run: npm run test to verify staging deployment"
echo ""
echo "📊 Deployment Summary:"
echo "  - Environment: $ENVIRONMENT"
echo "  - Timestamp: $TIMESTAMP"
echo "  - Backend: Ready"
echo "  - Frontend: Built and ready"
echo "  - Tests: All passing"
echo "  - Backup: Created"
echo ""


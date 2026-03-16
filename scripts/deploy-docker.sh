#!/bin/bash

# Message Broker v2 - Docker Compose Deployment Script
# Usage: ./scripts/deploy-docker.sh [up|down|restart|logs|test]

set -e

COMMAND=${1:-up}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Message Broker v2 - Docker Deployment                        ║"
echo "║  Command: $COMMAND                                             ║"
echo "║  Timestamp: $TIMESTAMP                                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

case $COMMAND in
    up)
        echo "📋 Building Docker images..."
        docker-compose build
        echo "✅ Build complete"
        echo ""
        
        echo "📋 Starting services..."
        docker-compose up -d
        echo "✅ Services started"
        echo ""
        
        echo "⏳ Waiting for services to be healthy (30 seconds)..."
        sleep 30
        echo ""
        
        echo "📋 Checking service status..."
        docker-compose ps
        echo ""
        
        echo "📋 Verifying backend health..."
        if curl -s http://localhost:3000/health > /dev/null; then
            echo "✅ Backend is healthy"
        else
            echo "⚠️  Backend health check failed"
        fi
        echo ""
        
        echo "📋 Verifying database..."
        if docker-compose exec -T postgres psql -U postgres -d message_broker -c "\dt" > /dev/null 2>&1; then
            echo "✅ Database is ready"
        else
            echo "⚠️  Database check failed"
        fi
        echo ""
        
        echo "✅ Deployment complete!"
        echo ""
        echo "📊 Service URLs:"
        echo "  - Frontend: http://localhost"
        echo "  - Backend: http://localhost:3000"
        echo "  - Health: http://localhost:3000/health"
        echo ""
        echo "📝 Useful commands:"
        echo "  - View logs: docker-compose logs -f"
        echo "  - Stop services: docker-compose down"
        echo "  - Run tests: npm run test"
        ;;
        
    down)
        echo "📋 Stopping services..."
        docker-compose down
        echo "✅ Services stopped"
        ;;
        
    restart)
        echo "📋 Restarting services..."
        docker-compose restart
        echo "✅ Services restarted"
        echo ""
        echo "⏳ Waiting for services to be healthy..."
        sleep 10
        docker-compose ps
        ;;
        
    logs)
        echo "📋 Showing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
        
    test)
        echo "📋 Running tests..."
        npm run test
        if [ $? -eq 0 ]; then
            echo "✅ All tests passed!"
        else
            echo "❌ Tests failed"
            exit 1
        fi
        ;;
        
    status)
        echo "📋 Service Status:"
        docker-compose ps
        echo ""
        echo "📋 Backend Health:"
        curl -s http://localhost:3000/health | jq . || echo "Backend not responding"
        ;;
        
    *)
        echo "❌ Unknown command: $COMMAND"
        echo ""
        echo "Available commands:"
        echo "  up       - Start all services"
        echo "  down     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - View service logs"
        echo "  test     - Run test suite"
        echo "  status   - Check service status"
        exit 1
        ;;
esac

echo ""


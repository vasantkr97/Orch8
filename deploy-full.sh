#!/bin/bash

# Complete deployment and Nginx setup script
# This script handles:
# 1. Copying .env to server
# 2. Rebuilding frontend with correct VITE_API_URL
# 3. Restarting containers
# 4. Configuring Nginx proxy for API subdomain

SERVER="root@134.209.151.139"
PROJECT_DIR="~/Orch8"
NGINX_CONF="nginx/api.orch8.vasanth.site.conf"

set -e

echo "=========================================="
echo "🚀 Deploying Orch8 with Nginx Setup"
echo "=========================================="
echo ""

# Step 1: Copy .env file
echo "📤 Step 1: Copying .env file to server..."
scp .env $SERVER:$PROJECT_DIR/.env
echo "✅ .env copied"
echo ""

# Step 2: Rebuild frontend
echo "🔨 Step 2: Rebuilding frontend with VITE_API_URL=https://api.orch8.vasanth.site/api..."
ssh $SERVER "cd $PROJECT_DIR && docker compose build frontend"
echo "✅ Frontend rebuilt"
echo ""

# Step 3: Restart containers
echo "🔄 Step 3: Restarting containers..."
ssh $SERVER "cd $PROJECT_DIR && docker compose up -d"
echo "✅ Containers restarted"
echo ""

# Step 4: Configure Nginx Proxy
echo "🌐 Step 4: Configuring Nginx proxy for api.orch8.vasanth.site..."
echo ""
echo "You have Nginx Proxy Manager running. Please configure it manually:"
echo ""
echo "1. Open: http://134.209.151.139:81"
echo "2. Add new Proxy Host:"
echo "   - Domain: api.orch8.vasanth.site"
echo "   - Forward to: host.docker.internal:3001 (or 134.209.151.139:3001)"
echo "   - Enable SSL with Let's Encrypt"
echo ""
echo "OR run: bash setup-api-nginx.sh for manual configuration"
echo ""

read -p "Have you configured the Nginx proxy? (y/n): " nginx_done

if [ "$nginx_done" == "y" ] || [ "$nginx_done" == "Y" ]; then
    echo ""
    echo "🧪 Testing endpoints..."
    echo ""
    
    echo "Testing backend health:"
    ssh $SERVER "curl -s http://localhost:3001/" || echo "⚠️  Backend not responding"
    
    echo ""
    echo "Testing API endpoint (expecting 404 until Nginx is configured):"
    curl -I https://api.orch8.vasanth.site/ 2>&1 | head -n 5 || echo "⚠️  API endpoint not accessible yet"
    
    echo ""
    echo "=========================================="
    echo "✅ Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "📝 Summary:"
    echo "  - Frontend rebuilt with correct API URL"
    echo "  - Containers restarted"
    echo "  - Nginx proxy configured (if completed)"
    echo ""
    echo "🧪 Test your application:"
    echo "  - Frontend: https://orch8.vasanth.site"
    echo "  - API: https://api.orch8.vasanth.site/api/auth/signup"
    echo ""
else
    echo ""
    echo "⚠️  Please configure Nginx Proxy Manager before testing:"
    echo "   http://134.209.151.139:81"
    echo ""
    echo "See NGINX_SETUP.md for detailed instructions."
    echo ""
fi

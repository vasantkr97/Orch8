#!/bin/bash

# Deployment script to update .env on server and rebuild/restart containers

SERVER="root@134.209.151.139"
PROJECT_DIR="~/Orch8"

echo "📤 Copying .env file to server..."
scp .env $SERVER:$PROJECT_DIR/.env

echo "🔄 Rebuilding frontend with updated VITE_API_URL..."
ssh $SERVER "cd $PROJECT_DIR && docker compose build frontend"

echo "🔄 Restarting services..."
ssh $SERVER "cd $PROJECT_DIR && docker compose up -d"

echo "✅ Done! Services restarted with new configuration"
echo "🧪 Frontend rebuilt with: VITE_API_URL=https://api.orch8.vasanth.site/api"
echo ""
echo "⚠️  IMPORTANT: You still need to configure Nginx proxy for api.orch8.vasanth.site"
echo "   See NGINX_SETUP.md for instructions"

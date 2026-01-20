#!/bin/bash

# Quick deployment script to update .env on server and restart backend

SERVER="root@134.209.151.139"
PROJECT_DIR="~/Orch8"

echo "📤 Copying .env file to server..."
scp .env $SERVER:$PROJECT_DIR/.env

echo "🔄 Restarting backend container..."
ssh $SERVER "cd $PROJECT_DIR && docker-compose restart backend"

echo "✅ Done! Backend should now accept requests from https://orch8.vasanth.site"
echo "🧪 Test your login page again"

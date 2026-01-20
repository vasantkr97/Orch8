# #!/bin/bash

# # Stop on error
# set -e

# echo "🚀 Starting Deployment..."

# # 1. Pull latest changes
# echo "⬇️  Pulling latest changes..."
# git pull origin main

# # 2. Build Docker images
# echo "🏗️  Building images..."
# docker compose build

# # 3. Ensure Database is up
# echo "🐘 Starting Database..."
# docker compose up -d postgres

# # Wait for DB to be ready (simple sleep, or use wait-for-it if available, but sleep is often sufficient for simple scripts)
# echo "⏳ Waiting for Database to be ready..."
# sleep 5

# # 4. Run Migrations
# echo "🔄 Running Migrations..."
# # We use the backend image to run the migration command
# docker compose run --rm backend bunx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma

# # 5. Restart Services
# echo "🚀 Restarting Services..."
# docker compose up -d

# echo "✅ Deployment Complete!"

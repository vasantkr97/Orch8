#!/bin/sh
set -e

echo "🔄 Running database migrations..."
cd /app/packages/db && bun run db:push

echo "✅ Migrations complete!"
echo "🚀 Starting backend server..."

# Start the backend server
exec bun run /app/dist/index.js

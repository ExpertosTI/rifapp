#!/bin/sh

echo "========================================="
echo "RifaApp Container Starting..."
echo "========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  exit 1
fi

echo "Database URL configured: ${DATABASE_URL:0:30}..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "Running database migrations..."
if [ -f "./node_modules/.bin/prisma" ]; then
  ./node_modules/.bin/prisma db push --skip-generate --accept-data-loss || echo "Warning: Migration had issues, continuing..."
else
  echo "Warning: Prisma CLI not found at ./node_modules/.bin/prisma"
  ls -la ./node_modules/.bin/ 2>/dev/null | head -20
fi

echo "========================================="
echo "Starting Next.js application..."
echo "========================================="
exec node server.js

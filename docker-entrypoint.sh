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
if [ -d "./node_modules/prisma" ]; then
  node node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss || echo "Warning: Migration had issues, continuing..."
else
  echo "Warning: Prisma package not found at ./node_modules/prisma"
  find ./node_modules -name "prisma" -maxdepth 2
fi

echo "========================================="
echo "Starting Next.js application..."
echo "========================================="
exec node server.js

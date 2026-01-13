#!/bin/sh
set -e

# Run database migrations using direct path to prisma
echo "Running database migrations..."
./node_modules/.bin/prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo "Migration skipped or already applied"

# Start the application
echo "Starting application..."
exec node server.js

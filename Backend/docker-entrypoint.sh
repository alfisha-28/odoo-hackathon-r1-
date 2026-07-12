#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting docker-entrypoint.sh..."

# Wait for the database to be reachable
echo "Checking database connection..."
until npm run db:check; do
  echo "Database is not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "Database is ready!"

# Apply database schema
if [ "$NODE_ENV" = "production" ]; then
  echo "Running Prisma migrations for production..."
  if [ -d "prisma/migrations" ]; then
    npx prisma migrate deploy
  else
    echo "No migrations found. Pushing schema directly..."
    npx prisma db push --skip-generate
  fi
else
  echo "Running Prisma schema push for development/local..."
  npx prisma db push --skip-generate
fi

echo "Database schema up to date!"

# Execute the main container command
exec "$@"

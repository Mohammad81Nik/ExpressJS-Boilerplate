#!/bin/sh
set -e

echo "⏳ Waiting for database..."

until nc -z db 5432 >/dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

echo "✅ Database is ready"

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec "$@"

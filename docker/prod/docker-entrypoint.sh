#!/bin/sh
set -e

echo "⏳ Waiting for database..."

until nc -z db 5432 >/dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

echo "✅ Database is ready"

echo "⏳ Waiting for Redis..."

until nc -z redis 6379 >/dev/null 2>&1; do
    echo "Redis not ready, waiting..."
    sleep 2
done

echo "✅ Redis is ready"

echo "🧹 Clearing Redis..."
redis-cli -h redis FLUSHALL

echo "✅ Redis cleared"

echo "Running database migrations..."
npx prisma migrate reset --force --config dist/config/prisma.config.js
npx prisma migrate deploy --config dist/config/prisma.config.js

echo "Starting application..."
exec "$@"

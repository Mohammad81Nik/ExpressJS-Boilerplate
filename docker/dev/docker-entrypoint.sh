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

echo "🚀 Generating prisma client..."
npx prisma migrate reset --force --config src/config/prisma.config.ts
npx prisma generate --config src/config/prisma.config.ts

echo "🚀 Running Prisma migrations..."
npx prisma migrate deploy --config src/config/prisma.config.ts

echo "▶️ Starting dev server..."
exec npm run dev
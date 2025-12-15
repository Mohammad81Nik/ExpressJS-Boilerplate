#!/bin/sh
set -e

echo "⏳ Waiting for database..."


until nc -z db 5432 >/dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

echo "✅ Database is ready"

echo "🚀 Generating prisma client..."
npx prisma generate

echo "⏳ Running migrations..."
npx prisma migrate deploy

echo "Running tests..."
exec npm run test
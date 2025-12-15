#!/bin/sh
set -e

echo "⏳ Waiting for database..."

until echo "SELECT 1;" | npx prisma db execute --stdin >/dev/null 2>&1; do
  sleep 2
done

echo "✅ Database is ready"


echo "🚀 Generating prisma client..."
npx prisma generate

echo "🚀 Running Prisma migrations..."
npx prisma migrate deploy

echo "▶️ Starting dev server..."
exec npm run dev
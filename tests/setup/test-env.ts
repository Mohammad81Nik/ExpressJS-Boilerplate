import { execSync } from 'child_process';
import { config } from '../../src/config/env.config.js';
export async function setup() {
  console.log(config.DATABASE_URL);
  console.log('Reseting the test database');
  execSync('npx prisma migrate reset --force --config src/config/prisma.config.ts', {
    stdio: 'inherit',
    env: process.env,
  });

  execSync('npx prisma generate --config src/config/prisma.config.ts', {
    stdio: 'inherit',
  });
}

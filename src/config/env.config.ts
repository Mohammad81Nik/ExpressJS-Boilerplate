import { config as dotenvConfig } from 'dotenv';
import { envSchema } from '../validation/env.schema.js';
import { getBaseUrl } from '../utils/database.js';

dotenvConfig();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

const env = parsed.data;

export const config = {
  PORT: env.PORT,
  ORIGINS: env.ORIGINS?.split(','),
  DATABASE_CONNECTION_STRING: getBaseUrl(env),
  DATABASE_URL: getBaseUrl(env),
};

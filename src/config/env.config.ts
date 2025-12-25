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
  OTP_TTL_SECONDS: env.OTP_TTL_SECONDS,
  OTP_TTL_MILLISECONDS: env.OTP_TTL_MILLISECONDS,
  REGISTER_TOKEN_TTL_SECONDS: env.REGISTER_TOKEN_TTL_SECONDS,
  REGISTER_TOKEN_TTL_MILLISECONDS: env.REGISTER_TOKEN_TTL_MILLISECONDS,
  NODE_ENV: env.NODE_ENV,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRY_TIME: env.JWT_EXPIRY_TIME,
  OTP_EMAIL: env.OTP_EMAIL,
  OTP_EMAIL_PASS: env.OTP_EMAIL_PASS,
  REDIS_URL: env.REDIS_URL,
};

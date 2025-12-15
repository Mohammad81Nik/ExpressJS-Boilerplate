import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().default('8000'),
  ORIGINS: z.string().default(''),
  DATABASE_URL_DEV: z.url(),
  DATABASE_URL_TEST: z.url(),
  DATABASE_URL_PROD: z.url(),
});

export type TEnvValues = z.infer<typeof envSchema>;

import z from 'zod';

export const envSchema = z
  .object({
    // node
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.string().default('8000'),
    ORIGINS: z.string().default(''),

    // database
    DATABASE_URL_DEV: z.url(),
    DATABASE_URL_TEST: z.url(),
    DATABASE_URL_PROD: z.url(),

    // ttl
    OTP_TTL_SECONDS: z.coerce.number().int().default(120),
    REGISTER_TOKEN_TTL_SECONDS: z.coerce
      .number()
      .int()
      .default(15 * 60),

    // jwt
    JWT_SECRET: z.string().transform((data) => new TextEncoder().encode(data)),
    JWT_EXPIRY_TIME: z.coerce.number().int(),

    // nodemailer
    OTP_EMAIL_PASS: z.string(),
    OTP_EMAIL: z.email(),

    // redis
    REDIS_URL: z.string(),
  })
  .transform((data) => ({
    ...data,
    OTP_TTL_MILLISECONDS: data.OTP_TTL_SECONDS * 1000,
    REGISTER_TOKEN_TTL_MILLISECONDS: data.REGISTER_TOKEN_TTL_SECONDS * 1000,
  }));

export type TEnvValues = z.infer<typeof envSchema>;

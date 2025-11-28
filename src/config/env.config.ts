import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  PORT: process.env.PORT,
  ORIGINS: process.env.ORIGINS?.split(',') ?? [],
};

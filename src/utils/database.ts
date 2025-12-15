import { TEnvValues } from '../validation/env.schema.js';

function getBaseUrl(parsedEnv: TEnvValues) {
  switch (parsedEnv.NODE_ENV) {
    case 'test':
      process.env.DATABASE_URL = parsedEnv.DATABASE_URL_TEST;
      return parsedEnv.DATABASE_URL_TEST;
    case 'production':
      process.env.DATABASE_URL = parsedEnv.DATABASE_URL_PROD;
      return parsedEnv.DATABASE_URL_PROD;
    default:
      process.env.DATABASE_URL = parsedEnv.DATABASE_URL_DEV;
      return parsedEnv.DATABASE_URL_DEV;
  }
}

export { getBaseUrl };

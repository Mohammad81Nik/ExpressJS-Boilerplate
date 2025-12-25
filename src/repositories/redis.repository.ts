import { config } from '../config/env.config.js';
import { redisClient } from '../infrastructure/redis/redis.client.js';
import { REDIS_PREFIXES } from '../infrastructure/redis/redis.prefixes.js';
import { BadRequestError } from '../utils/errors.js';
import { redisUtis } from '../utils/redis.js';

const { redisKey } = redisUtis;
const { OTP, TEMP_TOKEN } = REDIS_PREFIXES;

export const redisOtpRepository = {
  async save(
    jti: string,
    payload: {
      code: string;
      hashedCode: string;
      expires_at: Date;
    },
  ) {
    return redisClient.set(
      redisKey(OTP, jti),
      JSON.stringify(payload),
      'EX',
      config.OTP_TTL_SECONDS,
    );
  },

  async exists(jti: string) {
    const data = await redisClient.get(redisKey(OTP, jti));

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as {
      code: string;
      hashedCode: string;
      expires_at: string;
    };

    return { ...parsedData, expires_at: new Date(parsedData.expires_at) };
  },

  async consume(jti: string) {
    const deleted = await redisClient.del(redisKey(OTP, jti));

    if (!deleted) {
      throw new BadRequestError('Token already used or expired');
    }
  },
};

export const redisTempRegisterToken = {
  save(jti: string) {
    return redisClient.set(
      redisKey(TEMP_TOKEN, jti),
      'valid',
      'EX',
      config.REGISTER_TOKEN_TTL_SECONDS,
    );
  },

  async exists(jti: string) {
    return (await redisClient.exists(redisKey(TEMP_TOKEN, jti))) === 1;
  },

  async consume(jti: string) {
    const deleted = await redisClient.del(redisKey(TEMP_TOKEN, jti));

    if (!deleted) {
      throw new BadRequestError('Token already used or expired');
    }
  },
};

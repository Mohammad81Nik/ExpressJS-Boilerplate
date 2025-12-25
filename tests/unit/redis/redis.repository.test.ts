import { describe, it, expect, beforeEach } from 'vitest';
import {
  redisOtpRepository,
  redisTempRegisterToken,
} from '../../../src/repositories/redis.repository';
import { dateUtils } from '../../../src/utils/date';
import { config } from '../../../src/config/env.config';

const SAMPLE_EMAIL = 'test@gmail.com';

const SAMPLE_EMAIL_NONEXISTANT = 'nonexistant@gmail.com';

const SAMPLE_OTP_PAYLOAD = {
  code: '123456',
  hashedCode: 'hashed',
  expires_at: new Date(dateUtils.getTime() + config.OTP_TTL_SECONDS),
};

describe('redis.otp', () => {
  beforeEach(async () => {
    await redisOtpRepository.consume(SAMPLE_EMAIL);
  });

  it('should save and retrive OTP', async () => {
    await redisOtpRepository.save(SAMPLE_EMAIL, SAMPLE_OTP_PAYLOAD);

    const result = await redisOtpRepository.exists(SAMPLE_EMAIL);

    expect(result).toBeDefined();

    expect(result).toMatchObject({
      code: SAMPLE_OTP_PAYLOAD.code,
      hashedCode: SAMPLE_OTP_PAYLOAD.hashedCode,
    });

    expect(result?.expires_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existant otp', async () => {
    const result = await redisOtpRepository.exists(SAMPLE_EMAIL_NONEXISTANT);
    expect(result).toBeNull();
  });

  it('should delete OTP on consume', async () => {
    await redisOtpRepository.save(SAMPLE_EMAIL, SAMPLE_OTP_PAYLOAD);

    await redisOtpRepository.consume(SAMPLE_EMAIL);

    const result = await redisOtpRepository.exists(SAMPLE_EMAIL);

    expect(result).toBeNull();
  });
});

describe('redis.register.token', () => {
  beforeEach(async () => {
    await redisTempRegisterToken.consume(SAMPLE_EMAIL);
  });

  it('should create a temp register token cache and check its existance', async () => {
    await redisTempRegisterToken.save(SAMPLE_EMAIL);

    const result = await redisTempRegisterToken.exists(SAMPLE_EMAIL);

    expect(result).toBeTruthy();
  });

  it("it should return false if the token doesn't exist", async () => {
    const result = await redisTempRegisterToken.exists(SAMPLE_EMAIL);

    expect(result).toBeFalsy();
  });

  it('it should delete temp token successfully', async () => {
    await redisTempRegisterToken.save(SAMPLE_EMAIL);

    const exists = await redisTempRegisterToken.exists(SAMPLE_EMAIL);

    expect(exists).toBeTruthy();

    await redisTempRegisterToken.consume(SAMPLE_EMAIL);

    const doesntExist = await redisTempRegisterToken.exists(SAMPLE_EMAIL);

    expect(doesntExist).toBeFalsy();
  });
});

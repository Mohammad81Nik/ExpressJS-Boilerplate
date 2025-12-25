// tests/unit/otp/otp.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { otpService } from '../../../src/services/otp.service.js';
import {
  redisOtpRepository,
  redisTempRegisterToken,
} from '../../../src/repositories/redis.repository.js';
import { userRepository } from '../../../src/repositories/user.repository.js';
import { otpQueue } from '../../../src/jobs/queues/otp.queue.js';
import { UnauthorizedError } from '../../../src/utils/errors.js';
import bcrypt from 'bcrypt';
import { config } from '../../../src/config/env.config.js';

vi.mock('../../../src/jobs/queues/otp.queue.js');
vi.mock('../../../src/repositories/user.repository.js');

const SAMPLE_EMAIL = 'test@example.com';

const SAMPLE_REDIS_OTP_CACHE = (code: string, hashedCode: string) => ({
  code,
  hashedCode,
  expires_at: new Date(Date.now() + 60000),
});

describe('OTP Service', () => {
  beforeEach(async () => {
    // Clean Redis before each test
    await redisOtpRepository.consume(SAMPLE_EMAIL);
    await redisTempRegisterToken.consume(SAMPLE_EMAIL);
    vi.clearAllMocks();
  });

  describe('createOTP', () => {
    it('should queue OTP email when no cached OTP exists', async () => {
      const result = await otpService.createOTP({
        body: { email: SAMPLE_EMAIL },
      });

      expect(otpQueue.add).toHaveBeenCalledWith('register-otp', {
        email: SAMPLE_EMAIL,
      });
      expect(result).toBe(config.OTP_TTL_SECONDS);
    });

    it('should return remaining TTL when OTP already exists', async () => {
      const hashedCode = await bcrypt.hash('123456', 10);

      await redisOtpRepository.save(
        SAMPLE_EMAIL,
        SAMPLE_REDIS_OTP_CACHE('123456', hashedCode),
      );

      const result = await otpService.createOTP({
        body: { email: SAMPLE_EMAIL },
      });

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(60);
    });
  });

  describe('verifyOTP', () => {
    it('should throw error when OTP does not exist', async () => {
      await expect(
        otpService.verifyOTP({
          body: { email: SAMPLE_EMAIL, code: '123456' },
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error when OTP is incorrect', async () => {
      const hashedCode = await bcrypt.hash('123456', 10);

      await redisOtpRepository.save(
        SAMPLE_EMAIL,
        SAMPLE_REDIS_OTP_CACHE('123456', hashedCode),
      );

      await expect(
        otpService.verifyOTP({
          body: { email: SAMPLE_EMAIL, code: '999999' },
        }),
      ).rejects.toThrow('Invalid OTP');
    });

    it('should return temp_token for new users', async () => {
      const hashedCode = await bcrypt.hash('123456', 10);

      await redisOtpRepository.save(
        SAMPLE_EMAIL,
        SAMPLE_REDIS_OTP_CACHE('123456', hashedCode),
      );

      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      const result = await otpService.verifyOTP({
        body: { email: SAMPLE_EMAIL, code: '123456' },
      });

      expect(result).toHaveProperty('temp_token');
    });
  });
});

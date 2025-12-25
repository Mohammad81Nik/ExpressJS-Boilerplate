import { describe, it, beforeEach, expect, vi } from 'vitest';
import { redisClient } from '../../../src/infrastructure/redis/redis.client.js';
import { prisma } from '../../../src/lib/prisma.js';
import { authService } from '../../../src/services/auth.service.js';
import { redisOtpRepository } from '../../../src/repositories/redis.repository.js';
import { config } from '../../../src/config/env.config.js';
import { otpService } from '../../../src/services/otp.service.js';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../../../src/utils/errors.js';

const SAMPLE_EMAIL = 'test@gmail.com';
const SAMPLE_CODE = '123456';

describe('auth.service', () => {
  beforeEach(async () => {
    await redisClient.flushdb();
    await prisma.user.deleteMany();
  });

  describe('sendOTP', () => {
    it('should return OTP expiry time', async () => {
      const result = await authService.sendOTP({
        body: { email: SAMPLE_EMAIL },
      });

      expect(result.expires_at).toBe(config.OTP_TTL_SECONDS);
    });

    it('should not recreate OTP if one exists', async () => {
      await authService.sendOTP({ body: { email: SAMPLE_EMAIL } });
      const cached = await redisOtpRepository.exists(SAMPLE_EMAIL);

      await authService.sendOTP({ body: { email: SAMPLE_EMAIL } });
      const stillCached = await redisOtpRepository.exists(SAMPLE_EMAIL);

      expect(stillCached?.code).toBe(cached?.code);
    });
  });

  describe('verifyOTP', () => {
    it('should throw error for non-existent OTP', async () => {
      await expect(
        authService.verifyOTP({
          body: { email: SAMPLE_EMAIL, code: SAMPLE_CODE },
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error for invalid OTP code', async () => {
      const hashedCode = await bcrypt.hash(SAMPLE_CODE, 10);
      await redisOtpRepository.save(SAMPLE_EMAIL, {
        code: SAMPLE_CODE,
        hashedCode,
        expires_at: new Date(Date.now() + 60000),
      });

      await expect(
        authService.verifyOTP({
          body: { email: SAMPLE_EMAIL, code: '999999' },
        }),
      ).rejects.toThrow('Invalid OTP');
    });

    it('should return temp_token for new user', async () => {
      const hashedCode = await bcrypt.hash(SAMPLE_CODE, 10);
      await redisOtpRepository.save(SAMPLE_EMAIL, {
        code: SAMPLE_CODE,
        hashedCode,
        expires_at: new Date(Date.now() + 60000),
      });

      const result = await authService.verifyOTP({
        body: { email: SAMPLE_EMAIL, code: SAMPLE_CODE },
      });

      expect(result).toHaveProperty('temp_token');
      expect(typeof result.temp_token).toBe('string');
    });

    it('should return access token for existing user', async () => {
      await prisma.user.create({
        data: { name: 'Test User', email: SAMPLE_EMAIL },
      });

      const hashedCode = await bcrypt.hash(SAMPLE_CODE, 10);
      await redisOtpRepository.save(SAMPLE_EMAIL, {
        code: SAMPLE_CODE,
        hashedCode,
        expires_at: new Date(Date.now() + 60000),
      });

      const result = await authService.verifyOTP({
        body: { email: SAMPLE_EMAIL, code: SAMPLE_CODE },
      });

      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
    });
  });

  describe('register', () => {
    it('should create user and return access token', async () => {
      const token = await authService.register({
        name: 'Test User',
        email: SAMPLE_EMAIL,
      });

      expect(typeof token).toBe('string');

      const user = await prisma.user.findUnique({
        where: { email: SAMPLE_EMAIL },
      });

      expect(user).toBeDefined();
      expect(user?.name).toBe('Test User');
    });

    it('should throw error for duplicate email', async () => {
      await prisma.user.create({
        data: { name: 'Existing User', email: SAMPLE_EMAIL },
      });

      await expect(
        authService.register({
          name: 'Test User',
          email: SAMPLE_EMAIL,
        }),
      ).rejects.toThrow();
    });
  });
});

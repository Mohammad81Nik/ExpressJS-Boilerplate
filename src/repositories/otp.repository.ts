import { config } from '../config/env.config.js';
import { prisma } from '../lib/prisma.js';
import { generateOTP } from '../utils/otp.js';
import bcrypt from 'bcrypt';

export const otpRepository = {
  getOtpById(id: number) {
    return prisma.otp.findUnique({ where: { id } });
  },

  getOtpByEmail(email: string) {
    return prisma.otp.findUnique({ where: { email } });
  },

  async createOTP(email: string) {
    const code = generateOTP();

    const hashedCode = await bcrypt.hash(code, 10);

    const data = await prisma.otp.create({
      data: {
        email,
        code: hashedCode,
        expires_at: new Date(new Date().getTime() + config.OTP_TTL_MILLISECONDS),
      },
    });

    return {
      code,
      data,
    };
  },

  deleteOTP(id: number) {
    return prisma.otp.delete({ where: { id } });
  },
};

import { config } from '../config/env.config.js';
import { userRepository } from '../repositories/user.repository.js';
import { UnauthorizedError } from '../utils/errors.js';
import { jwtUtils } from '../utils/jwt.js';
import { SendOtpDTO, VerifyOtpDTO } from '../validation/otp.schema.js';
import { otpService } from './otp.service.js';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export const authService = {
  async sendOTP(data: SendOtpDTO) {
    const expires_at = await otpService.createOTP(data);

    return {
      expires_at,
    };
  },

  async verifyOTP(data: VerifyOtpDTO) {
    const dataObj = await otpService.verifyOTP(data);

    return dataObj;
  },

  async register({ name, email }: { name: string; email: string }) {
    try {
      const newUser = await userRepository.create({ name, email });

      const token = jwt.sign(
        jwtUtils.generatePayload({ scope: ['access'], data: newUser }),
        config.JWT_SECRET,
        {
          expiresIn: config.JWT_EXPIRY_TIME,
        },
      );

      return token;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw err;
    }
  },
};

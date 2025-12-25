import { userRepository } from '../repositories/user.repository.js';
import { UnauthorizedError } from '../utils/errors.js';
import { jwtUtils } from '../utils/jwt.js';
import { SendOtpDTO, VerifyOtpDTO } from '../validation/otp.schema.js';
import { otpService } from './otp.service.js';
import { JWTExpired, JWTInvalid } from 'jose/errors';

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
      const newUser = await userRepository.create({
        body: {
          name,
          email,
        },
      });

      const token = await jwtUtils.sign(
        jwtUtils.generatePayload({ scope: ['access'], data: newUser }),
      );

      return token;
    } catch (err) {
      if (err instanceof JWTExpired || err instanceof JWTInvalid) {
        throw new UnauthorizedError('Invalid token');
      }
      throw err;
    }
  },
};

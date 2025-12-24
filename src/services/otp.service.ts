import { config } from '../config/env.config.js';
import { otpQueue } from '../jobs/queues/otp.queue.js';
import {
  redisOtpRepository,
  redisTempRegisterToken,
} from '../repositories/redis.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { dateUtils } from '../utils/date.js';
import { UnauthorizedError } from '../utils/errors.js';
import { jwtUtils } from '../utils/jwt.js';
import { SendOtpDTO, VerifyOtpDTO } from '../validation/otp.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const otpService = {
  async createOTP(data: SendOtpDTO) {
    const { email } = data.body;

    const cachedData = await redisOtpRepository.exists(email);

    console.log(cachedData);

    if (!cachedData) {
      await otpQueue.add('register-otp', { email });

      return config.OTP_TTL_SECONDS;
    }

    return Number(
      ((new Date(cachedData.expires_at).getTime() - dateUtils.getTime()) / 1000).toFixed(
        0,
      ),
    );
  },

  async verifyOTP(data: VerifyOtpDTO) {
    const { email, code } = data.body;

    const cachedData = await redisOtpRepository.exists(email);

    if (!cachedData) {
      throw new UnauthorizedError("OTP has expired or doesn't exist");
    }

    const isOTPCorrect = await bcrypt.compare(code, cachedData.hashedCode);

    if (!isOTPCorrect) {
      throw new UnauthorizedError('Invalid OTP');
    }

    await redisOtpRepository.consume(email);

    const currentUser = await userRepository.getByEmail(email);

    if (!currentUser) {
      const temp_token = jwt.sign(
        jwtUtils.generatePayload({ scope: ['register'], data: { email } }),
        config.JWT_SECRET,
        {
          expiresIn: config.JWT_EXPIRY_TIME,
        },
      );

      await redisTempRegisterToken.save(email);

      return { temp_token };
    }

    const token = jwt.sign(
      jwtUtils.generatePayload({
        scope: ['access'],
        data: currentUser,
      }),
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY_TIME,
      },
    );

    return { token };
  },
};

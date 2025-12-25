import { SignJWT } from 'jose';
import { config } from '../config/env.config.js';
import { IGeneratePayloadArgs, IJWTPayload } from '../types/utils/jwt.js';

export const jwtUtils = {
  generatePayload(args: IGeneratePayloadArgs) {
    return {
      scope: args.scope,
      data: args.data,
      expires_at: config.JWT_EXPIRY_TIME,
    };
  },

  sign(payload: IJWTPayload) {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('my-app')
      .sign(config.JWT_SECRET);
  },
};

import { config } from '../config/env.config.js';
import { IGeneratePayloadArgs } from '../types/utils/jwt.js';

export const jwtUtils = {
  generatePayload(args: IGeneratePayloadArgs) {
    return {
      scope: args.scope,
      data: args.data,
      expires_at: config.JWT_EXPIRY_TIME,
    };
  },
};

import { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { IJWTPayload, TTokenScopes } from '../types/utils/jwt.js';
import { config } from '../config/env.config.js';
import { redisTempRegisterToken } from '../repositories/redis.repository.js';
import { User } from '../generated/prisma/client.js';
import { jwtVerify } from 'jose';
import { JWTInvalid, JWTExpired } from 'jose/errors';

const setToken: (key: 'temp_token' | 'token') => RequestHandler =
  (key) => (req, _res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      req[key] = authorization.split(' ')[1];
    } else {
      req[key] = '';
    }

    next();
  };

const validateToken: (scope: TTokenScopes) => RequestHandler =
  (scope) => async (req, _res, next) => {
    const token = req[`${scope === 'access' ? 'token' : 'temp_token'}`];

    if (!token) {
      throw new UnauthorizedError('Unauthorized');
    }

    try {
      const { payload } = await jwtVerify<IJWTPayload>(token, config.JWT_SECRET, {
        issuer: 'my-app',
      });

      if (!payload.scope.includes(scope)) {
        throw new ForbiddenError('Forbidden');
      }

      if (payload.scope.includes('access')) {
        req.user = payload.data as User;
      }

      if (payload.scope.includes('register')) {
        const email = payload.data.email as string;

        const isValid = await redisTempRegisterToken.exists(email);

        if (!isValid) {
          throw new UnauthorizedError('Unauthorized');
        }

        await redisTempRegisterToken.consume(email);

        req.email = email;
      }

      next();
    } catch (err) {
      if (err instanceof JWTInvalid || err instanceof JWTExpired) {
        throw new UnauthorizedError('Unauthorized');
      }

      throw err;
    }
  };

export { validateToken, setToken };

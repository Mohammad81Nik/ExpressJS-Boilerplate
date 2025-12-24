import { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { IJWTPayload, TTokenScopes } from '../types/utils/jwt.js';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { User } from '../../generated/prisma/client.js';
import { redisTempRegisterToken } from '../repositories/redis.repository.js';

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
      const jwtPayload = jwt.verify(token, config.JWT_SECRET, { complete: true });

      const rawPayload = jwtPayload.payload as IJWTPayload;

      if (!rawPayload.scope.includes(scope)) {
        throw new ForbiddenError('Forbidden');
      }

      if (rawPayload.scope.includes('access')) {
        req.user = rawPayload.data as User;
      }

      if (rawPayload.scope.includes('register')) {
        const email = rawPayload.data.email as string;

        const isValid = await redisTempRegisterToken.exists(email);

        if (!isValid) {
          throw new UnauthorizedError('Unauthorized');
        }

        await redisTempRegisterToken.consume(email);

        req.email = email;
      }

      next();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedError('Unauthorized');
      }

      throw err;
    }
  };

export { validateToken, setToken };

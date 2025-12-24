import * as express from 'express';
import { output } from 'zod';
import { User } from '../../../generated/prisma/client.ts';

declare global {
  namespace Express {
    interface Request {
      validated?: output<T>;

      // user & email
      user?: User;
      email?: string;

      // tokens:
      temp_token?: string;
      token?: string;
    }
  }
}

export {};

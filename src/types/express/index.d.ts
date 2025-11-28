import * as express from 'express';
import { output } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated?: output<T>;
    }
  }
}

export {};

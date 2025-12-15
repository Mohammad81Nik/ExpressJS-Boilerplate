import { AppError } from '../utils/errors.js';
import type { ErrorRequestHandler, RequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: err.stack,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }

  return next();
};

const notFoundMiddleware: RequestHandler = (_req, res, _next) => {
  return res.status(404).json({
    message: 'Intended Resource was not found',
  });
};

export { notFoundMiddleware, errorMiddleware };

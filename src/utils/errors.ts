class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export { AppError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError };

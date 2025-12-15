import type { RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';

const validateMiddleware: <T extends ZodType>(schema: T) => RequestHandler = (schema) => {
  return (req, res, next) => {
    try {
      const parsedSchema = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.validated = parsedSchema;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({
          message: 'validation error',
          errors: err.issues.reduce(
            (acc, curr) => {
              const path = curr.path[1] as string;

              acc[path] = [curr.message];

              return acc;
            },
            {} as Record<string, string[]>,
          ),
        });
      }

      next(err);
    }
  };
};

export { validateMiddleware };

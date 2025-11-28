import { fooService } from '@services/foo.service';
import type { CreateFooDTO } from '@validation/foo.schema';
import type { RequestHandler } from 'express';

export const createFooController: RequestHandler = (req, res) => {
  const data: CreateFooDTO = req.validated;
  const result = fooService.create(data.body);

  res.status(201).json({
    message: 'foo created',
    data: result,
  });
};

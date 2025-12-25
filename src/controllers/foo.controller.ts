import { fooService } from '../services/foo.service.js';
import type { RequestHandler } from 'express';

export const createFoo: RequestHandler = async (req, res) => {
  const result = await fooService.create(req.validated);
  res.status(201).json({ data: result });
};

import { Router } from 'express';
import { validateMiddleware } from '../middleware/validation.middleware.js';
import { createFooSchema } from '../validation/foo.schema.js';
import { createFoo } from '../controllers/foo.controller.js';

const router = Router();

router.post('/', validateMiddleware(createFooSchema), createFoo);

export default router;

import { Router } from 'express';
import { validateMiddleware } from '@middleware/validation.middleware';
import { createFooSchema } from '@validation/foo.schema';
import { createFooController } from '@controllers/foo.controller';

const router = Router();

router.post('/', validateMiddleware(createFooSchema), createFooController);

export default router;

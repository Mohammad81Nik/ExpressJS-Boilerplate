import { Router } from 'express';
import { validateMiddleware } from '../middleware/validation.middleware.js';
import { createUserSchema } from '../validation/user.schema.js';
// import { createUser } from '../controllers/user.controller.js';

const router = Router();

// router.post('/', validateMiddleware(createUserSchema), createUser);

export default router;

import { Router } from 'express';
import { validateMiddleware } from '../middleware/validation.middleware.js';
import { register, sendOTP, verifyOTP } from '../controllers/auth.controller.js';
import { sendOTPSchema, verifyOTPSchema } from '../validation/otp.schema.js';
import { registerSchema } from '../validation/auth.schema.js';
import { setToken, validateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/send-otp', validateMiddleware(sendOTPSchema), sendOTP);

router.post('/verify-otp', validateMiddleware(verifyOTPSchema), verifyOTP);

router.post(
  '/register',
  setToken('temp_token'),
  validateToken('register'),
  validateMiddleware(registerSchema),
  register,
);

export default router;

import { createTransport } from 'nodemailer';
import { config } from './env.config.js';

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: config.OTP_EMAIL,
    pass: config.OTP_EMAIL_PASS,
  },
});

export { transport };

import { Queue } from 'bullmq';
import { bullConnection } from '../../infrastructure/bullmq/connection.js';

const otpQueue = new Queue('otp-queue', { connection: bullConnection });

export { otpQueue };

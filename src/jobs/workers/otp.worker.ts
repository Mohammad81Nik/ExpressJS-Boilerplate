import { Worker } from 'bullmq';
import { generateOTP } from '../../utils/otp.js';
import bcrypt from 'bcrypt';
import { config } from '../../config/env.config.js';
import { transport } from '../../config/mailer.config.js';
import { bullConnection } from '../../infrastructure/bullmq/connection.js';
import { redisOtpRepository } from '../../repositories/redis.repository.js';
import { dateUtils } from '../../utils/date.js';

const worker = new Worker<{ email: string }>(
  'otp-queue',
  async (job) => {
    const code = generateOTP();

    const hashedCode = await bcrypt.hash(code, 10);

    await redisOtpRepository.save(job.data.email, {
      code,
      hashedCode,
      expires_at: new Date(dateUtils.getTime() + config.OTP_TTL_MILLISECONDS),
    });

    await transport.sendMail({
      to: job.data.email,
      subject: 'OTP Code',
      text: `${code}`,
      html: `<b>${code}</b>`,
    });
  },
  { connection: bullConnection },
);

worker.on('failed', (job, error) => {
  console.log('Job failed', job?.name, ', error: ', error);
});

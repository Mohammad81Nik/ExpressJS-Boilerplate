import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { otpQueue } from '../jobs/queues/otp.queue.js';

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');

const bullboard = createBullBoard({
  queues: [new BullMQAdapter(otpQueue)],
  serverAdapter,
});

export { bullboard, serverAdapter };

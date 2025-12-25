import { createServer } from 'http';
import app from './app/index.js';
import { config } from './config/env.config.js';
import './jobs/workers/otp.worker.js';

const server = createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}...`);
});

import { createServer } from 'http';
import app from './app/index';
import { config } from '@config/env.config';

const server = createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}...`);
});

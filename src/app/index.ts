import express from 'express';
import cors from 'cors';
import { config } from '../config/env.config.js';
import { errorMiddleware, notFoundMiddleware } from '../middleware/errors.middleware.js';
import fooRouter from '../routes/foo.router.js';
import authRouter from '../routes/auth.router.js';
import { expressLogger } from 'custom-logger-middleware';
import { serverAdapter } from '../config/bullboard.config.js';

const app = express();

app.use(express.json());

app.use(expressLogger());

app.use(cors({ origin: config.ORIGINS }));

app.use('/admin/queues', serverAdapter.getRouter());

app.use('/foo', fooRouter);

app.use('/auth', authRouter);

app.use(errorMiddleware);

app.use(notFoundMiddleware);

export default app;

import express from 'express';
import cors from 'cors';
import { config } from '@config/env.config';
import { errorMiddleware, notFoundMiddleware } from '@middleware/errors.middleware';
import fooRouter from '@routes/foo.router';
import { expressLogger } from 'custom-logger-middleware';

const app = express();

app.use(express.json());

app.use(expressLogger());

app.use(cors({ origin: config.ORIGINS }));

app.use('/foo', fooRouter);

app.use(errorMiddleware);

app.use(notFoundMiddleware);

export default app;

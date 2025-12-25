import { PrismaPg } from '@prisma/adapter-pg';

import { config } from '../config/env.config.js';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: config.DATABASE_CONNECTION_STRING });

const prisma = new PrismaClient({ adapter }) as PrismaClient;

export { prisma };

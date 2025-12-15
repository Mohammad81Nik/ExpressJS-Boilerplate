import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../src/app/index.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('POST /foo', () => {
  beforeEach(async () => {
    await prisma.foo.deleteMany();
  });

  it('should create foo', async () => {
    const res = await request(app)
      .post('/foo')
      .send({
        /* add fields */
      })
      .expect(201);

    expect(res.body.data).toMatchObject({ id: expect.any(Number) });
  });

  it('should return 422 for invalid data', async () => {
    const res = await request(app).post('/foo').send({}).expect(422);

    expect(res.body.message).toBe('validation error');
  });
});

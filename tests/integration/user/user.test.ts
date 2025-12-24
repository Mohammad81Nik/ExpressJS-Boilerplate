import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../src/app/index.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('POST /user', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create user', async () => {
    const res = await request(app)
      .post('/user')
      .send({
        /* add fields */
      })
      .expect(201);

    expect(res.body.data).toMatchObject({ id: expect.any(Number) });
  });

  it('should return 422 for invalid data', async () => {
    const res = await request(app).post('/user').send({}).expect(422);

    expect(res.body.message).toBe('validation error');
  });
});

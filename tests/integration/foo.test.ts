import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../src/app/index';

describe('POST /foo', () => {
  it('should create foo data', async () => {
    const res = await request(app).post('/foo').send({ name: 'foo' }).expect(201);

    expect(res.body).toEqual({
      message: 'foo created',
      data: {
        id: expect.any(Number),
        name: 'foo',
      },
    });
  });

  it('should return a 422 error response', async () => {
    const res1 = await request(app).post('/foo').send({}).expect(422);
    const res2 = await request(app).post('/foo').send({ foo: 'bar' }).expect(422);
    const res3 = await request(app).post('/foo').send({ name: 1 }).expect(422);

    const jsonBody = {
      message: 'validation error',
      errors: {
        name: expect.any(Array),
      },
    };

    expect(res1.body).toEqual(jsonBody);
    expect(res2.body).toEqual(jsonBody);
    expect(res3.body).toEqual(jsonBody);
  });
});

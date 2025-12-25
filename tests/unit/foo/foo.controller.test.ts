import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFoo } from '../../../src/controllers/foo.controller.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('foo.controller', () => {
  beforeEach(async () => {
    await prisma.foo.deleteMany();
  });

  it('should create foo and return 201', async () => {
    const req: any = {
      validated: {
        body: {
          /* add fields */
          foo: 'bar',
        },
      },
    };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next: any = vi.fn();

    await createFoo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: expect.any(Number) }),
    });
  });
});

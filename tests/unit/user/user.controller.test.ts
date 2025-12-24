import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser } from '../../../src/controllers/user.controller.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('user.controller', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create user and return 201', async () => {
    const req: any = {
      validated: {
        body: {
          /* add fields */
        },
      },
    };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next: any = vi.fn();

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: expect.any(Number) }),
    });
  });
});

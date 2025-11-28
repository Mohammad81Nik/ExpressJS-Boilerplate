import { describe, expect, it, vi } from 'vitest';
import { createFooController } from '../../src/controllers/foo.controller';

describe('foo.controller', () => {
  it('returns foo created json', () => {
    const res: any = { json: vi.fn(), status: vi.fn().mockReturnThis() };
    const req: any = {
      validated: {
        body: {
          name: 'foo',
        },
      },
    };
    const next: any = vi.fn();

    createFooController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      message: 'foo created',
      data: {
        id: expect.any(Number),
        name: req.validated.body.name,
      },
    });
  });
});

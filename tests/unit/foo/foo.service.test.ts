import { describe, it, expect, beforeEach } from 'vitest';
import { fooService } from '../../../src/services/foo.service.js';
import { prisma } from '../../../src/lib/prisma.js';
import { NotFoundError } from '../../../src/utils/errors.js';

describe('foo.service', () => {
  beforeEach(async () => {
    await prisma.foo.deleteMany();
  });

  it('should create foo', async () => {
    const data = {
      /* add fields */
      foo: 'bar',
    };
    const result = await fooService.create({ body: data });

    expect(result).toMatchObject(data);
  });

  it('should get all foos', async () => {
    await fooService.create({
      /* fields */
      body: {
        foo: 'bar',
      },
    });
    await fooService.create({
      /* fields */
      body: {
        foo: 'bar',
      },
    });

    const result = await fooService.getAll();

    expect(result).toHaveLength(2);
  });

  it('should throw NotFoundError when foo not found', async () => {
    await expect(fooService.getById(999)).rejects.toThrow(NotFoundError);
  });
});

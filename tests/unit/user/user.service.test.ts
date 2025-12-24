import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../../../src/services/user.service.js';
import { prisma } from '../../../src/lib/prisma.js';
import { NotFoundError } from '../../../src/utils/errors.js';

describe('user.service', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create user', async () => {
    const data = {
      /* add fields */
      foo: 'bar',
    };
    const result = await userService.create({ body: data });

    expect(result).toMatchObject(data);
  });

  it('should get all users', async () => {
    await userService.create({
      /* fields */
      body: {
        foo: 'bar',
      },
    });
    await userService.create({
      /* fields */
      body: {
        foo: 'bar',
      },
    });

    const result = await userService.getAll();

    expect(result).toHaveLength(2);
  });

  it('should throw NotFoundError when user not found', async () => {
    await expect(userService.getById(999)).rejects.toThrow(NotFoundError);
  });
});

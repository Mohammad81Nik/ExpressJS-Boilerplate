import { describe, it, expect, beforeEach } from 'vitest';
import { userRepository } from '../../../src/repositories/user.repository.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('user.repository', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create user', async () => {
    const data = {
      /* add fields */
      foo: 'bar',
    };
    const result = await userRepository.create({ body: data });

    expect(result).toMatchObject(data);
  });

  it('should find user by id', async () => {
    const created = await userRepository.create({
      /* fields */
      body: {
        foo: 'bar',
      },
    });
    const found = await userRepository.findById(created.id);

    expect(found).toEqual(created);
  });

  it('should return null when user not found', async () => {
    const result = await userRepository.findById(999);
    expect(result).toBeNull();
  });
});

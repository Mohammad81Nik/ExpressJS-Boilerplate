import { describe, it, expect, beforeEach } from 'vitest';
import { fooRepository } from '../../../src/repositories/foo.repository.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('foo.repository', () => {
  beforeEach(async () => {
    await prisma.foo.deleteMany();
  });

  it('should create foo', async () => {
    const data = {
      /* add fields */
      foo: 'bar',
    };
    const result = await fooRepository.create({ body: data });

    expect(result).toMatchObject(data);
  });

  it('should find foo by id', async () => {
    const created = await fooRepository.create({
      /* fields */
      body: {
        foo: 'bar',
      },
    });
    const found = await fooRepository.findById(created.id);

    expect(found).toEqual(created);
  });

  it('should return null when foo not found', async () => {
    const result = await fooRepository.findById(999);
    expect(result).toBeNull();
  });
});

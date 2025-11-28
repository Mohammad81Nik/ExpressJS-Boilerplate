import { describe, expect, it } from 'vitest';
import { fooService } from '../../src/services/foo.service';

describe('foo.service', () => {
  it('should create a foo', () => {
    const foo = fooService.create({ name: 'bar' });

    expect(foo).toEqual({
      id: expect.any(Number),
      name: 'bar',
    });
  });
});

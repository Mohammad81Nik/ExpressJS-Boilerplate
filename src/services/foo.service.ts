import { fooRepository } from '../repositories/foo.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateFooDTO } from '../validation/foo.schema.js';

export const fooService = {
  async getAll() {
    return fooRepository.findMany();
  },

  async getById(id: number) {
    const item = await fooRepository.findById(id);
    if (!item) throw new NotFoundError('Foo not found');
    return item;
  },

  async create(data: CreateFooDTO) {
    return fooRepository.create(data);
  },
};

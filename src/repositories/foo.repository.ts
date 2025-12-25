import { prisma } from '../lib/prisma.js';
import { CreateFooDTO } from '../validation/foo.schema.js';

export const fooRepository = {
  findMany() {
    return prisma.foo.findMany();
  },

  findById(id: number) {
    return prisma.foo.findUnique({ where: { id } });
  },

  create(data: CreateFooDTO) {
    return prisma.foo.create({ data: data.body });
  },
};

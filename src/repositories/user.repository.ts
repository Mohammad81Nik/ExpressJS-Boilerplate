import { prisma } from '../lib/prisma.js';
import { CreateUserDTO } from '../validation/user.schema.js';

export const userRepository = {
  getById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  getByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  getAll() {
    return prisma.user.findMany();
  },

  create(data: CreateUserDTO) {
    return prisma.user.create({ data });
  },
};

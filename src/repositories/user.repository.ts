import { prisma } from '../lib/prisma.js';
import { CreateUserDTO } from '../validation/user.schema.js';

export const userRepository = {
  findMany() {
    return prisma.user.findMany();
  },

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  create(data: CreateUserDTO) {
    return prisma.user.create({ data: { ...data.body } });
  },
};

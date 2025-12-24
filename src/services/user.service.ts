import { userRepository } from '../repositories/user.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { CreateUserDTO } from '../validation/user.schema.js';

export const userService = {
  async getAll() {
    return userRepository.getAll();
  },

  async getById(id: number) {
    const user = await userRepository.getById(id);

    if (!user) throw new NotFoundError('User not found');

    return user;
  },

  async getByEmail(email: string) {
    const user = await userRepository.getByEmail(email);

    if (!user) throw new NotFoundError('User not found');

    return user;
  },

  async create(data: CreateUserDTO) {
    const user = await userRepository.getByEmail(data.email);

    if (user) {
      throw new BadRequestError('Email already exists');
    }

    return userRepository.create(data);
  },
};

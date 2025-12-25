import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

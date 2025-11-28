import { z } from 'zod';

export const createFooSchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
});

export type CreateFooDTO = z.infer<typeof createFooSchema>;

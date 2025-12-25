import { z } from 'zod';

export const createFooSchema = z.object({
  body: z.object({
    // Add your fields here
    foo: z.string(),
  }),
});

export type CreateFooDTO = z.infer<typeof createFooSchema>;

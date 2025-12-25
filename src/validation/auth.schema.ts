import z from 'zod';

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

type RegisterDTO = z.infer<typeof registerSchema>;

export { registerSchema };

export type { RegisterDTO };

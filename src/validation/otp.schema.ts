import z from 'zod';

const sendOTPSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

const verifyOTPSchema = z.object({
  body: z.object({
    email: z.email(),
    code: z.string().min(6).max(6),
  }),
});

type SendOtpDTO = z.infer<typeof sendOTPSchema>;
type VerifyOtpDTO = z.infer<typeof verifyOTPSchema>;

export { sendOTPSchema, verifyOTPSchema };

export type { SendOtpDTO, VerifyOtpDTO };

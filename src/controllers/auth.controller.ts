import { RequestHandler } from 'express';
import { authService } from '../services/auth.service.js';
import { SendOtpDTO, VerifyOtpDTO } from '../validation/otp.schema.js';
import { RegisterDTO } from '../validation/auth.schema.js';

const sendOTP: RequestHandler = async (req, res) => {
  try {
    const data = req.validated as SendOtpDTO;
    const { expires_at } = await authService.sendOTP(data);

    return res.status(201).json({
      message: 'OTP has sent to your email',
      data: {
        expires_at,
      },
    });
  } catch (err) {
    throw err;
  }
};

const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const data = req.validated as VerifyOtpDTO;

    const tokenData = await authService.verifyOTP(data);

    return res.status(200).json({
      message: 'OTP successfully verified',
      data: tokenData,
    });
  } catch (err) {
    throw err;
  }
};

const register: RequestHandler = async (req, res) => {
  try {
    const data = req.validated as RegisterDTO;

    const email = req.email!;

    const token = await authService.register({ name: data.body.name, email });

    return res.status(200).json({
      message: 'success',
      data: {
        token,
      },
    });
  } catch (err) {
    throw err;
  }
};

export { sendOTP, verifyOTP, register };

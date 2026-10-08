import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.login(req.body);
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
};

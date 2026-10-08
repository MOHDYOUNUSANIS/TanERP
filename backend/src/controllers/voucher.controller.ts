import { Request, Response } from 'express';
import { VoucherService } from '../services/voucher.service';

export const VoucherController = {
  async create(req: Request, res: Response) {
    try {
      const voucher = await VoucherService.createVoucher(req.body);
      res.status(201).json(voucher);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const vouchers = await VoucherService.getAllVouchers();
      res.status(200).json(vouchers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

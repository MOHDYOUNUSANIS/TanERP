import { Request, Response } from 'express';
import { LedgerService } from '../services/ledger.service';

export const AccountController = {
  async create(req: Request, res: Response) {
    try {
      const account = await LedgerService.createAccount(req.body);
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const accounts = await LedgerService.getAccountsWithBalances();
      res.status(200).json(accounts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

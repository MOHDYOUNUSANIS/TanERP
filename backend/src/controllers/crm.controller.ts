import { Request, Response } from 'express';
import { CrmService } from '../services/crm.service';

export const CrmController = {
  async createSupplier(req: Request, res: Response) {
    try {
      const result = await CrmService.createSupplier(req.body);
      res.status(201).json(result);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
  },
  async getSuppliers(req: Request, res: Response) {
    try {
      const result = await CrmService.getSuppliers();
      res.status(200).json(result);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
  },
  async createCustomer(req: Request, res: Response) {
    try {
      const result = await CrmService.createCustomer(req.body);
      res.status(201).json(result);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
  },
  async getCustomers(req: Request, res: Response) {
    try {
      const result = await CrmService.getCustomers();
      res.status(200).json(result);
    } catch (e: any) { res.status(400).json({ message: e.message }); }
  }
};

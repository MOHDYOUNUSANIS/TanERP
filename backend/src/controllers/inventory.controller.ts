import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

export const InventoryController = {
  async createChemical(req: Request, res: Response) {
    try {
      const result = await InventoryService.createChemical(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async getAllChemicals(req: Request, res: Response) {
    try {
      const result = await InventoryService.getAllChemicals();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async issueChemical(req: Request, res: Response) {
    try {
      const { lotId, chemicalId, qtyIssued } = req.body;
      const result = await InventoryService.issueChemical(lotId, chemicalId, qtyIssued);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
};

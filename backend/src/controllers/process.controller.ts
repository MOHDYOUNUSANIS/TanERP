import { Request, Response } from 'express';
import { ProcessService } from '../services/process.service';

export const ProcessController = {
  async createDrum(req: Request, res: Response) {
    try {
      const result = await ProcessService.createDrum(req.body);
      res.status(201).json(result);
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  },
  async getAllDrums(req: Request, res: Response) {
    try {
      const result = await ProcessService.getAllDrums();
      res.status(200).json(result);
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  },
  async createLot(req: Request, res: Response) {
    try {
      const result = await ProcessService.createLot(req.body);
      res.status(201).json(result);
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  },
  async getAllLots(req: Request, res: Response) {
    try {
      const result = await ProcessService.getAllLots();
      res.status(200).json(result);
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  },
  async allocateDrum(req: Request, res: Response) {
    try {
      const { drumId, lotId } = req.body;
      const result = await ProcessService.allocateDrumToLot(drumId, lotId);
      res.status(201).json(result);
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  },
  async releaseDrum(req: Request, res: Response) {
    try {
      const { allocationId } = req.body;
      const result = await ProcessService.releaseDrum(allocationId);
      res.status(200).json(result);
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  }
};

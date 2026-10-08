import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import voucherRoutes from './routes/voucher.routes';
import inventoryRoutes from './routes/inventory.routes';
import processRoutes from './routes/process.routes';
import crmRoutes from './routes/crm.routes';

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'TanERP Backend is running' });
});

// Domain routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/process', processRoutes);
app.use('/api/crm', crmRoutes);

// Basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;

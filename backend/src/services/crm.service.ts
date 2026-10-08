import prisma from '../config/database';

export const CrmService = {
  // Suppliers
  async createSupplier(data: { name: string; contact?: string; address?: string }) {
    return prisma.supplier.create({ data });
  },
  async getSuppliers() {
    return prisma.supplier.findMany();
  },

  // Customers
  async createCustomer(data: { name: string; contact?: string; address?: string }) {
    return prisma.customer.create({ data });
  },
  async getCustomers() {
    return prisma.customer.findMany();
  }
};

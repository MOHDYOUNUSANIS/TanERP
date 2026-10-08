import prisma from '../config/database';

export const InventoryService = {
  async createChemical(data: any) {
    return prisma.chemical.create({ data });
  },

  async getAllChemicals() {
    return prisma.chemical.findMany();
  },

  async issueChemical(lotId: number, chemicalId: number, qtyIssued: number) {
    return prisma.$transaction(async (tx) => {
      const chemical = await tx.chemical.findUnique({ where: { id: chemicalId } });
      if (!chemical || chemical.stockQty < qtyIssued) {
        throw new Error(`Insufficient stock for chemical ID: ${chemicalId}. Current stock: ${chemical?.stockQty || 0}`);
      }

      // Deduct stock in real-time
      await tx.chemical.update({
        where: { id: chemicalId },
        data: { stockQty: { decrement: qtyIssued } }
      });

      // Log the chemical issue against the lot
      return tx.chemicalIssue.create({
        data: { lotId, chemicalId, qtyIssued }
      });
    });
  }
};

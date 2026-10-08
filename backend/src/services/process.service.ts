import prisma from '../config/database';

export const ProcessService = {
  // -- DRUM REGISTRY --
  async createDrum(data: any) {
    return prisma.drum.create({ data });
  },
  async getAllDrums() {
    return prisma.drum.findMany();
  },

  // -- PRODUCTION LOTS --
  async createLot(data: any) {
    return prisma.lot.create({ data });
  },
  async getAllLots() {
    return prisma.lot.findMany({
      include: { 
        allocations: { include: { drum: true } }, 
        issues: { include: { chemical: true } }
      }
    });
  },

  // -- ALLOCATIONS --
  async allocateDrumToLot(drumId: number, lotId: number) {
    return prisma.$transaction(async (tx) => {
      const drum = await tx.drum.findUnique({ where: { id: drumId } });
      if (!drum || drum.status !== 'EMPTY') {
        throw new Error('Drum is either not found or not EMPTY and available for allocation');
      }

      // Lock drum as IN_USE
      await tx.drum.update({
        where: { id: drumId },
        data: { status: 'IN_USE' }
      });

      return tx.drumAllocation.create({
        data: { drumId, lotId }
      });
    });
  },

  async releaseDrum(allocationId: number) {
    return prisma.$transaction(async (tx) => {
      const allocation = await tx.drumAllocation.findUnique({ where: { id: allocationId } });
      if (!allocation || allocation.releasedAt) throw new Error('Allocation not found or already released');

      // Set drum to CLEANING state after release
      await tx.drum.update({
        where: { id: allocation.drumId },
        data: { status: 'CLEANING' }
      });

      return tx.drumAllocation.update({
        where: { id: allocationId },
        data: { releasedAt: new Date() }
      });
    });
  }
};

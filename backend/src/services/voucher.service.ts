import prisma from '../config/database';

export const VoucherService = {
  async createVoucher(data: {
    voucherNo: string;
    type: any;
    date?: Date;
    amount: number;
    description?: string;
    entries: { accountId: number; debit: number; credit: number }[];
  }) {
    // 1. Verify Double Entry Principle (Total Debit == Total Credit)
    const totalDebit = data.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = data.entries.reduce((sum, entry) => sum + entry.credit, 0);
    
    if (totalDebit !== totalCredit) {
      throw new Error('Double entry mismatch: Total Debit must equal Total Credit');
    }

    if (totalDebit !== data.amount) {
      throw new Error('Voucher amount does not match ledger entries');
    }

    // 2. Create Voucher and Ledger Entries in a single Transaction
    const voucher = await prisma.$transaction(async (tx) => {
      return await tx.voucher.create({
        data: {
          voucherNo: data.voucherNo,
          type: data.type,
          amount: data.amount,
          description: data.description,
          date: data.date || new Date(),
          entries: {
            create: data.entries.map(entry => ({
              accountId: entry.accountId,
              debit: entry.debit,
              credit: entry.credit
            }))
          }
        },
        include: { entries: true }
      });
    });

    return voucher;
  },

  async getAllVouchers() {
    return prisma.voucher.findMany({
      include: {
        entries: {
          include: { account: true }
        }
      },
      orderBy: { date: 'desc' }
    });
  }
};

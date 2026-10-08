import prisma from '../config/database';

export const LedgerService = {
  // Create a new account in the chart of accounts
  async createAccount(data: { code: string; name: string; type: any }) {
    return prisma.account.create({ data });
  },

  // Get all accounts with their current balances
  async getAccountsWithBalances() {
    const accounts = await prisma.account.findMany({
      include: { entries: true },
    });

    // Calculate balance (Simplified: Debit - Credit for ASSET/EXPENSE, Credit - Debit for LIABILITY/EQUITY/REVENUE)
    return accounts.map(acc => {
      const debitSum = acc.entries.reduce((sum, entry) => sum + entry.debit, 0);
      const creditSum = acc.entries.reduce((sum, entry) => sum + entry.credit, 0);
      let balance = 0;
      
      if (['ASSET', 'EXPENSE'].includes(acc.type)) {
        balance = debitSum - creditSum;
      } else {
        balance = creditSum - debitSum;
      }

      return {
        ...acc,
        balance
      };
    });
  }
};

"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { formatINR } from '../../../lib/constants';
import { FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  const getDebitCredit = (acc: any) => {
    const isDebitNormal = acc.type === 'ASSET' || acc.type === 'EXPENSE';
    let debit = 0;
    let credit = 0;

    if (isDebitNormal) {
      if (acc.balance >= 0) debit = acc.balance;
      else credit = -acc.balance;
    } else {
      if (acc.balance >= 0) credit = acc.balance;
      else debit = -acc.balance;
    }
    return { debit, credit };
  };

  const trialBalanceRows = accounts.map(acc => {
    const { debit, credit } = getDebitCredit(acc);
    return { ...acc, debit, credit };
  });

  const totalDebit = trialBalanceRows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = trialBalanceRows.reduce((sum, r) => sum + r.credit, 0);

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Loading Report...</div>;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Financial Reports</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Real-time ledger analytics</p>
        </div>
        <button className="flex items-center bg-[#1E293B] border border-[#334155] text-[#F8FAFC] hover:bg-[#334155] px-4 py-2 rounded-lg font-medium shadow-sm transition-all">
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-[#334155] overflow-hidden">
        <div className="p-6 border-b border-[#334155] bg-[#0F172A]/50 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-[#38BDF8] mr-3" />
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">Trial Balance</h2>
              <p className="text-sm text-[#94A3B8] mt-0.5">As of {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${
              totalDebit.toFixed(2) === totalCredit.toFixed(2) 
              ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20' 
              : 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20'
            }`}>
              {totalDebit.toFixed(2) === totalCredit.toFixed(2) ? 'Books Balanced ✓' : 'Books Unbalanced ⚠'}
            </span>
          </div>
        </div>

        <table className="w-full text-left border-collapse font-mono">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
              <th className="px-6 py-4 font-bold">Account Code</th>
              <th className="px-6 py-4 font-bold font-sans">Account Name</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold text-right text-[#34D399]">Debit (DR)</th>
              <th className="px-6 py-4 font-bold text-right text-[#F87171]">Credit (CR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/50 text-sm">
            {trialBalanceRows.map(row => (
              <tr key={row.id} className="hover:bg-[#334155]/30 transition-colors">
                <td className="px-6 py-4 text-[#94A3B8]">{row.code}</td>
                <td className="px-6 py-4 font-bold text-[#F8FAFC] font-sans">{row.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#334155]/50 text-[#94A3B8]">
                    {row.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#34D399]">
                  {row.debit > 0 ? formatINR(row.debit) : '-'}
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#F87171]">
                  {row.credit > 0 ? formatINR(row.credit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#0F172A] border-t-2 border-[#334155] font-bold text-[#F8FAFC]">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right font-sans uppercase tracking-wider text-[#94A3B8] text-xs">Totals:</td>
              <td className="px-6 py-4 text-right border-double border-b-4 border-[#34D399]/50 text-[#34D399]">
                {formatINR(totalDebit)}
              </td>
              <td className="px-6 py-4 text-right border-double border-b-4 border-[#F87171]/50 text-[#F87171]">
                {formatINR(totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

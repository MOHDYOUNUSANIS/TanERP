"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { formatINR } from '../../../lib/constants';
import { Plus, Search, ChevronDown, ChevronRight, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const res = await api.get('/vouchers');
        setVouchers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchVouchers();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto p-4 animate-pulse">
        <div className="h-10 bg-[#1E293B] rounded w-64 mb-8"></div>
        <div className="h-96 bg-[#1E293B] rounded-xl border border-[#334155]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Daybook & Vouchers</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Tally-Style Split Ledger View</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <input 
              type="text" 
              placeholder="Filter by Vch No. or Date..." 
              className="pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] text-sm transition-colors w-64"
            />
          </div>
          <button className="flex items-center bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#38BDF8]/20 transition-all">
            <Plus className="w-4 h-4 mr-2" /> New Voucher <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono">Alt+V</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
                <th className="px-5 py-4 font-bold w-10"></th>
                <th className="px-5 py-4 font-bold">Date</th>
                <th className="px-5 py-4 font-bold">Particulars</th>
                <th className="px-5 py-4 font-bold">Vch Type</th>
                <th className="px-5 py-4 font-bold">Vch No.</th>
                <th className="px-5 py-4 font-bold text-right text-[#34D399]">Debit (Dr)</th>
                <th className="px-5 py-4 font-bold text-right text-[#F87171]">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50 text-sm">
              {vouchers.length > 0 ? vouchers.map((v) => (
                <React.Fragment key={v.id}>
                  {/* Master Row */}
                  <tr 
                    onClick={() => toggleExpand(v.id)}
                    className="hover:bg-[#334155]/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-4">
                      {expandedId === v.id ? 
                        <ChevronDown className="w-4 h-4 text-[#38BDF8]" /> : 
                        <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC]" />
                      }
                    </td>
                    <td className="px-5 py-4 text-[#F8FAFC]">{new Date(v.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-5 py-4 font-bold text-[#38BDF8]">As per details</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        v.type === 'RECEIPT' ? 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20' : 
                        v.type === 'PAYMENT' ? 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20' :
                        'bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/20'
                      }`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8]">{v.voucherNo}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#F8FAFC]">{formatINR(v.amount)}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#F8FAFC]">{formatINR(v.amount)}</td>
                  </tr>

                  {/* Expanded Split Ledger Details */}
                  {expandedId === v.id && (
                    <tr className="bg-[#0F172A]/50 border-t-0 shadow-inner">
                      <td colSpan={7} className="px-0 py-0">
                        <div className="pl-14 pr-5 py-4 space-y-3">
                          
                          {/* Narration */}
                          {v.narration && (
                            <div className="flex items-start text-xs text-[#94A3B8] italic mb-3 bg-[#1E293B] p-2 rounded border border-[#334155]">
                              <FileText className="w-3.5 h-3.5 mr-2 mt-0.5" />
                              <span className="font-sans">{v.narration}</span>
                            </div>
                          )}

                          {/* Sub-entries */}
                          <div className="w-full max-w-4xl border border-[#334155]/50 rounded-lg overflow-hidden">
                            <table className="w-full text-xs">
                              <tbody className="divide-y divide-[#334155]/30">
                                {v.entries?.map((entry: any, i: number) => (
                                  <tr key={i} className="hover:bg-[#1E293B]/50 transition-colors">
                                    <td className="px-4 py-2.5 w-8">
                                      {entry.debit > 0 ? (
                                        <ArrowDownLeft className="w-3.5 h-3.5 text-[#34D399]" />
                                      ) : (
                                        <ArrowUpRight className="w-3.5 h-3.5 text-[#F87171]" />
                                      )}
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-[#F8FAFC]">
                                      {entry.debit > 0 ? <span className="text-[#94A3B8] mr-2">By</span> : <span className="text-[#94A3B8] mr-2 ml-4">To</span>}
                                      {entry.account.name} <span className="text-[#94A3B8] ml-1">({entry.account.code})</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-bold text-[#34D399] w-32">
                                      {entry.debit > 0 ? formatINR(entry.debit) : ''}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-bold text-[#F87171] w-32">
                                      {entry.credit > 0 ? formatINR(entry.credit) : ''}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#94A3B8]">
                    No vouchers found in this financial period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

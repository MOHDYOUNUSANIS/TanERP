"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { formatINR } from '../../../lib/constants';
import { Plus, Wallet, Search } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', type: 'ASSET' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/accounts', formData);
      setShowModal(false);
      setFormData({ code: '', name: '', type: 'ASSET' });
      fetchAccounts();
    } catch (error) {
      console.error(error);
      alert("Failed to add account. Ensure code is unique.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Chart of Accounts</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage master ledgers</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <input 
              type="text" 
              placeholder="Search ledgers..." 
              className="pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] text-sm transition-colors w-64"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#38BDF8]/20 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> New Account <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono">Alt+C</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-[#334155] overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
                <th className="px-6 py-4 font-bold w-12"></th>
                <th className="px-6 py-4 font-bold">Code</th>
                <th className="px-6 py-4 font-bold font-sans">Name</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50 text-sm">
              {accounts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#94A3B8]">No accounts found</td></tr>
              ) : (
                accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-[#334155]/30 transition-colors group">
                    <td className="px-6 py-4">
                      <Wallet className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8]" />
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8]">{acc.code}</td>
                    <td className="px-6 py-4 font-bold text-[#F8FAFC] font-sans">{acc.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#334155]/50 text-[#94A3B8]">
                        {acc.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${acc.balance < 0 ? 'text-[#F87171]' : 'text-[#34D399]'}`}>
                      {formatINR(acc.balance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#334155]">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Create Ledger Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Account Code</label>
                <input 
                  type="text" required placeholder="e.g. 1001"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Account Name</label>
                <input 
                  type="text" required placeholder="e.g. Cash in Hand"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Account Type</label>
                <select 
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Liability</option>
                  <option value="EQUITY">Equity</option>
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#38BDF8] text-white hover:bg-[#0ea5e9] rounded-lg font-bold shadow-lg shadow-[#38BDF8]/20 transition-colors">Save Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

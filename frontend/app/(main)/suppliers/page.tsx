"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Plus, Truck } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/crm/accounts?role=SUPPLIER');
      setSuppliers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/crm/accounts', { ...formData, role: 'SUPPLIER' });
      setShowModal(false);
      setFormData({ name: '', contact: '', address: '' });
      fetchSuppliers();
    } catch (error) {
      alert("Failed to add supplier.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Supplier Management</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Chemical vendors and raw material suppliers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-[#F87171] hover:bg-[#EF4444] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#F87171]/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Supplier
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-[#334155] overflow-hidden font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
              <th className="px-6 py-4 font-bold w-12"></th>
              <th className="px-6 py-4 font-bold font-sans">Name</th>
              <th className="px-6 py-4 font-bold">Contact</th>
              <th className="px-6 py-4 font-bold">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/50 text-sm">
            {suppliers.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-[#94A3B8]">No suppliers found</td></tr>
            ) : (
              suppliers.map(s => (
                <tr key={s.id} className="hover:bg-[#334155]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Truck className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F87171]" />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#F8FAFC] font-sans">{s.name}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{s.contact || '-'}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{s.address || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#334155]">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Add New Supplier</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Supplier Name</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#F87171] focus:border-[#F87171] outline-none transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Contact Details (Optional)</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#F87171] focus:border-[#F87171] outline-none transition-colors"
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Physical Address (Optional)</label>
                <textarea 
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#F87171] focus:border-[#F87171] outline-none transition-colors"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#F87171] text-white hover:bg-[#EF4444] rounded-lg font-bold shadow-lg shadow-[#F87171]/20 transition-colors">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

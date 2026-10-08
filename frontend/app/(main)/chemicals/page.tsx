"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Plus, FlaskConical } from 'lucide-react';

export default function ChemicalsPage() {
  const [chemicals, setChemicals] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', unit: 'kg', stockQty: 0 });

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    try {
      const res = await api.get('/inventory');
      setChemicals(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory', {
        name: formData.name,
        unit: formData.unit,
        stockQty: Number(formData.stockQty)
      });
      setShowModal(false);
      setFormData({ name: '', unit: 'kg', stockQty: 0 });
      fetchChemicals();
    } catch (error) {
      console.error(error);
      alert("Failed to add chemical.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Chemical Inventory</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage master chemicals and stock</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#38BDF8]/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Chemical
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-[#334155] overflow-hidden font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
              <th className="px-6 py-4 font-bold w-12"></th>
              <th className="px-6 py-4 font-bold">ID</th>
              <th className="px-6 py-4 font-bold font-sans">Name</th>
              <th className="px-6 py-4 font-bold">Unit</th>
              <th className="px-6 py-4 font-bold text-right text-[#38BDF8]">Stock Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/50 text-sm">
            {chemicals.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[#94A3B8]">No chemicals found</td></tr>
            ) : (
              chemicals.map(chem => (
                <tr key={chem.id} className="hover:bg-[#334155]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <FlaskConical className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8]" />
                  </td>
                  <td className="px-6 py-4 text-[#94A3B8]">{chem.id}</td>
                  <td className="px-6 py-4 font-bold text-[#F8FAFC] font-sans">{chem.name}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{chem.unit}</td>
                  <td className={`px-6 py-4 text-right font-bold ${chem.stockQty < 100 ? 'text-[#F87171]' : 'text-[#38BDF8]'}`}>
                    {chem.stockQty} {chem.unit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#334155]">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Add New Chemical</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Chemical Name</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Unit</label>
                  <select 
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="drums">drums</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Initial Stock</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                    value={formData.stockQty}
                    onChange={e => setFormData({...formData, stockQty: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#38BDF8] text-white hover:bg-[#0ea5e9] rounded-lg font-bold shadow-lg shadow-[#38BDF8]/20 transition-colors">Save Chemical</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

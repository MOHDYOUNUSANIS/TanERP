"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Plus, PackageOpen } from 'lucide-react';

export default function DrumsPage() {
  const [drums, setDrums] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ drumNo: '', capacity: 200 });

  useEffect(() => {
    fetchDrums();
  }, []);

  const fetchDrums = async () => {
    try {
      const res = await api.get('/process/drums');
      setDrums(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/process/drums', {
        drumNo: formData.drumNo,
        capacity: Number(formData.capacity)
      });
      setShowModal(false);
      setFormData({ drumNo: '', capacity: 200 });
      fetchDrums();
    } catch (error) {
      console.error(error);
      alert("Failed to register drum. Ensure the Drum No is unique.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Drum Registry</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage physical production drums</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-[#818CF8] hover:bg-[#6366F1] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#818CF8]/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Register Drum
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-[#334155] overflow-hidden font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
              <th className="px-6 py-4 font-bold w-12"></th>
              <th className="px-6 py-4 font-bold font-sans">Drum No</th>
              <th className="px-6 py-4 font-bold">Capacity</th>
              <th className="px-6 py-4 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/50 text-sm">
            {drums.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-[#94A3B8]">No drums found</td></tr>
            ) : (
              drums.map(drum => (
                <tr key={drum.id} className="hover:bg-[#334155]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <PackageOpen className="w-4 h-4 text-[#94A3B8] group-hover:text-[#818CF8]" />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#F8FAFC] font-sans">{drum.drumNo}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{drum.capacity} L</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      drum.status === 'EMPTY' ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20' :
                      drum.status === 'IN_USE' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20' :
                      'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20'
                    }`}>
                      {drum.status}
                    </span>
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
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Register New Drum</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Drum Number</label>
                <input 
                  type="text" required placeholder="e.g. DRUM-001"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#818CF8] focus:border-[#818CF8] outline-none transition-colors"
                  value={formData.drumNo}
                  onChange={e => setFormData({...formData, drumNo: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Capacity (Liters)</label>
                <input 
                  type="number" required min="1"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#818CF8] focus:border-[#818CF8] outline-none transition-colors"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#818CF8] text-white hover:bg-[#6366F1] rounded-lg font-bold shadow-lg shadow-[#818CF8]/20 transition-colors">Save Drum</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

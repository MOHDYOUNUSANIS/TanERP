"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Plus, CheckCircle2, PlayCircle, Lock, Factory } from 'lucide-react';

export default function ProcessPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [drums, setDrums] = useState<any[]>([]);
  const [chemicals, setChemicals] = useState<any[]>([]);
  
  const [showLotModal, setShowLotModal] = useState(false);
  const [lotNo, setLotNo] = useState('');

  const [allocateModalLotId, setAllocateModalLotId] = useState<number | null>(null);
  const [selectedDrumId, setSelectedDrumId] = useState('');

  const [issueModalLotId, setIssueModalLotId] = useState<number | null>(null);
  const [selectedChemId, setSelectedChemId] = useState('');
  const [issueQty, setIssueQty] = useState('');

  useEffect(() => {
    fetchLots();
    fetchDrums();
    fetchChemicals();
  }, []);

  const fetchLots = async () => {
    try { const res = await api.get('/process/lots'); setLots(res.data); } catch (e) {}
  };
  const fetchDrums = async () => {
    try { const res = await api.get('/process/drums'); setDrums(res.data); } catch (e) {}
  };
  const fetchChemicals = async () => {
    try { const res = await api.get('/inventory'); setChemicals(res.data); } catch (e) {}
  };

  const handleStartLot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/process/lots', { lotNo });
      setShowLotModal(false); setLotNo(''); fetchLots();
    } catch (error) { alert("Failed to start lot."); }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/process/allocate', { drumId: Number(selectedDrumId), lotId: allocateModalLotId });
      setAllocateModalLotId(null); setSelectedDrumId(''); fetchLots(); fetchDrums();
    } catch (error) { alert("Failed to allocate drum. Ensure it is empty."); }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/issue', { 
        lotId: issueModalLotId, chemicalId: Number(selectedChemId), qtyIssued: Number(issueQty) 
      });
      setIssueModalLotId(null); setSelectedChemId(''); setIssueQty(''); fetchLots(); fetchChemicals();
    } catch (error: any) { alert("Failed to issue chemical: " + (error.response?.data?.message || 'Insufficient stock')); }
  };

  const handleRelease = async (allocationId: number) => {
    if(!confirm("Are you sure you want to release this drum? It will be marked as WASHING.")) return;
    try {
      await api.post('/process/release', { allocationId });
      fetchLots(); fetchDrums();
    } catch (error) { alert("Failed to release drum."); }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Production Lots</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage active tanning batches</p>
        </div>
        <button 
          onClick={() => setShowLotModal(true)}
          className="flex items-center bg-[#818CF8] hover:bg-[#6366F1] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#818CF8]/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Start New Lot
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-[#334155] overflow-hidden font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#334155] text-xs uppercase tracking-wider text-[#94A3B8]">
              <th className="px-6 py-4 font-bold w-12"></th>
              <th className="px-6 py-4 font-bold font-sans">Lot No</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Drums & Chemicals</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/50 text-sm">
            {lots.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[#94A3B8]">No lots found</td></tr>
            ) : (
              lots.map(lot => (
                <tr key={lot.id} className="hover:bg-[#334155]/30 transition-colors align-top group">
                  <td className="px-6 py-4">
                    <Factory className="w-4 h-4 text-[#94A3B8] group-hover:text-[#818CF8]" />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#F8FAFC] font-sans pt-5">{lot.lotNo}</td>
                  <td className="px-6 py-4 pt-5">
                    <span className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      lot.status === 'COMPLETED' ? 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20' :
                      lot.status === 'IN_PROGRESS' ? 'bg-[#818CF8]/10 text-[#818CF8] border-[#818CF8]/20' :
                      'bg-[#334155]/50 text-[#94A3B8] border-[#334155]'
                    }`}>
                      {lot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8] space-y-3">
                    <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                      <strong className="text-[#F8FAFC] font-sans text-xs uppercase tracking-wider mb-2 block">Allocated Drums</strong>
                      {lot.allocations?.length === 0 ? <span className="text-[#94A3B8] text-xs">None</span> : 
                        <ul className="space-y-1.5">
                          {lot.allocations?.map((alloc: any) => (
                            <li key={alloc.id} className="flex items-center justify-between text-xs">
                              <span className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${alloc.releasedAt ? 'bg-[#94A3B8]' : 'bg-[#34D399] animate-pulse'}`}></span>
                                {alloc.drum.drumNo}
                              </span>
                              {!alloc.releasedAt && (
                                <button onClick={() => handleRelease(alloc.id)} className="text-[#F87171] hover:text-white font-bold bg-[#F87171]/10 hover:bg-[#F87171] px-2 py-0.5 rounded transition-colors">Release</button>
                              )}
                            </li>
                          ))}
                        </ul>
                      }
                    </div>
                    <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                      <strong className="text-[#F8FAFC] font-sans text-xs uppercase tracking-wider mb-2 block">Chemicals Issued</strong>
                      {lot.issues?.length === 0 ? <span className="text-[#94A3B8] text-xs">None</span> : 
                        <ul className="space-y-1">
                          {lot.issues?.map((issue: any) => (
                            <li key={issue.id} className="flex items-center justify-between text-xs">
                              <span>{issue.chemical.name}</span>
                              <span className="font-bold text-[#38BDF8]">{issue.qtyIssued} {issue.chemical.unit}</span>
                            </li>
                          ))}
                        </ul>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-y-2 pt-5">
                    <button 
                      onClick={() => setAllocateModalLotId(lot.id)}
                      className="w-full px-3 py-1.5 bg-[#334155]/50 hover:bg-[#334155] text-[#F8FAFC] border border-[#334155] rounded-lg text-xs font-bold transition-colors"
                    >
                      Allocate Drum
                    </button>
                    <button 
                      onClick={() => setIssueModalLotId(lot.id)}
                      className="w-full px-3 py-1.5 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 rounded-lg text-xs font-bold transition-colors"
                    >
                      Issue Chemical
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showLotModal && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#334155]">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Start New Production Lot</h2>
            <form onSubmit={handleStartLot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Lot Number</label>
                <input 
                  type="text" required placeholder="e.g. LOT-2024-001"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#818CF8] focus:border-[#818CF8] outline-none transition-colors"
                  value={lotNo}
                  onChange={e => setLotNo(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setShowLotModal(false)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#818CF8] text-white hover:bg-[#6366F1] rounded-lg font-bold shadow-lg shadow-[#818CF8]/20 transition-colors">Save Lot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {allocateModalLotId && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#334155]">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Allocate Drum to Lot</h2>
            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Select EMPTY Drum</label>
                <select 
                  required className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#818CF8] focus:border-[#818CF8] outline-none transition-colors"
                  value={selectedDrumId}
                  onChange={e => setSelectedDrumId(e.target.value)}
                >
                  <option value="">-- Choose a Drum --</option>
                  {drums.filter(d => d.status === 'EMPTY').map(drum => (
                    <option key={drum.id} value={drum.id}>{drum.drumNo} ({drum.capacity}L)</option>
                  ))}
                </select>
                {drums.filter(d => d.status === 'EMPTY').length === 0 && (
                  <p className="text-xs text-[#F87171] mt-1">No empty drums available.</p>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setAllocateModalLotId(null)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#818CF8] text-white hover:bg-[#6366F1] rounded-lg font-bold shadow-lg shadow-[#818CF8]/20 transition-colors">Allocate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {issueModalLotId && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md shadow-2xl border border-[#334155]">
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Issue Chemical to Lot</h2>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Select Chemical</label>
                <select 
                  required className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                  value={selectedChemId}
                  onChange={e => setSelectedChemId(e.target.value)}
                >
                  <option value="">-- Choose Chemical --</option>
                  {chemicals.map(chem => (
                    <option key={chem.id} value={chem.id}>{chem.name} (Stock: {chem.stockQty} {chem.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1">Quantity to Issue</label>
                <input 
                  type="number" required min="0.01" step="0.01"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#F8FAFC] focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] outline-none transition-colors"
                  value={issueQty}
                  onChange={e => setIssueQty(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#334155]">
                <button type="button" onClick={() => setIssueModalLotId(null)} className="px-4 py-2 text-[#94A3B8] hover:bg-[#334155] rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#38BDF8] text-white hover:bg-[#0ea5e9] rounded-lg font-bold shadow-lg shadow-[#38BDF8]/20 transition-colors">Issue Chemical</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

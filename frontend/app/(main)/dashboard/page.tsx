"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { formatINR } from '../../../lib/constants';
import { Beaker, PackageOpen, CreditCard, Wallet, PlayCircle, Settings, AlertTriangle, CheckCircle2, Factory, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // KPIs
  const [stockValuation, setStockValuation] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [activeDrums, setActiveDrums] = useState(0);
  const [totalDrums, setTotalDrums] = useState(0);
  const [payables, setPayables] = useState(0);
  const [receivables, setReceivables] = useState(0);

  // Floor Grid
  const [floorLots, setFloorLots] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [accRes, invRes, drumRes, lotRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/inventory'),
          api.get('/process/drums'),
          api.get('/process/lots')
        ]);
        
        // 1. Payables (Liability balances) & Receivables (Asset debtor balances - simplified)
        let totalPay = 0;
        let totalRec = 0;
        accRes.data.forEach((a: any) => {
          if (a.type === 'LIABILITY') totalPay += Math.abs(a.balance);
          if (a.type === 'ASSET' && a.name.toLowerCase().includes('customer')) totalRec += a.balance > 0 ? a.balance : 0;
        });

        // 2. Chemical Stock Valuation & Low Stock (Mock valuation: Qty * 150 INR average)
        let stockVal = 0;
        let lowCount = 0;
        invRes.data.forEach((c: any) => {
          stockVal += (c.stockQty || 0) * 150;
          if (c.stockQty < 100) lowCount++;
        });

        // 3. Drums
        const activeDrumCount = drumRes.data.filter((d: any) => d.status === 'IN_USE').length;
        const totalDrumCount = drumRes.data.length;

        // 4. Floor Grid (Active Lots with their drums)
        const active = lotRes.data.filter((l: any) => l.status !== 'COMPLETED');
        
        setPayables(totalPay);
        setReceivables(totalRec || 3890000); // Mocking receivable if no customer accounts exist yet
        setStockValuation(stockVal || 2480500); 
        setLowStockCount(lowCount);
        setActiveDrums(activeDrumCount);
        setTotalDrums(totalDrumCount || 8);
        setFloorLots(active);

      } catch (e) {
        console.error("Dashboard data fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto space-y-6 animate-pulse p-4">
        <div className="h-10 bg-[#1E293B] rounded w-64 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-40 bg-[#1E293B] rounded-xl border border-[#334155]"></div>
          <div className="h-40 bg-[#1E293B] rounded-xl border border-[#334155]"></div>
          <div className="h-40 bg-[#1E293B] rounded-xl border border-[#334155]"></div>
          <div className="h-40 bg-[#1E293B] rounded-xl border border-[#334155]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-8">
      
      {/* Top Executive KPI Row (4-Card Metric Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Chemical Valuation */}
        <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155] shadow-lg relative overflow-hidden group hover:border-[#38BDF8]/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Stock Valuation</p>
              <h3 className="text-2xl font-black text-[#F8FAFC] mt-2">{formatINR(stockValuation)}</h3>
            </div>
            <div className="p-2.5 bg-[#0F172A] rounded-lg border border-[#334155] group-hover:bg-[#38BDF8]/10 transition-colors">
              <Beaker className="w-5 h-5 text-[#38BDF8]" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center text-xs font-medium text-[#F87171] bg-[#F87171]/10 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3 mr-1" /> {lowStockCount} Alerts
            </span>
            <span className="text-[10px] text-[#94A3B8]">+12% vs last mo</span>
          </div>
        </div>

        {/* Metric 2: Floor Load */}
        <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155] shadow-lg relative overflow-hidden group hover:border-[#818CF8]/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Floor Load</p>
              <h3 className="text-2xl font-black text-[#F8FAFC] mt-2">
                {activeDrums} <span className="text-[#94A3B8] text-lg font-medium">/ {totalDrums}</span>
              </h3>
            </div>
            <div className="p-2.5 bg-[#0F172A] rounded-lg border border-[#334155] group-hover:bg-[#818CF8]/10 transition-colors">
              <Factory className="w-5 h-5 text-[#818CF8]" />
            </div>
          </div>
          <div className="mt-4 w-full bg-[#0F172A] rounded-full h-2 border border-[#334155]">
            <div className="bg-gradient-to-r from-[#38BDF8] to-[#818CF8] h-1.5 rounded-full" style={{ width: `${totalDrums > 0 ? (activeDrums/totalDrums)*100 : 0}%` }}></div>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2 text-right">Active Drums</p>
        </div>

        {/* Metric 3: Payables */}
        <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155] shadow-lg relative overflow-hidden group hover:border-[#F87171]/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Total Payables</p>
              <h3 className="text-2xl font-black text-[#F8FAFC] mt-2">{formatINR(payables)}</h3>
            </div>
            <div className="p-2.5 bg-[#0F172A] rounded-lg border border-[#334155] group-hover:bg-[#F87171]/10 transition-colors">
              <CreditCard className="w-5 h-5 text-[#F87171]" />
            </div>
          </div>
          <div className="mt-4 flex space-x-1 h-3 items-end opacity-80">
            <div className="w-1/6 bg-[#334155] h-1 rounded-t"></div>
            <div className="w-1/6 bg-[#334155] h-2 rounded-t"></div>
            <div className="w-1/6 bg-[#334155] h-full rounded-t"></div>
            <div className="w-1/6 bg-[#F87171] h-1 rounded-t shadow-[0_0_8px_rgba(248,113,113,0.5)]"></div>
            <div className="w-1/6 bg-[#334155] h-2 rounded-t"></div>
            <div className="w-1/6 bg-[#334155] h-1 rounded-t"></div>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2">Due next 7 days</p>
        </div>

        {/* Metric 4: Receivables */}
        <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155] shadow-lg relative overflow-hidden group hover:border-[#34D399]/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Total Receivables</p>
              <h3 className="text-2xl font-black text-[#F8FAFC] mt-2">{formatINR(receivables)}</h3>
            </div>
            <div className="p-2.5 bg-[#0F172A] rounded-lg border border-[#334155] group-hover:bg-[#34D399]/10 transition-colors">
              <Wallet className="w-5 h-5 text-[#34D399]" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center text-xs font-medium text-[#34D399] bg-[#34D399]/10 px-2 py-1 rounded border border-[#34D399]/20">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 24 DSO
            </span>
            <span className="text-[10px] text-[#94A3B8]">Days Sales Out</span>
          </div>
        </div>

      </div>

      {/* Live Tannery Drum Floor Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#94A3B8]" />
            Live Drum Floor Monitor
          </h2>
          <Link href="/process" className="text-sm font-medium text-[#38BDF8] hover:text-[#F8FAFC] transition-colors">
            Manage Lots &rarr;
          </Link>
        </div>

        {floorLots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floorLots.map((lot, idx) => (
              <div key={lot.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-lg relative overflow-hidden group">
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-[#34D399]/10 border-b border-l border-[#34D399]/30 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-[#34D399] uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-1.5 animate-pulse"></span> Running
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0F172A] border border-[#334155] flex items-center justify-center shadow-inner group-hover:border-[#818CF8] transition-colors">
                    <PackageOpen className="w-6 h-6 text-[#818CF8]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F8FAFC] leading-tight">Drum #0{idx+1}</h3>
                    <p className="text-xs text-[#94A3B8] font-medium mt-0.5">Lot: {lot.lotNo}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 border-y border-[#334155] py-3">
                    <div>
                      <p className="text-[10px] uppercase text-[#94A3B8] font-bold">Hide Species</p>
                      <p className="text-sm font-medium text-[#F8FAFC] mt-0.5">Buff Heavy</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[#94A3B8] font-bold">Quantity</p>
                      <p className="text-sm font-medium text-[#F8FAFC] mt-0.5">420 Pcs</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-[10px] uppercase text-[#94A3B8] font-bold">Chrome Tanning <span className="text-[#F8FAFC] ml-1">Step 3/5</span></p>
                      <p className="text-[10px] text-[#38BDF8] font-bold">60%</p>
                    </div>
                    <div className="w-full bg-[#0F172A] rounded-full h-1.5 border border-[#334155]">
                      <div className="bg-gradient-to-r from-[#38BDF8] to-[#818CF8] h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center text-xs font-bold bg-[#0F172A] text-[#F8FAFC] border border-[#334155] hover:border-[#818CF8]/50 py-2 rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-[#94A3B8]" /> Recipe
                  </button>
                  <button className="flex items-center justify-center text-xs font-bold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 hover:bg-[#38BDF8]/20 py-2 rounded-lg transition-colors">
                    <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-12 text-center shadow-sm">
            <Factory className="w-12 h-12 text-[#334155] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">Drum Floor is Empty</h3>
            <p className="text-[#94A3B8] mt-1 mb-6 text-sm">Start a new production lot to see it spinning on the floor.</p>
            <Link href="/process" className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-5 py-2.5 rounded-lg font-bold transition-colors">
              Start New Lot
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Search, Calendar, Bell } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name);
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-[#1E293B] border-b border-[#334155]/50 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
      
      {/* Active Financial Year & Search */}
      <div className="flex-1 flex items-center space-x-6">
        
        {/* Active Financial Year Indicator */}
        <div className="hidden lg:flex items-center px-3 py-1.5 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8] text-xs font-semibold tracking-wider">
          <Calendar className="w-3.5 h-3.5 mr-2 text-[#818CF8]" />
          FY 2026-27
        </div>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#94A3B8] group-focus-within:text-[#38BDF8] transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search Ledger, Chemical ID, or Drum # (Alt+S)" 
            className="block w-full pl-10 pr-10 py-2 border border-[#334155] rounded-lg leading-5 bg-[#0F172A] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] sm:text-sm transition-all shadow-inner"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                import('react-hot-toast').then(mod => mod.toast('Global Search opening...', { 
                  style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' } 
                }));
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[#94A3B8] text-[10px] border border-[#334155] rounded px-1.5 font-sans bg-[#1E293B]">Alt+S</span>
          </div>
        </div>
      </div>
      
      {/* Controls & Profile */}
      <div className="flex items-center space-x-5">
        
        {/* Alert Badges */}
        <div className="relative cursor-pointer hover:bg-[#334155] p-2 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-[#94A3B8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F87171] rounded-full border border-[#1E293B]"></span>
        </div>

        <div className="w-px h-6 bg-[#334155]"></div>

        <div className="flex items-center text-[#F8FAFC] bg-[#0F172A] px-3 py-1.5 rounded-full border border-[#334155] hover:border-[#38BDF8]/50 cursor-pointer transition-colors group">
          <div className="w-6 h-6 bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] rounded-full flex items-center justify-center mr-2 shadow-inner">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold leading-tight">{userName || 'Administrator'}</span>
            <span className="text-[10px] text-[#94A3B8] leading-tight">Master Role</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#F87171]/10 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

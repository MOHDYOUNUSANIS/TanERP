"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FlaskConical, Receipt, Wallet, PackageOpen, Truck, Contact, FileText, ChevronDown, Building2, Plus } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tally Ledgers', href: '/accounts', icon: Wallet },
  { name: 'Vouchers', href: '/vouchers', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Customers', href: '/customers', icon: Contact },
  { name: 'Chemical Inventory', href: '/chemicals', icon: FlaskConical },
  { name: 'Drum Monitor', href: '/drums', icon: PackageOpen },
  { name: 'Process Lots', href: '/process', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState({ name: 'Apex Leathers', subtitle: 'Main Tannery' });

  const handleCompanySwitch = (name: string, subtitle: string) => {
    setActiveCompany({ name, subtitle });
    setIsDropdownOpen(false);
    import('react-hot-toast').then(mod => mod.toast.success(`Switched to ${name}`, {
      style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }
    }));
  };

  return (
    <aside className="w-[260px] bg-[#0F172A] text-[#94A3B8] flex flex-col border-r border-[#334155]/50 shadow-2xl z-20">
      
      {/* Multi-tenant Company Selector Dropdown */}
      <div className="relative">
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-16 flex items-center justify-between px-5 border-b border-[#334155]/50 hover:bg-[#1E293B] cursor-pointer transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-[#1E293B] border border-[#334155] rounded-lg group-hover:border-[#38BDF8]/50 transition-colors">
              <Building2 className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#F8FAFC] font-bold text-sm leading-tight tracking-wide">{activeCompany.name}</span>
              <span className="text-xs text-[#94A3B8]">{activeCompany.subtitle}</span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#1E293B] border-b border-[#334155]/50 shadow-xl z-50 py-2">
            <button 
              onClick={() => handleCompanySwitch('Apex Leathers', 'Main Tannery')}
              className={`w-full text-left px-5 py-2 text-sm hover:bg-[#334155] transition-colors flex items-center ${activeCompany.name === 'Apex Leathers' ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${activeCompany.name === 'Apex Leathers' ? 'bg-[#34D399]' : 'bg-[#334155]'}`}></span> Apex Leathers
            </button>
            <button 
              onClick={() => handleCompanySwitch('Kanpur Tannery', 'Secondary Branch')}
              className={`w-full text-left px-5 py-2 text-sm hover:bg-[#334155] transition-colors flex items-center ${activeCompany.name === 'Kanpur Tannery' ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${activeCompany.name === 'Kanpur Tannery' ? 'bg-[#34D399]' : 'bg-[#334155]'}`}></span> Kanpur Tannery
            </button>
            <div className="border-t border-[#334155] my-1"></div>
            <button 
              onClick={() => {
                setIsDropdownOpen(false);
                import('react-hot-toast').then(mod => mod.toast('Company management coming soon!', { icon: '🏢' }));
              }}
              className="w-full text-left px-5 py-2 text-sm text-[#38BDF8] hover:bg-[#334155] transition-colors flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-2" /> Add Company
            </button>
          </div>
        )}
      </div>

      <div className="px-4 pt-6 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]/60">Overview</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-[#38BDF8]/10 text-[#38BDF8] font-semibold' 
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

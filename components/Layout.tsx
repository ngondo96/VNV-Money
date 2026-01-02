
import React from 'react';
import { Home, ClipboardList, TrendingUp, FileText, User, LayoutDashboard, Users, Wallet, Activity, Settings, LogOut } from 'lucide-react';
import { UserRole } from '../types';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, activeTab, setActiveTab, onLogout }) => {
  const userTabs = [
    { id: 'home', icon: Home, label: 'Trang chủ' },
    { id: 'loans', icon: ClipboardList, label: 'Khoản vay' },
    { id: 'tier', icon: TrendingUp, label: 'Hạng' },
    { id: 'contracts', icon: FileText, label: 'Hợp đồng' },
    { id: 'profile', icon: User, label: 'Tài khoản' }
  ];

  const adminTabs = [
    { id: 'admin_dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'admin_users', icon: Users, label: 'Người dùng' },
    { id: 'admin_loans', icon: ClipboardList, label: 'Duyệt vay' },
    { id: 'admin_budget', icon: Wallet, label: 'Ngân sách' },
    { id: 'admin_logs', icon: Activity, label: 'Logs' },
    { id: 'admin_settings', icon: Settings, label: 'Hệ thống' }
  ];

  const currentTabs = role === UserRole.ADMIN ? adminTabs : userTabs;

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-gray-800 bg-[#0F0F0F] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF8C1A] rounded-lg flex items-center justify-center font-bold text-black">VNV</div>
          <span className="font-bold tracking-tight text-xl">MONEY</span>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <LogOut size={20} className="text-gray-400" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-4 pt-4">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[450px] mx-auto bg-[#1A1A1A] border-t border-gray-800 px-2 py-3 flex justify-around items-center z-50">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF8C1A]' : 'text-gray-500'}`}
            >
              <Icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;

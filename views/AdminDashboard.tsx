
import React, { useState, useEffect } from 'react';
import { SystemBudget, Loan, User, LoanStatus, UserRole } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { Users, FileText, Wallet, AlertCircle, BarChart3, Activity, Landmark, ArrowDownCircle, ArrowUpCircle, TrendingUp, ShieldAlert, Coins, Banknote, Percent, AlertTriangle, BellRing, UserCheck, Clock, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AdminDashboardProps {
  budget: SystemBudget;
  loans: Loan[];
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ budget, loans, users }) => {
  const [showLowBudgetPopup, setShowLowBudgetPopup] = useState(false);
  
  const customers = users.filter(u => u.role !== UserRole.ADMIN);
  const pendingLoans = loans.filter(l => l.status === LoanStatus.REQUESTED);
  const activeLoans = loans.filter(l => l.status === LoanStatus.DISBURSED);
  const settledLoans = loans.filter(l => l.status === LoanStatus.SETTLED);
  
  const totalSettledPrincipal = settledLoans.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutstandingValue = activeLoans.reduce((acc, curr) => acc + curr.amount + (curr.accruedFine || 0), 0);

  const profitFromInterest = totalSettledPrincipal * 0.15;
  const totalProfit = profitFromInterest + budget.finesCollected;

  const statusData = [
    { name: 'Yêu cầu', value: pendingLoans.length, color: '#FF8C1A' },
    { name: 'Đang nợ', value: activeLoans.length, color: '#3B82F6' },
    { name: 'Tất toán', value: settledLoans.length, color: '#10B981' },
    { name: 'Từ chối', value: loans.filter(l => l.status === LoanStatus.REJECTED).length, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Cảnh báo ngân sách thấp
  const isBudgetLow = budget.remaining <= 2000000;

  useEffect(() => {
    if (isBudgetLow) {
      setShowLowBudgetPopup(true);
    }
  }, [isBudgetLow]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-16 px-1">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-black tracking-tight uppercase">Hệ thống Quản trị</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/10 text-green-500 rounded-full text-[10px] font-black border border-green-600/20 uppercase tracking-widest">
           <Activity size={12} className="animate-pulse" />
           Live v37.2 PRO
        </div>
      </div>

      {/* PROFIT CENTER */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-black p-7 rounded-[2.5rem] border border-[#FF8C1A]/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Coins size={80} className="text-[#FF8C1A]" />
        </div>
        
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF8C1A]/10 rounded-xl flex items-center justify-center border border-[#FF8C1A]/20">
                 <Banknote className="text-[#FF8C1A]" size={22} />
              </div>
              <div>
                 <h3 className="text-xs font-black text-white uppercase tracking-widest">Tổng Lợi Nhuận</h3>
                 <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Dựa trên các HĐ đã tất toán</p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="text-4xl font-black text-[#FF8C1A] tracking-tighter drop-shadow-lg">
                {FORMAT_CURRENCY(totalProfit)}
              </p>
              <div className="flex items-center gap-2 pt-2">
                 <div className="px-2 py-0.5 bg-green-500/10 rounded-md border border-green-500/20">
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">Net Profit</span>
                 </div>
                 <div className="h-[1px] flex-1 bg-gray-800"></div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-800/50">
              <div>
                 <p className="text-[9px] text-gray-500 font-black uppercase mb-1 flex items-center gap-1">
                    <Percent size={10} className="text-blue-500" /> Phí dịch vụ (15%)
                 </p>
                 <p className="text-sm font-black text-white">{FORMAT_CURRENCY(profitFromInterest)}</p>
              </div>
              <div>
                 <p className="text-[9px] text-gray-500 font-black uppercase mb-1 flex items-center gap-1">
                    <AlertCircle size={10} className="text-red-500" /> Phí phạt quá hạn
                 </p>
                 <p className="text-sm font-black text-white">{FORMAT_CURRENCY(budget.finesCollected)}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Financial Health Section - INTEGRATED METRICS */}
      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                 <TrendingUp className="text-blue-500" size={24} />
              </div>
              <div>
                 <h3 className="font-black text-gray-200 text-sm uppercase tracking-widest">Sức khỏe tài chính</h3>
                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Phân bổ nguồn vốn</p>
              </div>
           </div>
        </div>

        {/* Integrated Brief Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-black/40 p-4 rounded-2xl border border-gray-800/50 text-center shadow-inner">
               <div className="flex justify-center mb-1 text-blue-500"><Users size={14}/></div>
               <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Khách hàng</p>
               <p className="text-sm font-black text-white">{customers.length}</p>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-orange-500/20 text-center shadow-inner">
               <div className="flex justify-center mb-1 text-orange-500"><FileText size={14}/></div>
               <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Lệnh chờ</p>
               <p className="text-sm font-black text-orange-500">{pendingLoans.length}</p>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-gray-800/50 text-center shadow-inner">
               <div className="flex justify-center mb-1 text-green-500"><Activity size={14}/></div>
               <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Giải ngân</p>
               <p className="text-sm font-black text-white">{activeLoans.length}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Dư nợ thị trường (Gốc + Phạt hiện tại)</p>
              <p className="text-2xl font-black text-white tracking-tighter">{FORMAT_CURRENCY(totalOutstandingValue)}</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-gray-800/50">
                 <div className="flex items-center gap-2 mb-1 text-green-500">
                    <ArrowDownCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Đã thu hồi gốc</span>
                 </div>
                 <p className="text-sm font-black text-white">{FORMAT_CURRENCY(totalSettledPrincipal)}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-gray-800/50">
                 <div className="flex items-center gap-2 mb-1 text-blue-500">
                    <ArrowUpCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Đã giải ngân</span>
                 </div>
                 <p className="text-sm font-black text-white">{FORMAT_CURRENCY(budget.disbursed)}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
           <Wallet size={20} className="text-[#FF8C1A]" />
           <h3 className="font-black text-gray-200 tracking-tight text-sm uppercase">Ngân sách hệ thống</h3>
        </div>
        <div className="space-y-5">
           <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-gray-800 p-[2px]">
              <div 
                className={`h-full bg-gradient-to-r ${isBudgetLow ? 'from-red-600 to-red-400' : 'from-orange-600 to-[#FF8C1A]'} rounded-full transition-all duration-1000`}
                style={{ width: `${(budget.remaining / budget.total) * 100}%` }}
              ></div>
           </div>
           <div className="flex justify-between items-center px-1">
              <div>
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Vốn khả dụng</p>
                 <p className={`text-lg font-black ${isBudgetLow ? 'text-red-500' : 'text-green-500'}`}>{FORMAT_CURRENCY(budget.remaining)}</p>
              </div>
              <div className="text-right">
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Vốn điều lệ</p>
                 <p className="text-lg font-black text-white">{FORMAT_CURRENCY(budget.total)}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
           <BarChart3 size={20} className="text-[#FF8C1A]" />
           <h3 className="font-black text-gray-200 text-sm uppercase tracking-widest">Cơ cấu Trạng thái HĐ</h3>
        </div>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '16px' }}
                   itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* POPUP CẢNH BÁO NGÂN SÁCH THẤP */}
      {showLowBudgetPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md">
           <div className="bg-red-600 border-4 border-white/20 w-full max-w-sm rounded-[3rem] p-10 text-center relative z-10 animate-in zoom-in-95 duration-300 shadow-[0_0_80px_rgba(220,38,38,0.5)]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                 <AlertTriangle size={40} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">CẢNH BÁO KHẨN CẤP <br/>NGÂN SÁCH THẤP</h3>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                Số dư khả dụng hiện tại chỉ còn <br/>
                <span className="text-3xl font-black block mt-2">{FORMAT_CURRENCY(budget.remaining)}</span>
              </p>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10 mb-8">
                 <p className="text-[10px] text-white font-medium uppercase tracking-tighter italic">
                    Hệ thống sẽ gặp khó khăn khi giải ngân các khoản vay mới. Vui lòng nạp thêm vốn ngay lập tức.
                 </p>
              </div>
              <button 
                onClick={() => setShowLowBudgetPopup(false)}
                className="w-full py-5 bg-white text-red-600 font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                TÔI ĐÃ TIẾP NHẬN
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

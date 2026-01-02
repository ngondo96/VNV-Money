
import React from 'react';
import { SystemBudget, Loan, User, LoanStatus, UserRole } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { Users, FileText, Wallet, AlertCircle, BarChart3, Activity, Landmark, ArrowDownCircle, ArrowUpCircle, TrendingUp, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AdminDashboardProps {
  budget: SystemBudget;
  loans: Loan[];
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ budget, loans, users }) => {
  // Loại trừ Admin khỏi thống kê người dùng (khách hàng)
  const customers = users.filter(u => u.role !== UserRole.ADMIN);
  const pendingLoans = loans.filter(l => l.status === LoanStatus.REQUESTED);
  const activeLoans = loans.filter(l => l.status === LoanStatus.DISBURSED);
  const settledLoans = loans.filter(l => l.status === LoanStatus.SETTLED);
  
  const totalSettledValue = settledLoans.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutstandingValue = activeLoans.reduce((acc, curr) => acc + curr.amount + curr.accruedFine, 0);

  const statusData = [
    { name: 'Yêu cầu', value: pendingLoans.length, color: '#FF8C1A' },
    { name: 'Đang nợ', value: activeLoans.length, color: '#3B82F6' },
    { name: 'Tất toán', value: settledLoans.length, color: '#10B981' },
    { name: 'Từ chối', value: loans.filter(l => l.status === LoanStatus.REJECTED).length, color: '#EF4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-16">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black tracking-tight uppercase">Báo cáo Tổng quan</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/10 text-green-500 rounded-full text-[10px] font-black border border-green-600/20 uppercase tracking-widest">
           <Activity size={12} className="animate-pulse" />
           Realtime
        </div>
      </div>

      {/* Financial Breakdown Section */}
      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                 <TrendingUp className="text-blue-500" size={24} />
              </div>
              <div>
                 <h3 className="font-black text-gray-200 text-sm uppercase tracking-widest">Sức khỏe tài chính</h3>
                 <p className="text-[10px] text-gray-600 font-bold uppercase">KPI Hiện tại</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Dư nợ thị trường (Gốc + Phạt)</p>
              <p className="text-3xl font-black text-[#FF8C1A] tracking-tighter">{FORMAT_CURRENCY(totalOutstandingValue)}</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-gray-800/50">
                 <div className="flex items-center gap-2 mb-1 text-green-500">
                    <ArrowDownCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Đã thu hồi</span>
                 </div>
                 <p className="text-sm font-black text-white">{FORMAT_CURRENCY(totalSettledValue)}</p>
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1A1A1A] p-5 rounded-[2rem] border border-gray-800 shadow-xl">
           <div className="flex items-center justify-between mb-4">
              <Users size={20} className="text-blue-500" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Khách hàng</span>
           </div>
           <p className="text-3xl font-black tracking-tighter">{customers.length}</p>
           <p className="text-[8px] text-gray-700 font-bold uppercase mt-1">(Không tính Admin)</p>
        </div>
        <div className="bg-[#1A1A1A] p-5 rounded-[2rem] border border-gray-800 shadow-xl">
           <div className="flex items-center justify-between mb-4">
              <FileText size={20} className="text-orange-500" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Lệnh chờ duyệt</span>
           </div>
           <p className="text-3xl font-black tracking-tighter">{pendingLoans.length}</p>
        </div>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
           <Wallet size={20} className="text-[#FF8C1A]" />
           <h3 className="font-black text-gray-200 tracking-tight text-sm uppercase">Trạng thái Ngân sách</h3>
        </div>
        <div className="space-y-5">
           <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-[#FF8C1A] rounded-full"
                style={{ width: `${(budget.remaining / budget.total) * 100}%` }}
              ></div>
           </div>
           <div className="flex justify-between items-center px-1">
              <div>
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Tiền khả dụng</p>
                 <p className="text-lg font-black text-green-500">{FORMAT_CURRENCY(budget.remaining)}</p>
              </div>
              <div className="text-right">
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Tổng vốn</p>
                 <p className="text-lg font-black">{FORMAT_CURRENCY(budget.total)}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Analysis Chart */}
      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
           <BarChart3 size={20} className="text-[#FF8C1A]" />
           <h3 className="font-black text-gray-200 text-sm uppercase tracking-widest">Cơ cấu Trạng thái</h3>
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

      {/* Warning Center */}
      <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-[2rem] flex gap-5">
         <div className="p-3 bg-red-900/30 rounded-2xl h-fit">
            <ShieldAlert className="text-red-500" size={24} />
         </div>
         <div className="flex-1">
            <h4 className="text-red-500 font-black text-xs uppercase tracking-widest mb-2">Cảnh báo vận hành</h4>
            <div className="space-y-2">
               <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-500 uppercase tracking-tighter">Tỷ lệ nợ quá hạn:</span>
                  <span className="text-red-400">12.8%</span>
               </div>
               <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-500 uppercase tracking-tighter">Lợi nhuận dự kiến:</span>
                  <span className="text-green-500 font-black">{FORMAT_CURRENCY(budget.finesCollected)}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

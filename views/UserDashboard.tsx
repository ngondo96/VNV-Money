
import React, { useEffect, useState } from 'react';
import { User, Loan, SystemBudget, LoanStatus } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { CreditCard, Clock, AlertCircle, FileText, Zap, RefreshCw, ShieldCheck, TrendingUp, History, Landmark, Percent, Activity } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  loans: Loan[];
  budget: SystemBudget;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, loans, budget }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Luôn hiển thị popup sau khi Dashboard được mount (sau login hoặc refresh trang)
    setShowWelcome(true);
  }, []);

  const disbursedLoans = loans.filter(l => l.status === LoanStatus.DISBURSED);
  const settledLoans = loans.filter(l => l.status === LoanStatus.SETTLED);
  
  const currentDebt = disbursedLoans.reduce((acc, curr) => acc + curr.amount + curr.accruedFine, 0);
  const totalBorrowed = loans.filter(l => l.status !== LoanStatus.REJECTED && l.status !== LoanStatus.REQUESTED)
                            .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = settledLoans.reduce((acc, curr) => acc + curr.amount + curr.accruedFine, 0);

  const historyLoans = [...loans].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const getStatusStyle = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.SETTLED: return 'bg-green-500';
      case LoanStatus.DISBURSED: return 'bg-blue-500 animate-pulse';
      case LoanStatus.APPROVED: return 'bg-cyan-500';
      case LoanStatus.REJECTED: return 'bg-red-500';
      default: return 'bg-orange-500';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 pb-10">
      {/* Account Info Card */}
      <div className="bg-gradient-to-br from-[#FF8C1A] to-[#E67E17] p-8 rounded-[3rem] text-black relative overflow-hidden shadow-[0_20px_40px_rgba(255,140,26,0.2)]">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
             <div>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Thành viên hạng</p>
                <h2 className="text-3xl font-black tracking-tighter uppercase">{user.tier}</h2>
             </div>
             <div className="bg-black/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/10">VNV v37 PRO</div>
          </div>
          
          <div className="flex items-end justify-between mt-8">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 flex items-center gap-1">
                <Zap size={10} /> Chủ tài khoản
              </p>
              <p className="text-xl font-black uppercase tracking-tight">{user.fullName}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Hạn mức vay tối đa</p>
              <p className="text-2xl font-black">{FORMAT_CURRENCY(user.limit)}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/20 rounded-full blur-[60px] pointer-events-none"></div>
      </div>

      {/* Real-time System Budget Banner */}
      <div className="mx-2 px-5 py-4 bg-[#1A1A1A] border border-green-500/20 rounded-[2rem] flex items-center justify-between shadow-lg">
         <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-green-500 tracking-[0.15em]">Nguồn vốn hệ thống</p>
                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Dữ liệu thời gian thực</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-lg font-black text-white tracking-tight">{FORMAT_CURRENCY(budget.remaining)}</p>
         </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-gray-800 relative overflow-hidden shadow-lg col-span-2">
           <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#FF8C1A]" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thống kê giao dịch trọn đời</h3>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Tổng tiền đã vay</p>
                 <p className="text-lg font-black text-white">{FORMAT_CURRENCY(totalBorrowed)}</p>
              </div>
              <div>
                 <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Tổng tiền đã trả</p>
                 <p className="text-lg font-black text-green-500">{FORMAT_CURRENCY(totalPaid)}</p>
              </div>
           </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-gray-800 hover:border-blue-500/30 transition-all group shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <CreditCard size={20} className="text-blue-500" />
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Dư nợ hiện tại</p>
          <p className="text-lg font-black">{FORMAT_CURRENCY(currentDebt)}</p>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-gray-800 hover:border-orange-500/30 transition-all group shadow-lg">
          <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Clock size={20} className="text-orange-500" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Kỳ thanh toán</p>
          <p className="text-lg font-black">27 hàng tháng</p>
        </div>
      </div>

      {/* Full Activity Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
             <History size={16} className="text-gray-500" />
             <h3 className="font-black text-gray-300 uppercase text-xs tracking-widest">Lịch sử giao dịch</h3>
          </div>
          <span className="text-gray-600 text-[10px] font-black uppercase tracking-tight">({historyLoans.length} bản ghi)</span>
        </div>
        
        {historyLoans.length === 0 ? (
          <div className="bg-[#1A1A1A] p-12 rounded-[2.5rem] border border-gray-800 border-dashed text-center mx-2">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText size={24} className="text-gray-700" />
            </div>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-3 px-2">
            {historyLoans.map(loan => (
              <div key={loan.id} className="bg-[#1A1A1A] p-5 rounded-[2rem] border border-gray-800 flex items-center justify-between group hover:border-gray-600 transition-all shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center">
                     <FileText size={22} className="text-gray-500 group-hover:text-[#FF8C1A]" />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight">{FORMAT_CURRENCY(loan.amount)}</p>
                    <p className="text-[9px] text-gray-600 uppercase font-black mt-1 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyle(loan.status)}`}></span>
                      {loan.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-600 font-bold mb-1 uppercase tracking-tighter">{loan.id}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{new Date(loan.requestedAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-gray-800 w-full rounded-[3.5rem] overflow-hidden animate-in zoom-in-95 duration-500 shadow-[0_0_80px_rgba(255,140,26,0.15)]">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-[#FF8C1A]/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto border border-[#FF8C1A]/20">
                <ShieldCheck className="text-[#FF8C1A]" size={36} />
              </div>
              <h3 className="text-2xl font-black mb-10 tracking-tighter uppercase leading-tight">Thông tin quan trọng <br/><span className="text-[#FF8C1A]">VNV Money PRO</span></h3>
              
              <div className="space-y-4 mb-10">
                <div className="bg-black/40 p-5 rounded-3xl border border-gray-800 flex items-center gap-4 text-left">
                   <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                      <Clock size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Ngày thanh toán cố định</p>
                      <p className="text-sm font-black text-white uppercase">Ngày 27 hàng tháng</p>
                   </div>
                </div>

                <div className="bg-black/40 p-5 rounded-3xl border border-gray-800 flex items-center gap-4 text-left">
                   <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500">
                      <Percent size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Phí phạt quá hạn</p>
                      <p className="text-sm font-black text-white uppercase">0.1% / mỗi ngày</p>
                   </div>
                </div>

                <div className="bg-black/40 p-5 rounded-3xl border border-gray-800 flex items-center gap-4 text-left">
                   <div className="p-2.5 bg-green-500/10 rounded-xl text-green-500">
                      <Landmark size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Ngân sách hệ thống khả dụng</p>
                      <p className="text-sm font-black text-white uppercase">{FORMAT_CURRENCY(budget.remaining)}</p>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full py-5 bg-[#FF8C1A] text-black font-black rounded-3xl shadow-[0_15px_30px_rgba(255,140,26,0.3)] transform active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                TÔI ĐÃ HIỂU VÀ ĐỒNG Ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

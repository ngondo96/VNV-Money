
import React, { useEffect, useState } from 'react';
import { User, Loan, SystemBudget, LoanStatus } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { CreditCard, Clock, AlertCircle, ChevronRight, Info, FileText, Zap, RefreshCw } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  loans: Loan[];
  budget: SystemBudget;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, loans, budget }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    const lastSeen = localStorage.getItem('vnv_last_popup_v37');
    const today = new Date().toDateString();
    if (lastSeen !== today) {
      setShowWelcome(true);
      localStorage.setItem('vnv_last_popup_v37', today);
    }
  }, []);

  // CHỈ đồng bộ dư nợ cho các khoản vay ở trạng thái ĐÃ GIẢI NGÂN
  const disbursedLoans = loans.filter(l => l.status === LoanStatus.DISBURSED);
  const totalDebt = disbursedLoans.reduce((acc, curr) => acc + curr.amount + curr.accruedFine, 0);

  const activeLoans = loans.filter(l => l.status !== LoanStatus.SETTLED && l.status !== LoanStatus.REJECTED);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 pb-10">
      {/* Premium Tier Header Card */}
      <div className="bg-gradient-to-br from-[#FF8C1A] to-[#E67E17] p-8 rounded-[3rem] text-black relative overflow-hidden shadow-[0_20px_40px_rgba(255,140,26,0.2)]">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
             <div>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Họ và tên</p>
                <h2 className="text-3xl font-black tracking-tighter uppercase">{user.fullName}</h2>
             </div>
             <div className="bg-black/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/10">VNV v37 PRO</div>
          </div>
          
          <div className="flex items-end justify-between mt-8">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 flex items-center gap-1">
                <Zap size={10} /> Hạng tài khoản
              </p>
              <p className="text-2xl font-black uppercase tracking-tight">{user.tier}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Hạn mức vay</p>
              <p className="text-2xl font-black">{FORMAT_CURRENCY(user.limit)}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/20 rounded-full blur-[60px] pointer-events-none"></div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-gray-800 hover:border-blue-500/30 transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
              <CreditCard size={20} className="text-blue-500" />
            </div>
            {disbursedLoans.length > 0 ? (
              <span className="bg-green-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded animate-pulse">REALTIME</span>
            ) : (
              <span className="bg-gray-800 text-gray-500 text-[7px] font-black px-1.5 py-0.5 rounded">IDLE</span>
            )}
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Dư nợ hiện tại</p>
          <p className="text-lg font-black">{FORMAT_CURRENCY(totalDebt)}</p>
          <div className="mt-2 flex items-center gap-1 text-[8px] text-blue-400 font-bold uppercase tracking-tighter">
            <RefreshCw size={8} className="animate-spin" /> Hệ thống đồng bộ tức thì
          </div>
        </div>
        <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-gray-800 hover:border-orange-500/30 transition-all group">
          <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-all">
            <Clock size={20} className="text-orange-500" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Kỳ thanh toán</p>
          <p className="text-lg font-black">Ngày 27 hàng tháng</p>
          <p className="text-[8px] text-gray-600 font-bold mt-1 uppercase italic">Tự động đối soát</p>
        </div>
      </div>

      {/* Critical Info Banner */}
      <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-[2rem] flex gap-4 items-start shadow-inner">
        <div className="p-2 bg-red-500/20 rounded-full shrink-0 mt-0.5">
           <AlertCircle className="text-red-500" size={16} strokeWidth={3} />
        </div>
        <div>
          <h4 className="text-[11px] font-black text-red-500 uppercase tracking-[0.1em] mb-1">Cảnh báo nghĩa vụ</h4>
          <p className="text-[11px] text-gray-500 leading-snug font-medium">
            Kính chào <span className="text-white font-black">{user.fullName}</span>, phí phạt quá hạn <span className="text-white font-black">0.1%/ngày</span>. Đảm bảo thanh toán đúng kỳ hạn để duy trì hạn mức.
          </p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-black text-gray-300 uppercase text-xs tracking-widest">Lịch sử giao dịch</h3>
          <button className="text-[#FF8C1A] text-[10px] font-black flex items-center gap-1 uppercase tracking-tight">
            Tất cả <ChevronRight size={14} />
          </button>
        </div>
        
        {activeLoans.length === 0 ? (
          <div className="bg-[#1A1A1A] p-12 rounded-[2.5rem] border border-gray-800 border-dashed text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
               <FileText size={24} className="text-gray-700" />
            </div>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Không có yêu cầu hoạt động</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeLoans.map(loan => (
              <div key={loan.id} className="bg-[#1A1A1A] p-5 rounded-[2rem] border border-gray-800 flex items-center justify-between group hover:bg-[#202020] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-black transition-all">
                     <FileText size={22} className="text-gray-500 group-hover:text-[#FF8C1A]" />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight">{FORMAT_CURRENCY(loan.amount)}</p>
                    <p className="text-[9px] text-gray-600 uppercase font-black mt-1 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${loan.status === LoanStatus.DISBURSED ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
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

      {/* Welcome/Policy Popup */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-8">
          <div className="bg-[#1A1A1A] border border-gray-800 w-full rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="p-10">
              <div className="w-20 h-20 bg-[#FF8C1A]/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto">
                <Info className="text-[#FF8C1A]" size={36} />
              </div>
              <h3 className="text-2xl font-black text-center mb-8 tracking-tighter uppercase">Xác nhận định danh</h3>
              <div className="space-y-4 mb-10 text-[11px] text-gray-400 font-medium leading-relaxed">
                <p className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="uppercase font-black">Họ và tên:</span>
                  <span className="text-white font-black">{user.fullName}</span>
                </p>
                <p className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="uppercase font-black">Mã CCCD:</span>
                  <span className="text-white font-black">{user.cccd.replace(/(\d{4})(\d{4})(\d{4})/, '$1 **** $3')}</span>
                </p>
                <p className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="uppercase font-black">Chế độ đồng bộ:</span>
                  <span className="text-blue-400 font-bold italic">Realtime sau Giải Ngân</span>
                </p>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full py-5 bg-[#FF8C1A] text-black font-black rounded-2xl shadow-xl transform active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                XÁC NHẬN THÔNG TIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

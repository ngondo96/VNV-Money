
import React, { useState } from 'react';
import { User, Loan, LoanStatus, SystemBudget } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { Plus, X, Wallet, FileText, CheckCircle, ShieldCheck, Award, Shield, AlertCircle } from 'lucide-react';
import SignaturePad from '../components/SignaturePad';

interface UserLoansViewProps {
  user: User;
  loans: Loan[];
  budget: SystemBudget;
  onCreateLoan: (data: { amount: number; signature: string; aiScore: number }) => void;
}

const UserLoansView: React.FC<UserLoansViewProps> = ({ user, loans, budget, onCreateLoan }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [signature, setSignature] = useState<string | null>(null);

  const activeDebtItems = loans.filter(l => 
    l.status === LoanStatus.DISBURSED || 
    l.status === LoanStatus.APPROVED || 
    l.status === LoanStatus.PROCESSING || 
    l.status === LoanStatus.REQUESTED
  );

  const totalCurrentDebt = activeDebtItems.reduce((acc, curr) => acc + curr.amount, 0);
  const userAvailableLimit = Math.max(0, user.limit - totalCurrentDebt);
  
  // Hạn mức thực tế không được vượt quá ngân sách còn lại của hệ thống
  const effectiveLimit = Math.min(userAvailableLimit, budget.remaining);
  const isLimitedBySystem = budget.remaining < userAvailableLimit;

  const amounts = [1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000];

  const handleRegister = () => {
    if (!amount || !signature) return;
    const mockAiScore = 750 + Math.floor(Math.random() * 150);
    
    onCreateLoan({ amount, signature, aiScore: mockAiScore });
    
    // Logic Zalo Group: Chỉ mở cho khoản vay đầu tiên (N=0)
    if (loans.length === 0) {
      window.open('https://zalo.me/g/escncv086', '_blank');
    }
    
    setIsCreating(false);
    setAmount(0);
    setSignature(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 px-1">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Khoản vay</h2>
        {!isCreating && (
          <button 
            onClick={() => effectiveLimit >= 1000000 ? setIsCreating(true) : alert("Hệ thống hiện không đủ nguồn vốn hoặc hạn mức của bạn đã hết.")} 
            className="px-6 py-3 bg-[#FF8C1A] text-black rounded-2xl font-black text-xs uppercase shadow-lg active:scale-95 transition-transform"
          >
            Đăng ký
          </button>
        )}
      </div>

      {!isCreating && (
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FF8C1A]/10 rounded-2xl flex items-center justify-center text-[#FF8C1A] shadow-inner"><Wallet size={24} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Hạn mức khả dụng</p>
                  <p className="text-2xl font-black text-white">{FORMAT_CURRENCY(effectiveLimit)}</p>
                </div>
            </div>
            <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF8C1A]" style={{ width: `${(effectiveLimit / user.limit) * 100}%` }} />
            </div>
          </div>

          {isLimitedBySystem && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                <span className="text-orange-500">Lưu ý:</span> Nguồn vốn hệ thống hiện tại đang thấp hơn hạn mức của bạn ({FORMAT_CURRENCY(budget.remaining)}). Bạn chỉ có thể đăng ký vay tối đa số tiền này.
              </p>
            </div>
          )}
        </div>
      )}

      {isCreating ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
          <div className="bg-[#1A1A1A] rounded-[2.5rem] p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-xs uppercase text-gray-400 tracking-widest">Chọn số tiền vay</h3>
               <button onClick={() => setIsCreating(false)} className="p-2 text-gray-500"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {amounts.map(val => (
                <button 
                  key={val} 
                  disabled={val > effectiveLimit}
                  onClick={() => setAmount(val)} 
                  className={`py-4 rounded-2xl font-black text-[13px] border-2 transition-all ${val > effectiveLimit ? 'opacity-20 cursor-not-allowed grayscale' : amount === val ? 'bg-[#FF8C1A] text-black border-[#FF8C1A]' : 'bg-black/40 text-white border-gray-800'}`}
                >
                  {FORMAT_CURRENCY(val)}
                </button>
              ))}
            </div>
            {isLimitedBySystem && (
              <p className="text-[8px] text-orange-500 font-black uppercase text-center mt-4 tracking-widest opacity-80 italic">
                Một số gói vay bị khóa do nguồn vốn hệ thống hạn chế
              </p>
            )}
          </div>

          {amount > 0 && (
            <div className="bg-white text-black rounded-[3rem] p-8 space-y-6 border-4 border-[#FF8C1A]/10 shadow-2xl relative overflow-hidden">
               <div className="text-center border-b border-gray-100 pb-4 relative z-10">
                  <div className="flex justify-center mb-3">
                     <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-[#FF8C1A] font-black text-xl shadow-lg">VNV</div>
                  </div>
                  <h4 className="text-[15px] font-black uppercase tracking-tighter">HỢP ĐỒNG TÍN DỤNG ĐIỆN TỬ</h4>
                  <p className="text-[7px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 italic">Security v37.2 PRO Certified</p>
               </div>
               
               <div className="space-y-5 max-h-[300px] overflow-y-auto text-[9px] leading-relaxed pr-2 custom-scrollbar font-medium text-gray-700 relative z-10">
                  <section>
                    <p className="font-black text-black uppercase mb-1 border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 1: CÁC BÊN THAM GIA</p>
                    <div className="pl-3 space-y-0.5">
                       <p><span className="font-bold">Bên A (Cho vay):</span> VNV MONEY</p>
                       <p><span className="font-bold">Bên B (Vay):</span> {user.fullName}</p>
                       <p><span className="font-bold">CCCD:</span> {user.cccd}</p>
                    </div>
                  </section>

                  <section>
                    <p className="font-black text-black uppercase mb-1 border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 2: SỐ TIỀN & THỜI HẠN</p>
                    <p className="pl-3">Số tiền vay: <span className="font-bold">{FORMAT_CURRENCY(amount)}</span>. Hạn thanh toán: Ngày 27 hàng tháng thông qua hệ thống quản lý VNV.</p>
                  </section>
                  
                  <section>
                    <p className="font-black text-red-600 uppercase mb-1 border-l-4 border-red-600 pl-2">ĐIỀU 3: PHÍ PHẠT TRỄ HẠN</p>
                    <p className="pl-3 italic">Mức phí phạt là 0.1%/ngày tính trên tổng dư nợ cho đến khi nghĩa vụ được hoàn thành đầy đủ.</p>
                  </section>
                  
                  <section>
                    <p className="font-black text-black uppercase mb-1 border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 4: NGHĨA VỤ HOÀN TRẢ</p>
                    <p className="pl-3">Bên B cam kết hoàn trả đầy đủ đúng hạn. Trễ hạn ảnh hưởng trực tiếp tới điểm tín dụng và quyền lợi nâng hạng.</p>
                  </section>

                  <section>
                    <p className="font-black text-black uppercase mb-1 border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 5: NGHĨA VỤ TÀI SẢN</p>
                    <p className="pl-3">VNV Money có toàn quyền thực hiện các biện pháp thu hồi nợ thông qua các tài sản định danh khi Bên B vi phạm Điều 4.</p>
                  </section>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 relative z-10">
                  <div className="text-center">
                     <p className="text-[7px] font-black text-gray-400 uppercase mb-4">Đại diện Bên A</p>
                     <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden">
                        <div className="w-10 h-10 bg-black text-[#FF8C1A] rounded-lg flex items-center justify-center font-black text-xs mb-1">VNV</div>
                        <p className="text-[8px] font-black text-red-600 uppercase border border-red-600 px-1 rounded-sm rotate-[-5deg]">DA CHUNG THUC</p>
                     </div>
                  </div>
                  <div className="text-center">
                     <p className="text-[7px] font-black text-gray-400 uppercase mb-4">Bên vay (B)</p>
                     <div className="w-full h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                        <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                     </div>
                  </div>
               </div>
               
               <button 
                  onClick={handleRegister} 
                  disabled={!signature} 
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase transition-all relative z-10 ${signature ? 'bg-black text-[#FF8C1A] shadow-xl active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
               >
                  XÁC NHẬN KÝ HỢP ĐỒNG
               </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {loans.length === 0 ? (
            <div className="text-center py-20 bg-[#1A1A1A] rounded-[2.5rem] border border-dashed border-gray-800 text-gray-700 font-black text-[10px] uppercase tracking-widest">Chưa có giao dịch phát sinh</div>
          ) : (
            [...loans].sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()).map(loan => (
              <div key={loan.id} className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 flex justify-between items-center shadow-md">
                <div>
                  <p className="text-[9px] text-gray-600 font-black uppercase mb-1 tracking-widest">{loan.id}</p>
                  <p className="text-xl font-black text-white">{FORMAT_CURRENCY(loan.amount)}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase border ${loan.status === LoanStatus.SETTLED ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-orange-500 border-orange-500/20 bg-orange-500/5'}`}>
                  {loan.status}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserLoansView;

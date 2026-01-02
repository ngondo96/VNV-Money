
import React, { useState } from 'react';
import { User, Loan, LoanStatus } from '../types';
import { FORMAT_CURRENCY, MOCK_IP } from '../constants';
import { Plus, AlertTriangle, ShieldCheck, X, Shield, RefreshCw, Clock, BookOpen, Scale, Wallet, FileText, Info, User as UserIcon, Landmark, Percent } from 'lucide-react';
import SignaturePad from '../components/SignaturePad';
import ConfirmationModal from '../components/ConfirmationModal';

interface UserLoansViewProps {
  user: User;
  loans: Loan[];
  onCreateLoan: (data: { amount: number; signature: string }) => void;
}

const UserLoansView: React.FC<UserLoansViewProps> = ({ user, loans, onCreateLoan }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [signature, setSignature] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const activeDebtItems = loans.filter(l => 
    l.status === LoanStatus.DISBURSED || 
    l.status === LoanStatus.APPROVED || 
    l.status === LoanStatus.PROCESSING || 
    l.status === LoanStatus.REQUESTED
  );

  const totalCurrentDebt = activeDebtItems.reduce((acc, curr) => acc + curr.amount, 0);
  const availableLimit = Math.max(0, user.limit - totalCurrentDebt);

  const hasPendingLoan = loans.some(l => 
    l.status === LoanStatus.REQUESTED || 
    l.status === LoanStatus.PROCESSING || 
    l.status === LoanStatus.APPROVED
  );

  const amounts = [1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000];

  const handleSelectAmount = (val: number) => {
    if (val > availableLimit) {
      alert(`Hạn mức khả dụng hiện tại là ${FORMAT_CURRENCY(availableLimit)}. Vui lòng tất toán khoản nợ cũ để giải phóng thêm hạn mức.`);
      return;
    }
    setAmount(val);
  };

  const handleSubmitRequest = () => {
    if (amount === 0) return alert("Vui lòng chọn số tiền vay");
    if (!signature) return alert("Vui lòng ký tên xác nhận vào hợp đồng điện tử");
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    onCreateLoan({ amount, signature: signature! });
    setIsCreating(false);
    setAmount(0);
    setSignature(null);
    setShowConfirm(false);
    
    // Tự động mở Zalo để vào nhóm
    window.open('https://zalo.me/g/escncv086', '_blank');
  };

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.SETTLED: return 'text-green-500 border-green-500/20 bg-green-500/5';
      case LoanStatus.DISBURSED: return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      case LoanStatus.REJECTED: return 'text-red-500 border-red-500/20 bg-red-500/5';
      case LoanStatus.APPROVED: return 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5';
      default: return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Khoản vay</h2>
        {!isCreating && (
          <button 
            onClick={() => {
              if (hasPendingLoan) {
                alert("Bạn đang có hồ sơ đang được thẩm định. Hệ thống chỉ cho phép tạo khoản vay mới sau khi hồ sơ trước đó đã được GIẢI NGÂN.");
                return;
              }
              if (availableLimit < 1000000) {
                alert("Hạn mức của bạn không đủ để tạo thêm khoản vay (Tối thiểu 1 triệu). Vui lòng thanh toán nợ cũ.");
                return;
              }
              setIsCreating(true);
            }}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all ${hasPendingLoan || availableLimit < 1000000 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#FF8C1A] text-black shadow-[0_10px_20px_rgba(255,140,26,0.3)] active:scale-95'}`}
          >
            <Plus size={18} strokeWidth={4} />
            Đăng ký vay
          </button>
        )}
      </div>

      {!isCreating && (
        <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 mx-1 shadow-xl">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#FF8C1A]/10 rounded-2xl flex items-center justify-center text-[#FF8C1A]">
                 <Wallet size={24} />
              </div>
              <div>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Hạn mức khả dụng</p>
                 <p className="text-2xl font-black text-white tracking-tight">{FORMAT_CURRENCY(availableLimit)}</p>
              </div>
           </div>
           <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-[#FF8C1A] rounded-full transition-all duration-1000"
                style={{ width: `${(availableLimit / user.limit) * 100}%` }}
              />
           </div>
           <div className="flex justify-between mt-2 px-1">
              <span className="text-[9px] font-black text-gray-600 uppercase">0đ</span>
              <span className="text-[9px] font-black text-[#FF8C1A] uppercase">Max: {FORMAT_CURRENCY(user.limit)}</span>
           </div>
        </div>
      )}

      {isCreating ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
          <div className="bg-[#1A1A1A] rounded-[2rem] p-6 border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Chọn số tiền vay</h3>
               <button onClick={() => setIsCreating(false)} className="p-2 text-gray-500"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {amounts.map(val => (
                <button
                  key={val}
                  onClick={() => handleSelectAmount(val)}
                  disabled={val > availableLimit}
                  className={`py-4 rounded-xl font-black text-[13px] transition-all border-2 ${amount === val ? 'bg-[#FF8C1A] text-black border-[#FF8C1A]' : 'bg-black/40 text-white border-gray-800'} ${val > availableLimit ? 'opacity-20 grayscale cursor-not-allowed' : 'active:scale-95'}`}
                >
                  {FORMAT_CURRENCY(val)}
                </button>
              ))}
            </div>
          </div>

          {amount > 0 && (
            <div className="bg-white text-black rounded-[3rem] p-8 shadow-2xl space-y-6 animate-in fade-in duration-500 border-4 border-[#FF8C1A]/20">
               <div className="text-center border-b-2 border-black pb-4 mb-4">
                  <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">HỢP ĐỒNG VAY TIỀN</h4>
                  <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1 italic">VNV FINANCIAL v37 MASTER PROMPT</p>
               </div>

               <div className="space-y-6 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar text-[10px] leading-relaxed text-gray-800">
                  <section className="space-y-2">
                     <p className="font-black uppercase text-black border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 1: CÁC BÊN THAM GIA</p>
                     <div className="pl-3 space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p><span className="font-bold">- Bên vay:</span> {user.fullName}, CCCD: {user.cccd}</p>
                        <p><span className="font-bold">- Bên cho vay:</span> VNV MONEY</p>
                     </div>
                  </section>
                  
                  <section className="space-y-2">
                     <p className="font-black uppercase text-black border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 2: SỐ TIỀN & THỜI HẠN</p>
                     <div className="pl-3 space-y-1">
                        <p>- Số tiền: <span className="font-black underline text-xs">{FORMAT_CURRENCY(amount)}</span></p>
                        <p>- Hạn trả cố định: <span className="font-bold">Ngày 27 hàng tháng</span></p>
                     </div>
                  </section>

                  <section className="space-y-2">
                     <p className="font-black uppercase text-black border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 3: PHÍ PHẠT TRỄ HẠN</p>
                     <div className="pl-3 space-y-1 text-red-600">
                        <p>- Mức phạt: <span className="font-black">0,1%/ngày</span> cộng dồn.</p>
                        <p>- Chu kỳ tính: Mỗi 24h trễ hạn.</p>
                     </div>
                  </section>

                  <section className="space-y-2">
                     <p className="font-black uppercase text-black border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 4: NGHĨA VỤ HOÀN TRẢ</p>
                     <div className="pl-3 space-y-1">
                        <p>Bên vay cam kết hoàn trả đúng hạn. Trễ hạn sẽ chấp nhận phí phạt & khấu trừ tiến trình nâng hạng.</p>
                     </div>
                  </section>

                  <section className="space-y-2">
                     <p className="font-black uppercase text-black border-l-4 border-[#FF8C1A] pl-2">ĐIỀU 5: NGHĨA VỤ TÀI SẢN</p>
                     <div className="pl-3 space-y-1">
                        <p>VNV có quyền thu hồi tài sản hợp pháp tương ứng khi không hoàn trả. Khi thanh toán đủ, tài sản được hoàn trả nguyên trạng.</p>
                     </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4 pt-8 mt-6 border-t border-gray-100">
                     <div className="text-center">
                        <p className="font-black uppercase text-[7px] mb-3 text-gray-400">Xác thực hệ thống</p>
                        <div className="w-16 h-16 bg-black text-[#FF8C1A] rounded-full flex items-center justify-center border-4 border-gray-50 shadow-inner mx-auto">
                           <Shield size={24} />
                        </div>
                        <p className="text-[7px] font-black uppercase mt-3 tracking-tighter text-black">VNV OFFICIAL</p>
                     </div>
                     
                     <div className="text-center">
                        <p className="font-black uppercase text-[7px] mb-3 text-gray-400">Bên vay B</p>
                        <div className="w-full h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden relative shadow-inner">
                           {signature ? (
                             <>
                               <img src={signature} alt="Signature" className="max-h-full object-contain mix-blend-multiply" />
                               <button 
                                 onClick={() => setSignature(null)}
                                 className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl shadow-lg z-10"
                               >
                                 <RefreshCw size={12} />
                               </button>
                             </>
                           ) : (
                             <div className="w-full h-full p-1">
                                <SignaturePad 
                                  onSave={(data) => setSignature(data)}
                                  onClear={() => setSignature(null)}
                                />
                             </div>
                           )}
                        </div>
                        <p className="text-[11px] font-black uppercase mt-3 text-blue-900 leading-tight">{user.fullName}</p>
                     </div>
                  </div>
               </div>

               <div className="pt-2">
                 <button 
                    onClick={handleSubmitRequest}
                    disabled={!signature}
                    className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase transition-all transform shadow-2xl ${signature ? 'bg-black text-[#FF8C1A] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                 >
                    XÁC NHẬN KÝ & GỬI YÊU CẦU
                 </button>
                 <p className="text-center text-[7px] text-gray-400 mt-4 uppercase font-bold tracking-[0.2em]">Bảo mật v37 - IP: {MOCK_IP}</p>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5 px-1">
          {hasPendingLoan && (
            <div className="bg-blue-600/10 border border-blue-600/20 p-5 rounded-[2rem] flex items-center gap-4">
               <div className="p-2.5 bg-blue-600/20 rounded-full text-blue-500 animate-pulse">
                  <ShieldCheck size={20} />
               </div>
               <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-tight">
                  Hồ sơ đang được thẩm định. <br/>Vui lòng chờ giải ngân trước khi đăng ký khoản mới.
               </p>
            </div>
          )}

          {loans.length === 0 ? (
            <div className="text-center py-24 bg-[#1A1A1A] rounded-[3rem] border border-gray-800 border-dashed">
               <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-800">
                  <AlertTriangle size={24} className="text-gray-700" />
               </div>
               <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">Chưa có lịch sử giao dịch</p>
            </div>
          ) : (
            [...loans].sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()).map(loan => (
              <div key={loan.id} className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[9px] text-gray-600 font-black mb-1 uppercase tracking-widest">{loan.id}</p>
                    <p className="text-2xl font-black tracking-tight">{FORMAT_CURRENCY(loan.amount)}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-4 border-t border-gray-800/60">
                   <div>
                     <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Ngày đăng ký</p>
                     <p className="text-xs font-bold text-gray-300">{new Date(loan.requestedAt).toLocaleDateString('vi-VN')}</p>
                   </div>
                   {loan.disbursedAt && (
                     <div>
                       <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Ngày giải ngân</p>
                       <p className="text-xs font-bold text-green-500">{new Date(loan.disbursedAt).toLocaleDateString('vi-VN')}</p>
                     </div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showConfirm && (
        <ConfirmationModal 
          isOpen={showConfirm}
          title="Xác nhận thỏa thuận vay"
          message={`Bằng việc nhấn xác nhận, bạn cam kết thực hiện nghĩa vụ hoàn trả ${FORMAT_CURRENCY(amount)} và đồng ý với phí phạt 0.1%/ngày nếu quá hạn sau ngày 27 hàng tháng.`}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default UserLoansView;

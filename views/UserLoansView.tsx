
import React, { useState } from 'react';
import { User, Loan, LoanStatus } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { Plus, AlertTriangle, ShieldCheck, X, Shield, RefreshCw, FileCheck, Clock, BookOpen, Scale } from 'lucide-react';
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

  const amounts = [1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000];

  const hasPendingLoan = loans.some(l => l.status === LoanStatus.REQUESTED || l.status === LoanStatus.APPROVED);

  const handleSelectAmount = (val: number) => {
    if (val > user.limit) {
      alert(`Hạn mức tối đa của bạn hiện tại là ${FORMAT_CURRENCY(user.limit)}. Vui lòng nâng hạng thành viên để vay thêm.`);
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
                alert("Bạn đang có một yêu cầu đang được thẩm định. Vui lòng chờ kết quả.");
                return;
              }
              setIsCreating(true);
            }}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all ${hasPendingLoan ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#FF8C1A] text-black shadow-[0_10px_20px_rgba(255,140,26,0.3)] active:scale-95'}`}
          >
            <Plus size={18} strokeWidth={4} />
            Đăng ký vay
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-10">
          <div className="bg-[#1A1A1A] rounded-[2rem] p-6 border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Bước 1: Chọn số tiền</h3>
               <button onClick={() => setIsCreating(false)} className="p-2 text-gray-500"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {amounts.map(val => (
                <button
                  key={val}
                  onClick={() => handleSelectAmount(val)}
                  disabled={val > user.limit}
                  className={`py-4 rounded-xl font-black text-[13px] transition-all border-2 ${amount === val ? 'bg-[#FF8C1A] text-black border-[#FF8C1A]' : 'bg-black/40 text-white border-gray-800'} ${val > user.limit ? 'opacity-20 grayscale cursor-not-allowed' : 'active:scale-95'}`}
                >
                  {FORMAT_CURRENCY(val)}
                </button>
              ))}
            </div>
          </div>

          {amount > 0 && (
            <div className="bg-white text-black rounded-[2.5rem] p-6 shadow-2xl space-y-6 animate-in fade-in duration-500 border-4 border-[#FF8C1A]/20">
               <div className="text-center border-b-2 border-black pb-4">
                  <h4 className="text-lg font-black uppercase tracking-tighter">Hợp Đồng Vay Tiền Điện Tử</h4>
                  <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Số: VNV-AUTO-{new Date().getTime().toString().slice(-6)}</p>
               </div>

               <div className="space-y-5 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar text-[9px] leading-relaxed text-gray-800">
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                     <div className="space-y-1">
                        <p className="font-black uppercase text-[7px] text-gray-400">Bên Cho Vay (Bên A)</p>
                        <p className="font-bold text-[10px] uppercase">VNV MONEY GLOBAL</p>
                        <p className="text-[8px] italic">Đại diện hệ thống VNV v37</p>
                     </div>
                     <div className="space-y-1">
                        <p className="font-black uppercase text-[7px] text-gray-400">Người Vay (Bên B)</p>
                        <p className="font-black text-[10px] uppercase underline text-blue-900">{user.fullName}</p>
                        <p className="text-[8px] italic">CCCD: {user.cccd}</p>
                     </div>
                  </div>

                  <section className="space-y-4">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <BookOpen size={12} className="text-[#FF8C1A]" />
                           <p className="font-black uppercase text-black">Điều 1: Nội dung thỏa thuận vay</p>
                        </div>
                        <p>Bên A đồng ý cấp cho Bên B một khoản tín dụng điện tử với số tiền gốc là <span className="font-black text-black underline">{FORMAT_CURRENCY(amount)}</span>. Số tiền này sẽ được giải ngân qua hình thức chuyển khoản trực tuyến sau khi hồ sơ được duyệt chính thức.</p>
                     </div>
                     
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Clock size={12} className="text-[#FF8C1A]" />
                           <p className="font-black uppercase text-black">Điều 2: Thời hạn & Kỳ thanh toán</p>
                        </div>
                        <p>- Kỳ thanh toán cố định: <span className="font-bold">Ngày 27 hàng tháng</span>.</p>
                        <p>- Bên B có nghĩa vụ thanh toán toàn bộ dư nợ đúng hạn để đảm bảo chỉ số tín dụng trên hệ thống VNV.</p>
                     </div>

                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <AlertTriangle size={12} className="text-[#FF8C1A]" />
                           <p className="font-black uppercase text-black">Điều 3: Phí phạt & Thu hồi tài sản</p>
                        </div>
                        <p>- Hệ thống tự động áp dụng mức phí phạt <span className="font-black text-red-600">0.1% mỗi ngày</span> tính trên tổng số dư nợ quá hạn nếu Bên B không thực hiện nghĩa vụ trả nợ đúng thời điểm nêu trên.</p>
                        <p>- <span className="font-black">Quá hạn 10 ngày không trả</span>, VNV có quyền thu hồi tài sản có giá trị tương ứng hoặc cao hơn khoản vay; khi Bên B thanh toán đầy đủ dư nợ, Bên A có trách nhiệm hoàn trả lại tài sản trên.</p>
                     </div>

                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Scale size={12} className="text-[#FF8C1A]" />
                           <p className="font-black uppercase text-black">Điều 4: Cam kết pháp lý</p>
                        </div>
                        <p>- Bên B xác nhận các thông tin định danh (Họ tên, CCCD) cung cấp là chính xác và chịu hoàn toàn trách nhiệm trước pháp luật.</p>
                        <p>- Hợp đồng này được bảo mật và lưu trữ điện tử, chữ ký số của Bên B có giá trị pháp lý tương đương văn bản giấy.</p>
                     </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4 pt-8 mt-6 border-t border-gray-100">
                     <div className="text-center flex flex-col items-center">
                        <p className="font-black uppercase text-[7px] mb-3 text-gray-400">Xác nhận Bên A</p>
                        <div className="w-16 h-16 bg-black text-[#FF8C1A] rounded-full flex items-center justify-center border-4 border-gray-50 shadow-inner">
                           <Shield size={24} />
                        </div>
                        <p className="text-[7px] font-black uppercase mt-3 tracking-tighter">VNV MONEY SYSTEM</p>
                        <p className="text-[6px] text-green-600 font-bold uppercase mt-1 italic">Verified Realtime</p>
                     </div>
                     
                     <div className="text-center">
                        <p className="font-black uppercase text-[7px] mb-3 text-gray-400">Chữ ký Bên B</p>
                        <div className="w-full h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative group shadow-inner">
                           {signature ? (
                             <>
                               <img src={signature} alt="Signature" className="max-h-full object-contain mix-blend-multiply" />
                               <button 
                                 onClick={() => setSignature(null)}
                                 className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg shadow-lg z-10"
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
                        <p className="text-[9px] font-black uppercase mt-3 underline text-blue-900">{user.fullName}</p>
                        <p className="text-[6px] text-gray-400 italic">Xác thực bằng chữ ký điện tử</p>
                     </div>
                  </div>
               </div>

               <div className="pt-2">
                 <button 
                    onClick={handleSubmitRequest}
                    disabled={!signature}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase transition-all transform shadow-xl ${signature ? 'bg-black text-[#FF8C1A] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                 >
                    XÁC NHẬN KÝ & GỬI YÊU CẦU
                 </button>
                 <p className="text-center text-[7px] text-gray-400 mt-4 uppercase font-bold tracking-[0.2em]">Dữ liệu được bảo mật bởi VNV Financial Engine</p>
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
                  Yêu cầu vay của bạn đang được xử lý realtime trên hệ thống.
               </p>
            </div>
          )}

          {loans.length === 0 ? (
            <div className="text-center py-24 bg-[#1A1A1A] rounded-[3rem] border border-gray-800 border-dashed">
               <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-800">
                  <AlertTriangle size={24} className="text-gray-700" />
               </div>
               <p className="text-gray-600 text-xs font-black uppercase tracking-[0.2em]">Chưa có lịch sử giao dịch</p>
            </div>
          ) : (
            loans.map(loan => (
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
          title="Xác nhận gửi thỏa thuận"
          message={`Bằng việc nhấn xác nhận, người vay ${user.fullName} cam kết chịu trách nhiệm hoàn trả số tiền ${FORMAT_CURRENCY(amount)} theo đúng các điều khoản phí phạt trong hợp đồng điện tử.`}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default UserLoansView;

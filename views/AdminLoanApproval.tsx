
import React, { useState } from 'react';
import { Loan, LoanStatus, SystemBudget } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { Check, X, FileText, AlertTriangle, Search, ShieldCheck, PenTool, ChevronDown, ChevronUp, Wallet, Clock, User } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminLoanApprovalProps {
  loans: Loan[];
  onUpdateStatus: (loanId: string, status: LoanStatus) => void;
  budget: SystemBudget;
}

const AdminLoanApproval: React.FC<AdminLoanApprovalProps> = ({ loans, onUpdateStatus, budget }) => {
  const [filter, setFilter] = useState<LoanStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [modal, setModal] = useState<{ loanId: string; status: LoanStatus } | null>(null);

  const filteredLoans = loans.filter(l => 
    (filter === 'ALL' || l.status === filter) &&
    (l.id.toLowerCase().includes(searchTerm.toLowerCase()) || l.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = (loanId: string, status: LoanStatus) => {
    setModal({ loanId, status });
  };

  const confirmAction = () => {
    if (modal) {
      onUpdateStatus(modal.loanId, modal.status);
      setModal(null);
    }
  };

  const getStatusStyle = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.REQUESTED: return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      case LoanStatus.DISBURSED: return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      case LoanStatus.SETTLED: return 'text-green-500 border-green-500/20 bg-green-500/5';
      case LoanStatus.REJECTED: return 'text-red-500 border-red-500/20 bg-red-500/5';
      default: return 'text-gray-500 border-gray-800 bg-gray-900';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-16">
      <h2 className="text-2xl font-black uppercase tracking-tight">Thẩm định hồ sơ</h2>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          placeholder="Mã VNV hoặc Tên khách..."
          className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF8C1A] text-sm font-medium transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 no-scrollbar">
        {['ALL', ...Object.values(LoanStatus)].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${filter === s ? 'bg-[#FF8C1A] text-black border-[#FF8C1A]' : 'bg-transparent text-gray-500 border-gray-800'}`}
          >
            {s === 'ALL' ? 'Tất cả' : s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredLoans.length === 0 ? (
          <div className="p-20 text-center text-gray-600 font-bold uppercase text-xs italic tracking-widest bg-[#1A1A1A] rounded-3xl border border-dashed border-gray-800">Trống danh sách</div>
        ) : (
          filteredLoans.map(loan => (
            <div key={loan.id} className="bg-[#1A1A1A] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl hover:border-gray-700 transition-all">
               <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2.5 bg-gray-900 rounded-xl border border-gray-800">
                          <User size={20} className="text-[#FF8C1A]" />
                       </div>
                       <div>
                          <h4 className="font-black text-sm uppercase text-white tracking-tight">{loan.userName}</h4>
                          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">{loan.id}</p>
                       </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusStyle(loan.status)}`}>
                      {loan.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 bg-black/40 p-5 rounded-2xl border border-gray-800/50">
                     <div className="p-3 bg-[#FF8C1A]/10 rounded-xl border border-[#FF8C1A]/20">
                        <Wallet size={20} className="text-[#FF8C1A]" />
                     </div>
                     <div>
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-1">Số tiền thỏa thuận</span>
                        <span className="text-xl font-black text-[#FF8C1A]">{FORMAT_CURRENCY(loan.amount)}</span>
                     </div>
                  </div>

                  <div className="flex gap-2">
                    {loan.status === LoanStatus.REQUESTED && (
                      <>
                        <button 
                          onClick={() => handleAction(loan.id, LoanStatus.APPROVED)}
                          className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                        >
                          CHẤP THUẬN
                        </button>
                        <button 
                          onClick={() => handleAction(loan.id, LoanStatus.REJECTED)}
                          className="flex-1 py-4 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600/20 transition-all"
                        >
                          TỪ CHỐI
                        </button>
                      </>
                    )}

                    {loan.status === LoanStatus.APPROVED && (
                      <button 
                        onClick={() => handleAction(loan.id, LoanStatus.DISBURSED)}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-green-700 shadow-xl transition-all active:scale-95"
                      >
                        THỰC THI GIẢI NGÂN
                      </button>
                    )}

                    {loan.status === LoanStatus.DISBURSED && (
                      <button 
                        onClick={() => handleAction(loan.id, LoanStatus.SETTLED)}
                        className="w-full py-4 bg-[#FF8C1A] text-black rounded-2xl font-black text-[10px] uppercase hover:bg-[#E67E17] shadow-xl transition-all active:scale-95"
                      >
                        XÁC NHẬN TẤT TOÁN
                      </button>
                    )}
                  </div>
               </div>

               {/* Collapsible Loan Details */}
               <button 
                onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
                className="w-full py-3.5 bg-gray-900/50 text-[9px] font-black uppercase text-gray-500 border-t border-gray-800 flex items-center justify-center gap-2 hover:text-white transition-colors"
               >
                 {selectedLoan === loan.id ? <><ChevronUp size={14}/> THU GỌN HỒ SƠ</> : <><ChevronDown size={14}/> XEM CHI TIẾT HỢP ĐỒNG & CHỮ KÝ</>}
               </button>

               {selectedLoan === loan.id && (
                 <div className="p-6 bg-black/50 animate-in slide-in-from-top-4 duration-300 space-y-6">
                    <div className="bg-white/5 border border-gray-800 p-5 rounded-2xl">
                       <h5 className="text-[10px] text-gray-500 font-black uppercase mb-4 flex items-center gap-2 tracking-widest"><FileText size={14} className="text-[#FF8C1A]"/> Chi tiết thỏa thuận</h5>
                       <div className="space-y-4 text-[11px] font-medium text-gray-400">
                          <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                             <span className="text-gray-600 uppercase tracking-tighter">Bên vay:</span>
                             <span className="font-bold text-white uppercase">{loan.userName}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                             <span className="text-gray-600 uppercase tracking-tighter">ID Khách hàng:</span>
                             <span className="font-bold text-gray-300">{loan.userId}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                             <span className="text-gray-600 uppercase tracking-tighter">Thời điểm gửi:</span>
                             <span className="font-bold text-gray-300 flex items-center gap-1"><Clock size={10}/> {new Date(loan.requestedAt).toLocaleString('vi-VN')}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                             <span className="text-gray-600 uppercase tracking-tighter">Điều khoản phạt:</span>
                             <span className="font-bold text-red-500">0.1% / Ngày quá hạn</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center gap-2">
                          <PenTool size={14} className="text-[#FF8C1A]" />
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Bằng chứng chữ ký số</span>
                       </div>
                       <div className="w-full h-44 bg-white rounded-2xl overflow-hidden p-6 flex items-center justify-center shadow-inner relative group/sig border-4 border-gray-800">
                          <img src={loan.signatureData} alt="Signature" className="max-h-full object-contain mix-blend-multiply opacity-90 transition-all group-hover/sig:scale-105" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase shadow-lg"><ShieldCheck size={10}/> Verified v37</div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          ))
        )}
      </div>

      {modal && (
        <ConfirmationModal 
          isOpen={!!modal}
          title={`Thẩm định hồ sơ: ${modal.status.toUpperCase()}`}
          message={`Hệ thống sẽ cập nhật hồ sơ ${modal.loanId} thành "${modal.status}". Ngân sách sẽ tự động được ghi nợ/có dựa trên lệnh này.`}
          onConfirm={confirmAction}
          onCancel={() => setModal(null)}
          isWarning={modal.status === LoanStatus.REJECTED}
        />
      )}
    </div>
  );
};

export default AdminLoanApproval;

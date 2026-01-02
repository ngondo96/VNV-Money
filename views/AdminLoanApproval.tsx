
import React, { useState } from 'react';
import { Loan, LoanStatus, SystemBudget, UserRole, User } from '../types';
import { FORMAT_CURRENCY, MOCK_IP } from '../constants';
import { Check, X, FileText, AlertTriangle, Search, ShieldCheck, PenTool, ChevronDown, ChevronUp, Wallet, Clock, User as UserIcon, Shield, ExternalLink, History, FileCheck } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminLoanApprovalProps {
  loans: Loan[];
  onUpdateStatus: (loanId: string, status: LoanStatus) => void;
  budget: SystemBudget;
}

const AdminLoanApproval: React.FC<AdminLoanApprovalProps> = ({ loans, onUpdateStatus, budget }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingContract, setViewingContract] = useState<Loan | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [modal, setModal] = useState<{ loanId: string; status: LoanStatus } | null>(null);

  const groupedLoans = loans.reduce((acc, loan) => {
    if (!acc[loan.userId]) {
      acc[loan.userId] = {
        userName: loan.userName,
        loans: []
      };
    }
    acc[loan.userId].loans.push(loan);
    return acc;
  }, {} as Record<string, { userName: string, loans: Loan[] }>);

  const userIds = Object.keys(groupedLoans).filter(uid => 
    groupedLoans[uid].userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupedLoans[uid].loans.some(l => l.id.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.REQUESTED: return <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[8px] font-black uppercase">Chờ duyệt</span>;
      case LoanStatus.DISBURSED: return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[8px] font-black uppercase">Đang nợ</span>;
      case LoanStatus.SETTLED: return <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 border border-green-500/20 text-[8px] font-black uppercase">Đã trả</span>;
      case LoanStatus.REJECTED: return <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 border border-red-600/20 text-[8px] font-black uppercase">Từ chối</span>;
      case LoanStatus.APPROVED: return <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[8px] font-black uppercase">Đã duyệt</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-24">
      <div className="flex items-center justify-between px-2">
         <h2 className="text-2xl font-black uppercase tracking-tight">Hồ sơ tín dụng</h2>
         <div className="text-[9px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest">v37 Auditor</div>
      </div>

      <div className="relative mx-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          placeholder="Tìm tên khách hàng hoặc mã HĐ..."
          className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF8C1A] text-sm font-medium transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4 px-1">
        {userIds.length === 0 ? (
          <div className="p-20 text-center text-gray-700 font-black uppercase text-[10px] tracking-[0.2em] bg-[#1A1A1A] rounded-[3rem] border border-dashed border-gray-800">Không tìm thấy hồ sơ</div>
        ) : (
          userIds.map(uid => {
            const userData = groupedLoans[uid];
            const sortedLoans = [...userData.loans].sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
            const activeLoansCount = sortedLoans.filter(l => l.status === LoanStatus.DISBURSED).length;
            const pendingLoansCount = sortedLoans.filter(l => l.status === LoanStatus.REQUESTED || l.status === LoanStatus.APPROVED).length;

            return (
              <div key={uid} className="bg-[#1A1A1A] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl transition-all">
                <div 
                  onClick={() => setExpandedUser(expandedUser === uid ? null : uid)}
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 relative shadow-inner">
                       <UserIcon size={24} className="text-[#FF8C1A]" />
                       {(activeLoansCount > 0 || pendingLoansCount > 0) && (
                         <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-[#1A1A1A] text-[8px] font-black flex items-center justify-center text-black">
                           {activeLoansCount + pendingLoansCount}
                         </span>
                       )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase text-white tracking-tight">{userData.userName}</h4>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: {uid.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                       <p className="text-[8px] text-gray-600 font-black uppercase">Tổng cộng</p>
                       <p className="text-[10px] font-black text-gray-300">{userData.loans.length} HĐ</p>
                    </div>
                    <div className="p-2 bg-gray-900 rounded-xl text-gray-600">
                      {expandedUser === uid ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>
                </div>

                {expandedUser === uid && (
                  <div className="bg-black/40 border-t border-gray-800 p-5 space-y-3 animate-in slide-in-from-top-4">
                    {sortedLoans.map(loan => (
                      <div key={loan.id} className="bg-[#222] border border-gray-800 rounded-2xl p-4 flex items-center justify-between group hover:border-gray-600 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-gray-600">
                              <FileText size={18} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[9px] text-gray-500 font-bold uppercase">{loan.id}</span>
                                 {getStatusBadge(loan.status)}
                              </div>
                              <p className="text-sm font-black">{FORMAT_CURRENCY(loan.amount)}</p>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => setViewingContract(loan)}
                             className="p-2.5 bg-gray-800 text-gray-400 rounded-xl hover:text-white transition-colors"
                             title="Xem hợp đồng sao y"
                           >
                             <ExternalLink size={16} />
                           </button>

                           {loan.status === LoanStatus.REQUESTED && (
                              <button 
                                onClick={() => handleAction(loan.id, LoanStatus.APPROVED)}
                                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95"
                              >
                                Duyệt
                              </button>
                           )}

                           {loan.status === LoanStatus.APPROVED && (
                              <button 
                                onClick={() => handleAction(loan.id, LoanStatus.DISBURSED)}
                                className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95"
                              >
                                Giải ngân
                              </button>
                           )}

                           {loan.status === LoanStatus.DISBURSED && (
                              <button 
                                onClick={() => handleAction(loan.id, LoanStatus.SETTLED)}
                                className="px-4 py-2.5 bg-[#FF8C1A] text-black rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95"
                              >
                                Tất toán
                              </button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {viewingContract && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col p-4 animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-[#FF8C1A]/10 rounded-lg">
                    <ShieldCheck className="text-[#FF8C1A]" size={20} />
                 </div>
                 <div>
                    <h3 className="text-xs font-black uppercase text-white tracking-widest">Hồ sơ Audited</h3>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.3em]">Mã HĐ: {viewingContract.id}</p>
                 </div>
              </div>
              <button 
                onClick={() => setViewingContract(null)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10"
              >
                <X size={24}/>
              </button>
           </div>

           <div className="flex-1 bg-white text-black rounded-[3rem] p-8 overflow-y-auto shadow-2xl relative custom-scrollbar">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                 <div className="rotate-45 text-center">
                    <Shield size={300} />
                    <p className="text-6xl font-black uppercase">SAO Y BẢN CHÍNH</p>
                 </div>
              </div>

              <div className="relative z-10 space-y-8">
                 <div className="text-center border-b-2 border-black pb-6">
                    <div className="flex justify-center mb-4">
                       <div className="w-14 h-14 bg-black text-[#FF8C1A] rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-xl">VNV</div>
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-tighter">HỢP ĐỒNG VAY TIỀN</h2>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Certified Digital Document Copy</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6 bg-gray-50 p-5 rounded-3xl border border-gray-100">
                    <div>
                       <p className="text-[7px] font-black text-gray-400 uppercase mb-2 border-b border-gray-200 pb-1">Bên Cho Vay (A)</p>
                       <p className="text-[10px] font-black uppercase">VNV MONEY</p>
                    </div>
                    <div>
                       <p className="font-black text-gray-500 uppercase text-[7px] mb-1">Bên vay B</p>
                       <p className="text-[11px] font-black uppercase text-blue-900 leading-tight">{viewingContract.userName}</p>
                    </div>
                 </div>

                 <div className="space-y-6 text-[10px] leading-relaxed text-gray-800">
                    <section className="space-y-2">
                       <p className="font-black uppercase flex items-center gap-2">ĐIỀU 1: CÁC BÊN THAM GIA</p>
                       <p>- Bên vay: {viewingContract.userName}, CCCD: {viewingContract.userCccd}</p>
                       <p>- Bên cho vay: VNV MONEY</p>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase flex items-center gap-2">ĐIỀU 2: SỐ TIỀN & THỜI HẠN</p>
                       <p>Gốc: <span className="font-black text-black underline text-xs">{FORMAT_CURRENCY(viewingContract.amount)}</span>. Hạn trả: Ngày 27 hàng tháng.</p>
                    </section>

                    <section className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-2">
                       <p className="font-black uppercase text-red-600 flex items-center gap-2"><AlertTriangle size={14}/> ĐIỀU 3: PHÍ PHẠT TRỄ HẠN</p>
                       <p className="font-medium">- Phí phạt: <span className="font-black text-red-600 underline">0.1%/ngày</span> cộng dồn.</p>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase flex items-center gap-2">ĐIỀU 4: NGHĨA VỤ HOÀN TRẢ</p>
                       <p>Bên vay cam kết hoàn trả đúng hạn. Trễ hạn chấp nhận phí phạt & khấu trừ tiến trình nâng hạng.</p>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase flex items-center gap-2">ĐIỀU 5: NGHĨA VỤ TÀI SẢN</p>
                       <p>VNV có quyền thu hồi tài sản hợp pháp tương ứng khi không hoàn trả. Khi thanh toán đủ, tài sản được hoàn trả nguyên trạng.</p>
                    </section>
                 </div>

                 <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-10 mt-6">
                    <div className="text-center">
                       <p className="text-[7px] font-black text-gray-400 uppercase mb-4 tracking-widest">Auditor Seal</p>
                       <div className="w-20 h-20 bg-black text-[#FF8C1A] rounded-full flex items-center justify-center border-4 border-gray-50 shadow-xl mx-auto">
                          <Shield size={32} />
                       </div>
                    </div>

                    <div className="text-center">
                       <p className="text-[7px] font-black text-gray-400 uppercase mb-4 tracking-widest">Bên vay B</p>
                       <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden relative shadow-inner group">
                          <img src={viewingContract.signatureData} alt="User Signature" className="max-h-full object-contain mix-blend-multiply opacity-90" />
                       </div>
                       <p className="text-[11px] font-black uppercase mt-4 text-blue-900 leading-tight">{viewingContract.userName}</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-4 px-2 flex gap-3">
              <button 
                onClick={() => setViewingContract(null)}
                className="flex-1 py-4 bg-[#FF8C1A] text-black rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl active:scale-95"
              >
                 ĐÓNG XEM TRƯỚC
              </button>
           </div>
        </div>
      )}

      {modal && (
        <ConfirmationModal 
          isOpen={!!modal}
          title="Xác nhận xử lý hồ sơ"
          message={`Lệnh xử lý "${modal.status.toUpperCase()}" sẽ được áp dụng cho hồ sơ ${modal.loanId}. Ngân sách hệ thống sẽ tự động cập nhật.`}
          onConfirm={confirmAction}
          onCancel={() => setModal(null)}
          isWarning={modal.status === LoanStatus.REJECTED}
        />
      )}
    </div>
  );
};

export default AdminLoanApproval;

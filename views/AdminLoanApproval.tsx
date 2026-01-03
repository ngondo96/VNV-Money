
import React, { useState } from 'react';
import { Loan, LoanStatus, SystemBudget, UserRole, User } from '../types';
import { FORMAT_CURRENCY, MOCK_IP } from '../constants';
import { Check, X, FileText, AlertTriangle, Search, ShieldCheck, PenTool, ChevronDown, ChevronUp, Wallet, Clock, User as UserIcon, Shield, ExternalLink, History, FileCheck, Coins, CreditCard } from 'lucide-react';
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
      acc[loan.userId] = { userName: loan.userName, loans: [] };
    }
    acc[loan.userId].loans.push(loan);
    return acc;
  }, {} as Record<string, { userName: string, loans: Loan[] }>);

  const userIds = Object.keys(groupedLoans).filter(uid => 
    groupedLoans[uid].userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupedLoans[uid].loans.some(l => l.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = (loanId: string, status: LoanStatus) => setModal({ loanId, status });
  const confirmAction = () => { if (modal) { onUpdateStatus(modal.loanId, modal.status); setModal(null); } };

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

  const totalPending = loans.filter(l => l.status === LoanStatus.REQUESTED).length;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-24">
      <div className="flex items-center justify-between px-2">
         <h2 className="text-2xl font-black uppercase tracking-tight">Hồ sơ tín dụng</h2>
         <div className="flex items-center gap-2">
           <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full border border-red-600/20 uppercase animate-pulse">Cần duyệt: {totalPending}</span>
           <div className="text-[9px] font-black bg-[#FF8C1A]/10 border border-[#FF8C1A]/20 px-3 py-1 rounded-full text-[#FF8C1A] uppercase tracking-widest">Auditor PRO</div>
         </div>
      </div>

      <div className="relative mx-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          placeholder="Tìm khách hàng hoặc mã HĐ..."
          className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-[#FF8C1A] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4 px-1">
        {userIds.map(uid => {
            const userData = groupedLoans[uid];
            const sortedLoans = [...userData.loans].sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
            
            const disbursedLoans = sortedLoans.filter(l => l.status === LoanStatus.DISBURSED);
            const totalDisbursedPrincipal = disbursedLoans.reduce((acc, l) => acc + l.amount, 0);
            const totalDisbursedFines = disbursedLoans.reduce((acc, l) => acc + (l.accruedFine || 0), 0);
            const totalActualCollection = (totalDisbursedPrincipal * 1.15) + totalDisbursedFines;
            const pendingCount = sortedLoans.filter(l => l.status === LoanStatus.REQUESTED).length;

            return (
              <div key={uid} className="bg-[#1A1A1A] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-lg hover:border-gray-700 transition-all">
                <div 
                  onClick={() => setExpandedUser(expandedUser === uid ? null : uid)}
                  className="p-6 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 relative shadow-inner">
                       <UserIcon size={24} className="text-[#FF8C1A]" />
                       {pendingCount > 0 && (
                         <div className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#1A1A1A] animate-bounce shadow-lg">
                            <span className="text-[10px] font-black">{pendingCount}</span>
                         </div>
                       )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase text-white tracking-tight flex items-center gap-2">
                        {userData.userName}
                        {pendingCount > 0 && <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>}
                      </h4>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Mã khách: {uid.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="text-right flex flex-col items-end">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest bg-black/40 px-2 py-1 rounded-lg border border-gray-800">Tổng HĐ: {sortedLoans.length}</span>
                        {disbursedLoans.length > 0 && <span className="text-[7px] font-black text-blue-500 uppercase mt-1">Đang nợ: {disbursedLoans.length}</span>}
                     </div>
                     <div className="p-2 bg-gray-900 rounded-xl text-gray-600">{expandedUser === uid ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</div>
                  </div>
                </div>

                {expandedUser === uid && (
                  <div className="bg-black/40 border-t border-gray-800 p-5 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {sortedLoans.length === 0 ? (
                      <p className="text-center py-4 text-[10px] text-gray-600 font-bold uppercase italic">Không có lịch sử vay</p>
                    ) : (
                      sortedLoans.map(loan => (
                        <div key={loan.id} className={`bg-[#222] border rounded-2xl p-4 flex items-center justify-between shadow-lg transition-all ${loan.status === LoanStatus.REQUESTED ? 'border-orange-500/50 scale-[1.01]' : 'border-gray-800'}`}>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] text-gray-500 font-bold tracking-widest">{loan.id}</span>
                                {getStatusBadge(loan.status)}
                             </div>
                             <p className="text-sm font-black text-white">{FORMAT_CURRENCY(loan.amount)}</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setViewingContract(loan)} className="p-2.5 bg-gray-800 text-gray-400 rounded-xl hover:text-white transition-colors" title="Đối soát"><ExternalLink size={16} /></button>
                             {loan.status === LoanStatus.REQUESTED && <button onClick={() => handleAction(loan.id, LoanStatus.APPROVED)} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all">Duyệt</button>}
                             {loan.status === LoanStatus.APPROVED && <button onClick={() => handleAction(loan.id, LoanStatus.DISBURSED)} className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all">G.Ngân</button>}
                             {loan.status === LoanStatus.DISBURSED && <button onClick={() => handleAction(loan.id, LoanStatus.SETTLED)} className="px-4 py-2.5 bg-[#FF8C1A] text-black rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all">T.Toán</button>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className={`bg-gradient-to-r ${totalActualCollection > 0 ? 'from-[#FF8C1A]/20 to-black' : 'from-gray-900 to-black'} border-t border-gray-800 p-4 px-6 flex items-center justify-between`}>
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${totalActualCollection > 0 ? 'bg-[#FF8C1A]/10 text-[#FF8C1A]' : 'bg-gray-800 text-gray-600'}`}>
                         <Coins size={16} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng thực thu:</span>
                   </div>
                   <div className="text-right">
                      <p className={`text-sm font-black tracking-tight ${totalActualCollection > 0 ? 'text-[#FF8C1A]' : 'text-gray-700'}`}>
                        {FORMAT_CURRENCY(totalActualCollection)}
                      </p>
                      <p className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">
                        (Gốc + 15% Phí + {totalDisbursedFines > 0 ? 'Phạt' : '0 Phạt'})
                      </p>
                   </div>
                </div>
              </div>
            );
        })}
      </div>

      {viewingContract && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col p-4 animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-[#FF8C1A]/10 rounded-lg"><ShieldCheck className="text-[#FF8C1A]" size={20} /></div>
                 <div>
                    <h3 className="text-xs font-black uppercase text-white tracking-widest">Hồ sơ đối soát Admin</h3>
                    <p className="text-[8px] text-gray-500 font-black uppercase">ID HĐ: {viewingContract.id}</p>
                 </div>
              </div>
              <button onClick={() => setViewingContract(null)} className="p-2 bg-white/5 rounded-full text-white"><X size={24}/></button>
           </div>

           <div className="flex-1 bg-white text-black rounded-[3rem] p-8 overflow-y-auto shadow-2xl relative custom-scrollbar">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                 <div className="rotate-45 text-center"><Shield size={300} /><p className="text-6xl font-black uppercase">DỮ LIỆU GỐC</p></div>
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="text-center border-b-2 border-black pb-6">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#FF8C1A] font-black text-xl mx-auto mb-2">VNV</div>
                    <h2 className="text-[14px] font-black uppercase">HỢP ĐỒNG TÍN DỤNG</h2>
                    <p className="text-[7px] font-black text-gray-400 uppercase mt-2 italic">Lưu trữ điện tử v37 PRO</p>
                 </div>
                 <div className="space-y-6 text-[10px] text-gray-800">
                    <section className="space-y-1.5">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 1: CÁC BÊN THAM GIA</p>
                       <p>- Bên vay: {viewingContract.userName}, CCCD: {viewingContract.userCccd}</p>
                       <p>- Bên cho vay: VNV MONEY</p>
                    </section>
                    <section className="space-y-1.5">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 2: SỐ TIỀN & THỜI HẠN</p>
                       <p>- Gốc: {FORMAT_CURRENCY(viewingContract.amount)}. Thanh toán: Ngày 27 hàng tháng.</p>
                    </section>
                    <section className="space-y-1.5 text-red-600 font-medium">
                       <p className="font-black uppercase border-l-4 border-red-600 pl-2">ĐIỀU 3: PHÍ PHẠT TRỄ HẠN</p>
                       <p>- Phí phạt cố định: 0.1%/ngày tính trên tổng dư nợ.</p>
                    </section>
                    <section className="space-y-1.5">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 4: NGHĨA VỤ HOÀN TRẢ</p>
                       <p>- Bên vay cam kết thanh toán đúng hạn. Mọi tranh chấp căn cứ theo Điều 2.</p>
                    </section>
                    <section className="space-y-1.5">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 5: NGHĨA VỤ TÀI SẢN</p>
                       <p>- VNV có quyền áp dụng các biện pháp thu hồi nợ nếu vi phạm nghĩa vụ hoàn trả.</p>
                    </section>
                 </div>
                 <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-10 mt-6">
                    <div className="text-center">
                       <p className="text-[7px] text-gray-400 uppercase mb-4">Chứng thực (A)</p>
                       <div className="w-16 h-16 bg-black text-[#FF8C1A] rounded-2xl flex items-center justify-center mx-auto shadow-xl relative overflow-hidden">
                          <Shield size={24} />
                          <div className="absolute inset-0 bg-red-600/10 rotate-12 flex items-center justify-center">
                             <span className="text-[5px] font-black text-red-600 border border-red-600 px-0.5 uppercase">VNV SEAL</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-center">
                       <p className="text-[7px] text-gray-400 uppercase mb-4">Chữ ký Bên vay (B)</p>
                       <div className="w-full h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden">
                          {viewingContract.signatureData && <img src={viewingContract.signatureData} alt="Sig" className="max-h-full mix-blend-multiply" />}
                       </div>
                       <p className="text-[10px] font-black uppercase mt-3 text-blue-900 leading-tight">{viewingContract.userName}</p>
                    </div>
                 </div>
              </div>
           </div>
           <button onClick={() => setViewingContract(null)} className="mt-4 w-full py-5 bg-[#FF8C1A] text-black rounded-2xl font-black text-[10px] uppercase shadow-xl transition-transform active:scale-95">ĐÓNG HỒ SƠ</button>
        </div>
      )}

      {modal && (
        <ConfirmationModal 
          isOpen={!!modal}
          title="Xử lý hồ sơ"
          message={`Lệnh "${modal.status.toUpperCase()}" sẽ được áp dụng cho HĐ ${modal.loanId}. Hành động này không thể hoàn tác.`}
          onConfirm={confirmAction}
          onCancel={() => setModal(null)}
          isWarning={modal.status === LoanStatus.REJECTED}
        />
      )}
    </div>
  );
};

export default AdminLoanApproval;

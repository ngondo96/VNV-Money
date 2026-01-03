
import React, { useState } from 'react';
import { Loan, User } from '../types';
import { FORMAT_CURRENCY, MOCK_IP } from '../constants';
import { FileText, Download, ShieldCheck, ChevronRight, X, Shield, Award } from 'lucide-react';

interface ContractListViewProps {
  loans: Loan[];
  user?: User; 
}

const ContractListView: React.FC<ContractListViewProps> = ({ loans, user }) => {
  const [viewingContract, setViewingContract] = useState<Loan | null>(null);

  const handleDownloadPDF = (loan: Loan) => {
    const fileName = `HopDong_VNV_${loan.id}.txt`;
    const docContent = `
=====================================================
                    HỢP ĐỒNG VAY VỐN
=====================================================
Mã HĐ: ${loan.id} | Ngày ký: ${new Date(loan.requestedAt).toLocaleString('vi-VN')}
Xác thực IP: ${MOCK_IP} | Chứng thực: VNV PRO v37

ĐIỀU 1: CÁC BÊN THAM GIA
- Bên vay: ${loan.userName}, CCCD: ${loan.userCccd}
- Bên cho vay: VNV MONEY

ĐIỀU 2: SỐ TIỀN & THỜI HẠN
- Số tiền: ${FORMAT_CURRENCY(loan.amount)}
- Hạn trả cố định: Ngày 27 hàng tháng.

ĐIỀU 3: PHÍ PHẠT TRỄ HẠN
- Mức phạt: 0.1%/ngày tính trên số dư nợ trễ hạn.

ĐIỀU 4: NGHĨA VỤ HOÀN TRẢ
- Bên vay cam kết trả đúng hạn. Trễ hạn sẽ bị hạ tín nhiệm hệ thống.

ĐIỀU 5: NGHĨA VỤ TÀI SẢN
- VNV có quyền áp dụng các biện pháp thu hồi nợ nếu vi phạm Điều 4.

XÁC THỰC: Đã ký điện tử bằng v37 PRO Digital Signature.
=====================================================
`;
    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <h2 className="text-3xl font-black tracking-tighter uppercase px-2">Kho hợp đồng</h2>
      
      <div className="space-y-4 px-1">
        {loans.length === 0 ? (
          <div className="bg-[#1A1A1A] p-20 rounded-[3rem] border border-gray-800 border-dashed text-center">
            <FileText size={48} className="text-gray-800 mx-auto mb-4" />
            <p className="text-gray-600 text-xs font-black uppercase tracking-widest">Chưa có hợp đồng nào</p>
          </div>
        ) : (
          loans.map(loan => (
            <div key={loan.id} className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 flex items-center justify-between group shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 shadow-inner">
                  <FileText size={28} className="text-[#FF8C1A]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{loan.id}</p>
                  <h4 className="font-black text-sm uppercase text-white tracking-tight">HĐ Vay {FORMAT_CURRENCY(loan.amount)}</h4>
                  <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">{new Date(loan.requestedAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => handleDownloadPDF(loan)}
                  className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:text-white"
                 >
                   <Download size={18} />
                 </button>
                 <button 
                  onClick={() => setViewingContract(loan)}
                  className="w-10 h-10 bg-[#FF8C1A]/10 text-[#FF8C1A] rounded-xl flex items-center justify-center"
                 >
                   <ChevronRight size={24} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {viewingContract && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col p-4 animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-[#FF8C1A]/10 rounded-lg"><ShieldCheck className="text-[#FF8C1A]" size={20} /></div>
                 <div>
                    <h3 className="text-xs font-black uppercase text-white tracking-widest">Bản sao điện tử</h3>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{viewingContract.id}</p>
                 </div>
              </div>
              <button onClick={() => setViewingContract(null)} className="p-2 bg-white/5 rounded-full text-white"><X size={24}/></button>
           </div>

           <div className="flex-1 bg-white text-black rounded-[3rem] p-8 overflow-y-auto shadow-2xl relative custom-scrollbar">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none z-0">
                 <div className="rotate-[-45deg] text-center">
                    <Shield size={260} />
                    <p className="text-5xl font-black uppercase mt-4">SAO Y BẢN CHÍNH</p>
                 </div>
              </div>

              <div className="relative z-10 space-y-8">
                 <div className="text-center border-b-2 border-black pb-6">
                    <div className="flex justify-center mb-4">
                       <div className="w-14 h-14 bg-black text-[#FF8C1A] rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-lg">VNV</div>
                    </div>
                    <h2 className="text-[15px] font-black uppercase tracking-tighter">HỢP ĐỒNG TÍN DỤNG ĐIỆN TỬ</h2>
                    <p className="text-[7px] font-black text-gray-400 uppercase mt-2 italic">Dữ liệu được bảo vệ v37 PRO</p>
                 </div>

                 <div className="space-y-6 text-[10px] leading-relaxed text-gray-800">
                    <section className="space-y-2">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 1: CÁC BÊN THAM GIA</p>
                       <div className="pl-4 space-y-1">
                          <p><span className="font-bold">Bên A (Cho vay):</span> VNV MONEY</p>
                          <p><span className="font-bold">Bên B (Vay):</span> {viewingContract.userName}</p>
                          <p><span className="font-bold">CCCD:</span> {viewingContract.userCccd}</p>
                       </div>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 2: SỐ TIỀN & THỜI HẠN</p>
                       <p className="pl-4">Số tiền: <span className="font-bold">{FORMAT_CURRENCY(viewingContract.amount)}</span>. Hạn thanh toán cố định vào ngày 27 hàng tháng.</p>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase border-l-4 border-red-600 pl-2 text-red-600">ĐIỀU 3: PHÍ PHẠT TRỄ HẠN</p>
                       <p className="pl-4 italic">Bên B chịu phí phạt 0.1%/ngày khi vi phạm thời gian thanh toán quy định.</p>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 4: NGHĨA VỤ HOÀN TRẢ</p>
                       <p className="pl-4">Bên vay cam kết hoàn trả đầy đủ đúng hạn. Mọi vi phạm sẽ được xử lý theo quy định của VNV Money.</p>
                    </section>

                    <section className="space-y-2">
                       <p className="font-black uppercase border-l-4 border-black pl-2">ĐIỀU 5: NGHĨA VỤ TÀI SẢN</p>
                       <p className="pl-4">VNV được quyền truy thu nợ từ các tài khoản định danh liên kết nếu xảy ra vi phạm Điều 4.</p>
                    </section>
                 </div>

                 <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-10 mt-6 relative z-10">
                    <div className="text-center">
                       <p className="text-[7px] font-black text-gray-400 uppercase mb-4">Đại diện Bên A</p>
                       <div className="relative group">
                          <div className="w-16 h-16 bg-black text-[#FF8C1A] rounded-[1.2rem] flex items-center justify-center mx-auto border-4 border-gray-50 shadow-xl relative overflow-hidden">
                             <Shield size={24} />
                             <div className="absolute inset-0 bg-red-600/10 rotate-12 flex items-center justify-center">
                                <p className="text-[5px] font-black text-red-600 uppercase border border-red-600 px-0.5 rounded-sm">VNV SEAL</p>
                             </div>
                          </div>
                          <p className="text-[8px] font-black uppercase mt-2 text-red-600">ĐÃ CHỨNG THỰC</p>
                       </div>
                    </div>

                    <div className="text-center">
                       <p className="text-[7px] font-black text-gray-400 uppercase mb-4">Bên vay (B)</p>
                       <div className="w-full h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden">
                          {viewingContract.signatureData && <img src={viewingContract.signatureData} alt="Sig" className="max-h-full mix-blend-multiply" />}
                       </div>
                       <p className="text-[9px] font-black uppercase mt-3 text-blue-900">{viewingContract.userName}</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <button onClick={() => setViewingContract(null)} className="mt-6 w-full py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase shadow-xl active:scale-95 transition-all">HOÀN TẤT</button>
        </div>
      )}
    </div>
  );
};

export default ContractListView;

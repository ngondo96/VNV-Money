
import React, { useState } from 'react';
import { Loan } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { FileText, Download, ShieldCheck, ChevronRight, X, Shield, Clock, AlertTriangle, FileCheck, BookOpen, Scale } from 'lucide-react';

interface ContractListViewProps {
  loans: Loan[];
}

const ContractListView: React.FC<ContractListViewProps> = ({ loans }) => {
  const [viewingContract, setViewingContract] = useState<Loan | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <h2 className="text-3xl font-black tracking-tighter px-2 uppercase">Hợp đồng đã ký</h2>

      {viewingContract ? (
        <div className="fixed inset-0 z-[150] bg-black p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-2">
             <span className="text-[10px] font-black text-[#FF8C1A] uppercase tracking-widest">Bản gốc lưu trữ: {viewingContract.id}</span>
             <button onClick={() => setViewingContract(null)} className="p-2 bg-white/5 rounded-full text-white"><X size={24}/></button>
          </div>
          
          <div className="flex-1 bg-white text-black p-8 rounded-[2.5rem] overflow-y-auto custom-scrollbar shadow-2xl relative">
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Shield size={300} />
             </div>

             <div className="text-center border-b-2 border-black pb-6 mb-8 relative z-10">
                <div className="flex justify-center mb-4">
                   <div className="w-12 h-12 bg-black text-[#FF8C1A] rounded-xl flex items-center justify-center font-black">VNV</div>
                </div>
                <h3 className="text-xl font-black uppercase leading-tight tracking-tighter">Hợp Đồng Tín Dụng Điện Tử</h3>
                <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Verified Digital Agreement v37</p>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                   <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Bên cho vay (A)</p>
                      <p className="text-xs font-black">VNV MONEY GLOBAL LTD</p>
                      <p className="text-[8px] italic">Hệ thống VNV Financial</p>
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Bên vay (B)</p>
                      <p className="text-xs font-black uppercase underline text-blue-900">{viewingContract.userName}</p>
                      <p className="text-[8px] italic">Xác thực định danh thành công</p>
                   </div>
                </div>
                
                <div className="text-[9px] leading-relaxed space-y-5 text-gray-700">
                   <section>
                      <p className="font-bold text-black uppercase flex items-center gap-2 mb-2"><BookOpen size={12}/> Điều 1: Khoản vay & Giải ngân</p>
                      <p>Hệ thống VNV xác nhận Bên B đã ký vay số tiền gốc <span className="font-black text-black underline">{FORMAT_CURRENCY(viewingContract.amount)}</span>. Giao dịch được bảo mật và thực thi dựa trên sự tự nguyện của các bên.</p>
                   </section>

                   <section>
                      <p className="font-bold text-black uppercase flex items-center gap-2 mb-2"><Clock size={12}/> Điều 2: Nghĩa vụ hoàn trả</p>
                      <p>Thời hạn thanh toán cố định vào <span className="font-black text-black underline">ngày 27 hàng tháng</span>. Bên B cam kết thực hiện đầy đủ nghĩa vụ trả nợ gốc và phí đúng hạn.</p>
                   </section>

                   <section>
                      <p className="font-bold text-black uppercase flex items-center gap-2 mb-2"><AlertTriangle size={12}/> Điều 3: Phí phạt & Thu hồi tài sản</p>
                      <p>- Phí phạt quá hạn <span className="font-black text-red-600">0.1%/ngày</span> áp dụng ngay sau thời điểm kỳ thanh toán kết thúc.</p>
                      <p>- <span className="font-black">Quá hạn 10 ngày không trả</span>, VNV có quyền thu hồi tài sản có giá trị tương ứng hoặc cao hơn khoản vay; khi Bên B thanh toán đầy đủ dư nợ, Bên A có trách nhiệm hoàn trả lại tài sản trên.</p>
                   </section>
                   
                   <section>
                      <p className="font-bold text-black uppercase flex items-center gap-2 mb-2"><Scale size={12}/> Điều 4: Hiệu lực hợp đồng</p>
                      <p>Hợp đồng này được mã hóa bảo mật realtime. Mọi hành vi vi phạm nghĩa vụ trả nợ sẽ được xử lý theo thỏa thuận dân sự tại văn bản này.</p>
                   </section>
                </div>

                <div className="pt-10 grid grid-cols-2 gap-8 border-t border-gray-100 mt-6">
                   <div className="text-center flex flex-col items-center">
                      <p className="font-black uppercase text-[7px] mb-3 text-gray-400">Đại diện Bên A</p>
                      <div className="w-20 h-20 bg-black text-[#FF8C1A] rounded-full flex items-center justify-center border-4 border-gray-50 shadow-inner">
                         <Shield size={32} />
                      </div>
                      <p className="text-[8px] font-black uppercase mt-3 tracking-tighter">VNV MONEY OFFICIAL</p>
                      <p className="text-[6px] text-green-600 font-bold uppercase mt-1">Verified v37 System</p>
                   </div>
                   
                   <div className="text-center flex flex-col items-center">
                      <p className="font-black uppercase text-[7px] mb-3 text-gray-400">Người vay (Bên B)</p>
                      <div className="w-full h-24 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden mb-2 shadow-inner">
                         <img src={viewingContract.signatureData} alt="User Signature" className="max-h-full object-contain mix-blend-multiply opacity-90" />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-tighter underline text-blue-900">{viewingContract.userName}</p>
                      <p className="text-[6px] text-gray-400 italic">Đã ký điện tử</p>
                   </div>
                </div>

                <div className="pt-8 text-center">
                   <p className="text-[7px] text-gray-300 font-bold uppercase tracking-[0.2em]">Sao y nguyên bản - Lưu trữ bởi VNV Financial Engine</p>
                </div>

                <button className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all mt-4">
                   <Download size={16} /> TẢI BẢN SAO PDF
                </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-2">
          {loans.length === 0 ? (
            <div className="p-20 text-center bg-[#1A1A1A] rounded-[3rem] border border-dashed border-gray-800">
               <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                  <FileText size={24} className="text-gray-700" />
               </div>
               <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Chưa có hợp đồng nào được ký kết</p>
            </div>
          ) : (
            loans.map(loan => (
              <button 
                key={loan.id}
                onClick={() => setViewingContract(loan)}
                className="w-full bg-[#1A1A1A] border border-gray-800 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-[#FF8C1A]/50 transition-all shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-gray-600 group-hover:text-[#FF8C1A] transition-colors border border-gray-800">
                      <ShieldCheck size={24} />
                   </div>
                   <div className="text-left">
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">{loan.id}</p>
                      <p className="text-sm font-black">{FORMAT_CURRENCY(loan.amount)}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="bg-green-600/10 text-green-500 p-1.5 rounded-lg border border-green-600/20 text-[8px] font-black uppercase">
                      Bản gốc
                   </div>
                   <ChevronRight size={20} className="text-gray-800 group-hover:text-gray-500 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ContractListView;

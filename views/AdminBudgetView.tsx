
import React, { useState, useEffect } from 'react';
import { SystemBudget } from '../types';
import { FORMAT_CURRENCY, FORMAT_INPUT_NUMBER } from '../constants';
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminBudgetViewProps {
  budget: SystemBudget;
  setBudget: (b: SystemBudget) => void;
}

const AdminBudgetView: React.FC<AdminBudgetViewProps> = ({ budget, setBudget }) => {
  const [displayValue, setDisplayValue] = useState(FORMAT_INPUT_NUMBER(budget.total.toString()));
  const [showConfirm, setShowConfirm] = useState(false);

  // Đồng bộ displayValue khi budget.total thay đổi từ bên ngoài (ví dụ khi reset)
  useEffect(() => {
    setDisplayValue(FORMAT_INPUT_NUMBER(budget.total.toString()));
  }, [budget.total]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // Chỉ lấy số
    const formatted = FORMAT_INPUT_NUMBER(rawVal);
    setDisplayValue(formatted);
  };

  const handleUpdate = () => {
    if (!displayValue || displayValue === '0') return alert("Vui lòng nhập số tiền hợp lệ");
    setShowConfirm(true);
  };

  const confirmUpdate = () => {
    const numericVal = parseInt(displayValue.split('.').join(''));
    if (isNaN(numericVal)) return alert("Số tiền không hợp lệ");
    
    if (numericVal < budget.disbursed) {
      alert("Tổng nguồn vốn không thể nhỏ hơn số tiền đã giải ngân thực tế.");
      return;
    }

    setBudget({
      ...budget,
      total: numericVal,
      remaining: numericVal - budget.disbursed
    });
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-black uppercase tracking-tight">Cấu hình Ngân sách</h2>

      <div className="bg-gradient-to-br from-[#FF8C1A] to-[#E67E17] p-8 rounded-[3rem] text-black shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Vốn khả dụng hiện tại</p>
          <h3 className="text-4xl font-black mb-6 tracking-tighter">{FORMAT_CURRENCY(budget.remaining)}</h3>
          
          <div className="flex gap-4">
             <div className="bg-black/10 px-4 py-2 rounded-2xl">
                <p className="text-[10px] font-black uppercase opacity-60">Đã giải ngân</p>
                <p className="text-lg font-black tracking-tight">{FORMAT_CURRENCY(budget.disbursed)}</p>
             </div>
             <div className="bg-black/10 px-4 py-2 rounded-2xl">
                <p className="text-[10px] font-black uppercase opacity-60">Phí đã thu</p>
                <p className="text-lg font-black tracking-tight">{FORMAT_CURRENCY(budget.finesCollected)}</p>
             </div>
          </div>
        </div>
        <Wallet className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10" />
      </div>

      <div className="bg-[#1A1A1A] p-7 rounded-[2.5rem] border border-gray-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
           <TrendingUp className="text-[#FF8C1A]" size={20} />
           <h4 className="font-black text-sm uppercase tracking-widest">Thay đổi tổng nguồn vốn</h4>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 uppercase font-black px-1 tracking-widest">Nhập số tiền mới (VND)</label>
          <div className="relative">
            <input 
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleInputChange}
              className="w-full bg-black border border-gray-800 rounded-2xl py-5 px-6 text-2xl font-black text-[#FF8C1A] outline-none focus:border-[#FF8C1A] transition-all text-center tracking-widest"
              placeholder="0"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xs uppercase">vnd</div>
          </div>
          <p className="text-[9px] text-gray-600 italic px-1 font-bold">Hệ thống tự động đồng bộ dấu chấm phân cách mỗi 3 chữ số.</p>
        </div>

        <button 
          onClick={handleUpdate}
          className="w-full py-5 bg-[#FF8C1A] text-black font-black text-lg rounded-2xl hover:bg-[#E67E17] transition-all shadow-[0_10px_30px_rgba(255,140,26,0.3)] active:scale-[0.98] uppercase tracking-widest"
        >
          CẬP NHẬT NGÂN SÁCH
        </button>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-[2rem] flex gap-4 shadow-inner">
         <AlertTriangle className="text-red-500 shrink-0" size={24} />
         <div>
            <h5 className="text-red-500 font-black text-xs uppercase mb-1 tracking-widest">Lưu ý nghiệp vụ</h5>
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
              Số dư khả dụng = Tổng nguồn vốn - Các khoản đã giải ngân. Việc hạ tổng nguồn vốn xuống thấp hơn dư nợ đang cho vay sẽ bị hệ thống từ chối để bảo toàn tài chính.
            </p>
         </div>
      </div>

      {showConfirm && (
        <ConfirmationModal 
          isOpen={showConfirm}
          title="Xác nhận thay đổi vốn"
          message={`Tổng nguồn vốn mới sẽ được thiết lập là ${FORMAT_CURRENCY(parseInt(displayValue.split('.').join('')))}. Giao dịch này sẽ được ghi nhật ký hệ thống.`}
          onConfirm={confirmUpdate}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default AdminBudgetView;


import React, { useState } from 'react';
import { SystemBudget } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { Wallet, TrendingUp, AlertTriangle, PlusCircle, RefreshCw } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminBudgetViewProps {
  budget: SystemBudget;
  setBudget: (b: SystemBudget) => void;
}

const AdminBudgetView: React.FC<AdminBudgetViewProps> = ({ budget, setBudget }) => {
  const [newTotal, setNewTotal] = useState(budget.total.toString());
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = () => {
    setShowConfirm(true);
  };

  const confirmUpdate = () => {
    const val = parseInt(newTotal);
    if (isNaN(val) || val < budget.disbursed) {
      alert("Số tiền không hợp lệ hoặc nhỏ hơn số tiền đã giải ngân.");
      return;
    }
    setBudget({
      ...budget,
      total: val,
      remaining: val - budget.disbursed
    });
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-black">QUẢN LÝ NGÂN SÁCH</h2>

      <div className="bg-gradient-to-br from-[#FF8C1A] to-[#E67E17] p-8 rounded-[3rem] text-black shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Số dư khả dụng</p>
          <h3 className="text-4xl font-black mb-6">{FORMAT_CURRENCY(budget.remaining)}</h3>
          
          <div className="flex gap-4">
             <div className="bg-black/10 px-4 py-2 rounded-2xl">
                <p className="text-[10px] font-black uppercase opacity-60">Đã giải ngân</p>
                <p className="text-lg font-black">{FORMAT_CURRENCY(budget.disbursed)}</p>
             </div>
             <div className="bg-black/10 px-4 py-2 rounded-2xl">
                <p className="text-[10px] font-black uppercase opacity-60">Phí thu về</p>
                <p className="text-lg font-black">{FORMAT_CURRENCY(budget.finesCollected)}</p>
             </div>
          </div>
        </div>
        <Wallet className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10" />
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex items-center gap-2 mb-2">
           <TrendingUp className="text-[#FF8C1A]" size={20} />
           <h4 className="font-black">Cập nhật tổng ngân sách</h4>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase font-black px-1">Số tiền nguồn vốn mới (VND)</label>
          <div className="relative">
            <input 
              type="number"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-2xl py-5 px-6 text-xl font-black text-[#FF8C1A] outline-none focus:border-[#FF8C1A]"
            />
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          className="w-full py-4 bg-[#FF8C1A] text-black font-black text-lg rounded-2xl hover:bg-[#E67E17] transition-all shadow-xl active:scale-[0.98]"
        >
          XÁC NHẬN CẬP NHẬT
        </button>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex gap-4">
         <AlertTriangle className="text-red-500 shrink-0" size={24} />
         <div>
            <h5 className="text-red-500 font-black text-sm uppercase mb-1">Lưu ý bảo mật</h5>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Mọi thay đổi về ngân sách hệ thống sẽ được ghi nhận vào Audit Log. Hệ thống sẽ tự động đối soát với tổng các khoản vay đang giải ngân.
            </p>
         </div>
      </div>

      {showConfirm && (
        <ConfirmationModal 
          isOpen={showConfirm}
          title="Xác Nhận Ngân Sách"
          message={`Bạn đang thay đổi tổng ngân sách hệ thống lên ${FORMAT_CURRENCY(parseInt(newTotal))}. Bạn có chắc chắn?`}
          onConfirm={confirmUpdate}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default AdminBudgetView;


import React, { useState } from 'react';
import { RefreshCcw, ShieldAlert, AlertTriangle, Save, Settings, Database } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminSettingsViewProps {
  onReset: () => void;
}

const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ onReset }) => {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-16">
      <h2 className="text-2xl font-black uppercase tracking-tight">Cài đặt Hệ thống</h2>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
           <Database className="text-[#FF8C1A]" size={20} />
           <h3 className="font-black text-sm uppercase tracking-widest text-gray-200">Quản lý Dữ liệu</h3>
        </div>

        <div className="p-5 bg-red-600/5 border border-red-600/10 rounded-2xl space-y-4">
            <div className="flex items-start gap-4">
                <ShieldAlert className="text-red-500 shrink-0 mt-1" size={24} />
                <div className="space-y-1">
                    <h4 className="font-black text-xs text-red-500 uppercase">Khôi phục mặc định (Reset)</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        Hành động này sẽ xóa toàn bộ danh sách khách hàng, lịch sử vay, nhật ký hệ thống và đưa ngân sách về mặc định là 20.000.000 VNĐ.
                    </p>
                </div>
            </div>
            
            <button 
                onClick={() => setShowResetModal(true)}
                className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
                <RefreshCcw size={14} /> THỰC THI RESET TOÀN BỘ
            </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center gap-3">
           <Settings className="text-blue-500" size={20} />
           <h3 className="font-black text-sm uppercase tracking-widest text-gray-200">Cấu hình Quy định</h3>
        </div>
        <div className="space-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest italic opacity-50">
            Tính năng cấu hình lãi suất, ngày trả cố định, API Zalo... đang được phát triển trong phiên bản tiếp theo.
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showResetModal}
        title="Xác nhận RESET hệ thống"
        message="BẠN CÓ CHẮC CHẮN? Toàn bộ dữ liệu thực tế hiện tại sẽ bị xóa sạch và không thể khôi phục. Chỉ tài khoản Admin đang đăng nhập được giữ lại."
        onConfirm={() => { onReset(); setShowResetModal(false); }}
        onCancel={() => setShowResetModal(false)}
        isWarning={true}
      />
    </div>
  );
};

export default AdminSettingsView;

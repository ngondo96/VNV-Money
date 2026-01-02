
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isWarning?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel, isWarning }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-gray-800 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            {isWarning ? (
              <div className="bg-red-500/20 p-2.5 rounded-full">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            ) : (
              <div className="bg-[#FF8C1A]/20 p-2.5 rounded-full">
                <Info className="text-[#FF8C1A]" size={24} />
              </div>
            )}
            <h3 className="text-lg font-black uppercase tracking-tight">{title}</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-8 font-medium">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-4 px-4 rounded-2xl bg-gray-800 hover:bg-gray-700 font-black text-[10px] uppercase transition-colors text-gray-400"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-[10px] uppercase transition-all ${isWarning ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#FF8C1A] hover:bg-[#E67E17] text-black shadow-[0_10px_20px_rgba(255,140,26,0.2)]'}`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

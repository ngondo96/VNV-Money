
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {isWarning ? (
              <div className="bg-red-500/20 p-2 rounded-full">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            ) : (
              <div className="bg-orange-500/20 p-2 rounded-full">
                <Info className="text-orange-500" size={24} />
              </div>
            )}
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${isWarning ? 'bg-red-600 hover:bg-red-700' : 'bg-[#FF8C1A] hover:bg-[#E67E17] text-black'}`}
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

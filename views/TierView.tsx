
import React, { useState } from 'react';
import { User, UserTier, TierRequest } from '../types';
import { TIER_CONFIGS, FORMAT_CURRENCY } from '../constants';
import { Award, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface TierViewProps {
  user: User;
  onUpgrade: (tier: UserTier) => void;
  tierRequests: TierRequest[]; // Passed from App to check pending status
}

const TierView: React.FC<TierViewProps & { tierRequests: TierRequest[] }> = ({ user, onUpgrade, tierRequests }) => {
  const [modal, setModal] = useState<UserTier | null>(null);
  const tiers = Object.values(UserTier);

  // Check if user has any pending request
  const hasPendingRequest = tierRequests.some(r => r.userId === user.id && r.status === 'PENDING');

  const getTierIcon = (tier: UserTier) => {
    switch (tier) {
      case UserTier.DIAMOND: return <ShieldCheck className="text-blue-400" />;
      case UserTier.GOLD: return <Award className="text-yellow-400" />;
      case UserTier.SILVER: return <Star className="text-gray-400" />;
      case UserTier.BRONZE: return <Star className="text-orange-400" />;
      default: return <Award className="text-gray-500" />;
    }
  };

  const handleUpgradeClick = (tier: UserTier) => {
    if (hasPendingRequest) {
      alert("Bạn đang có một yêu cầu nâng hạng đang chờ Admin duyệt. Vui lòng đợi kết quả trước khi gửi yêu cầu mới.");
      return;
    }
    setModal(tier);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <h2 className="text-3xl font-black tracking-tighter uppercase">Hạng & Hạn Mức</h2>

      {hasPendingRequest && (
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-full text-orange-500 animate-pulse">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest leading-tight">
            Một yêu cầu nâng hạng của bạn đang được Admin thẩm định...
          </p>
        </div>
      )}

      <div className="space-y-4">
        {tiers.map((tierName) => {
          const config = TIER_CONFIGS[tierName];
          const isCurrent = user.tier === tierName;
          const isHigher = tiers.indexOf(tierName) > tiers.indexOf(user.tier);

          return (
            <div 
              key={tierName}
              className={`p-6 rounded-[2rem] border transition-all ${isCurrent ? 'bg-orange-500/10 border-[#FF8C1A] scale-[1.02]' : 'bg-[#1A1A1A] border-gray-800 opacity-70'}`}
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isCurrent ? 'bg-[#FF8C1A]/20' : 'bg-gray-800'}`}>
                       {getTierIcon(tierName)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-black uppercase tracking-tight ${isCurrent ? 'text-[#FF8C1A]' : 'text-white'}`}>{tierName}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Hạn mức tối đa: {FORMAT_CURRENCY(config.maxLimit)}</p>
                    </div>
                 </div>
                 {isCurrent && (
                   <div className="bg-[#FF8C1A] text-black text-[9px] font-black px-2 py-1 rounded-lg uppercase">
                      Hiện tại
                   </div>
                 )}
              </div>

              <div className="space-y-2 mb-6">
                {config.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                    <CheckCircle2 size={14} className={isCurrent ? 'text-[#FF8C1A]' : 'text-gray-700'} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {isHigher && (
                <button 
                  onClick={() => handleUpgradeClick(tierName)}
                  disabled={hasPendingRequest}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${hasPendingRequest ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 active:scale-95'}`}
                >
                  GỬI YÊU CẦU NÂNG HẠNG
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800">
         <h4 className="font-black text-xs uppercase mb-4 text-gray-400 tracking-widest">Quy định thẩm định</h4>
         <div className="space-y-4 text-[11px] font-black text-gray-600 uppercase tracking-tighter">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
               <span>Thâm niên hệ thống:</span>
               <span className="text-white">Duyệt tự động</span>
            </div>
            <div className="flex justify-between items-center">
               <span>Đúng hạn thanh toán:</span>
               <span className="text-white">Bắt buộc</span>
            </div>
         </div>
      </div>

      {modal && (
        <ConfirmationModal 
          isOpen={!!modal}
          title="Xác nhận nâng hạng"
          message={`Bạn đang yêu cầu nâng cấp lên hạng ${modal}. Hệ thống sẽ kiểm tra lịch sử tín dụng của bạn trước khi duyệt.`}
          onConfirm={() => { onUpgrade(modal); setModal(null); }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default TierView;

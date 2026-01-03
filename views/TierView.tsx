
import React, { useState } from 'react';
import { User, UserTier, TierRequest } from '../types';
import { TIER_CONFIGS, FORMAT_CURRENCY } from '../constants';
import { Award, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface TierViewProps {
  user: User;
  onUpgrade: (tier: UserTier) => void;
  tierRequests: TierRequest[];
}

const TierView: React.FC<TierViewProps> = ({ user, onUpgrade, tierRequests }) => {
  const [modal, setModal] = useState<UserTier | null>(null);
  const tiers = Object.values(UserTier);

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

  const calculateFee = (tier: UserTier) => {
    const limit = TIER_CONFIGS[tier].maxLimit;
    return limit * 0.05;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Hạng & Hạn Mức</h2>
        <div className="bg-[#FF8C1A]/10 border border-[#FF8C1A]/20 px-3 py-1 rounded-full">
           <span className="text-[8px] font-black text-[#FF8C1A] uppercase">Phí hồ sơ: 5%</span>
        </div>
      </div>

      {hasPendingRequest && (
        <div className="mx-2 bg-orange-500/10 border border-orange-500/30 p-5 rounded-[2rem] flex items-center gap-4 animate-pulse">
          <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-500">
            <ShieldCheck size={24} />
          </div>
          <div>
             <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest leading-tight">Yêu cầu đang chờ duyệt</p>
             <p className="text-[8px] text-gray-500 font-bold uppercase mt-1 tracking-tighter">Admin sẽ phản hồi trong 24h.</p>
          </div>
        </div>
      )}

      <div className="space-y-4 px-1">
        {tiers.map((tierName) => {
          const config = TIER_CONFIGS[tierName];
          const isCurrent = user.tier === tierName;
          const userIdx = tiers.indexOf(user.tier);
          const currentIdx = tiers.indexOf(tierName);
          const isHigher = currentIdx > userIdx;

          return (
            <div 
              key={tierName}
              className={`p-6 rounded-[2.5rem] border transition-all duration-300 ${isCurrent ? 'bg-orange-500/10 border-[#FF8C1A] scale-[1.02] shadow-[0_15px_30px_rgba(255,140,26,0.1)]' : 'bg-[#1A1A1A] border-gray-800 opacity-70 hover:opacity-100'}`}
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isCurrent ? 'bg-[#FF8C1A]/20' : 'bg-gray-800'}`}>
                       {getTierIcon(tierName)}
                    </div>
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-tight ${isCurrent ? 'text-[#FF8C1A]' : 'text-white'}`}>{tierName}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">Max: {FORMAT_CURRENCY(config.maxLimit)}</p>
                    </div>
                 </div>
                 {isCurrent && <div className="bg-[#FF8C1A] text-black text-[9px] font-black px-3 py-1.5 rounded-xl uppercase">Hiện tại</div>}
              </div>

              <div className="space-y-2 mb-6 ml-1">
                {config.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-gray-400">
                    <CheckCircle2 size={14} className={isCurrent ? 'text-[#FF8C1A]' : 'text-gray-700'} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {isHigher && (
                <button 
                  onClick={() => !hasPendingRequest && setModal(tierName)}
                  disabled={hasPendingRequest}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${hasPendingRequest ? 'bg-gray-800 text-gray-600' : 'bg-white text-black hover:bg-orange-500 hover:text-white'}`}
                >
                  {hasPendingRequest ? 'ĐANG CHỜ DUYỆT...' : 'NÂNG CẤP NGAY'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mx-2 bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800">
         <h4 className="font-black text-xs uppercase mb-4 text-gray-400 tracking-widest border-b border-gray-800 pb-2">Quy tắc nâng hạng</h4>
         <div className="space-y-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
            <div className="flex justify-between items-center">
               <span>Phí thẩm định hồ sơ:</span>
               <span className="text-[#FF8C1A]">5% Hạn mức mới</span>
            </div>
            <div className="flex justify-between items-center">
               <span>Thời gian xử lý:</span>
               <span className="text-white">Trong 24h làm việc</span>
            </div>
         </div>
      </div>

      {modal && (
        <ConfirmationModal 
          isOpen={!!modal}
          title="Xác nhận nâng hạng"
          message={`Hạng mới: ${modal}\nHạn mức: ${FORMAT_CURRENCY(TIER_CONFIGS[modal].maxLimit)}\nPhí thẩm định (5%): ${FORMAT_CURRENCY(calculateFee(modal))}\n\nVui lòng xác nhận để gửi hồ sơ và liên hệ CSKH nộp phí.`}
          onConfirm={() => { onUpgrade(modal); setModal(null); }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default TierView;

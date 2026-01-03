
import React, { useState } from 'react';
import { User, UserRole, UserTier, TierRequest } from '../types';
import { Search, User as UserIcon, ShieldCheck, TrendingUp, CheckCircle, XCircle, MapPin, Hash, Phone, Calendar, Info, ChevronDown, ChevronUp, Users, UserPlus } from 'lucide-react';
import { FORMAT_CURRENCY } from '../constants';
import ConfirmationModal from '../components/ConfirmationModal';

interface AdminUserManagementProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  tierRequests: TierRequest[];
  onApproveTier: (id: string) => void;
  onRejectTier: (id: string) => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, tierRequests, onApproveTier, onRejectTier }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState<{ id: string; tier: UserTier; name: string; type: 'APPROVE' | 'REJECT' } | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.role !== UserRole.ADMIN && 
    (u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.zaloNumber.includes(searchTerm))
  );

  const pendingReqs = tierRequests.filter(r => r.status === 'PENDING');

  const handleTierAction = (id: string, tier: UserTier, name: string, type: 'APPROVE' | 'REJECT') => {
    setModal({ id, tier, name, type });
  };

  const confirmTierAction = () => {
    if (modal) {
      if (modal.type === 'APPROVE') {
        onApproveTier(modal.id);
      } else {
        onRejectTier(modal.id);
      }
      setModal(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-black tracking-tight uppercase">Quản lý Khách hàng</h2>
        <div className="flex gap-2">
           <div className="flex items-center gap-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full border border-blue-600/20 uppercase">
              <Users size={12}/> {filteredUsers.length}
           </div>
           {pendingReqs.length > 0 && (
             <div className="flex items-center gap-1.5 bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full border border-orange-600 shadow-lg shadow-orange-900/20 uppercase animate-pulse">
                <TrendingUp size={12}/> REQ: {pendingReqs.length}
             </div>
           )}
        </div>
      </div>

      {/* Tier Upgrade Requests Section */}
      {pendingReqs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2 px-2 tracking-widest">
            <TrendingUp size={14} /> Yêu cầu nâng hạng mới ({pendingReqs.length})
          </h3>
          {pendingReqs.map(req => (
            <div key={req.id} className="bg-[#1A1A1A] border-l-4 border-orange-500 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-black text-white uppercase">{req.userName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Hạng đích: <span className="text-[#FF8C1A]">{req.requestedTier}</span></p>
                </div>
                <div className="text-[9px] text-gray-600 font-bold uppercase">{new Date(req.timestamp).toLocaleDateString('vi-VN')}</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleTierAction(req.id, req.requestedTier, req.userName, 'APPROVE')}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition-colors shadow-lg"
                >
                  Duyệt yêu cầu
                </button>
                <button 
                  onClick={() => handleTierAction(req.id, req.requestedTier, req.userName, 'REJECT')}
                  className="flex-1 bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-600/20 transition-colors"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          placeholder="Tìm Tên hoặc Số Zalo khách hàng..."
          className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF8C1A] text-sm font-medium transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-[#1A1A1A] rounded-[2rem] border border-dashed border-gray-800 text-gray-600 text-xs font-bold uppercase tracking-widest">Không có dữ liệu khách hàng</div>
        ) : (
            filteredUsers.map(user => (
            <div key={user.id} className="bg-[#1A1A1A] border border-gray-800 rounded-[2rem] overflow-hidden shadow-sm hover:border-gray-700 transition-colors">
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-[#FF8C1A] border border-gray-800 shadow-inner">
                            <UserIcon size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-tight text-white">{user.fullName}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.zaloNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                           <p className="text-[9px] text-gray-600 font-black uppercase">Tier</p>
                           <p className="text-[10px] font-black text-[#FF8C1A]">{user.tier}</p>
                        </div>
                        <div className="p-2 text-gray-600 bg-gray-900 rounded-xl">
                           {expandedUser === user.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </div>
                    </div>
                </div>

                {expandedUser === user.id && (
                    <div className="px-6 pb-6 pt-2 bg-black/40 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-6 border-t border-gray-800">
                            <div className="flex items-start gap-3">
                                <ShieldCheck size={16} className="text-[#FF8C1A] mt-0.5" />
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Quyền lợi Hạng</p>
                                    <p className="text-xs font-black text-[#FF8C1A]">{user.tier}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <TrendingUp size={16} className="text-[#FF8C1A] mt-0.5" />
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Hạn mức giải ngân</p>
                                    <p className="text-xs font-black text-white">{FORMAT_CURRENCY(user.limit)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Hash size={16} className="text-blue-500 mt-0.5" />
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Số CCCD Hệ thống</p>
                                    <p className="text-xs font-bold text-gray-300">{user.cccd}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={16} className="text-green-500 mt-0.5" />
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Zalo xác thực</p>
                                    <p className="text-xs font-bold text-gray-300">{user.zaloNumber}</p>
                                </div>
                            </div>

                            {/* REFERENCE INFO */}
                            {user.refZaloNumber && (
                              <div className="flex items-start gap-3 col-span-2 bg-orange-600/5 p-3 rounded-xl border border-orange-500/20">
                                  <Users size={16} className="text-orange-500 mt-0.5" />
                                  <div>
                                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Tham chiếu: {user.refRelationship}</p>
                                      <p className="text-xs font-black text-white">Zalo: {user.refZaloNumber}</p>
                                  </div>
                              </div>
                            )}

                            <div className="flex items-start gap-3 col-span-2 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                <MapPin size={16} className="text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Địa chỉ thường trú</p>
                                    <p className="text-xs font-medium text-gray-300">{user.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 col-span-2">
                                <Calendar size={16} className="text-gray-600" />
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Tham gia hệ thống lúc</p>
                                    <p className="text-[10px] font-bold text-gray-400">{new Date(user.joinedAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 py-4 bg-[#FF8C1A]/10 text-[#FF8C1A] border border-[#FF8C1A]/20 rounded-2xl text-[10px] font-black uppercase hover:bg-[#FF8C1A]/20 transition-all">Cấu hình Hạn mức</button>
                            <button className="flex-1 py-4 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600/20 transition-all">Khóa khách hàng</button>
                        </div>
                    </div>
                )}
            </div>
            ))
        )}
      </div>

      {modal && (
        <ConfirmationModal 
          isOpen={true}
          title={modal.type === 'APPROVE' ? "Xác nhận nâng hạng" : "Xác nhận từ chối"}
          message={modal.type === 'APPROVE' 
            ? `Duyệt nâng hạng ${modal.tier} cho ${modal.name}. Hạn mức vay sẽ được tự động điều chỉnh theo quy định hạng.` 
            : `Từ chối yêu cầu nâng lên hạng ${modal.tier} của ${modal.name}.`}
          onConfirm={confirmTierAction}
          onCancel={() => setModal(null)}
          isWarning={modal.type === 'REJECT'}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;

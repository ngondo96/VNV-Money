
import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Lock, Bell, HelpCircle, LogOut, ChevronRight, Hash, MapPin, Phone, X, Save } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const menuItems = [
    { id: 'password', icon: Lock, label: 'Mật khẩu', color: 'text-blue-500', action: () => setShowChangePass(true) },
    { id: 'notify', icon: Bell, label: 'Thông báo', color: 'text-orange-500', action: () => {} },
    { id: 'help', icon: HelpCircle, label: 'Hỗ trợ 24/7', color: 'text-green-500', action: () => {} }
  ];

  const handleUpdatePass = () => {
    if (newPass !== confirmPass) return alert("Mật khẩu xác nhận không khớp");
    if (newPass.length < 6) return alert("Mật khẩu mới phải từ 6 ký tự");
    alert("Yêu cầu đổi mật khẩu đã được gửi!");
    setShowChangePass(false);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center py-6">
         <div className="w-24 h-24 bg-gradient-to-br from-[#FF8C1A] to-[#E67E17] rounded-[2.5rem] flex items-center justify-center mb-4 border-4 border-[#1A1A1A] shadow-2xl">
            <UserIcon size={48} className="text-black" />
         </div>
         <h2 className="text-2xl font-black uppercase tracking-tight">{user.fullName}</h2>
         <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1 bg-white/5 px-4 py-1 rounded-full">{user.tier} MEMBER</p>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 space-y-5">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
               <Phone size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Zalo Xác thực</p>
               <p className="text-sm font-black text-white">{user.zaloNumber}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
               <Hash size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Số CCCD Hệ thống</p>
               <p className="text-sm font-black text-white">{user.cccd.replace(/(\d{4})(\d{4})(\d{4})/, '$1 **** ****')}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
               <MapPin size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Địa chỉ thường trú</p>
               <p className="text-sm font-bold text-gray-300 line-clamp-1">{user.address}</p>
            </div>
         </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-xl">
         {menuItems.map((item, idx) => {
           const Icon = item.icon;
           return (
             <button 
                key={idx} 
                onClick={item.action}
                className="w-full flex items-center justify-between p-6 hover:bg-black/20 border-b border-gray-800/50 last:border-0 transition-colors"
             >
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 bg-black rounded-2xl flex items-center justify-center ${item.color} border border-gray-800/50 shadow-inner`}>
                      <Icon size={22} />
                   </div>
                   <span className="text-sm font-black uppercase tracking-widest text-gray-200">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-700" />
             </button>
           );
         })}
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-[2rem] font-black text-xs uppercase flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
      >
        <LogOut size={20} />
        Đăng Xuất Tài Khoản
      </button>

      {showChangePass && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col p-6">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black uppercase text-[#FF8C1A]">Thay đổi mật khẩu</h3>
              <button onClick={() => setShowChangePass(false)} className="p-3 bg-white/5 rounded-full"><X size={24}/></button>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Mật khẩu hiện tại</label>
                 <input 
                    type="password" 
                    value={oldPass} 
                    onChange={e => setOldPass(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-5 px-6 outline-none focus:border-[#FF8C1A] text-sm font-bold"
                    placeholder="••••••••"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Mật khẩu mới</label>
                 <input 
                    type="password" 
                    value={newPass} 
                    onChange={e => setNewPass(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-5 px-6 outline-none focus:border-[#FF8C1A] text-sm font-bold"
                    placeholder="Ít nhất 6 ký tự"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Xác nhận mật khẩu mới</label>
                 <input 
                    type="password" 
                    value={confirmPass} 
                    onChange={e => setConfirmPass(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-5 px-6 outline-none focus:border-[#FF8C1A] text-sm font-bold"
                    placeholder="Nhập lại mật khẩu mới"
                 />
              </div>

              <button 
                onClick={handleUpdatePass}
                className="w-full py-5 bg-[#FF8C1A] text-black font-black text-sm uppercase rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-4"
              >
                <Save size={18} /> Lưu thay đổi
              </button>
           </div>
        </div>
      )}

      <p className="text-[10px] text-center text-gray-700 uppercase font-black tracking-widest pb-6">VNV MONEY PRO v37</p>
    </div>
  );
};

export default ProfileView;


import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Lock, HelpCircle, LogOut, ChevronRight, Hash, Phone, X, AlertCircle, ScrollText, ShieldAlert, TrendingUp, TrendingDown, Clock, Scale } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onUpdatePassword: (newPass: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdatePassword }) => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const menuItems = [
    { 
      id: 'password', 
      icon: Lock, 
      label: 'Bảo mật mật khẩu', 
      color: 'text-blue-500', 
      action: () => setShowChangePass(true) 
    },
    { 
      id: 'terms', 
      icon: ScrollText, 
      label: 'Điều khoản sử dụng', 
      color: 'text-[#FF8C1A]', 
      action: () => setShowTerms(true) 
    },
    { 
      id: 'help', 
      icon: HelpCircle, 
      label: 'Hỗ trợ khách hàng 24/7', 
      color: 'text-green-500', 
      action: () => window.open('https://zalo.me/g/escncv086', '_blank') 
    }
  ];

  const handleUpdatePassRequest = () => {
    if (oldPass !== user.password) return alert("Mật khẩu hiện tại không chính xác");
    if (newPass !== confirmPass) return alert("Mật khẩu xác nhận không khớp");
    if (newPass.length < 6) return alert("Mật khẩu mới phải từ 6 ký tự");
    setShowConfirmModal(true);
  };

  const finalizeUpdate = () => {
    onUpdatePassword(newPass);
    setShowConfirmModal(false);
    setShowChangePass(false);
    alert("Thay đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    onLogout();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col items-center py-6">
         <div className="w-24 h-24 bg-gradient-to-br from-[#FF8C1A] to-[#E67E17] rounded-[2.5rem] flex items-center justify-center mb-4 border-4 border-[#1A1A1A] shadow-2xl">
            <UserIcon size={48} className="text-black" />
         </div>
         <h2 className="text-2xl font-black uppercase tracking-tight">{user.fullName}</h2>
         <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1 bg-white/5 px-4 py-1 rounded-full">{user.tier} MEMBER</p>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-gray-800 space-y-5 shadow-xl">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-gray-800">
               <Phone size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Số Zalo xác thực</p>
               <p className="text-sm font-black text-white">{user.zaloNumber}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-gray-800">
               <Hash size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Số định danh CCCD</p>
               <p className="text-sm font-black text-white">{user.cccd}</p>
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
                className="w-full flex items-center justify-between p-6 hover:bg-black/20 border-b border-gray-800/50 last:border-0 transition-all active:scale-[0.98]"
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
        Đăng Xuất Khỏi Hệ Thống
      </button>

      {/* MODAL: ĐIỀU KHOẢN SỬ DỤNG */}
      {showTerms && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col p-6 animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-[#FF8C1A]/10 rounded-xl"><ScrollText className="text-[#FF8C1A]" size={24} /></div>
                 <div>
                    <h3 className="text-lg font-black uppercase text-white tracking-tighter">Chính sách & Điều khoản</h3>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">VNV MONEY PRO v37.2</p>
                 </div>
              </div>
              <button onClick={() => setShowTerms(false)} className="p-2 bg-white/5 rounded-full text-white"><X size={24}/></button>
           </div>

           <div className="flex-1 bg-white text-black rounded-[3rem] p-8 overflow-y-auto shadow-2xl custom-scrollbar space-y-8">
              <div className="text-center border-b border-gray-100 pb-6">
                 <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#FF8C1A] font-black mx-auto mb-3">VNV</div>
                 <h4 className="font-black text-sm uppercase">Quy chế vận hành & Nghĩa vụ</h4>
              </div>

              <div className="space-y-8 text-[11px] leading-relaxed text-gray-700">
                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-black uppercase">
                       <Scale size={16} className="text-[#FF8C1A]" />
                       <span>1. Điều khoản sử dụng</span>
                    </div>
                    <p className="pl-6">Người dùng cam kết cung cấp thông tin định danh chính chủ. Việc sử dụng thông tin giả mạo sẽ dẫn đến khóa tài khoản vĩnh viễn và truy cứu trách nhiệm trước cơ quan có thẩm quyền.</p>
                 </section>

                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-black uppercase">
                       <Clock size={16} className="text-[#FF8C1A]" />
                       <span>2. Thời hạn trả</span>
                    </div>
                    <p className="pl-6">Tất cả các khoản vay gốc và lãi phải được tất toán chậm nhất vào <span className="font-bold text-black">ngày 27 hàng tháng</span>. Hệ thống sẽ tự động chốt dư nợ vào thời điểm này.</p>
                 </section>

                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-red-600 uppercase">
                       <AlertCircle size={16} />
                       <span>3. Phí phạt</span>
                    </div>
                    <p className="pl-6 italic font-medium">Phí phạt trễ hạn được áp dụng là <span className="font-bold text-red-600">0.1%/ngày</span> trên tổng dư nợ. Phí này sẽ được cộng dồn hàng ngày cho đến khi khoản nợ được tất toán hoàn toàn.</p>
                 </section>

                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-black uppercase">
                       <ShieldAlert size={16} className="text-[#FF8C1A]" />
                       <span>4. Nghĩa vụ hoàn trả</span>
                    </div>
                    <p className="pl-6">Bên vay có nghĩa vụ hoàn trả đúng và đủ số nợ gốc kèm lãi, phí phạt (nếu có) theo đúng cam kết trong Hợp đồng tín dụng điện tử đã ký.</p>
                 </section>

                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-black uppercase">
                       <ShieldAlert size={16} className="text-red-600" />
                       <span>5. Thu hồi nợ</span>
                    </div>
                    <p className="pl-6">Trong trường hợp vi phạm nghĩa vụ thanh toán, hệ thống VNV có quyền áp dụng các biện pháp nhắc nợ thông qua các kênh liên lạc định danh và thu hồi tài sản theo quy định.</p>
                 </section>

                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-black uppercase">
                       <TrendingUp size={16} className="text-green-600" />
                       <span>6. Nâng cấp hạng</span>
                    </div>
                    <div className="pl-6 space-y-2">
                       <p><span className="font-bold">Tự động:</span> Hoàn thành <span className="text-green-600 font-bold">10 lần thanh toán đúng hạn</span> (đạt 10/10 điểm tiến trình) để tự động lên hạng tiếp theo.</p>
                       <p><span className="font-bold">Thủ công:</span> Gửi yêu cầu thẩm định nhanh với mức phí 5% hạn mức mới thông qua mục "Hạng & Hạn mức".</p>
                    </div>
                 </section>

                 <section className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-black uppercase">
                       <TrendingDown size={16} className="text-red-500" />
                       <span>7. Xuống Hạng</span>
                    </div>
                    <p className="pl-6">
                       Hệ thống áp dụng quy tắc <span className="font-bold text-red-500">Kỷ luật Tín dụng</span>: Cứ mỗi <span className="font-bold text-red-600">01 ngày trễ hạn</span> thanh toán, hệ thống sẽ tự động <span className="font-bold text-red-600">trừ 01 điểm tiến trình</span>. Khi điểm tiến trình <span className="font-bold">hết (về 0)</span>, tài khoản sẽ tự động bị <span className="font-bold text-red-600">xuống hạng thấp hơn</span> và giảm hạn mức tương ứng. Quy tắc này áp dụng cho đến khi Admin xác nhận khoản nợ đã được tất toán.
                    </p>
                 </section>
              </div>
              
              <div className="pt-6 border-t border-gray-100 text-center">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cập nhật: 27/05/2024</p>
              </div>
           </div>
           
           <button onClick={() => setShowTerms(false)} className="mt-6 w-full py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase shadow-xl transition-all active:scale-95">XÁC NHẬN ĐÃ HIỂU ĐIỀU KHOẢN</button>
        </div>
      )}

      {/* MODAL: ĐỔI MẬT KHẨU */}
      {showChangePass && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col p-6 overflow-y-auto backdrop-blur-md animate-in slide-in-from-top-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black uppercase text-[#FF8C1A]">Bảo mật</h3>
              <button onClick={() => setShowChangePass(false)} className="p-3 bg-white/5 rounded-full"><X size={24}/></button>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-1.5">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-4">Mật khẩu hiện tại</p>
                 <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-5 px-6 outline-none focus:border-[#FF8C1A] text-sm font-bold text-white transition-all" placeholder="••••••••" />
              </div>

              <div className="space-y-1.5">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-4">Mật khẩu mới</p>
                 <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-5 px-6 outline-none focus:border-[#FF8C1A] text-sm font-bold text-white transition-all" placeholder="Tối thiểu 6 ký tự" />
              </div>

              <div className="space-y-1.5">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-4">Xác nhận mật khẩu</p>
                 <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-5 px-6 outline-none focus:border-[#FF8C1A] text-sm font-bold text-white transition-all" placeholder="Nhập lại mật khẩu" />
              </div>

              <button onClick={handleUpdatePassRequest} className="w-full py-5 bg-[#FF8C1A] text-black font-black text-sm uppercase rounded-2xl shadow-xl active:scale-95 transition-all">Lưu thay đổi</button>
           </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={showConfirmModal}
        title="Đổi mật khẩu"
        message="Bạn có chắc chắn muốn thay đổi? Bạn sẽ được yêu cầu đăng nhập lại."
        onConfirm={finalizeUpdate}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default ProfileView;

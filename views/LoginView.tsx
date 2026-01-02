
import React, { useState } from 'react';
import { User, UserRole, UserTier } from '../types';
import { ShieldCheck, User as UserIcon, Lock, MapPin, Hash, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [zalo, setZalo] = useState('');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCccdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 12) setCccd(val);
  };

  const handleZaloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (val.length <= 10) setZalo(val);
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanZalo = zalo.trim();

    if (isRegistering) {
      if (fullName.trim().length < 5) return setError("Họ và tên quá ngắn");
      if (cccd.length !== 12) return setError("CCCD phải đúng 12 số");
      if (address.trim().length < 5) return setError("Vui lòng nhập địa chỉ cụ thể");
      if (cleanZalo.length !== 10) return setError("Số Zalo phải đúng 10 số");
      if (password.length < 6) return setError("Mật khẩu phải từ 6 ký tự");
      if (password !== confirmPassword) return setError("Mật khẩu xác nhận không đúng");
      if (!agreedToTerms) return setError("Bạn phải đồng ý với điều khoản");
      
      // KIỂM TRA TRÙNG LẶP TRÊN DANH SÁCH MỚI NHẤT TRONG PROPS
      const isDuplicate = users.some(u => u.zaloNumber === cleanZalo);
      if (isDuplicate) {
        return setError("Số Zalo này đã tồn tại trên hệ thống");
      }

      const newUser: User = {
        id: `U-${Date.now()}`,
        fullName: fullName.toUpperCase().trim(),
        zaloNumber: cleanZalo,
        cccd,
        address: address.trim(),
        role: UserRole.USER,
        tier: UserTier.STANDARD,
        limit: 2000000,
        joinedAt: new Date().toISOString(),
        isVerified: true,
        password: password
      };
      onRegister(newUser);
    } else {
      // 1. Kiểm tra Admin mặc định
      if (cleanZalo === 'Admin' && password === '119011Ngon') {
        const admin: User = {
          id: 'ADMIN-MASTER-01',
          fullName: 'HỆ THỐNG QUẢN TRỊ',
          zaloNumber: 'Admin',
          cccd: '000000000000',
          address: 'VNV Money HQ',
          role: UserRole.ADMIN,
          tier: UserTier.DIAMOND,
          limit: 1000000000,
          joinedAt: new Date().toISOString(),
          isVerified: true,
          password: '119011Ngon'
        };
        onLogin(admin);
        return;
      }

      // 2. Kiểm tra User trong danh sách thực tế (users prop từ App state)
      const foundUser = users.find(u => u.zaloNumber === cleanZalo);
      
      if (foundUser) {
        if (foundUser.password === password) {
          onLogin(foundUser);
        } else {
          setError("Mật khẩu không chính xác.");
        }
      } else {
        setError("Tài khoản không tồn tại. Hệ thống đã được Reset.");
      }
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center animate-in fade-in duration-700 bg-[#0F0F0F]">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#FF8C1A] rounded-[1.8rem] flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(255,140,26,0.3)] border-2 border-white/10">
          <ShieldCheck size={48} className="text-black" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">VNV MONEY</h1>
        <p className="text-[#FF8C1A] text-[9px] font-black uppercase tracking-[0.2em] mt-2 bg-[#FF8C1A]/10 px-3 py-1 rounded-full border border-[#FF8C1A]/20">MASTER AUTHENTICATION v37</p>
      </div>

      <form onSubmit={handleAction} className="space-y-4">
        {isRegistering ? (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="HỌ VÀ TÊN (IN HOA)" 
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold uppercase transition-all" required 
              />
            </div>

            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="tel"
                inputMode="numeric"
                value={cccd} onChange={handleCccdChange}
                placeholder="SỐ CCCD (12 SỐ)" 
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="ĐỊA CHỈ THƯỜNG TRÚ" 
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xs uppercase">Zalo</div>
              <input 
                type="tel"
                inputMode="numeric"
                value={zalo} onChange={handleZaloChange}
                placeholder="SỐ ĐIỆN THOẠI" 
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="MẬT KHẨU" className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="XÁC NHẬN MẬT KHẨU" className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>

            <div className="flex items-start gap-3 px-2 pt-1">
              <button 
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${agreedToTerms ? 'bg-[#FF8C1A] border-[#FF8C1A]' : 'border-gray-800 bg-[#1A1A1A]'}`}
              >
                {agreedToTerms && <div className="w-3 h-3 bg-black rounded-sm" />}
              </button>
              <p className="text-[10px] text-gray-600 font-bold leading-tight uppercase tracking-tighter">
                Tôi xác nhận thông tin cung cấp là chính xác và đồng ý với các <span className="text-[#FF8C1A]">Điều khoản pháp lý</span> của VNV MONEY.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xs uppercase">Zalo</div>
              <input 
                type="text"
                value={zalo} onChange={(e) => setZalo(e.target.value)}
                placeholder="SỐ ZALO / ADMIN" 
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="MẬT KHẨU" className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all" required 
              />
            </div>
          </div>
        )}

        {error && <div className="p-3 bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase text-center rounded-xl animate-in shake duration-300">{error}</div>}

        <button 
          type="submit"
          className="w-full py-4 bg-[#FF8C1A] text-black font-black text-lg rounded-2xl hover:bg-[#E67E17] transition-all transform active:scale-[0.97] shadow-[0_10px_20px_rgba(255,140,26,0.3)] uppercase tracking-widest mt-2"
        >
          {isRegistering ? "ĐĂNG KÝ NGAY" : "ĐĂNG NHẬP"}
        </button>

        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
            className="text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-[#FF8C1A] transition-colors"
          >
            {isRegistering ? "ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP" : "CHƯA CÓ TÀI KHOẢN? ĐĂNG KÝ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginView;

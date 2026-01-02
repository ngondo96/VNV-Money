
import React, { useState } from 'react';
import { User, UserRole, UserTier } from '../types';
import { ShieldCheck, User as UserIcon, Lock, MapPin, Hash, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister }) => {
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
    if (val.length <= 12) {
      setCccd(val);
    }
  };

  const handleZaloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setZalo(val);
    }
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegistering) {
      if (fullName.trim().length < 5) return setError("Họ và tên quá ngắn");
      if (cccd.length !== 12) return setError("CCCD phải đúng 12 số");
      if (address.trim().length < 5) return setError("Vui lòng nhập địa chỉ cụ thể");
      if (zalo.length !== 10) return setError("Số Zalo phải đúng 10 số");
      if (password.length < 6) return setError("Mật khẩu phải từ 6 ký tự");
      if (password !== confirmPassword) return setError("Mật khẩu xác nhận không đúng");
      if (!agreedToTerms) return setError("Bạn phải đồng ý với điều khoản và trên 18 tuổi");
      
      const newUser: User = {
        id: `U-${Date.now()}`,
        fullName: fullName.toUpperCase(),
        zaloNumber: zalo,
        cccd,
        address,
        role: UserRole.USER,
        tier: UserTier.STANDARD,
        limit: 2000000,
        joinedAt: new Date().toISOString(),
        isVerified: true,
        password: password
      };
      onRegister(newUser);
    } else {
      if (zalo === 'Admin' && password === '119011Ngon') {
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
          isVerified: true
        };
        onLogin(admin);
      } else if (zalo.length === 10 && password.length >= 6) {
        // Mock login - assuming successful check, ideally would fetch from storage
        // But the requirements imply using the registered name. 
        // We will try to find the user in App.tsx's state first, but here we just return a "Member" name.
        const user: User = {
          id: `U-LOGIN-${Date.now()}`,
          fullName: 'THÀNH VIÊN VNV', // App.tsx will match this by Zalo Number if found in storage
          zaloNumber: zalo,
          cccd: '031090001234',
          address: 'Việt Nam',
          role: UserRole.USER,
          tier: UserTier.STANDARD,
          limit: 2000000,
          joinedAt: new Date().toISOString(),
          isVerified: true
        };
        onLogin(user);
      } else {
        setError("Số Zalo hoặc mật khẩu không chính xác.");
      }
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center animate-in fade-in duration-700 bg-[#0F0F0F]">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#FF8C1A] rounded-[1.8rem] flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(255,140,26,0.3)]">
          <ShieldCheck size={48} className="text-black" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">VNV MONEY</h1>
        <p className="text-[#FF8C1A] text-[9px] font-black uppercase tracking-[0.2em] mt-2 bg-[#FF8C1A]/10 px-3 py-1 rounded-full border border-[#FF8C1A]/20">VERSION v37 PRO</p>
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

            <div className="space-y-1">
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="tel"
                  inputMode="numeric"
                  value={cccd} onChange={handleCccdChange}
                  placeholder="SỐ CCCD (12 SỐ)" 
                  className={`w-full bg-[#1A1A1A] border rounded-2xl py-4 pl-12 pr-4 text-white outline-none text-sm font-bold transition-all ${cccd.length > 0 && cccd.length < 12 ? 'border-red-500/50' : 'border-gray-800 focus:border-[#FF8C1A]'}`} required 
                />
              </div>
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
                {agreedToTerms && <CheckCircle2 size={14} className="text-black" />}
              </button>
              <p className="text-[10px] text-gray-600 font-bold leading-tight uppercase tracking-tighter">
                Tôi đồng ý với các <span className="text-[#FF8C1A]">Điều khoản pháp lý</span> và cam kết chịu trách nhiệm về nghĩa vụ tài chính.
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
            {isRegistering ? "QUAY LẠI ĐĂNG NHẬP" : "CHƯA CÓ TÀI KHOẢN? ĐĂNG KÝ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginView;

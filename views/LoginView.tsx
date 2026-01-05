
import React, { useState, useRef } from 'react';
import { User, UserRole, UserTier } from '../types';
import { ShieldCheck, User as UserIcon, Lock, MapPin, Hash, Users, HelpCircle, Camera, ImageIcon, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showRefTooltip, setShowRefTooltip] = useState(false);
  
  // Warning states for length validation
  const [showZaloWarning, setShowZaloWarning] = useState(false);
  const [showCccdWarning, setShowCccdWarning] = useState(false);
  const [showRefZaloWarning, setShowRefZaloWarning] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [zalo, setZalo] = useState('');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Reference Fields
  const [refZalo, setRefZalo] = useState('');
  const [refRelationship, setRefRelationship] = useState('Anh/Chị/Em');

  // KYC CCCD Fields
  const [cccdFront, setCccdFront] = useState<string | null>(null);
  const [cccdBack, setCccdBack] = useState<string | null>(null);
  const [processing, setProcessing] = useState<'front' | 'back' | null>(null);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleCccdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 12) {
      setCccd(val);
      setShowCccdWarning(val.length > 0 && val.length < 12);
    }
  };

  const handleZaloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    if (!isRegistering && val.toLowerCase().startsWith('a')) {
        setZalo(val);
        setShowZaloWarning(false);
        return;
    }

    const numericVal = val.replace(/\s/g, '').replace(/\D/g, '');
    if (numericVal.length <= 10) {
        setZalo(numericVal);
        setShowZaloWarning(numericVal.length > 0 && numericVal.length < 10);
    }
  };

  const handleRefZaloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (val.length <= 10) {
      setRefZalo(val);
      setShowRefZaloWarning(val.length > 0 && val.length < 10);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Dung lượng file gốc quá lớn (>10MB).");
        return;
      }
      
      setProcessing(side);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        if (side === 'front') setCccdFront(compressed);
        else setCccdBack(compressed);
        setProcessing(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent, side: 'front' | 'back') => {
    e.stopPropagation();
    if (side === 'front') setCccdFront(null);
    else setCccdBack(null);
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
      if (refZalo.length !== 10) return setError("Số Zalo tham chiếu phải đúng 10 số");
      if (refZalo === cleanZalo) return setError("Zalo tham chiếu không được trùng với cá nhân");
      if (!cccdFront || !cccdBack) return setError("Bắt buộc phải cung cấp đủ ảnh CCCD.");
      if (!agreedToTerms) return setError("Bạn phải đồng ý với điều khoản");
      
      const isDuplicate = users.some(u => u.zaloNumber === cleanZalo);
      if (isDuplicate) return setError("Số Zalo này đã tồn tại trên hệ thống");

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
        password: password,
        settlementProgress: 0,
        refZaloNumber: refZalo,
        refRelationship: refRelationship,
        cccdFrontImage: cccdFront,
        cccdBackImage: cccdBack
      };
      onRegister(newUser);
    } else {
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
          password: '119011Ngon',
          settlementProgress: 0
        };
        onLogin(admin);
        return;
      }

      if (cleanZalo !== 'Admin' && cleanZalo.length !== 10) {
          return setError("Số Zalo đăng nhập phải đúng 10 số");
      }

      const foundUser = users.find(u => u.zaloNumber === cleanZalo);
      if (foundUser) {
        if (foundUser.password === password) {
          onLogin(foundUser);
        } else {
          setError("Mật khẩu không chính xác.");
        }
      } else {
        setError("Tài khoản không tồn tại.");
      }
    }
  };

  const isFormComplete = fullName && cccd.length === 12 && zalo.length === 10 && address && password && password === confirmPassword && agreedToTerms && cccdFront && cccdBack;

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center animate-in fade-in duration-700 bg-[#0F0F0F] pb-24">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#FF8C1A] rounded-[1.8rem] flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(255,140,26,0.3)] border-2 border-white/10">
          <ShieldCheck size={48} className="text-black" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">VNV MONEY</h1>
        <p className="text-[#FF8C1A] text-[9px] font-black uppercase tracking-[0.2em] mt-2 bg-[#FF8C1A]/10 px-3 py-1 rounded-full border border-[#FF8C1A]/20">MASTER AUTHENTICATION v37.2</p>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="tel"
                  inputMode="numeric"
                  value={cccd} onChange={handleCccdChange}
                  placeholder="CCCD (12 SỐ)" 
                  className={`w-full bg-[#1A1A1A] border ${showCccdWarning ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-10 pr-2 text-white focus:border-[#FF8C1A] outline-none text-xs font-bold transition-all`} required 
                />
                {showCccdWarning && (
                  <div className="absolute -top-8 left-0 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1 uppercase z-10">
                    Cần 12 số
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-black text-[10px] uppercase">Zalo</div>
                <input 
                  type="tel"
                  inputMode="numeric"
                  value={zalo} onChange={handleZaloChange}
                  placeholder="SỐ CÁ NHÂN" 
                  className={`w-full bg-[#1A1A1A] border ${showZaloWarning ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-12 pr-2 text-white focus:border-[#FF8C1A] outline-none text-xs font-bold transition-all`} required 
                />
                {showZaloWarning && (
                  <div className="absolute -top-8 left-0 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1 uppercase z-10">
                    Cần 10 số
                  </div>
                )}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="MẬT KHẨU" className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 pl-10 pr-2 text-white focus:border-[#FF8C1A] outline-none text-xs font-bold transition-all" required 
                />
              </div>
              <div className="relative">
                <input 
                  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="XÁC NHẬN" className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 px-4 text-white focus:border-[#FF8C1A] outline-none text-xs font-bold transition-all" required 
                />
              </div>
            </div>

            {/* REFERENCE SECTION */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                   <span className="text-gray-600 font-black text-[9px] uppercase">Ref</span>
                   <button type="button" onMouseEnter={() => setShowRefTooltip(true)} onMouseLeave={() => setShowRefTooltip(false)} className="text-gray-600">
                     <HelpCircle size={10} />
                   </button>
                </div>
                <input 
                  type="tel"
                  inputMode="numeric"
                  value={refZalo} onChange={handleRefZaloChange}
                  placeholder="ZALO THAM CHIẾU" 
                  className={`w-full bg-[#1A1A1A] border ${showRefZaloWarning ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-12 pr-2 text-white focus:border-[#FF8C1A] outline-none text-[10px] font-bold transition-all`} required 
                />
                {showRefZaloWarning && (
                  <div className="absolute -top-8 left-0 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1 uppercase z-10">
                    Cần 10 số
                  </div>
                )}
                {showRefTooltip && (
                  <div className="absolute -top-12 left-0 right-0 bg-red-600 text-white text-[8px] font-black p-2 rounded-xl z-50 shadow-xl animate-in fade-in slide-in-from-bottom-2 uppercase">
                    Thông tin tham chiếu phải chính xác!
                  </div>
                )}
              </div>
              <div className="relative">
                <select 
                  value={refRelationship} 
                  onChange={(e) => setRefRelationship(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl py-4 px-4 pr-10 text-white focus:border-[#FF8C1A] outline-none text-[10px] font-bold appearance-none cursor-pointer transition-all"
                >
                  <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                  <option value="Vợ/Chồng">Vợ/Chồng</option>
                  <option value="Bố/Mẹ">Bố/Mẹ</option>
                  <option value="Đồng nghiệp">Đồng nghiệp</option>
                  <option value="Bạn bè">Bạn bè</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"><Users size={12}/></div>
              </div>
            </div>

            {/* KYC CCCD SECTION */}
            <div className="bg-[#151515] p-5 rounded-[2.5rem] border border-gray-800/50 space-y-4 shadow-inner">
               <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-black text-[#FF8C1A] uppercase tracking-[0.1em] flex items-center gap-2">
                    <Camera size={14} /> Xác thực CCCD (Bắt buộc)
                  </p>
                  <span className="text-[8px] text-gray-600 font-black uppercase">Nén ảnh thông minh</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  {/* Front Side Card */}
                  <div 
                    onClick={() => !processing && frontInputRef.current?.click()}
                    className={`group relative aspect-[3/2] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${cccdFront ? 'border-green-500/50 bg-black' : 'border-gray-800 bg-black/40 hover:border-[#FF8C1A]/50'} ${processing === 'front' ? 'opacity-50' : ''}`}
                  >
                    {processing === 'front' ? (
                      <Loader2 size={24} className="text-[#FF8C1A] animate-spin" />
                    ) : cccdFront ? (
                      <>
                        <img src={cccdFront} className="w-full h-full object-cover opacity-90" alt="Front" />
                        <button onClick={(e) => removeImage(e, 'front')} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-green-500/80 py-1 text-center">
                           <span className="text-[8px] font-black text-black uppercase">Mặt trước OK</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Camera size={20} className="text-[#FF8C1A]" />
                        <span className="text-[9px] font-black text-gray-500 uppercase text-center leading-tight">Mặt trước</span>
                      </div>
                    )}
                    <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'front')} />
                  </div>

                  {/* Back Side Card */}
                  <div 
                    onClick={() => !processing && backInputRef.current?.click()}
                    className={`group relative aspect-[3/2] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${cccdBack ? 'border-green-500/50 bg-black' : 'border-gray-800 bg-black/40 hover:border-[#FF8C1A]/50'} ${processing === 'back' ? 'opacity-50' : ''}`}
                  >
                    {processing === 'back' ? (
                      <Loader2 size={24} className="text-[#FF8C1A] animate-spin" />
                    ) : cccdBack ? (
                      <>
                        <img src={cccdBack} className="w-full h-full object-cover opacity-90" alt="Back" />
                        <button onClick={(e) => removeImage(e, 'back')} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-green-500/80 py-1 text-center">
                           <span className="text-[8px] font-black text-black uppercase">Mặt sau OK</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon size={20} className="text-[#FF8C1A]" />
                        <span className="text-[9px] font-black text-gray-500 uppercase text-center leading-tight">Mặt sau</span>
                      </div>
                    )}
                    <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'back')} />
                  </div>
               </div>
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
                Tôi cam kết thông tin cá nhân và ảnh CCCD là chính xác.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xs uppercase">Zalo</div>
              <input 
                type="text"
                value={zalo} onChange={handleZaloChange}
                placeholder="SỐ ZALO / ADMIN" 
                className={`w-full bg-[#1A1A1A] border ${showZaloWarning ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-14 pr-4 text-white focus:border-[#FF8C1A] outline-none text-sm font-bold transition-all`} required 
              />
              {showZaloWarning && (
                <div className="absolute -top-8 left-14 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1 uppercase z-10">
                  Số Zalo phải đủ 10 số
                </div>
              )}
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

        {error && (
          <div className="p-3 bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase text-center rounded-xl animate-in shake duration-300 flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={(isRegistering && (!isFormComplete || processing !== null))}
          className={`w-full py-4 font-black text-lg rounded-2xl transition-all transform active:scale-[0.97] shadow-[0_10px_20px_rgba(255,140,26,0.3)] uppercase tracking-widest mt-2 ${(isRegistering && (!isFormComplete || processing !== null)) ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50 grayscale' : 'bg-[#FF8C1A] text-black hover:bg-[#E67E17]'}`}
        >
          {processing ? "ĐANG NÉN ẢNH..." : isRegistering ? (isFormComplete ? "ĐĂNG KÝ NGAY" : "CẦN ĐỦ THÔNG TIN") : "ĐĂNG NHẬP"}
        </button>

        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(null); setShowZaloWarning(false); setShowCccdWarning(false); setShowRefZaloWarning(false); setZalo(''); setCccd(''); setRefZalo(''); }}
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

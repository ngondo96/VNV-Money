
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, UserTier, Loan, LoanStatus, AuditLog, SystemBudget, TierRequest } from './types';
import { INITIAL_SYSTEM_BUDGET, MOCK_IP, MOCK_DEVICE, FORMAT_CURRENCY, TIER_CONFIGS } from './constants';
import Layout from './components/Layout';
import ConfirmationModal from './components/ConfirmationModal';
import LoginView from './views/LoginView';
import UserDashboard from './views/UserDashboard';
import UserLoansView from './views/UserLoansView';
import TierView from './views/TierView';
import ContractListView from './views/ContractListView';
import ProfileView from './views/ProfileView';
import AdminDashboard from './views/AdminDashboard';
import AdminUserManagement from './views/AdminUserManagement';
import AdminLoanApproval from './views/AdminLoanApproval';
import AdminBudgetView from './views/AdminBudgetView';
import AdminLogsView from './views/AdminLogsView';
import AdminSettingsView from './views/AdminSettingsView';

const STORAGE_KEY = 'vnv_money_v37_data_master';
const AUTH_KEY = 'vnv_money_v37_auth_session';

const getSavedData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const getSavedAuth = () => {
  const saved = sessionStorage.getItem(AUTH_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const App: React.FC = () => {
  const isResetting = useRef(false);
  const initialData = getSavedData();
  const initialAuth = getSavedAuth();

  const [users, setUsers] = useState<User[]>(initialData?.users || []);
  const [loans, setLoans] = useState<Loan[]>(initialData?.loans || []);
  const [tierRequests, setTierRequests] = useState<TierRequest[]>(initialData?.tierRequests || []);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialData?.auditLogs || []);
  const [budget, setBudget] = useState<SystemBudget>(initialData?.budget || INITIAL_SYSTEM_BUDGET);

  const [isLoaded, setIsLoaded] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(initialAuth);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialAuth);
  const [activeTab, setActiveTab] = useState('home');
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; isWarning?: boolean } | null>(null);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && !isResetting.current) {
        const newData = getSavedData();
        if (newData) {
          setUsers(newData.users);
          setLoans(newData.loans);
          setTierRequests(newData.tierRequests);
          setAuditLogs(newData.auditLogs);
          setBudget(newData.budget);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isResetting.current && isLoaded) {
      const data = { users, loans, tierRequests, auditLogs, budget };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [users, loans, tierRequests, auditLogs, budget, isLoaded]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  }, [currentUser]);

  const addAuditLog = (performer: User | {fullName: string, id: string}, action: string) => {
    if (isResetting.current) return;
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      performerId: performer.id,
      performerName: performer.fullName,
      action,
      timestamp: new Date().toISOString(),
      ip: MOCK_IP,
      deviceId: MOCK_DEVICE
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (user: User, skipCheck: boolean = false) => {
    const isDefaultAdmin = user.zaloNumber === 'Admin' && user.role === UserRole.ADMIN;
    
    if (!skipCheck && !isDefaultAdmin) {
      const foundUser = users.find(u => u.zaloNumber === user.zaloNumber && u.password === user.password);
      if (!foundUser) {
        alert("Tài khoản không tồn tại hoặc sai mật khẩu.");
        return;
      }
      user = foundUser;
    }

    if (isDefaultAdmin && !users.find(u => u.zaloNumber === 'Admin')) {
      setUsers(prev => [...prev, user]);
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab(user.role === UserRole.ADMIN ? 'admin_dashboard' : 'home');
    addAuditLog(user, skipCheck ? "Đăng ký thành viên mới" : "Đăng nhập");
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog(currentUser, "Đăng xuất");
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('home');
    sessionStorage.removeItem(AUTH_KEY);
  };

  const handleUpdatePassword = (newPassword: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u));
    setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
    addAuditLog(currentUser, "Đã thay đổi mật khẩu truy cập");
    alert("Đã cập nhật mật khẩu thành công!");
  };

  const handleCreateLoan = (loanData: { amount: number; signature: string }) => {
    if (!currentUser) return;
    
    const userLoans = loans.filter(l => l.userId === currentUser.id);
    const hasPending = userLoans.some(l => 
      l.status === LoanStatus.REQUESTED || 
      l.status === LoanStatus.PROCESSING || 
      l.status === LoanStatus.APPROVED
    );

    if (hasPending) {
      alert("Hệ thống phát hiện bạn đang có hồ sơ chờ duyệt. Vui lòng đợi kết quả hồ sơ trước đó.");
      return;
    }

    const now = new Date();
    const d = now.getDate().toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear().toString().slice(-2);
    const dateStr = `${d}${m}${y}`;
    
    const todayPrefix = now.toISOString().split('T')[0];
    const todayLoansCount = loans.filter(l => l.requestedAt.startsWith(todayPrefix)).length;
    const loanId = `VNV-${dateStr}-${(todayLoansCount + 1).toString().padStart(3, '0')}`;

    const newLoan: Loan = {
      id: loanId,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userCccd: currentUser.cccd,
      amount: loanData.amount,
      status: LoanStatus.REQUESTED,
      requestedAt: now.toISOString(),
      fineRate: 0.001,
      accruedFine: 0,
      signatureData: loanData.signature
    };
    setLoans(prev => [newLoan, ...prev]);
    addAuditLog(currentUser, `Đăng ký vay mới: ${FORMAT_CURRENCY(loanData.amount)} (Mã: ${loanId})`);
    setActiveTab('loans');
  };

  const handleUpdateLoanStatus = (loanId: string, status: LoanStatus) => {
    if (!currentUser) return;
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        let updatedBudget = { ...budget };
        if (status === LoanStatus.DISBURSED) {
          updatedBudget.disbursed += loan.amount;
          updatedBudget.remaining -= loan.amount;
        } else if (status === LoanStatus.SETTLED) {
          updatedBudget.remaining += loan.amount;
          updatedBudget.disbursed -= loan.amount;
          updatedBudget.finesCollected += loan.accruedFine;
        }
        setBudget(updatedBudget);
        addAuditLog(currentUser, `Admin cập nhật ${loanId} thành ${status}`);
        return { 
          ...loan, 
          status, 
          disbursedAt: status === LoanStatus.DISBURSED ? new Date().toISOString() : loan.disbursedAt,
          settledAt: status === LoanStatus.SETTLED ? new Date().toISOString() : loan.settledAt
        };
      }
      return loan;
    }));
  };

  const handleRequestUpgrade = (requestedTier: UserTier) => {
    if (!currentUser) return;
    const req: TierRequest = {
      id: `REQ-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      requestedTier,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };
    setTierRequests(prev => [...prev, req]);
    addAuditLog(currentUser, `Yêu cầu nâng lên hạng ${requestedTier}`);
    alert(`Yêu cầu của bạn đã được gửi tới Ban Quản Trị.`);
  };

  const handleApproveTier = (requestId: string) => {
    if (!currentUser) return;
    setTierRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const targetUser = users.find(u => u.id === r.userId);
        if (targetUser) {
          const updatedUser = { 
            ...targetUser, 
            tier: r.requestedTier, 
            limit: TIER_CONFIGS[r.requestedTier].maxLimit 
          };
          setUsers(uPrev => uPrev.map(u => u.id === r.userId ? updatedUser : u));
          addAuditLog(currentUser, `Duyệt nâng hạng cho ${r.userName}`);
        }
        return { ...r, status: 'APPROVED' as const };
      }
      return r;
    }));
  };

  const handleRejectTier = (requestId: string) => {
    if (!currentUser) return;
    setTierRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        addAuditLog(currentUser, `Từ chối yêu cầu nâng hạng của ${r.userName}`);
        return { ...r, status: 'REJECTED' as const };
      }
      return r;
    }));
  };

  const handleResetSystem = () => {
    isResetting.current = true;
    localStorage.clear();
    sessionStorage.clear();

    const defaultAdmin: User = {
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

    const resetData = { 
      users: [defaultAdmin], 
      loans: [], 
      tierRequests: [], 
      auditLogs: [], 
      budget: { ...INITIAL_SYSTEM_BUDGET, total: 20000000, remaining: 20000000 } 
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    alert("Hệ thống đã Reset sạch 100%. Đang khởi động lại...");
    window.location.replace(window.location.origin);
  };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FF8C1A] font-black italic tracking-tighter uppercase">VNV MONEY PRO v37...</div>;

  const renderContent = () => {
    if (!isLoggedIn || !currentUser) return null;
    const userLoans = loans.filter(l => l.userId === currentUser.id);
    switch (activeTab) {
      case 'home': return <UserDashboard user={currentUser} loans={userLoans} budget={budget} />;
      case 'loans': return <UserLoansView user={currentUser} loans={userLoans} onCreateLoan={handleCreateLoan} />;
      case 'tier': return <TierView user={currentUser} onUpgrade={handleRequestUpgrade} tierRequests={tierRequests} />;
      case 'contracts': return <ContractListView loans={userLoans.filter(l => l.signatureData)} />;
      case 'profile': return <ProfileView user={currentUser} onLogout={handleLogout} onUpdatePassword={handleUpdatePassword} />;
      case 'admin_dashboard': return <AdminDashboard budget={budget} loans={loans} users={users} />;
      case 'admin_users': return <AdminUserManagement users={users} tierRequests={tierRequests} onApproveTier={handleApproveTier} onRejectTier={handleRejectTier} onUpdateUser={(u) => setUsers(prev => prev.map(p => p.id === u.id ? u : p))} />;
      case 'admin_loans': return <AdminLoanApproval loans={loans} onUpdateStatus={handleUpdateLoanStatus} budget={budget} />;
      case 'admin_budget': return <AdminBudgetView budget={budget} setBudget={(b) => setBudget(b)} />;
      case 'admin_logs': return <AdminLogsView logs={auditLogs} />;
      case 'admin_settings': return <AdminSettingsView onReset={handleResetSystem} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {isLoggedIn && currentUser ? (
        <Layout role={currentUser.role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
          {renderContent()}
        </Layout>
      ) : (
        <LoginView 
          users={users} 
          onLogin={(u) => handleLogin(u, false)} 
          onRegister={(u) => { 
            setUsers(prev => [...prev, u]); 
            handleLogin(u, true); 
          }} 
        />
      )}
      {modal && <ConfirmationModal {...modal} onCancel={() => setModal(null)} />}
      {!isLoggedIn && (
        <div className="fixed bottom-4 left-0 right-0 px-8 text-center text-[10px] text-gray-600 uppercase tracking-tighter z-10 font-black">
          VNV MONEY v37 – PROFESSIONAL FINANCIAL SECURITY SYSTEM
        </div>
      )}
    </div>
  );
};

export default App;

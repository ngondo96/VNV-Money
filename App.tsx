
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  try { return JSON.parse(saved); } catch { return null; }
};

const getSavedAuth = () => {
  const saved = sessionStorage.getItem(AUTH_KEY);
  if (!saved) return null;
  try { return JSON.parse(saved); } catch { return null; }
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

  useEffect(() => {
    if (!isResetting.current && isLoaded) {
      const data = { users, loans, tierRequests, auditLogs, budget };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [users, loans, tierRequests, auditLogs, budget, isLoaded]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      const latest = users.find(u => u.id === currentUser.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(currentUser)) setCurrentUser(latest);
    }
  }, [users, currentUser]);

  const addAuditLog = (performer: User | {fullName: string, id: string}, action: string) => {
    if (isResetting.current) return;
    setAuditLogs(prev => [{ id: `LOG-${Date.now()}`, performerId: performer.id, performerName: performer.fullName, action, timestamp: new Date().toISOString(), ip: MOCK_IP, deviceId: MOCK_DEVICE }, ...prev]);
  };

  const applyOverduePenalty = useCallback(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const dueDate = 27;

    setUsers(prevUsers => prevUsers.map(u => {
      if (u.role === UserRole.ADMIN) return u;
      const userLoans = loans.filter(l => l.userId === u.id && l.status === LoanStatus.DISBURSED);
      if (currentDay > dueDate && userLoans.length > 0) {
        const daysLate = currentDay - dueDate;
        let newProgress = u.settlementProgress - daysLate;
        let newTier = u.tier;
        let newLimit = u.limit;
        while (newProgress <= 0 && newTier !== UserTier.STANDARD) {
          const tiers = Object.values(UserTier);
          const currentIdx = tiers.indexOf(newTier);
          if (currentIdx > 0) {
            newTier = tiers[currentIdx - 1];
            newLimit = TIER_CONFIGS[newTier].maxLimit;
            newProgress = 10 + newProgress;
            addAuditLog({fullName: 'Hệ thống', id: 'SYSTEM'}, `CẢNH BÁO: Khách hàng ${u.fullName} bị HẠ HẠNG xuống ${newTier} do trễ hạn ${daysLate} ngày.`);
          } else {
            newTier = UserTier.STANDARD;
            newProgress = 0;
            break;
          }
        }
        if (newTier === UserTier.STANDARD) newProgress = Math.max(0, newProgress);
        if (newTier !== u.tier || newProgress !== u.settlementProgress) {
          return { ...u, settlementProgress: newProgress, tier: newTier, limit: newLimit };
        }
      }
      return u;
    }));
  }, [loans]);

  useEffect(() => {
    if (isLoggedIn) applyOverduePenalty();
  }, [isLoggedIn, activeTab, applyOverduePenalty]);

  const handleLogin = (user: User, skipCheck: boolean = false) => {
    const isDefaultAdmin = user.zaloNumber === 'Admin' && user.role === UserRole.ADMIN;
    if (!skipCheck && !isDefaultAdmin) {
      const found = users.find(u => u.zaloNumber === user.zaloNumber && u.password === user.password);
      if (!found) return alert("Sai tài khoản hoặc mật khẩu");
      user = found;
    }
    if (isDefaultAdmin && !users.find(u => u.zaloNumber === 'Admin')) setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab(user.role === UserRole.ADMIN ? 'admin_dashboard' : 'home');
    addAuditLog(user, skipCheck ? "Đăng ký mới" : "Đăng nhập");
  };

  const handleLogout = () => { if (currentUser) addAuditLog(currentUser, "Đăng xuất"); setCurrentUser(null); setIsLoggedIn(false); setActiveTab('home'); sessionStorage.removeItem(AUTH_KEY); };

  const handleCreateLoan = (loanData: { amount: number; signature: string; aiScore: number }) => {
    if (!currentUser) return;
    const now = new Date();
    const d = now.getDate().toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear().toString().slice(-2);
    const loanId = `VNV-${d}${m}${y}-${(loans.length + 1).toString().padStart(3, '0')}`;
    const newLoan: Loan = { id: loanId, userId: currentUser.id, userName: currentUser.fullName, userCccd: currentUser.cccd, amount: loanData.amount, status: LoanStatus.REQUESTED, requestedAt: now.toISOString(), fineRate: 0.001, accruedFine: 0, signatureData: loanData.signature, aiCreditScore: loanData.aiScore };
    setLoans(prev => [newLoan, ...prev]);
    addAuditLog(currentUser, `Đăng ký vay mới (Mã: ${loanId})`);
    setActiveTab('loans');
  };

  const handleUpdateLoanStatus = (loanId: string, status: LoanStatus) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        if (status === LoanStatus.DISBURSED) setBudget(b => ({ ...b, disbursed: b.disbursed + loan.amount, remaining: b.remaining - loan.amount }));
        if (status === LoanStatus.SETTLED) {
          setBudget(b => ({ ...b, remaining: b.remaining + loan.amount, disbursed: b.disbursed - loan.amount, finesCollected: b.finesCollected + (loan.accruedFine || 0) }));
          setUsers(uPrev => uPrev.map(u => {
            if (u.id === loan.userId) {
              let p = u.settlementProgress + 1;
              let t = u.tier;
              let l = u.limit;
              if (p >= 10) { 
                p = 0; 
                const tiers = Object.values(UserTier); 
                const idx = tiers.indexOf(u.tier); 
                if (idx < tiers.length - 1) { 
                  t = tiers[idx + 1]; 
                  l = TIER_CONFIGS[t].maxLimit; 
                  addAuditLog({fullName: 'Hệ thống', id: 'SYSTEM'}, `Khách hàng ${u.fullName} được nâng hạng ${t} tự động.`);
                } 
              }
              return { ...u, settlementProgress: p, tier: t, limit: l };
            }
            return u;
          }));
        }
        return { ...loan, status, disbursedAt: status === LoanStatus.DISBURSED ? new Date().toISOString() : loan.disbursedAt, settledAt: status === LoanStatus.SETTLED ? new Date().toISOString() : loan.settledAt };
      }
      return loan;
    }));
  };

  const handleRequestUpgrade = (tier: UserTier) => {
    if (!currentUser) return;
    const newReq: TierRequest = { id: `REQ-${Date.now()}`, userId: currentUser.id, userName: currentUser.fullName, requestedTier: tier, status: 'PENDING', timestamp: new Date().toISOString() };
    setTierRequests(prev => [newReq, ...prev]);
    addAuditLog(currentUser, `Gửi yêu cầu nâng lên hạng: ${tier}`);
  };

  const handleApproveTier = (reqId: string) => {
    const req = tierRequests.find(r => r.id === reqId);
    if (!req) return;
    setUsers(prev => prev.map(u => {
      if (u.id === req.userId) return { ...u, tier: req.requestedTier, limit: TIER_CONFIGS[req.requestedTier].maxLimit, settlementProgress: 0 };
      return u;
    }));
    setTierRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'APPROVED' } : r));
    addAuditLog({fullName: 'Hệ thống', id: 'SYSTEM'}, `Phê duyệt nâng hạng ${req.requestedTier} cho khách hàng ${req.userName}`);
  };

  const handleRejectTier = (reqId: string) => setTierRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'REJECTED' } : r));

  const handleResetSystem = () => { isResetting.current = true; localStorage.clear(); sessionStorage.clear(); window.location.reload(); };

  // Calculate notifications for Admin
  const pendingLoanCount = loans.filter(l => l.status === LoanStatus.REQUESTED).length;
  const pendingTierReqCount = tierRequests.filter(r => r.status === 'PENDING').length;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {isLoggedIn && currentUser ? (
        <Layout 
          role={currentUser.role} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout}
          notifications={{
            admin_users: pendingTierReqCount,
            admin_loans: pendingLoanCount
          }}
        >
          {activeTab === 'home' && <UserDashboard user={currentUser} loans={loans.filter(l => l.userId === currentUser.id)} budget={budget} />}
          {activeTab === 'loans' && <UserLoansView user={currentUser} budget={budget} loans={loans.filter(l => l.userId === currentUser.id)} onCreateLoan={handleCreateLoan} />}
          {activeTab === 'tier' && <TierView user={currentUser} onUpgrade={handleRequestUpgrade} tierRequests={tierRequests} />}
          {activeTab === 'contracts' && <ContractListView loans={loans.filter(l => l.userId === currentUser.id && l.signatureData)} />}
          {activeTab === 'profile' && <ProfileView user={currentUser} onLogout={handleLogout} onUpdatePassword={(p) => setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: p } : u))} />}
          {activeTab === 'admin_dashboard' && <AdminDashboard budget={budget} loans={loans} users={users} />}
          {activeTab === 'admin_users' && <AdminUserManagement users={users} tierRequests={tierRequests} onApproveTier={handleApproveTier} onRejectTier={handleRejectTier} onUpdateUser={() => {}} />}
          {activeTab === 'admin_loans' && <AdminLoanApproval loans={loans} onUpdateStatus={handleUpdateLoanStatus} budget={budget} />}
          {activeTab === 'admin_budget' && <AdminBudgetView budget={budget} setBudget={setBudget} />}
          {activeTab === 'admin_logs' && <AdminLogsView logs={auditLogs} />}
          {activeTab === 'admin_settings' && <AdminSettingsView onReset={handleResetSystem} />}
        </Layout>
      ) : (
        <LoginView users={users} onLogin={handleLogin} onRegister={(u) => { setUsers(p => [...p, u]); handleLogin(u, true); }} />
      )}
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const STORAGE_KEY = 'vnv_money_v37_data_master';

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [tierRequests, setTierRequests] = useState<TierRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [budget, setBudget] = useState<SystemBudget>(INITIAL_SYSTEM_BUDGET);
  const [activeTab, setActiveTab] = useState('home');
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; isWarning?: boolean } | null>(null);

  // Load Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUsers(parsed.users || []);
        setLoans(parsed.loans || []);
        setTierRequests(parsed.tierRequests || []);
        setAuditLogs(parsed.auditLogs || []);
        setBudget(parsed.budget || INITIAL_SYSTEM_BUDGET);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save Persistence - Dữ liệu được lưu ngay lập tức khi state thay đổi
  useEffect(() => {
    if (isLoaded) {
      const data = { users, loans, tierRequests, auditLogs, budget };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [users, loans, tierRequests, auditLogs, budget, isLoaded]);

  const addAuditLog = (performer: User | {fullName: string, id: string}, action: string) => {
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

  const handleLogin = (user: User) => {
    // Tìm kiếm user thực tế trong database storage bằng số Zalo
    const existingUser = users.find(u => u.zaloNumber === user.zaloNumber);
    const finalUser = existingUser || user;
    
    setCurrentUser(finalUser);
    setIsLoggedIn(true);
    setActiveTab(finalUser.role === UserRole.ADMIN ? 'admin_dashboard' : 'home');
    addAuditLog(finalUser, "Đăng nhập hệ thống - Đồng bộ realtime");
  };

  const handleLogout = () => {
    if (currentUser) addAuditLog(currentUser, "Đăng xuất hệ thống");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  const handleCreateLoan = (loanData: { amount: number; signature: string }) => {
    if (!currentUser) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN').split('/').join('');
    const newLoan: Loan = {
      id: `VNV-${dateStr}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      amount: loanData.amount,
      status: LoanStatus.REQUESTED,
      requestedAt: now.toISOString(),
      fineRate: 0.001,
      accruedFine: 0,
      signatureData: loanData.signature
    };
    setLoans(prev => [newLoan, ...prev]);
    addAuditLog(currentUser, `Gửi yêu cầu vay: ${FORMAT_CURRENCY(loanData.amount)} (${newLoan.id})`);
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
        addAuditLog(currentUser, `Cập nhật trạng thái vay ${loanId} thành ${status}`);
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
    addAuditLog(currentUser, `Yêu cầu nâng cấp hạng lên ${requestedTier}`);
    alert(`Yêu cầu đã được gửi thành công.`);
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
          addAuditLog(currentUser, `Phê duyệt nâng hạng ${r.requestedTier} cho ${r.userName}`);
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
        addAuditLog(currentUser, `Từ chối nâng hạng ${r.requestedTier} cho ${r.userName}`);
        return { ...r, status: 'REJECTED' as const };
      }
      return r;
    }));
  };

  const handleResetSystem = () => {
    if (!currentUser) return;
    const adminAccount = users.find(u => u.role === UserRole.ADMIN) || currentUser;
    setUsers([adminAccount]); 
    setLoans([]);
    setTierRequests([]);
    setAuditLogs([]);
    setBudget({ 
      total: 50000000, 
      disbursed: 0, 
      remaining: 50000000, 
      finesCollected: 0 
    });
    addAuditLog(adminAccount, "Thực thi RESET TOÀN BỘ DỮ LIỆU HỆ THỐNG.");
    alert("Hệ thống đã được đưa về trạng thái mặc định.");
    setActiveTab('admin_dashboard');
  };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FF8C1A] font-black italic animate-pulse">VNV MONEY PRO...</div>;

  const renderContent = () => {
    if (!isLoggedIn || !currentUser) return null;
    switch (activeTab) {
      case 'home': return <UserDashboard user={currentUser} loans={loans.filter(l => l.userId === currentUser.id)} budget={budget} />;
      case 'loans': return <UserLoansView user={currentUser} loans={loans.filter(l => l.userId === currentUser.id)} onCreateLoan={handleCreateLoan} />;
      case 'tier': return <TierView user={currentUser} onUpgrade={handleRequestUpgrade} tierRequests={tierRequests} />;
      case 'contracts': return <ContractListView loans={loans.filter(l => l.userId === currentUser.id && l.signatureData)} />;
      case 'profile': return <ProfileView user={currentUser} onLogout={handleLogout} />;
      case 'admin_dashboard': return <AdminDashboard budget={budget} loans={loans} users={users} />;
      case 'admin_users': return <AdminUserManagement users={users} tierRequests={tierRequests} onApproveTier={handleApproveTier} onRejectTier={handleRejectTier} onUpdateUser={(u) => setUsers(prev => prev.map(p => p.id === u.id ? u : p))} />;
      case 'admin_loans': return <AdminLoanApproval loans={loans} onUpdateStatus={handleUpdateLoanStatus} budget={budget} />;
      case 'admin_budget': return <AdminBudgetView budget={budget} setBudget={(b) => { setBudget(b); addAuditLog(currentUser, `Điều chỉnh vốn ngân sách: ${FORMAT_CURRENCY(b.total)}`); }} />;
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
        <LoginView onLogin={handleLogin} onRegister={(u) => { setUsers(prev => [...prev, u]); handleLogin(u); }} />
      )}
      {modal && <ConfirmationModal {...modal} onCancel={() => setModal(null)} />}
      {!isLoggedIn && (
        <div className="fixed bottom-4 left-0 right-0 px-8 text-center text-[10px] text-gray-600 uppercase tracking-tighter z-10">
          VNV MONEY v37 – HỆ THỐNG GHI NHẬN THỎA THUẬN VAY TỰ NGUYỆN (18+)
        </div>
      )}
    </div>
  );
};

export default App;

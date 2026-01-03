
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserTier {
  STANDARD = 'TIÊU CHUẨN',
  BRONZE = 'ĐỒNG',
  SILVER = 'BẠC',
  GOLD = 'VÀNG',
  DIAMOND = 'KIM CƯƠNG'
}

export enum LoanStatus {
  REQUESTED = 'Đã gửi yêu cầu',
  PROCESSING = 'Đang xử lý',
  APPROVED = 'Đã duyệt',
  DISBURSED = 'Đã giải ngân',
  SETTLED = 'Đã tất toán',
  REJECTED = 'Từ chối'
}

export interface User {
  id: string;
  fullName: string;
  zaloNumber: string;
  cccd: string;
  address: string;
  role: UserRole;
  tier: UserTier;
  limit: number;
  joinedAt: string;
  password?: string;
  isVerified: boolean;
  settlementProgress: number;
  // Thông tin tham chiếu mới
  refZaloNumber?: string;
  refRelationship?: string;
}

export interface Loan {
  id: string; 
  userId: string;
  userName: string;
  userCccd: string; 
  amount: number;
  status: LoanStatus;
  requestedAt: string;
  disbursedAt?: string;
  settledAt?: string;
  fineRate: number; 
  accruedFine: number;
  signatureData?: string; 
  aiCreditScore?: number;
}

export interface TierRequest {
  id: string;
  userId: string;
  userName: string;
  requestedTier: UserTier;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  performerId: string;
  performerName: string;
  action: string;
  timestamp: string;
  ip: string;
  deviceId: string;
}

export interface SystemBudget {
  total: number;
  disbursed: number;
  remaining: number;
  finesCollected: number;
}

export interface TierConfig {
  name: UserTier;
  minLimit: number;
  maxLimit: number;
  benefits: string[];
}

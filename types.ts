
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
}

export interface Loan {
  id: string; // VNV-DDMMYY-XXX
  userId: string;
  userName: string;
  userCccd: string; // Lưu CCCD tại thời điểm ký
  amount: number;
  status: LoanStatus;
  requestedAt: string;
  disbursedAt?: string;
  settledAt?: string;
  fineRate: number; // 0.1% per day
  accruedFine: number;
  signatureData?: string; // Base64 signature
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

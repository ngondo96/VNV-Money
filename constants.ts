
import { UserTier, TierConfig } from './types';

export const COLORS = {
  bg: '#0F0F0F',
  accent: '#FF8C1A',
  text: '#FFFFFF',
  gray: '#1A1A1A',
  danger: '#EF4444',
  success: '#10B981'
};

export const TIER_CONFIGS: Record<UserTier, TierConfig> = {
  [UserTier.STANDARD]: {
    name: UserTier.STANDARD,
    minLimit: 1000000,
    maxLimit: 2000000,
    benefits: ['Hạn mức tối đa 2 triệu', 'Duyệt trong 24h']
  },
  [UserTier.BRONZE]: {
    name: UserTier.BRONZE,
    minLimit: 1000000,
    maxLimit: 3000000,
    benefits: ['Hạn mức tối đa 3 triệu', 'Ưu tiên duyệt lệnh']
  },
  [UserTier.SILVER]: {
    name: UserTier.SILVER,
    minLimit: 1000000,
    maxLimit: 4000000,
    benefits: ['Hạn mức tối đa 4 triệu', 'Hỗ trợ 24/7']
  },
  [UserTier.GOLD]: {
    name: UserTier.GOLD,
    minLimit: 1000000,
    maxLimit: 5000000,
    benefits: ['Hạn mức tối đa 5 triệu', 'Giảm 10% phí phạt']
  },
  [UserTier.DIAMOND]: {
    name: UserTier.DIAMOND,
    minLimit: 1000000,
    maxLimit: 10000000,
    benefits: ['Hạn mức tối đa 10 triệu', 'Duyệt lệnh tức thì']
  }
};

export const INITIAL_SYSTEM_BUDGET = {
  total: 20000000, // Updated to 20 million as per request
  disbursed: 0,
  remaining: 20000000,
  finesCollected: 0
};

export const FORMAT_CURRENCY = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

// Helper for formatted input (dots every 3 digits)
export const FORMAT_INPUT_NUMBER = (val: string) => {
  const num = val.replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const MOCK_IP = "192.168.1.105";
export const MOCK_DEVICE = "iPhone 15 Pro Max (v37 PRO)";

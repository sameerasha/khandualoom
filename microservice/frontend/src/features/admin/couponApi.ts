export interface CouponDefinition {
  id: string;
  code: string;
  discountType: 'FLAT' | 'PERCENT';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface BankOffer {
  id: string;
  bankName: string;
  cardType: string;
  discountText: string;
  minSpend: number;
  maxDiscount: number;
  isActive: boolean;
}

const STORAGE_KEY_COUPONS = 'khandualoom_admin_coupons';
const STORAGE_KEY_BANK_OFFERS = 'khandualoom_admin_bank_offers';

export const initialCoupons: CouponDefinition[] = [
  {
    id: 'c-001',
    code: 'MYNTRA100',
    discountType: 'FLAT',
    value: 100,
    minOrder: 999,
    description: 'FLAT ₹100 OFF on all Handloom Sarees',
    usageLimit: 500,
    usedCount: 142,
    isActive: true,
  },
  {
    id: 'c-002',
    code: 'MYNTRA200',
    discountType: 'FLAT',
    value: 200,
    minOrder: 1999,
    description: 'FLAT ₹200 OFF on Pure Silk Sarees',
    usageLimit: 250,
    usedCount: 89,
    isActive: true,
  },
  {
    id: 'c-003',
    code: 'KHANDUA15',
    discountType: 'PERCENT',
    value: 15,
    minOrder: 4999,
    maxDiscount: 1500,
    description: '15% Royal Brocade Discount',
    usageLimit: 100,
    usedCount: 23,
    isActive: true,
  },
];

export const initialBankOffers: BankOffer[] = [
  {
    id: 'b-001',
    bankName: 'Kotak Bank',
    cardType: 'Credit Card',
    discountText: '7.5% Instant Discount up to ₹750',
    minSpend: 2500,
    maxDiscount: 750,
    isActive: true,
  },
  {
    id: 'b-002',
    bankName: 'HDFC Bank',
    cardType: 'Credit & Debit Card EMI',
    discountText: '10% Instant Discount up to ₹1,000',
    minSpend: 6000,
    maxDiscount: 1000,
    isActive: true,
  },
  {
    id: 'b-003',
    bankName: 'ICICI Bank',
    cardType: 'Credit Card',
    discountText: '10% Instant Discount on Handloom Collections',
    minSpend: 3000,
    maxDiscount: 1000,
    isActive: true,
  },
  {
    id: 'b-004',
    bankName: 'Axis Bank',
    cardType: 'Credit Card EMI',
    discountText: '10% Instant Discount up to ₹1,000',
    minSpend: 5000,
    maxDiscount: 1000,
    isActive: true,
  },
  {
    id: 'b-005',
    bankName: 'Paytm UPI',
    cardType: 'UPI Handle',
    discountText: 'Assured Cashback up to ₹100 on UPI Transactions',
    minSpend: 999,
    maxDiscount: 100,
    isActive: true,
  },
];

export const validateCouponCreation = (
  data: Partial<CouponDefinition>
): { isValid: boolean; error?: string } => {
  if (!data.code || data.code.trim().length < 3) {
    return { isValid: false, error: 'Coupon code must be at least 3 characters' };
  }
  if (data.code !== data.code.toUpperCase() || /\s/.test(data.code)) {
    return { isValid: false, error: 'Coupon code must be uppercase without spaces' };
  }
  if (!data.value || data.value <= 0) {
    return { isValid: false, error: 'Discount value must be greater than 0' };
  }
  if (data.discountType === 'PERCENT' && data.value > 90) {
    return { isValid: false, error: 'Percentage discount cannot exceed 90%' };
  }
  if (data.minOrder !== undefined && data.minOrder < 0) {
    return { isValid: false, error: 'Minimum order amount cannot be negative' };
  }
  return { isValid: true };
};

export const loadCoupons = (): CouponDefinition[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
    if (!raw) return initialCoupons;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCoupons;
  } catch {
    return initialCoupons;
  }
};

export const saveCoupons = (coupons: CouponDefinition[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
  } catch {}
};

export const loadBankOffers = (): BankOffer[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANK_OFFERS);
    if (!raw) return initialBankOffers;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialBankOffers;
  } catch {
    return initialBankOffers;
  }
};

export const saveBankOffers = (offers: BankOffer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_BANK_OFFERS, JSON.stringify(offers));
  } catch {}
};

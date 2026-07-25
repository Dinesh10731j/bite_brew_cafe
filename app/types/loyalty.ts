// ============================================================
// Bite & Brew — Loyalty System Types
// ============================================================

export type MembershipTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export type TransactionType = "EARNING" | "REDEMPTION" | "ADJUSTMENT" | "EXPIRATION";

export type TransactionStatus = "completed" | "pending" | "failed";

// ============================================================
// Dashboard
// ============================================================

export type LoyaltyDashboard = {
  points: number;
  lifetimePoints: number;
  lifetimeRedeemed: number;
  expiredPoints: number;
  tier: MembershipTier;
  nextTier: MembershipTier | null;
  currentTierSpending: number;
  nextTierSpendingRequired: number;
  nextTierProgressPercent: number;
  checkInStreak: number;
  lastCheckInDate: string | null;
  canCheckIn: boolean;
  referralCode: string;
  referralLink: string;
  referralBenefits: string;
  recentTransactions: LoyaltyTransaction[];
};

// ============================================================
// Reward Catalog
// ============================================================

/**
 * Raw reward item shape returned from the backend.
 */
export type RawRewardItem = {
  id: string;
  title: string;
  type: string;
  pointsRequired: number;
  isActive: boolean;
  usageLimit: number;
  inventoryLimit: number;
  validityDays: number;
  expiryDate: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

/**
 * Frontend-facing reward item shape (mapped from raw backend).
 */
export type RewardItem = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl: string | null;
  category: string;
  available: boolean;
  expiresInDays: number | null;
};

/**
 * Raw catalog response from the backend.
 */
export type RawRewardCatalogResponse = {
  message: string;
  data: RawRewardItem[];
  isCached: boolean;
};

export type RewardCatalogResponse = {
  data: RewardItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ============================================================
// Wallet (Redeemed Rewards)
// ============================================================

export type RedeemedReward = {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardDescription: string;
  pointsUsed: number;
  redeemedAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  status: "available" | "used" | "expired";
  code: string;
};

export type WalletResponse = {
  data: RedeemedReward[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ============================================================
// Transaction History
// ============================================================

export type LoyaltyTransaction = {
  id: string;
  type: TransactionType;
  points: number;
  description: string;
  balance: number;
  createdAt: string;
  status: TransactionStatus;
  referenceId: string | null;
};

export type HistoryResponse = {
  data: LoyaltyTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ============================================================
// Check-in
// ============================================================

export type CheckInResponse = {
  success: boolean;
  pointsEarned: number;
  streak: number;
  message: string;
};

// ============================================================
// Referral
// ============================================================

export type ReferralClaimResponse = {
  success: boolean;
  pointsEarned: number;
  message: string;
};

// ============================================================
// Redeem
// ============================================================

export type RedeemResponse = {
  success: boolean;
  redeemedReward: RedeemedReward;
  pointsRemaining: number;
  message: string;
};

// ============================================================
// API Params
// ============================================================

export type LoyaltyHistoryParams = {
  page?: number;
  limit?: number;
  type?: TransactionType;
};


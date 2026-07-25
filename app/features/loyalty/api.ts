// ============================================================
// Bite & Brew — Loyalty API Service
// ============================================================

import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";
import type {
  LoyaltyDashboard,
  LoyaltyTransaction,
  MembershipTier,
  TransactionType,
  RawRewardItem,
  RawRewardCatalogResponse,
  RewardItem,
  RewardCatalogResponse,
  WalletResponse,
  RedeemedReward,
  CheckInResponse,
  ReferralClaimResponse,
  RedeemResponse,
  HistoryResponse,
  LoyaltyHistoryParams,
} from "@/app/types/loyalty";

// Runtime constant mirroring the MembershipTier type for lookups
const TIER_VALUES = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;

const parseError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { message?: string; error?: string } };
    };
    const data = axiosError.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

/**
 * Tier spending thresholds.
 * These define how much spending is needed to reach each tier.
 */
const TIER_SPENDING_THRESHOLDS: Record<MembershipTier, number> = {
  BRONZE: 0,
  SILVER: 5000,
  GOLD: 15000,
  PLATINUM: 30000,
};

/**
 * Tier hierarchy for determining the next tier.
 */
const TIER_ORDER: MembershipTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

/**
 * Resolve the next tier based on the current tier.
 */
function getNextTier(currentTier: MembershipTier): MembershipTier | null {
  const idx = TIER_ORDER.indexOf(currentTier);
  if (idx === -1 || idx >= TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

// ─────────────────────────────────────────────────────────────
// Raw API response shapes (internal — not exported)
// ─────────────────────────────────────────────────────────────

interface RawAccount {
  currentPoints: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  expiredPoints: number;
  membershipTier: string;
  totalSpending: number;
  referralCode: string;
}

interface RawDashboardData {
  account: RawAccount;
  streakCount: number;
  lastCheckInDate: string | null;
  activeRewards: number;
}

interface RawDashboardResponse {
  message: string;
  data: RawDashboardData;
  isCached: boolean;
}

interface RawTransaction {
  id: string;
  customerId: string;
  amount: number;
  type: TransactionType;
  reason: string;
  balanceAfter: number;
  sourceType: string;
  sourceId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface RawHistoryResponse {
  message: string;
  data: RawTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isCached: boolean;
}

// ─────────────────────────────────────────────────────────────
// Mapper
// ─────────────────────────────────────────────────────────────

function mapDashboard(raw: RawDashboardResponse): LoyaltyDashboard {
  const { account, streakCount, lastCheckInDate } = raw.data;

  const tier = ((TIER_VALUES as readonly string[]).includes(account.membershipTier)
    ? account.membershipTier
    : "BRONZE") as MembershipTier;

  const nextTier = getNextTier(tier);
  const currentTierSpending = account.totalSpending ?? 0;
  const nextTierSpendingRequired = nextTier ? (TIER_SPENDING_THRESHOLDS[nextTier] ?? 0) : 0;
  const nextTierProgressPercent = nextTier
    ? Math.min((currentTierSpending / Math.max(nextTierSpendingRequired, 1)) * 100, 100)
    : 100;

  return {
    points: account.currentPoints ?? 0,
    lifetimePoints: account.lifetimeEarned ?? 0,
    lifetimeRedeemed: account.lifetimeRedeemed ?? 0,
    expiredPoints: account.expiredPoints ?? 0,
    tier,
    nextTier,
    currentTierSpending,
    nextTierSpendingRequired,
    nextTierProgressPercent,
    checkInStreak: streakCount ?? 0,
    lastCheckInDate: lastCheckInDate ?? null,
    canCheckIn: !lastCheckInDate || !isToday(lastCheckInDate),
    referralCode: account.referralCode ?? "",
    referralLink: createReferralLink(account.referralCode),
    referralBenefits: "Invite friends and earn 50 points each!",
    recentTransactions: [],
  };
}

function isToday(dateStr: string): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    return dateStr.slice(0, 10) === today;
  } catch {
    return false;
  }
}

/**
 * Map raw backend transaction to frontend LoyaltyTransaction.
 * Backend sends: amount, reason, balanceAfter, sourceId
 * Frontend expects: points, description, balance, referenceId
 */
function mapTransaction(raw: RawTransaction): LoyaltyTransaction {
  return {
    id: raw.id,
    type: raw.type,
    points: raw.amount,
    description: raw.reason,
    balance: raw.balanceAfter,
    createdAt: raw.createdAt,
    status: "completed",
    referenceId: raw.sourceId ?? null,
  };
}

function createReferralLink(code: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/signup?ref=${encodeURIComponent(code)}`;
  }
  return `/signup?ref=${encodeURIComponent(code)}`;
}

/**
 * Map raw backend reward item to frontend RewardItem.
 * Backend sends: title, type, isActive, validityDays
 * Frontend expects: name, category, available, expiresInDays, description, imageUrl
 */
function mapRewardItem(raw: RawRewardItem): RewardItem {
  // Generate a human-readable description from title + type
  const typeLabel = raw.type
    ? raw.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Reward";
  const description = `Redeem your points for ${raw.title.toLowerCase()}. Enjoy this ${typeLabel.toLowerCase()} reward at Bite & Brew.`;

  return {
    id: raw.id,
    name: raw.title,
    description,
    pointsRequired: raw.pointsRequired,
    imageUrl: null, // Backend doesn't provide imageUrl in raw response
    category: raw.type,
    available: raw.isActive,
    expiresInDays: raw.validityDays ?? null,
  };
}

// ─────────────────────────────────────────────────────────────
// Exported API
// ─────────────────────────────────────────────────────────────

export const loyaltyApi = {
  /**
   * Get loyalty dashboard overview
   */
  async getDashboard(): Promise<LoyaltyDashboard> {
    try {
      const response = await axiosInstance.get<RawDashboardResponse>(
        ApiEndpoints.loyaltyDashboard
      );
      return mapDashboard(response.data);
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Get reward catalog
   */
  async getCatalog(
    page = 1,
    limit = 12
  ): Promise<RewardCatalogResponse> {
    try {
      const response = await axiosInstance.get<RawRewardCatalogResponse>(
        ApiEndpoints.loyaltyCatalog,
        { params: { page, limit } }
      );
      const rawItems = response.data.data ?? [];
      return {
        data: rawItems.map(mapRewardItem),
        pagination: {
          total: rawItems.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(rawItems.length / limit)),
        },
      };
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Get user's reward wallet
   */
  async getWallet(
    page = 1,
    limit = 12
  ): Promise<WalletResponse> {
    try {
      const response = await axiosInstance.get<WalletResponse>(
        ApiEndpoints.loyaltyWallet,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Redeem a reward
   */
  async redeemReward(rewardId: string): Promise<RedeemResponse> {
    try {
      const response = await axiosInstance.post<RedeemResponse>(
        ApiEndpoints.loyaltyRedeem,
        { rewardId }
      );
      return response.data;
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Daily check-in
   */
  async checkIn(): Promise<CheckInResponse> {
    try {
      const response = await axiosInstance.post<CheckInResponse>(
        ApiEndpoints.loyaltyCheckIn
      );
      return response.data;
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Claim referral code
   */
  async claimReferral(code: string): Promise<ReferralClaimResponse> {
    try {
      const response = await axiosInstance.post<ReferralClaimResponse>(
        ApiEndpoints.loyaltyReferral,
        { code }
      );
      return response.data;
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Get transaction history
   */
  async getHistory(
    params: LoyaltyHistoryParams = {}
  ): Promise<HistoryResponse> {
    try {
      const { page = 1, limit = 10, type } = params;
      const queryParams: Record<string, string | number | undefined> = {
        page,
        limit,
      };
      if (type) queryParams.type = type;

      const response = await axiosInstance.get<RawHistoryResponse>(
        ApiEndpoints.loyaltyHistory,
        { params: queryParams }
      );
      return {
        data: response.data.data.map(mapTransaction),
        pagination: response.data.pagination,
      };
    } catch (error) {
      throw new Error(parseError(error));
    }
  },
};


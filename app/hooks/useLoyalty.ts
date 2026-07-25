// ============================================================
// Bite & Brew — Loyalty React Query Hooks
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loyaltyApi } from "@/app/features/loyalty/api";
import toast from "react-hot-toast";
import type { LoyaltyHistoryParams } from "@/app/types/loyalty";

// ============================================================
// Query Keys
// ============================================================

export const loyaltyKeys = {
  all: ["loyalty"] as const,
  dashboard: () => [...loyaltyKeys.all, "dashboard"] as const,
  catalog: (page?: number) => [...loyaltyKeys.all, "catalog", page] as const,
  wallet: (page?: number) => [...loyaltyKeys.all, "wallet", page] as const,
  history: (params?: LoyaltyHistoryParams) =>
    [...loyaltyKeys.all, "history", params] as const,
};

// ============================================================
// Dashboard
// ============================================================

export function useLoyaltyDashboard() {
  return useQuery({
    queryKey: loyaltyKeys.dashboard(),
    queryFn: () => loyaltyApi.getDashboard(),
    staleTime: 30_000, // 30 seconds — points update frequently
    retry: 2,
  });
}

// ============================================================
// Reward Catalog
// ============================================================

export function useRewardCatalog(page = 1) {
  return useQuery({
    queryKey: loyaltyKeys.catalog(page),
    queryFn: () => loyaltyApi.getCatalog(page),
    staleTime: 60_000, // 1 minute — catalog doesn't change often
  });
}

// ============================================================
// Reward Wallet
// ============================================================

export function useRewardWallet(page = 1) {
  return useQuery({
    queryKey: loyaltyKeys.wallet(page),
    queryFn: () => loyaltyApi.getWallet(page),
    staleTime: 30_000,
  });
}

// ============================================================
// Redeem Reward
// ============================================================

export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: string) => loyaltyApi.redeemReward(rewardId),
    onSuccess: (data) => {
      toast.success(data.message || "Reward redeemed successfully!");
      // Refresh all loyalty data
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.wallet() });
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.history() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to redeem reward. Please try again.");
    },
  });
}

// ============================================================
// Check-In
// ============================================================

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => loyaltyApi.checkIn(),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          `Checked in! +${data.pointsEarned} points earned. 🔥 Streak: ${data.streak} days`
      );
      // Refresh dashboard and history
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: loyaltyKeys.history() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Check-in failed. Please try again.");
    },
  });
}

// ============================================================
// Transaction History
// ============================================================

export function useTransactionHistory(params?: LoyaltyHistoryParams) {
  return useQuery({
    queryKey: loyaltyKeys.history(params),
    queryFn: () => loyaltyApi.getHistory(params),
    staleTime: 30_000,
  });
}


// ============================================================
// Bite & Brew — Tier Progress Bar
// ============================================================

"use client";

import type { LoyaltyDashboard, MembershipTier } from "@/app/types/loyalty";

type TierProgressProps = {
  dashboard: LoyaltyDashboard;
};

const TIER_META: Record<MembershipTier, { label: string; color: string; icon: string }> = {
  BRONZE: { label: "Bronze", color: "bg-[#CD7F32]", icon: "🥉" },
  SILVER: { label: "Silver", color: "bg-[#C0C0C0]", icon: "🥈" },
  GOLD: { label: "Gold", color: "bg-[#DAA520]", icon: "🥇" },
  PLATINUM: { label: "Platinum", color: "bg-gradient-to-r from-[#E5E4E2] via-[#6B5B95] to-[#E5E4E2]", icon: "💎" },
};

/**
 * Safely resolve tier metadata with a fallback to BRONZE.
 * Prevents runtime crashes when the API returns an unexpected tier value.
 */
function getTierMeta(tier: string | null | undefined): { label: string; color: string; icon: string } {
  if (tier && tier in TIER_META) {
    return TIER_META[tier as MembershipTier];
  }
  return TIER_META.BRONZE;
}

export function TierProgress({ dashboard }: TierProgressProps) {
  const currentTier = getTierMeta(dashboard.tier);
  const nextTier = dashboard.nextTier ? getTierMeta(dashboard.nextTier) : null;

  const progressPercent = Math.min(dashboard.nextTierProgressPercent ?? 0, 100);
  const remaining = Math.max(0, (dashboard.nextTierSpendingRequired ?? 0) - (dashboard.currentTierSpending ?? 0));
  const isMaxTier = !dashboard.nextTier;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
      {/* Current Tier */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F3D33]/60">
            Current Tier
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{currentTier.icon}</span>
            <h3 className="text-2xl font-black text-[#0F3D33]">{currentTier.label}</h3>
          </div>
        </div>
        {nextTier && (
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F3D33]/40">
              Next Tier
            </span>
            <div className="flex items-center gap-1.5 mt-1 justify-end">
              <span className="text-lg">{nextTier.icon}</span>
              <span className="text-sm font-bold text-[#0F3D33]/60">{nextTier.label}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-[#F5F0E6] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isMaxTier ? "bg-gradient-to-r from-[#DAA520] to-[#6B5B95]" : currentTier.color
          }`}
          style={{ width: `${isMaxTier ? 100 : progressPercent}%` }}
        />
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      {/* Status Text */}
      {isMaxTier ? (
        <p className="text-sm font-semibold text-[#DAA520]">
          💎 You&apos;ve reached the highest tier! Enjoy all premium benefits.
        </p>
      ) : (
        <p className="text-sm text-[#0F3D33]/60">
          <span className="font-bold text-[#0F3D33]">{remaining.toLocaleString()}</span> spending needed for{" "}
          <span className="font-bold">{nextTier?.label}</span>
        </p>
      )}
    </div>
  );
}


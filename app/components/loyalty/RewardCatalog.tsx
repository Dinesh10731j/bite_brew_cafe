// ============================================================
// Bite & Brew — Reward Catalog / Marketplace
// ============================================================

"use client";

import { Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { useRewardCatalog, useRedeemReward } from "@/app/hooks/useLoyalty";
import { RewardCard } from "./RewardCard";
import { RewardCardSkeleton } from "./LoyaltySkeleton";
import { EmptyState } from "./EmptyState";
import { useState } from "react";

type RewardCatalogProps = {
  userPoints: number;
};

export function RewardCatalog({ userPoints }: RewardCatalogProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useRewardCatalog(page);
  const redeemMutation = useRedeemReward();

  const handleRedeem = (rewardId: string) => {
    redeemMutation.mutate(rewardId);
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">Reward Catalog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <RewardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">Reward Catalog</h2>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-red-600">
            Unable to load rewards. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const rewards = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  if (rewards.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">Reward Catalog</h2>
        <EmptyState
          icon={Gift}
          title="No rewards available"
          description="Check back soon for new rewards!"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-[#0F3D33]">Reward Catalog</h2>
        {totalPages > 1 && (
          <span className="text-xs text-[#0F3D33]/50 font-semibold">
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userPoints={userPoints}
            onRedeem={handleRedeem}
            isRedeeming={redeemMutation.isPending}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="w-9 h-9 flex items-center justify-center bg-[#0F3D33] text-white rounded-full disabled:opacity-30 hover:bg-[#1a5a46] transition-all duration-300 cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-[#0F3D33]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="w-9 h-9 flex items-center justify-center bg-[#0F3D33] text-white rounded-full disabled:opacity-30 hover:bg-[#1a5a46] transition-all duration-300 cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}


// ============================================================
// Bite & Brew — Reward Wallet (Redeemed Rewards)
// ============================================================

"use client";

import { Wallet, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRewardWallet } from "@/app/hooks/useLoyalty";
import { RewardCardSkeleton } from "./LoyaltySkeleton";
import { EmptyState } from "./EmptyState";
import { useState } from "react";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    bg: "bg-[#8EC894]/10",
    text: "text-[#4B9360]",
    dot: "bg-[#4B9360]",
  },
  used: {
    label: "Used",
    bg: "bg-[#C0C0C0]/10",
    text: "text-[#808080]",
    dot: "bg-[#808080]",
  },
  expired: {
    label: "Expired",
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-500",
  },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "No expiry";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function RewardWallet() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useRewardWallet(page);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">My Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <RewardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">My Rewards</h2>
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
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">My Rewards</h2>
        <EmptyState
          icon={Wallet}
          title="No redeemed rewards yet"
          description="Redeem a reward from the catalog to see it here."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-[#0F3D33]">My Rewards</h2>
        {totalPages > 1 && (
          <span className="text-xs text-[#0F3D33]/50 font-semibold">
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const statusStyle = STATUS_CONFIG[reward.status] ?? STATUS_CONFIG.available;
          return (
            <div
              key={reward.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-[#0F3D33] text-sm leading-tight">
                  {reward.rewardName}
                </h4>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {statusStyle.label}
                </span>
              </div>

              <p className="text-xs text-[#0F3D33]/60 mb-3 line-clamp-2">
                {reward.rewardDescription}
              </p>

              <div className="flex items-center justify-between text-xs text-[#0F3D33]/50">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>
                    {reward.status === "used"
                      ? `Used ${formatDate(reward.usedAt)}`
                      : `Expires ${formatDate(reward.expiresAt)}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {reward.status === "used" ? (
                    <CheckCircle size={12} className="text-[#808080]" />
                  ) : reward.status === "expired" ? (
                    <XCircle size={12} className="text-red-500" />
                  ) : (
                    <CheckCircle size={12} className="text-[#4B9360]" />
                  )}
                  <span>{reward.pointsUsed} pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
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


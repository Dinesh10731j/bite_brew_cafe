// ============================================================
// Bite & Brew — Transaction History Timeline
// ============================================================

"use client";

import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { useTransactionHistory } from "@/app/hooks/useLoyalty";
import { HistorySkeleton } from "./LoyaltySkeleton";
import { EmptyState } from "./EmptyState";
import { useState } from "react";
import type { TransactionType } from "@/app/types/loyalty";

const TYPE_CONFIG: Record<
  TransactionType,
  { icon: React.ReactNode; bg: string; text: string; label: string }
> = {
  EARNING: {
    icon: <TrendingUp size={18} />,
    bg: "bg-[#8EC894]/10",
    text: "text-[#4B9360]",
    label: "Earning",
  },
  REDEMPTION: {
    icon: <TrendingDown size={18} />,
    bg: "bg-red-50",
    text: "text-red-500",
    label: "Redemption",
  },
  ADJUSTMENT: {
    icon: <AlertCircle size={18} />,
    bg: "bg-blue-50",
    text: "text-blue-500",
    label: "Adjustment",
  },
  EXPIRATION: {
    icon: <Clock size={18} />,
    bg: "bg-gray-50",
    text: "text-gray-500",
    label: "Expiration",
  },
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function TransactionHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTransactionHistory({ page, limit: 10 });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">Transaction History</h2>
        <HistorySkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">Transaction History</h2>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-red-600">
            Unable to load transaction history.
          </p>
        </div>
      </div>
    );
  }

  const transactions = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  if (transactions.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-black text-[#0F3D33] mb-5">Transaction History</h2>
        <EmptyState
          icon={History}
          title="No transactions yet"
          description="Your activity will appear here as you earn and redeem points."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-[#0F3D33]">Transaction History</h2>
        {totalPages > 1 && (
          <span className="text-xs text-[#0F3D33]/50 font-semibold">
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {transactions.map((txn, idx) => {
          const typeStyle = TYPE_CONFIG[txn.type] ?? TYPE_CONFIG.EARNING;
          const isEarning = txn.type === "EARNING";

          return (
            <div
              key={txn.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-all duration-300"
            >
              {/* Type Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeStyle.bg} ${typeStyle.text}`}
              >
                {typeStyle.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0F3D33] truncate">
                  {txn.description}
                </p>
                <p className="text-xs text-[#0F3D33]/50 mt-0.5">
                  {formatDate(txn.createdAt)}
                </p>
              </div>

              {/* Points */}
              <div className="text-right shrink-0">
                <span
                  className={`text-base font-black ${
                    isEarning ? "text-[#4B9360]" : "text-red-500"
                  }`}
                >
                  {isEarning ? "+" : "-"}
                  {(txn.points ?? 0).toLocaleString()}
                </span>
                <p className="text-[10px] text-[#0F3D33]/40 font-semibold">
                  Balance: {(txn.balance ?? 0).toLocaleString()}
                </p>
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


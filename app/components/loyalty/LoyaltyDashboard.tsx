// ============================================================
// Bite & Brew — Loyalty Dashboard (Orchestrator)
// ============================================================

"use client";

import {
  Award,
  TrendingUp,
  Gift,
  Wallet,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useLoyaltyDashboard } from "@/app/hooks/useLoyalty";
import { PointsCard } from "./PointsCard";
import { TierProgress } from "./TierProgress";
import { CheckInCard } from "./CheckInCard";
import { ReferralCard } from "./ReferralCard";
import { RewardCatalog } from "./RewardCatalog";
import { RewardWallet } from "./RewardWallet";
import { TransactionHistory } from "./TransactionHistory";
import { DashboardSkeleton } from "./LoyaltySkeleton";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: string;
};

function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D33]/50">
          {label}
        </span>
      </div>
      <p className="text-2xl font-black text-[#0F3D33]">{value}</p>
      {subtext && (
        <p className="text-xs text-[#0F3D33]/50 mt-0.5">{subtext}</p>
      )}
    </div>
  );
}

export function LoyaltyDashboard() {
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useLoyaltyDashboard();

  // --- Loading State ---
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // --- Error State ---
  if (isError || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-[#0F3D33] mb-2">
          Unable to load loyalty data
        </h3>
        <p className="text-sm text-[#0F3D33]/60 text-center max-w-md mb-6">
          {error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-6 py-3 bg-[#0F3D33] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#1a5a46] transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const formatPoints = (points: number | null | undefined): string =>
    points == null ? '0'
    : points >= 1000
      ? `${(points / 1000).toFixed(1)}k`
      : points.toLocaleString();

  return (
    <div className="space-y-8">
      {/* Top Row: Points + Check-in + Referral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Points Overview + Tier Progress */}
        <div className="lg:col-span-2 space-y-6">
          <PointsCard dashboard={dashboard} />

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Lifetime Earned"
              value={`${formatPoints(dashboard.lifetimePoints)} pts`}
              color="bg-[#8EC894]/10 text-[#4B9360]"
            />
            <StatCard
              icon={<Gift size={16} />}
              label="Lifetime Redeemed"
              value={`${formatPoints(dashboard.lifetimeRedeemed)} pts`}
              color="bg-[#DAA520]/10 text-[#DAA520]"
            />
            <StatCard
              icon={<Wallet size={16} />}
              label="Current Balance"
              value={`${formatPoints(dashboard.points)} pts`}
              color="bg-[#0F3D33]/10 text-[#0F3D33]"
            />
            <StatCard
              icon={<Clock size={16} />}
              label="Expired Points"
              value={`${formatPoints(dashboard.expiredPoints)} pts`}
              subtext={dashboard.expiredPoints > 0 ? "Points expired" : "No expired points"}
              color="bg-red-50 text-red-500"
            />
          </div>

          <TierProgress dashboard={dashboard} />
        </div>

        {/* Right: Check-in + Referral */}
        <div className="space-y-6">
          <CheckInCard
            streak={dashboard.checkInStreak}
            lastCheckInDate={dashboard.lastCheckInDate}
            canCheckIn={dashboard.canCheckIn}
          />
          <ReferralCard
            referralCode={dashboard.referralCode}
            referralLink={dashboard.referralLink}
            referralBenefits={dashboard.referralBenefits}
          />
        </div>
      </div>

      {/* Bottom Row: Catalog + Wallet + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RewardCatalog userPoints={dashboard.points} />
        <div className="space-y-8">
          <RewardWallet />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}


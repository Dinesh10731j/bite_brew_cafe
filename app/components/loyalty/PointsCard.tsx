// ============================================================
// Bite & Brew — Points Overview Card
// ============================================================

"use client";

import { Sparkles } from "lucide-react";
import type { LoyaltyDashboard } from "@/app/types/loyalty";

type PointsCardProps = {
  dashboard: LoyaltyDashboard;
};

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  BRONZE: {
    bg: "bg-[#CD7F32]/10",
    text: "text-[#CD7F32]",
    border: "border-[#CD7F32]/20",
    glow: "shadow-[#CD7F32]/20",
  },
  SILVER: {
    bg: "bg-[#C0C0C0]/10",
    text: "text-[#808080]",
    border: "border-[#C0C0C0]/20",
    glow: "shadow-[#C0C0C0]/20",
  },
  GOLD: {
    bg: "bg-[#DAA520]/10",
    text: "text-[#DAA520]",
    border: "border-[#DAA520]/20",
    glow: "shadow-[#DAA520]/20",
  },
  PLATINUM: {
    bg: "bg-[#E5E4E2]/20",
    text: "text-[#6B5B95]",
    border: "border-[#E5E4E2]/30",
    glow: "shadow-[#6B5B95]/20",
  },
};

export function PointsCard({ dashboard }: PointsCardProps) {
  const tierStyle = TIER_COLORS[dashboard.tier] ?? TIER_COLORS.BRONZE;

  const formatPoints = (points: number | null | undefined): string => {
    if (points == null) return '0';
    return points >= 1000 ? `${(points / 1000).toFixed(1)}k` : points.toLocaleString();
  };

  return (
    <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-black/5 overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#0F3D33]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#DAA520]/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#DAA520]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F3D33]/60">
              Your Points
            </span>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tierStyle.bg} ${tierStyle.text} border ${tierStyle.border}`}
          >
            {dashboard.tier}
          </span>
        </div>

        <div className="mb-2">
          <span className="text-5xl md:text-6xl font-black tracking-tight text-[#0F3D33]">
            {formatPoints(dashboard.points)}
          </span>
          <span className="text-lg font-bold text-[#0F3D33]/50 ml-1">pts</span>
        </div>

        <p className="text-sm text-[#0F3D33]/60">
          {dashboard.points === 1 ? "1 point" : `${formatPoints(dashboard.points)} points`} available
        </p>
      </div>
    </div>
  );
}


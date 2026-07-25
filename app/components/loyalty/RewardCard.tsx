// ============================================================
// Bite & Brew — Reward Card (Catalog Item)
// ============================================================

"use client";

import { Gift, Loader2, Coffee, Star } from "lucide-react";
import type { RewardItem } from "@/app/types/loyalty";

type RewardCardProps = {
  reward: RewardItem;
  userPoints: number;
  onRedeem: (rewardId: string) => void;
  isRedeeming?: boolean;
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  coffee: <Coffee size={24} />,
  food: <Star size={24} />,
  default: <Gift size={24} />,
};

export function RewardCard({ reward, userPoints, onRedeem, isRedeeming }: RewardCardProps) {
  const canAfford = userPoints >= reward.pointsRequired;
  const isDisabled = !canAfford || !reward.available || isRedeeming;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-lg hover:border-[#0F3D33]/10 transition-all duration-500">
      {/* Image / Icon Area */}
      <div className="aspect-[4/3] bg-gradient-to-br from-[#F5F0E6] to-[#ede8e3] flex items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F3D33]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#DAA520]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {reward.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="text-[#0F3D33]/20 group-hover:scale-110 transition-transform duration-500">
            {CATEGORY_ICONS[reward.category?.toLowerCase()] ?? CATEGORY_ICONS.default}
          </div>
        )}

        {/* Points Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-xs font-black text-[#0F3D33]">
            {(reward.pointsRequired ?? 0).toLocaleString()} pts
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-black text-[#0F3D33] text-base mb-1">{reward.name}</h4>
        <p className="text-xs text-[#0F3D33]/60 leading-relaxed mb-4 line-clamp-2">
          {reward.description}
        </p>

        {/* Redeem Button */}
        <button
          onClick={() => onRedeem(reward.id)}
          disabled={isDisabled}
          className={`
            w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider
            transition-all duration-300 flex items-center justify-center gap-2
            ${
              isRedeeming
                ? "bg-[#F5F0E6] text-[#0F3D33]/40 cursor-not-allowed"
                : canAfford && reward.available
                  ? "bg-[#0F3D33] text-white hover:bg-[#1a5a46] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  : "bg-[#F5F0E6] text-[#0F3D33]/30 cursor-not-allowed"
            }
          `}
          aria-label={
            isRedeeming
              ? "Redeeming..."
              : !canAfford
                ? `Need ${((reward.pointsRequired ?? 0) - userPoints).toLocaleString()} more points`
                : `Redeem ${reward.name} for ${reward.pointsRequired} points`
          }
        >
          {isRedeeming ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Gift size={14} />
          )}
          {isRedeeming ? "Redeeming..." : "Redeem"}
        </button>

        {!canAfford && !reward.available && (
          <p className="text-[10px] text-red-500/70 font-semibold text-center mt-1">
            Currently unavailable
          </p>
        )}
      </div>
    </div>
  );
}


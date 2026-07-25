// ============================================================
// Bite & Brew — Daily Check-In Card
// ============================================================

"use client";

import { useState } from "react";
import { Flame, CalendarCheck, Loader2, Coffee } from "lucide-react";
import { useCheckIn } from "@/app/hooks/useLoyalty";

type CheckInCardProps = {
  streak: number;
  lastCheckInDate: string | null;
  canCheckIn: boolean;
};

export function CheckInCard({ streak, lastCheckInDate, canCheckIn }: CheckInCardProps) {
  const checkInMutation = useCheckIn();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckIn = async () => {
    if (!canCheckIn || checkInMutation.isPending) return;
    setIsAnimating(true);
    try {
      await checkInMutation.mutateAsync();
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never checked in";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getButtonState = () => {
    if (checkInMutation.isPending) return { label: "Checking in...", disabled: true, icon: Loader2 };
    if (!canCheckIn) return { label: "Already Checked In", disabled: true, icon: CalendarCheck };
    return { label: "Check In Today", disabled: false, icon: Coffee };
  };

  const buttonState = getButtonState();

  return (
    <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-black/5 overflow-hidden">
      {/* Fire animation background */}
      {isAnimating && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#DAA520]/10 to-transparent animate-pulse" />
      )}

      <div className="relative z-10">
        {/* Streak Display */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            streak > 0 ? "bg-[#DAA520]/10" : "bg-[#F5F0E6]"
          }`}>
            <Flame
              size={28}
              className={`transition-all duration-500 ${
                streak > 0 ? "text-[#DAA520]" : "text-[#0F3D33]/30"
              } ${streak > 3 ? "animate-bounce" : ""}`}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#0F3D33]">{streak}</span>
              <span className="text-sm font-bold text-[#0F3D33]/60">day streak</span>
            </div>
            <p className="text-xs text-[#0F3D33]/50 mt-0.5">
              {streak === 0
                ? "Start your streak today!"
                : `Last check-in: ${formatDate(lastCheckInDate)}`}
            </p>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          disabled={buttonState.disabled}
          className={`
            w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider
            transition-all duration-300 flex items-center justify-center gap-2
            ${
              buttonState.disabled
                ? "bg-[#F5F0E6] text-[#0F3D33]/40 cursor-not-allowed"
                : "bg-[#0F3D33] text-white hover:bg-[#1a5a46] hover:shadow-lg active:scale-[0.98] cursor-pointer"
            }
          `}
          aria-label={buttonState.label}
        >
          {checkInMutation.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <buttonState.icon size={18} />
          )}
          {buttonState.label}
        </button>

        {checkInMutation.isSuccess && isAnimating && (
          <p className="text-center text-xs font-semibold text-[#8EC894] mt-3 animate-pulse">
            +{checkInMutation.data?.pointsEarned} points earned!
          </p>
        )}
      </div>
    </div>
  );
}


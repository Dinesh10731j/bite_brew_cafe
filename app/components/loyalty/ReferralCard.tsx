// ============================================================
// Bite & Brew — Referral Card
// ============================================================

"use client";

import { useState } from "react";
import { Copy, Share2, Gift, Check } from "lucide-react";
import toast from "react-hot-toast";

type ReferralCardProps = {
  referralCode: string;
  referralLink: string;
  referralBenefits: string;
};

export function ReferralCard({ referralCode, referralLink, referralBenefits }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink || referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      try {
        const textarea = document.createElement("textarea");
        textarea.value = referralCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        toast.success("Referral code copied!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy. Please select and copy manually.");
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bite & Brew Rewards",
          text: `Join Bite & Brew and use my referral code ${referralCode} to earn bonus points!`,
          url: referralLink || window.location.origin,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback — copy link
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Gift size={18} className="text-[#DAA520]" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#0F3D33]/60">
          Refer a Friend
        </span>
      </div>

      {/* Benefits */}
      <p className="text-sm text-[#0F3D33]/70 mb-4">
        {referralBenefits || "Invite friends and earn 50 points each!"}
      </p>

      {/* Referral Code Display */}
      <div className="bg-[#F5F0E6] rounded-2xl px-5 py-4 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0F3D33]/40 block mb-1">
          Your Code
        </span>
        <span className="text-2xl font-black tracking-wider text-[#0F3D33] select-all">
          {referralCode}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className={`
            flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider
            transition-all duration-300 flex items-center justify-center gap-2
            ${
              copied
                ? "bg-[#8EC894] text-white"
                : "bg-[#0F3D33] text-white hover:bg-[#1a5a46] active:scale-[0.98] cursor-pointer"
            }
          `}
          aria-label={copied ? "Copied" : "Copy referral code"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy Code"}
        </button>
        <button
          onClick={handleShare}
          className="px-5 py-3.5 rounded-2xl bg-[#F5F0E6] text-[#0F3D33] font-black text-xs uppercase tracking-wider hover:bg-[#ede8e3] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          aria-label="Share referral code"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}


// ============================================================
// Bite & Brew — Loyalty Empty State
// ============================================================

import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F0E6] flex items-center justify-center mb-5">
        <Icon size={32} className="text-[#0F3D33]/40" />
      </div>
      <h3 className="text-lg font-bold text-[#0F3D33] mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-[#0F3D33]/60 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-6 py-3 bg-[#0F3D33] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#1a5a46] transition-all duration-300 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}


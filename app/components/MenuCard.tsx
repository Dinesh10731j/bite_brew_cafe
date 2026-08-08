import { useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { useMouseTilt } from "./useMouseTilt";
import Image from "next/image";
import type { MenuItem } from "@/app/features/menu/api";

export const MenuItemCard = ({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: cardRef });

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col h-full rounded-[2.5rem] bg-black border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden will-change-transform"
    >
      {/* IMAGE */}
      <div className="relative w-full h-56 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-semibold">
            NO IMAGE
          </div>
        )}

        {/* 🔥 OVERLAY (same vibe as gallery) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2920]/80 via-[#0a2920]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* PRICE */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-black/10 transition-all duration-300 group-hover:scale-105">
          <p className="text-[12px] font-bold text-[#0a2920]">
            NPR {Number(item.price).toFixed(0)}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-5 relative">
        {/* CATEGORY */}
        <span className="text-[10px] font-black tracking-[0.15em] text-[#207659] uppercase mb-1 transition-all duration-300 group-hover:translate-y-[-2px]">
          {item.category?.name || "General"}
        </span>

        {/* TITLE */}
        <h3 className="text-xl font-black text-white leading-tight mb-1 italic transition-all duration-300 group-hover:translate-y-[-2px]">
          {item.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-white line-clamp-2 mb-4 flex-1 transition-all duration-300 group-hover:text-black/80">
          {item.description}
        </p>

        {/* BUTTON */}
        <button
          onClick={() => onAdd(item)}
          className="relative w-full rounded-xl bg-[#0a2920] py-3 text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 active:scale-[0.96]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingBag size={16} />
            Add to Order
          </span>

          <div className="absolute inset-0 bg-[#207659] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

  
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute inset-0 rounded-[2.5rem] border border-[#207659]/40 shadow-[0_0_40px_rgba(32,118,89,0.25)]" />
      </div>
    </div>
  );
};
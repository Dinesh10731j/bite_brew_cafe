"use client";

import { useState } from "react";
import { Sparkles, Loader2, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/app/store/hooks";
import { aiRecommend, captureRecommendationEvent } from "@/app/features/recommendation/api";
import type { DishRecommendation } from "@/app/types/recommendation";

export const AiRecommendation = ({
  onAdd,
}: {
  onAdd: (item: DishRecommendation) => void;
}) => {
  const [craving, setCraving] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<DishRecommendation[]>([]);
  const [matchScore, setMatchScore] = useState<Record<string, number>>({});

  const user = useAppSelector((state) => state.auth.user);

  const handleRecommend = async () => {
    const trimmed = craving.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Please describe what you're craving (at least 2 characters).");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await aiRecommend(trimmed, { topN: 4 });
      setRecommendations(result.recommendations ?? []);
      const scores: Record<string, number> = {};
      (result.recommendations ?? []).forEach((r) => {
        scores[String(r.id)] = r.match_score ?? 0;
      });
      setMatchScore(scores);

      // Fire a "click" event for the recommendation query (optional personalization)
      if (user?.id) {
        captureRecommendationEvent(user.id, {
          menu_item_id: "ai-search",
          event_type: "click",
          metadata: { source_page: "menu", craving: trimmed },
        }).catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a2920] text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} />
            AI Powered
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a2920] uppercase tracking-tighter leading-none">
            Craving Based
            <span className="text-[#207659] italic block">Recommendations</span>
          </h2>
            <p className="text-black/50 font-medium mt-3 max-w-md">
              Tell us what you&apos;re in the mood for and our AI will find the perfect dish.
            </p>
        </div>
      </div>

      {/* Input */}
      <div className="relative max-w-2xl mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a2920]/40" size={18} />
            <input
              type="text"
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
              placeholder="e.g. I want spicy and cheesy momo for lunch"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-black/5 text-[#0a2920] placeholder:text-[#0a2920]/40 focus:ring-2 ring-[#207659]/20 transition-all outline-none font-medium"
            />
          </div>
          <button
            onClick={handleRecommend}
            disabled={isLoading}
            className="px-8 py-4 bg-[#0a2920] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#207659] transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isLoading ? "Thinking..." : "Recommend"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm font-semibold mt-3">{error}</p>
        )}
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-black uppercase tracking-tighter text-[#0a2920]">
              Top Picks for You
            </h3>
            <div className="h-px flex-1 bg-[#207659]/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div
                key={String(item.id)}
                className="group relative flex flex-col h-full rounded-[2rem] bg-black text-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative w-full h-44 overflow-hidden">
                  {(item.image || item.image_url) ? (
                    <Image
                      src={item.image || item.image_url || ""}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-semibold">
                      NO IMAGE
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2920]/80 via-[#0a2920]/20 to-transparent" />

                  {/* Match score badge */}
                  {matchScore[String(item.id)] !== undefined && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black text-[#0a2920]">
                      {Math.round((matchScore[String(item.id)] ?? 0) * 100)}% match
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-[#0a2920]">
                    NPR {Number(item.price).toFixed(0)}
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <span className="text-[9px] font-black tracking-[0.15em] text-[#8EC894] uppercase mb-1">
                    {typeof item.category === "string" ? item.category : item.category?.name || "General"}
                  </span>
                  <h4 className="text-lg font-black leading-tight mb-1 italic">{item.name}</h4>
                  <p className="text-xs text-white/70 line-clamp-2 mb-4 flex-1">{item.description}</p>
<button
                    onClick={() => {
                      captureRecommendationEvent(user?.id ?? "guest", {
                        menu_item_id: item.id,
                        event_type: "add_to_cart",
                      }).catch(() => {});
                      onAdd(item);
                    }}
                    className="relative w-full rounded-xl bg-[#0a2920] py-2.5 text-xs font-bold text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 active:scale-[0.96] hover:bg-[#207659]"
                  >
                    <ShoppingBag size={14} />
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

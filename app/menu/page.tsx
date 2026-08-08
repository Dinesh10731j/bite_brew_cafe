"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, Filter, ShoppingBag } from "lucide-react";
import { gsap } from "../lib/gsap"; 
import { fetchMenus, type MenuItem } from "@/app/features/menu/api";
import { useAppDispatch } from "@/app/store/hooks";
import { addItem } from "@/app/store/slices/cartSlice";
import { CreativeHero } from "../sections/Hero";



import { MenuItemCard } from "../components/MenuCard";
import { AiRecommendation } from "../components/AiRecommendation";

export default function MenuPage() {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["menus", page, search, selectedCategoryId, availableOnly],
    queryFn: () =>
      fetchMenus({
        page,
        limit: 12,
        search: search.trim() || undefined,
        categoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId,
        available: availableOnly ? true : undefined,
      }),
  });

  // --- DYNAMIC CATEGORY EXTRACTION START ---
  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, string>();
    // Look through current items and extract unique category pairs
(data?.data ?? []).forEach((item: MenuItem) => {
      if (item.category?.id && item.category?.name) {
        categoryMap.set(item.category.id, item.category.name);
      }
    });
    
    return [
      { id: "all", name: "All Categories" }, 
      ...Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }))
    ];
  }, [data]);
  // --- DYNAMIC CATEGORY EXTRACTION END ---

  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".menu-char-interactive");
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const distance = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
          if (distance < 150) {
            gsap.to(char, { x: (e.clientX - (rect.left + rect.width / 2)) * 0.4, y: (e.clientY - (rect.top + rect.height / 2)) * 0.4, scale: 1.3, duration: 0.4 });
          } else {
            gsap.to(char, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
          }
        });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const interactiveTitle = (
    <span className="flex flex-nowrap whitespace-nowrap">
      {"MENU".split("").map((char, i) => (
        <span key={i} className="menu-char-interactive inline-block will-change-transform">{char}</span>
      ))}
    </span>
  );

  const handleAddToCart = (item: { id: string | number; name: string; price: number | string; image?: string | null }) => {
    dispatch(addItem({ menuItemId: String(item.id), quantity: 1, name: item.name, price: Number(item.price), image: item.image ?? null }));
  };

  return (
    <main className="bg-[#F5F0E6] min-h-screen" ref={containerRef}>
<CreativeHero
        tagline="Freshly Brewed"
        title={interactiveTitle}
        description="From single-origin pours to artisanal snacks, explore our daily offerings."
        ctas={[{ href: "#items", text: "Explore Menu" }]}
      />

      <AiRecommendation onAdd={handleAddToCart} />

      <section id="items" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a2920]/40" size={18} />
            <input
              type="text"
              placeholder="What are you craving?"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-black/5 text-[#0a2920] placeholder:text-[#0a2920]/40 focus:ring-2 ring-[#207659]/20 transition-all outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-4 rounded-2xl border border-black/5 flex-1 md:flex-none">
              <Filter size={16} className="text-[#207659]" />
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setPage(1); // Reset to page 1 on category change
                }}
                className="bg-transparent outline-none font-bold text-sm uppercase tracking-tighter cursor-pointer pr-4"
              >
                {/* Dynamically Rendering Categories here */}
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-black/5 cursor-pointer hover:bg-black/5 transition-colors">
              <input 
                type="checkbox" 
                checked={availableOnly}
                onChange={(e) => {
                  setAvailableOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 accent-[#207659]" 
              />
              <span className="text-xs font-black uppercase tracking-widest">In Stock</span>
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-black/5 rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
{data?.data?.map((item: MenuItem) => (
                <MenuItemCard key={item.id} item={item} onAdd={handleAddToCart} />
              ))}
            </div>

            {data?.data?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-black/40 font-bold italic uppercase">No items found.</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 mt-16">
              {/* Previous Icon Button */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-10 h-10 flex items-center justify-center bg-[#0a2920] text-white rounded-full disabled:opacity-30 hover:bg-[#207659] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Current Page Number */}
              <span className="w-10 h-10 flex items-center justify-center bg-[#0a2920] text-white rounded-full text-sm font-black shadow-lg">
                {page}
              </span>

              {/* Next Icon Button */}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (data?.pagination?.totalPages || 1)}
                className="w-10 h-10 flex items-center justify-center bg-[#0a2920] text-white rounded-full disabled:opacity-30 hover:bg-[#207659] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </section>

     
    </main>
  );
}
'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { fallbackGalleryData } from "../types/gallery";
import type { GalleryImage, GalleryCategory } from "../types/gallery";
import { fetchGalleryImages } from "../features/gallery/api";
import { CreativeHero } from "../sections/Hero";
import { useMouseTilt } from "../components/useMouseTilt";
import { Sparkles, Camera, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import CTA from '../sections/CTA';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES: { label: string; value: GalleryCategory | null }[] = [
  { label: "All", value: null },
  { label: "Food", value: "FOOD" },
  { label: "Interior", value: "INTERIOR" },
  { label: "Events", value: "EVENTS" },
];

const GalleryItem = ({ image, idx }: { image: GalleryImage; idx: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: itemRef });

  return (
    <div 
      ref={itemRef}
      className="gallery-item break-inside-avoid group relative rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 will-change-transform cursor-pointer mb-6"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {image.src ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={idx < 6}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0a2920]/5">
            <Camera size={48} className="text-black/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2920]/90 via-[#0a2920]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
          {image.featured && (
            <span className="absolute top-4 right-4 bg-[#8EC894] text-black text-[8px] font-black tracking-[0.15em] uppercase px-3 py-1 rounded-full">
              Featured
            </span>
          )}
          <span className="text-[10px] font-black tracking-[0.2em] text-[#8EC894] uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {image.category}
          </span>
          <h4 className="text-white font-black tracking-tighter text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 italic">
            {image.alt}
          </h4>
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
              {image.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GallerySkeleton = () => (
  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="break-inside-avoid rounded-[2.5rem] overflow-hidden bg-white/60 animate-pulse mb-6"
        style={{ aspectRatio: i % 2 === 0 ? '3/4' : '1/1' }}
      />
    ))}
  </div>
);

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [featured, setFeatured] = useState<boolean | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGalleryImages({
        page,
        limit: 12,
        category: category ?? undefined,
        featured,
      });
      setImages(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (err) {
      console.error("Failed to fetch gallery images:", err);
      setError("Could not load gallery from server. Showing fallback images.");
      // Fallback: use static data with local filtering
      let filtered = fallbackGalleryData;
      if (category) {
        filtered = filtered.filter((img) => img.category === category);
      }
      if (featured !== undefined) {
        filtered = filtered.filter((img) => img.featured === featured);
      }
      setImages(filtered);
      setTotalPages(1);
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [page, category, featured]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (newCategory: GalleryCategory | null) => {
    setCategory(newCategory);
    setPage(1);
  };

  const toggleFeatured = () => {
    setFeatured((prev) => (prev === undefined ? true : prev === true ? false : undefined));
    setPage(1);
  };

  const interactiveTitle = (
    <span className="flex flex-nowrap justify-start whitespace-nowrap">
      {"GALLERY".split("").map((char, i) => (
        <span 
          key={i} 
          className="gallery-char-interactive inline-block will-change-transform"
        >
          {char}
        </span>
      ))}
    </span>
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".gallery-char-interactive");
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          const distX = e.clientX - charX;
          const distY = e.clientY - charY;
          const distance = Math.hypot(distX, distY);

          if (distance < 150) {
            gsap.to(char, {
              x: distX * 0.4,
              y: distY * 0.4,
              scale: 1.4,
              rotate: distX * 0.1,
              duration: 0.4,
            });
          } else {
            gsap.to(char, {
              x: 0, y: 0, scale: 1, rotate: 0,
              duration: 0.6, ease: "elastic.out(1, 0.3)"
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#F5F0E6] min-h-screen overflow-x-hidden" ref={containerRef}>
      <CreativeHero
        tagline="Visual Journal"
        title={interactiveTitle as any}
        description="A curated collection of captured moments, from the first pour to the late night grinds."
        ctas={[{ href: '#pins', text: 'View Pins' }]}
      />

      <section id="pins" className="py-12 px-6 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12 pb-8 border-b border-black/5">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                  category === cat.value
                    ? "bg-[#0a2920] text-white"
                    : "bg-white text-black/60 hover:bg-black/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured Toggle */}
          <button
            onClick={toggleFeatured}
            className={`ml-auto px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
              featured !== undefined
                ? "bg-[#8EC894] text-black"
                : "bg-white text-black/60 hover:bg-black/5"
            }`}
          >
            <Sparkles size={14} />
            {featured === undefined ? "All" : featured ? "Featured" : "Non-Featured"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 px-6 py-4 mb-8 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <GallerySkeleton />
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-black/40">
            <Camera size={64} className="mb-6 opacity-30" />
            <p className="text-lg font-black uppercase tracking-wider">No images found</p>
            <p className="text-sm mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {images.map((image, idx) => (
                <GalleryItem key={image.id} image={image} idx={idx} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-full text-sm font-black uppercase tracking-wider disabled:opacity-30 hover:bg-black/5 transition-all duration-300"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full text-xs font-black transition-all duration-300 ${
                        p === page
                          ? "bg-[#0a2920] text-white"
                          : "bg-white text-black/40 hover:bg-black/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-full text-sm font-black uppercase tracking-wider disabled:opacity-30 hover:bg-black/5 transition-all duration-300"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Total count */}
            <p className="text-center text-black/30 text-xs font-medium mt-6">
              Showing {images.length} of {total} images
            </p>
          </>
        )}
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto bg-black rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#207659] opacity-20 blur-[120px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#8EC894] text-black rounded-full font-black text-xs uppercase mb-6">
                <Camera size={14} fill="currentColor" /> Community Spotlight
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase mb-8 italic">
                SHARE YOUR <br/><span className="text-[#8EC894]">STORY.</span>
              </h2>
              <button className="px-8 py-4 bg-white text-black font-black uppercase rounded-xl hover:bg-[#8EC894] transition-all duration-300">
                Submit Photo
              </button>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-[#8EC894]/20">
                <Sparkles size={120} className="animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <CTA 
        title="Experience the Vibe"
        subtitle="The gallery is better in person with a fresh cup in hand."
        primaryCTA={{ href: '/visit', text: 'Visit the Roastery' }}
        secondaryCTA={{ href: '/menu', text: 'View Menu' }}
      />
    </main>
  );
}


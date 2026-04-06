'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { initialGalleryData } from "../types/gallery";
import { CreativeHero } from "../sections/Hero";
import { useMouseTilt } from "../components/useMouseTilt";
import { Sparkles, Camera, Coffee, Zap } from "lucide-react";
import CTA from '../sections/CTA';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const GalleryItem = ({ image, idx }: { image: any, idx: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: itemRef });

  return (
    <div 
      ref={itemRef}
      className="gallery-item break-inside-avoid group relative rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 will-change-transform cursor-pointer mb-6"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: image.aspectRatio || '3/4' }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={idx < 6}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2920]/90 via-[#0a2920]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#8EC894] uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {image.category}
            </span>
            <h4 className="text-white font-black tracking-tighter text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 italic">
                {image.alt}
            </h4>
        </div>
      </div>
    </div>
  );
};

export default function GalleryPage() {
  const [images] = useState(initialGalleryData);
  const containerRef = useRef<HTMLDivElement>(null);

  // FIX: Added whitespace-nowrap and removed flex-wrap to keep it on one line
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
              // Color: "#207659" REMOVED to prevent color change on hover
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

      <section id="pins" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {images.map((image, idx) => (
            <GalleryItem key={image.id} image={image} idx={idx} />
          ))}
        </div>
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
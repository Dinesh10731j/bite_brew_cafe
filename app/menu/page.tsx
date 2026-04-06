'use client';

import { CreativeHero } from '../sections/Hero';
import CTA from '../sections/CTA';
import { sampleMenuSections, type MenuSection, type MenuItem } from '../types/menu';
import { gsap } from '../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Coffee, Utensils, Zap, Beer, Sparkles } from 'lucide-react';
import { useMouseTilt } from '../components/useMouseTilt';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MenuCard = ({ item }: { item: MenuItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: cardRef });

  return (
    <div ref={cardRef} className="menu-item group/card perspective-1000">
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_rgba(32,118,89,0.15)] transition-shadow duration-500 will-change-transform">
        <div className="absolute top-6 right-6 z-10">
          <span className="text-xl font-black text-[#207659] bg-[#8EC894]/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-[#207659]/10">
            {item.price}
          </span>
        </div>

        <div className="w-full h-44 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-3xl flex items-center justify-center mb-8 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="text-6xl text-[#207659]/20 group-hover/card:scale-125 transition-transform duration-700 ease-out">
            {item.category === 'coffee' || item.category === 'tea' ? <Coffee size={64} /> : <Utensils size={64} />}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-2xl font-black text-[#1a5a46] tracking-tight group-hover/card:text-[#207659]">
            {item.name}
          </h4>
          <p className="text-[#6B4423]/70 leading-relaxed font-medium text-sm line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#D2B48C]/20">
            {item.allergens?.map((allergen) => (
              <span key={allergen} className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded-lg tracking-tighter">
                {allergen}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'drinks' | 'food' | 'other'>('all');

  const filteredMenu = useMemo(() => {
    const allItems = sampleMenuSections.flatMap(s => s.items);
    if (activeTab === 'all') return allItems;
    
    return allItems.filter(item => {
      if (activeTab === 'drinks') return item.category === 'coffee' || item.category === 'tea';
      if (activeTab === 'food') return item.category === 'food' || item.category === 'pastries';
      return false; 
    });
  }, [activeTab]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal items on tab change
      gsap.fromTo(".menu-item", 
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: "power3.out" }
      );

      // 2. MOUSE EVENT LOGIC
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".menu-char-interactive");
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          
          const distX = e.clientX - charX;
          const distY = e.clientY - charY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 150) {
            gsap.to(char, {
              x: distX * 0.4,
              y: distY * 0.4,
              scale: 1.4,
              rotate: distX * 0.1,
              duration: 0.4,
              ease: "power2.out"
            });
          } else {
            gsap.to(char, {
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.3)"
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  const tabs = [
    { id: 'all', label: 'All Brews', icon: <Sparkles size={18}/> },
    { id: 'drinks', label: 'Drinks', icon: <Coffee size={18}/> },
    { id: 'food', label: 'Bites', icon: <Utensils size={18}/> },
    { id: 'other', label: 'Other', icon: <Zap size={18}/> }
  ] as const;

  // This creates the individual span elements that the GSAP listener targets
  const interactiveTitle = (
    <span className="flex flex-wrap justify-start">
      {"MENU".split("").map((char, i) => (
        <span 
          key={i} 
          className={`menu-char-interactive inline-block will-change-transform ${char === " " ? "w-4" : ""}`}
        >
          {char}
        </span>
      ))}
    </span>
  );

  return (
    <div className="bg-[#F5F0E6] min-h-screen" ref={containerRef}>
      <CreativeHero
        tagline="Savor the Revolution"
        // CRITICAL: Pass the JSX variable, not a string
        title={interactiveTitle as unknown as string} 
        description="A curated collection of bold roasts and artisan bites, designed to wake your senses." 
        ctas={[{ href: '#explore', text: 'Start Exploring' }]}
      />

      <section id="explore" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-black text-[#8EC894] shadow-[0_20px_40px_rgba(0,0,0,0.2)] -translate-y-1' 
                  : 'bg-white text-black/40 hover:text-black hover:bg-white/80'}
              `}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#8EC894] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto bg-black rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#207659] opacity-20 blur-[120px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#8EC894] text-black rounded-full font-black text-xs uppercase mb-6">
                <Zap size={14} fill="currentColor" /> Limited Edition
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase mb-8">
                Midnight <br/><span className="text-[#8EC894]">Cold Brew</span>
              </h2>
              <p className="text-white/60 text-xl max-w-md mb-10">
                18-hour steep, infused with Madagascar vanilla and a hint of smoked sea salt.
              </p>
              <button className="px-8 py-4 bg-white text-black font-black uppercase rounded-xl hover:bg-[#8EC894] transition-colors">
                Available now
              </button>
            </div>
            <div className="relative aspect-square lg:aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
               <Beer size={120} className="text-[#8EC894] opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <CTA 
        title="Fuel Your Day"
        subtitle="Experience the craft in person. Find the nearest Bite & Brew sanctuary."
        primaryCTA={{ href: '/visit', text: 'Locate Shop' }}
        secondaryCTA={{ href: '/', text: 'Home' }}
      />
    </div>
  );
};

export default MenuPage;
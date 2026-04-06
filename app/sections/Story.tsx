'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { useMouseTilt } from '../components/useMouseTilt'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Coffee, Zap, ArrowUpRight, History } from 'lucide-react'
import type { StoryProps, TimelineItem } from '../types/story'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const sampleTimeline: TimelineItem[] = [
  { id: '1', year: '2005', title: 'The Garage Roastery', description: 'Started with a single modified espresso machine and a dream to disrupt the bitter coffee status quo.' },
  { id: '2', year: '2012', title: 'Urban Expansion', description: 'Conquered the city skyline with 5 flagship locations. Where concrete meets coffee culture.' },
  { id: '3', year: '2018', title: 'Award Circuit', description: 'Roasted our way to 27 major awards. From World Barista Championship to Best Bite in Brew.' },
  { id: '4', year: '2023', title: 'Global Brew', description: 'Launched international pop-ups across 12 countries. Bite & Brew knows no borders.' },
  { id: '5', year: '2025', title: 'Next Chapter', description: 'Franchise revolution begins. Bringing the boldest brews to every corner of the earth.' }
]

export const StorySection: React.FC<StoryProps> = React.memo(({
  title = 'Bold Beginnings',
  subtitle = '20 years of brewing revolution, from garage roastery to global domination',
  timeline = sampleTimeline,
  primaryCTA = { href: '#menu', text: 'Our Menu Now' },
  secondaryCTA = { href: '#contact', text: 'Join the Revolution' }
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const timelineHeroRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const ctaCardRef = useRef<HTMLDivElement>(null) // Dedicated ref for bottom CTA
  
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
      gsap.from(".story-char", {
        y: 50, opacity: 0, stagger: 0.02, duration: 0.8, ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".story-header", start: "top 85%" }
      })

      // 2. PINNING
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: pinContainerRef.current,
        start: "top 10%",
        end: `+=${timeline.length * 600}px`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(
            Math.floor(progress * timeline.length),
            timeline.length - 1
          );
          setActiveIndex(index);
        }
      })

      // 3. Infinite Ticker
      gsap.to(tickerRef.current, {
        xPercent: -50, repeat: -1, duration: 40, ease: "none"
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [timeline.length])

  // CONTENT SYNC ANIMATION
  useEffect(() => {
    gsap.fromTo(".hero-content-inner-text", 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    )
  }, [activeIndex])

  const scrollToTimelineIndex = (index: number) => {
    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const targetScroll = st.start + (st.end - st.start) * (index / (timeline.length - 1));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }

  // Apply Mouse Tilt to both key cards
  useMouseTilt({ ref: timelineHeroRef })
  useMouseTilt({ ref: ctaCardRef })

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6 bg-[#F5F0E6] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="story-header mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#000000] text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-[0.3em]">
            <History size={14} className="fill-[#8EC894]" /> Our Journey
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-[#000000] uppercase tracking-tighter leading-[0.85]">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-4">
                  {word.split('').map((char, j) => <span key={j} className="story-char inline-block">{char}</span>)}
                </span>
              ))}
            </h2>
            <p className="text-xl text-[#4A2C2A]/80 max-w-md font-medium leading-relaxed border-l-4 border-[#4B9360] pl-6">
              {subtitle}
            </p>
          </div>
        </div>

        {/* PINNED CONTAINER */}
        <div ref={pinContainerRef} className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[650px]">
          
          {/* LEFT: Dynamic Hero Card (with Mouse Tilt) */}
          <div ref={timelineHeroRef} className="lg:col-span-7 h-[600px] rounded-[3.5rem] bg-[#000000] p-12 md:p-16 text-white relative overflow-hidden shadow-3xl border border-white/5 will-change-transform">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <Coffee size={300} strokeWidth={1} />
             </div>

             <div className="hero-content-inner relative z-10 h-full flex flex-col justify-between">
                <div className="hero-content-inner-text">
                  <div className="w-20 h-20 bg-[#8EC894] rounded-3xl flex items-center justify-center text-black font-black text-2xl mb-10 shadow-[0_0_40px_rgba(142,200,148,0.3)]">
                    {timeline[activeIndex].year}
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none mb-6">
                    {timeline[activeIndex].title}
                  </h3>
                  <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                    {timeline[activeIndex].description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-6">
                  <div className="h-[2px] flex-1 bg-white/10 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#8EC894] transition-all duration-300" 
                      style={{ width: `${((activeIndex + 1) / timeline.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm tracking-widest text-[#8EC894]">
                    0{activeIndex + 1} / 0{timeline.length}
                  </span>
                </div>
             </div>
          </div>

          {/* RIGHT: SelectedIndex Indicator Cards */}
          <div className="lg:col-span-5 space-y-4">
            {timeline.map((item, i) => (
              <div 
                key={item.id}
                onClick={() => scrollToTimelineIndex(i)}
                className={`group cursor-pointer relative p-8 rounded-[2rem] transition-all duration-500 border-2 ${
                  activeIndex === i 
                    ? "bg-white border-[#8EC894] shadow-2xl translate-x-4 scale-100 opacity-100" 
                    : "bg-white/40 border-transparent grayscale opacity-40 scale-95 hover:opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                   <span className={`font-black text-xl ${activeIndex === i ? "text-[#000000]" : "text-gray-400"}`}>
                    {item.year}
                   </span>
                   {activeIndex === i && <Zap size={18} className="text-[#8EC894] fill-[#8EC894]" />}
                </div>
                <h4 className={`font-bold text-lg ${activeIndex === i ? "text-[#000000]" : "text-gray-500"}`}>
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA Section (with Mouse Tilt) */}
        <div 
          ref={ctaCardRef} 
          className="mt-32 p-12 md:p-20 rounded-[4rem] bg-[#000000] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden will-change-transform"
        >
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-black uppercase mb-4">
              The Next Chapter<br/>
              <span className="text-[#8EC894]">Starts With You</span>
            </h3>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link href={primaryCTA.href} className="px-10 py-5 bg-[#8EC894] text-black font-black uppercase text-sm rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform">
              {primaryCTA.text} <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee Background */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div ref={tickerRef} className="flex gap-20 whitespace-nowrap py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-[15rem] font-black uppercase tracking-tighter text-[#000000]">BITE & BREW</span>
              <span className="text-[15rem] font-black uppercase tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px #000000' }}>HISTORY</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
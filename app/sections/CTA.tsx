'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Coffee, ArrowUpRight, Zap, Sparkles } from 'lucide-react'
import type { CTAProps } from '../types/cta'
import { useMouseTilt } from '../components/useMouseTilt'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const CreativeCTA: React.FC<CTAProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useMouseTilt({ ref: cardRef })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      })

      tl.fromTo(cardRef.current, 
        { scale: 0.8, opacity: 0, y: 100, rotateX: 15 },
        { scale: 1, opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: "expo.out" }
      )
      .fromTo(".cta-char", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.8"
      )

      // 2. Continuous Ticker
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: "none"
      })

      // Mouse Tilt via hook (managed automatically)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const titleWords = title.split(' ').map((word, i) => (
    <span key={i} className="inline-block whitespace-nowrap mr-3">
      {word.split('').map((char, j) => (
        <span key={j} className="cta-char inline-block">{char}</span>
      ))}
    </span>
  ))

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-24 px-6 bg-[#F5F0E6] overflow-hidden perspective-1000"
    >
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-[#4B9360]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-[#8EC894]/20 rounded-full blur-[100px]" />
      </div>

      {/* --- MAIN INTERACTIVE CARD --- */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-6xl bg-[#000000] rounded-[4rem] p-8 md:p-20 overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] transform-style-3d"
      >
        {/* Spinning Decorative Ring (Hero Consistency) */}
        <div className="absolute -right-20 -top-20 w-80 h-80 opacity-20 pointer-events-none animate-[spin_20s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path id="ctaCirclePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
            <text className="text-[6px] font-bold uppercase fill-white uppercase tracking-widest">
              <textPath xlinkHref="#ctaCirclePath">Premium Brew • Urban Bite • Bold Taste • Elite Quality • </textPath>
            </text>
          </svg>
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Text Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
              <Zap size={14} className="text-[#8EC894] fill-[#8EC894]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">The Final Sip</span>
            </div>

            <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.85] uppercase tracking-tighter">
              {titleWords}
            </h2>

            <p className="text-lg md:text-xl text-white/50 max-w-xl font-medium leading-relaxed border-l-2 border-[#4B9360] pl-6">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Link
                href={primaryCTA.href}
                className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-[#8EC894] text-black font-black uppercase text-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(142,200,148,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {primaryCTA.text}
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="group relative flex items-center justify-center px-12 py-6 border-2 border-white/10 text-white font-bold uppercase text-sm rounded-2xl overflow-hidden hover:bg-white hover:text-black transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {secondaryCTA.text}
                    <Coffee size={18} />
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: Visual Accent */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 md:w-64 md:h-64 bg-[#4B9360] rounded-[3rem] rotate-12 flex items-center justify-center shadow-2xl group transition-transform duration-700 hover:rotate-0">
               <Sparkles size={80} className="text-[#8EC894] absolute top-[-20%] right-[-10%] animate-pulse" />
               <Coffee size={100} strokeWidth={1} className="text-white -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </div>

        </div>

        {/* Loading/Error Overlays - Removed unused */}
      </div>

      {/* --- INFINITE PARALLAX TICKER (Page Bottom) --- */}
      <div className="absolute bottom-0 w-full overflow-hidden py-10 opacity-20 pointer-events-none">
        <div ref={tickerRef} className="flex gap-20 w-fit whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-9xl font-black text-[#000000] uppercase tracking-tighter">BITE & BREW</span>
              <Coffee size={100} strokeWidth={4} className="text-[#000000]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { CreativeCTA as default }

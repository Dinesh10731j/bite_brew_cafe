'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { brandConfig } from '../lib/config'

export default function BiteBrewLogo() {
  const logoRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo entrance animation
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      // Gentle rotation animation
      gsap.to(logoRef.current, {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div
        ref={logoRef}
        className="relative w-64 h-64 flex items-center justify-center"
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#207659]/30 shadow-2xl" />

        {/* Logo background */}
        <div className="absolute inset-4 bg-gradient-to-br from-[#207659]/10 via-[#D2B48C]/20 to-transparent rounded-full backdrop-blur-sm" />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          {/* Coffee cup icon */}
          <div className="relative w-32 h-40">
            {/* Cup body */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D2B48C] to-[#B8956A] rounded-b-2xl shadow-lg" />

            {/* Coffee fill */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-[#6B4423] to-[#4A2C1A] rounded-b-2xl" />

            {/* Shine */}
            <div className="absolute top-4 left-6 w-12 h-12 bg-white/40 rounded-full blur-md" />

            {/* Steam */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1.5 h-4 bg-white/50 rounded-full mx-auto animate-pulse" />
              <div className="w-1 h-3 bg-white/30 rounded-full mx-auto animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>

            {/* Handle */}
            <div className="absolute right-0 top-1/4 w-6 h-12 border-3 border-[#D2B48C] rounded-r-lg" />
          </div>

          {/* Brand text */}
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-[#207659] font-serif">Bite & Brew</p>
            <p className="text-xs text-[#1a5a46]/60 font-light tracking-widest">PREMIUM CAFÉ</p>
          </div>
        </div>

        {/* Floating accent elements */}
        <div className="absolute top-8 right-12 w-3 h-3 bg-[#207659]/40 rounded-full blur-sm" />
        <div className="absolute bottom-16 left-8 w-2 h-2 bg-[#D2B48C]/50 rounded-full blur-sm" />
      </div>
    </div>
  )
}

'use client'

import { useRef, useEffect } from 'react'
import { gsap } from './lib/gsap'

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // gsap.context handles cleanup automatically when ctx.revert() is called
    let ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // 1. Core Pulsing Animation
      gsap.to(coreRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // 2. Orbits Rotation
      gsap.to(".orbit-line", {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
        transformOrigin: "center",
        stagger: {
          each: 1,
          from: "random"
        }
      })

      // 3. Text Stagger Entrance
      if (textRef.current) {
        gsap.fromTo(textRef.current.children, 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power4.out" }
        )
      }
    }, containerRef)

    return () => ctx.revert() // Important: Cleans up all animations
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]"
    >
      <div className="relative flex items-center justify-center w-64 h-64">
        
        {/* Orbiting Rings */}
        <svg ref={orbitRef} className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle 
            className="orbit-line stroke-slate-200 dark:stroke-slate-800" 
            cx="50" cy="50" r="30" fill="none" strokeWidth="0.5" strokeDasharray="4 8" 
          />
          <circle 
            className="orbit-line stroke-[#207659]/40" 
            cx="50" cy="50" r="40" fill="none" strokeWidth="1" strokeDasharray="10 5" 
          />
          <circle 
            className="orbit-line stroke-slate-300 dark:stroke-slate-700" 
            cx="50" cy="50" r="20" fill="none" strokeWidth="0.5" 
          />
          
          {/* Orbiting Electron Dots */}
          <circle cx="80" cy="50" r="2" fill="#207659" className="orbit-line" />
          <circle cx="20" cy="50" r="1.5" fill="#10b981" className="orbit-line" />
        </svg>

        {/* Central Core */}
        <div 
          ref={coreRef}
          className="relative w-12 h-12 bg-[#207659] rounded-full shadow-[0_0_30px_rgba(32,118,89,0.6)] flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
        </div>
      </div>

      {/* Modern Text Reveal */}
      <div 
        ref={textRef}
        className="mt-8 flex space-x-1 font-mono text-sm tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase"
      >
        {"Initializing".split("").map((char, i) => (
          <span key={i} className="inline-block">{char}</span>
        ))}
      </div>

      {/* Bottom Scanning Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#207659] to-transparent opacity-20 overflow-hidden">
        <div className="w-full h-full bg-[#207659] animate-scan" />
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
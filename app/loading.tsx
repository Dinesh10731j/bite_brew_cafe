'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/app/lib/gsap'

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const spinnerRef = useRef<SVGCircleElement>(null!)
  const textRef = useRef<HTMLParagraphElement>(null!)

  useEffect(() => {
    // Create GSAP timeline for entrance and loop
    const tl = gsap.timeline()

    // Entrance animation: fade + scale up
    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    )

    // Stagger text letters (optional premium touch)
    gsap.fromTo(textRef.current!.children, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'expo.out' }
    )

    // Infinite spinner rotation + pulse
    const spinLoop = gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 2,
      ease: 'none',
      repeat: -1
    })

    const pulse = gsap.to(spinnerRef.current, {
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })

    // Cleanup (Next.js handles exit)
    return () => {
      tl.kill()
      spinLoop.kill()
      pulse.kill()
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-slate-900/95 dark:to-slate-900/90 backdrop-blur-sm bg-noise"
    >
      <div className="flex flex-col items-center space-y-6 p-8 max-w-sm mx-auto">
        {/* Animated Spinner - Morphing coffee bean/circle */}
        <div className="relative">
          <svg 
            className="w-20 h-20 md:w-24 md:h-24"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              ref={spinnerRef}
              cx="50"
              cy="50"
              r="20"
              stroke="#207659"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform-gpu"
            />
            {/* Inner pulse ring */}
            <circle
              cx="50"
              cy="50"
              r="28"
              pathLength={1}
              className="stroke-[#D2B48C]/30 stroke-[3px]"
              strokeDasharray="0 1"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0 1; 1 1"
                dur="1.5s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
                keyTimes="0; 0.5; 1"
              />
            </circle>
          </svg>
          <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 animate-ping rounded-2xl bg-[#207659]/10" />
        </div>

        {/* Brewing text with letter stagger */}
        <p 
          ref={textRef}
          className="text-2xl md:text-3xl font-bold text-[#1a5a46] tracking-tight text-center leading-tight"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {Array.from('Brewing your experience...').map((char, i) => (
            <span key={i} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>

        <div className="h-2 w-24 bg-gradient-to-r from-[#207659]/20 to-transparent rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-[#207659] animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  )
}

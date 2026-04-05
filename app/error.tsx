'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/app/lib/gsap'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const descriptionRef = useRef<HTMLParagraphElement>(null!)
  const btnRef = useRef<HTMLButtonElement>(null!)

  useEffect(() => {
    // GSAP timeline for entrance stagger
    const tl = gsap.timeline()

    tl.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
    )
    .fromTo(titleRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' },
      '-=0.2'
    )
    .fromTo(descriptionRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(btnRef.current,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' },
      '-=0.2'
    )

    // Button hover animation
    const hoverTl = gsap.timeline({ paused: true })
    hoverTl.to(btnRef.current, {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(32, 118, 89, 0.4)',
      duration: 0.3,
      ease: 'power2.out'
    })

    const handleHover = (e: boolean) => {
      if (e) hoverTl.play()
      else hoverTl.reverse()
    }

    btnRef.current?.addEventListener('mouseenter', () => handleHover(true))
    btnRef.current?.addEventListener('mouseleave', () => handleHover(false))

    return () => {
      tl.kill()
      hoverTl.kill()
      btnRef.current?.removeEventListener('mouseenter', () => {})
      btnRef.current?.removeEventListener('mouseleave', () => {})
    }
  }, [reset])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-slate-900/95 dark:to-slate-900/90 bg-noise"
    >
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Sad Coffee Icon */}
        <div className="w-32 h-32 mx-auto relative">
          <div className="w-24 h-24 bg-[#207659] rounded-3xl mx-auto relative overflow-hidden shadow-2xl shadow-[#207659]/20">
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-3xl animate-pulse" />
            {/* Steam */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12">
              <div className="w-2 h-2 bg-white/70 rounded-full absolute animate-ping" style={{animationDuration: '2s'}} />
              <div className="w-1 h-1 bg-white/50 rounded-full absolute top-2 animate-ping delay-150" style={{animationDuration: '2.2s'}} />
            </div>
            {/* Sad eyes */}
            <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/90 rounded-full shadow-sm" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/90 rounded-full shadow-sm" />
            <div className="absolute bottom-2 left-1/4 w-1 h-1 bg-white rounded-full absolute animate-bounce" />
            <div className="absolute bottom-2 right-1/4 w-1 h-1 bg-white rounded-full absolute animate-bounce [animation-delay:0.1s]" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 
            ref={titleRef}
            className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#207659] to-[#1a5a46] bg-clip-text text-transparent drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Oops!
          </h1>
          <p 
            ref={descriptionRef}
            className="text-2xl md:text-3xl font-bold text-[#1a5a46]/90 dark:text-amber-200 max-w-sm mx-auto leading-tight"
          >
            Something spilled.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
            Don&apos;t worry, accidents happen. Let&apos;s clean this up and try again.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <button
            ref={btnRef}
            onClick={() => reset()}
            className="px-8 py-4 bg-[#207659] hover:bg-[#1a5a46] text-white font-bold rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform-gpu min-w-[140px] border-2 border-transparent hover:border-[#1a5a46]/50"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-[#207659] font-bold rounded-2xl text-lg shadow-xl hover:shadow-2xl backdrop-blur-sm border border-[#207659]/30 transition-all duration-200 transform-gpu min-w-[140px]"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import type { CTAProps } from '../types/cta'

export default function CTA({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  loading = false,
  error = null
}: CTAProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const primaryBtnRef = useRef<HTMLAnchorElement>(null)
  const secondaryBtnRef = useRef<HTMLAnchorElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (loading || error) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        onComplete: () => setIsLoaded(true)
      })

      // Section fade
      tl.fromTo(sectionRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      // Headline animation
      const letters = headlineRef.current?.querySelectorAll('.letter')
      if (letters) {
        tl.fromTo(letters,
          { opacity: 0, y: 40, rotateX: -20 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
          },
          '-=0.5'
        )
      }

      // Subtitle
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        '-=0.4'
      )

      // Buttons
      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current.children,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: 'back.out(1.7)'
          },
          '-=0.4'
        )
      }

      // Parallax
      gsap.to(sectionRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [loading, error])

  const letters = title.split('').map((char, i) => (
    <span key={i} className="letter inline-block">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 🌿 SAME HERO BACKGROUND */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(135deg, #f8f5f0 0%, #ede8e3 50%, #e8dfd7 100%)'
        }}
      />

      {/* 🌿 RADIAL DEPTH (Premium layer) */}
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(32,118,89,0.08), transparent 60%)'
        }}
      />

      {/* 🌿 NOISE */}
      <div className="absolute inset-0 opacity-5 bg-noise pointer-events-none" />

      {/* 🌿 HERO MATCHING BLOBS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#207659]/10 to-transparent rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#207659]/5 to-transparent rounded-full blur-3xl -ml-48 -mb-48"></div>

      {/* 🌿 TOP FADE (smooth transition from hero) */}
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-transparent to-[#f8f5f0]" />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="animate-spin h-10 w-10 border-b-2 border-[#207659] rounded-full"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* 🌿 CONTENT */}
      <div className="relative z-10 max-w-4xl text-center px-6">
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl font-serif font-bold text-[#207659] mb-6"
        >
          {letters}
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl text-[#1a5a46] mb-10"
        >
          {subtitle}
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            ref={primaryBtnRef}
            href={primaryCTA.href}
            className="px-8 py-4 bg-gradient-to-r from-[#207659] to-[#1a5a46] text-white rounded-full shadow-lg"
          >
            {primaryCTA.text}
          </a>

          {secondaryCTA && (
            <a
              ref={secondaryBtnRef}
              href={secondaryCTA.href}
              className="px-8 py-4 bg-white/80 backdrop-blur text-[#207659] rounded-full border"
            >
              {secondaryCTA.text}
            </a>
          )}
        </div>
      </div>

      {/* 🌿 GLOW */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#207659]/10 blur-3xl rounded-full"></div>
    </section>
  )
}
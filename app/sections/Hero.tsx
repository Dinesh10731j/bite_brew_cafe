'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '../lib/gsap'
import type { HeroProps, CTAButton } from '../types/hero'
import cafe_logo from '../../public/bite_brew_logo.jpeg'

export default function Hero({ title, description, ctas }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaContainerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // ✨ Headline animation
      const words = headlineRef.current?.querySelectorAll('.word')
      if (words) {
        tl.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
          }
        )
      }

      // ✨ Subtitle
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        '-=0.5'
      )

      // ✨ CTA buttons
      const buttons = ctaContainerRef.current?.querySelectorAll('a')
      if (buttons) {
        tl.fromTo(
          buttons,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.5)'
          },
          '-=0.4'
        )
      }

      // 🔥 LOGO ENTRY
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9, y: 80 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' },
        0
      )

      // 🔥 PIN LOGO (REAL PREMIUM EFFECT)
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600',
          scrub: true,
          pin: imageRef.current,
          pinSpacing: false
        }
      })

      // 🌿 PARALLAX DEPTH
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true
        }
      })

      // ✨ FLOATING LOOP
      gsap.to(imageRef.current, {
        y: -20,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      // ✨ SCROLL INDICATOR
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #f8f5f0 0%, #ede8e3 50%, #e8dfd7 100%)'
      }}
    >
      {/* 🌿 Background layers */}
      <div className="absolute inset-0 opacity-5 bg-noise" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#207659]/10 to-transparent rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#207659]/5 to-transparent rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* TEXT */}
        <div className="space-y-8">
          <h1
            ref={headlineRef}
            className="text-5xl md:text-7xl font-serif font-bold text-[#207659]"
          >
            {title.split(' ').map((word, i) => (
              <span key={i} className="word inline-block mr-3">{word}</span>
            ))}
          </h1>

          <p ref={subheadlineRef} className="text-xl text-[#1a5a46]/80">
            {description}
          </p>

          <div ref={ctaContainerRef} className="flex gap-4">
            {ctas.map((cta: CTAButton, i) => (
              <Link
                key={i}
                href={cta.href}
                className={`px-8 py-4 rounded-full font-semibold shadow-lg ${
                  i === 0
                    ? 'bg-gradient-to-r from-[#207659] to-[#1a5a46] text-white'
                    : 'bg-white/80 backdrop-blur text-[#207659]'
                }`}
              >
                {cta.text}
              </Link>
            ))}
          </div>
        </div>

        {/* 🔥 LOGO SECTION */}
        <div ref={imageRef} className="relative flex items-center justify-center">

          {/* Glow */}
          <div className="absolute w-80 h-80 bg-[#207659]/20 blur-3xl rounded-full" />

          {/* Glass circle */}
          <div className="relative w-64 h-64 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-center">

            <Image
              src={cafe_logo}
              alt="Bite & Brew Logo"
              className="rounded-full object-cover"
              width={220}
              height={220}
              priority
            />

          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#207659]/60"
      >
        Scroll ↓
      </div>
    </section>
  )
}
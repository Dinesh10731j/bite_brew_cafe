'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/app/lib/gsap'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const btnRef = useRef<HTMLButtonElement>(null!)
  const beansRefs = useRef<(HTMLElement | null)[]>([])
  const parallaxRef = useRef<HTMLDivElement>(null!)

  // Floating beans data
  const beans = [
    { x: -20, y: 10, delay: 0, duration: 8 },
    { x: 30, y: -15, delay: 1, duration: 10 },
    { x: -10, y: 25, delay: 2, duration: 7 },
    { x: 40, y: 20, delay: 0.5, duration: 9 }
  ]

  useEffect(() => {
    // Main timeline
    const tl = gsap.timeline()

    // 404 numbers bounce in with overshoot
    tl.fromTo(numberRefs.current,
      { scale: 0, rotation: -180, opacity: 0 },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }
    )
    .fromTo(titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' },
      '-=0.4'
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(btnRef.current,
      { scale: 0.8, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
      '-=0.2'
    )

    // Floating coffee beans
    const beanTweens: gsap.core.Tween[] = []
    beans.forEach((bean, i) => {
      const tween = gsap.to(beansRefs.current[i],
        {
          x: `${bean.x}%`,
          y: `${bean.y}%`,
          rotation: 360,
          duration: bean.duration,
          ease: 'power0.inOut', // linear
          repeat: -1,
          yoyo: true,
          delay: bean.delay
        }
      )
      beanTweens.push(tween)
    })

    // Button hover
    const btnHover = gsap.timeline({ paused: true })
    btnHover.to(btnRef.current, {
      scale: 1.1,
      boxShadow: '0 20px 40px rgba(32, 118, 89, 0.5)',
      textShadow: '0 0 20px rgba(255,255,255,0.8)',
      duration: 0.3,
      ease: 'power2.out'
    })

    const handleBtnHover = (enter: boolean) => {
      btnHover.progress(enter ? 1 : 0)
    }

    btnRef.current?.addEventListener('mouseenter', () => handleBtnHover(true))
    btnRef.current?.addEventListener('mouseleave', () => handleBtnHover(false))

    // Subtle parallax on container move
    let mouseX = 0, mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
      gsap.to(parallaxRef.current, {
        x: mouseX * 10,
        y: mouseY * 10,
        duration: 1,
        ease: 'power2.out'
      })
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      tl.kill()
      beanTweens.forEach(tween => tween.kill())
      btnHover.kill()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 dark:from-slate-900 dark:to-slate-800/90 bg-noise">
      {/* Parallax background shapes */}
      <div ref={parallaxRef} className="absolute inset-0 opacity-20">
        <div className="absolute w-64 h-64 bg-[#D2B48C]/40 rounded-6xl -top-32 -right-32 blur-xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute w-96 h-96 bg-[#207659]/20 rounded-full -bottom-48 left-1/4 blur-3xl animate-[float_8s_ease-in-out_infinite_2s]" />
        <div className="absolute w-80 h-80 bg-amber-200/30 rounded-4xl top-1/2 -right-40 blur-xl animate-[float_7s_ease-in-out_infinite_4s]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Numbers */}
        <div className="flex items-baseline justify-center">
          {['4', '0', '4'].map((num, i) => (
            <span
              key={i}
              ref={el => { numberRefs.current[i] = el }}
              className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-black bg-gradient-to-b from-[#207659] to-[#1a5a46] bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_4px_20px_rgba(32,118,89,0.3)] leading-none tracking-[-0.1em] block"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {num}
            </span>
          ))}
        </div>

        {/* Spilled coffee illustration */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 rounded-3xl shadow-2xl rotate-12 blur-sm scale-110 opacity-75" />
          <div className="absolute w-full h-full bg-gradient-to-b from-[#D2B48C] to-[#DEB887] rounded-3xl shadow-xl border border-white/50 rotate-6 -translate-y-2" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-orange-500/80 rounded-b-3xl blur-sm -rotate-3" />
        </div>

        <div className="space-y-4">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a5a46]/90 dark:text-amber-100 drop-shadow-xl"
          >
            Page Not Found
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed"
          >
            The page you&apos;re looking for has wandered off for a coffee break.
          </p>
        </div>

        {/* Floating beans */}
        <div className="flex items-center justify-center absolute inset-0 pointer-events-none">
          {beans.map((_, i) => (
            <div
              key={i}
              ref={el => { beansRefs.current[i] = el }}
              className="w-4 h-2 bg-gradient-to-r from-[#DEB887] to-[#D2B48C] rounded-full shadow-lg opacity-80 absolute"
              style={{ scale: '0.6' }}
            />
          ))}
        </div>

        <div className="pt-8">
          <Link href="/">
            <button
              ref={btnRef}
              className="px-10 py-5 bg-gradient-to-r from-[#207659] to-[#1a5a46] hover:from-[#1a5a46] hover:to-[#154b3e] text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform-gpu border-0 min-w-[200px] relative overflow-hidden group"
            >
              <span className="relative z-10">Back to Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

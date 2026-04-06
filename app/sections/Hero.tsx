'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '../lib/gsap'
import type { HeroProps, CTAButton } from '../types/hero'
import cafe_logo from '../../public/bite_brew_logo.jpeg'

export const CreativeHero: React.FC<HeroProps> = ({ title, description, ctas }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const liquidBgRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

      // Initial Load Reveal
      tl.fromTo(liquidBgRef.current ?? {}, 
        { scale: 1.5, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 2 }
      )
      .fromTo(".char", 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.02, duration: 1 }, 
        "-=1.5"
      )
      .fromTo(imageWrapperRef.current ?? {}, 
        { x: 100, opacity: 0, rotate: 10 }, 
        { x: 0, opacity: 1, rotate: 0, duration: 1.5 }, 
        "-=1"
      )

      // Floating elements
      gsap.to(".floating-element", {
        y: -20,
        x: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Ticker scroll
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "none"
      })

      // --- MOUSE EVENT FOR BITE & BREW ---
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".char-interactive")
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect()
          const charX = rect.left + rect.width / 2
          const charY = rect.top + rect.height / 2
          
          const distX = e.clientX - charX
          const distY = e.clientY - charY
          const distance = Math.sqrt(distX * distX + distY * distY)

          if (distance < 150) {
            gsap.to(char, {
              x: distX * 0.3,
              y: distY * 0.3,
              scale: 1.2,
              skewX: distX * 0.1,
              duration: 0.4,
              ease: "power2.out"
            })
          } else {
            gsap.to(char, {
              x: 0,
              y: 0,
              scale: 1,
              skewX: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.3)"
            })
          }
        })
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#F5F0E6] py-20 "
    >
      {/* Background */}
      <div ref={liquidBgRef} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#8EC894]/20 rounded-full blur-[120px] parallax-layer" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#4B9360]/10 rounded-full blur-[100px] parallax-layer" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-8 items-center mt-10">
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#000000] text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            <span className="w-2 h-2 bg-[#8EC894] rounded-full" />
            Now Brewing in the City
          </div>

          <h1 className="text-7xl md:text-[10rem] font-black text-[#000000] leading-[0.85] uppercase tracking-tighter mix-blend-multiply">
            {title.split(' ').map((word, i) => {
              // Check if the word is "BITE" or "BREW" (case insensitive)
              const isInteractive = word.toLowerCase().includes('bite') || word.toLowerCase().includes('brew');
              
              return (
                <span key={i} className="block overflow-visible">
                  {isInteractive ? (
                    word.split('').map((char, index) => (
                      <span key={index} className="char char-interactive inline-block will-change-transform">
                        {char}
                      </span>
                    ))
                  ) : (
                    <span className="char inline-block">{word}</span>
                  )}
                </span>
              );
            })}
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <p className="text-xl text-[#4A2C2A] max-w-sm font-medium leading-tight border-l-4 border-[#4B9360] pl-6">
              {description}
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-[#4B9360] tracking-[0.3em]">Quick Links</span>
              <div className="flex gap-4">
                {ctas?.map((cta, i) => (
                  <Link
                    key={i}
                    href={cta.href}
                    className={`group relative overflow-hidden px-8 py-4 font-bold uppercase text-sm transition-all duration-500 ${
                      i === 0 ? 'bg-[#000000] text-white' : 'border-2 border-[#000000] text-[#000000]'
                    }`}
                  >
                    <span className="relative z-10">{cta.text}</span>
                    <div className="absolute inset-0 bg-[#4B9360] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div ref={imageWrapperRef} className="relative flex justify-center items-center">
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_15s_linear_infinite]">
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
                <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
                <text className="text-[8px] font-bold uppercase fill-[#000000]">
                  <textPath xlinkHref="#circlePath">Best Coffee • Fresh Bites • Bold Vibes</textPath>
                </text>
              </svg>
            </div>

            <div className="relative z-10 w-80 h-80 md:w-[500px] md:h-[500px] p-4 bg-white/30 backdrop-blur-3xl rounded-[4rem] border border-white/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700">
              <Image
                src={cafe_logo}
                alt="Bite & Brew"
                className="w-[90%] h-[90%] object-cover rounded-[3rem] shadow-2xl"
                priority
              />
            </div>

            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#4B9360] rounded-full mix-blend-screen blur-3xl opacity-40 floating-element" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#4A2C2A] rounded-full mix-blend-multiply blur-3xl opacity-20 floating-element" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-[#000000] py-6 overflow-hidden rotate-[-2deg] translate-y-10">
        <div ref={tickerRef} className="flex whitespace-nowrap gap-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl font-black text-[#8EC894] uppercase tracking-tighter italic">Energy in Every Sip</span>
              <span className="text-4xl font-black text-transparent" style={{ WebkitTextStroke: '1px #8EC894' }}>•</span>
              <span className="text-4xl font-black text-[#F5F0E6] uppercase tracking-tighter">Bite Harder</span>
              <span className="text-4xl font-black text-[#8EC894] uppercase tracking-tighter italic">Brew Deeper</span>
              <span className="text-4xl font-black text-transparent" style={{ WebkitTextStroke: '1px #8EC894' }}>•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
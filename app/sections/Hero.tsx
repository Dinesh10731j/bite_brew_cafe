'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from '../lib/gsap'
import type { HeroProps } from '../types/hero'
import cafe_logo from '../../public/bite_brew_logo.jpeg'

export const CreativeHero: React.FC<HeroProps> = ({ title, description, ctas }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const liquidBgRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

      // 1. Initial Load Reveal
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

      // 2. Ticker scroll
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "none"
      })

      // 3. MOUSE INTERACTION LOGIC
      const handleMouseMove = (e: MouseEvent) => {
        // Target BOTH the .char (from strings) and .menu-char-interactive (from JSX)
        const chars = document.querySelectorAll(".char, .menu-char-interactive");
        
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          
          const distX = e.clientX - charX;
          const distY = e.clientY - charY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 150) {
            gsap.to(char, {
              x: distX * 0.4,
              y: distY * 0.4,
              scale: 1.3,
              rotate: distX * 0.1,
              duration: 0.4,
              ease: "power2.out"
            });
          } else {
            gsap.to(char, {
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.3)"
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, sectionRef) // Scoped to this section

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#F5F0E6] py-20 "
    >
      {/* Background elements */}
      <div ref={liquidBgRef} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#8EC894]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#4B9360]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-8 items-center mt-10">
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#000000] text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            <span className="w-2 h-2 bg-[#8EC894] rounded-full" />
            Now Brewing in the City
          </div>

          <h1 className="text-7xl md:text-[10rem] font-black text-[#000000] leading-[0.85] uppercase tracking-tighter mix-blend-multiply cursor-default">
            {typeof title === 'string' ? (
              <span className="flex flex-wrap">
                {title.split(' ').map((word, i) => (
                  <span key={i} className="flex mr-[0.2em]">
                    {word.split('').map((letter, j) => (
                      <span key={j} className="char inline-block will-change-transform">
                        {letter}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ) : (
              title
            )}
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

        {/* Image Section */}
        <div className="lg:col-span-5 relative">
          <div ref={imageWrapperRef} className="relative flex justify-center items-center">
             {/* ... SVG and Image content remains exactly same as your code ... */}
             <div className="relative z-10 w-80 h-80 md:w-[500px] md:h-[500px] p-4 bg-white/30 backdrop-blur-3xl rounded-[4rem] border border-white/50 shadow-2xl flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700">
              <Image src={cafe_logo} alt="Bite & Brew" className="w-[90%] h-[90%] object-cover rounded-[3rem]" priority />
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 w-full bg-[#000000] py-6 overflow-hidden rotate-[-2deg] translate-y-10">
        <div ref={tickerRef} className="flex whitespace-nowrap gap-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl font-black text-[#8EC894] uppercase italic">Energy in Every Sip</span>
              <span className="text-4xl font-black text-[#F5F0E6] uppercase">Bite Harder</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
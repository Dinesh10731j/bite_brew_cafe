'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MapPin, Coffee, HeartHandshake, ArrowUpRight } from 'lucide-react'
import { useMouseTilt } from '../components/useMouseTilt'
import type { ExperienceProps, ExperienceItem } from '../types/experience'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const sampleExperiences = [
  {
    id: '1',
    title: 'Morning Ritual',
    description: 'Freshly roasted beans grind with rich aroma filling the air. Your day begins with precision pour-over, crafted by hands that know every bean.',
    sensoryDetail: 'Warm sunlight filters through oak windows • First sip cuts crisp at 7:03 AM',
  },
  {
    id: '2',
    title: 'Afternoon Escape',
    description: 'Velvet espresso meets flaky artisan pastry. The world fades as leather seats embrace you in golden hour glow.',
    sensoryDetail: 'Butter layers crack • Espresso steam curls like whispered secrets',
  },
  {
    id: '3',
    title: 'Evening Vibe',
    description: 'Bold cold brew ignites conversations under ambient lights. Savory bites fuel debates that last past closing.',
    sensoryDetail: 'Ice clinks rhythmically • Jazz notes linger in roasted air',
  },
  {
    id: '4',
    title: 'Night Cap',
    description: 'Decaf dreams in moonlit corners. Final bite lingers as the city hums outside our sanctuary windows.',
    sensoryDetail: 'Silk smooth finish • Streetlights paint golden halos on porcelain',
  },
] as ExperienceItem[]

export const ExperienceSection: React.FC<ExperienceProps> = ({
  title = 'Live the Vibe',
  subtitle = 'Every moment crafted for your senses – from first aroma to final bite',
  experiences = sampleExperiences,
  primaryCTA = { href: '#menu', text: 'Full Menu' },
  secondaryCTA = { href: '#visit', text: 'Find Us' }
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const experienceHeroRef = useRef<HTMLDivElement>(null)
  const ctaCardRef = useRef<HTMLDivElement>(null) // New Ref for the CTA card
  const tickerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Animation
      gsap.from(".experience-char", {
        y: 50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".experience-header",
          start: "top 85%",
        }
      })

      // 2. PINNING LOGIC
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: pinContainerRef.current,
        start: "top 10%",
        end: `+=${experiences.length * 600}px`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.min(
            Math.floor(self.progress * experiences.length),
            experiences.length - 1
          )
          setActiveIndex(index)
        }
      })

      // 3. Ticker
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "none"
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [experiences.length])

  useEffect(() => {
    gsap.fromTo(".experience-hero-body", 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    )
  }, [activeIndex])

  const scrollToExperience = (index: number) => {
    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const targetScroll = st.start + (st.end - st.start) * (index / (experiences.length - 1));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }

  // Apply tilt to both the Hero and the Bottom CTA card
  useMouseTilt({ ref: experienceHeroRef })
  useMouseTilt({ ref: ctaCardRef })

  const currentExperience = experiences[activeIndex]

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6 bg-[#F5F0E6] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#8EC894]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[35vw] h-[35vw] bg-[#4B9360]/15 rounded-[100px] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="experience-header mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-black text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-[0.3em]">
            <MapPin size={14} className="fill-[#8EC894]" /> Feel It
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-[0.85]">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-4">
                  {word.split('').map((char, j) => (
                    <span key={j} className="experience-char inline-block">{char}</span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="text-xl text-black/70 max-w-md font-medium leading-relaxed border-l-4 border-[#4B9360] pl-6">
              {subtitle}
            </p>
          </div>
        </div>

        {/* PIN CONTAINER */}
        <div ref={pinContainerRef} className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[600px]">
          
          {/* LEFT: Dynamic Hero Card (with Mouse Tilt) */}
          <div ref={experienceHeroRef} className="lg:col-span-8 h-[600px] rounded-[3.5rem] bg-black text-white p-12 md:p-16 relative overflow-hidden shadow-3xl will-change-transform">
             <div className="absolute top-12 right-12 opacity-10">
                <Coffee size={200} strokeWidth={1} />
             </div>
             
             <div className="experience-hero-body relative z-20 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-[#8EC894] rounded-2xl flex items-center justify-center mb-10 shadow-lg text-black">
                     <Coffee size={32} />
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none mb-8">
                    {currentExperience.title}
                  </h3>
                  <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-2xl mb-8">
                    {currentExperience.description}
                  </p>
                  <div className="inline-block text-lg font-bold text-[#8EC894] border-b-2 border-[#8EC894]/30 pb-2">
                    {currentExperience.sensoryDetail}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-white/10">
                   <div className="flex items-center gap-4 text-[#8EC894] font-black uppercase tracking-widest">
                      <HeartHandshake size={24} /> Feel the Moment
                   </div>
                   <span className="font-mono text-sm opacity-40">0{activeIndex + 1} / 0{experiences.length}</span>
                </div>
             </div>
          </div>

          {/* RIGHT: Selected Cards */}
          <div className="lg:col-span-4 space-y-4">
            {experiences.map((item, i) => (
              <div 
                key={item.id}
                onClick={() => scrollToExperience(i)}
                className={`group cursor-pointer relative p-8 rounded-[2rem] transition-all duration-500 border-2 ${
                  activeIndex === i 
                    ? "bg-white border-[#8EC894] shadow-2xl translate-x-4 scale-105" 
                    : "bg-white/40 border-transparent grayscale opacity-40 scale-95 hover:opacity-80"
                }`}
              >
                <h4 className={`font-black text-xl uppercase ${activeIndex === i ? "text-black" : "text-gray-400"}`}>
                  {item.title}
                </h4>
                <p className={`text-sm mt-2 font-bold ${activeIndex === i ? "text-[#4B9360]" : "text-gray-400"}`}>
                  {item.sensoryDetail.split(' • ')[0]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA CARD (with Mouse Tilt) */}
        <div 
          ref={ctaCardRef} 
          className="mt-32 p-12 md:p-16 rounded-[4rem] bg-black text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl border border-white/5 relative overflow-hidden will-change-transform"
        >
           <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-black uppercase mb-4">Your Moment <span className="text-[#8EC894]">Awaits</span></h3>
              <p className="opacity-60 text-lg">Come live what words can only whisper.</p>
           </div>
           <div className="flex gap-4 relative z-10">
              <Link href={primaryCTA.href} className="px-10 py-5 bg-[#8EC894] text-black font-black uppercase text-sm rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform">
                {primaryCTA.text} <ArrowUpRight size={20} />
              </Link>
           </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.05]">
        <div ref={tickerRef} className="flex gap-20 whitespace-nowrap py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-[12rem] font-black uppercase text-black">SAVOR</span>
              <span className="text-[12rem] font-black uppercase text-transparent" style={{ WebkitTextStroke: '2px black' }}>SIP</span>
              <span className="text-[12rem] font-black uppercase text-black">STAY</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
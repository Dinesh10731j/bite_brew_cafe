'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { useMouseTilt } from '../components/useMouseTilt'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Star, Quote, ArrowUpRight, Sparkles, MessageCircle, Coffee } from 'lucide-react'
import type { TestimonialsProps } from '../types/testimonials'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const sampleTestimonials = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'Food Critic',
    quote: 'The perfect balance of bold coffee and savory bites. Bite & Brew redefined my morning ritual.',
    rating: 5,
    source: 'The Daily Brew'
  },
  {
    id: '2',
    name: 'Maya Chen',
    role: 'Tech Entrepreneur',
    quote: 'Energy in every sip, creativity in every bite. This is where ideas brew.',
    rating: 5,
    source: 'Startup Scene'
  },
  {
    id: '3',
    name: 'Jordan Hayes',
    role: 'Fitness Coach',
    quote: 'Clean ingredients, bold flavors. Fuel for champions who train hard and sip harder.',
    rating: 5,
    source: 'Peak Performance'
  },
  {
    id: '4',
    name: 'Sofia Patel',
    role: 'Graphic Designer',
    quote: 'The ambiance, the aroma, the art on the plate. Pure inspiration for my creative soul.',
    rating: 5,
    source: 'Design Digest'
  }
]

const CreativeTestimonials: React.FC<TestimonialsProps> = ({
  title = 'Real Voices',
  subtitle = 'What our community says about the brew that bites back',
  testimonials = sampleTestimonials,
  primaryCTA,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const pinnedHeroRef = useRef<HTMLDivElement>(null)
  const ctaCommunityRef = useRef<HTMLDivElement>(null) // Ref for left CTA
  const ctaSocialRef = useRef<HTMLDivElement>(null)    // Ref for right CTA
  const tickerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
      gsap.from(".title-char", {
        y: 50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".testimonial-header",
          start: "top 85%",
        }
      })

      // 2. PINNING LOGIC
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: pinContainerRef.current,
        start: "top 10%",
        end: `+=${testimonials.length * 600}px`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.min(
            Math.floor(self.progress * testimonials.length),
            testimonials.length - 1
          )
          setActiveIndex(index)
        }
      })

      // 3. Infinite Ticker
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "none"
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [testimonials.length])

  // CONTENT ANIMATION
  useEffect(() => {
    gsap.fromTo(".testimonial-hero-content-inner", 
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
    )
  }, [activeIndex])

  const scrollToTestimonial = (index: number) => {
    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const targetScroll = st.start + (st.end - st.start) * (index / (testimonials.length - 1));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }

  // Apply Mouse Tilt to the Hero and the two CTA cards
  useMouseTilt({ ref: pinnedHeroRef })
  useMouseTilt({ ref: ctaCommunityRef })
  useMouseTilt({ ref: ctaSocialRef })

  const activeTestimonial = testimonials[activeIndex]

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6 bg-[#F5F0E6] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#8EC894]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[35vw] h-[35vw] bg-[#4B9360]/10 rounded-[100px] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="testimonial-header mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-black text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-[0.3em]">
            <MessageCircle size={14} className="fill-[#8EC894]" />
            Community Buzz
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-[0.85]">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-4">
                  {word.split('').map((char, j) => (
                    <span key={j} className="title-char inline-block">{char}</span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="text-xl text-black/70 max-w-md font-medium leading-relaxed border-l-4 border-[#4B9360] pl-6">
              {subtitle}
            </p>
          </div>
        </div>

        {/* PINNED CONTAINER */}
        <div ref={pinContainerRef} className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[600px]">
          
          {/* LEFT: Dynamic Hero Card (with Mouse Tilt) */}
          <div ref={pinnedHeroRef} className="lg:col-span-8 h-[600px] rounded-[3.5rem] bg-black text-white p-12 md:p-16 relative overflow-hidden shadow-3xl border border-white/5 will-change-transform">
             <Quote className="absolute top-12 right-12 w-24 h-24 text-[#8EC894]/10" />
             
             <div className="testimonial-hero-content-inner relative z-20 h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 mb-8">
                    {[...Array(activeTestimonial.rating)].map((_, j) => (
                      <Star key={j} size={24} className="fill-[#8EC894] text-[#8EC894]" />
                    ))}
                  </div>
                  <blockquote className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-12">
                    "{activeTestimonial.quote}"
                  </blockquote>
                </div>

                <div className="flex items-center gap-6 border-t border-white/10 pt-10">
                  <div className="w-20 h-20 bg-[#8EC894] rounded-3xl flex items-center justify-center font-black text-3xl text-black shadow-lg">
                    {activeTestimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl mb-1">{activeTestimonial.name}</h4>
                    <p className="text-lg uppercase tracking-widest text-[#8EC894] font-bold">{activeTestimonial.role}</p>
                    {activeTestimonial.source && <span className="text-sm opacity-50 block mt-1 italic">via {activeTestimonial.source}</span>}
                  </div>
                </div>
             </div>
          </div>

          {/* RIGHT: Scrollable Indicator Cards */}
          <div className="lg:col-span-4 space-y-4">
            {testimonials.map((t, i) => (
              <div 
                key={t.id}
                onClick={() => scrollToTestimonial(i)}
                className={`group cursor-pointer relative p-6 rounded-[2rem] transition-all duration-500 border-2 ${
                  activeIndex === i 
                    ? "bg-white border-[#8EC894] shadow-2xl translate-x-4 scale-105" 
                    : "bg-white/40 border-transparent grayscale opacity-40 scale-95 hover:opacity-80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                   <span className={`font-black text-sm uppercase tracking-widest ${activeIndex === i ? "text-black" : "text-gray-400"}`}>
                    {t.name}
                   </span>
                   {activeIndex === i && <Sparkles size={16} className="text-[#8EC894] fill-[#8EC894]" />}
                </div>
                <h4 className={`font-bold text-lg leading-tight ${activeIndex === i ? "text-black" : "text-gray-500"}`}>
                  {t.role}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Community CTA (with Mouse Tilt) */}
           <div 
            ref={ctaCommunityRef} 
            className="lg:col-span-2 p-12 rounded-[3.5rem] bg-black text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl will-change-transform"
           >
              <h3 className="text-3xl md:text-4xl font-black uppercase text-center md:text-left">Ready to join <br/><span className="text-[#8EC894]">the community?</span></h3>
              <Link href={primaryCTA?.href || '#'} className="px-10 py-5 bg-[#8EC894] text-black font-black uppercase text-sm rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform">
                {primaryCTA?.text || 'Visit Us'} <ArrowUpRight size={20} />
              </Link>
           </div>

           {/* Social CTA (with Mouse Tilt) */}
           <div 
            ref={ctaSocialRef} 
            className="p-12 rounded-[3.5rem] bg-[#4B9360] text-white flex flex-col items-center justify-center text-center gap-4 shadow-2xl will-change-transform"
           >
              <Coffee size={48} className="mb-2" />
              <p className="font-bold uppercase tracking-widest text-sm">Follow the vibe</p>
              <span className="font-black text-2xl">@BITEANDBREW</span>
           </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div ref={tickerRef} className="flex gap-20 whitespace-nowrap py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-[15rem] font-black uppercase tracking-tighter text-black">REAL VOICES</span>
              <span className="text-[15rem] font-black uppercase tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px black' }}>COMMUNITY</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CreativeTestimonials
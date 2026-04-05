'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { useMouseTilt } from '../components/useMouseTilt'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Star, Quote, ArrowUpRight, Sparkles, MessageCircle, Coffee } from 'lucide-react'
import type { TestimonialsProps } from '../types/testimonials'

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
    rating: 5
  },
  {
    id: '4',
    name: 'Sofia Patel',
    role: 'Graphic Designer',
    quote: 'The ambiance, the aroma, the art on the plate. Pure inspiration.',
    rating: 5
  }
]

const CreativeTestimonials: React.FC<TestimonialsProps> = ({
  title = 'Real Voices',
  subtitle = 'What our community says about the brew that bites back',
  testimonials = sampleTestimonials,
  primaryCTA,
  secondaryCTA
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinnedHeroRef = useRef<HTMLDivElement>(null)
  const testimonialCardRefs = useRef<HTMLDivElement[]>([])
  const tickerRef = useRef<HTMLDivElement>(null)
  const pinTriggerRef = useRef<ScrollTrigger>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const testimonialCount = Math.min(testimonials.length, 4)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header char stagger
      const titleChars = sectionRef.current?.querySelectorAll('.title-char')
      if (titleChars) {
        gsap.from(titleChars, {
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
      }

      // Hero entrance
      gsap.timeline({
        scrollTrigger: {
          trigger: pinnedHeroRef.current,
          start: "top 80%",
        }
      }).fromTo(pinnedHeroRef.current, 
        { scale: 0.85, opacity: 0, y: 80 },
        { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "expo.out" }
      )

      // Fixed pinning
      const pinTrigger = ScrollTrigger.create({
        trigger: pinnedHeroRef.current,
        start: "top top",
        end: "+=100vh",
        pin: pinnedHeroRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1
      })
      pinTriggerRef.current = pinTrigger

      // Preview cards
      gsap.from(".preview-card", {
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".preview-grid",
          start: "top 85%"
        }
      })

      // Ticker
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "none"
      })
      gsap.to(".bg-shape", {
        y: -100,
        rotation: 45,
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true
        }
      })

    })

    return () => ctx.revert()
  }, [])

  useMouseTilt({ ref: pinnedHeroRef })

  const activeTestimonial = testimonials[activeIndex] || testimonials[0]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6 bg-[#F5F0E6] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="bg-shape absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#8EC894]/10 rounded-full blur-[120px]" />
        <div className="bg-shape absolute bottom-[5%] left-[-10%] w-[35vw] h-[35vw] bg-[#4B9360]/10 rounded-[100px] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="testimonial-header mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-black text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-[0.3em]">
            <MessageCircle size={14} className="fill-[#8EC894]" />
            Community Buzz
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-[0.85]">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-2">
                  {word.split('').map((char, j) => (
                    <span key={j} className="title-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="text-xl text-black/70 max-w-md font-medium leading-relaxed border-l-4 border-[#4B9360] pl-6">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="testimonial-container relative grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div ref={pinnedHeroRef} className="testimonial-hero lg:col-span-2 group relative h-[600px] p-12 rounded-[3rem] overflow-hidden bg-gradient-to-br from-black/90 to-gray-900 text-white shadow-2xl will-change-transform">
            <div className="testimonial-hero-content relative z-20 h-full flex flex-col justify-between">
              <Quote className="absolute top-12 right-12 w-16 h-16 text-[#8EC894]/30" />
              <div className="relative z-30 pt-16">
                <div className="flex gap-2 mb-8">
                  {[...Array(activeTestimonial.rating)].map((_, j) => (
                    <Star key={j} size={20} className="fill-[#8EC894] text-[#8EC894]" />
                  ))}
                </div>
                <blockquote className="font-black tracking-tight leading-tight text-4xl md:text-5xl mb-12">
                  "{activeTestimonial.quote}"
                </blockquote>
              </div>
              <div className="flex items-center gap-6 border-t border-white/10 pt-12">
                <div className="w-20 h-20 bg-[#8EC894] rounded-3xl flex items-center justify-center font-black text-2xl text-black">
                  {activeTestimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-2xl">{activeTestimonial.name}</h4>
                  <p className="text-xl uppercase tracking-widest opacity-90">{activeTestimonial.role}</p>
                  {activeTestimonial.source && <span className="text-sm text-[#8EC894] font-bold mt-2 block">via {activeTestimonial.source}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="preview-grid flex lg:flex-col gap-4 lg:gap-6">
            {testimonials.slice(1, testimonialCount).map((t, i) => (
              <div 
                key={t.id} 
                ref={(el) => {
                  if (el) testimonialCardRefs.current[i] = el
                }}
                className={`preview-card cursor-pointer group relative p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 hover:bg-white transition-all duration-500 h-48 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-4 relative before:absolute before:left-4 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-[#8EC894]/50 before:to-[#4B9360]/30 before:rounded-full z-0 ${
                  i + 1 === activeIndex ? 'ring-4 ring-[#8EC894]/50 bg-white ring-offset-4 ring-offset-[#F5F0E6]' : ''
                }`}
                onClick={() => {
                  const targetProgress = (i + 1) / testimonials.length;
                  pinTriggerRef.current?.scroll(targetProgress);
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="fill-[#8EC894] text-[#8EC894]" />
                  ))}
                </div>
                <h5 className="font-bold text-lg line-clamp-2 group-hover:line-clamp-none">{t.name}, {t.role}</h5>
                <p className="text-xs uppercase font-bold group-hover:opacity-100 opacity-80">{t.quote.split(' ').slice(0,8).join(' ')}...</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2" />
          <div className="testimonial-card flex flex-col items-center justify-center p-10 rounded-[3rem] bg-[#4B9360] text-white text-center gap-6">
            <div className="w-20 h-20 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-2">
              <Sparkles size={32} className="text-[#8EC894]" />
            </div>
            <h3 className="text-3xl font-black uppercase">Ready to join the cult?</h3>
            <Link 
              href={primaryCTA?.href || '#'} 
              className="flex items-center gap-2 px-8 py-4 bg-black text-[#8EC894] rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all shadow-xl"
            >
              {primaryCTA?.text || 'Explore Menu'}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div ref={tickerRef} className="flex gap-20 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-[15rem] font-black uppercase tracking-tighter">BREW THAT BITES</span>
              <Coffee size={120} strokeWidth={8} />
              <span className="text-[15rem] font-black uppercase tracking-tighter italic text-transparent stroke-black stroke-2" style={{ WebkitTextStroke: '2px black' }}>AUTHENTIC</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { CreativeTestimonials as default }

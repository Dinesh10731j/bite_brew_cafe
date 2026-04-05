'use client'

// Removed duplicate import - use React import below

import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { useMouseTilt } from '../components/useMouseTilt'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MapPin, Award, Globe, Zap, ArrowUpRight, Coffee } from 'lucide-react'
import type { StoryProps, TimelineItem } from '../types/story'



export const sampleTimeline: TimelineItem[] = [
  
  {
    id: '2',
    year: '2012',
    title: 'Urban Expansion',
    description: 'Conquered the city skyline with 5 flagship locations. Where concrete meets coffee culture, transforming neighborhoods one pour at a time.',
  },
  {
    id: '3',
    year: '2018',
    title: 'Award Circuit',
    description: 'Roasted our way to 27 major awards. From World Barista Championship to Best Bite in Brew. Taste verified by the world.',
  },
  {
    id: '4',
    year: '2023',
    title: 'Global Brew',
    description: 'Launched international pop-ups and online empire across 12 countries. Bite & Brew knows no borders – now shipping bold brews worldwide.',
  },
  {
    id: '5',
    year: '2025',
    title: 'Next Chapter',
    description: 'Franchise revolution begins. 100 locations planned. Bringing the boldest brews and fiercest bites to every corner of the earth.',
  }
]

import React, { useEffect, useRef, useState } from 'react'

export const StorySection: React.FC<StoryProps> = React.memo(({
  title = 'Bold Beginnings',
  subtitle = '20 years of brewing revolution, from garage roastery to global domination',
  timeline = sampleTimeline,
  primaryCTA = { href: '#menu', text: 'Our Menu Now' },
  secondaryCTA = { href: '#contact', text: 'Join the Revolution' }
}) => {


  const sectionRef = useRef<HTMLElement>(null)
  const timelineHeroRef = useRef<HTMLDivElement>(null)
  // previewRefs unused, consolidated to timelineCardRefs
  const tickerRef = useRef<HTMLDivElement>(null)
  const pinTriggerRef = useRef<ScrollTrigger>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const timelineCardRefs = useRef<HTMLDivElement[]>([])
  const timelineCount = Math.min(timeline.length, 5)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title char stagger reveal
      const titleChars = sectionRef.current?.querySelectorAll('.story-char')
      if (titleChars) {
        gsap.from(titleChars, {
          y: 50,
          opacity: 0,
          stagger: 0.02,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".story-header",
            start: "top 85%",
          }
        })
      }


gsap.timeline({
  scrollTrigger: {
    trigger: ctaRef.current,
    start: 'top center',
    end: '+=500',
    pin: ctaRef.current,
    scrub: true,
    anticipatePin: 1
  }
})
.fromTo(
  ctaRef.current,
  { scale: 0.8, opacity: 0, y: 50 },
  { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
)
.fromTo(
  ctaRef.current,
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, stagger: 0.2, duration: 0.6 },
  '-=0.5'
)
      

      // Timeline hero entrance
      gsap.timeline({
        scrollTrigger: {
          trigger: timelineHeroRef.current ?? document.body,
          start: "top 80%",
        }
      }).fromTo(timelineHeroRef.current ?? document.body, 
        { scale: 0.85, opacity: 0, y: 80 },
        { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "expo.out" }
      )

      // Fixed pinning - shorter duration, no scrub/state conflicts
      const pinTrigger = ScrollTrigger.create({
        trigger: timelineHeroRef.current ?? document.body,
        start: "top top",
        end: "+=100vh",
        pin: timelineHeroRef.current ?? document.body,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
      })
      pinTriggerRef.current = pinTrigger

      // Enhanced scrub timeline: sync activeIndex, morph content, animate right timeline
      const contentTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: timelineHeroRef.current ?? document.body,
          start: "top top",
          end: "+=100vh",
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.floor(progress * (timeline.length - 1));
            if (newIndex !== activeIndex) {
              setActiveIndex(newIndex);
            }
            // Hero morphs
            gsap.to('.timeline-hero-content h3', {
              scale: 1 + progress * 0.1,
              duration: 0.3
            });
            gsap.to('.timeline-hero-content > p', {
              opacity: progress > 0.1 ? 1 : 0.3,
              y: progress * -10,
              duration: 0.3
            });
            // Right timeline cards animation
      timelineCardRefs.current.forEach((card, i) => {
        const cardProgress = Math.abs(i / (timeline.length - 1) - progress);
        gsap.to(card ?? {}, {
          scale: 1 - cardProgress * 0.2,
          opacity: 0.6 + 0.4 * (1 - cardProgress),
          boxShadow: cardProgress < 0.3 ? '0 20px 40px rgba(142,200,148,0.4)' : '0 10px 20px rgba(0,0,0,0.1)',
          duration: 0.4
        });
        // Preview tilt moved to component level if needed
      });
          }
        }
      }).to(".timeline-hero-content", {
        scale: 1.05,
        y: -20,
        ease: "none"
      }, 0)


              // Right timeline cards enhanced entrance + hover prep
      gsap.from(".preview-timeline-card", {
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".preview-timeline-grid",
          start: "top 85%"
        }
      })

      // Infinite ticker
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "none"
      })

      // Background shapes parallax
      gsap.to(".story-bg-shape", {
        y: -100,
        rotation: 45,
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true
        }
      })

    })
    
    return () => ctx.revert()
  }, [timeline, timelineCount])

  useMouseTilt({ ref: timelineHeroRef })


  const activeTimelineItem = timeline[activeIndex] || timeline[0]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6 bg-[#F5F0E6] overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="story-bg-shape absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#8EC894]/10 rounded-full blur-[120px]" />
        <div className="story-bg-shape absolute bottom-[5%] left-[-10%] w-[35vw] h-[35vw] bg-[#4B9360]/10 rounded-[100px] blur-[100px]" />
        <div className="story-bg-shape absolute top-1/2 left-1/2 w-[25vw] h-[25vw] bg-[#000000]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="story-header mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#000000] text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-[0.3em]">
            <MapPin size={14} className="fill-[#8EC894]" />
            Our Journey
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-[#000000] uppercase tracking-tighter leading-[0.85]">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-2">
                  {word.split('').map((char, j) => (
                    <span key={j} className="story-char inline-block">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="text-xl text-[#4A2C2A] max-w-md font-medium leading-relaxed border-l-4 border-[#4B9360] pl-6">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Pinned Timeline Hero + Previews */}
        <div className="story-container relative grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pinned Timeline Hero */}
          <div ref={timelineHeroRef} className="story-timeline-hero lg:col-span-2 group relative h-[600px] p-12 rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#000000] to-[#1A1A1A] text-white shadow-[0_60px_100px_rgba(0,0,0,0.5)] perspective-[1000px] will-change-transform">
            <div className="timeline-hero-content relative z-20 h-full flex flex-col justify-between">
              <div className="absolute top-12 right-12 w-16 h-16 bg-[#8EC894]/20 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
                <div className="w-8 h-8 bg-[#8EC894] rounded-xl flex items-center justify-center font-black text-sm">
                  {timeline[0]?.year || '2005'}
                </div>
              </div>
              <div className="relative z-30 pt-16">
                <h3 className="font-black tracking-tight text-4xl md:text-5xl mb-8 uppercase leading-tight">
                  {timeline[activeIndex]?.title || timeline[0]?.title}
                </h3>
                <p className="text-xl opacity-95 leading-relaxed max-w-2xl text-white/95 drop-shadow-md">
                  {timeline[activeIndex]?.description || timeline[0]?.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-12 border-t border-white/10">
                <span className="text-6xl font-black opacity-80">{timeline[activeIndex]?.year || timeline[0]?.year}</span>
                <div className="flex items-center gap-4 text-[#8EC894] font-bold uppercase tracking-wider text-sm">
                  <Zap size={20} />
                  Milestone Achieved
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Preview Cards */}
          <div className="preview-timeline-grid flex lg:flex-col gap-6">
            {timeline.slice(1, timelineCount).map((item, i) => (
              <div 
                key={item.id}
ref={(el) => { if (el) timelineCardRefs.current[i] = el; }}

className="preview-timeline-card cursor-pointer group relative p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 hover:bg-white hover:shadow-3xl hover:scale-[1.05] transition-all duration-500 shadow-xl hover:shadow-2xl h-56 flex flex-col justify-between relative before:absolute before:left-6 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-[#8EC894]/50 before:to-[#4B9360]/30 before:rounded-full z-0"
                onClick={() => {
                  const targetProgress = (i + 1) / timeline.length;
                  pinTriggerRef.current?.scroll(targetProgress);
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#000000]/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-lg font-black text-[#000000]">{item.year}</span>
                  </div>
                  <div className="font-bold text-xl line-clamp-1">{item.title}</div>
                </div>
                <p className="text-sm opacity-70 leading-relaxed line-clamp-3 group-hover:line-clamp-none">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2" />
          <div  ref={ctaRef} className="story-cta-card flex flex-col items-center justify-center p-12 rounded-[3rem] bg-gradient-to-r from-[#4B9360] to-[#8EC894] text-white text-center gap-6 shadow-2xl">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-4">
              <Globe size={40} className="text-[#000000]" />
            </div>
            <h3 className="text-3xl font-black uppercase">Ready For the Next Brew?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={primaryCTA.href}
                className="flex items-center gap-3 px-8 py-4 bg-[#000000] text-[#8EC894] rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                {primaryCTA.text}
                <ArrowUpRight size={18} />
              </Link>
              {secondaryCTA && (
                <Link 
                  href={secondaryCTA.href}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-white/20 backdrop-blur-xl text-white font-bold uppercase text-sm rounded-2xl hover:bg-white hover:text-[#4B9360] transition-all"
                >
                  {secondaryCTA.text}
                  <Coffee size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Giant Marquee Ticker */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.04]">
        <div ref={tickerRef} className="flex gap-20 whitespace-nowrap py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-[12rem] md:text-[15rem] font-black uppercase tracking-tighter text-[#000000]">FROM BEAN</span>
              <Coffee size={100} strokeWidth={6} className="text-[#4B9360]" />
              <span className="text-[12rem] md:text-[15rem] font-black uppercase tracking-tighter italic">TO BOLD</span>
              <span className="text-[12rem] md:text-[15rem] font-black uppercase tracking-tighter text-transparent stroke-[#000000] stroke-3" 
                    style={{ WebkitTextStroke: '3px #000000' }}>•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )})
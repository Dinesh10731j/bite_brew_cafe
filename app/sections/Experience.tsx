'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MapPin, Coffee, HeartHandshake, Music, Moon, Sun, ArrowUpRight } from 'lucide-react'
import { useMouseTilt } from '../components/useMouseTilt'
import type { ExperienceProps, ExperienceItem } from '../types/experience'



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
  const experienceHeroRef = useRef<HTMLDivElement>(null)
  const experienceCardRefs = useRef<HTMLDivElement[]>([])
  const tickerRef = useRef<HTMLDivElement>(null)
  const pinTriggerRef = useRef<ScrollTrigger>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const experienceCount = Math.min(experiences.length, 5)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title chars
      const titleChars = sectionRef.current?.querySelectorAll('.experience-char')
      if (titleChars) {
        gsap.from(titleChars, {
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
      }

      // Hero entrance
      gsap.timeline({
        scrollTrigger: {
          trigger: experienceHeroRef.current ?? document.body,
          start: "top 80%",
        }
      }).fromTo(experienceHeroRef.current ?? document.body, 
        { scale: 0.85, opacity: 0, y: 80 },
        { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "expo.out" }
      )

      // Fixed pinning - shorter duration, no scrub/state conflicts
      const pinTrigger = ScrollTrigger.create({
        trigger: experienceHeroRef.current ?? document.body,
        start: "top top",
        end: "+=100vh",
        pin: experienceHeroRef.current ?? document.body,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1
      })
      pinTriggerRef.current = pinTrigger

      // Enhanced scrub timeline: sync activeIndex, morph hero, animate right cards as timeline
      const contentTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: experienceHeroRef.current ?? document.body,
          start: "top top",
          end: "+=100vh",
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.floor(progress * (experiences.length - 1));
            if (newIndex !== activeIndex) {
              setActiveIndex(newIndex);
            }
            // Hero morphs
            gsap.to('.experience-hero-content', {
              rotationY: progress * 5,
              opacity: 1 - progress * 0.1,
              duration: 0.3
            });
            gsap.to('.experience-hero-content h3', {
              scale: 1 + progress * 0.05,
              duration: 0.3
            });
            // Right cards animation
            experienceCardRefs.current.forEach((card, i) => {
              const cardProgress = Math.abs(i / (experiences.length - 1) - progress);
              gsap.to(card ?? {}, {
                scale: 1 - cardProgress * 0.2,
                opacity: 0.6 + 0.4 * (1 - cardProgress),
                boxShadow: cardProgress < 0.3 ? '0 20px 40px rgba(142,200,148,0.4)' : '0 10px 20px rgba(0,0,0,0.1)',
                duration: 0.4
              });
            });
          }
        }
      }).to(".experience-hero-content", {
        scale: 1.05,
        y: -20,
        ease: "none"
      }, 0)


      // Previews
      gsap.from(".preview-experience-card", {
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".preview-experience-grid",
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

      // Shapes
      gsap.to(".experience-bg-shape", {
        y: -100,
        rotation: 45,
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true
        }
      })

    })

    return () => ctx.revert()
  }, [experiences, experienceCount, activeIndex])

  useMouseTilt({ ref: experienceHeroRef })

  const currentExperience = experiences[activeIndex] || experiences[0]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6 bg-gradient-to-b from-[#F8F4EF] to-[#EDE4D9] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="experience-bg-shape absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#8EC894]/15 rounded-full blur-[120px]" />
        <div className="experience-bg-shape absolute bottom-[5%] left-[-10%] w-[35vw] h-[35vw] bg-[#4B9360]/15 rounded-[100px] blur-[100px]" />
        <div className="experience-bg-shape absolute top-1/2 left-1/2 w-[25vw] h-[25vw] bg-[#F5F0E6]/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="experience-header mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#000000] text-[#8EC894] rounded-full text-xs font-bold uppercase tracking-[0.3em]">
            <MapPin size={14} className="fill-[#8EC894]" />
            Feel It
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-[#000000] uppercase tracking-tighter leading-[0.85]">
              {title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-2">
                  {word.split('').map((char, j) => (
                    <span key={j} className="experience-char inline-block">
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

        <div className="experience-container relative grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div ref={experienceHeroRef} className="experience-hero lg:col-span-2 group relative h-[600px] p-12 rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#000000] via-[#1A1A1A] to-[#2D2D2D] text-white shadow-[0_60px_100px_rgba(0,0,0,0.5)] will-change-transform">
            <div className="experience-hero-content relative z-20 h-full flex flex-col justify-between">
              <div className="absolute top-12 right-12 w-20 h-20 bg-[#8EC894]/30 rounded-3xl flex items-center justify-center backdrop-blur-2xl shadow-2xl">
                <Coffee size={32} className="text-[#000000]" strokeWidth={2} />
              </div>
              <div className="relative z-30 pt-16">
                <h3 className="font-black tracking-tight text-4xl md:text-5xl mb-6 uppercase leading-tight">
                  {currentExperience.title}
                </h3>
                <p className="text-xl opacity-95 leading-relaxed max-w-2xl mb-8 text-white drop-shadow-lg">
                  {currentExperience.description}
                </p>
                <div className="text-lg font-medium text-[#8EC894] bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-xl max-w-max">
                  {currentExperience.sensoryDetail}
                </div>
              </div>
              <div className="flex items-center justify-between pt-12 border-t border-white/10">
                <span className="text-6xl font-black opacity-70">Live</span>
                <div className="flex items-center gap-4 text-[#8EC894] font-bold uppercase tracking-wider text-lg">
                  <HeartHandshake size={24} />
                  Feel the Moment
                </div>
              </div>
            </div>
          </div>

          <div className="preview-experience-grid flex lg:flex-col gap-6">
            {experiences.slice(1, experienceCount).map((item, i) => (
              <div 
                key={item.id}
ref={(el) => { if (el) experienceCardRefs.current[i] = el; }}

                className={`preview-experience-card cursor-pointer group relative p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 hover:bg-white/100 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-4 h-56 flex flex-col justify-between relative before:absolute before:left-6 before:top-0 before:w-px before:h-full before:bg-gradient-to-b before:from-[#8EC894]/50 before:to-[#4B9360]/30 before:rounded-full z-0 ${i + 1 === activeIndex ? 'ring-4 ring-[#8EC894]/60 bg-white shadow-3xl ring-offset-4 ring-offset-gradient scale-105' : ''}`}
                onClick={() => {
                  const targetProgress = (i + 1) / experiences.length;
                  pinTriggerRef.current?.scroll(targetProgress);
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EC894] to-[#4B9360] rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Coffee size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-bold text-xl line-clamp-1 group-hover:line-clamp-none">{item.title}</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm opacity-80 leading-relaxed line-clamp-3 group-hover:line-clamp-none mb-3">
                    {item.description}
                  </p>
                  <span className="text-xs font-medium text-[#8EC894] bg-[#F5F0E6]/50 px-3 py-1 rounded-full">
                    {item.sensoryDetail.split(' • ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2" />
          <div className="experience-cta-card flex flex-col items-center justify-center p-12 rounded-[3rem] bg-gradient-to-r from-[#4B9360] via-[#8EC894] to-[#A8D5B9] text-[#000000] text-center gap-6 shadow-3xl">
            <div className="w-24 h-24 bg-white/30 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <HeartHandshake size={40} className="text-[#000000]" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Your Moment Awaits</h3>
            <p className="text-lg opacity-95 max-w-md leading-relaxed">Come live what words can only whisper</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link 
                href={primaryCTA.href}
                className="flex items-center justify-center gap-3 flex-1 px-6 py-4 bg-[#000000] text-[#8EC894] rounded-2xl font-black uppercase text-sm tracking-wide hover:scale-[1.02] transition-all shadow-2xl hover:shadow-3xl hover:bg-[#8EC894] hover:text-[#000000]"
              >
                {primaryCTA.text}
                <ArrowUpRight size={18} />
              </Link>
              {secondaryCTA && (
                <Link 
                  href={secondaryCTA.href}
                  className="flex items-center justify-center gap-2 flex-1 px-6 py-4 border-2 border-white/30 bg-white/20 backdrop-blur-xl text-white font-bold uppercase text-sm rounded-2xl hover:bg-white hover:text-[#4B9360] transition-all shadow-xl hover:shadow-2xl"
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.06]">
        <div ref={tickerRef} className="flex gap-20 whitespace-nowrap py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-20">
              <span className="text-[12rem] md:text-[15rem] font-black uppercase tracking-tighter text-[#000000]">SAVOR</span>
              <Coffee size={100} strokeWidth={6} className="text-[#4B9360] flex-shrink-0" />
              <span className="text-[12rem] md:text-[15rem] font-black uppercase tracking-tighter text-[#000000]">• SIP •</span>
              <span className="text-[12rem] md:text-[15rem] font-black uppercase tracking-tighter text-transparent bg-gradient-to-r from-[#8EC894] to-[#4B9360] bg-clip-text">STAY</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


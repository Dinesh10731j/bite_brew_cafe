'use client';

import { sampleTeam, type TeamMember } from '../types/team';
import { gsap } from '../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { User, Heart, Zap, Coffee } from 'lucide-react';
import { useMouseTilt } from '../components/useMouseTilt';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TeamCard = ({ member }: { member: TeamMember }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: cardRef });

  return (
    <div ref={cardRef} className="team-item group/card perspective-1000">
      {/* CARD BODY: 
          - bg-black: Pure black background
          - border-white/10: Subtle border so it doesn't disappear
          - hover:shadow: Teal glow on hover 
      */}
      <div className="relative bg-black rounded-[2.5rem] p-8 border border-white/10 shadow-2xl transition-all duration-500 will-change-transform hover:border-[#1A5A46] hover:shadow-[0_20px_80px_rgba(26,90,70,0.35)]">
        
        {/* Role Badge */}
        <div className="absolute top-6 right-6 z-10">
          <span className="text-[10px] font-black text-white bg-[#1A5A46] px-4 py-2 rounded-xl uppercase tracking-[0.2em] border border-white/5">
            {member.role}
          </span>
        </div>

        {/* Profile Image/Graphic Area */}
        <div className="w-full h-48 bg-neutral-900 rounded-3xl flex items-center justify-center mb-8 overflow-hidden relative border border-white/5">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] " />
          <div className="text-[#1A5A46] group-hover/card:scale-110 group-hover/card:text-white transition-all duration-700 ease-out relative z-10">
            <User size={70} strokeWidth={1.5} />
          </div>
          {/* Internal Radial Glow */}
          <div className="absolute -bottom-10 w-32 h-32 bg-[#1A5A46] opacity-20 blur-[50px] group-hover/card:opacity-40 transition-opacity" />
        </div>

        <div className="space-y-4">
          {/* Name in White */}
          <h4 className="text-3xl font-black text-white tracking-tight group-hover/card:text-[#1A5A46] transition-colors">
            {member.name}
          </h4>
          
          {/* Bio in Muted Gray/White */}
          <p className="text-white/50 leading-relaxed font-medium text-sm line-clamp-3 mb-6">
            {member.bio}
          </p>
          
          {/* Footer with Teal Icons */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <div className="flex gap-3">
              <Heart size={18} className="text-[#1A5A46] hover:fill-[#1A5A46] transition-all cursor-pointer" />
              <Zap size={18} className="text-[#1A5A46] fill-current" />
              <Coffee size={18} className="text-[#1A5A46]" />
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-auto">
              View Story
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OurTeamSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".team-item", 
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="meet-the-team" className="py-24 px-6 max-w-7xl mx-auto" ref={containerRef}>
      {/* Header Section remains Clean/Light for Contrast */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-black/5 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A5A46]/10 text-[#1A5A46] rounded-lg font-black text-xs uppercase tracking-tighter mb-4">
             <Zap size={14} className="fill-current" /> Meet the Makers
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-black uppercase leading-[0.8] tracking-tighter">
            THE <br /><span className="text-[#1A5A46]">CREW.</span>
          </h2>
        </div>
        <p className="text-lg text-black/60 max-w-sm font-medium leading-tight">
          A collective of artisans dedicated to the science and soul of the perfect brew.
        </p>
      </div>

      {/* Black Card Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleTeam.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
};

export default OurTeamSection;
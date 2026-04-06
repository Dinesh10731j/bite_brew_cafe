'use client';

import { useEffect, useRef, useState } from 'react';
import { CreativeHero } from '../sections/Hero';
import CTA from '../sections/CTA';
import { sampleTeam, type TeamMember } from '../types/team';
import { gsap } from '../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Heart, Zap, Coffee, Sparkles } from 'lucide-react';
import { useMouseTilt } from '../components/useMouseTilt';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom SVG Components for Socials
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TeamCard = ({ member }: { member: TeamMember }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: cardRef });

  return (
    <div ref={cardRef} className="team-item group perspective-1000">
      {/* Updated to Black Background with White/Teal Text */}
      <div className="relative bg-black rounded-[2.5rem] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_40px_100px_rgba(26,90,70,0.3)] transition-all duration-500 will-change-transform hover:border-[#1A5A46]/50">
        
        {/* Profile Image Placeholder / Graphic */}
        <div className="w-full h-64 bg-neutral-900 rounded-3xl flex items-center justify-center mb-8 overflow-hidden relative border border-white/5">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <User size={80} className="text-[#1A5A46] group-hover:scale-110 transition-transform duration-700 ease-out opacity-80" />
          
          {/* Social Overlays */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
            <a 
              href="#" 
              aria-label="Instagram"
              className="p-3 bg-[#1A5A46] rounded-xl shadow-lg text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <InstagramIcon size={18} />
            </a>
            <a 
              href="#" 
              aria-label="Facebook"
              className="p-3 bg-[#1A5A46] rounded-xl shadow-lg text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <FacebookIcon size={18} />
            </a>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A5A46]">
            {member.role}
          </span>
          <h4 className="text-3xl font-black text-white tracking-tight">
            {member.name}
          </h4>
          <p className="text-gray-400 leading-relaxed font-medium text-sm line-clamp-3">
            {member.bio}
          </p>
          
          <div className="pt-6 flex justify-center gap-4 border-t border-white/10">
             <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#1A5A46]">
               <Heart size={12} fill="currentColor" /> {member.bio|| 'Master Artisan'}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'Master Roaster' | 'Head Barista'>('all');

  const filteredTeam = activeTab === 'all' 
    ? sampleTeam 
    : sampleTeam.filter(member => member.role === activeTab);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".team-item", 
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }
      );

      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".team-char-interactive");
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          const distX = e.clientX - charX;
          const distY = e.clientY - charY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 150) {
            gsap.to(char, {
              x: distX * 0.4, y: distY * 0.4, scale: 1.4, rotate: distX * 0.1,
              duration: 0.4, ease: "power2.out"
            });
          } else {
            gsap.to(char, {
              x: 0, y: 0, scale: 1, rotate: 0,
              duration: 0.6, ease: "elastic.out(1, 0.3)"
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  const interactiveTitle = (
    <span className="flex flex-wrap justify-start">
      {"TEAM".split("").map((char, i) => (
        <span 
          key={i} 
          className="team-char-interactive inline-block will-change-transform"
        >
          {char}
        </span>
      ))}
    </span>
  );

  return (
    <div className="bg-[#F5F0E6] min-h-screen" ref={containerRef}>
      <CreativeHero
        tagline="Meet the Artisans"
        title={interactiveTitle as any}
        description="The passionate souls crafting your daily ritual with precision, heart, and a touch of revolution."
        ctas={[{ href: '#team-grid', text: 'Meet The Team' }]}
      />

      <section id="team-grid" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {[
            { id: 'all', label: 'The Whole Crew', icon: <Heart size={18}/> },
            { id: 'Master Roaster', label: 'Roasters', icon: <Coffee size={18}/> },
            { id: 'Head Barista', label: 'Baristas', icon: <Zap size={18}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-black text-[#8EC894] shadow-[0_20px_40px_rgba(0,0,0,0.2)] -translate-y-1' 
                  : 'bg-white text-black/40 hover:text-black hover:bg-white/80'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTeam.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto bg-black rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1A5A46] opacity-20 blur-[120px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#8EC894] text-black rounded-full font-black text-xs uppercase mb-6">
                <Sparkles size={14} fill="currentColor" /> Lead Visionary
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white leading-none uppercase mb-8 italic">
                CRAFT <br/><span className="text-[#8EC894]">OVER</span> <br/>COMFORT.
              </h2>
              <p className="text-white/60 text-xl max-w-md mb-10 leading-relaxed">
                "Our mission isn't just to serve coffee; it's to honor the hands that grew the beans and the people who drink the brew."
              </p>
              <div className="flex gap-4">
                <div className="text-white">
                   <p className="font-black text-2xl">Bite & Brew</p>
                   <p className="text-[#8EC894] uppercase tracking-widest text-xs font-bold">Est. 2024</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gradient-to-tr from-[#1A5A46] to-[#207659] flex items-center justify-center border border-white/10">
               <User size={180} className="text-white/20" />
               <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
        </div>
      </section>

      <CTA 
        title="Ready to taste the craft?"
        subtitle="Our team is ready to brew your perfect cup."
        primaryCTA={{ href: '/menu', text: 'Explore Menu' }}
        secondaryCTA={{ href: '/gallery', text: 'View Gallery' }}
      />
    </div>
  );
};

export default TeamPage;
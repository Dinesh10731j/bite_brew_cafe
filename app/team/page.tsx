'use client';

import { useEffect, useRef, useState } from 'react';
import { CreativeHero } from '../sections/Hero';
import CTA from '../sections/CTA';
import { type TeamMember } from '../types/team';
import { fetchStaff } from '../features/team/api';
import { gsap } from '../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Heart, Sparkles } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);

  return (
    <div ref={cardRef} className="team-item group perspective-1000">
      {/* Updated to Black Background with White/Teal Text */}
      <div className="relative bg-black rounded-[2.5rem] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_40px_100px_rgba(26,90,70,0.3)] transition-all duration-500 will-change-transform hover:border-[#1A5A46]/50">
        
        {/* Profile Image */}
        <div className="w-full h-64 bg-neutral-900 rounded-3xl flex items-center justify-center mb-8 overflow-hidden relative border border-white/5">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          {member.image && !imageError ? (
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImageError(true)}
            />
          ) : (
            <User size={80} className="text-[#1A5A46] group-hover:scale-110 transition-transform duration-700 ease-out opacity-80" />
          )}
          
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
               <Heart size={12} fill="currentColor" /> {member.role || 'Master Artisan'}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton component for loading state
const TeamSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="relative bg-black/80 rounded-[2.5rem] p-8 border border-white/5">
          {/* Profile Image Placeholder */}
          <div className="w-full h-64 bg-neutral-800 rounded-3xl mb-8 overflow-hidden">
            <div className="w-full h-full bg-neutral-700/50" />
          </div>
          <div className="space-y-3 text-center">
            {/* Role Badge Placeholder */}
            <div className="flex justify-center">
              <div className="h-3 w-20 bg-neutral-700 rounded-full" />
            </div>
            {/* Name Placeholder */}
            <div className="flex justify-center">
              <div className="h-7 w-40 bg-neutral-700 rounded-lg" />
            </div>
            {/* Bio Lines Placeholder */}
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-neutral-700/60 rounded" />
              <div className="h-3 w-3/4 bg-neutral-700/60 rounded mx-auto" />
            </div>
            {/* Footer Placeholder */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex justify-center gap-4">
                <div className="h-8 w-8 bg-neutral-700 rounded-xl" />
                <div className="h-8 w-8 bg-neutral-700 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const TeamPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [staff, setStaff] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        const data = await fetchStaff();
        setStaff(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load staff:', err);
        setError(err instanceof Error ? err.message : 'Failed to load team');
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  useEffect(() => {
    if (loading) return;

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
  }, [loading]);

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
        {loading ? (
          <TeamSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {staff.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
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
'use client';

import { useState, useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { CreativeHero } from "../sections/Hero";
import { useMouseTilt } from "../components/useMouseTilt";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send,
} from "lucide-react";
import CTA from '../sections/CTA';

const ContactItem = ({ item }: { item: any }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  useMouseTilt({ ref: itemRef });

  const Icon = item.icon || MapPin;

  return (
    <div 
      ref={itemRef}
      className="contact-item break-inside-avoid group relative rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl hover:shadow-[0_20px_80px_rgba(26,90,70,0.3)] transition-all duration-500 will-change-transform mb-6 p-8 h-full flex flex-col justify-center hover:border-[#1A5A46]/50"
    >
      <div className="flex items-center gap-6">
        {/* Icon Container: Subtle Teal border, turns solid Teal on hover */}
        <div className="p-5 bg-[#1A5A46]/10 rounded-2xl border border-[#1A5A46]/20 flex-shrink-0 group-hover:bg-[#1A5A46] transition-colors duration-500">
          <Icon className="w-10 h-10 text-[#1A5A46] group-hover:text-white transition-colors duration-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Category Badge: Teal Accent */}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A5A46] mb-1 block">
            {item.category || 'Reach Out'}
          </span>
          
          {/* Title: Pure White */}
          <h4 className="text-2xl font-black tracking-tight text-white mb-1 group-hover:text-[#1A5A46] transition-colors duration-300">
            {item.title}
          </h4>
          
          {/* Description: Muted White */}
          <p className="text-lg text-white/50 leading-tight font-medium">
            {item.desc}
          </p>
        </div>
      </div>
      
      {/* Background radial glow on hover */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#1A5A46] opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500" />
    </div>
  );
};

export default function ContactPage() {
  const contactItems = [
    { id: 1, title: 'Lambagar, Nepal', desc: 'Visit our Roastery', icon: MapPin, category: 'Location' },
    { id: 2, title: '+977 98XXXXXXXX', desc: 'Call or WhatsApp', icon: Phone, category: 'Mobile' },
    { id: 3, title: 'hello@bitebrew.com', desc: 'Drop an email', icon: Mail, category: 'Email' },
    { id: 4, title: '7:00 AM - 9:00 PM', desc: 'Open Daily', icon: Clock, category: 'Hours' },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  const interactiveTitle = (
    <span className="flex flex-nowrap justify-start whitespace-nowrap">
      {"CONTACT".split("").map((char, i) => (
        <span 
          key={i} 
          className="contact-char-interactive inline-block will-change-transform"
        >
          {char}
        </span>
      ))}
    </span>
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".contact-char-interactive");
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          const distX = e.clientX - charX;
          const distY = e.clientY - charY;
          const distance = Math.hypot(distX, distY);

          if (distance < 150) {
            gsap.to(char, {
              x: distX * 0.4,
              y: distY * 0.4,
              scale: 1.4,
              rotate: distX * 0.1,
              duration: 0.4,
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
  }, []);

  return (
    <main className="bg-[#F5F0E6] min-h-screen overflow-x-hidden" ref={containerRef}>
      <CreativeHero
        tagline="Connect With Us"
        title={interactiveTitle as any}
        description="Ready to brew something amazing together? Whether it's collaborations, events, or your next caffeine fix, we're here."
        ctas={[{ href: '#connect', text: 'Get In Touch' }]}
      />

      <section id="connect" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactItems.map((item) => (
            <ContactItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Form Section: Solid Black with Teal Inputs */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto bg-black rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1A5A46] opacity-20 blur-[120px]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#1A5A46] text-white rounded-full font-black text-xs uppercase mb-6">
              <MessageSquare size={14} fill="currentColor" /> Direct Line
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-none uppercase mb-8 italic">
              LET'S <br/><span className="text-[#1A5A46]">BREW.</span>
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/30 font-bold text-lg focus:outline-none focus:border-[#1A5A46] focus:bg-white/10 transition-all" 
                />
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/30 font-bold text-lg focus:outline-none focus:border-[#1A5A46] focus:bg-white/10 transition-all" 
                />
              </div>
              <div>
                <textarea 
                  placeholder="Your Message" 
                  rows={4} 
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-white/30 font-bold text-lg focus:outline-none focus:border-[#1A5A46] focus:bg-white/10 transition-all resize-none" 
                />
              </div>
              <button 
                type="submit" 
                className="px-12 py-6 bg-[#1A5A46] text-white font-black uppercase rounded-3xl hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-3"
              >
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <CTA 
        title="The Brew Awaits"
        subtitle="Nothing beats experiencing the revolution firsthand with a perfect pour."
        primaryCTA={{ href: '/menu', text: 'Explore Menu' }}
        secondaryCTA={{ href: '/gallery', text: 'View Gallery' }}
      />
    </main>
  );
}
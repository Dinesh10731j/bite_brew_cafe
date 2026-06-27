'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, ChevronUp } from 'lucide-react';
import { gsap } from '../lib/gsap';

// --- Brand Icons ---
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.482h2.039L6.486 3.24H4.298l13.311 17.395z" />
  </svg>
);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Magnetic Effect
      const brand = brandRef.current;
      if (brand) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = brand.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          gsap.to(brand, { x: x * 0.1, y: y * 0.1, duration: 0.4 });
        };
        const handleMouseLeave = () => {
          gsap.to(brand, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        };
        brand.addEventListener("mousemove", handleMouseMove);
        brand.addEventListener("mouseleave", handleMouseLeave);
      }

      gsap.from(".footer-stagger", {
        scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power2.out"
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer ref={footerRef} className="relative bg-white text-[#0a2920] pt-24 pb-12 overflow-hidden border-t-2 border-[#d3c7b8] shadow-[0_-20px_80px_-40px_rgba(0,0,0,0.08)]">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* TOP SECTION: Branding & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
          
          <div className="lg:col-span-5 footer-stagger">
            <div ref={brandRef} className="inline-block cursor-pointer mb-6 group">
              <h2 className="text-5xl font-black tracking-tighter italic leading-none">
                BITE AND <span className="text-[#207659]">.</span>BREW
              </h2>
            </div>
            <p className="text-lg text-[#0a2920]/70 leading-relaxed max-w-sm mb-8 font-medium">
              Elevating the everyday coffee ritual through artisan craft and a high-octane community.
            </p>
            <div className="flex gap-4">
              {[<InstagramIcon key="i" />, <FacebookIcon key="f" />, <TwitterXIcon key="t" />].map((icon, idx) => (
                <button key={idx} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#207659] hover:text-white hover:border-[#207659] transition-all duration-300">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 footer-stagger">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#207659] mb-8">Quick Links</h3>
            <ul className="space-y-4">
              {['Menu', 'Gallery', 'Our Story', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-lg font-bold hover:text-[#207659] transition-colors flex items-center group">
                    <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 footer-stagger">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#207659] mb-8">Find Us</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin size={20} className="text-[#207659] shrink-0" />
                <p className="font-bold text-sm">Lambagar, Kathmandu, Nepal 44600</p>
              </div>
              <div className="flex gap-4">
                <Clock size={20} className="text-[#207659] shrink-0" />
                <p className="font-bold text-sm">Daily: 07:00 — 22:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: The "Floating" Integrated Newsletter */}
        <div className="footer-stagger py-12 border-y border-black/5 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <h4 className="text-2xl font-black tracking-tighter mb-2 italic">JOIN THE ROASTERY.</h4>
              <p className="text-sm font-medium text-[#0a2920]/60">Get notified about limited edition beans and secret events.</p>
            </div>
            
            <form className="flex-1 max-w-lg relative group">
              <div className={`relative flex items-center transition-all duration-500 border-b-2 ${isEmailFocused ? 'border-[#207659]' : 'border-black/10'}`}>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="bg-transparent w-full py-4 px-2 outline-none font-black text-xl placeholder:text-black/10 uppercase tracking-tighter"
                />
                <button className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] group-hover:text-[#207659] transition-colors">
                  Subscribe <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <button onClick={scrollToTop} className="group p-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
              <ChevronUp size={20} />
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
              © 2026 Java Brew & Bite • Design by <a href='https://codynexnepal.netlify.app/' className="hover:text-[#207659] transition-colors">CodyneX</a>
            </p>
          </div>
          
          <div className="flex gap-10">
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-[#207659] transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
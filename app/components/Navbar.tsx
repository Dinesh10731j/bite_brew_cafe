'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cafe_logo from '../../public/bite_brew_logo.jpeg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <>
      <div className="fixed top-0 w-full z-50 flex justify-center p-4 transition-all duration-500">
        <nav 
          className={`
            flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
            ${isScrolled 
              ? 'w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(32,118,89,0.1)]' 
              : 'w-full max-w-7xl bg-transparent'
            }
          `}
        >
          {/* Brand/Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-full p-0.5 bg-gradient-to-tr from-[#207659] to-[#1a5a46]">
              <div className="bg-white rounded-full p-0.5">
                <Image 
                  src={cafe_logo} 
                  alt="Logo" 
                  width={38} 
                  height={38} 
                  className="rounded-full group-hover:rotate-[360deg] transition-transform duration-1000"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-none tracking-tighter text-[#1a5a46]">
                BITE<span className="text-[#207659]">&</span>BREW
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#207659]/60">
                Cafe & Roastery
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8 mr-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="relative text-xs font-bold uppercase tracking-widest text-[#1a5a46] hover:text-[#207659] transition-colors group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#207659] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Contact Button */}
            <Link 
              href="/contact" 
              className="px-6 py-2.5 bg-[#1a5a46] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#207659] hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 items-center rounded-full bg-white/80 backdrop-blur-md shadow-sm z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-[#1a5a46] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#1a5a46] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#1a5a46] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 z-[55] md:hidden transition-all duration-700 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Dark Backdrop */}
        <div className="absolute inset-0 bg-[#0a2920]/95 backdrop-blur-2xl" onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Menu Items */}
        <div className="relative h-full flex flex-col items-center justify-center gap-6">
          {navLinks.map((link, i) => (
            <Link 
              key={link.name} 
              href={link.href} 
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`
                text-4xl font-black uppercase tracking-tighter text-white transition-all duration-500
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                hover:text-[#8EC894] hover:italic
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Contact Link */}
          <Link 
            href="/contact"
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
            className={`
               mt-4 px-10 py-4 bg-[#8EC894] text-[#0a2920] font-black uppercase tracking-widest rounded-xl transition-all duration-500
               ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            `}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get in Touch
          </Link>
          
          <div className="mt-8 h-px w-12 bg-[#8EC894]/30" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8EC894]/50">
            Lambagar, Nepal
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
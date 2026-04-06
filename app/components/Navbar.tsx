'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cafe_logo from '../../public/bite_brew_logo.jpeg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for a more dynamic "modern" feel
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
     { name: 'Home', href: '/' },
     { name: 'Menu', href: '/menu' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <div className="fixed top-0 w-full z-100 flex justify-center p-4 transition-all duration-500">
      <nav 
        className={`
          flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
          ${isScrolled 
            ? 'w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(32,118,89,0.1)]' 
            : 'w-full max-w-7xl bg-transparent'
          }
        `}
      >
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-full p-0.5 bg-linear-to-tr from-[#207659] to-[#1a5a46]">
            <div className="bg-white rounded-full p-0.5">
              <Image 
                src={cafe_logo} 
                alt="Logo" 
                width={38} 
                height={38} 
                className="rounded-full group-hover:rotate-360 transition-transform duration-700"
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

        {/* Desktop Links - Minimalist dot separator */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Action Button */}
        <Link 
          href="#contact" 
          className="relative overflow-hidden px-7 py-3 rounded-full font-bold text-xs uppercase tracking-tighter text-white group shadow-md"
        >
          <span className="absolute inset-0 bg-linear-to-r from-[#207659] to-[#1a5a46] group-hover:scale-105 transition-transform duration-300" />
          <span className="relative z-10">Reserve Table</span>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
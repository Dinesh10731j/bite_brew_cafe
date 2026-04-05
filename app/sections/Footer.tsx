'use client';

import Link from 'next/link';
import Image from 'next/image';
import cafe_logo from '../../public/bite_brew_logo.jpeg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#fafaf9] pt-24 pb-12 overflow-hidden">
      {/* Decorative Background Gradient Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-[#207659]/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Brand Column (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <Image 
                src={cafe_logo} 
                alt="Bite & Brew" 
                width={50} 
                height={50} 
                className="rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xl"
              />
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-[#1a5a46]">
                  BITE<span className="text-[#207659]">&</span>BREW
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#207659]/50">
                  The Art of Roasting
                </p>
              </div>
            </Link>
            
            <p className="text-zinc-500 text-lg leading-relaxed max-w-md italic">
              "Crafting moments of clarity in every cup. Join us for a unique 
              sensory experience where nature meets the bean."
            </p>

            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-linear-to-r from-[#207659] to-[#1a5a46] text-white shadow-lg hover:shadow-[#207659]/20 hover:-translate-y-1 transition-all duration-300">
                Get Directions
              </button>
            </div>
          </div>

          {/* Quick Links (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[#1a5a46] text-xs font-black uppercase tracking-[0.3em]">Explore</h4>
            <ul className="grid grid-cols-1 gap-4">
              {['Experience', 'Menu', 'Story', 'Gallery', 'Testimonials'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    className="text-zinc-600 hover:text-[#207659] font-medium transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-0 h-px bg-[#207659] group-hover:w-4 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours (Span 4) */}
          <div className="lg:col-span-4 space-y-8 bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-[#207659]/5 shadow-sm">
            <div className="space-y-2">
              <h4 className="text-[#1a5a46] text-xs font-black uppercase tracking-[0.3em]">Hours</h4>
              <p className="text-[#207659] font-bold text-sm">Mon — Sun: 07:00 AM - 09:00 PM</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-[#1a5a46] text-xs font-black uppercase tracking-[0.3em]">Contact</h4>
              <p className="text-zinc-600 text-sm font-medium">Kathmandu, Nepal</p>
              <p className="text-zinc-400 text-sm">hello@bitebrew.cafe</p>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-[#207659]/5">
               {['Instagram', 'Facebook', 'Twitter'].map(social => (
                 <span key={social} className="text-[10px] font-black uppercase tracking-widest text-[#207659] hover:opacity-50 cursor-pointer transition-opacity">
                   {social}
                 </span>
               ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          <p>© {currentYear} Bite & Brew Cafe — All Rights Reserved</p>
          <div className="flex items-center gap-8">
             <Link href="/privacy" className="hover:text-[#207659]">Privacy</Link>
             <Link href="/terms" className="hover:text-[#207659]">Terms</Link>
             <span className="text-[#207659]">Handcrafted by Bite & Brew Cafe </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
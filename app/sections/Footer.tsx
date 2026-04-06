'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock} from 'lucide-react';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const links = [
    { name: 'Menu', href: '#menu' },
    { name: 'Reserve', href: '#contact' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Careers', href: '#careers' },
  ];

  const contact = [
    { icon: MapPin, label: 'Lambagar, Kathmandu', href: '#' },
    { icon: Phone, label: '(555) 123-4567', href: 'tel:5551234567' },
    { icon: Mail, label: 'hello@javabitebrewing.com', href: 'mailto:hello@javabitebrewing.com' },
    { icon: Clock, label: 'Daily 7am - 9pm', href: '#' },
  ];

  

  return (
    <footer className="relative bg-white text-[#0a2920]">
      {/* Decorative top border */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-[#207659] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
                JAVA<span className="text-[#207659]">&</span>BITE
              </h2>
              <p className="text-[#207659] text-xs font-bold uppercase tracking-widest mt-2">
                Premium Cafe & Roastery
              </p>
            </div>
            <p className="text-sm text-[#0a2920]/70 leading-relaxed mb-6">
              Crafting exceptional coffee experiences since 2018. Every cup tells a story of quality and passion.
            </p>
            
            
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#207659] mb-6">
              Explore
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="
                      relative text-sm text-[#0a2920]/70 hover:text-[#207659] transition-all duration-300
                      group inline-flex items-center gap-2
                    "
                  >
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#207659] transition-all duration-300 ${
                      hoveredLink === link.name ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#207659] mb-6">
              Visit Us
            </h3>
            <ul className="space-y-4">
              {contact.map(({ icon: Icon, label, href }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    onMouseEnter={() => setHoveredLink(`contact-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group flex items-start gap-3 transition-all duration-300"
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                      ${hoveredLink === `contact-${idx}`
                        ? 'bg-[#207659] text-white scale-110'
                        : 'bg-[#207659]/10 text-[#207659]'
                      }
                    `}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-[#0a2920]/70 group-hover:text-[#207659] transition-colors duration-300 mt-0.5">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#207659] mb-6">
              Stay Updated
            </h3>
            <p className="text-sm text-[#0a2920]/70 mb-4">
              Get exclusive offers and new menu launches.
            </p>
            <div className={`
              relative flex items-center rounded-lg transition-all duration-300 overflow-hidden
              ${isEmailFocused
                ? 'border border-[#207659] bg-[#207659]/5 shadow-md shadow-[#207659]/20'
                : 'border border-[#207659]/20 bg-white hover:border-[#207659]/40'
              }
            `}>
              <Mail className={`
                w-4 h-4 ml-3 transition-all duration-300
                ${isEmailFocused ? 'text-[#207659]' : 'text-[#0a2920]/40'}
              `} />
              <input
                type="email"
                placeholder="your@email.com"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="
                  flex-1 px-3 py-3 bg-transparent outline-none text-sm
                  placeholder-[#0a2920]/30 text-[#0a2920]
                "
              />
              <button className={`
                px-3 py-3 transition-all duration-300
                ${isEmailFocused
                  ? 'text-[#207659]'
                  : 'text-[#0a2920]/50 hover:text-[#207659]'
                }
              `}>
                →
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#207659]/20 mb-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#0a2920]/60">
          <span>© 2024 Java Brew & Bite. All rights reserved.</span>
          <div className="flex gap-6">
            <Link
              href="#"
              onMouseEnter={() => setHoveredLink('privacy')}
              onMouseLeave={() => setHoveredLink(null)}
              className={`transition-colors duration-300 ${
                hoveredLink === 'privacy' ? 'text-[#207659]' : 'hover:text-[#207659]'
              }`}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              onMouseEnter={() => setHoveredLink('terms')}
              onMouseLeave={() => setHoveredLink(null)}
              className={`transition-colors duration-300 ${
                hoveredLink === 'terms' ? 'text-[#207659]' : 'hover:text-[#207659]'
              }`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import cafe_logo from "../../public/bite_brew_logo.jpeg";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout, type AuthUser } from "@/app/store/slices/authSlice";
import { authApi } from "@/app/features/auth/api";
import CartSidebar from "@/app/components/CartSidebar";

const getDisplayName = (user: AuthUser | null): string => {
  if (!user) return "Guest";
  if (user.name?.trim()) return user.name.trim();
  if (user.fullName?.trim()) return user.fullName.trim();
  if (user.firstName || user.lastName) {
    return [user.firstName?.trim(), user.lastName?.trim()].filter(Boolean).join(" ");
  }
  if (user.username?.trim()) return user.username.trim();
  if (user.email?.trim()) return user.email.split("@")[0];
  return "Guest";
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const displayName = useMemo(() => getDisplayName(user), [user]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    }
    if (hour < 18) {
      return "Good afternoon";
    }
    return "Good evening";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Team", href: "/team" },
    { name: "Gallery", href: "/gallery" },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 flex justify-center p-4 transition-all duration-500">
        <nav
          className={`
            flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
            ${isScrolled
              ? "w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(32,118,89,0.1)]"
              : "w-full max-w-7xl bg-transparent"
            }
          `}
        >
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

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold text-[#1a5a46] whitespace-nowrap">
                  {greeting}, {displayName}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-[#1a5a46] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#207659] hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2 border border-[#1a5a46] text-[#1a5a46] text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#1a5a46] hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-[#1a5a46] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#207659] hover:shadow-lg transition-all duration-300"
                >
                  Signup
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full border border-[#1a5a46]/20 bg-white flex items-center justify-center text-[#1a5a46] hover:bg-[#1a5a46] hover:text-white transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#1a5a46] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-[#1a5a46]"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#1a5a46] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="flex flex-col justify-center gap-1.5 w-10 h-10 items-center rounded-full bg-white/80 backdrop-blur-md shadow-sm z-[60]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-[#1a5a46] transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1a5a46] transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1a5a46] transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`
          fixed inset-0 z-[55] md:hidden transition-all duration-700 ease-in-out
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="absolute inset-0 bg-[#0a2920]/95 backdrop-blur-2xl" onClick={() => setIsMobileMenuOpen(false)} />

        <div className="relative h-full flex flex-col items-center justify-center gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`
                text-4xl font-black uppercase tracking-tighter text-white transition-all duration-500
                ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
                hover:text-[#8EC894] hover:italic
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <p
                style={{ transitionDelay: `${navLinks.length * 100}ms` }}
                className={`text-sm font-semibold text-[#8EC894] ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} transition-all duration-500`}
              >
                {greeting}, {displayName}
              </p>
              <button
                type="button"
                style={{ transitionDelay: `${(navLinks.length + 1) * 100}ms` }}
                className={`
                  mt-2 px-10 py-4 bg-[#8EC894] text-[#0a2920] font-black uppercase tracking-widest rounded-xl transition-all duration-500
                  ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
                `}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 mt-4">
              <Link
                href="/login"
                className="px-6 py-3 border border-[#8EC894] text-[#8EC894] font-black uppercase tracking-widest rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 bg-[#8EC894] text-[#0a2920] font-black uppercase tracking-widest rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Signup
              </Link>
            </div>
          )}

          <div className="mt-8 h-px w-12 bg-[#8EC894]/30" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8EC894]/50">
            Lambagar, Nepal
          </p>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;

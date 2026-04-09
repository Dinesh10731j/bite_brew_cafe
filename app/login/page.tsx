"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "../lib/gsap";
import { authApi } from "@/app/features/auth/api";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { loginFailure, loginStart, loginSuccess, setCurrentUser } from "@/app/store/slices/authSlice";
import { Coffee, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive Title Effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".login-char-interactive");
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const distance = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
          if (distance < 100) {
            gsap.to(char, { 
              x: (e.clientX - (rect.left + rect.width / 2)) * 0.3, 
              y: (e.clientY - (rect.top + rect.height / 2)) * 0.3, 
              scale: 1.2, 
              duration: 0.4 
            });
          } else {
            gsap.to(char, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
          }
        });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    if (!email || !password) return setLocalError("Fields cannot be empty.");
    
    dispatch(loginStart());
    try {
      const result = await authApi.login({ email, password });
      let resolvedUser = result.user;
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) resolvedUser = currentUser;
      } catch {}
      dispatch(loginSuccess({ user: resolvedUser, token: result.token }));
      if (resolvedUser) dispatch(setCurrentUser(resolvedUser));
      router.push("/menu");
    } catch (submitError) {
      dispatch(loginFailure((submitError as Error).message));
    }
  };

  return (
    <main className="bg-[#F5F0E6] min-h-screen flex items-center justify-center p-6" ref={containerRef}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#207659]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#1a5a46]/10 blur-[120px] rounded-full" />
      </div>

      <section className="relative mt-20  w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-black/5">
        
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#0a2920] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#8EC894] rounded-2xl flex items-center justify-center mb-8 rotate-12">
              <Coffee className="text-[#0a2920]" size={24} />
            </div>
            <h2 className="text-6xl font-black uppercase italic leading-none tracking-tighter">
              Welcome <br /> <span className="text-[#8EC894]">Back.</span>
            </h2>
            <p className="mt-6 text-white/60 max-w-xs font-medium uppercase tracking-widest text-[10px]">
              Access your curated coffee experience and manage your orders.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a2920] bg-[#207659]" />
                ))}
             </div>
             <p className="text-[10px] font-black uppercase tracking-tighter">Joined by 2k+ members</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-5xl font-black text-[#0a2920] flex gap-1 lowercase italic">
              {"LOGIN".split("").map((char, i) => (
                <span key={i} className="login-char-interactive inline-block">{char}</span>
              ))}
            </h1>
            <p className="text-black/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
              Please enter your credentials
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F0E6]/50 border border-black/5 rounded-2xl px-12 py-4 focus:bg-white focus:ring-2 ring-[#207659]/20 outline-none transition-all font-bold italic"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5F0E6]/50 border border-black/5 rounded-2xl px-12 py-4 focus:bg-white focus:ring-2 ring-[#207659]/20 outline-none transition-all font-bold italic"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {(localError || error) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                <p className="text-xs font-black text-red-600 uppercase tracking-tighter">{localError ?? error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-[#0a2920] py-5 transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase text-sm tracking-tighter">
                {loading ? "Authenticating..." : "Sign Into Account"}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </div>
              <div className="absolute inset-0 bg-[#207659] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-black/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/signup" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#207659] transition-colors">
              Create Account
            </Link>
            <Link href="/forgot-password"  className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#207659] transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "../lib/gsap";
import { authApi } from "@/app/features/auth/api";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { loginFailure, loginStart, loginSuccess, setCurrentUser } from "@/app/store/slices/authSlice";
import { UserPlus, ArrowRight, User, Mail, Lock, Sparkles } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Title Effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".signup-char-interactive");
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

    if (!name || !email || !password) return setLocalError("Please fill in all required fields.");
    if (!/\S+@\S+\.\S+/.test(email)) return setLocalError("That email doesn't look right.");
    if (password.length < 6) return setLocalError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setLocalError("Passwords do not match.");

    dispatch(loginStart());

    try {
      const result = await authApi.signup({ name, email, password });
      let resolvedUser = result?.user ?? null;
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) resolvedUser = currentUser;
      } catch {}
      
      if (result) {
        dispatch(loginSuccess({ user: resolvedUser, token: result.token }));
      } else if (resolvedUser) {
        dispatch(loginSuccess({ user: resolvedUser, token: null }));
      }
      
      if (resolvedUser) dispatch(setCurrentUser(resolvedUser));
      router.push("/menu");
    } catch (submitError) {
      dispatch(loginFailure((submitError as Error).message));
    }
  };

  return (
    <main className="bg-[#F5F0E6] min-h-screen flex items-center justify-center p-6" ref={containerRef}>
      <section className="relative w-full max-w-[1100px] mt-20 grid lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-black/5">
        
        {/* Left Side: Community/Invite */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#0a2920] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[#207659] opacity-10 blur-[100px]" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#8EC894] rounded-2xl flex items-center justify-center mb-8 -rotate-6">
              <Sparkles className="text-[#0a2920]" size={24} />
            </div>
            <h2 className="text-6xl font-black uppercase italic leading-none tracking-tighter">
              Join the <br /> <span className="text-[#8EC894]">Brew.</span>
            </h2>
            <p className="mt-6 text-white/60 max-w-xs font-medium uppercase tracking-widest text-[10px]">
              Become a member to track orders, earn rewards, and get early access to new roasts.
            </p>
          </div>

          <div className="relative z-10 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8EC894] mb-4">Member Perk #01</p>
            <p className="text-lg font-bold italic leading-tight">"Free regular coffee on your first visit after signing up."</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-5xl font-black text-[#0a2920] flex gap-1 lowercase italic">
              {"SIGNUP".split("").map((char, i) => (
                <span key={i} className="signup-char-interactive inline-block">{char}</span>
              ))}
            </h1>
            <p className="text-black/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
              Create your visual coffee journal account
            </p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F5F0E6]/50 border border-black/5 rounded-2xl px-12 py-4 focus:bg-white focus:ring-2 ring-[#207659]/20 outline-none transition-all font-bold italic"
                  placeholder="Dinesh"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
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
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Password</label>
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

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 ml-2">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F5F0E6]/50 border border-black/5 rounded-2xl px-12 py-4 focus:bg-white focus:ring-2 ring-[#207659]/20 outline-none transition-all font-bold italic"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {(localError || error) && (
              <div className="md:col-span-2 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                <p className="text-xs font-black text-red-600 uppercase tracking-tighter">{localError ?? error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 group relative w-full overflow-hidden rounded-2xl bg-[#0a2920] py-5 transition-all duration-300 active:scale-95 disabled:opacity-50 mt-4"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase text-sm tracking-tighter">
                {loading ? "Joining..." : "Create Account"}
                {!loading && <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />}
              </div>
              <div className="absolute inset-0 bg-[#207659] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
              Already a member?{" "}
              <Link href="/login" className="text-[#207659] hover:underline ml-2">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
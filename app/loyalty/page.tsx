// ============================================================
// Bite & Brew — Loyalty Dashboard Page
// ============================================================

"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { gsap } from "@/app/lib/gsap";
import { useAppSelector } from "@/app/store/hooks";
import { LoyaltyDashboard } from "@/app/components/loyalty/LoyaltyDashboard";
import { CreativeHero } from "@/app/sections/Hero";
import CTA from "@/app/sections/CTA";

export default function LoyaltyPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect client-side mount without triggering a setState-in-effect warning.
  // Returns false during SSR/hydration and true on the client after hydration.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Interactive title animation
  const interactiveTitle = (
    <span className="flex flex-nowrap justify-start whitespace-nowrap">
      {"REWARDS".split("").map((char, i) => (
        <span
          key={i}
          className="loyalty-char-interactive inline-block will-change-transform"
        >
          {char}
        </span>
      ))}
    </span>
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const chars = document.querySelectorAll(".loyalty-char-interactive");
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
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.3)",
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Show a consistent loading state until client-side mount to prevent hydration mismatches
  if (!mounted || loading) {
    return (
      <main className="bg-[#F5F0E6] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0F3D33]/20 border-t-[#0F3D33] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#0F3D33]/60">Loading...</p>
        </div>
      </main>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return (
      <main className="bg-[#F5F0E6] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0F3D33]/20 border-t-[#0F3D33] rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F5F0E6] min-h-screen overflow-x-hidden" ref={containerRef}>
      {/* Hero Section */}
      <CreativeHero
        tagline="Loyalty Rewards"
        title={interactiveTitle}
        description="Earn points with every visit, unlock exclusive rewards, and enjoy the Bite & Brew experience like never before."
        ctas={[
          { href: "#dashboard", text: "View Dashboard" },
          { href: "/menu", text: "Order Now" },
        ]}
      />

      {/* Dashboard Section */}
      <section id="dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <LoyaltyDashboard />
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <CTA
            title="Earn More, Savor More"
            subtitle="Every visit brings you closer to your next reward. Keep coming back to unlock premium perks."
            primaryCTA={{ text: "Explore Menu", href: "/menu" }}
            secondaryCTA={{ text: "Visit Us", href: "/" }}
          />
        </div>
      </section>
    </main>
  );
}


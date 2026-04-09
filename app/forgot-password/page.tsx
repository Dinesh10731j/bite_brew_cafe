"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authApi } from "@/app/features/auth/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const message = await authApi.forgotPassword({ email });
      setSuccess(message);
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#f7f2ea]">
      <section className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-black/5 p-8">
        <h1 className="text-3xl font-black text-[#1a5a46] mb-2">Forgot Password</h1>
        <p className="text-sm text-black/60 mb-6">Enter your email and we will send reset instructions.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black/80 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5a46]"
              placeholder="you@example.com"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1a5a46] text-white font-bold py-3 hover:bg-[#207659] transition-colors disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="mt-5 text-sm text-black/60">
          Remembered password?{" "}
          <Link href="/login" className="text-[#1a5a46] font-semibold hover:underline">
            Go to login
          </Link>
        </p>
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/app/features/auth/api";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const initialEmail = searchParams.get("email") ?? "";
    const initialToken = searchParams.get("token") ?? "";
    if (initialEmail) {
      setEmail(initialEmail);
    }
    if (initialToken) {
      setToken(initialToken);
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !token || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const message = await authApi.resetPassword({
        email,
        token,
        password,
        confirmPassword,
      });
      setSuccess(message);
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#f7f2ea]">
      <section className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-black/5 p-8">
        <h1 className="text-3xl font-black text-[#1a5a46] mb-2">Reset Password</h1>
        <p className="text-sm text-black/60 mb-6">Set your new password using the token from your email.</p>

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

          <div>
            <label htmlFor="token" className="block text-sm font-semibold text-black/80 mb-1">Token</label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-full rounded-xl border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5a46]"
              placeholder="Paste token from email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-black/80 mb-1">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5a46]"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black/80 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5a46]"
              placeholder="Repeat new password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1a5a46] text-white font-bold py-3 hover:bg-[#207659] transition-colors disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-5 text-sm text-black/60">
          Back to{" "}
          <Link href="/login" className="text-[#1a5a46] font-semibold hover:underline">
            login
          </Link>
        </p>
      </section>
    </main>
  );
}

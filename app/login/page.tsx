"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/features/auth/api";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { loginFailure, loginStart, loginSuccess } from "@/app/store/slices/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Please provide a valid email address.");
      return;
    }

    dispatch(loginStart());

    try {
      const result = await authApi.login({ email, password });
      dispatch(loginSuccess({ user: result.user, token: result.token }));
      router.push("/menu");
    } catch (submitError) {
      dispatch(loginFailure((submitError as Error).message));
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#f7f2ea]">
      <section className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-black/5 p-8">
        <h1 className="text-3xl font-black text-[#1a5a46] mb-2">Login</h1>
        <p className="text-sm text-black/60 mb-6">Sign in to place orders quickly.</p>

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
            <label htmlFor="password" className="block text-sm font-semibold text-black/80 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-black/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5a46]"
              placeholder="********"
            />
          </div>

          {(localError || error) && (
            <p className="text-sm text-red-600">{localError ?? error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1a5a46] text-white font-bold py-3 hover:bg-[#207659] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-sm text-black/60">
          New customer?{" "}
          <Link href="/signup" className="text-[#1a5a46] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}

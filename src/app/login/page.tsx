"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-construct-paper px-4 py-12">
      <div className="construct-grid-bg absolute inset-0" />
      <div className="absolute -left-24 top-16 h-80 w-80 rotate-12 bg-construct-red" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full border-8 border-construct-blue" />

      <div className="relative grid w-full max-w-5xl gap-8 md:grid-cols-[0.85fr_1.15fr]">
        <section className="hidden bg-construct-black p-10 text-white md:block">
          <div className="font-display text-xs uppercase tracking-[0.28em] text-construct-yellow">
            Control Room
          </div>
          <h1 className="construct-heading mt-5 text-5xl">
            ADMIN
            <br />
            ACCESS
          </h1>
          <div className="mt-8 space-y-4">
            <div className="h-10 w-full bg-construct-red" />
            <div className="h-10 w-3/4 bg-construct-yellow" />
            <div className="h-10 w-1/2 bg-construct-blue" />
          </div>
          <p className="mt-10 text-sm leading-relaxed text-white/70">
            Only the administrator can enter this area. Sessions are stored in a
            signed HttpOnly cookie.
          </p>
        </section>

        <section className="construct-card construct-clip bg-white p-8 md:p-10">
          <Link href="/" className="font-display text-xs uppercase tracking-[0.24em] text-construct-red">
            ← Back to site
          </Link>
          <h2 className="construct-heading mt-5 text-4xl text-construct-black">
            LOGIN
          </h2>
          <p className="mt-3 text-sm text-construct-muted">
            Enter administrator credentials.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="construct-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="construct-input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="construct-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="construct-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <div className="border-4 border-construct-danger bg-construct-danger px-4 py-3 text-sm font-semibold text-white">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="construct-button construct-button-primary w-full"
              disabled={loading}
            >
              {loading ? "Checking..." : "Enter Admin"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

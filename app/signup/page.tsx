"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <a href="/" className="auth-brand">
            <img src="/bizorvia-mark.png" alt="Bizorvia" />
            <span>Bizorvia</span>
          </a>
          <div className="auth-success">
            <span>✓</span>
            <h2>Check your email</h2>
            <p>We sent a confirmation link to <b>{email}</b>. Click it to activate your account.</p>
            <a href="/login">Back to sign in →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a href="/" className="auth-brand">
          <img src="/bizorvia-mark.png" alt="Bizorvia" />
          <span>Bizorvia</span>
        </a>
        <h1>Create your workspace</h1>
        <p>Start free — no credit card required</p>
        <form onSubmit={handleSignup} className="auth-form">
          <label>
            <span>Full name</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              autoFocus
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              required
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account…" : "Get started free →"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

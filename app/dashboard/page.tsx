"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif" }}>
        <p style={{ color: "#666" }}>Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter,sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: "none", color: "#fff" }}>Bizorvia</a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ color: "#666", fontSize: 14 }}>{user.email}</span>
          <a href="/pricing" style={{ background: "#d8ff72", color: "#0a0a0a", padding: "8px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Upgrade</a>
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: "#666", marginBottom: 48, fontSize: 16 }}>Your Idea-to-Income Operating System</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { title: "Business Factory", desc: "Launch your next business idea", href: "/" },
            { title: "Studio", desc: "Design your brand and assets", href: "/" },
            { title: "Code Studio", desc: "Build your product", href: "/" },
            { title: "Payments", desc: "Manage revenue and billing", href: "/" },
            { title: "Marketing", desc: "Grow your audience", href: "/" },
            { title: "Legal & Trust", desc: "Protect your business", href: "/" },
          ].map((card) => (
            <a key={card.title} href={card.href} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 24, textDecoration: "none", display: "block" }}>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{card.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

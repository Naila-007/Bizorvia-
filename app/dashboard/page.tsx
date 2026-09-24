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

  const modules = [
    { title: "Business Factory", desc: "Launch your next business idea", href: "/", color: "#d8ff72" },
    { title: "Features", desc: "Explore everything Bizorvia can do", href: "/features", color: "#a78bfa" },
    { title: "Upgrade Plan", desc: "Unlock more power with Bizorvia", href: "/pricing", color: "#fb923c" },
    { title: "Payments", desc: "Manage revenue and billing", href: "/profile", color: "#34d399" },
    { title: "Blog & Guides", desc: "Learn how to grow with Bizorvia", href: "/blog", color: "#60a5fa" },
    { title: "Legal & Trust", desc: "Privacy, Terms, and your rights", href: "/legal", color: "#f472b6" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter,sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: "none", color: "#fff" }}>Bizorvia</a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ color: "#666", fontSize: 14 }}>{user.email}</span>
          <a href="/profile" style={{ color: "#888", fontSize: 14, textDecoration: "none" }}>Account</a>
          <a href="/pricing" style={{ background: "#d8ff72", color: "#0a0a0a", padding: "8px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Upgrade</a>
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: "#666", marginBottom: 48, fontSize: 16 }}>Your Bizorvia workspace</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {modules.map((card) => (
            <a key={card.title} href={card.href} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 24, textDecoration: "none", display: "block", transition: "border-color 0.2s" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: card.color, marginBottom: 16 }} />
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

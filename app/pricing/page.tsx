"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    desc: "Get started",
    features: ["3 AI requests/day", "1 project", "Basic tools"],
    cta: "Get started free",
    highlight: false,
  },
  {
    id: "builder",
    name: "Builder",
    price: 39,
    desc: "For solo founders",
    features: ["Unlimited AI requests", "5 projects", "Business Factory", "Email support"],
    cta: "Start Builder",
    highlight: false,
  },
  {
    id: "business",
    name: "Business",
    price: 129,
    desc: "For growing teams",
    features: ["Everything in Builder", "Unlimited projects", "Team members", "Priority support", "Advanced analytics"],
    cta: "Start Business",
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 399,
    desc: "For enterprises",
    features: ["Everything in Business", "White label", "Custom integrations", "Dedicated support", "SLA guarantee"],
    cta: "Start Scale",
    highlight: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    if (planId === "free") {
      window.location.href = user ? "/" : "/signup";
      return;
    }

    if (!user) {
      window.location.href = "/signup";
      return;
    }

    setLoading(planId);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = "/login"; return; }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ plan: planId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#fff" }}>
          <img src="/bizorvia-mark.png" alt="Bizorvia" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>Bizorvia</span>
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          {user
            ? <a href="/" style={{ background: "#d8ff72", color: "#0a0a0a", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Dashboard →</a>
            : <>
                <a href="/login" style={{ color: "#999", textDecoration: "none", fontSize: 14, padding: "8px 16px" }}>Sign in</a>
                <a href="/signup" style={{ background: "#d8ff72", color: "#0a0a0a", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Get started</a>
              </>
          }
        </div>
      </header>

      <div style={{ padding: "80px 32px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ background: "#1a2a1a", color: "#d8ff72", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 20 }}>
            Simple, transparent pricing
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.1 }}>
            Choose your plan
          </h1>
          <p style={{ color: "#888", fontSize: 18, margin: 0 }}>
            Start free. Upgrade when you're ready to scale.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              background: plan.highlight ? "#0f1f0f" : "#111",
              border: `1px solid ${plan.highlight ? "#d8ff72" : "#1a1a1a"}`,
              borderRadius: 16,
              padding: 28,
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#d8ff72", color: "#0a0a0a", padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>{plan.desc}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: plan.highlight ? "#d8ff72" : "#fff" }}>
                    ${plan.price}
                  </span>
                  {plan.price > 0 && <span style={{ color: "#666", fontSize: 14 }}>/mo</span>}
                </div>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", color: "#ccc", fontSize: 14 }}>
                    <span style={{ color: "#d8ff72", fontSize: 16 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                style={{
                  background: plan.highlight ? "#d8ff72" : "transparent",
                  color: plan.highlight ? "#0a0a0a" : "#fff",
                  border: plan.highlight ? "none" : "1px solid #333",
                  padding: "12px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.2s",
                }}
              >
                {loading === plan.id ? "Loading…" : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#555", fontSize: 14, marginTop: 32 }}>
          All plans include SSL, 99.9% uptime, and cancel anytime. No contracts.
        </p>
      </div>
    </div>
  );
}

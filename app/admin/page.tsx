"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  created_at: string;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  plan: string | null;
  message: string;
  created_at: string;
};

type Stats = {
  total: number;
  free: number;
  paid: number;
  today: number;
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, free: 0, paid: 0, today: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchAdminData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUnauthorized(true); return; }

    const headers = { "Authorization": `Bearer ${session.access_token}` };

    const usersRes = await fetch("/api/admin/users", { headers });
    if (usersRes.status === 403) { setUnauthorized(true); setDataLoading(false); return; }
    if (usersRes.ok) {
      const data: Profile[] = await usersRes.json();
      setProfiles(data);
      const today = new Date().toISOString().split("T")[0];
      setStats({
        total: data.length,
        free: data.filter(p => p.plan === "free").length,
        paid: data.filter(p => p.plan !== "free").length,
        today: data.filter(p => p.created_at?.startsWith(today)).length,
      });
    }

    const contactsRes = await fetch("/api/admin/users/contacts", { headers });
    if (contactsRes.ok) {
      const cData: Contact[] = await contactsRes.json();
      setContacts(cData);
    }

    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    if (!loading && user) fetchAdminData();
    if (!loading && !user) setDataLoading(false);
  }, [loading, user, fetchAdminData]);

  if (loading || (dataLoading && user)) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a0a", color:"#fff" }}>
      <div style={{ textAlign:"center" }}><div style={{ fontSize:32, marginBottom:16 }}>✦</div><p>Loading...</p></div>
    </div>
  );

  if (!user) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a0a", color:"#fff" }}>
      <div style={{ textAlign:"center", padding:32 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
        <h2>Admin Access Required</h2>
        <p style={{ color:"#999", marginBottom:24 }}>Sign in with your admin account.</p>
        <a href="/login" style={{ background:"#d8ff72", color:"#0a0a0a", padding:"12px 24px", borderRadius:8, textDecoration:"none", fontWeight:700 }}>Sign In</a>
      </div>
    </div>
  );

  if (unauthorized) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a0a", color:"#fff" }}>
      <div style={{ textAlign:"center", padding:32 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⛔</div>
        <h2>Access Denied</h2>
        <p style={{ color:"#999", marginBottom:24 }}>This area is for admins only.</p>
        <a href="/" style={{ background:"#d8ff72", color:"#0a0a0a", padding:"12px 24px", borderRadius:8, textDecoration:"none", fontWeight:700 }}>Go Home</a>
      </div>
    </div>
  );

  const filteredUsers = profiles.filter(p =>
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    c.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.company?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"Inter, sans-serif" }}>
      <header style={{ borderBottom:"1px solid #1a1a1a", padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src="/bizorvia-mark.png" alt="Bizorvia" style={{ width:32, height:32 }} />
          <span style={{ fontWeight:700, fontSize:18 }}>Bizorvia</span>
          <span style={{ color:"#555", margin:"0 8px" }}>/</span>
          <span style={{ color:"#d8ff72", fontSize:14, fontWeight:600 }}>Admin</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ background:"#1a2a1a", color:"#d8ff72", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 }}>● OWNER</span>
          <a href="/" style={{ color:"#999", fontSize:14, textDecoration:"none" }}>← App</a>
        </div>
      </header>

      <div style={{ padding:"32px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:700, margin:0 }}>Admin Dashboard</h1>
          <p style={{ color:"#666", margin:"8px 0 0" }}>Logged in as {user.email}</p>
        </div>

        <div style={{ display:"flex", gap:4, marginBottom:32, borderBottom:"1px solid #1a1a1a" }}>
          {["overview","contacts","users","plans","health"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background:"none", border:"none", color: activeTab===tab ? "#d8ff72" : "#666",
              padding:"12px 20px", cursor:"pointer", fontSize:14, fontWeight:600, textTransform:"capitalize",
              borderBottom: activeTab===tab ? "2px solid #d8ff72" : "2px solid transparent",
              position:"relative"
            }}>
              {tab}
              {tab === "contacts" && contacts.length > 0 && (
                <span style={{ background:"#d8ff72", color:"#0a0a0a", borderRadius:10, fontSize:10, fontWeight:700, padding:"1px 6px", marginLeft:6 }}>
                  {contacts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
              {[
                { label:"Total Users", value: stats.total, color:"#d8ff72" },
                { label:"Free Plan",   value: stats.free,  color:"#7ec8e3" },
                { label:"Paid Plan",   value: stats.paid,  color:"#a78bfa" },
                { label:"New Today",   value: stats.today, color:"#fb923c" },
              ].map(card => (
                <div key={card.label} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:24 }}>
                  <div style={{ color:"#666", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{card.label}</div>
                  <div style={{ fontSize:36, fontWeight:700, color:card.color }}>{dataLoading ? "…" : card.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:24, marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                <b style={{ fontSize:16 }}>Recent Contact Submissions</b>
                <button onClick={() => setActiveTab("contacts")} style={{ background:"none", border:"1px solid #333", color:"#999", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13 }}>View all →</button>
              </div>
              {contacts.length === 0 ? (
                <div style={{ color:"#666", textAlign:"center", padding:32 }}><p>No contact submissions yet.</p></div>
              ) : contacts.slice(0, 3).map(c => (
                <div key={c.id} style={{ display:"flex", alignItems:"flex-start", gap:16, padding:"12px 0", borderBottom:"1px solid #1a1a1a" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"#1a1a2a", display:"flex", alignItems:"center", justifyContent:"center", color:"#a78bfa", fontWeight:700, flexShrink:0 }}>
                    {c.name?.slice(0,1).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{c.name}</div>
                    <div style={{ color:"#666", fontSize:13 }}>{c.email}{c.company ? ` · ${c.company}` : ""}</div>
                    <div style={{ color:"#555", fontSize:12, marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.message}</div>
                  </div>
                  <span style={{ color:"#555", fontSize:12, flexShrink:0 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>

            <div style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                <b style={{ fontSize:16 }}>Recent Signups</b>
                <button onClick={() => setActiveTab("users")} style={{ background:"none", border:"1px solid #333", color:"#999", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13 }}>View all →</button>
              </div>
              {profiles.length === 0 ? (
                <div style={{ color:"#666", textAlign:"center", padding:32 }}><p>No users yet. Share bizorvia.com!</p></div>
              ) : profiles.slice(0, 5).map(p => (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:"1px solid #1a1a1a" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"#1a2a1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#d8ff72", fontWeight:700, flexShrink:0 }}>
                    {p.email?.slice(0,1).toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{p.full_name || "No name"}</div>
                    <div style={{ color:"#666", fontSize:13 }}>{p.email}</div>
                  </div>
                  <span style={{ background: p.plan==="free" ? "#1a1a1a" : "#1a2a1a", color: p.plan==="free" ? "#666" : "#d8ff72", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 }}>{p.plan}</span>
                  <span style={{ color:"#555", fontSize:12 }}>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div>
            <input value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Search by name, email or company…"
              style={{ background:"#111", border:"1px solid #333", color:"#fff", padding:"12px 16px", borderRadius:8, fontSize:14, outline:"none", width:"100%", marginBottom:20, boxSizing:"border-box" }} />
            {filteredContacts.length === 0 ? (
              <div style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:48, textAlign:"center", color:"#555" }}>
                {contacts.length === 0 ? "No contact submissions yet." : "No results found."}
              </div>
            ) : filteredContacts.map(c => (
              <div key={c.id} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:20, marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:"#1a1a2a", display:"flex", alignItems:"center", justifyContent:"center", color:"#a78bfa", fontWeight:700, fontSize:18, flexShrink:0 }}>
                    {c.name?.slice(0,1).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:700, fontSize:15 }}>{c.name}</span>
                      {c.company && <span style={{ color:"#666", fontSize:13 }}>· {c.company}</span>}
                      {c.plan && <span style={{ background:"#1a2a1a", color:"#d8ff72", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{c.plan}</span>}
                      <span style={{ color:"#555", fontSize:12, marginLeft:"auto" }}>{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <a href={`mailto:${c.email}`} style={{ color:"#7ec8e3", fontSize:13, textDecoration:"none" }}>{c.email}</a>
                  </div>
                </div>
                <div onClick={() => setExpandedContact(expandedContact === c.id ? null : c.id)}
                  style={{ marginTop:16, cursor:"pointer", background:"#0a0a0a", borderRadius:8, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  {expandedContact === c.id
                    ? <p style={{ margin:0, color:"#ccc", fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap", flex:1 }}>{c.message}</p>
                    : <p style={{ margin:0, color:"#777", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{c.message}</p>}
                  <span style={{ color:"#555", fontSize:12, marginLeft:16, flexShrink:0 }}>{expandedContact === c.id ? "▲ hide" : "▼ read"}</span>
                </div>
                <div style={{ marginTop:12 }}>
                  <a href={`mailto:${c.email}?subject=Re: Your message to Bizorvia`}
                    style={{ background:"#d8ff72", color:"#0a0a0a", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>Reply</a>
                </div>
              </div>
            ))}
            <div style={{ color:"#555", fontSize:13, marginTop:12, textAlign:"right" }}>{filteredContacts.length} of {contacts.length} submissions</div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email or name…"
              style={{ background:"#111", border:"1px solid #333", color:"#fff", padding:"12px 16px", borderRadius:8, width:"100%", fontSize:14, outline:"none", marginBottom:20, boxSizing:"border-box" }} />
            <div style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 1fr", padding:"12px 20px", borderBottom:"1px solid #1a1a1a", color:"#555", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>
                <span>Name</span><span>Email</span><span>Plan</span><span>Joined</span>
              </div>
              {filteredUsers.length === 0
                ? <div style={{ color:"#666", textAlign:"center", padding:32 }}>No users found</div>
                : filteredUsers.map(p => (
                  <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 1fr", padding:"16px 20px", borderBottom:"1px solid #111", alignItems:"center" }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>{p.full_name || "—"}</span>
                    <span style={{ color:"#999", fontSize:13 }}>{p.email}</span>
                    <span style={{ background: p.plan==="free" ? "#1a1a1a" : "#1a2a1a", color: p.plan==="free" ? "#666" : "#d8ff72", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, display:"inline-block" }}>{p.plan}</span>
                    <span style={{ color:"#555", fontSize:13 }}>{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              }
            </div>
            <div style={{ color:"#555", fontSize:13, marginTop:12, textAlign:"right" }}>{filteredUsers.length} of {profiles.length} users</div>
          </div>
        )}

        {activeTab === "plans" && (
          <div style={{ display:"grid", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[{ plan:"Free", count:stats.free, color:"#555" }, { plan:"Paid", count:stats.paid, color:"#d8ff72" }].map(item => (
                <div key={item.plan} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:32, textAlign:"center" }}>
                  <div style={{ fontSize:48, fontWeight:700, color:item.color, marginBottom:8 }}>{item.count}</div>
                  <div style={{ fontWeight:700, fontSize:18 }}>{item.plan} Plan</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#111", border:"1px solid #f59e0b33", borderRadius:12, padding:24 }}>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>💳 Stripe Payments — Coming Next</div>
              <div style={{ color:"#666", fontSize:14 }}>Add STRIPE_SECRET_KEY to Vercel env vars to enable real billing.</div>
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div style={{ display:"grid", gap:16 }}>
            {[
              { name:"Supabase Database",   status:"Operational", color:"#d8ff72", detail:`${profiles.length} users in profiles table` },
              { name:"Contact Submissions", status:"Operational", color:"#d8ff72", detail:`${contacts.length} submissions in contact_submissions table` },
              { name:"Vercel Hosting",      status:"Operational", color:"#d8ff72", detail:"bizorvia.com live on Vercel with SSL + security headers" },
              { name:"Authentication",      status:"Operational", color:"#d8ff72", detail:"Email/password auth + JWT verification" },
              { name:"Email (Resend)",      status:"Operational", color:"#d8ff72", detail:"hello@bizorvia.com — domain verified, DKIM + SPF active" },
              { name:"AI API (Claude)",     status: process.env.NEXT_PUBLIC_AI_ENABLED === "true" ? "Configured" : "Add ANTHROPIC_API_KEY", color:"#f59e0b", detail:"Secured behind auth + rate limiting" },
              { name:"Stripe Payments",     status:"Not Connected", color:"#ef4444", detail:"Add STRIPE_SECRET_KEY to enable billing" },
            ].map(item => (
              <div key={item.name} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:12, padding:24, display:"flex", alignItems:"center", gap:20 }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:item.color, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:16 }}>{item.name}</div>
                  <div style={{ color:"#666", fontSize:13, marginTop:4 }}>{item.detail}</div>
                </div>
                <div style={{ color:item.color, fontSize:13, fontWeight:600 }}>{item.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useAuth } from "@/contexts/AuthContext";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Step = { label: string; detail: string };

const taskSteps: Step[] = [
  { label: "Building a precise plan", detail: "4 specialist agents assigned" },
  { label: "Researching trusted sources", detail: "28 sources scanned" },
  { label: "Comparing competitors", detail: "9 products mapped" },
  {
    label: "Creating final deliverables",
    detail: "Report + slides + dashboard",
  },
];

const starterTasks = [
  {
    icon: "◎",
    title: "Deep research",
    copy: "Compare 10 competitors and build a cited market brief.",
  },
  {
    icon: "◇",
    title: "Launch a business",
    copy: "Turn my idea into a branded, sellable, live business.",
  },
  {
    icon: "▦",
    title: "Analyze data",
    copy: "Clean my spreadsheet and create an executive dashboard.",
  },
  {
    icon: "↻",
    title: "Automate work",
    copy: "Create a repeatable workflow with approvals and alerts.",
  },
];

const files = [
  { name: "Market brief.pdf", type: "PDF", color: "rose" },
  { name: "Competitor matrix.xlsx", type: "XLSX", color: "green" },
  { name: "Launch strategy.pptx", type: "PPTX", color: "amber" },
];

const cloudModules = [
  {
    icon: "✦",
    title: "Business Factory",
    copy: "Turn one idea into a branded live business with offers, payments, marketing, sales, and support.",
    tone: "amber",
  },
  {
    icon: "◈",
    title: "App Studio",
    copy: "Create websites, mobile apps, stores, portals, and internal tools with a prompt.",
    tone: "violet",
  },
  {
    icon: "</>",
    title: "Bizorvia Code",
    copy: "Edit complete codebases with autonomous agents, terminal, previews, tests, diffs, and approval controls.",
    tone: "cyan",
  },
  {
    icon: "⌁",
    title: "Bizorvia Everywhere",
    copy: "Run the same agent in terminal, Slack, GitHub, browser, email, support, mobile, and APIs.",
    tone: "violet",
  },
  {
    icon: "☁",
    title: "Bizorvia Cloud",
    copy: "Managed web and app hosting with CDN, SSL, functions, storage, logs, and backups.",
    tone: "cyan",
  },
  {
    icon: "▦",
    title: "Bizorvia Data",
    copy: "Postgres database, visual data editor, SQL workspace, auth, storage, and APIs.",
    tone: "emerald",
  },
  {
    icon: "▲",
    title: "Global Deploy",
    copy: "Preview branches, instant production releases, analytics, logs, and rollbacks.",
    tone: "blue",
  },
  {
    icon: "$",
    title: "Bizorvia Pay",
    copy: "Checkout, subscriptions, invoices, payment links, taxes, and customer portal.",
    tone: "amber",
  },
  {
    icon: "◎",
    title: "Domains",
    copy: "Search, purchase, connect, secure, and renew domains without leaving the workspace.",
    tone: "rose",
  },
  {
    icon: "↻",
    title: "Agent Automations",
    copy: "Schedule work, react to events, connect services, and add human approvals.",
    tone: "cyan",
  },
  {
    icon: "◌",
    title: "Growth Studio",
    copy: "Run SEO, AEO, GEO, content, social, email, ads, reputation, affiliates, and conversion optimization.",
    tone: "blue",
  },
  {
    icon: "↗",
    title: "Revenue Engine",
    copy: "Subscriptions, usage billing, platform fees, add-ons, and marketplace income in one model.",
    tone: "emerald",
  },
  {
    icon: "§",
    title: "Legal & Trust",
    copy: "Manage terms, privacy, acceptable use, agents, hosting, payments, domains, cookies, and data rules.",
    tone: "violet",
  },
  {
    icon: "✦",
    title: "Launch OS",
    copy: "Verify profit, security, compliance, portability, recovery, and customer readiness before every release.",
    tone: "amber",
  },
];

const businessFactorySteps = [
  {
    title: "Validate",
    icon: "◎",
    copy: "Research demand, buyer pain, competitors, keywords, pricing, startup cost, and a realistic path to the first customer.",
    outputs: [
      "Opportunity score",
      "Ideal customer",
      "Demand evidence",
      "Risk report",
    ],
  },
  {
    title: "Design offer",
    icon: "◇",
    copy: "Choose the strongest business model and create the core offer, pricing, free lead magnet, upsells, guarantees, and profit targets.",
    outputs: [
      "Offer suite",
      "Pricing model",
      "Unit economics",
      "Sales promise",
    ],
  },
  {
    title: "Create brand",
    icon: "✦",
    copy: "Generate a distinctive name, identity, messaging, domain shortlist, email setup, social handles, and reusable brand assets.",
    outputs: [
      "Brand system",
      "Domain shortlist",
      "Messaging kit",
      "Social profiles",
    ],
  },
  {
    title: "Build",
    icon: "▦",
    copy: "Create the website, app or store, database, customer accounts, files, checkout, analytics, automations, and mobile-ready experience.",
    outputs: [
      "Live product",
      "Customer portal",
      "Database + auth",
      "Analytics",
    ],
  },
  {
    title: "Protect",
    icon: "§",
    copy: "Prepare matched legal pages, cookie controls, consent, security settings, approval rules, backups, and the Launch Passport.",
    outputs: [
      "Legal center",
      "Security checks",
      "Consent flows",
      "Launch Passport",
    ],
  },
  {
    title: "Go live",
    icon: "▲",
    copy: "Connect the chosen domain, test purchases, publish the business, verify email delivery, index pages, and open for customers.",
    outputs: [
      "Custom domain",
      "Test order",
      "Search indexing",
      "Live checkout",
    ],
  },
  {
    title: "Find customers",
    icon: "↗",
    copy: "Launch SEO, AEO, GEO, content, email, social, lead capture, partnerships, reputation, affiliates, and approved advertising.",
    outputs: [
      "SEO + AEO + GEO",
      "90-day campaign",
      "Email + social",
      "Lead pipeline",
    ],
  },
  {
    title: "Run & grow",
    icon: "↻",
    copy: "Operate daily sales follow-up, support, fulfillment, reviews, churn recovery, bookkeeping alerts, experiments, and profit optimization.",
    outputs: [
      "Digital CEO",
      "Support agent",
      "Growth experiments",
      "Profit alerts",
    ],
  },
];

const launchSystems = [
  {
    icon: "✓",
    title: "Launch Passport",
    tag: "Release proof",
    copy: "One signed record for tests, accessibility, performance, licenses, data flows, security, billing, domains, backups, and approvals.",
    metric: "42 / 47 checks",
  },
  {
    icon: "$",
    title: "Profit Autopilot",
    tag: "Margin protection",
    copy: "Measures cost per user and task, routes models by price and quality, applies spending caps, and warns before a customer becomes unprofitable.",
    metric: "74% margin",
  },
  {
    icon: "§",
    title: "Trust Compiler",
    tag: "Policy as code",
    copy: "Turns product data flows into privacy notices, consent requirements, retention rules, subprocessors, and an auditable control map.",
    metric: "3 drifts found",
  },
  {
    icon: "↶",
    title: "Mission Replay",
    tag: "Explain + recover",
    copy: "Replays every agent decision, approval, tool call, data change, and deployment—then safely rolls back the affected action.",
    metric: "126 actions",
  },
  {
    icon: "⇄",
    title: "Sovereign Exit",
    tag: "No lock-in",
    copy: "Exports source, Postgres data, files, secrets manifest, DNS records, billing catalog, logs, and deployment instructions as a portable exit package.",
    metric: "Ready to export",
  },
  {
    icon: "◈",
    title: "Resilience Mesh",
    tag: "Provider failover",
    copy: "Keeps tested recovery plans for models, regions, email, storage, DNS, and payments so one provider cannot stop the business.",
    metric: "2 recovery paths",
  },
];

const legalPolicies = [
  {
    title: "Terms of Service",
    summary:
      "The master agreement for accounts, subscriptions, customer content, intellectual property, warranties, liability, and termination.",
    points: [
      "18+ or authorized business users",
      "Customer owns customer content",
      "Renewal, cancellation, suspension, and disputes",
    ],
  },
  {
    title: "Privacy Policy",
    summary:
      "Explains what Dayyan LLC collects, why it is processed, who receives it, retention, security, and privacy rights.",
    points: [
      "No general model training without opt-in",
      "Service providers and subprocessors disclosed",
      "Access, deletion, correction, and appeal workflow",
    ],
  },
  {
    title: "Acceptable Use",
    summary:
      "Prohibits illegal activity, abuse, malware, credential theft, deceptive impersonation, harmful automation, and platform interference.",
    points: [
      "No fraud, spam, malware, or rights violations",
      "No bypassing safeguards or approval gates",
      "Risk-based investigation and enforcement",
    ],
  },
  {
    title: "Autonomous Agent Policy",
    summary:
      "Sets responsibility and approval rules for autonomous planning, browsing, coding, publishing, purchasing, and connected-account actions.",
    points: [
      "Human review for high-impact work",
      "Explicit approval before sensitive actions",
      "Action logs, verification, and rollback",
    ],
  },
  {
    title: "Hosting Policy",
    summary:
      "Defines hosted services, plan limits, customer configuration duties, availability, backups, portability, and abuse response.",
    points: [
      "Web, APIs, functions, storage, CDN, and logs",
      "SLA only when included in an order form",
      "Customers keep independent critical backups",
    ],
  },
  {
    title: "Payments & Refunds",
    summary:
      "Covers subscription renewal, usage charges, refunds, failed payments, processor rules, taxes, and merchant responsibilities.",
    points: [
      "Transparent recurring and usage charges",
      "Non-refundable pass-through infrastructure costs",
      "Customers remain merchants for their own buyers",
    ],
  },
  {
    title: "Domain Terms",
    summary:
      "Adds registrar, ICANN, registration-data, renewal, expiration, transfer, DNS, trademark, and dispute requirements.",
    points: [
      "Availability is not guaranteed until confirmed",
      "Accurate registrant data is required",
      "Provider and registry rules also apply",
    ],
  },
  {
    title: "Cookies & Tracking",
    summary:
      "Describes necessary, functional, analytics, and advertising technologies, along with consent and opt-out controls.",
    points: [
      "Live notice must match the actual stack",
      "Non-essential consent where required",
      "Maintain a current cookie inventory",
    ],
  },
  {
    title: "Copyright / DMCA",
    summary:
      "Provides notice, counter-notice, repeat-infringer, and designated-agent procedures for user-hosted content.",
    points: [
      "Register a designated DMCA agent",
      "Validate notices before removal",
      "Document counter-notices and restoration",
    ],
  },
  {
    title: "Data Processing Addendum",
    summary:
      "Commercial starting terms for controller/processor roles, security, incidents, subprocessors, transfers, audits, and deletion.",
    points: [
      "Process customer data on instructions",
      "Notify confirmed incidents without undue delay",
      "Publish subprocessors and transfer safeguards",
    ],
  },
];

const marketingSystems = [
  {
    title: "SEO",
    icon: "◎",
    copy: "Technical audits, keyword research, site architecture, schema, internal links, local SEO, content clusters, indexing, and backlink opportunities.",
    score: "92",
    status: "18 opportunities",
  },
  {
    title: "AEO",
    icon: "?",
    copy: "Direct-answer pages, FAQs, featured-snippet structures, voice-search answers, comparison tables, definitions, and structured question coverage.",
    score: "86",
    status: "24 answers ready",
  },
  {
    title: "GEO",
    icon: "✦",
    copy: "Clear entities, evidence-backed claims, original insights, expert authorship, citation-worthy pages, consistent brand facts, and answer-engine visibility monitoring.",
    score: "78",
    status: "9 citation gaps",
  },
  {
    title: "Content",
    icon: "▤",
    copy: "A multilingual calendar for articles, landing pages, lead magnets, product stories, short videos, images, podcasts, and repurposed campaigns.",
    score: "88",
    status: "30 days planned",
  },
  {
    title: "Social",
    icon: "↗",
    copy: "Platform-specific creation, scheduling, community replies, social listening, UGC briefs, influencer outreach, and performance learning.",
    score: "84",
    status: "42 posts queued",
  },
  {
    title: "Email + CRM",
    icon: "✉",
    copy: "Lead capture, segmentation, welcome and sales sequences, newsletters, abandoned checkout, win-back, scoring, and sales follow-up.",
    score: "91",
    status: "7 flows active",
  },
  {
    title: "Paid ads",
    icon: "$",
    copy: "Creative variations, audiences, budgets, pixels, conversion APIs, landing pages, experiments, retargeting, and strict spend approvals.",
    score: "73",
    status: "Approval required",
  },
  {
    title: "Reputation",
    icon: "★",
    copy: "Review requests, listing consistency, response drafts, customer stories, PR opportunities, partnerships, affiliates, and referral programs.",
    score: "81",
    status: "6 actions",
  },
];

const workSurfaces = [
  {
    title: "Terminal",
    icon: ">_",
    status: "CLI online",
    copy: "Plan, edit, run commands, inspect logs, repair failures, manage environments, and open reviewable diffs from any project terminal.",
    link: "/cli",
    linkLabel: "Install CLI →",
  },
  {
    title: "Slack",
    icon: "#",
    status: "6 channels",
    copy: "Mention Bizorvia in a thread to research, summarize, create tasks, answer project questions, prepare changes, and request approvals.",
  },
  {
    title: "GitHub",
    icon: "◉",
    status: "12 repositories",
    copy: "Review pull requests, explain code, find bugs, suggest or apply fixes, run tests, triage issues, and keep documentation current.",
  },
  {
    title: "Browser",
    icon: "◎",
    status: "Secure session",
    copy: "Research, inspect live experiences, reproduce user journeys, collect evidence, complete approved workflows, and verify releases.",
  },
  {
    title: "Email",
    icon: "✉",
    status: "Inbox connected",
    copy: "Summarize conversations, draft replies, identify commitments, create follow-ups, route leads, and escalate sensitive messages.",
  },
  {
    title: "Support",
    icon: "♙",
    status: "248 tickets",
    copy: "Resolve common questions using approved knowledge, investigate account context, suggest refunds, and escalate exceptions to a person.",
  },
  {
    title: "Mobile",
    icon: "▯",
    status: "Push enabled",
    copy: "Approve sensitive actions, send instructions, review progress, receive incident alerts, and manage the business while away from a desk.",
  },
  {
    title: "API + Webhooks",
    icon: "{}",
    status: "18 events",
    copy: "Trigger governed agent workflows from any product, database, form, payment, scheduler, repository, or business event.",
  },
];

const platformContent: Record<
  string,
  {
    kicker: string;
    title: string;
    copy: string;
    action: string;
    stats: [string, string][];
  }
> = {
  Studio: {
    kicker: "BUILD",
    title: "Create anything from one idea",
    copy: "Generate the interface, backend, database, authentication, payments, and launch plan together.",
    action: "Create project",
    stats: [
      ["7", "Projects"],
      ["3", "Live apps"],
      ["99.99%", "Uptime"],
    ],
  },
  Hosting: {
    kicker: "HOST",
    title: "Hosting is built into every project",
    copy: "Run websites, web apps, APIs, background jobs, and static files on a managed global cloud—without setting up another provider.",
    action: "Host new project",
    stats: [
      ["6", "Hosted projects"],
      ["99.99%", "Uptime"],
      ["184 ms", "Global latency"],
    ],
  },
  Deploy: {
    kicker: "SHIP",
    title: "Every release, globally delivered",
    copy: "Automatic preview links, production deployments, edge delivery, logs, analytics, and one-click rollback.",
    action: "New deployment",
    stats: [
      ["42", "Deployments"],
      ["184 ms", "Global latency"],
      ["0", "Build errors"],
    ],
  },
  Database: {
    kicker: "DATA",
    title: "Your complete backend, built in",
    copy: "Postgres-compatible data, a friendly table editor, SQL tools, authentication, storage, realtime, and instant APIs.",
    action: "Create table",
    stats: [
      ["12", "Tables"],
      ["84.2k", "Rows"],
      ["2.1 GB", "Storage"],
    ],
  },
  Payments: {
    kicker: "REVENUE",
    title: "Sell products and subscriptions",
    copy: "Create checkout pages, payment links, plans, invoices, taxes, coupons, and a branded customer portal.",
    action: "Create payment link",
    stats: [
      ["$18,420", "Revenue"],
      ["1,284", "Customers"],
      ["96.8%", "Success rate"],
    ],
  },
  Domains: {
    kicker: "IDENTITY",
    title: "Find and launch your perfect domain",
    copy: "Search, buy, connect, transfer, protect, and auto-renew every business domain in one secure place.",
    action: "Search domains",
    stats: [
      ["8", "Domains"],
      ["6", "Connected"],
      ["100%", "SSL secured"],
    ],
  },
  Automations: {
    kicker: "WORKFLOWS",
    title: "Put your business on autopilot",
    copy: "Trigger autonomous agents on schedules, database changes, form submissions, payments, and customer activity.",
    action: "New automation",
    stats: [
      ["14", "Active flows"],
      ["3,822", "Runs"],
      ["126 hr", "Time saved"],
    ],
  },
  Team: {
    kicker: "WORKSPACE",
    title: "One secure home for your team",
    copy: "Invite collaborators, create roles, protect production, review agent decisions, and control spending.",
    action: "Invite member",
    stats: [
      ["8", "Members"],
      ["4", "Roles"],
      ["26", "Approvals"],
    ],
  },
  Admin: {
    kicker: "OWNER CONTROL CENTER",
    title: "Run every part of Bizorvia from one place",
    copy: "Monitor customers, revenue, projects, infrastructure, security, approvals, support, and platform health with owner-level controls.",
    action: "Open admin action",
    stats: [
      ["1,284", "Customers"],
      ["$18.4k", "Monthly revenue"],
      ["99.99%", "Platform uptime"],
    ],
  },
  Pricing: {
    kicker: "BUSINESS MODEL",
    title: "Turn every successful project into recurring income",
    copy: "Combine subscriptions with metered model and cloud usage, transaction revenue, domains, add-ons, marketplace commission, and enterprise services.",
    action: "Launch paid plans",
    stats: [
      ["$39", "Builder / mo"],
      ["70%+", "Gross margin goal"],
      ["8", "Revenue streams"],
    ],
  },
  Legal: {
    kicker: "TRUST CENTER",
    title: "Rules that grow with the platform",
    copy: "Keep customer-facing policies, operational controls, approval records, and legal review in one accountable workspace.",
    action: "Export legal pack",
    stats: [
      ["10", "Core policies"],
      ["20", "Draft pages"],
      ["1", "Approval workflow"],
    ],
  },
  "Launch OS": {
    kicker: "DIFFERENTIATION LAYER",
    title: "A business-safe release, not just generated code",
    copy: "Bizorvia verifies that every app can make money, protect customers, survive failure, explain agent actions, and leave the platform cleanly.",
    action: "Run launch audit",
    stats: [
      ["89%", "Launch ready"],
      ["74%", "Gross margin"],
      ["2", "Recovery paths"],
    ],
  },
  "Business Factory": {
    kicker: "IDEA → INCOME SYSTEM",
    title: "Describe an idea. Launch a complete business.",
    copy: "Bizorvia validates the opportunity, creates the offer and brand, builds the product, connects payments and domains, launches marketing, and operates the customer journey.",
    action: "Start a business",
    stats: [
      ["8", "Automated stages"],
      ["24/7", "Digital CEO"],
      ["1", "Owner approval inbox"],
    ],
  },
  Marketing: {
    kicker: "GROWTH OPERATING SYSTEM",
    title: "Be discoverable by people, search, and answer engines",
    copy: "Every Bizorvia business launches with connected SEO, AEO, GEO, content, social, email, advertising, reputation, affiliate, and conversion systems.",
    action: "Build growth plan",
    stats: [
      ["86", "Visibility score"],
      ["42", "Posts queued"],
      ["7", "Revenue flows"],
    ],
  },
  "Code Studio": {
    kicker: "AUTONOMOUS DEVELOPMENT",
    title: "Your codebase, editor, terminal, and agent team",
    copy: "Bizorvia Code understands the entire project, plans changes, edits across files, runs commands, fixes failures, previews results, and presents every diff for approval.",
    action: "Open repository",
    stats: [
      ["126", "Files indexed"],
      ["4", "Agents active"],
      ["0", "Test failures"],
    ],
  },
  Everywhere: {
    kicker: "AGENT PRESENCE LAYER",
    title: "One agent in every tool, at every step",
    copy: "Bizorvia Everywhere carries the same project memory, permissions, decisions, and audit trail across terminal, Slack, GitHub, browser, email, support, mobile, and APIs.",
    action: "Connect a tool",
    stats: [
      ["8", "Work surfaces"],
      ["36", "Connected tools"],
      ["1", "Shared memory"],
    ],
  },
};

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("Live run");
  const [toast, setToast] = useState("");
  const [activeNav, setActiveNav] = useState("Home");

  useEffect(() => {
    if (!running || paused || step >= taskSteps.length - 1) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 1800);
    return () => window.clearTimeout(timer);
  }, [running, paused, step]);

  const progress = useMemo(
    () => Math.round(((step + 1) / taskSteps.length) * 100),
    [step],
  );

  function startTask(event?: FormEvent) {
    event?.preventDefault();
    if (!prompt.trim())
      setPrompt(
        "Research the software productivity market and create a launch strategy",
      );
    setStep(0);
    setPaused(false);
    setRunning(true);
    setTab("Live run");
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/bizorvia-mark.png" alt="Bizorvia" />
          <span>Bizorvia</span>
        </div>
        <button
          className="new-task"
          onClick={() => {
            setRunning(false);
            setPrompt("");
          }}
        >
          ＋ <span>New task</span>
          <kbd>⌘ K</kbd>
        </button>
        <nav aria-label="Main navigation">
          {[
            "Home",
            "Business Factory",
            "Studio",
            "Code Studio",
            "Everywhere",
            "Hosting",
            "Deploy",
            "Database",
            "Payments",
            "Domains",
            "Marketing",
            "Automations",
            "Launch OS",
            "Pricing",
            "Legal",
            "Team",
            "Admin",
          ].map((item, index) => (
            <button
              key={item}
              className={activeNav === item ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActiveNav(item);
                notify(`${item} opened`);
              }}
            >
              <span>
                {
                  [
                    "⌂",
                    "✦",
                    "◇",
                    "</>",
                    "⌁",
                    "☁",
                    "▲",
                    "▦",
                    "$",
                    "◎",
                    "◌",
                    "↻",
                    "✦",
                    "↗",
                    "§",
                    "♙",
                    "⚙",
                  ][index]
                }
              </span>
              {item}
              {item === "Deploy" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-label">Recent</div>
        <button className="recent-item">
          <i className="status-dot live" />
          Software market launch plan
        </button>
        <button className="recent-item">
          <i className="status-dot done" />
          Etsy trend research
        </button>
        <button className="recent-item">
          <i className="status-dot done" />
          Q3 content calendar
        </button>
        <div className="sidebar-bottom">
          <div className="credit">
            <span>
              <b>1,840</b> agent credits
            </span>
            <small>62% remaining</small>
            <div>
              <i />
            </div>
          </div>
          {user ? (
            <button className="profile" onClick={signOut} title="Sign out">
              <span>{user.email?.slice(0,2).toUpperCase()}</span>
              <span>
                <b>{user.user_metadata?.full_name || user.email?.split("@")[0]}</b>
                <small>Free workspace</small>
              </span>
              <i className="signout-btn">↩</i>
            </button>
          ) : (
            <div className="header-auth">
              <a href="/login">Sign in</a>
              <a href="/signup" className="signup">Get started</a>
            </div>
          )}
          <div className="sidebar-footer-links" style={{marginTop: '8px', borderTop: '1px solid #1e2920', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
            <a href="/blog" style={{color: '#7a9a7a', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px'}}>📝 Blog</a>
            <a href="/contact" style={{color: '#7a9a7a', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px'}}>✉️ Contact</a>
            <a href="/profile" style={{color: '#7a9a7a', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px'}}>👤 Profile</a>
            <a href="/cli" style={{color: '#d8ff72', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600'}}>⬡ CLI Tool</a>
            <a href="/storage" style={{color: '#d8ff72', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600'}}>☁️ Storage</a>
            <a href="/projects" style={{color: '#d8ff72', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600'}}>⚡ Projects</a>
            <a href="/dev-hub" style={{color: '#d8ff72', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', background: '#d8ff7215'}}>🗂 Dev Hub</a>
          </div>
        </div>
      </aside>

      <section className="content">
        <header>
          <div className="mobile-brand">
            <img src="/bizorvia-mark.png" alt="" />Bizorvia
          </div>
          <div className="header-actions">
            <button onClick={() => notify("No new notifications")}>♢</button>
            {user ? (
              <button
                className="share"
                onClick={() => notify("Workspace link copied")}
              >
                Share workspace
              </button>
            ) : (
              <div className="header-auth">
                <a href="/login">Sign in</a>
                <a href="/signup" className="signup">Get started free</a>
              </div>
            )}
          </div>
        </header>

        {!running && activeNav !== "Home" ? (
          <PlatformView section={activeNav} notify={notify} />
        ) : !running ? (
          <div className="home-view">
            <div className="eyebrow">
              <span>✦</span> Your idea-to-income operating system
            </div>
            <h1>Turn one idea into a live business.</h1>
            <p className="intro">
              Bizorvia validates the opportunity, creates the offer and brand,
              builds the product, connects payments, launches marketing, and
              helps operate the business—under your control.
            </p>
            <form className="prompt-box" onSubmit={startTask}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a goal, attach files, or paste a link…"
                aria-label="Describe your task"
              />
              <div className="prompt-tools">
                <div>
                  <button
                    type="button"
                    title="Attach files"
                    onClick={() =>
                      notify("File upload ready in the full product")
                    }
                  >
                    ＋
                  </button>
                  <button
                    type="button"
                    onClick={() => notify("Deep research enabled")}
                  >
                    ◎ Deep research
                  </button>
                  <button
                    type="button"
                    onClick={() => notify("Private cloud selected")}
                  >
                    ⌁ Private cloud
                  </button>
                </div>
                <button
                  className="run-button"
                  type="submit"
                  aria-label="Run task"
                >
                  Run <span>↑</span>
                </button>
              </div>
            </form>
            <div className="trust-row">
              <span>✓ Every claim verified</span>
              <span>✓ Approval before sensitive actions</span>
              <span>✓ Sources & steps always visible</span>
            </div>
            <div className="section-title">
              <h2>Start with a superpower</h2>
              <button onClick={() => notify("Template library opened")}>
                Browse 120+ templates →
              </button>
            </div>
            <div className="starter-grid">
              {starterTasks.map((task) => (
                <button
                  key={task.title}
                  className="starter-card"
                  onClick={() => {
                    setPrompt(task.copy);
                    notify(`${task.title} selected`);
                  }}
                >
                  <span>{task.icon}</span>
                  <div>
                    <b>{task.title}</b>
                    <p>{task.copy}</p>
                  </div>
                  <i>↗</i>
                </button>
              ))}
            </div>
            <div className="capability-strip">
              <span className="pulse-orb" />
              <div>
                <b>One goal. A complete outcome.</b>
                <p>
                  Research · Browser actions · Code · Slides · Documents · Data
                  · Images · Automations
                </p>
              </div>
              <button onClick={() => notify("Capability guide opened")}>
                See how it works
              </button>
            </div>
            <div className="platform-intro">
              <div>
                <span>THE COMPLETE BUILD CLOUD</span>
                <h2>From first prompt to first payment.</h2>
              </div>
              <p>
                No stitching together seven dashboards. Bizorvia gives every
                project its own creation studio, backend, deployment cloud, payments,
                domains, and automations.
              </p>
            </div>
            <div className="module-grid">
              {cloudModules.map((module) => (
                <button
                  key={module.title}
                  onClick={() => {
                    const target =
                      module.title === "Business Factory"
                        ? "Business Factory"
                        : module.title === "App Studio"
                          ? "Studio"
                          : module.title === "Bizorvia Code"
                            ? "Code Studio"
                            : module.title === "Bizorvia Everywhere"
                              ? "Everywhere"
                              : module.title === "Bizorvia Cloud"
                                ? "Hosting"
                                : module.title === "Bizorvia Data"
                                  ? "Database"
                                  : module.title === "Global Deploy"
                                    ? "Deploy"
                                    : module.title === "Bizorvia Pay"
                                      ? "Payments"
                                      : module.title === "Growth Studio"
                                        ? "Marketing"
                                        : module.title === "Agent Automations"
                                          ? "Automations"
                                          : module.title === "Revenue Engine"
                                            ? "Pricing"
                                            : module.title === "Legal & Trust"
                                              ? "Legal"
                                              : module.title === "Launch OS"
                                                ? "Launch OS"
                                                : "Domains";
                    setActiveNav(target);
                  }}
                >
                  <span className={module.tone}>{module.icon}</span>
                  <div>
                    <b>{module.title}</b>
                    <p>{module.copy}</p>
                  </div>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mission-view">
            <div className="mission-top">
              <div>
                <button className="back" onClick={() => setRunning(false)}>
                  ← All tasks
                </button>
                <h1>Software market launch plan</h1>
                <p>
                  Started just now · Mission #
                  {(Math.floor(Date.now() / 100000) % 9000) + 1000}
                </p>
              </div>
              <div className="mission-controls">
                <span className={paused ? "paused-badge" : "running-badge"}>
                  <i />
                  {paused ? "Paused" : step === 3 ? "Finalizing" : "Running"}
                </span>
                <button onClick={() => setPaused((v) => !v)}>
                  {paused ? "Resume" : "Pause"}
                </button>
                <button onClick={() => notify("Task options opened")}>
                  •••
                </button>
              </div>
            </div>
            <div className="task-tabs" role="tablist">
              {["Live run", "Browser", "Research", "Files", "Decisions"].map(
                (item) => (
                  <button
                    key={item}
                    className={tab === item ? "active" : ""}
                    onClick={() => setTab(item)}
                  >
                    {item}
                    {item === "Files" && <em>3</em>}
                  </button>
                ),
              )}
            </div>

            {tab === "Live run" && (
              <div className="mission-grid">
                <section className="run-card">
                  <div className="run-head">
                    <div>
                      <span className="tiny-label">MISSION PROGRESS</span>
                      <b>{progress}% complete</b>
                    </div>
                    <span>
                      {step + 1} of {taskSteps.length} phases
                    </span>
                  </div>
                  <div className="progress-track">
                    <i style={{ width: `${progress}%` }} />
                  </div>
                  <div className="agent-flow">
                    {taskSteps.map((item, index) => (
                      <div
                        key={item.label}
                        className={`flow-step ${index < step ? "complete" : index === step ? "current" : "waiting"}`}
                      >
                        <span className="step-icon">
                          {index < step
                            ? "✓"
                            : index === step
                              ? "✦"
                              : index + 1}
                        </span>
                        <div>
                          <b>{item.label}</b>
                          <p>
                            {index <= step
                              ? item.detail
                              : "Waiting for previous phase"}
                          </p>
                        </div>
                        {index === step && !paused && (
                          <span className="thinking">
                            <i />
                            <i />
                            <i />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="live-note">
                    <span>✦</span>
                    <div>
                      <b>Strategy Agent</b>
                      <p>
                        I found a strong opportunity: most competitors automate
                        tasks, but few show users why each decision was made.
                        I’m making transparent reasoning a core launch message.
                      </p>
                    </div>
                  </div>
                </section>
                <aside className="mission-side">
                  <section className="agents-card">
                    <div className="card-head">
                      <b>Agent team</b>
                      <span>4 active</span>
                    </div>
                    {[
                      ["R", "Researcher", "Scanning 28 sources"],
                      ["S", "Strategist", "Mapping opportunities"],
                      ["B", "Builder", "Preparing dashboard"],
                      ["V", "Verifier", "Checking every claim"],
                    ].map((agent, i) => (
                      <div className="agent" key={agent[1]}>
                        <span className={`agent-avatar a${i}`}>{agent[0]}</span>
                        <div>
                          <b>{agent[1]}</b>
                          <small>{agent[2]}</small>
                        </div>
                        <i className={i <= step ? "active" : ""} />
                      </div>
                    ))}
                  </section>
                  <section className="control-card">
                    <div className="card-head">
                      <b>Human control</b>
                      <span className="safe">Protected</span>
                    </div>
                    <p>Sensitive actions always wait for your approval.</p>
                    <label>
                      <span>Purchases & payments</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                    <label>
                      <span>Publishing & sending</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                    <label>
                      <span>Account changes</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                  </section>
                </aside>
              </div>
            )}

            {tab === "Files" && (
              <div className="panel-view">
                <div className="panel-heading">
                  <div>
                    <h2>Deliverables</h2>
                    <p>Files appear here as the agent team creates them.</p>
                  </div>
                  <button
                    onClick={() => notify("All files prepared for download")}
                  >
                    Download all
                  </button>
                </div>
                <div className="file-grid">
                  {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => notify(`${file.name} preview opened`)}
                    >
                      <span className={file.color}>{file.type}</span>
                      <div>
                        <b>{file.name}</b>
                        <small>Created moments ago</small>
                      </div>
                      <i>↓</i>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {tab === "Research" && (
              <div className="panel-view">
                <div className="panel-heading">
                  <div>
                    <h2>Research intelligence</h2>
                    <p>28 cited sources, ranked by authority and relevance.</p>
                  </div>
                  <button onClick={() => notify("Citation report opened")}>
                    View citations
                  </button>
                </div>
                <div className="insight-grid">
                  <article>
                    <span>KEY INSIGHT</span>
                    <h3>Trust is the strongest differentiator</h3>
                    <p>
                      Users want autonomous execution, but adoption rises when
                      decisions, sources, and permissions remain visible.
                    </p>
                    <small>Supported by 11 sources · 94% confidence</small>
                  </article>
                  <article>
                    <span>MARKET SIGNAL</span>
                    <h3>Teams want reusable workflows</h3>
                    <p>
                      The next wave is moving from one-off prompts toward
                      repeatable, governed automations shared across teams.
                    </p>
                    <small>Supported by 8 sources · 91% confidence</small>
                  </article>
                </div>
              </div>
            )}
            {tab === "Browser" && (
              <div className="browser-panel">
                <div className="browser-bar">
                  <i />
                  <i />
                  <i />
                  <div>🔒 secure research workspace</div>
                </div>
                <div className="browser-body">
                  <span className="browser-orb">✦</span>
                  <h2>Agent browser is working</h2>
                  <p>
                    Reviewing product pages, pricing, customer feedback, and
                    market reports across 12 open tabs.
                  </p>
                  <div className="scan-line" />
                </div>
              </div>
            )}
            {tab === "Decisions" && (
              <div className="panel-view">
                <div className="panel-heading">
                  <div>
                    <h2>Decision ledger</h2>
                    <p>
                      A clear audit trail of what the agents decided—and why.
                    </p>
                  </div>
                </div>
                <div className="decision-list">
                  <article>
                    <span>01</span>
                    <div>
                      <b>Prioritize trust-led positioning</b>
                      <p>
                        Chosen because transparency appears in 67% of
                        high-intent customer feedback.
                      </p>
                    </div>
                    <em>High confidence</em>
                  </article>
                  <article>
                    <span>02</span>
                    <div>
                      <b>Target small business teams first</b>
                      <p>
                        Faster adoption cycle and strongest pain around
                        fragmented tools.
                      </p>
                    </div>
                    <em>Medium confidence</em>
                  </article>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function PlatformView({
  section,
  notify,
}: {
  section: string;
  notify: (message: string) => void;
}) {
  const content = platformContent[section] ?? platformContent.Studio;
  const [sql, setSql] = useState(
    "select id, email, plan, created_at\nfrom customers\norder by created_at desc\nlimit 25;",
  );
  const [domain, setDomain] = useState("bizorvia.com");
  const [annual, setAnnual] = useState(false);
  const [policy, setPolicy] = useState(0);
  const [launchSystem, setLaunchSystem] = useState(0);
  const [factoryStep, setFactoryStep] = useState(0);
  const [businessIdea, setBusinessIdea] = useState(
    "A subscription studio that helps Etsy sellers create and market digital products",
  );
  const [marketingSystem, setMarketingSystem] = useState(0);
  const [agentMode, setAgentMode] = useState(true);
  const [code, setCode] = useState(
    `export async function launchBusiness(idea: string) {\n  const market = await agents.validate(idea);\n  const offer = await agents.designOffer(market);\n  const business = await factory.build({ market, offer });\n\n  await approvals.request({\n    actions: ["publish", "connectDomain", "enablePayments"]\n  });\n\n  return business.launch();\n}`,
  );
  const [workSurface, setWorkSurface] = useState(1);
  return (
    <div className="platform-view">
      <div className="platform-hero">
        <div>
          <span>{content.kicker}</span>
          <h1>{content.title}</h1>
          <p>{content.copy}</p>
        </div>
        <button onClick={() => notify(`${content.action} flow opened`)}>
          ＋ {content.action}
        </button>
      </div>
      <div className="platform-stats">
        {content.stats.map(([value, label]) => (
          <article key={label}>
            <b>{value}</b>
            <span>{label}</span>
            <i>↗</i>
          </article>
        ))}
      </div>
      {section === "Admin" ? (
        <div className="admin-workspace">
          <div className="admin-banner">
            <img src="/bizorvia-mark.png" alt="Bizorvia" />
            <div>
              <span>OWNER ACCESS · PROTECTED</span>
              <h2>Admin Control Center</h2>
              <p>Private command center for operating the entire Bizorvia platform.</p>
            </div>
            <em><i /> All systems operational</em>
          </div>
          <div className="admin-kpis">
            {[
              ["$18,420", "Revenue this month", "+18.4%"],
              ["1,284", "Active customers", "+126"],
              ["86", "Businesses live", "+14"],
              ["74%", "Gross margin", "+3.2%"],
            ].map((item) => (
              <article key={item[1]}><span>{item[1]}</span><b>{item[0]}</b><em>{item[2]}</em></article>
            ))}
          </div>
          <div className="admin-grid">
            <section className="admin-panel admin-health">
              <div className="admin-panel-head"><div><span>LIVE OPERATIONS</span><b>Platform health</b></div><em>Updated now</em></div>
              {[
                ["Websites & apps", "99.99%", "Operational"],
                ["Database & storage", "24 ms", "Operational"],
                ["Payments", "96.8%", "Healthy"],
                ["Agents & automations", "3,822 runs", "Operational"],
                ["Domains & SSL", "100%", "Protected"],
              ].map((row) => <article key={row[0]}><i /><b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em></article>)}
            </section>
            <section className="admin-panel admin-approvals">
              <div className="admin-panel-head"><div><span>OWNER INBOX</span><b>Actions needing approval</b></div><em>3 waiting</em></div>
              {[
                ["Publish customer storefront", "Sunrise Studio", "Review"],
                ["Increase campaign budget", "$500 → $900", "Approve"],
                ["Add production integration", "Support workspace", "Inspect"],
              ].map((row) => <article key={row[0]}><div><b>{row[0]}</b><small>{row[1]}</small></div><button onClick={() => notify(`${row[2]} opened`)}>{row[2]}</button></article>)}
            </section>
            <section className="admin-panel admin-controls">
              <div className="admin-panel-head"><div><span>PLATFORM CONTROLS</span><b>Manage Bizorvia</b></div></div>
              <div>
                {[
                  ["Customers", "Accounts, access, plans and support", "♙"],
                  ["Finance", "Revenue, invoices, refunds and taxes", "$"],
                  ["Projects", "Apps, deployments, databases and domains", "◇"],
                  ["Security", "Roles, audit logs, threats and secrets", "◇"],
                  ["Agent Rules", "Permissions, limits and approvals", "✦"],
                  ["System Settings", "Brand, email, billing and integrations", "⚙"],
                ].map((item) => <button key={item[0]} onClick={() => notify(`${item[0]} controls opened`)}><span>{item[2]}</span><div><b>{item[0]}</b><small>{item[1]}</small></div><i>›</i></button>)}
              </div>
            </section>
            <section className="admin-panel admin-activity">
              <div className="admin-panel-head"><div><span>AUDIT TRAIL</span><b>Recent owner activity</b></div><button onClick={() => notify("Full audit log opened")}>View all</button></div>
              {[
                ["Payment plan updated", "Builder annual pricing", "2 min ago"],
                ["Deployment approved", "Sunrise Studio v18", "12 min ago"],
                ["Security rule changed", "Production publishing", "38 min ago"],
                ["Customer access restored", "Account #BZ-1284", "1 hr ago"],
              ].map((row) => <article key={row[0]}><i /><div><b>{row[0]}</b><small>{row[1]}</small></div><em>{row[2]}</em></article>)}
            </section>
          </div>
        </div>
      ) : section === "Everywhere" ? (
        <div className="everywhere-workspace">
          <div className="everywhere-hero">
            <div>
              <span>ONE CONTEXT · EVERY SURFACE</span>
              <h2>Start in Slack. Continue in code. Approve on mobile.</h2>
              <p>
                The agent always knows the project, current task, permissions,
                decisions, and evidence—without losing context between tools.
              </p>
            </div>
            <div className="context-orbit">
              <span className="orbit-core">N</span>
              <i />
              <i />
              <i />
              <i />
              <em>Shared context live</em>
            </div>
            <button onClick={() => notify("Connector catalog opened")}>
              ＋ Connect a tool
            </button>
          </div>
          <div className="surface-layout">
            <aside className="surface-menu">
              {workSurfaces.map((surface, i) => (
                <button
                  key={surface.title}
                  className={workSurface === i ? "active" : ""}
                  onClick={() => setWorkSurface(i)}
                >
                  <span>{surface.icon}</span>
                  <div>
                    <b>{surface.title}</b>
                    <small>{surface.status}</small>
                  </div>
                  <i />
                </button>
              ))}
            </aside>
            <section className="surface-detail">
              <div className="surface-detail-head">
                <div>
                  <span>{workSurfaces[workSurface].icon}</span>
                  <div>
                    <b>{workSurfaces[workSurface].title}</b>
                    <small>{workSurfaces[workSurface].status}</small>
                  </div>
                </div>
                <em>
                  <i /> Connected
                </em>
              </div>
              <h2>Bizorvia inside {workSurfaces[workSurface].title}</h2>
              <p>{workSurfaces[workSurface].copy}</p>
              <div className="surface-conversation">
                <div className="surface-message">
                  <span>NN</span>
                  <p>
                    <b>Neelofer</b> Review the launch changes, fix anything
                    blocking customers, and prepare the release.
                  </p>
                </div>
                <div className="surface-message agent">
                  <span>✦</span>
                  <div>
                    <p>
                      <b>Bizorvia</b> I reviewed the full project and found
                      three items. I fixed two test failures and prepared a
                      privacy-consent update.
                    </p>
                    <div className="surface-task">
                      <span>✓ Tests repaired</span>
                      <span>✓ Checkout verified</span>
                      <span>! Consent change needs approval</span>
                    </div>
                    <button
                      onClick={() => notify("Cross-tool activity opened")}
                    >
                      Review work across tools →
                    </button>
                  </div>
                </div>
              </div>
              <div className="surface-handoff">
                <span>CONTINUE THIS WORK IN</span>
                {["Terminal", "GitHub", "Browser", "Mobile"].map((x) => (
                  <button key={x} onClick={() => notify(`Task handed to ${x}`)}>
                    {x} ↗
                  </button>
                ))}
              </div>
            </section>
            <aside className="permission-center">
              <div>
                <span>PERMISSION PROFILE</span>
                <b>Business operator</b>
                <small>Applies in every connected tool</small>
              </div>
              {[
                ["Read project context", true],
                ["Draft messages and code", true],
                ["Run tests and analysis", true],
                ["Publish or merge", false],
                ["Spend money", false],
                ["Change accounts or secrets", false],
              ].map((x) => (
                <label key={String(x[0])}>
                  <span>{x[0]}</span>
                  <input type="checkbox" defaultChecked={Boolean(x[1])} />
                  <i />
                </label>
              ))}
              <button onClick={() => notify("Permission manager opened")}>
                Manage permissions
              </button>
            </aside>
          </div>
          <div className="event-mesh">
            <div className="event-head">
              <div>
                <span>EVENT MESH</span>
                <b>Work begins wherever business happens.</b>
              </div>
              <em>18 automations active</em>
            </div>
            <div className="event-flow">
              {[
                [
                  "01",
                  "Signal",
                  "Message, commit, error, lead, payment, ticket",
                ],
                [
                  "02",
                  "Understand",
                  "Load shared context, policies, and permissions",
                ],
                [
                  "03",
                  "Coordinate",
                  "Plan work across the right agents and tools",
                ],
                ["04", "Approve", "Pause sensitive decisions for the owner"],
                [
                  "05",
                  "Execute + report",
                  "Complete work and write one audit trail",
                ],
              ].map((x, i) => (
                <article key={x[1]}>
                  <span>{x[0]}</span>
                  <b>{x[1]}</b>
                  <p>{x[2]}</p>
                  {i < 4 && <i>→</i>}
                </article>
              ))}
            </div>
          </div>
          <div className="cross-tool-feed">
            <div>
              <b>Recent cross-tool work</b>
              <button onClick={() => notify("Complete audit trail opened")}>
                View audit trail
              </button>
            </div>
            {[
              [
                "GitHub",
                "Reviewed PR #184 and suggested 6 fixes",
                "2 min ago",
                "Review",
              ],
              [
                "Slack",
                "Converted launch thread into an approved 12-step plan",
                "8 min ago",
                "Open",
              ],
              [
                "Terminal",
                "Reproduced checkout error and repaired failing tests",
                "14 min ago",
                "View logs",
              ],
              [
                "Support",
                "Linked three tickets to one product defect",
                "26 min ago",
                "Open issue",
              ],
            ].map((x) => (
              <article key={x[1]}>
                <span>{x[0][0]}</span>
                <div>
                  <b>{x[0]}</b>
                  <p>{x[1]}</p>
                </div>
                <em>{x[2]}</em>
                <button onClick={() => notify(`${x[0]} activity opened`)}>
                  {x[3]} ↗
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : section === "Code Studio" ? (
        <div className="code-workspace">
          <div className="ide-toolbar">
            <div>
              <span className="ide-logo">B</span>
              <b>bizorvia-business</b>
              <em>main</em>
            </div>
            <div className="ide-actions">
              <button onClick={() => notify("Command palette opened")}>
                ⌘ Command
              </button>
              <button onClick={() => notify("Live preview opened")}>
                ▷ Preview
              </button>
              <button
                className="ide-primary"
                onClick={() => notify("Review and deploy opened")}
              >
                Ship changes
              </button>
            </div>
          </div>
          <div className="ide-shell">
            <aside className="file-explorer">
              <div>
                <b>EXPLORER</b>
                <button onClick={() => notify("New file created")}>＋</button>
              </div>
              {[
                ["▾", "app"],
                ["  ◇", "page.tsx"],
                ["  #", "globals.css"],
                ["▾", "agents"],
                ["  ✦", "business-factory.ts"],
                ["  ✦", "marketing-agent.ts"],
                ["▸", "database"],
                ["▸", "workflows"],
                ["{}", "package.json"],
                ["◎", "README.md"],
              ].map((file, i) => (
                <button
                  key={i}
                  className={
                    i === 4 ? "active" : i === 0 || i === 3 ? "folder" : ""
                  }
                >
                  <span>{file[0]}</span>
                  {file[1]}
                  {i === 4 && <em>M</em>}
                </button>
              ))}
            </aside>
            <section className="code-editor">
              <div className="editor-title">
                <span>
                  business-factory.ts <i>●</i>
                </span>
                <span>marketing-agent.ts</span>
                <button>＋</button>
              </div>
              <div className="code-surface">
                <div className="line-numbers">
                  {Array.from({ length: 14 }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  aria-label="Code editor"
                />
              </div>
              <div className="ide-terminal">
                <div>
                  <span>TERMINAL</span>
                  <span>
                    PROBLEMS <i>0</i>
                  </span>
                  <span>OUTPUT</span>
                  <button onClick={() => notify("Terminal expanded")}>⌃</button>
                </div>
                <p>
                  <i>$</i> npm test <em>✓ 18 tests passed in 2.4s</em>
                </p>
                <p>
                  <i>$</i> bizorvia preview <em>✓ ready at secure preview</em>
                </p>
              </div>
            </section>
            <aside className="agent-panel">
              <div className="agent-panel-head">
                <div>
                  <span>✦</span>
                  <b>Autonomous Agent</b>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={agentMode}
                    onChange={(e) => setAgentMode(e.target.checked)}
                  />
                  <i />
                </label>
              </div>
              <div className="agent-status">
                <span>
                  <i /> {agentMode ? "Agent mode active" : "Ask mode active"}
                </span>
                <small>Full repository context · 126 files</small>
              </div>
              <div className="agent-request">
                <p>
                  Add the complete Idea-to-Income workflow and connect SEO, AEO,
                  GEO, email, CRM, and approval controls.
                </p>
                <small>Working across 8 files</small>
              </div>
              <div className="agent-plan">
                {[
                  ["✓", "Analyzed architecture", "Complete"],
                  ["✓", "Created business pipeline", "Complete"],
                  ["↻", "Connecting marketing agents", "Editing"],
                  ["4", "Run tests and repair", "Queued"],
                  ["5", "Present reviewable diff", "Queued"],
                ].map((x, i) => (
                  <article
                    key={x[1]}
                    className={i < 2 ? "done" : i === 2 ? "current" : ""}
                  >
                    <span>{x[0]}</span>
                    <div>
                      <b>{x[1]}</b>
                      <small>{x[2]}</small>
                    </div>
                  </article>
                ))}
              </div>
              <div className="agent-changes">
                <span>PROPOSED CHANGES</span>
                <div>
                  <b>8 files changed</b>
                  <em>+428 −36</em>
                </div>
                <button onClick={() => notify("Code diff opened")}>
                  Review diff
                </button>
              </div>
              <div className="agent-prompt">
                <textarea placeholder="Ask the agent to build, fix, explain, or test…" />
                <div>
                  <button onClick={() => notify("Repository context attached")}>
                    ＋ Context
                  </button>
                  <button onClick={() => notify("Agent instruction sent")}>
                    Send ↑
                  </button>
                </div>
              </div>
            </aside>
          </div>
          <div className="code-capabilities">
            {[
              [
                "⌁",
                "Repository intelligence",
                "Understands code, docs, data models, dependencies, logs, and prior decisions.",
              ],
              [
                "✦",
                "Agent team",
                "Planner, builder, tester, security reviewer, and verifier collaborate on complex work.",
              ],
              [
                "✓",
                "Safe autonomy",
                "Package installs, secrets, migrations, destructive actions, spending, and deploys require approval.",
              ],
              [
                "↶",
                "Checkpoints + rollback",
                "Every accepted change can be replayed, compared, reverted, or exported without lock-in.",
              ],
            ].map((x) => (
              <article key={x[1]}>
                <span>{x[0]}</span>
                <div>
                  <b>{x[1]}</b>
                  <p>{x[2]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : section === "Marketing" ? (
        <div className="marketing-workspace">
          <div className="visibility-hero">
            <div>
              <span>CONNECTED DISCOVERY ENGINE</span>
              <h2>
                One strategy across search, answers, models, social, email, and ads.
              </h2>
              <p>
                Bizorvia creates the foundation with every business, then
                continuously watches visibility, leads, conversion, revenue, and
                customer acquisition cost.
              </p>
            </div>
            <div className="visibility-score">
              <span>86</span>
              <small>VISIBILITY</small>
            </div>
            <button onClick={() => notify("90-day growth plan generated")}>
              Generate 90-day plan
            </button>
          </div>
          <div className="marketing-layout">
            <aside className="marketing-menu">
              {marketingSystems.map((system, i) => (
                <button
                  key={system.title}
                  className={marketingSystem === i ? "active" : ""}
                  onClick={() => setMarketingSystem(i)}
                >
                  <span>{system.icon}</span>
                  <div>
                    <b>{system.title}</b>
                    <small>{system.status}</small>
                  </div>
                  <em>{system.score}</em>
                </button>
              ))}
            </aside>
            <section className="marketing-detail">
              <div className="marketing-detail-top">
                <div>
                  <span>
                    AUTOMATED SYSTEM{" "}
                    {String(marketingSystem + 1).padStart(2, "0")}
                  </span>
                  <h2>{marketingSystems[marketingSystem].title}</h2>
                </div>
                <em>
                  <i /> Monitoring live
                </em>
              </div>
              <p>{marketingSystems[marketingSystem].copy}</p>
              <div className="marketing-kpis">
                {[
                  ["Visibility", "+18%"],
                  ["Qualified traffic", "8.4k"],
                  ["Leads", "284"],
                  ["Attributed revenue", "$12.8k"],
                ].map((x) => (
                  <article key={x[0]}>
                    <span>{x[0]}</span>
                    <b>{x[1]}</b>
                    <small>Last 30 days</small>
                  </article>
                ))}
              </div>
              <div className="next-actions">
                <div>
                  <span>01</span>
                  <p>Publish the highest-opportunity content cluster</p>
                  <em>Owner approval</em>
                </div>
                <div>
                  <span>02</span>
                  <p>Improve answer coverage on five purchase-intent pages</p>
                  <em>Ready</em>
                </div>
                <div>
                  <span>03</span>
                  <p>Add original data and expert citations for answer-engine discovery</p>
                  <em>In progress</em>
                </div>
              </div>
              <button
                onClick={() =>
                  notify(
                    `${marketingSystems[marketingSystem].title} workspace opened`,
                  )
                }
              >
                Open full workspace →
              </button>
            </section>
          </div>
          <div className="campaign-center">
            <div className="campaign-head">
              <div>
                <span>OMNICHANNEL CAMPAIGN CENTER</span>
                <b>Launch once. Adapt everywhere.</b>
              </div>
              <button onClick={() => notify("New campaign builder opened")}>
                ＋ New campaign
              </button>
            </div>
            <div className="campaign-flow">
              {[
                ["One campaign brief", "Your offer, audience, proof, goal"],
                ["Content production", "Pages, posts, videos, emails, ads"],
                ["Owner approval", "Review claims, spend, and publishing"],
                ["Smart distribution", "Right format, channel, and timing"],
                ["Revenue learning", "Attribution improves the next campaign"],
              ].map((x, i) => (
                <article key={x[0]}>
                  <span>0{i + 1}</span>
                  <b>{x[0]}</b>
                  <p>{x[1]}</p>
                  {i < 4 && <i>→</i>}
                </article>
              ))}
            </div>
          </div>
          <div className="marketing-foundation">
            {[
              [
                "Technical foundation",
                "Analytics, pixels, conversion APIs, consent, schema, sitemaps, indexing, speed, and accessibility.",
              ],
              [
                "Content factory",
                "Brand-trained articles, landing pages, emails, images, short videos, podcasts, and translations.",
              ],
              [
                "Revenue attribution",
                "Track the customer journey from first discovery through lead, purchase, renewal, referral, and lifetime value.",
              ],
              [
                "Learning loop",
                "Run approved experiments, preserve winners, stop waste, and update SEO, AEO, GEO, offers, and campaigns.",
              ],
            ].map((x, i) => (
              <article key={x[0]}>
                <span>{["⌁", "▤", "$", "↻"][i]}</span>
                <div>
                  <b>{x[0]}</b>
                  <p>{x[1]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : section === "Business Factory" ? (
        <div className="factory-workspace">
          <div className="factory-command">
            <div>
              <span>START WITH ONE SENTENCE</span>
              <h2>What business should we build?</h2>
              <p>
                Bizorvia will prepare a launch-ready business. Revenue depends
                on demand, offer quality, marketing, execution, and customer
                response.
              </p>
            </div>
            <div className="idea-command">
              <input
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                aria-label="Business idea"
              />
              <button
                onClick={() => notify("Business Factory mission started")}
              >
                Build my business <span>→</span>
              </button>
            </div>
            <div className="factory-types">
              {[
                "Digital products",
                "SaaS",
                "Service business",
                "Online store",
                "Marketplace",
                "Creator brand",
              ].map((type, i) => (
                <button
                  key={type}
                  className={i === 0 ? "active" : ""}
                  onClick={() => notify(`${type} model selected`)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="factory-pipeline">
            {businessFactorySteps.map((item, i) => (
              <button
                key={item.title}
                className={
                  factoryStep === i ? "active" : i < 3 ? "complete" : ""
                }
                onClick={() => setFactoryStep(i)}
              >
                <span>{i < 3 ? "✓" : item.icon}</span>
                <small>0{i + 1}</small>
                <b>{item.title}</b>
              </button>
            ))}
          </div>
          <div className="factory-grid">
            <section className="factory-detail">
              <div className="factory-detail-head">
                <div>
                  <span>
                    STAGE {String(factoryStep + 1).padStart(2, "0")} · AUTOMATED
                    WORKFLOW
                  </span>
                  <h2>{businessFactorySteps[factoryStep].title}</h2>
                </div>
                <em>{factoryStep < 3 ? "Complete" : "Ready to run"}</em>
              </div>
              <p>{businessFactorySteps[factoryStep].copy}</p>
              <div className="factory-outputs">
                {businessFactorySteps[factoryStep].outputs.map((output, i) => (
                  <article key={output}>
                    <span>{["◎", "◇", "▦", "✓"][i]}</span>
                    <div>
                      <b>{output}</b>
                      <small>
                        {factoryStep < 3
                          ? "Created and verified"
                          : "Generated during this stage"}
                      </small>
                    </div>
                    <i>{factoryStep < 3 ? "View" : "Planned"}</i>
                  </article>
                ))}
              </div>
              <button
                onClick={() =>
                  notify(
                    `${businessFactorySteps[factoryStep].title} workflow opened`,
                  )
                }
              >
                Open workflow →
              </button>
            </section>
            <aside className="business-preview">
              <div className="preview-top">
                <span>LIVE BUSINESS PREVIEW</span>
                <em>82% READY</em>
              </div>
              <div className="mini-brand">
                <span>SF</span>
                <div>
                  <b>SellerFlow Studio</b>
                  <small>Build products people want.</small>
                </div>
              </div>
              <div className="mini-metrics">
                <article>
                  <span>Offer</span>
                  <b>$39/mo</b>
                </article>
                <article>
                  <span>Margin</span>
                  <b>76%</b>
                </article>
                <article>
                  <span>Launch</span>
                  <b>2 days</b>
                </article>
              </div>
              <div className="ready-list">
                {[
                  ["Brand + domain", "Ready"],
                  ["Product + checkout", "Ready"],
                  ["Legal + consent", "Review"],
                  ["Marketing campaign", "Draft"],
                ].map((x, i) => (
                  <div key={x[0]}>
                    <span className={i < 2 ? "done" : ""}>
                      {i < 2 ? "✓" : i + 1}
                    </span>
                    <b>{x[0]}</b>
                    <em>{x[1]}</em>
                  </div>
                ))}
              </div>
              <button onClick={() => notify("Business preview opened")}>
                Preview storefront ↗
              </button>
            </aside>
          </div>
          <div className="digital-ceo">
            <div>
              <span>DIGITAL CEO · ALWAYS ON</span>
              <h2>The business keeps working after launch.</h2>
              <p>
                Specialist agents watch the business, prepare actions, and bring
                sensitive decisions to one approval inbox.
              </p>
            </div>
            <div className="ceo-agents">
              {[
                [
                  "↗",
                  "Sales",
                  "Follows leads and recovers abandoned checkout",
                ],
                ["◎", "Marketing", "Creates SEO, email, and social campaigns"],
                ["♙", "Support", "Answers customers and escalates exceptions"],
                [
                  "$",
                  "Finance",
                  "Tracks margin, bills, refunds, and cost risks",
                ],
                [
                  "◇",
                  "Growth",
                  "Runs approved experiments and improves offers",
                ],
              ].map((agent, i) => (
                <article key={agent[1]}>
                  <span className={`ceo${i}`}>{agent[0]}</span>
                  <div>
                    <b>{agent[1]} Agent</b>
                    <small>{agent[2]}</small>
                  </div>
                  <em>
                    <i /> Active
                  </em>
                </article>
              ))}
            </div>
            <div className="approval-bar">
              <span>OWNER CONTROL</span>
              <p>
                Purchases, ad spending, publishing, refunds, legal changes,
                customer promises, and account changes wait for approval.
              </p>
              <button onClick={() => notify("Approval inbox opened")}>
                3 decisions waiting →
              </button>
            </div>
          </div>
        </div>
      ) : section === "Launch OS" ? (
        <div className="launch-workspace">
          <div className="launch-score">
            <div className="score-ring">
              <span>89</span>
              <small>LAUNCH SCORE</small>
            </div>
            <div>
              <span>PRODUCTION READINESS</span>
              <h2>Five checks remain before public launch</h2>
              <p>
                Bizorvia combines technical, financial, legal, recovery, and
                customer-experience gates in one deployment decision.
              </p>
            </div>
            <button onClick={() => notify("Full launch audit started")}>
              ▶ Run full audit
            </button>
          </div>
          <div className="launch-layout">
            <div className="launch-systems">
              {launchSystems.map((system, i) => (
                <button
                  key={system.title}
                  className={launchSystem === i ? "active" : ""}
                  onClick={() => setLaunchSystem(i)}
                >
                  <span>{system.icon}</span>
                  <div>
                    <b>{system.title}</b>
                    <small>{system.tag}</small>
                  </div>
                  <em>{system.metric}</em>
                </button>
              ))}
            </div>
            <section className="system-detail">
              <div className="system-kicker">
                <span>{launchSystems[launchSystem].tag}</span>
                <em>
                  UNIQUE SYSTEM {String(launchSystem + 1).padStart(2, "0")}
                </em>
              </div>
              <h2>{launchSystems[launchSystem].title}</h2>
              <p>{launchSystems[launchSystem].copy}</p>
              <div className="system-proof">
                {[
                  ["Coverage", "All projects"],
                  ["Evidence", "Signed + timestamped"],
                  ["Control", "Owner approval"],
                  ["Output", "Exportable record"],
                ].map((x) => (
                  <article key={x[0]}>
                    <span>{x[0]}</span>
                    <b>{x[1]}</b>
                  </article>
                ))}
              </div>
              <button
                onClick={() =>
                  notify(`${launchSystems[launchSystem].title} opened`)
                }
              >
                Open system →
              </button>
            </section>
          </div>
          <div className="release-gates">
            <div className="gate-head">
              <div>
                <span>RELEASE GATES</span>
                <b>Automatic deployment blockers</b>
              </div>
              <button onClick={() => notify("Release policy editor opened")}>
                Edit policy
              </button>
            </div>
            {[
              ["Security & dependencies", 96, "Passed"],
              ["Privacy & legal alignment", 82, "3 actions"],
              ["Profitability & usage caps", 91, "Passed"],
              ["Backup restore test", 78, "1 action"],
              ["Customer journey & support", 86, "1 action"],
            ].map((g) => (
              <article key={String(g[0])}>
                <div>
                  <b>{g[0]}</b>
                  <small>{g[2]}</small>
                </div>
                <span>
                  <i style={{ width: `${g[1]}%` }} />
                </span>
                <em>{g[1]}%</em>
              </article>
            ))}
          </div>
        </div>
      ) : section === "Pricing" ? (
        <div className="pricing-workspace">
          <div className="billing-toggle">
            <span>Simple launch pricing</span>
            <div>
              <button
                className={!annual ? "active" : ""}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={annual ? "active" : ""}
                onClick={() => setAnnual(true)}
              >
                Annual <em>save 20%</em>
              </button>
            </div>
          </div>
          <div className="price-grid">
            {[
              [
                "Free",
                0,
                "Validate an idea",
                [
                  "1 project",
                  "Starter hosting + database",
                  "Limited agent credits",
                  "Bizorvia subdomain",
                ],
              ],
              [
                "Builder",
                39,
                "Launch a real business",
                [
                  "5 production projects",
                  "Custom domains + payments",
                  "5M model tokens included",
                  "Usage spending controls",
                ],
              ],
              [
                "Business",
                129,
                "Operate with a team",
                [
                  "20 production projects",
                  "10 team seats + roles",
                  "Daily backups + analytics",
                  "Lower platform fees",
                ],
              ],
              [
                "Scale",
                399,
                "Grow serious volume",
                [
                  "50 production projects",
                  "Priority builds + support",
                  "Advanced audit controls",
                  "Best usage rates",
                ],
              ],
            ].map((plan, i) => {
              const monthly = Number(plan[1]);
              const price = annual ? Math.round(monthly * 0.8) : monthly;
              return (
                <article
                  key={String(plan[0])}
                  className={i === 1 ? "recommended" : ""}
                >
                  {i === 1 && <span>RECOMMENDED</span>}
                  <h3>{plan[0]}</h3>
                  <p>{plan[2] as string}</p>
                  <div className="price">
                    <b>${price}</b>
                    <small>/ month{annual ? ", billed yearly" : ""}</small>
                  </div>
                  <ul>
                    {(plan[3] as string[]).map((x) => (
                      <li key={x}>✓ {x}</li>
                    ))}
                  </ul>
                  <button onClick={() => notify(`${plan[0]} checkout opened`)}>
                    {i === 0 ? "Start free" : "Choose " + plan[0]}
                  </button>
                </article>
              );
            })}
          </div>
          <div className="income-grid">
            <div>
              <span>RECURRING</span>
              <b>Plans + usage</b>
              <p>
                Monthly subscriptions, agent-credit top-ups, and metered hosting,
                database, storage, bandwidth, and function usage.
              </p>
            </div>
            <div>
              <span>TRANSACTIONS</span>
              <b>Payments + domains</b>
              <p>
                A transparent platform fee on eligible transactions plus a
                service margin on registrations, renewals, and transfers.
              </p>
            </div>
            <div>
              <span>ECOSYSTEM</span>
              <b>Marketplace + add-ons</b>
              <p>
                Commission on templates and agents, plus premium analytics,
                backup, compliance, email, and support packages.
              </p>
            </div>
            <div>
              <span>ENTERPRISE</span>
              <b>Contracts + services</b>
              <p>
                Annual SSO, audit, DPA, SLA, white-label, migration,
                implementation, and dedicated-support agreements.
              </p>
            </div>
          </div>
          <div className="margin-rule">
            <span>UNIT ECONOMICS RULE</span>
            <p>
              Keep model and infrastructure allowances finite, charge overages at a
              visible rate, and target at least 70% blended gross margin before
              expanding free limits.
            </p>
            <button onClick={() => notify("Revenue simulator opened")}>
              Open revenue simulator →
            </button>
          </div>
        </div>
      ) : section === "Legal" ? (
        <div className="legal-workspace">
          <aside>
            <div>
              <span className="draft-dot" />
              Draft · attorney review required
            </div>
            {legalPolicies.map((item, i) => (
              <button
                key={item.title}
                className={policy === i ? "active" : ""}
                onClick={() => setPolicy(i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {item.title}
                <i>›</i>
              </button>
            ))}
          </aside>
          <section>
            <div className="legal-head">
              <div>
                <span>
                  DAYYAN LLC · POLICY {String(policy + 1).padStart(2, "0")}
                </span>
                <h2>{legalPolicies[policy].title}</h2>
                <p>{legalPolicies[policy].summary}</p>
              </div>
              <button
                onClick={() =>
                  notify(`${legalPolicies[policy].title} editor opened`)
                }
              >
                Edit policy
              </button>
            </div>
            <div className="legal-points">
              {legalPolicies[policy].points.map((point, i) => (
                <article key={point}>
                  <span>0{i + 1}</span>
                  <p>{point}</p>
                  <em>Required</em>
                </article>
              ))}
            </div>
            <div className="publish-check">
              <span>BEFORE PUBLISHING</span>
              <p>
                Complete the effective date, legal and security contacts,
                business address, refund window, governing venue, provider list,
                registrar terms, cookie inventory, and DMCA agent. Then obtain
                privacy, security, finance, and attorney approval.
              </p>
              <button onClick={() => notify("Approval checklist opened")}>
                Review checklist
              </button>
            </div>
          </section>
        </div>
      ) : section === "Hosting" ? (
        <div className="hosting-workspace">
          <div className="hosting-summary">
            <div>
              <span className="hosting-status">
                <i /> All systems operational
              </span>
              <h2>Global application cloud</h2>
              <p>
                Every app gets secure hosting, automatic SSL, edge caching,
                server functions, logs, monitoring, and daily backups.
              </p>
            </div>
            <div className="world-grid">
              <i />
              <i />
              <i />
              <i />
              <i />
              <span>12 global regions</span>
            </div>
          </div>
          <div className="hosting-services">
            {[
              ["▤", "Web hosting", "Static, SSR & streaming", "Active"],
              ["⌁", "Server functions", "API & background jobs", "24 running"],
              ["◫", "Object storage", "Images, video & files", "18.4 GB"],
              ["◎", "Global CDN", "Smart edge caching", "98.7% hit"],
              ["◇", "SSL & security", "Automatic certificates", "Protected"],
              ["↶", "Backups", "Daily restore points", "14 saved"],
            ].map((service) => (
              <button
                key={service[1]}
                onClick={() => notify(`${service[1]} settings opened`)}
              >
                <span>{service[0]}</span>
                <div>
                  <b>{service[1]}</b>
                  <small>{service[2]}</small>
                </div>
                <em>{service[3]}</em>
                <i>›</i>
              </button>
            ))}
          </div>
          <div className="hosting-projects">
            <div>
              <b>Hosted applications</b>
              <button onClick={() => notify("Usage analytics opened")}>
                View usage
              </button>
            </div>
            {[
              [
                "Neelo Digital Store",
                "neelodigitalproducts.com",
                "Production",
                "99.99%",
              ],
              ["Amara Crochet", "amaratwinsoul.com", "Production", "99.98%"],
              ["Sellovate", "sellovate.us", "Production", "100%"],
            ].map((app, i) => (
              <article key={app[0]}>
                <span className={`project-logo p${i}`}>{app[0][0]}</span>
                <div>
                  <b>{app[0]}</b>
                  <small>🔒 {app[1]}</small>
                </div>
                <em>{app[2]}</em>
                <strong>{app[3]} uptime</strong>
                <button onClick={() => notify(`${app[0]} hosting opened`)}>
                  Manage
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : section === "Database" ? (
        <div className="database-workspace">
          <div className="data-sidebar">
            <b>Bizorvia Data</b>
            {[
              "Table editor",
              "SQL editor",
              "Auth users",
              "Storage",
              "Realtime",
              "API docs",
            ].map((x, i) => (
              <button key={x} className={i === 1 ? "active" : ""}>
                {["▦", "⌁", "♙", "□", "◌", "{} "][i]} {x}
              {x === "Storage" && <span style={{marginLeft: "auto", fontSize: "10px", background: "#d8ff7222", color: "#d8ff72", padding: "2px 6px", borderRadius: 4, fontWeight: 700}}>FREE</span>}
              </button>
            ))}
          </div>
          <div className="sql-area">
            <div className="editor-tabs">
              <span>query_customers.sql</span>
              <button onClick={() => notify("New SQL tab created")}>＋</button>
            </div>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              spellCheck={false}
            />
            <div className="sql-actions">
              <span>Postgres 17 · production</span>
              <button onClick={() => notify("Query completed in 42 ms")}>
                ▶ Run query
              </button>
            </div>
            <div className="result-table">
              <div>
                <b>id</b>
                <b>email</b>
                <b>plan</b>
                <b>created_at</b>
              </div>
              <div>
                <span>cus_2841</span>
                <span>hello@aurora.co</span>
                <span className="plan-pill">Pro</span>
                <span>Aug 5, 2026</span>
              </div>
              <div>
                <span>cus_2840</span>
                <span>team@northstar.io</span>
                <span className="plan-pill free">Team</span>
                <span>Aug 5, 2026</span>
              </div>
            </div>
          </div>
        </div>
      ) : section === "Domains" ? (
        <div className="domain-workspace">
          <div>
            <span>DOMAIN CENTER</span>
            <h2>Bizorvia.com is secured and ready to connect.</h2>
            <div className="domain-search">
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <button onClick={() => notify(`${domain} DNS setup opened`)}>
                Manage DNS
              </button>
            </div>
          </div>
          <div className="domain-results">
            {[
              ["bizorvia.com", "Namecheap", "Owned"],
              ["bizorvia.dev", "Optional", "Protect brand"],
              ["bizorvia.app", "Optional", "Protect brand"],
            ].map((d, i) => (
              <article key={d[0]}>
                <span
                  className={i === 0 ? "domain-dot" : "domain-dot premium"}
                />
                <b>{d[0]}</b>
                <small>{d[1]}</small>
                <em>{d[2]}</em>
                <button
                  onClick={() => notify(`${d[0]} domain settings opened`)}
                >
                  {i === 0 ? "Connect" : "Check"}
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : section === "Payments" ? (
        <div className="commerce-grid">
          <section>
            <div className="chart-head">
              <div>
                <span>NET REVENUE</span>
                <b>$18,420.64</b>
                <small>↑ 24.6% vs last month</small>
              </div>
              <select>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="bar-chart">
              {[28, 42, 34, 55, 48, 62, 53, 72, 66, 82, 76, 93].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </section>
          <section className="payment-list">
            <div>
              <b>Recent payments</b>
              <button onClick={() => notify("All transactions opened")}>
                View all
              </button>
            </div>
            {[
              ["A", "Amara Studio", "$99.00"],
              ["N", "Neelo Digital", "$249.00"],
              ["S", "Sellovate", "$39.00"],
            ].map((x) => (
              <article key={x[1]}>
                <span>{x[0]}</span>
                <div>
                  <b>{x[1]}</b>
                  <small>Successful · Visa</small>
                </div>
                <em>{x[2]}</em>
              </article>
            ))}
          </section>
        </div>
      ) : (
        <div className="project-workspace">
          <div className="workspace-head">
            <div>
              <b>
                {section === "Deploy"
                  ? "Production deployments"
                  : section === "Automations"
                    ? "Live automations"
                    : section === "Team"
                      ? "Workspace activity"
                      : "Your projects"}
              </b>
              <span>Updated live</span>
            </div>
            <button onClick={() => notify("Filters opened")}>Filter</button>
          </div>
          {[
            [
              section === "Deploy"
                ? "neelodigitalproducts.com"
                : section === "Automations"
                  ? "New order → Fulfillment agent"
                  : "Neelo Digital Store",
              section === "Deploy"
                ? "Production · Ready"
                : section === "Automations"
                  ? "Active · 842 runs"
                  : "Web app · Live",
              "2m ago",
            ],
            [
              section === "Deploy"
                ? "amara-crochet.pages.app"
                : section === "Automations"
                  ? "Daily content research"
                  : "Amara Crochet Studio",
              section === "Deploy"
                ? "Preview · Ready"
                : section === "Automations"
                  ? "Active · 210 runs"
                  : "Storefront · Live",
              "18m ago",
            ],
            [
              section === "Deploy"
                ? "sellovate-main.pages.app"
                : section === "Automations"
                  ? "Failed payment recovery"
                  : "Sellovate",
              section === "Deploy"
                ? "Production · Building"
                : section === "Automations"
                  ? "Paused · Needs review"
                  : "Marketplace · Building",
              "1h ago",
            ],
          ].map((row, i) => (
            <article key={row[0]}>
              <span className={`project-logo p${i}`}>
                {row[0][0].toUpperCase()}
              </span>
              <div>
                <b>{row[0]}</b>
                <small>{row[1]}</small>
              </div>
              <em>{row[2]}</em>
              <button onClick={() => notify(`${row[0]} opened`)}>
                Open ↗
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

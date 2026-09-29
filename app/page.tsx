"use client";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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
    metric: "Planned",
  },
  {
    icon: "$",
    title: "Profit Autopilot",
    tag: "Margin protection",
    copy: "Measures cost per user and task, routes models by price and quality, applies spending caps, and warns before a customer becomes unprofitable.",
    metric: "Planned",
  },
  {
    icon: "§",
    title: "Trust Compiler",
    tag: "Policy as code",
    copy: "Turns product data flows into privacy notices, consent requirements, retention rules, subprocessors, and an auditable control map.",
    metric: "Planned",
  },
  {
    icon: "↶",
    title: "Mission Replay",
    tag: "Explain + recover",
    copy: "Replays every agent decision, approval, tool call, data change, and deployment—then safely rolls back the affected action.",
    metric: "Planned",
  },
  {
    icon: "⇄",
    title: "Sovereign Exit",
    tag: "No lock-in",
    copy: "Exports source, Postgres data, files, secrets manifest, DNS records, billing catalog, logs, and deployment instructions as a portable exit package.",
    metric: "Planned",
  },
  {
    icon: "◈",
    title: "Resilience Mesh",
    tag: "Provider failover",
    copy: "Keeps tested recovery plans for models, regions, email, storage, DNS, and payments so one provider cannot stop the business.",
    metric: "Planned",
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
    score: "—",
    status: "Not started",
  },
  {
    title: "AEO",
    icon: "?",
    copy: "Direct-answer pages, FAQs, featured-snippet structures, voice-search answers, comparison tables, definitions, and structured question coverage.",
    score: "—",
    status: "Not started",
  },
  {
    title: "GEO",
    icon: "✦",
    copy: "Clear entities, evidence-backed claims, original insights, expert authorship, citation-worthy pages, consistent brand facts, and answer-engine visibility monitoring.",
    score: "—",
    status: "Not started",
  },
  {
    title: "Content",
    icon: "▤",
    copy: "A multilingual calendar for articles, landing pages, lead magnets, product stories, short videos, images, podcasts, and repurposed campaigns.",
    score: "—",
    status: "Not started",
  },
  {
    title: "Social",
    icon: "↗",
    copy: "Platform-specific creation, scheduling, community replies, social listening, UGC briefs, influencer outreach, and performance learning.",
    score: "—",
    status: "Not started",
  },
  {
    title: "Email + CRM",
    icon: "✉",
    copy: "Lead capture, segmentation, welcome and sales sequences, newsletters, abandoned checkout, win-back, scoring, and sales follow-up.",
    score: "—",
    status: "Not started",
  },
  {
    title: "Paid ads",
    icon: "$",
    copy: "Creative variations, audiences, budgets, pixels, conversion APIs, landing pages, experiments, retargeting, and strict spend approvals.",
    score: "—",
    status: "Not started",
  },
  {
    title: "Reputation",
    icon: "★",
    copy: "Review requests, listing consistency, response drafts, customer stories, PR opportunities, partnerships, affiliates, and referral programs.",
    score: "—",
    status: "Not started",
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
  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  useEffect(() => {
    if (!running || paused || step >= taskSteps.length - 1) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 1800);
    return () => window.clearTimeout(timer);
  }, [running, paused, step]);

  const progress = useMemo(
    () => Math.round(((step + 1) / taskSteps.length) * 100),
    [step],
  );

  async function runRealAI(taskPrompt: string) {
    setAiResult("");
    setAiError("");
    if (!user) {
      setAiError("Sign in to run real AI research — this preview is scripted until then.");
      return;
    }
    setAiLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAiError("Sign in to run real AI research — this preview is scripted until then.");
        return;
      }
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: `You are helping a founder plan a business. Give a concise, real, useful answer (under 200 words) to this request: ${taskPrompt}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.result) {
        setAiResult(data.result);
      } else {
        setAiError(data.error || "AI isn't configured on this deployment yet — showing the scripted preview instead.");
      }
    } catch {
      setAiError("Network error reaching the AI service — showing the scripted preview instead.");
    } finally {
      setAiLoading(false);
    }
  }

  function startTask(event?: FormEvent) {
    event?.preventDefault();
    const finalPrompt = prompt.trim() ||
      "Research the software productivity market and create a launch strategy";
    if (!prompt.trim()) setPrompt(finalPrompt);
    setStep(0);
    setPaused(false);
    setRunning(true);
    setTab("Live run");
    setLastPrompt(finalPrompt);
    runRealAI(finalPrompt);
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function triggerDownload(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadPlan() {
    if (!user) {
      notify("Sign in to download real files.");
      return;
    }
    if (!aiResult) {
      notify("Click Run first to generate real content, then download.");
      return;
    }
    triggerDownload("business-plan.md", aiResult, "text/markdown");
    notify("business-plan.md downloaded");
  }

  async function downloadAppDemo() {
    if (!user) {
      notify("Sign in to download real files.");
      return;
    }
    if (!aiResult) {
      notify("Click Run first to generate real content, then download.");
      return;
    }
    setFilesLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        notify("Sign in to download real files.");
        return;
      }
      const res = await fetch("/api/generate-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt: lastPrompt || prompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.html) {
        triggerDownload("app-demo.html", data.html, "text/html");
        notify("app-demo.html downloaded");
      } else {
        notify(data.error || "The app demo couldn't be generated this time. Try again.");
      }
    } catch {
      notify("Network error generating the app demo.");
    } finally {
      setFilesLoading(false);
    }
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
                if (item === "Admin") {
                  window.location.href = "/admin";
                  return;
                }
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
            <button
              disabled
              title="Notifications aren't built yet"
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              ♢
            </button>
            {user ? (
              <button
                className="share"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    notify("Workspace link copied");
                  } catch {
                    notify("Couldn't copy — copy the URL from your address bar");
                  }
                }}
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
                    disabled
                    title="Deep research mode isn't built yet"
                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                  >
                    ◎ Deep research (soon)
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Private cloud isn't built yet"
                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                  >
                    ⌁ Private cloud (soon)
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
              <button
                disabled
                title="A browsable template library isn't built yet — the 4 starter cards below are what's available today"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                Browse templates (coming soon) →
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
              <button onClick={() => { window.location.href = "/features"; }}>
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
                <button
                  disabled
                  title="Task options aren't built yet"
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
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
                    {item === "Files" && aiResult && <em>2</em>}
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
                      <b>Strategy Agent {aiResult && <em style={{ color: "#d8ff72", fontSize: 11, fontWeight: 700, marginLeft: 8 }}>REAL AI RESPONSE</em>}</b>
                      <p>
                        {aiLoading
                          ? "Asking Claude for a real answer to your prompt…"
                          : aiResult
                            ? aiResult
                            : aiError
                              ? aiError
                              : "I found a strong opportunity: most competitors automate tasks, but few show users why each decision was made. I'm making transparent reasoning a core launch message."}
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
                      ["R", "Researcher", "Researching"],
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
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={downloadPlan}>Download plan</button>
                    <button onClick={downloadAppDemo} disabled={filesLoading}>
                      {filesLoading ? "Generating…" : "Download app demo"}
                    </button>
                  </div>
                </div>
                <div className="file-grid">
                  {!aiResult ? (
                    <p style={{ color: "#666", padding: "24px 4px", gridColumn: "1 / -1" }}>
                      Run this task above to generate real content — your files will appear here once it's ready.
                    </p>
                  ) : (
                    <>
                      <button onClick={downloadPlan}>
                        <span className="rose">MD</span>
                        <div>
                          <b>business-plan.md</b>
                          <small>Ready to download</small>
                        </div>
                        <i>↓</i>
                      </button>
                      <button onClick={downloadAppDemo} disabled={filesLoading}>
                        <span className="green">HTML</span>
                        <div>
                          <b>app-demo.html</b>
                          <small>{filesLoading ? "Generating…" : "Ready to download"}</small>
                        </div>
                        <i>↓</i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            {tab === "Research" && (
              <div className="panel-view">
                <div className="panel-heading">
                  <div>
                    <h2>Research intelligence · ROADMAP PREVIEW</h2>
                    <p>
                      {aiResult
                        ? "Your task above generated real AI content — source citation tracking for that content isn't built yet."
                        : "Run a task above to generate real content. Source citation tracking isn't built yet."}
                    </p>
                  </div>
                  <button
                    disabled
                    title="Citation tracking isn't built yet"
                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                  >
                    View citations (coming soon)
                  </button>
                </div>
                <div className="insight-grid">
                  <article>
                    <span>EXAMPLE · KEY INSIGHT</span>
                    <h3>Trust is the strongest differentiator</h3>
                    <p>
                      Users want autonomous execution, but adoption rises when
                      decisions, sources, and permissions remain visible.
                    </p>
                    <small>Example only — not tracked yet</small>
                  </article>
                  <article>
                    <span>EXAMPLE · MARKET SIGNAL</span>
                    <h3>Teams want reusable workflows</h3>
                    <p>
                      The next wave is moving from one-off prompts toward
                      repeatable, governed automations shared across teams.
                    </p>
                    <small>Example only — not tracked yet</small>
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
                  <div>🔒 secure research workspace · ROADMAP PREVIEW</div>
                </div>
                <div className="browser-body">
                  <span className="browser-orb">✦</span>
                  <h2>Live agent browsing isn't built yet</h2>
                  <p>
                    This is a preview of what an autonomous browsing agent
                    could look like — it isn't reviewing real pages right now.
                    The "Strategy Agent" note on the Live run tab is the one
                    real AI response in this task.
                  </p>
                </div>
              </div>
            )}
            {tab === "Decisions" && (
              <div className="panel-view">
                <div className="panel-heading">
                  <div>
                    <h2>Decision ledger · ROADMAP PREVIEW</h2>
                    <p>
                      Not built yet — this is an example of what an audit
                      trail of agent decisions could look like.
                    </p>
                  </div>
                </div>
                <div className="decision-list">
                  <article>
                    <span>01</span>
                    <div>
                      <b>Prioritize trust-led positioning</b>
                      <p>
                        Example only — decision tracking isn't tracked yet.
                      </p>
                    </div>
                    <em>Example</em>
                  </article>
                  <article>
                    <span>02</span>
                    <div>
                      <b>Target small business teams first</b>
                      <p>
                        Example only — decision tracking isn't tracked yet.
                      </p>
                    </div>
                    <em>Example</em>
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
  const [code, setCode] = useState(
    `export async function launchBusiness(idea: string) {\n  const market = await agents.validate(idea);\n  const offer = await agents.designOffer(market);\n  const business = await factory.build({ market, offer });\n\n  await approvals.request({\n    actions: ["publish", "connectDomain", "enablePayments"]\n  });\n\n  return business.launch();\n}`,
  );
  const [workSurface, setWorkSurface] = useState(1);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [agentError, setAgentError] = useState("");
  const [agentRunning, setAgentRunning] = useState(false);
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const { user } = useAuth();

  async function startCheckout(planKey: string) {
    setCheckoutError("");
    if (planKey === "free") {
      window.location.href = user ? "/" : "/signup";
      return;
    }
    if (!user) {
      window.location.href = "/signup";
      return;
    }
    setCheckoutLoadingPlan(planKey);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Checkout failed. Please try again.");
        setCheckoutLoadingPlan(null);
      }
    } catch {
      setCheckoutError("Network error reaching Stripe. Please try again.");
      setCheckoutLoadingPlan(null);
    }
  }

  type RealProject = {
    id: string;
    name: string;
    slug: string;
    status: string;
    url?: string;
    last_deployed_at?: string;
    created_at: string;
  };
  const [realProjects, setRealProjects] = useState<RealProject[] | null>(null);
  const [realProjectsLoading, setRealProjectsLoading] = useState(false);
  const [realPlan, setRealPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  const needsRealData = section === "Deploy" || section === "Database" || section === "Payments" || section === "Hosting" || section === "Studio";

  useEffect(() => {
    if (!needsRealData || !user) return;
    let cancelled = false;
    setRealProjectsLoading(true);
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (!cancelled) setRealProjectsLoading(false); return; }
      const headers = { Authorization: `Bearer ${session.access_token}` };
      try {
        const [projectsRes, profileRes] = await Promise.all([
          fetch("/api/projects", { headers }),
          supabase.from("profiles").select("plan").eq("id", user.id).single(),
        ]);
        if (!cancelled && projectsRes.ok) {
          const data = await projectsRes.json();
          setRealProjects(data.projects || []);
        }
        if (!cancelled && profileRes?.data) {
          setRealPlan(profileRes.data.plan || "free");
        }
      } catch {
        // leave realProjects null — UI falls back to a clear "couldn't load" state
      } finally {
        if (!cancelled) setRealProjectsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [needsRealData, section, user]);

  async function openBillingPortal() {
    setPortalError("");
    if (!user) { window.location.href = "/login"; return; }
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else if (res.status === 404) {
        // no Stripe customer yet — this account hasn't subscribed, send to real checkout
        window.location.href = "/pricing";
      } else {
        setPortalError(data.error || "Couldn't open billing portal.");
      }
    } catch {
      setPortalError("Network error opening billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  const [businessType, setBusinessType] = useState("Digital products");
  const [factoryResult, setFactoryResult] = useState("");
  const [factoryError, setFactoryError] = useState("");
  const [factoryLoading, setFactoryLoading] = useState(false);

  function triggerDownload(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function runAgent() {
    setAgentError("");
    if (!agentPrompt.trim()) {
      setAgentError("Type an instruction first.");
      return;
    }
    if (!user) {
      setAgentError("Sign in to use the real code agent — this preview is scripted until then.");
      return;
    }
    setAgentRunning(true);
    setAgentResponse("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAgentError("Sign in to use the real code agent — this preview is scripted until then.");
        return;
      }
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          prompt: `You are a coding assistant working on this file:\n\n${code}\n\nInstruction: ${agentPrompt}\n\nReply with a short explanation (2-3 sentences) of what you changed, followed by the complete updated code in a single fenced code block.`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.result) {
        setAgentResponse(data.result);
        const match = data.result.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
        if (match) setCode(match[1].trim());
      } else {
        setAgentError(data.error || "AI isn't configured on this deployment yet.");
      }
    } catch {
      setAgentError("Network error reaching the AI service.");
    } finally {
      setAgentRunning(false);
    }
  }

  async function buildBusiness() {
    setFactoryResult("");
    setFactoryError("");
    if (!businessIdea.trim()) {
      setFactoryError("Describe your business idea above first.");
      return;
    }
    if (!user) {
      setFactoryError("Sign in to generate a real business validation — this preview is scripted until then.");
      return;
    }
    setFactoryStep(0);
    setFactoryLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setFactoryError("Sign in to generate a real business validation — this preview is scripted until then.");
        return;
      }
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          prompt: `You are validating a new business idea for a founder. Business type: ${businessType}. Idea: "${businessIdea}". Give a real, concise validation (under 220 words) with short headers covering: 1) Opportunity — is there real demand for this?, 2) Ideal customer, 3) A suggested starting price, and 4) Three concrete next steps to launch.`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.result) {
        setFactoryResult(data.result);
      } else {
        setFactoryError(data.error || "AI isn't configured on this deployment yet — showing the scripted preview instead.");
      }
    } catch {
      setFactoryError("Network error reaching the AI service — showing the scripted preview instead.");
    } finally {
      setFactoryLoading(false);
    }
  }

  return (
    <div className="platform-view">
      <div className="platform-hero">
        <div>
          <span>{content.kicker}</span>
          <h1>{content.title}</h1>
          <p>{content.copy}</p>
        </div>
        <button
          disabled
          title={`${content.action} isn't built yet`}
          style={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          ＋ {content.action} (soon)
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
      {section === "Everywhere" ? (
        <div className="everywhere-workspace">
          <div className="everywhere-hero">
            <div>
              <span>ONE CONTEXT · EVERY SURFACE · VISION</span>
              <h2>Start in Slack. Continue in code. Approve on mobile.</h2>
              <p>
                This is the vision: an agent that keeps the project, current
                task, permissions, decisions, and evidence in sync across every
                tool. None of the connections below exist yet — what follows is
                a mockup of how it will work.
              </p>
            </div>
            <div className="context-orbit">
              <span className="orbit-core">N</span>
              <i />
              <i />
              <i />
              <i />
              <em style={{ opacity: 0.6 }}>Not connected yet</em>
            </div>
            <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
              ＋ Coming soon
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
                <em style={{ opacity: 0.6 }}>
                  <i style={{ background: "#666" }} /> Not connected yet
                </em>
              </div>
              <h2>Bizorvia inside {workSurfaces[workSurface].title}</h2>
              <p>{workSurfaces[workSurface].copy}</p>
              <p style={{ color: "#666", fontSize: 12 }}>Example mockup — not a live conversation:</p>
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
                    <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                      Coming soon
                    </button>
                  </div>
                </div>
              </div>
              <div className="surface-handoff">
                <span>CONTINUE THIS WORK IN</span>
                {["Terminal", "GitHub", "Browser", "Mobile"].map((x) => (
                  <button key={x} disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                    {x} ↗
                  </button>
                ))}
              </div>
            </section>
            <aside className="permission-center">
              <div>
                <span>PERMISSION PROFILE · PREVIEW</span>
                <b>Business operator</b>
                <small>Not enforced anywhere yet</small>
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
                  <input type="checkbox" defaultChecked={Boolean(x[1])} disabled />
                  <i />
                </label>
              ))}
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Coming soon
              </button>
            </aside>
          </div>
          <div className="event-mesh">
            <div className="event-head">
              <div>
                <span>EVENT MESH · VISION</span>
                <b>Work begins wherever business happens.</b>
              </div>
              <em style={{ opacity: 0.6 }}>Not automated yet</em>
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
              <b>Example cross-tool work</b>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Coming soon
              </button>
            </div>
            {[
              [
                "GitHub",
                "Reviewed PR #184 and suggested 6 fixes",
                "Example",
                "Review",
              ],
              [
                "Slack",
                "Converted launch thread into an approved 12-step plan",
                "Example",
                "Open",
              ],
              [
                "Terminal",
                "Reproduced checkout error and repaired failing tests",
                "Example",
                "View logs",
              ],
              [
                "Support",
                "Linked three tickets to one product defect",
                "Example",
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
                <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
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
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                ⌘ Coming soon
              </button>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                ▷ Coming soon
              </button>
              <button
                className="ide-primary"
                disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }}
                title="Deploying is available today from the Projects page"
              >
                Ship changes
              </button>
            </div>
          </div>
          <div className="ide-shell">
            <aside className="file-explorer">
              <div>
                <b>EXPLORER</b>
                <button
                  disabled
                  title="This file tree is illustrative — creating files here isn't built yet"
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  ＋
                </button>
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
                </div>
                {agentRunning ? (
                  <p>
                    <i>$</i> ai-agent <em>running…</em>
                  </p>
                ) : agentResponse ? (
                  <p>
                    <i>$</i> ai-agent <em>✓ response received, editor updated</em>
                  </p>
                ) : (
                  <p>
                    <i>$</i> <em style={{ color: "#666" }}>No commands run yet — ask the agent something below</em>
                  </p>
                )}
              </div>
            </section>
            <aside className="agent-panel">
              <div className="agent-panel-head">
                <div>
                  <span>✦</span>
                  <b>AI Code Assistant</b>
                </div>
              </div>
              <div className="agent-status">
                <span>
                  <i /> {user ? "Real AI · connected" : "Sign in for real AI"}
                </span>
                <small>Edits the code shown in the editor</small>
              </div>
              {agentError && (
                <p style={{ color: "#ff8080", fontSize: 13, padding: "0 4px" }}>⚠️ {agentError}</p>
              )}
              {agentRunning ? (
                <div className="agent-request">
                  <p>Thinking through your instruction…</p>
                </div>
              ) : agentResponse ? (
                <div className="agent-request" style={{ whiteSpace: "pre-wrap", maxHeight: 260, overflow: "auto" }}>
                  <p style={{ fontSize: 13 }}>{agentResponse}</p>
                </div>
              ) : (
                <div className="agent-request">
                  <p>Ask it to build, fix, explain, or refactor the code in the editor — it will write a real response and can update the code directly.</p>
                </div>
              )}
              <div className="agent-prompt">
                <textarea
                  placeholder="Ask the agent to build, fix, explain, or test…"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                />
                <div>
                  <button onClick={runAgent} disabled={agentRunning}>
                    {agentRunning ? "Sending…" : "Send ↑"}
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
              <span>GROWTH ENGINE · ROADMAP PREVIEW</span>
              <h2>
                One strategy across search, answers, models, social, email, and ads.
              </h2>
              <p>
                This is the plan: one system that watches visibility, leads,
                conversion, revenue, and customer acquisition cost across every
                channel. It isn't tracking real data yet — what's shown below
                is an example of what it will look like.
              </p>
            </div>
            <div className="visibility-score">
              <span>—</span>
              <small>NOT TRACKED YET</small>
            </div>
            <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
              Coming soon
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
                <em style={{ opacity: 0.6 }}>
                  <i style={{ background: "#666" }} /> Not automated yet
                </em>
              </div>
              <p>{marketingSystems[marketingSystem].copy}</p>
              <div className="marketing-kpis">
                {["Visibility", "Qualified traffic", "Leads", "Attributed revenue"].map((label) => (
                  <article key={label}>
                    <span>{label}</span>
                    <b>—</b>
                    <small>Not tracked yet</small>
                  </article>
                ))}
              </div>
              <p style={{ color: "#666", fontSize: 12, marginBottom: 12 }}>Example of the kind of next actions this system will surface once it's live:</p>
              <div className="next-actions">
                <div>
                  <span>01</span>
                  <p>Publish the highest-opportunity content cluster</p>
                  <em>Example</em>
                </div>
                <div>
                  <span>02</span>
                  <p>Improve answer coverage on five purchase-intent pages</p>
                  <em>Example</em>
                </div>
                <div>
                  <span>03</span>
                  <p>Add original data and expert citations for answer-engine discovery</p>
                  <em>Example</em>
                </div>
              </div>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Coming soon
              </button>
            </section>
          </div>
          <div className="campaign-center">
            <div className="campaign-head">
              <div>
                <span>OMNICHANNEL CAMPAIGN CENTER · ROADMAP PREVIEW</span>
                <b>Launch once. Adapt everywhere.</b>
              </div>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                ＋ Coming soon
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
              <button onClick={buildBusiness} disabled={factoryLoading}>
                {factoryLoading ? "Validating…" : "Build my business"} <span>→</span>
              </button>
            </div>
            {factoryError && (
              <p style={{ color: "#ff8080", fontSize: 13, marginTop: 4 }}>⚠️ {factoryError}</p>
            )}
            <div className="factory-types">
              {[
                "Digital products",
                "SaaS",
                "Service business",
                "Online store",
                "Marketplace",
                "Creator brand",
              ].map((type) => (
                <button
                  key={type}
                  className={businessType === type ? "active" : ""}
                  onClick={() => setBusinessType(type)}
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
                  factoryStep === i ? "active" : i === 0 && factoryResult ? "complete" : ""
                }
                onClick={() => setFactoryStep(i)}
              >
                <span>{i === 0 && factoryResult ? "✓" : item.icon}</span>
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
                    STAGE {String(factoryStep + 1).padStart(2, "0")}
                    {factoryStep === 0 ? " · REAL AI VALIDATION" : " · ON THE ROADMAP"}
                  </span>
                  <h2>{businessFactorySteps[factoryStep].title}</h2>
                </div>
                <em>
                  {factoryStep === 0
                    ? factoryResult
                      ? "Complete"
                      : factoryLoading
                        ? "Running…"
                        : "Not started"
                    : "Not automated yet"}
                </em>
              </div>
              <p>{businessFactorySteps[factoryStep].copy}</p>
              {factoryStep === 0 ? (
                factoryLoading ? (
                  <p style={{ color: "#888" }}>Generating a real validation for your idea…</p>
                ) : factoryResult ? (
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#ddd", fontSize: 14 }}>
                    {factoryResult}
                  </div>
                ) : (
                  <div className="factory-outputs">
                    {businessFactorySteps[0].outputs.map((output, i) => (
                      <article key={output}>
                        <span>{["◎", "◇", "▦", "✓"][i]}</span>
                        <div>
                          <b>{output}</b>
                          <small>Generated once you click Build my business</small>
                        </div>
                        <i>Pending</i>
                      </article>
                    ))}
                  </div>
                )
              ) : (
                <div className="factory-outputs">
                  {businessFactorySteps[factoryStep].outputs.map((output, i) => (
                    <article key={output}>
                      <span>{["◎", "◇", "▦", "✓"][i]}</span>
                      <div>
                        <b>{output}</b>
                        <small>Not built yet — this stage isn't automated</small>
                      </div>
                      <i>Planned</i>
                    </article>
                  ))}
                </div>
              )}
              {factoryStep === 0 ? (
                factoryResult && (
                  <button onClick={() => triggerDownload("business-validation.md", factoryResult, "text/markdown")}>
                    Download validation →
                  </button>
                )
              ) : (
                <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  Coming soon
                </button>
              )}
            </section>
            <aside className="business-preview">
              <div className="preview-top">
                <span>BUSINESS PREVIEW</span>
                <em>{factoryResult ? "VALIDATED" : "NOT STARTED"}</em>
              </div>
              <div className="mini-brand">
                <span>{businessIdea.trim() ? businessIdea.trim()[0].toUpperCase() : "?"}</span>
                <div>
                  <b>{businessIdea.trim() || "Describe your idea above"}</b>
                  <small>{businessType}</small>
                </div>
              </div>
              {factoryResult ? (
                <div style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#999", lineHeight: 1.6, maxHeight: 220, overflow: "auto" }}>
                  {factoryResult}
                </div>
              ) : (
                <p style={{ color: "#666", fontSize: 13 }}>
                  Click "Build my business" to generate a real, AI-written validation for this idea. Everything past Validate — branding, the live site, checkout, legal, and marketing — is still on our roadmap, not automated yet.
                </p>
              )}
            </aside>
          </div>
          <div className="digital-ceo">
            <div>
              <span>DIGITAL CEO · ON THE ROADMAP</span>
              <h2>Specialist agents that run the business after launch.</h2>
              <p>
                The plan: specialist agents watch the business, prepare actions, and bring
                sensitive decisions to one approval inbox. None of this runs automatically yet —
                today Bizorvia validates your idea for real, everything below is what's next.
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
                  <em style={{ opacity: 0.6 }}>
                    <i style={{ background: "#666" }} /> Coming soon
                  </em>
                </article>
              ))}
            </div>
            <div className="approval-bar">
              <span>OWNER CONTROL</span>
              <p>
                Purchases, ad spending, publishing, refunds, legal changes,
                customer promises, and account changes will wait for approval
                once this is built.
              </p>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                No pending decisions
              </button>
            </div>
          </div>
        </div>
      ) : section === "Launch OS" ? (
        <div className="launch-workspace">
          <div className="launch-score">
            <div className="score-ring">
              <span>—</span>
              <small>NOT BUILT YET</small>
            </div>
            <div>
              <span>PRODUCTION READINESS · ROADMAP PREVIEW</span>
              <h2>The plan: one launch score across technical, financial, legal, and support readiness.</h2>
              <p>
                None of the systems below run automatically yet. This is what
                Launch OS is planned to combine into one deployment decision.
              </p>
            </div>
            <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
              ▶ Coming soon
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
                  ["Coverage", "Planned"],
                  ["Evidence", "Planned"],
                  ["Control", "Planned"],
                  ["Output", "Planned"],
                ].map((x) => (
                  <article key={x[0]}>
                    <span>{x[0]}</span>
                    <b>{x[1]}</b>
                  </article>
                ))}
              </div>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Coming soon
              </button>
            </section>
          </div>
          <div className="release-gates">
            <div className="gate-head">
              <div>
                <span>RELEASE GATES · ROADMAP PREVIEW</span>
                <b>Automatic deployment blockers</b>
              </div>
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Coming soon
              </button>
            </div>
            {[
              "Security & dependencies",
              "Privacy & legal alignment",
              "Profitability & usage caps",
              "Backup restore test",
              "Customer journey & support",
            ].map((label) => (
              <article key={label}>
                <div>
                  <b>{label}</b>
                  <small>Not built yet</small>
                </div>
                <span>
                  <i style={{ width: "0%" }} />
                </span>
                <em>—</em>
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
              const planKey = (plan[0] as string).toLowerCase();
              const disabledForAnnual = annual && i > 0;
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
                  <button
                    onClick={() => startCheckout(planKey)}
                    disabled={checkoutLoadingPlan === planKey || disabledForAnnual}
                    title={disabledForAnnual ? "Annual billing isn't wired up yet — switch to Monthly to subscribe" : undefined}
                    style={disabledForAnnual ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                  >
                    {checkoutLoadingPlan === planKey
                      ? "Redirecting…"
                      : disabledForAnnual
                        ? "Switch to Monthly"
                        : i === 0
                          ? "Start free"
                          : "Choose " + plan[0]}
                  </button>
                </article>
              );
            })}
          </div>
          {checkoutError && (
            <p style={{ color: "#ff8080", textAlign: "center", marginTop: 12 }}>{checkoutError}</p>
          )}
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
            <button
              disabled
              title="Revenue simulator isn't built yet"
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              Open revenue simulator (coming soon) →
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
                disabled
                title="A policy editor isn't built yet — these drafts need attorney review before use regardless"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                Edit policy (coming soon)
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
              <button
                disabled
                title="A tracked approval checklist isn't built yet — the items above are the real requirements"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                Review checklist (coming soon)
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
              <span>Backed by Vercel's global edge network</span>
            </div>
          </div>
          <div className="hosting-services">
            {[
              ["▤", "Web hosting", "Static site hosting", "Active", "/projects"],
              ["◫", "Object storage", "Files you upload", "Active", "/storage"],
              ["⌁", "Server functions", "API & background jobs", "Coming soon", null],
              ["◎", "Global CDN", "Smart edge caching", "Coming soon", null],
              ["◇", "SSL & security", "Automatic certificates", "Coming soon", null],
              ["↶", "Backups", "Daily restore points", "Coming soon", null],
            ].map((service) => (
              service[4] ? (
                <a key={service[1]} href={service[4] as string} style={{ textDecoration: "none" }}>
                  <span>{service[0]}</span>
                  <div>
                    <b>{service[1]}</b>
                    <small>{service[2]}</small>
                  </div>
                  <em>{service[3]}</em>
                  <i>›</i>
                </a>
              ) : (
                <button key={service[1]} disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  <span>{service[0]}</span>
                  <div>
                    <b>{service[1]}</b>
                    <small>{service[2]}</small>
                  </div>
                  <em>{service[3]}</em>
                  <i>›</i>
                </button>
              )
            ))}
          </div>
          <div className="hosting-projects">
            <div>
              <b>Hosted applications</b>
              <a href="/projects" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>Open Projects →</a>
            </div>
            {!user ? (
              <p style={{ color: "#666", fontSize: 14, padding: "16px 0" }}>Sign in to see your real hosted applications.</p>
            ) : realProjectsLoading ? (
              <p style={{ color: "#666", fontSize: 14, padding: "16px 0" }}>Loading…</p>
            ) : !realProjects || realProjects.length === 0 ? (
              <p style={{ color: "#666", fontSize: 14, padding: "16px 0" }}>
                No hosted applications yet. <a href="/projects" style={{ color: "#d8ff72" }}>Deploy your first one →</a>
              </p>
            ) : realProjects.map((app, i) => (
              <article key={app.id}>
                <span className={`project-logo p${i % 3}`}>{app.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <b>{app.name}</b>
                  <small>🔒 {app.url ? app.url.replace(/^https?:\/\//, "") : "not deployed yet"}</small>
                </div>
                <em>{app.status === "deployed" ? "Production" : app.status === "partial" ? "Partial deploy" : "Not deployed"}</em>
                <strong>{app.last_deployed_at ? new Date(app.last_deployed_at).toLocaleDateString() : "—"}</strong>
                <a href="/projects" style={{ color: "#d8ff72", fontSize: 13, textDecoration: "none" }}>
                  Manage
                </a>
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
              <button key={x} className={i === 0 ? "active" : ""} onClick={() => i !== 0 && notify(`${x} — coming soon, table editor is real`)}>
                {["▦", "⌁", "♙", "□", "◌", "{} "][i]} {x}
              {x === "Storage" && <span style={{marginLeft: "auto", fontSize: "10px", background: "#d8ff7222", color: "#d8ff72", padding: "2px 6px", borderRadius: 4, fontWeight: 700}}>FREE</span>}
              </button>
            ))}
          </div>
          <div className="sql-area">
            <div className="editor-tabs">
              <span>your `projects` table — real data</span>
            </div>
            <div className="result-table">
              <div>
                <b>name</b>
                <b>slug</b>
                <b>status</b>
                <b>created_at</b>
              </div>
              {!user ? (
                <div><span style={{ gridColumn: "1 / -1", color: "#666" }}>Sign in to view your real table data.</span></div>
              ) : realProjectsLoading ? (
                <div><span style={{ gridColumn: "1 / -1", color: "#666" }}>Loading…</span></div>
              ) : !realProjects || realProjects.length === 0 ? (
                <div><span style={{ gridColumn: "1 / -1", color: "#666" }}>No rows yet — create a project to see it here.</span></div>
              ) : realProjects.map((p) => (
                <div key={p.id}>
                  <span>{p.name}</span>
                  <span>{p.slug}</span>
                  <span className={p.status === "deployed" ? "plan-pill" : "plan-pill free"}>{p.status}</span>
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "#555", fontSize: 12, marginTop: 12 }}>
              A full SQL editor against your live database is next on the list — for now this shows your real `projects` rows safely, without exposing raw SQL access.
            </p>
          </div>
        </div>
      ) : section === "Domains" ? (
        <div className="domain-workspace">
          <div>
            <span>DOMAIN CENTER · ROADMAP PREVIEW</span>
            <h2>Custom domain management for your projects is on the roadmap.</h2>
            <p style={{ color: "#666", fontSize: 13, maxWidth: 520 }}>
              You can attach a custom domain to a project from its Domain tab
              today, but automatic DNS setup and verification isn't built yet —
              you'll need to point your DNS manually for now.
            </p>
            <div className="domain-search">
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="yourdomain.com"
              />
              <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Coming soon
              </button>
            </div>
          </div>
        </div>
      ) : section === "Payments" ? (
        <div className="commerce-grid">
          <section>
            <div className="chart-head">
              <div>
                <span>YOUR ACCOUNT</span>
                {!user ? (
                  <b style={{ fontSize: 20 }}>Sign in to see your billing</b>
                ) : (
                  <b style={{ textTransform: "capitalize" }}>{realPlan ?? "…"} plan</b>
                )}
                <small>{user ? "Real data from your account" : "No account signed in"}</small>
              </div>
              {!user ? (
                <a href="/login" style={{ background: "#d8ff72", color: "#0a0a0a", padding: "10px 18px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
                  Sign in
                </a>
              ) : (
                <button onClick={openBillingPortal} disabled={portalLoading}>
                  {portalLoading ? "Opening…" : realPlan === "free" ? "Upgrade plan" : "Manage billing"}
                </button>
              )}
            </div>
            {portalError && (
              <p style={{ color: "#ff8080", fontSize: 13, marginTop: 8 }}>⚠️ {portalError}</p>
            )}
            <p style={{ color: "#666", fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
              {realPlan === "free" || !realPlan
                ? "You're on the Free plan. Upgrading opens real Stripe checkout."
                : "Manage billing opens your real Stripe customer portal — update your card, view invoices, or cancel."}
            </p>
          </section>
          <section className="payment-list">
            <div>
              <b>Your projects</b>
              <a href="/projects" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>Open Projects →</a>
            </div>
            {!user ? (
              <p style={{ color: "#666", fontSize: 14, padding: "16px 0" }}>Sign in to see your real projects.</p>
            ) : realProjectsLoading ? (
              <p style={{ color: "#666", fontSize: 14, padding: "16px 0" }}>Loading…</p>
            ) : !realProjects || realProjects.length === 0 ? (
              <p style={{ color: "#666", fontSize: 14, padding: "16px 0" }}>No projects yet — create one in Projects.</p>
            ) : realProjects.map((p) => (
              <article key={p.id}>
                <span>{p.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <b>{p.name}</b>
                  <small>{p.status === "deployed" ? "Live" : p.status}</small>
                </div>
                <em>{new Date(p.created_at).toLocaleDateString()}</em>
              </article>
            ))}
          </section>
        </div>
      ) : section === "Deploy" || section === "Studio" ? (
        <div className="project-workspace">
          <div className="workspace-head">
            <div>
              <b>{section === "Deploy" ? "Your real deployments" : "Your real projects"}</b>
              <span>{user ? "Live from your account" : "Sign in to see your data"}</span>
            </div>
            <a href="/projects" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>Open Projects →</a>
          </div>
          {!user ? (
            <p style={{ color: "#666", fontSize: 14, padding: "24px 0" }}>Sign in to see your real projects and deployments.</p>
          ) : realProjectsLoading ? (
            <p style={{ color: "#666", fontSize: 14, padding: "24px 0" }}>Loading…</p>
          ) : !realProjects || realProjects.length === 0 ? (
            <p style={{ color: "#666", fontSize: 14, padding: "24px 0" }}>
              No projects yet. <a href="/projects" style={{ color: "#d8ff72" }}>Create your first one →</a>
            </p>
          ) : realProjects.map((p, i) => (
            <article key={p.id}>
              <span className={`project-logo p${i % 3}`}>
                {p.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <b>{p.name}</b>
                <small>
                  {p.status === "deployed" ? "Production · Ready" : p.status === "partial" ? "Partial deploy" : p.status === "error" ? "Deploy failed" : "Not yet deployed"}
                </small>
              </div>
              <em>{p.last_deployed_at ? new Date(p.last_deployed_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}</em>
              <a href="/projects" style={{ color: "#d8ff72", fontSize: 13, textDecoration: "none" }}>
                Open ↗
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="project-workspace">
          <div className="workspace-head">
            <div>
              <b>{section === "Automations" ? "Live automations" : "Workspace activity"}</b>
              <span>Demo preview — not built yet</span>
            </div>
          </div>
          <p style={{ color: "#666", fontSize: 14, padding: "24px 0" }}>
            {section} isn&apos;t wired up to real data yet — this section is still a visual preview of what&apos;s planned.
          </p>
        </div>
      )}
    </div>
  );
}

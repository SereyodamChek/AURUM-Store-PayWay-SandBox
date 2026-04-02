"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/PaymentModal";

const PRODUCTS = [
  {
    id: 1,
    name: "ChatGPT Plus",
    brand: "OpenAI · 1 Month",
    price: "$20",
    per: "/ month",
    desc: "Unlock GPT-4o, advanced reasoning, DALL·E image generation, real-time browsing, custom GPTs, and priority access during peak hours.",
    tags: [{ label: "GPT-4o", cls: "tg" }, { label: "Instant", cls: "tv" }, { label: "DALL·E 3", cls: "tb" }, { label: "Browsing", cls: "" }],
    bannerCls: "bg-gpt",
    iconBg: "linear-gradient(135deg,#0ea874,#0a7a56)",
    iconSvg: `<svg width="26" height="26" viewBox="0 0 41 41" fill="white"><path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.211-3.773 10.079 10.079 0 0 0-11.745 4.449 9.96 9.96 0 0 0-6.75 4.811 10.08 10.08 0 0 0 1.234 11.814 9.961 9.961 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.211 3.773 10.079 10.079 0 0 0 11.745-4.449 9.962 9.962 0 0 0 6.75-4.811 10.079 10.079 0 0 0-1.234-11.814z"/></svg>`,
    badge: { label: "★ Most Popular", cls: "badge-gold" },
    featured: true,
    wide: true,
    cat: "ai",
    stars: 4.5,
  },
  {
    id: 2,
    name: "Claude Pro",
    brand: "Anthropic · 1 Month",
    price: "$20",
    per: "/ month",
    desc: "Claude Sonnet 4.6, 200k context window, Projects for long-running tasks, and extended thinking for deep reasoning.",
    tags: [{ label: "Sonnet 4.6", cls: "tg" }, { label: "Instant", cls: "tv" }, { label: "200k Context", cls: "" }],
    bannerCls: "bg-cla",
    iconBg: "linear-gradient(135deg,#c86e38,#a05828)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    badge: { label: "New", cls: "badge-new" },
    featured: true,
    cat: "ai",
    stars: 5,
  },
  {
    id: 3,
    name: "Gemini Advanced",
    brand: "Google · 1 Month",
    price: "$18",
    per: "was $20",
    desc: "Gemini Ultra model, 1TB Google Drive, deep Workspace integration, and powerful multimodal reasoning.",
    tags: [{ label: "Ultra Model", cls: "tb" }, { label: "Instant", cls: "tv" }, { label: "1TB Drive", cls: "" }],
    bannerCls: "bg-gem",
    iconBg: "linear-gradient(135deg,#1a6fe8,#0d4db8)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
    badge: { label: "−10%", cls: "badge-sale" },
    cat: "ai",
    stars: 4,
  },
  {
    id: 4,
    name: "SuperGrok",
    brand: "xAI · Monthly",
    price: "$30",
    per: "/ month",
    desc: "Grok-3, real-time X data access, image generation, massive context window, and unfiltered deep analysis.",
    tags: [{ label: "Grok-3", cls: "tg" }, { label: "Instant", cls: "tv" }, { label: "Real-time", cls: "" }],
    bannerCls: "bg-gro",
    iconBg: "linear-gradient(135deg,#a89c00,#7a7200)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    badge: null,
    cat: "ai",
    stars: 4.5,
  },
  {
    id: 5,
    name: "CapCut Pro",
    brand: "ByteDance · 1 Month",
    price: "$8",
    per: "/ month",
    desc: "4K watermark-free exports, AI background removal, premium effects, speed curves, and cloud sync.",
    tags: [{ label: "4K Export", cls: "tb" }, { label: "Instant", cls: "tv" }, { label: "No Watermark", cls: "" }],
    bannerCls: "bg-cap",
    iconBg: "linear-gradient(135deg,#005ce6,#0040a8)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="3"/><path d="m12 12 4.5 4.5M3 3l18 18"/></svg>`,
    badge: { label: "Hot 🔥", cls: "badge-hot" },
    cat: "creative",
    stars: 5,
  },
  {
    id: 6,
    name: "Copilot Pro",
    brand: "Microsoft · 1 Month",
    price: "$20",
    per: "/ month",
    desc: "GPT-4 Turbo embedded in Word, Excel, PowerPoint and Outlook with deep Microsoft 365 integration.",
    tags: [{ label: "Office 365", cls: "tb" }, { label: "Instant", cls: "tv" }, { label: "GPT-4", cls: "" }],
    bannerCls: "bg-cop",
    iconBg: "linear-gradient(135deg,#0070c0,#004e8c)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>`,
    badge: null,
    cat: "productivity",
    stars: 4,
  },
  {
    id: 7,
    name: "Midjourney Pro",
    brand: "Midjourney · 1 Month",
    price: "$60",
    per: "/ month",
    desc: "Unlimited fast generations, stealth mode, max quality upscaling, and full commercial use rights included.",
    tags: [{ label: "Unlimited", cls: "tg" }, { label: "Instant", cls: "tv" }, { label: "Commercial", cls: "tb" }],
    bannerCls: "bg-mid",
    iconBg: "linear-gradient(135deg,#2a3460,#1a2248)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a0b4ff" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg>`,
    badge: { label: "Premium", cls: "badge-gold" },
    featured: true,
    cat: "creative",
    stars: 5,
  },
  {
    id: 8,
    name: "Perplexity Pro",
    brand: "Perplexity AI · 1 Month",
    price: "$20",
    per: "/ month",
    desc: "Unlimited Pro searches, Claude & GPT-4 model switching, real-time web citations, and file analysis.",
    tags: [{ label: "Pro Search", cls: "tg" }, { label: "Instant", cls: "tv" }, { label: "Citations", cls: "" }],
    bannerCls: "bg-per",
    iconBg: "linear-gradient(135deg,#c0306a,#8c1e48)",
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    badge: null,
    cat: "ai",
    stars: 4.5,
  },
];

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "ai", label: "AI Assistants" },
  { key: "creative", label: "Creative Suite" },
  { key: "productivity", label: "Productivity" },
  { key: "social", label: "Social Media" },
  { key: "gaming", label: "Gaming" },
];

function StarRating({ value }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = i <= Math.floor(value);
        const half = !full && i - 0.5 <= value;
        return (
          <div
            key={i}
            style={{
              width: "11px", height: "11px",
              clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
              background: full
                ? "#d4a843"
                : half
                ? "linear-gradient(90deg,#d4a843 50%,rgba(212,168,67,.2) 50%)"
                : "rgba(212,168,67,.2)",
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

function ProductCard({ product, onBuy }) {
  const cardRef = useRef(null);
  const [wished, setWished] = useState(false);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "box-shadow .4s, border-color .4s";
    el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-6px) scale(1.01)`;
  };

  const handleMouseEnter = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.boxShadow = product.featured
      ? "0 28px 70px rgba(212,168,67,.22), 0 0 0 1px rgba(212,168,67,.2) inset"
      : "0 28px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(212,168,67,.1) inset";
    el.style.borderColor = product.featured
      ? "rgba(212,168,67,.55)"
      : "rgba(212,168,67,.35)";
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "all .55s cubic-bezier(.22,1,.36,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "";
    el.style.borderColor = "";
  };

  const cardClass = [
    "product-card",
    product.featured ? "card-feat" : "",
    product.wide ? "card-wide" : "",
  ].filter(Boolean).join(" ");

  return (
    <article
      ref={cardRef}
      className={cardClass}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-shine" />

      {/* Banner */}
      <div className="card-banner">
        <div className={`banner-bg ${product.bannerCls}`} />
        {product.badge && (
          <span className={`badge ${product.badge.cls}`}>{product.badge.label}</span>
        )}
        <div
          className="banner-icon"
          style={{ background: product.iconBg }}
          dangerouslySetInnerHTML={{ __html: product.iconSvg }}
        />
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-top">
          <div>
            <div className="card-name">{product.name}</div>
            <div className="card-brand">{product.brand}</div>
          </div>
          <div className="card-price">
            <div className="price-amt">{product.price}</div>
            <div className="price-per">{product.per}</div>
          </div>
        </div>

        <StarRating value={product.stars} />
        <p className="card-desc">{product.desc}</p>

        <div className="card-tags">
          {product.tags.map((t, i) => (
            <span key={i} className={`tag ${t.cls}`}>{t.label}</span>
          ))}
        </div>

        <div className="card-foot">
          <button className="btn-buy" onClick={() => onBuy(product)}>
            <span className="btn-sweep" />
            Buy Now
          </button>
          <button
            className={`btn-wish ${wished ? "loved" : ""}`}
            onClick={() => setWished((w) => !w)}
            aria-label="Wishlist"
          >
            <svg className="heart-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage({ userEmail }) {
  const router = useRouter();
  const [paymentModal, setPaymentModal] = useState({ open: false, product: null });
  const [activeTab, setActiveTab] = useState("all");
  const particlesRef = useRef(null);

  // Generate floating particles once on mount
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 2 + 1;
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px;height:${size}px;
        animation-duration:${Math.random() * 14 + 10}s;
        animation-delay:-${Math.random() * 20}s;
        opacity:${Math.random() * 0.5 + 0.1};
      `;
      container.appendChild(p);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "user_email=; path=/; max-age=0";
    router.push("/signin");
  };

  const handleBuyClick = (product) => {
    setPaymentModal({ open: true, product });
  };

  const filtered = PRODUCTS.filter(
    (p) => activeTab === "all" || p.cat === activeTab
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #05070d;
          --bg2: #090c15;
          --g1: #d4a843;
          --g2: #f2cc6e;
          --g3: #b8892a;
          --text: #f2ede3;
          --t2: rgba(242,237,227,.56);
          --t3: rgba(242,237,227,.28);
          --t4: rgba(242,237,227,.14);
          --bdr: rgba(255,255,255,.07);
          --bdrg: rgba(212,168,67,.28);
          --red: #ff7272;
          --green: #5ddc96;
          --blue: #70aaff;
        }

        html, body {
          background: var(--bg);
          font-family: 'Outfit', sans-serif;
          color: var(--text);
          overflow-x: hidden;
          min-height: 100%;
        }

        /* ── AMBIENT BACKGROUND ── */
        .ambient {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
        }
        .blob {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .b1 {
          width: 1000px; height: 1000px;
          background: radial-gradient(circle, rgba(212,168,67,.11) 0%, transparent 65%);
          top: -320px; right: -260px;
          animation: bd1 22s ease-in-out infinite alternate;
          filter: blur(80px);
        }
        .b2 {
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(50,80,220,.09) 0%, transparent 65%);
          bottom: -200px; left: -200px;
          animation: bd2 28s ease-in-out infinite alternate;
          filter: blur(80px);
        }
        .b3 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(212,168,67,.15) 0%, transparent 60%);
          top: 40%; left: 30%;
          animation: bd3 18s ease-in-out infinite alternate;
          filter: blur(60px);
        }
        .b4 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(80,160,255,.08) 0%, transparent 60%);
          top: 20%; left: 60%;
          animation: bd4 14s ease-in-out infinite alternate;
          filter: blur(50px);
        }
        @keyframes bd1 { from { transform: translate(0,0) scale(1); } to { transform: translate(50px,-40px) scale(1.08); } }
        @keyframes bd2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px,30px) scale(1.06); } }
        @keyframes bd3 { from { transform: translate(0,0); } to { transform: translate(-30px,20px); } }
        @keyframes bd4 { from { transform: translate(0,0); } to { transform: translate(20px,-15px); } }

        .gridlines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.016) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, black 10%, transparent 75%);
        }

        .sweep-wrap {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none;
        }
        .sweep-line {
          position: absolute; height: 1px; width: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(212,168,67,.18) 50%, transparent 100%);
          animation: swp 9s ease-in-out infinite;
        }
        .sweep-line:nth-child(1) { top: 18%; animation-delay: 0s; }
        .sweep-line:nth-child(2) { top: 52%; animation-delay: 3s; }
        .sweep-line:nth-child(3) { top: 81%; animation-delay: 6s; }
        @keyframes swp {
          0% { opacity: 0; transform: translateX(-110%); }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; transform: translateX(110%); }
        }

        .particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .particle {
          position: absolute; border-radius: 50%;
          background: var(--g1);
          animation: pfloat linear infinite;
        }
        @keyframes pfloat {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: .6; }
          90% { opacity: .2; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        /* ── HEADER ── */
        .page-header {
          position: sticky; top: 0; z-index: 200;
          height: 70px; padding: 0 56px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(5,7,13,.82);
          backdrop-filter: blur(28px) saturate(1.5);
          border-bottom: 1px solid var(--bdr);
          animation: slideDown .7s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Spinning conic logo */
        .logo { display: flex; align-items: center; gap: 12px; animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .1s both; }
        .logo-gem {
          width: 36px; height: 36px; border-radius: 11px;
          position: relative; overflow: hidden;
          border: 1px solid rgba(212,168,67,.35); cursor: pointer;
        }
        .logo-conic {
          position: absolute; inset: -60%; width: 220%; height: 220%;
          background: conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(212,168,67,.7) 70%, rgba(242,204,110,.9) 78%, rgba(212,168,67,.7) 86%, transparent 95%, transparent 100%);
          animation: conicSpin 3s linear infinite;
          transition: animation-duration .3s;
        }
        .logo-gem:hover .logo-conic { animation-duration: .5s; }
        @keyframes conicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .logo-inner {
          position: absolute; inset: 2px; border-radius: 8px;
          background: rgba(212,168,67,.1);
          display: flex; align-items: center; justify-content: center; z-index: 1;
        }
        .logo-star {
          width: 14px; height: 14px;
          background: var(--g1);
          clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
        }
        .logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 500;
          letter-spacing: 5px; text-transform: uppercase; color: var(--text);
        }

        .nav-links { display: flex; gap: 4px; animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .18s both; }
        .nav-btn {
          padding: 8px 16px; border-radius: 9px;
          font-size: 12.5px; font-weight: 500; letter-spacing: .4px;
          color: var(--t2); cursor: pointer; border: none; background: transparent;
          transition: all .22s;
        }
        .nav-btn:hover, .nav-btn.active { color: var(--text); background: rgba(255,255,255,.06); }
        .nav-btn.active { color: var(--g1); }

        .header-right { display: flex; align-items: center; gap: 10px; animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .26s both; }
        .balance-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 14px;
          background: rgba(212,168,67,.08); border: 1px solid rgba(212,168,67,.22);
          border-radius: 100px; font-size: 12.5px; font-weight: 500; color: var(--g1);
        }
        .balance-chip span { font-size: 10.5px; color: var(--t3); font-weight: 400; }

        .notif-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid var(--bdr); background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s; position: relative;
        }
        .notif-btn:hover { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.14); }
        .notif-dot {
          position: absolute; top: 7px; right: 7px;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--g1);
          animation: notifPulse 2s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(212,168,67,.5);
        }
        @keyframes notifPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,.5); }
          50% { box-shadow: 0 0 0 5px transparent; }
        }

        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--g3), var(--g1));
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 700; color: #05070d; cursor: pointer;
          border: 2px solid rgba(212,168,67,.32); transition: all .22s; letter-spacing: .5px;
        }
        .avatar:hover { border-color: var(--g1); box-shadow: 0 0 0 4px rgba(212,168,67,.12); }

        .logout-btn {
          padding: 7px 16px; border-radius: 9px;
          border: 1px solid var(--bdr); background: transparent; cursor: pointer;
          font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--t2); transition: all .22s; font-family: 'Outfit', sans-serif;
        }
        .logout-btn:hover {
          border-color: rgba(255,114,114,.35);
          color: var(--red);
          background: rgba(255,114,114,.07);
        }

        /* ── MAIN ── */
        .page-main {
          position: relative; z-index: 1;
          max-width: 1300px; margin: 0 auto;
          padding: 0 56px 80px;
        }

        /* ── HERO ── */
        .hero { padding: 72px 0 60px; text-align: center; animation: fadeUp .9s cubic-bezier(.22,1,.36,1) .2s both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px 5px 8px;
          background: rgba(212,168,67,.07); border: 1px solid rgba(212,168,67,.22);
          border-radius: 100px; margin-bottom: 26px;
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--g1);
          animation: pulseDot 2.2s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(212,168,67,.4);
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,.4); }
          50% { box-shadow: 0 0 0 6px transparent; }
        }
        .badge-text {
          font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
          text-transform: uppercase; color: var(--g1);
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5.5vw, 70px);
          font-weight: 400; line-height: 1.07; letter-spacing: -1px;
          color: var(--text); margin-bottom: 18px;
        }
        .gold-shimmer {
          background: linear-gradient(110deg, var(--g3) 0%, var(--g1) 25%, var(--g2) 50%, var(--g1) 75%, var(--g3) 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmerAnim 4s ease-in-out infinite;
        }
        @keyframes shimmerAnim {
          0% { background-position: 0%; }
          50% { background-position: 100%; }
          100% { background-position: 0%; }
        }

        .hero-sub {
          font-size: 16px; color: var(--t2); line-height: 1.78;
          max-width: 480px; margin: 0 auto 40px; font-weight: 300;
        }

        .hero-stats { display: flex; justify-content: center; align-items: center; gap: 40px; }
        .stat { text-align: center; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 500; line-height: 1; color: var(--g1);
        }
        .stat-label { font-size: 10.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); margin-top: 4px; }
        .stat-div { width: 1px; height: 44px; background: var(--bdr); }

        /* ── SECTION ── */
        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 26px; padding-bottom: 18px; border-bottom: 1px solid var(--bdr);
        }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: var(--text); }
        .section-sub { font-size: 11px; color: var(--t3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }
        .section-more {
          font-size: 11.5px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--g1); opacity: .7; cursor: pointer; border: none; background: none;
          font-family: 'Outfit', sans-serif; transition: all .2s; padding: 0;
        }
        .section-more:hover { opacity: 1; transform: translateX(3px); }

        /* ── TABS ── */
        .tabs { display: flex; gap: 7px; margin-bottom: 30px; flex-wrap: wrap; }
        .tab {
          padding: 8px 20px; border-radius: 100px;
          font-size: 12px; font-weight: 500; letter-spacing: .5px;
          cursor: pointer; border: 1px solid var(--bdr);
          background: transparent; color: var(--t3);
          font-family: 'Outfit', sans-serif;
          transition: all .25s cubic-bezier(.22,1,.36,1);
        }
        .tab:hover { border-color: rgba(212,168,67,.3); color: var(--t2); background: rgba(255,255,255,.04); }
        .tab.active { background: rgba(212,168,67,.12); border-color: rgba(212,168,67,.42); color: var(--g1); box-shadow: 0 0 20px rgba(212,168,67,.12); }

        /* ── PRODUCTS GRID ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(295px, 1fr));
          gap: 20px;
        }

        /* ── PRODUCT CARD ── */
        .product-card {
          position: relative;
          background: var(--bg2); border: 1px solid var(--bdr); border-radius: 22px;
          overflow: hidden; cursor: pointer;
          transform-style: preserve-3d;
          transition: box-shadow .4s, border-color .4s;
          animation: cardIn .65s cubic-bezier(.22,1,.36,1) both;
          will-change: transform;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .product-card:nth-child(1) { animation-delay: .35s; }
        .product-card:nth-child(2) { animation-delay: .43s; }
        .product-card:nth-child(3) { animation-delay: .51s; }
        .product-card:nth-child(4) { animation-delay: .59s; }
        .product-card:nth-child(5) { animation-delay: .67s; }
        .product-card:nth-child(6) { animation-delay: .75s; }
        .product-card:nth-child(7) { animation-delay: .83s; }
        .product-card:nth-child(8) { animation-delay: .91s; }

        .card-feat {
          border-color: rgba(212,168,67,.3);
          background: linear-gradient(155deg, rgba(212,168,67,.06) 0%, var(--bg2) 55%);
          box-shadow: 0 6px 30px rgba(212,168,67,.1);
        }
        .card-wide { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,2fr); }

        .card-shine {
          position: absolute; inset: 0; pointer-events: none; z-index: 2; opacity: 0;
          transition: opacity .4s;
          background: radial-gradient(ellipse 70% 50% at 50% -10%, rgba(212,168,67,.12), transparent);
        }
        .product-card:hover .card-shine { opacity: 1; }

        /* Banner */
        .card-banner {
          height: 118px; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .card-wide .card-banner { height: 100%; min-height: 190px; }

        .banner-bg {
          position: absolute; inset: 0;
          transition: transform .6s cubic-bezier(.22,1,.36,1);
        }
        .product-card:hover .banner-bg { transform: scale(1.1); }

        .banner-icon {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
          box-shadow: 0 8px 28px rgba(0,0,0,.45);
          transition: transform .4s cubic-bezier(.22,1,.36,1);
        }
        .product-card:hover .banner-icon { transform: translateY(-4px) scale(1.06); }

        /* Badges */
        .badge {
          position: absolute; z-index: 4; border-radius: 100px;
          font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 4px 11px;
        }
        .badge-gold { top: 13px; right: 13px; background: linear-gradient(110deg,var(--g3),var(--g1)); color: #05070d; }
        .badge-sale { top: 13px; left: 13px; background: rgba(93,220,150,.14); border: 1px solid rgba(93,220,150,.32); color: var(--green); }
        .badge-hot { top: 13px; left: 13px; background: rgba(255,114,114,.12); border: 1px solid rgba(255,114,114,.28); color: var(--red); }
        .badge-new { top: 13px; right: 13px; background: rgba(112,170,255,.12); border: 1px solid rgba(112,170,255,.28); color: var(--blue); }

        /* Banner color presets */
        .bg-gpt { background: linear-gradient(135deg,#081e12 0%,#0b3a20 50%,#0a4028 100%); }
        .bg-cla { background: linear-gradient(135deg,#160d1e 0%,#25133a 50%,#311a4d 100%); }
        .bg-gem { background: linear-gradient(135deg,#091430 0%,#0c1e48 50%,#142258 100%); }
        .bg-gro { background: linear-gradient(135deg,#111008 0%,#211f0a 50%,#2a2810 100%); }
        .bg-cap { background: linear-gradient(135deg,#080f1a 0%,#0d1c38 50%,#142248 100%); }
        .bg-cop { background: linear-gradient(135deg,#091228 0%,#111c4e 50%,#162260 100%); }
        .bg-mid { background: linear-gradient(135deg,#060810 0%,#0d1128 50%,#141832 100%); }
        .bg-per { background: linear-gradient(135deg,#1a0a10 0%,#2d1020 50%,#3c152a 100%); }

        /* Card body */
        .card-body { padding: 20px 22px 22px; }
        .card-wide .card-body { padding: 26px 28px; }

        .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 9px; }
        .card-name { font-size: 16px; font-weight: 600; color: var(--text); line-height: 1.2; }
        .card-brand { font-size: 11px; color: var(--t3); font-weight: 400; margin-top: 3px; }
        .card-price { text-align: right; flex-shrink: 0; }
        .price-amt {
          font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500; line-height: 1;
          background: linear-gradient(135deg,var(--g1),var(--g2));
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .price-per { font-size: 10px; color: var(--t3); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

        .card-desc { font-size: 12.5px; color: var(--t2); line-height: 1.65; margin-bottom: 15px; font-weight: 300; }

        .card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 17px; }
        .tag { font-size: 9.5px; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; border: 1px solid var(--bdr); color: var(--t3); font-weight: 500; }
        .tg { border-color: rgba(212,168,67,.28); color: var(--g1); background: rgba(212,168,67,.06); }
        .tv { border-color: rgba(93,220,150,.22); color: var(--green); background: rgba(93,220,150,.05); }
        .tb { border-color: rgba(112,170,255,.22); color: var(--blue); background: rgba(112,170,255,.05); }

        /* Footer buttons */
        .card-foot { display: flex; gap: 9px; align-items: center; }

        /* Buy button with shimmer sweep */
        .btn-buy {
          flex: 1; height: 44px; border: none; border-radius: 13px;
          font-size: 11.5px; font-weight: 700; font-family: 'Outfit', sans-serif;
          letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
          position: relative; overflow: hidden; color: #05070d;
          background: linear-gradient(110deg,var(--g3) 0%,var(--g1) 35%,var(--g2) 60%,var(--g1) 80%,var(--g3) 100%);
          background-size: 280% 100%; background-position: 0%;
          transition: transform .22s, box-shadow .25s, background-position .65s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 4px 18px rgba(212,168,67,.2);
        }
        .btn-sweep {
          position: absolute; top: 0; left: -100%; width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          transition: left .55s ease; pointer-events: none; display: block;
        }
        .btn-buy:hover .btn-sweep { left: 130%; }
        .btn-buy:hover { transform: translateY(-2px); box-shadow: 0 10px 38px rgba(212,168,67,.38); background-position: 100%; }
        .btn-buy:active { transform: scale(0.97); }

        /* Wish button */
        .btn-wish {
          width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px;
          border: 1px solid var(--bdr); background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .25s cubic-bezier(.22,1,.36,1);
        }
        .btn-wish:hover { border-color: rgba(255,114,114,.35); background: rgba(255,114,114,.07); }
        .heart-icon {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          stroke: var(--t3); stroke-width: 1.6; fill: none;
        }
        .btn-wish.loved { border-color: rgba(255,114,114,.4); background: rgba(255,114,114,.1); }
        .btn-wish.loved .heart-icon { stroke: var(--red); fill: var(--red); transform: scale(1.25); }

        /* Wide card max button width */
        .card-wide .btn-buy { max-width: 185px; }

        /* ── FOOTER ── */
        .page-footer {
          position: relative; z-index: 1;
          padding: 24px 56px;
          border-top: 1px solid var(--bdr);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(5,7,13,.7); backdrop-filter: blur(16px);
        }
        .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 15px; letter-spacing: 4px; text-transform: uppercase; color: var(--t3); }
        .footer-links { display: flex; gap: 22px; }
        .footer-links a { font-size: 11.5px; color: var(--t3); text-decoration: none; transition: color .2s; }
        .footer-links a:hover { color: var(--g1); }
        .footer-copy { font-size: 11px; color: var(--t4); }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: rgba(212,168,67,.2); border-radius: 10px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .page-header, .page-main, .page-footer { padding-left: 22px; padding-right: 22px; }
          .nav-links { display: none; }
          .hero-stats .stat-div { display: none; }
          .hero-stats { gap: 22px; }
          .products-grid { grid-template-columns: 1fr 1fr; }
          .card-wide { grid-template-columns: 1fr; }
          .card-wide .card-banner { height: 120px; }
        }
        @media (max-width: 540px) {
          .products-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 36px; }
        }
      `}</style>

      {/* Ambient Background */}
      <div className="ambient">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
        <div className="gridlines" />
        <div className="sweep-wrap">
          <div className="sweep-line" />
          <div className="sweep-line" />
          <div className="sweep-line" />
        </div>
        <div className="particles" ref={particlesRef} />
      </div>

      {/* Header */}
      <header className="page-header">
        <div className="logo">
          <div className="logo-gem">
            <div className="logo-conic" />
            <div className="logo-inner">
              <div className="logo-star" />
            </div>
          </div>
          <span className="logo-name">Aurum</span>
        </div>

        <nav className="nav-links">
          {["Store", "AI Tools", "Credits", "History", "Support"].map((item, i) => (
            <button key={item} className={`nav-btn${i === 0 ? " active" : ""}`}>{item}</button>
          ))}
        </nav>

        <div className="header-right">
         
          <button className="notif-btn" aria-label="Notifications">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,227,.55)" strokeWidth="1.6" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="notif-dot" />
          </button>
          <div className="avatar">
            {userEmail ? userEmail.slice(0, 2).toUpperCase() : "JD"}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main */}
      <main className="page-main">

        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">
            <div className="badge-dot" />
            <span className="badge-text">Premium Digital Marketplace</span>
          </div>
          <h1 className="hero-title">
            Access the World&apos;s Finest<br />
            <span className="gold-shimmer">AI &amp; Creative Tools</span>
          </h1>
          <p className="hero-sub">
            Instant top-ups for every major platform. Secure, fast, and always at the best rates.
          </p>
          <div className="hero-stats">
         {[["50+", "Products"], ["2s", "Delivery"], ["100%", "Secure"], ["24/7", "Support"]].map(([num, lbl], i, arr) => (
  <div className="stat" key={lbl}>
    <div className="stat-num">{num}</div>
    <div className="stat-label">{lbl}</div>
  </div>
))}
          </div>
        </section>

        {/* Tabs */}
        <div className="tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`tab${activeTab === cat.key ? " active" : ""}`}
              onClick={() => setActiveTab(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Section */}
        <div style={{ marginBottom: "44px" }}>
          <div className="section-header">
            <div>
              <div className="section-title">Featured Products</div>
              <div className="section-sub">Best value · Instant delivery</div>
            </div>
            <button className="section-more">View all →</button>
          </div>

          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuyClick} />
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="page-footer">
        <div className="footer-brand">Aurum</div>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
          <a href="#">API</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-copy">© 2026 Aurum · All rights reserved</div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, product: null })}
        product={paymentModal.product}
        user={{ email: userEmail }}
      />
    </>
  );
}
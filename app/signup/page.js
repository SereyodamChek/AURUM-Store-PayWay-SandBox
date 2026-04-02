"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fieldValues, setFieldValues] = useState({ name: false, email: false, password: false });
  const cardRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      cardRef.current.style.setProperty("--rx", `${dy * 3}deg`);
      cardRef.current.style.setProperty("--ry", `${-dx * 3}deg`);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFieldValues((fv) => ({ ...fv, [field]: value.length > 0 }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/signin");
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const progress = Object.values(fieldValues).filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #07090e;
          --surface: #0c0f16;
          --surface2: #111520;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.13);
          --gold: #c9a84c;
          --gold2: #ecd07e;
          --gold-dim: rgba(201,168,76,0.18);
          --gold-trace: rgba(201,168,76,0.06);
          --text: #ede9e0;
          --text2: rgba(237,233,224,0.48);
          --text3: rgba(237,233,224,0.26);
          --success: #6fcf97;
          --error: #ff6b6b;
          --error-bg: rgba(255,107,107,0.07);
        }

        html, body { height: 100%; overflow-x: hidden; }

        /* ═══════════════════════════ PAGE SHELL ═══════════════════════════ */
        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', -apple-system, sans-serif;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }

        /* global noise */
        .page::after {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 100;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          opacity: 0.55;
          mix-blend-mode: overlay;
        }

        /* ═══════════════════════════ LEFT PANEL ═══════════════════════════ */
        .left {
          position: relative;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 52px 60px;
          overflow: hidden;
          z-index: 1;
        }

        /* ambient orbs */
        .left-orb1 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.14) 0%, rgba(201,168,76,0.04) 40%, transparent 70%);
          top: -200px; left: -200px;
          animation: orbDrift1 12s ease-in-out infinite alternate;
        }
        .left-orb2 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(80,100,220,0.12) 0%, transparent 70%);
          bottom: -100px; right: -50px;
          animation: orbDrift2 16s ease-in-out infinite alternate;
        }
        @keyframes orbDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,30px) scale(1.1); } }
        @keyframes orbDrift2 { from { transform: translate(0,0); } to { transform: translate(-30px,-40px) scale(1.08); } }

        /* sweeping lines */
        .sweep-lines { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .sweep-line {
          position: absolute; height: 1px; width: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%);
          opacity: 0;
          animation: sweepAnim 7s ease-in-out infinite;
        }
        .sweep-line:nth-child(1) { top: 22%; animation-delay: 0s; }
        .sweep-line:nth-child(2) { top: 50%; animation-delay: 2.3s; }
        .sweep-line:nth-child(3) { top: 78%; animation-delay: 4.6s; }
        @keyframes sweepAnim {
          0%   { opacity: 0; transform: translateX(-100%); }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(100%); }
        }

        /* right edge separator */
        .left::after {
          content: '';
          position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent 0%, var(--gold) 30%, rgba(201,168,76,0.25) 75%, transparent 100%);
          opacity: 0.3;
        }

        /* giant decorative glyph */
        .deco-glyph {
          position: absolute;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(220px, 28vw, 400px); font-weight: 300;
          line-height: 1; user-select: none; pointer-events: none;
          right: -30px; bottom: 60px;
          color: transparent;
          -webkit-text-stroke: 1px rgba(201,168,76,0.07);
          animation: glyphFloat 14s ease-in-out infinite alternate;
        }
        @keyframes glyphFloat {
          from { transform: translateY(0) rotate(-3deg); }
          to   { transform: translateY(-30px) rotate(3deg); }
        }

        /* brand */
        .brand {
          position: relative; z-index: 2;
          opacity: 0; transform: translateY(-14px);
          animation: fadeSlide 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
        }
        .brand-row { display: flex; align-items: center; gap: 12px; }
        .brand-gem {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.07);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .brand-gem::before {
          content: '';
          position: absolute; inset: 4px;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 6px;
        }
        .brand-gem svg { width: 16px; height: 16px; stroke: var(--gold); fill: none; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase;
          color: var(--text);
        }

        /* main copy */
        .left-body { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0; }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.22);
          border-radius: 100px; padding: 6px 14px;
          font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold);
          width: fit-content; margin-bottom: 30px;
          opacity: 0; animation: fadeSlide 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
        }
        .badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--gold);
          animation: dotPulse 2.2s ease-in-out infinite;
        }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.6)} }

        .left-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 4.2vw, 66px); font-weight: 400;
          line-height: 1.08; letter-spacing: -1px;
          color: var(--text); margin-bottom: 22px;
          opacity: 0; animation: fadeSlide 0.75s cubic-bezier(0.22,1,0.36,1) 0.45s forwards;
        }
        .left-heading em {
          font-style: italic;
          background: linear-gradient(120deg, var(--gold) 0%, var(--gold2) 55%, var(--gold) 100%);
          background-size: 200%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: goldShimmer 4s ease-in-out infinite alternate;
        }
        @keyframes goldShimmer { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }

        .left-desc {
          font-size: 14px; line-height: 1.8; color: var(--text2);
          max-width: 340px;
          opacity: 0; animation: fadeSlide 0.75s cubic-bezier(0.22,1,0.36,1) 0.6s forwards;
        }

        .stats-row {
          display: flex; gap: 36px; margin-top: 48px;
          opacity: 0; animation: fadeSlide 0.75s cubic-bezier(0.22,1,0.36,1) 0.75s forwards;
        }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px; font-weight: 500;
          background: linear-gradient(135deg, var(--gold), var(--gold2));
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .stat-lbl { font-size: 10.5px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 3px; }

        /* testimonial */
        .testi-wrap {
          position: relative; z-index: 2;
          opacity: 0; animation: fadeSlide 0.75s cubic-bezier(0.22,1,0.36,1) 0.9s forwards;
        }
        .testi {
          padding: 22px 26px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 16px; position: relative; overflow: hidden;
        }
        .testi::before {
          content: '"'; position: absolute;
          top: -14px; left: 18px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 90px; color: var(--gold); opacity: 0.12; line-height: 1;
          pointer-events: none;
        }
        .testi-text { font-size: 13px; line-height: 1.7; color: var(--text2); margin-bottom: 16px; position: relative; }
        .testi-author { display: flex; align-items: center; gap: 11px; }
        .testi-av {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, var(--gold) 0%, rgba(201,168,76,0.35) 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #07090e; letter-spacing: 0.5px;
        }
        .testi-name { font-size: 12.5px; color: var(--text); font-weight: 500; }
        .testi-role { font-size: 11px; color: var(--text3); margin-top: 1px; }

        /* ═══════════════════════════ RIGHT PANEL ═══════════════════════════ */
        .right {
          position: relative; z-index: 1;
          background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 60px;
        }
        .right::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 50% at 85% 15%, rgba(201,168,76,0.055) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(80,100,220,0.045) 0%, transparent 65%);
          pointer-events: none;
        }

        .form-shell {
          width: 100%; max-width: 430px;
          position: relative; z-index: 2;
          perspective: 1200px;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
          --rx: 0deg; --ry: 0deg;
        }
        .form-shell.mounted {
          opacity: 1;
          transform: translateY(0) rotateX(var(--rx)) rotateY(var(--ry));
        }

        /* progress */
        .prog-section {
          margin-bottom: 34px;
          opacity: 0; animation: fadeSlide 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s forwards;
        }
        .prog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .prog-title { font-size: 10.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); }
        .prog-pct { font-size: 11px; color: var(--gold); font-weight: 500; letter-spacing: 0.5px; }
        .prog-track { height: 2px; background: var(--border); border-radius: 100px; position: relative; overflow: visible; }
        .prog-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, var(--gold), var(--gold2));
          transition: width 0.65s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
        }
        .prog-fill::after {
          content: '';
          position: absolute; right: -3px; top: 50%;
          transform: translateY(-50%);
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gold2);
          box-shadow: 0 0 10px var(--gold), 0 0 20px rgba(201,168,76,0.4);
          transition: opacity 0.4s;
        }

        /* heading */
        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px; font-weight: 400; letter-spacing: -0.5px; line-height: 1.1;
          color: var(--text); margin-bottom: 8px;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.25s forwards;
        }
        .form-title span {
          background: linear-gradient(120deg, var(--gold), var(--gold2));
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .form-sub {
          font-size: 13.5px; color: var(--text2); line-height: 1.6; margin-bottom: 30px;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
        }

        /* socials */
        .social-btns {
          display: flex; gap: 10px; margin-bottom: 22px;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.42s forwards;
        }
        .soc-btn {
          flex: 1; padding: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; font-weight: 500; font-family: inherit; color: var(--text);
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, background 0.3s, transform 0.2s, box-shadow 0.3s;
        }
        .soc-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.07), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .soc-btn:hover {
          border-color: rgba(201,168,76,0.28);
          background: rgba(255,255,255,0.07);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.35);
        }
        .soc-btn:hover::before { opacity: 1; }
        .soc-btn:active { transform: scale(0.97); }
        .soc-btn svg { width: 16px; height: 16px; flex-shrink: 0; transition: transform 0.2s; }
        .soc-btn:hover svg { transform: scale(1.08); }

        /* divider */
        .div-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 24px;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.49s forwards;
        }
        .div-line { flex: 1; height: 1px; background: var(--border); }
        .div-txt { font-size: 10.5px; color: var(--text3); letter-spacing: 2.5px; text-transform: uppercase; }

        /* field */
        .field {
          margin-bottom: 14px;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .field:nth-of-type(1) { animation-delay: 0.54s; }
        .field:nth-of-type(2) { animation-delay: 0.61s; }
        .field:nth-of-type(3) { animation-delay: 0.68s; }

        .field-lbl {
          display: block;
          font-size: 10.5px; letter-spacing: 1.8px; text-transform: uppercase;
          color: var(--text3); margin-bottom: 8px;
          transition: color 0.25s;
        }
        .field.f-focused .field-lbl,
        .field.f-filled  .field-lbl { color: var(--gold); }

        .field-row {
          position: relative; display: flex; align-items: center;
        }
        /* border layer */
        .field-row::before {
          content: ''; position: absolute; inset: 0; border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.028);
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          pointer-events: none; z-index: 0;
        }
        .field.f-focused .field-row::before {
          border-color: rgba(201,168,76,0.45);
          background: rgba(201,168,76,0.035);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.09), 0 6px 24px rgba(0,0,0,0.22);
        }
        .field.f-filled:not(.f-focused) .field-row::before {
          border-color: rgba(201,168,76,0.18);
        }
        /* shimmer sweep */
        .field-row::after {
          content: ''; position: absolute; inset: 0;
          border-radius: 12px; pointer-events: none; z-index: 1;
          background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.055) 50%, transparent 100%);
          opacity: 0; transform: translateX(-100%);
          transition: opacity 0.2s;
        }
        .field.f-focused .field-row::after {
          opacity: 1;
          animation: fieldShimmer 1.8s ease-in-out infinite;
        }
        @keyframes fieldShimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }

        .field-ico {
          position: relative; z-index: 2;
          padding: 0 11px 0 15px; flex-shrink: 0;
          display: flex; align-items: center;
          color: var(--text3);
          transition: color 0.3s;
        }
        .field.f-focused .field-ico,
        .field.f-filled  .field-ico { color: var(--gold); }
        .field-ico svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

        input.f-input {
          flex: 1; position: relative; z-index: 2;
          background: transparent; border: none; outline: none;
          padding: 14px 6px;
          font-size: 14.5px; font-family: inherit; font-weight: 400;
          color: var(--text); letter-spacing: 0.1px;
          -webkit-font-smoothing: antialiased;
        }
        input.f-input::placeholder { color: var(--text3); }
        input.f-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0c0f16 inset;
          -webkit-text-fill-color: var(--text);
        }

        .field-tick {
          position: relative; z-index: 2;
          padding: 0 14px 0 4px; flex-shrink: 0;
          display: flex; align-items: center;
        }
        .tick-ring {
          width: 19px; height: 19px; border-radius: 50%;
          border: 1.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .field.f-filled .tick-ring {
          border-color: var(--success);
          background: rgba(111,207,151,0.12);
          transform: scale(1.12);
        }
        .tick-ring svg {
          width: 9px; height: 9px;
          stroke: var(--success); fill: none; stroke-width: 2.5;
          stroke-linecap: round; stroke-linejoin: round;
          opacity: 0; transform: scale(0) rotate(-45deg);
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.05s;
        }
        .field.f-filled .tick-ring svg { opacity: 1; transform: scale(1) rotate(0deg); }

        .eye-toggle {
          position: relative; z-index: 2;
          padding: 0 14px 0 4px;
          background: none; border: none; cursor: pointer;
          color: var(--text3); display: flex; align-items: center;
          transition: color 0.2s;
        }
        .eye-toggle:hover { color: var(--gold); }
        .eye-toggle svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

        /* error */
        .err-msg {
          display: flex; align-items: center; gap: 9px;
          background: var(--error-bg); border: 1px solid rgba(255,107,107,0.18);
          border-radius: 10px; padding: 11px 14px;
          margin-bottom: 14px;
          font-size: 13px; color: var(--error);
          animation: errPop 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .err-msg svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
        @keyframes errPop {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* CTA */
        .cta-block {
          margin-top: 8px;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.78s forwards;
        }
        .cta {
          width: 100%; padding: 15.5px;
          border: none; border-radius: 12px;
          font-size: 13px; font-weight: 500; font-family: inherit;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; position: relative; overflow: hidden;
          background: linear-gradient(110deg, #b8922c 0%, var(--gold) 35%, var(--gold2) 60%, var(--gold) 80%, #b8922c 100%);
          background-size: 250% 100%; background-position: 0% 0%;
          color: #07090e;
          box-shadow: 0 4px 28px rgba(201,168,76,0.28), 0 1px 0 rgba(255,255,255,0.28) inset;
          transition: transform 0.2s, box-shadow 0.2s, background-position 0.6s;
        }
        .cta::before {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0.55s ease;
        }
        .cta:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(201,168,76,0.38), 0 1px 0 rgba(255,255,255,0.28) inset;
          background-position: 100% 0%;
        }
        .cta:hover:not(:disabled)::before { left: 120%; }
        .cta:active:not(:disabled) { transform: scale(0.98); }
        .cta:disabled { opacity: 0.55; cursor: default; }
        .cta-inner { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(7,9,14,0.22);
          border-top-color: #07090e;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* footer */
        .terms-txt {
          margin-top: 14px; text-align: center;
          font-size: 11.5px; color: var(--text3); line-height: 1.6;
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.88s forwards;
        }
        .terms-txt a { color: var(--gold); text-decoration: none; transition: opacity 0.2s; }
        .terms-txt a:hover { opacity: 0.7; }

        .signin-txt {
          margin-top: 24px; padding-top: 24px;
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 13px; color: var(--text2);
          opacity: 0; animation: fadeSlide 0.65s cubic-bezier(0.22,1,0.36,1) 0.96s forwards;
        }
        .signin-lnk {
          color: var(--gold); text-decoration: none; font-weight: 500;
          position: relative;
        }
        .signin-lnk::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1px; background: var(--gold);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .signin-lnk:hover::after { transform: scaleX(1); }

        /* ═══════════════════════════ ANIM ═══════════════════════════ */
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════ MOBILE ═══════════════════════════ */
        @media (max-width: 768px) {
          .page { grid-template-columns: 1fr; }
          .left { display: none; }
          .right { padding: 40px 24px; min-height: 100vh; align-items: flex-start; padding-top: 56px; }
          .form-shell { max-width: 100%; }
          .form-title { font-size: 34px; }
          .social-btns { gap: 8px; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .left  { padding: 44px 40px; }
          .right { padding: 44px 40px; }
          .left-heading { font-size: 44px; }
        }
      `}</style>

      <div className="page">

        {/* ══ LEFT ══ */}
        <div className="left">
          <div className="left-orb1" /><div className="left-orb2" />
          <div className="sweep-lines"><div /><div /><div /></div>
          <div className="deco-glyph">∞</div>

          <div className="brand">
            <div className="brand-row">
              <div className="brand-gem">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span className="brand-name">Aurum</span>
            </div>
          </div>

          <div className="left-body">
            <div className="badge"><span className="badge-dot" />Exclusive Access</div>
            <h2 className="left-heading">Elevate your<br /><em>digital</em><br />presence.</h2>
            <p className="left-desc">
              Join a curated community of creators, builders, and visionaries who demand only the finest experience.
            </p>
            <div className="stats-row">
              <div><div className="stat-num">12K+</div><div className="stat-lbl">Members</div></div>
              <div><div className="stat-num">99.9%</div><div className="stat-lbl">Uptime</div></div>
              <div><div className="stat-num">4.9 ★</div><div className="stat-lbl">Rating</div></div>
            </div>
          </div>

          <div className="testi-wrap">
            <div className="testi">
              <p className="testi-text">"The most refined product experience I've encountered. It feels like it was crafted personally for me."</p>
              <div className="testi-author">
                <div className="testi-av">SR</div>
                <div>
                  <div className="testi-name">Sofia Reyes</div>
                  <div className="testi-role">Creative Director, Studio Lux</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="right">
          <div ref={cardRef} className={`form-shell ${mounted ? "mounted" : ""}`}>

            {/* progress */}
            <div className="prog-section">
              <div className="prog-header">
                <span className="prog-title">Profile Setup</span>
                <span className="prog-pct">{Math.round((progress / 3) * 100)}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${(progress / 3) * 100}%` }} />
              </div>
            </div>

            <h1 className="form-title">Create your<br /><span>account.</span></h1>
            <p className="form-sub">Start your journey — it only takes a minute.</p>

            {/* socials */}
            <div className="social-btns">
              <button type="button" className="soc-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.22.15-2.19 1.28-2.17 3.82.03 3.02 2.65 4.03 2.68 4.04zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
              <button type="button" className="soc-btn">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="soc-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
                X
              </button>
            </div>

            <div className="div-row">
              <div className="div-line" /><span className="div-txt">or continue with email</span><div className="div-line" />
            </div>

            {/* name */}
            <div className={`field${focused === "name" ? " f-focused" : ""}${fieldValues.name ? " f-filled" : ""}`}>
              <label className="field-lbl">Full Name</label>
              <div className="field-row">
                <div className="field-ico">
                  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input className="f-input" type="text" placeholder="Your full name"
                  value={form.name}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                  onChange={(e) => handleChange("name", e.target.value)} autoComplete="name" />
                <div className="field-tick">
                  <div className="tick-ring">
                    <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* email */}
            <div className={`field${focused === "email" ? " f-focused" : ""}${fieldValues.email ? " f-filled" : ""}`}>
              <label className="field-lbl">Email Address</label>
              <div className="field-row">
                <div className="field-ico">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input className="f-input" type="email" placeholder="you@example.com"
                  value={form.email}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  onChange={(e) => handleChange("email", e.target.value)} autoComplete="email" />
                <div className="field-tick">
                  <div className="tick-ring">
                    <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* password */}
            <div className={`field${focused === "password" ? " f-focused" : ""}${fieldValues.password ? " f-filled" : ""}`}>
              <label className="field-lbl">Password</label>
              <div className="field-row">
                <div className="field-ico">
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input className="f-input" type={showPass ? "text" : "password"} placeholder="Create a strong password"
                  value={form.password}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  onChange={(e) => handleChange("password", e.target.value)} autoComplete="new-password" />
                <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass
                    ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="err-msg">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="cta-block">
              <button type="button" disabled={loading} onClick={handleSubmit} className="cta">
                <div className="cta-inner">
                  {loading && <div className="spinner" />}
                  {loading ? "Creating Account…" : "Create Account"}
                </div>
              </button>
            </div>

            <p className="terms-txt">
              By continuing you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>
            </p>

            <div className="signin-txt">
              Already a member?{" "}
              <Link href="/signin" className="signin-lnk">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
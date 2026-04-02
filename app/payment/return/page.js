// app/payment/return/page.js
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Loading fallback component for Suspense
function PaymentLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 48px; height: 48px; border: 3px solid rgba(201,168,76,0.3);
          border-top-color: #c9a84c; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
      <div className="spinner"></div>
    </div>
  );
}

// Main content component that uses searchParams
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    
    if (paymentStatus) {
      setStatus(paymentStatus);
    } else {
      // Default status if none provided
      setStatus("pending");
    }
  }, [searchParams]);

  const orderId = searchParams.get("order_id") || "Unknown";

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --gold: #c9a84c; --gold2: #ecd07e; --text: #ede9e0;
          --text2: rgba(237,233,224,0.48); --success: #6fcf97; --error: #ff6b6b;
        }
        .result-card {
          background: #0c0f16; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 40px; max-width: 420px; width: 100%;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        }
        .result-icon {
          width: 72px; height: 72px; border-radius: 50%;
          margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;
        }
        .result-icon.success {
          background: rgba(111,207,151,0.12); border: 2px solid var(--success);
        }
        .result-icon.failed {
          background: rgba(255,107,107,0.12); border: 2px solid var(--error);
        }
        .result-icon svg { width: 32px; height: 32px; }
        .result-icon.success svg { stroke: var(--success); }
        .result-icon.failed svg { stroke: var(--error); }
        .result-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; color: var(--text); margin-bottom: 8px;
        }
        .result-desc {
          font-size: 14px; color: var(--text2); margin-bottom: 28px;
        }
        .result-order {
          font-size: 12px; color: var(--gold);
          background: rgba(201,168,76,0.08);
          padding: 8px 16px; border-radius: 100px;
          display: inline-block; margin-bottom: 24px;
        }
        .result-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(110deg, #b8922c, var(--gold), var(--gold2));
          border: none; border-radius: 14px;
          font-size: 12px; font-weight: 500; letter-spacing: 2px;
          text-transform: uppercase; color: #07090e;
          cursor: pointer; transition: transform 0.2s;
        }
        .result-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div className="result-card">
        {status === "loading" && (
          <>
            <div className="result-icon" style={{border:'2px solid var(--gold)',background:'rgba(201,168,76,0.12)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 className="result-title">Processing...</h2>
            <p className="result-desc">Verifying your payment status</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="result-icon success">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="result-title">Payment Successful!</h2>
            <p className="result-desc">Your order has been confirmed and will be delivered instantly.</p>
            <div className="result-order">Order: {orderId}</div>
            <button 
              className="result-btn" 
              onClick={() => router.push("/home")}
            >
              Return to Dashboard
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="result-icon failed">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <h2 className="result-title">Payment Failed</h2>
            <p className="result-desc">Something went wrong. Please try again or contact support.</p>
            <div className="result-order">Order: {orderId}</div>
            <button 
              className="result-btn"
              onClick={() => router.push("/home")}
            >
              Try Again
            </button>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="result-icon" style={{border:'2px solid var(--gold)',background:'rgba(201,168,76,0.12)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 className="result-title">Payment Pending</h2>
            <p className="result-desc">Your payment is being processed. You'll receive a confirmation shortly.</p>
            <div className="result-order">Order: {orderId}</div>
            <Link href="/home" className="result-btn" style={{display:'block',textAlign:'center',textDecoration:'none'}}>
              Return to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// Main Page export with Suspense wrapper
export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
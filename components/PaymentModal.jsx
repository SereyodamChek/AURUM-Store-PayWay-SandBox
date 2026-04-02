// components/PaymentModal.jsx
"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

export default function PaymentModal({ isOpen, onClose, product }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select"); // select → processing
  const [actionUrl, setActionUrl] = useState("");
  const [paywayFields, setPaywayFields] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handlePayWay = async () => {
    setLoading(true);
    setStep("processing");

    try {
      let priceValue =
        typeof product.price === "number"
          ? product.price.toFixed(2)
          : parseFloat(product.price.replace("$", ""));

      if (!priceValue || priceValue <= 0) {
        throw new Error("Invalid price");
      }

      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          title: product.title,
          price: priceValue.toString(),
          description: product.desc || product.title,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Payment failed");
      }

      console.log("🚀 PayWay data:", data);

      if (data.action && data.fields) {
        setActionUrl(data.action);
        setPaywayFields(data.fields);

        // Wait a tick for React to render the form, then open ABA modal
        setTimeout(() => {
          if (window.AbaPayway && isScriptLoaded) {
            window.AbaPayway.checkout();
          } else {
            document.getElementById("aba_merchant_request")?.submit();
          }
        }, 500);
      } else {
        throw new Error("Failed to initialize PayWay checkout");
      }

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message);
      setStep("select");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Load jQuery first (Required by ABA PayWay) */}
      <Script
        src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"
        strategy="afterInteractive"
      />
      {/* Load ABA PayWay Script */}
      <Script
        src="https://checkout.payway.com.kh/plugins/checkout2-0.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <style jsx>{`
        .payment-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(8, 27, 55, 0.53);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .payment-modal {
          width: 100%;
          max-width: 440px;
          background: #05070d;
          border-radius: 24px;
          padding: 0;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          background: linear-gradient(135deg, #d4a843, #b8892a);
          padding: 32px 32px 28px;
          position: relative;
          overflow: hidden;
        }

        .modal-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
          border-radius: 50%;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: white;
          font-size: 20px;
          z-index: 2;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .product-icon {
          width: 72px;
          height: 72px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 36px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .modal-body {
          padding: 32px;
          background: #05070d;
        }

        .features-list {
          background: rgba(212, 168, 67, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }

        .feature-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #d4a843, #b8892a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          flex-shrink: 0;
        }

        .pay-btn {
          background: linear-gradient(135deg, #d4a843, #b8892a);
          color: white;
          border: none;
          padding: 18px 32px;
          border-radius: 16px;
          width: 100%;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 4px 14px rgba(212, 168, 67, 0.4),
            0 0 0 0 rgba(212, 168, 67, 0.5);
          position: relative;
          overflow: hidden;
        }

        .pay-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .pay-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .pay-btn:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 24px rgba(212, 168, 67, 0.5),
            0 0 0 4px rgba(212, 168, 67, 0.1);
        }

        .pay-btn:active {
          transform: translateY(0);
        }

        .pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .processing-state {
          text-align: center;
          padding: 40px 0;
        }

        .processing-spinner {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          position: relative;
        }

        .processing-spinner::before,
        .processing-spinner::after {
          content: '';
          position: absolute;
          border-radius: 50%;
        }

        .processing-spinner::before {
          inset: 0;
          border: 4px solid rgba(212, 168, 67, 0.2);
        }

        .processing-spinner::after {
          inset: 0;
          border: 4px solid transparent;
          border-top-color: #d4a843;
          border-right-color: #d4a843;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        @media (max-width: 480px) {
          .payment-modal {
            max-width: 100%;
            margin: 0 16px;
          }
          
          .modal-header {
            padding: 24px 24px 20px;
          }

          .modal-body {
            padding: 24px;
          }
        }
      `}</style>

      <div className="payment-overlay" onClick={onClose}>
        <div className="payment-modal" onClick={(e) => e.stopPropagation()}>

          {/* SELECT STEP */}
          {step === "select" && (
            <>
              <div className="modal-header">
                <button className="close-btn" onClick={onClose} aria-label="Close">
                  ✕
                </button>
                <div className="product-icon"><i className="fi fi-sr-marketplace-store"></i></div>
                <h3 style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 700,
                  margin: '0 0 8px',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {product?.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  margin: 0
                }}>
                  Complete your purchase
                </p>
              </div>

              <div className="modal-body">
                {/* Price Section */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#697386',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}>
                    Total Amount
                  </div>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #d4a843, #f2cc6e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1
                  }}>
                    ${parseFloat(product?.price?.toString().replace("$", "") || "0").toFixed(2)}
                  </div>
                </div>

                {/* Features List */}
                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-icon"><i className="fi fi-sr-check"></i></div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', transition: 'color 0.3s ease' }}>
                      Instant digital delivery
                    </span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon"><i className="fi fi-sr-check"></i></div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', transition: 'color 0.3s ease' }}>
                      Secure payment gateway
                    </span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon"><i className="fi fi-sr-check"></i></div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', transition: 'color 0.3s ease' }}>
                      24/7 customer support
                    </span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  disabled={loading}
                  className="pay-btn"
                  onClick={handlePayWay}
                >
                  <span className="btn-content">
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span><i className="fi fi-sr-lock"></i></span>
                        <span>Confirm & Pay</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Secure Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  color: '#697386',
                  fontSize: '13px'
                }}>
                  <span style={{ color: '#d4a843' }}><i className="fi fi-sr-shield"></i></span>
                  <span>Secured by ABA PayWay</span>
                </div>
              </div>
            </>
          )}

          {/* PROCESSING STEP */}
          {step === "processing" && (
            <div className="modal-body">
              <div className="processing-state">
                <div className="processing-spinner"></div>
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '8px',
                  transition: 'color 0.3s ease'
                }}>
                  Connecting to Bank
                </h4>
                <p style={{
                  color: '#697386',
                  fontSize: '14px',
                  margin: 0
                }}>
                  Please wait while we securely process your payment...
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* HIDDEN PAYWAY FORM */}
      {paywayFields && (
        <form method="POST" target="aba_webservice" action={actionUrl} id="aba_merchant_request" style={{ display: 'none' }}>
          {Object.entries(paywayFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </>
  );
}